import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import { build } from "esbuild";

type BundleSizeEntry = {
  minified: number;
  gzipped: number;
};

type BundleSizeManifest = {
  generatedAt: string;
  components: Record<string, BundleSizeEntry>;
};

/**
 * Global externals that are always excluded from bundle size measurement.
 * These are peer/host dependencies that consumers will already have.
 */
const GLOBAL_EXTERNALS = [
  "react",
  "react-dom",
  "react/jsx-runtime",
  "react/jsx-dev-runtime",
  "next",
  "next/*",
];

const COMPONENTS_DIR = join(
  import.meta.dirname,
  "..",
  "packages",
  "smoothui",
  "components"
);
const OUTPUT_PATH = join(
  import.meta.dirname,
  "..",
  "apps",
  "docs",
  "lib",
  "generated",
  "bundle-sizes.json"
);

const getComponentDirs = (): string[] => {
  const entries = readdirSync(COMPONENTS_DIR, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
};

const getExternalsForComponent = (componentDir: string): string[] => {
  const packageJsonPath = join(componentDir, "package.json");
  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
    const deps = packageJson.dependencies || {};

    // Mark all dependencies as external EXCEPT @repo/* workspace packages
    // (those get bundled to measure true component size including smoothui internal deps)
    const externals = Object.keys(deps).filter(
      (dep) => !dep.startsWith("@repo")
    );

    return [...GLOBAL_EXTERNALS, ...externals];
  } catch {
    return [...GLOBAL_EXTERNALS];
  }
};

const calculateComponentSize = async (
  componentName: string
): Promise<BundleSizeEntry | null> => {
  const componentDir = join(COMPONENTS_DIR, componentName);
  const entryPoint = join(componentDir, "index.tsx");

  // Check that the entry point exists
  try {
    statSync(entryPoint);
  } catch {
    console.warn(`  Skipping ${componentName}: no index.tsx found`);
    return null;
  }

  const externals = getExternalsForComponent(componentDir);

  try {
    const result = await build({
      entryPoints: [entryPoint],
      bundle: true,
      write: false,
      format: "esm",
      minify: true,
      platform: "browser",
      target: "es2020",
      jsx: "automatic",
      external: externals,
      // Resolve workspace @repo/* packages by looking in the packages dir
      alias: {
        "@repo/shadcn-ui": join(
          import.meta.dirname,
          "..",
          "packages",
          "shadcn-ui"
        ),
        "@repo/shadcn-ui/lib/utils": join(
          import.meta.dirname,
          "..",
          "packages",
          "shadcn-ui",
          "lib",
          "utils.ts"
        ),
      },
      // Allow resolving from the component's own directory and the monorepo
      resolveExtensions: [".tsx", ".ts", ".jsx", ".js"],
      loader: {
        ".css": "empty",
      },
      logLevel: "silent",
    });

    const outputCode = result.outputFiles[0]?.contents;
    if (!outputCode) {
      console.warn(`  Skipping ${componentName}: esbuild produced no output`);
      return null;
    }

    const minifiedSize = outputCode.length;
    const gzippedSize = gzipSync(outputCode, { level: 9 }).length;

    return { minified: minifiedSize, gzipped: gzippedSize };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`  Failed to bundle ${componentName}: ${message}`);
    return null;
  }
};

const main = async () => {
  console.log("Calculating bundle sizes for SmoothUI components...\n");

  const componentDirs = getComponentDirs();
  console.log(`Found ${componentDirs.length} component directories.\n`);

  const manifest: BundleSizeManifest = {
    generatedAt: new Date().toISOString(),
    components: {},
  };

  let successCount = 0;
  let failCount = 0;

  for (const componentName of componentDirs) {
    const size = await calculateComponentSize(componentName);
    if (size) {
      manifest.components[componentName] = size;
      const gzipKb = (size.gzipped / 1024).toFixed(1);
      console.log(`  ${componentName}: ${gzipKb} kB (gzipped)`);
      successCount++;
    } else {
      failCount++;
    }
  }

  writeFileSync(OUTPUT_PATH, JSON.stringify(manifest, null, 2), "utf-8");

  console.log(
    `\nDone! ${successCount} components measured, ${failCount} skipped.`
  );
  console.log(`Manifest written to: ${OUTPUT_PATH}`);
};

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
