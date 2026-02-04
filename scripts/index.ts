import { add } from "./commands/add.js";
import { list } from "./commands/list.js";
import { error, header } from "./utils/colors.js";

const args = process.argv.slice(2);
const command = args[0];

function printHelp(): void {
  header();
  console.log("Usage: npx smoothui <command> [options]");
  console.log();
  console.log("Commands:");
  console.log("  add [components...]   Add components to your project");
  console.log("  list                  List available components");
  console.log();
  console.log("Options:");
  console.log("  --path <path>         Custom component install path");
  console.log(
    "  --force               Overwrite existing files without asking"
  );
  console.log("  --json                Output as JSON (list command)");
  console.log("  --help                Show this help message");
  console.log();
  console.log("Examples:");
  console.log("  npx smoothui add siri-orb");
  console.log("  npx smoothui add siri-orb grid-loader");
  console.log("  npx smoothui add                         # Interactive mode");
  console.log("  npx smoothui list");
}

async function main(): Promise<void> {
  try {
    if (!command || command === "--help" || command === "-h") {
      printHelp();
      return;
    }

    if (command === "add") {
      const componentArgs: string[] = [];
      let path: string | undefined;
      let force = false;

      for (let i = 1; i < args.length; i++) {
        const arg = args[i];
        if (arg === "--path" && args[i + 1]) {
          path = args[i + 1];
          i++;
        } else if (arg === "--force" || arg === "-f") {
          force = true;
        } else if (!arg.startsWith("-")) {
          componentArgs.push(arg);
        }
      }

      await add(componentArgs, { path, force });
      return;
    }

    if (command === "list" || command === "ls") {
      const json = args.includes("--json");
      await list({ json });
      return;
    }

    error(`Unknown command: ${command}`);
    printHelp();
    process.exit(1);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    error(msg || "An unknown error occurred");
    process.exit(1);
  }
}

main();
