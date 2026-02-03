import { CATEGORIES } from "../constants.js";
import { active, bar, bold, dim, done, header } from "../utils/colors.js";
import { getAvailableComponents } from "../utils/registry.js";

interface ListOptions {
  json?: boolean;
}

export async function list(options: ListOptions): Promise<void> {
  const components = await getAvailableComponents();

  if (options.json) {
    console.log(JSON.stringify(components, null, 2));
    return;
  }

  header();
  active(`Available components (${components.length})`);
  bar();

  // Group by category
  const byCategory = new Map<string, string[]>();

  for (const name of components) {
    let category = "Other";
    for (const [cat, catComponents] of Object.entries(CATEGORIES)) {
      if (catComponents.includes(name)) {
        category = cat;
        break;
      }
    }

    const existing = byCategory.get(category);
    if (existing) {
      existing.push(name);
    } else {
      byCategory.set(category, [name]);
    }
  }

  for (const [category, categoryComponents] of byCategory) {
    bar(bold(dim(category)));
    for (const name of categoryComponents.sort()) {
      bar(`  ${name}`);
    }
    bar();
  }

  done(`Use ${dim("npx smoothui add <component>")} to install`);
}
