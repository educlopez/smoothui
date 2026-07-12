// CI regression check for the shadcn registry output:
// 1. No workspace import specifiers may leak into served file content.
// 2. Every served item (components, blocks, libs, themes) must satisfy the
//    shadcn registry-item schema.
import { registryItemSchema } from "shadcn/schema";
import { getAllPackageNames, getPackage } from "../lib/package";
import { getSkill, SKILL_ITEM_NAME } from "../lib/registry-skill";
import { getAllThemeNames, getTheme } from "../lib/registry-themes";

// Match workspace specifiers only inside import/export/require statements so
// doc comments mentioning package names don't trip the check.
const LEAK_REGEX =
  /(?:from\s+|import\s*\(\s*|require\s*\(\s*)["'](?:@repo\/|@smoothui\/data|(?:\.\.\/){2,})/;

const names = await getAllPackageNames();
let leaks = 0;
let schemaErrors = 0;

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

  for (const file of item.files ?? []) {
    const lines = (file.content ?? "").split("\n");
    for (const [i, line] of lines.entries()) {
      if (LEAK_REGEX.test(line)) {
        leaks++;
        console.log(`LEAK ${name} ${file.path}:${i + 1} ${line.trim()}`);
      }
    }
  }
}

const themeNames = getAllThemeNames();
for (const themeName of themeNames) {
  validateSchema(themeName, getTheme(themeName));
}

validateSchema(SKILL_ITEM_NAME, await getSkill());

console.log(
  `Items: ${names.length} packages + ${themeNames.length} themes + skill, leaks: ${leaks}, schema errors: ${schemaErrors}`
);
process.exit(leaks || schemaErrors ? 1 : 0);
