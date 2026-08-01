// CI regression check for the shadcn registry output:
// 1. No workspace import specifiers may leak into served file content.
// 2. Every served item (components, blocks, libs, themes) must satisfy the
//    shadcn registry-item schema.
// 3. Every sibling import in served content must resolve to a file the same
//    item actually ships. header-1 and header-4 imported "./hero-grid.module.css"
//    for months while the registry folded every .css into the `css` field and
//    shipped neither, so both blocks failed to build the moment anyone
//    installed them.
// 4. Every SmoothUI-only colour token an item reads must be declared by the
//    tokens item, and the item must depend on it. Otherwise the token resolves
//    to nothing in the installer's project.
import { registryItemSchema } from "shadcn/schema";
import { getAllPackageNames, getPackage } from "../lib/package";
import { getSkill, SKILL_ITEM_NAME } from "../lib/registry-skill";
import { getAllThemeNames, getTheme } from "../lib/registry-themes";
import {
  collectUsedTokens,
  DECLARED_TOKENS,
  getTokensItem,
  TOKENS_ITEM_NAME,
} from "../lib/registry-tokens";

// Match workspace specifiers only inside import/export/require statements so
// doc comments mentioning package names don't trip the check.
const LEAK_REGEX =
  /(?:from\s+|import\s*\(\s*|require\s*\(\s*)["'](?:@repo\/|@smoothui\/data|(?:\.\.\/){2,})/;

// Sibling imports only ("./x"). Parent-relative ones are either rewritten to an
// alias or already caught as a leak by LEAK_REGEX.
const SIBLING_IMPORT_REGEX =
  /(?:from\s+|import\s*\(\s*|require\s*\(\s*)["'](\.\/[^"']+)["']/g;

const SIBLING_PREFIX_REGEX = /^\.\//;

// A TS sibling import may omit its extension or point at a directory barrel.
const resolutionCandidates = (specifier: string): string[] => {
  const base = specifier.replace(SIBLING_PREFIX_REGEX, "");
  return [
    base,
    ...[".ts", ".tsx", ".js", ".jsx"].flatMap((ext) => [
      `${base}${ext}`,
      `${base}/index${ext}`,
    ]),
  ];
};

// Raw `var(--color-x)` reads in shipped content. Anything that is not a stock
// shadcn token has to be declared by the tokens item, or it resolves to nothing
// in the installer's project.
const COLOR_VAR_REGEX = /var\(\s*--color-([a-z0-9-]+)\s*[,)]/g;

// Defined by `shadcn init` in every project, so they need no help from us.
const SHADCN_TOKENS = new Set([
  "accent",
  "accent-foreground",
  "background",
  "border",
  "card",
  "card-foreground",
  "destructive",
  "destructive-foreground",
  "foreground",
  "input",
  "muted",
  "muted-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "ring",
  "secondary",
  "secondary-foreground",
  ...[1, 2, 3, 4, 5].map((n) => `chart-${n}`),
  ...[
    "",
    "-foreground",
    "-primary",
    "-primary-foreground",
    "-accent",
    "-accent-foreground",
    "-border",
    "-ring",
  ].map((suffix) => `sidebar${suffix}`),
  // Tailwind's own palette and keywords, not design tokens.
  "white",
  "black",
  "transparent",
  "current",
]);

const declared = new Set(DECLARED_TOKENS);

const names = await getAllPackageNames();
let leaks = 0;
let schemaErrors = 0;
let unresolved = 0;
let undeclaredTokens = 0;
let missingTokenDeps = 0;

const validateSchema = (name: string, item: unknown) => {
  const result = registryItemSchema.safeParse(item);
  if (!result.success) {
    schemaErrors++;
    console.log(`SCHEMA ${name}: ${result.error.message}`);
  }
};

for (const name of names) {
  const item = await getPackage(name);

  // Empty items (no files, no css) are skipped by the registry index route,
  // so they don't need to validate.
  const isServed =
    (item.files?.length ?? 0) > 0 || Object.keys(item.css ?? {}).length > 0;
  if (isServed) {
    validateSchema(name, item);
  }

  const shipped = new Set((item.files ?? []).map((file) => file.path));

  for (const file of item.files ?? []) {
    const lines = (file.content ?? "").split("\n");
    for (const [i, line] of lines.entries()) {
      if (LEAK_REGEX.test(line)) {
        leaks++;
        console.log(`LEAK ${name} ${file.path}:${i + 1} ${line.trim()}`);
      }

      for (const [, specifier] of line.matchAll(SIBLING_IMPORT_REGEX)) {
        if (
          !resolutionCandidates(specifier).some((candidate) =>
            shipped.has(candidate)
          )
        ) {
          unresolved++;
          console.log(
            `UNRESOLVED ${name} ${file.path}:${i + 1} imports ${specifier}, which the item does not ship`
          );
        }
      }

      for (const [, token] of line.matchAll(COLOR_VAR_REGEX)) {
        if (!(SHADCN_TOKENS.has(token) || declared.has(token))) {
          undeclaredTokens++;
          console.log(
            `UNDECLARED-TOKEN ${name} ${file.path}:${i + 1} reads --color-${token}, which neither shadcn nor the tokens item defines`
          );
        }
      }
    }
  }

  const allContent = (item.files ?? []).map((file) => file.content).join("\n");
  const tokensDep = `/${TOKENS_ITEM_NAME}.json`;
  const dependsOnTokens = (item.registryDependencies ?? []).some((dep) =>
    dep.endsWith(tokensDep)
  );

  if (collectUsedTokens(allContent).length > 0 && !dependsOnTokens) {
    missingTokenDeps++;
    console.log(
      `MISSING-TOKENS-DEP ${name} uses SmoothUI tokens but does not depend on ${TOKENS_ITEM_NAME}.json`
    );
  }
}

validateSchema(TOKENS_ITEM_NAME, getTokensItem());

const themeNames = getAllThemeNames();
for (const themeName of themeNames) {
  validateSchema(themeName, getTheme(themeName));
}

validateSchema(SKILL_ITEM_NAME, await getSkill());

console.log(
  `Items: ${names.length} packages + ${themeNames.length} themes + tokens + skill, leaks: ${leaks}, schema errors: ${schemaErrors}, unresolved sibling imports: ${unresolved}, undeclared tokens: ${undeclaredTokens}, missing token deps: ${missingTokenDeps}`
);
process.exit(
  leaks || schemaErrors || unresolved || undeclaredTokens || missingTokenDeps
    ? 1
    : 0
);
