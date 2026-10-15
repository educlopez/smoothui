// Installs the Radix twins that historically imported a sibling `.base` file
// the registry did not ship, then typechecks the result. verify-install.mts
// covers the Base (default) payload; this covers `/r/radix-nova/{name}.json`
// for the twins that actually import local modules.
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { getPackage } from "../lib/package";

const require = createRequire(import.meta.url);

const VERSION_RANGE_REGEX = /(?<=.)@[^@]*$/;
const TS_ERROR_REGEX = /error TS\d+/;
const TYPECHECKED_FILE_REGEX = /\.[cm]?[jt]sx?$/;

const PACKAGES_ROOT = join(import.meta.dirname, "../../../packages");
const REPO_ROOT = join(import.meta.dirname, "../../..");
const PROJECT = join(import.meta.dirname, "..", ".radix-nova-install-check");

const RADIX_NOVA_ITEMS = [
  "smoothui/components/tabs",
  "smoothui/components/slider",
  "smoothui/components/toggle",
  "smoothui/components/toggle-group",
] as const;

// Twins import shared animation helpers via `@/components/smoothui/lib/...`,
// which a real shadcn install pulls in as a registry dependency.
const REGISTRY_DEPENDENCY_PACKAGES = ["smoothui/lib"] as const;

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
  "src/ambient.d.ts": 'declare module "@/components/ui/*";\n',
  "src/globals.d.ts":
    'declare module "*.module.css" {\n' +
    "  const classes: Record<string, string>;\n" +
    "  export default classes;\n" +
    "}\n" +
    'declare module "*.css";\n',
  "src/lib/utils.ts":
    'export const cn = (...inputs: unknown[]): string =>\n  inputs.filter(Boolean).join(" ");\n',
};

const resolveFrom = (specifier: string, roots: string[]): string | null => {
  try {
    const manifest = require.resolve(`${specifier}/package.json`, {
      paths: roots,
    });
    return dirname(manifest);
  } catch {
    try {
      return dirname(require.resolve(specifier, { paths: roots }));
    } catch {
      return null;
    }
  }
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
    const failure = error as {
      message?: string;
      stderr?: string;
      stdout?: string;
    };
    const output = `${failure.stdout ?? ""}${failure.stderr ?? ""}`;
    return {
      output: output || (failure.message ?? "Command failed with no output"),
      success: false,
    };
  }
};

const main = async () => {
  rmSync(PROJECT, { force: true, recursive: true });
  mkdirSync(PROJECT, { recursive: true });

  try {
    for (const [path, contents] of Object.entries(STUBS)) {
      const target = join(PROJECT, path);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, contents);
    }

    const files = new Set<string>([
      "src/globals.d.ts",
      "src/lib/utils.ts",
      "src/ambient.d.ts",
    ]);
    const mappings = new Map<string, string>();
    let written = 0;

    const packagesToInstall = [
      ...RADIX_NOVA_ITEMS.map((name) => ({
        name,
        style: "radix-nova" as const,
      })),
      ...REGISTRY_DEPENDENCY_PACKAGES.map((name) => ({
        name,
        style: null,
      })),
    ];

    for (const { name, style } of packagesToInstall) {
      const item = await getPackage(name, style);
      if (!item.files?.length) {
        throw new Error(`registry payload for ${name} shipped no files`);
      }

      const itemDir = join(PACKAGES_ROOT, name);
      const missing: string[] = [];
      const dependencies = (item.dependencies ?? [])
        .map((entry) => entry.replace(VERSION_RANGE_REGEX, ""))
        .sort();

      for (const dep of dependencies) {
        const local = resolveFrom(dep, [itemDir]);
        if (local) {
          mappings.set(dep, local);
          mappings.set(`${dep}/*`, join(local, "*"));
        } else {
          missing.push(dep);
        }
      }

      if (missing.length > 0) {
        throw new Error(
          `${name}: deps not installed in the workspace: ${missing.join(", ")}`
        );
      }

      for (const file of item.files) {
        const target = join(PROJECT, "src", file.target ?? file.path);
        mkdirSync(dirname(target), { recursive: true });
        writeFileSync(target, file.content ?? "");
        if (TYPECHECKED_FILE_REGEX.test(target)) {
          files.add(join("src", file.target ?? file.path));
        }
        written++;
      }

      const label = style
        ? `/r/${style}/${item.name}.json`
        : `/r/${item.name}.json`;
      console.log(`Installed ${label} (${item.files.length} files)`);
    }

    writeFileSync(
      join(PROJECT, "tsconfig.json"),
      JSON.stringify(
        {
          compilerOptions: {
            ...TSCONFIG.compilerOptions,
            paths: {
              ...TSCONFIG.compilerOptions.paths,
              ...Object.fromEntries(
                [...mappings.entries()].map(([pattern, target]) => [
                  pattern,
                  [target],
                ])
              ),
            },
          },
          files: [...files],
        },
        null,
        2
      )
    );

    console.log(
      `Wrote ${written} files from ${RADIX_NOVA_ITEMS.length} radix-nova items plus registry deps`
    );

    const tsc = join(REPO_ROOT, "node_modules/.bin/tsc");
    const result = run(tsc, ["--noEmit", "-p", "tsconfig.json"], PROJECT);
    const errors = result.output
      .split("\n")
      .filter((line) => TS_ERROR_REGEX.test(line));

    if (!result.success) {
      console.log("\nradix-nova install typecheck FAILED:");
      console.log(
        (errors.length > 0 ? errors : result.output.split("\n"))
          .slice(0, 40)
          .join("\n")
      );
      process.exitCode = 1;
      return;
    }

    console.log("Install typecheck clean");
  } finally {
    rmSync(PROJECT, { force: true, recursive: true });
  }
};

await main();
