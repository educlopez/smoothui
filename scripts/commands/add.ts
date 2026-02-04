import { confirm, isCancel, select, spinner } from "@clack/prompts";
import { CATEGORIES } from "../constants.js";
import { searchMultiselect } from "../prompts/search-multiselect.js";
import type { RegistryItem } from "../types.js";
import { active, bar, done, error, header, success } from "../utils/colors.js";
import { detectConfig } from "../utils/detect.js";
import { installDependencies, writeComponent } from "../utils/install.js";
import { getAvailableComponents } from "../utils/registry.js";
import {
  collectNpmDeps,
  flattenTree,
  printTree,
  resolveTree,
} from "../utils/tree.js";

interface AddOptions {
  path?: string;
  force?: boolean;
}

export async function add(
  componentNames: string[],
  options: AddOptions
): Promise<void> {
  header();

  // Detect project configuration
  const config = detectConfig();

  if (options.path) {
    config.componentPath = options.path;
  }

  done(`Detected: ${config.componentPath}/ (${config.packageManager})`);
  console.log();

  // If no components specified, show interactive picker
  let selectedComponents = componentNames;

  if (selectedComponents.length === 0) {
    const availableComponents = await getAvailableComponents();

    // Build items with categories
    const items = availableComponents.map((name) => {
      let category = "Other";
      for (const [cat, components] of Object.entries(CATEGORIES)) {
        if (components.includes(name)) {
          category = cat;
          break;
        }
      }
      return { value: name, label: name, category };
    });

    const selected = await searchMultiselect({
      message: "Select components to install:",
      items,
    });

    if (!selected || selected.length === 0) {
      console.log();
      done("No components selected.");
      return;
    }

    selectedComponents = selected;
    done(`Selected: ${selectedComponents.join(", ")}`);
    console.log();
  }

  // Resolve dependency trees
  active("Resolving dependencies...");
  bar();

  const allComponents: RegistryItem[] = [];
  const seen = new Set<string>();

  for (const name of selectedComponents) {
    try {
      const tree = await resolveTree(name, seen);
      const flat = flattenTree(tree);

      for (const item of flat) {
        if (!seen.has(item.name)) {
          seen.add(item.name);
          allComponents.push(item);
        }
      }

      printTree(tree);
    } catch (err) {
      error(`Failed to resolve ${name}: ${(err as Error).message}`);
      return;
    }
  }

  bar();

  // Collect npm dependencies
  const { dependencies, devDependencies } = collectNpmDeps(allComponents);
  const allDeps = [...dependencies, ...devDependencies];

  // Confirm installation
  const totalComponents = allComponents.length;
  const totalDeps = dependencies.length + devDependencies.length;

  const confirmMessage =
    totalDeps > 0
      ? `Install ${totalComponents} component${totalComponents > 1 ? "s" : ""} + ${totalDeps} npm package${totalDeps > 1 ? "s" : ""}?`
      : `Install ${totalComponents} component${totalComponents > 1 ? "s" : ""}?`;

  const confirmed = await confirm({
    message: confirmMessage,
  });

  if (isCancel(confirmed) || !confirmed) {
    done("Installation cancelled.");
    return;
  }

  console.log();

  // Write components
  let overwriteAll = options.force ?? false;

  for (const item of allComponents) {
    const { written, skipped } = await writeComponent(
      item,
      config,
      overwriteAll,
      async (filename) => {
        const action = await select({
          message: `File exists: ${filename}`,
          options: [
            { value: "overwrite", label: "Overwrite" },
            { value: "skip", label: "Skip" },
            { value: "all", label: "Overwrite all" },
          ],
        });

        if (isCancel(action)) {
          return "skip";
        }

        if (action === "all") {
          overwriteAll = true;
        }

        return action as "overwrite" | "skip" | "all";
      }
    );

    for (const file of written) {
      done(`Written: ${config.componentPath}/${file}`);
    }

    for (const file of skipped) {
      done(`Skipped: ${file}`);
    }
  }

  // Install npm dependencies
  if (dependencies.length > 0 || devDependencies.length > 0) {
    const loadingSpinner = spinner();
    loadingSpinner.start(`Installing ${allDeps.join(", ")}`);

    const installed = installDependencies(
      dependencies,
      devDependencies,
      config.packageManager
    );

    if (installed) {
      loadingSpinner.stop(`Installed: ${allDeps.join(", ")}`);
    } else {
      loadingSpinner.stop("Failed to install dependencies");
      if (dependencies.length > 0) {
        bar(
          `Run manually: ${config.packageManager} add ${dependencies.join(" ")}`
        );
      }
      if (devDependencies.length > 0) {
        const devFlag = config.packageManager === "bun" ? "-d" : "-D";
        bar(
          `Run manually: ${config.packageManager} add ${devFlag} ${devDependencies.join(" ")}`
        );
      }
    }
  }

  console.log();
  success(
    `Done! ${totalComponents} component${totalComponents > 1 ? "s" : ""} installed.`
  );
}
