// Installs registry items into a throwaway project and typechecks the result,
// the way shadcn/ui's templates workflow scaffolds a real app rather than
// trusting that the payload it serves would have compiled.
//
// verify-registry.mts reasons about the payload; this compiles it, and they are
// deliberately not redundant. That one catches structure — a file imported but
// not shipped, a token nothing defines. This one catches whatever only a
// compiler sees: a rewritten import that lands nowhere, a prop type that stopped
// lining up, an export the barrel no longer has.
//
// It does not catch a missing CSS module: `*.module.css` is declared ambiently
// below, so an absent one still typechecks. That is verify-registry's job.
//
// No network and no dev server: the items are built in-process by getPackage()
// and written straight to disk with their registry targets, so this runs in CI
// as a plain script.
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { getAllPackageNames, getPackage } from "../lib/package";

const require = createRequire(import.meta.url);

// Strips a version range from a dependency spec: "is-even@3.0.0" -> "is-even".
const VERSION_RANGE_REGEX = /(?<=.)@[^@]*$/;
const TS_ERROR_REGEX = /error TS\d+/;
const TYPECHECKED_FILE_REGEX = /\.[cm]?[jt]sx?$/;

const PACKAGES_ROOT = join(import.meta.dirname, "../../../packages");

// Every component and block is its own pnpm workspace package, so a dependency
// like react-tweet or gsap is installed under that package rather than hoisted.
// Resolve from the item's own directory and hand tsc a path mapping so it can
// follow. Resolving from apps/docs is not reliable here: tsx can see packages in
// pnpm's virtual store that the scratch project's plain tsc cannot import.
const resolveFrom = (specifier: string, roots: string[]): string | null => {
  try {
    const manifest = require.resolve(`${specifier}/package.json`, {
      paths: roots,
    });
    return dirname(manifest);
  } catch {
    try {
      // Some packages do not export ./package.json; fall back to the entry.
      return dirname(require.resolve(specifier, { paths: roots }));
    } catch {
      return null;
    }
  }
};

const REPO_ROOT = join(import.meta.dirname, "../../..");

const TSCONFIG = {
  compilerOptions: {
    allowJs: true,
    baseUrl: ".",
    esModuleInterop: true,
    jsx: "preserve",
    lib: ["dom", "dom.iterable", "esnext"],
    module: "esnext",
    moduleResolution: "bundler",
    noEmit: true,
    // The shadcn components an item imports are ambient `any` here, so callbacks
    // typed through them cannot infer. Strictness over our own source is the job
    // of `pnpm typecheck`; this run is about whether the payload resolves and
    // compiles at all.
    noImplicitAny: false,
    paths: { "@/*": ["./src/*"] },
    resolveJsonModule: true,
    skipLibCheck: true,
    strict: true,
    target: "es2017",
  },
  include: ["src/**/*.ts", "src/**/*.tsx", "src/**/*.d.ts"],
};

const STUBS = {
  "src/globals.d.ts":
    'declare module "*.module.css" {\n' +
    "  const classes: Record<string, string>;\n" +
    "  export default classes;\n" +
    "}\n" +
    'declare module "*.css";\n',
  // Anything the registry expects from a shadcn project but does not ship.
  "src/lib/utils.ts":
    'export const cn = (...inputs: unknown[]): string =>\n  inputs.filter(Boolean).join(" ");\n',
};

interface RunResult {
  output: string;
  success: boolean;
}

const run = (command: string, args: string[], cwd: string): RunResult => {
  try {
    return {
      output: execFileSync(command, args, {
        cwd,
        encoding: "utf8",
        stdio: "pipe",
      }),
      success: true,
    };
  } catch (error) {
    const failure = error as { stdout?: string; stderr?: string };
    return {
      output: `${failure.stdout ?? ""}${failure.stderr ?? ""}`,
      success: false,
    };
  }
};

// Scratch project lives inside apps/docs, not in tmp, so ordinary node
// resolution walks up and finds its node_modules. It has to be apps/docs
// specifically: pnpm does not hoist, so the repo root has none of react, motion
// or lucide-react, and apps/docs is the only workspace carrying all of them.
const PROJECT = join(import.meta.dirname, "..", ".install-check");

interface PathMapping {
  item: string;
  target: string;
}

interface TypecheckGroup {
  files: Set<string>;
  items: string[];
  mappings: Map<string, PathMapping>;
}

const addPathMapping = (
  mappings: Map<string, PathMapping>,
  pattern: string,
  target: string,
  item: string
): void => {
  const existing = mappings.get(pattern);
  if (existing && existing.target !== target) {
    throw new Error(
      `Conflicting path mapping for "${pattern}": ` +
        `"${existing.item}" resolves to "${existing.target}", ` +
        `but "${item}" resolves to "${target}"`
    );
  }
  if (!existing) {
    mappings.set(pattern, { item, target });
  }
};

const mappingsAreCompatible = (
  left: Map<string, PathMapping>,
  right: Map<string, PathMapping>
): boolean => {
  for (const [pattern, mapping] of right) {
    const existing = left.get(pattern);
    if (existing && existing.target !== mapping.target) {
      return false;
    }
  }
  return true;
};

const assignTypecheckGroup = (
  groups: TypecheckGroup[],
  item: string,
  files: string[],
  mappings: Map<string, PathMapping>
): void => {
  let group = groups.find((candidate) =>
    mappingsAreCompatible(candidate.mappings, mappings)
  );
  if (!group) {
    group = { files: new Set(), items: [], mappings: new Map() };
    groups.push(group);
  }

  for (const [pattern, mapping] of mappings) {
    addPathMapping(group.mappings, pattern, mapping.target, item);
  }
  for (const file of files) {
    group.files.add(file);
  }
  group.items.push(item);
};

const main = async () => {
  const project = PROJECT;
  rmSync(project, { force: true, recursive: true });
  mkdirSync(project, { recursive: true });
  let written = 0;
  let items = 0;
  const skipped: string[] = [];
  const typecheckGroups: TypecheckGroup[] = [];

  try {
    for (const [path, contents] of Object.entries(STUBS)) {
      const target = join(project, path);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, contents);
    }

    const packageNames = await getAllPackageNames();
    packageNames.sort((left, right) => left.localeCompare(right));

    for (const name of packageNames) {
      const item = await getPackage(name);
      if (!item.files?.length) {
        continue;
      }
      // An item whose declared npm dependencies cannot be found at all is
      // skipped rather than stubbed: a shorthand ambient declaration turns their
      // types into `any`, which silently downgrades the very errors this exists
      // to find, and on a component that imports types rather than values it
      // invents new ones. Better to check less and mean it, and say out loud
      // what was skipped.
      const itemDir = join(PACKAGES_ROOT, name);
      const itemFiles: string[] = [];
      const itemMappings = new Map<string, PathMapping>();
      const missing: string[] = [];

      const dependencies = (item.dependencies ?? [])
        .map((entry) => entry.replace(VERSION_RANGE_REGEX, ""))
        .sort();
      for (const dep of dependencies) {
        const local = resolveFrom(dep, [itemDir]);
        if (local) {
          addPathMapping(itemMappings, dep, local, name);
          addPathMapping(itemMappings, `${dep}/*`, join(local, "*"), name);
        } else {
          missing.push(dep);
        }
      }

      if (missing.length > 0) {
        skipped.push(`${name} (${missing.join(", ")})`);
        continue;
      }

      items++;

      for (const file of item.files) {
        // `target` is where the CLI would put it in a real project.
        const target = join(project, "src", file.target ?? file.path);
        mkdirSync(dirname(target), { recursive: true });
        writeFileSync(target, file.content ?? "");
        if (TYPECHECKED_FILE_REGEX.test(target)) {
          itemFiles.push(join("src", file.target ?? file.path));
        }
        written++;
      }
      assignTypecheckGroup(typecheckGroups, name, itemFiles, itemMappings);
    }

    // shadcn's own components arrive through registryDependencies and are not in
    // this scratch project. A shorthand ambient declaration types every import
    // from them as `any`, named ones included, which is the one stub worth
    // making: the installer really will have them.
    writeFileSync(
      join(project, "src/ambient.d.ts"),
      'declare module "@/components/ui/*";\n'
    );

    console.log(`Wrote ${written} files from ${items} items`);
    if (skipped.length > 0) {
      console.error(
        `Skipped ${skipped.length} items whose deps are not installed in the workspace:`
      );
      for (const entry of skipped) {
        console.error(`  ${entry}`);
      }
      throw new Error(
        "Install verification must cover every registry item with files"
      );
    }

    console.log(
      `Typechecking ${items} items in ${typecheckGroups.length} dependency-compatible groups`
    );
    const tsc = join(REPO_ROOT, "node_modules/.bin/tsc");
    let errorCount = 0;
    let failedGroups = 0;
    for (const [index, group] of typecheckGroups.entries()) {
      const configName = `tsconfig.group-${index + 1}.json`;
      writeFileSync(
        join(project, configName),
        JSON.stringify(
          {
            compilerOptions: {
              ...TSCONFIG.compilerOptions,
              paths: {
                ...TSCONFIG.compilerOptions.paths,
                ...Object.fromEntries(
                  [...group.mappings.entries()].map(([pattern, mapping]) => [
                    pattern,
                    [mapping.target],
                  ])
                ),
              },
            },
            files: [
              "src/globals.d.ts",
              "src/lib/utils.ts",
              "src/ambient.d.ts",
              ...group.files,
            ],
          },
          null,
          2
        )
      );

      const result = run(tsc, ["--noEmit", "-p", configName], project);
      const errors = result.output
        .split("\n")
        .filter((line) => TS_ERROR_REGEX.test(line));
      errorCount += errors.length;
      if (!result.success) {
        failedGroups++;
        console.log(`\nGroup ${index + 1} FAILED (${group.items.join(", ")}):`);
        console.log(
          (errors.length > 0 ? errors : result.output.split("\n"))
            .slice(0, 40)
            .join("\n")
        );
      }
    }

    if (failedGroups > 0) {
      console.log(
        `\nInstall typecheck FAILED: ${errorCount} TypeScript errors across ${failedGroups} groups`
      );
      process.exitCode = 1;
      return;
    }

    console.log("Install typecheck clean");
  } finally {
    rmSync(project, { force: true, recursive: true });
  }
};

await main();
