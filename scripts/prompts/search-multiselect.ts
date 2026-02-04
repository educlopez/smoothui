import { createInterface, emitKeypressEvents, type Key } from "node:readline";
import { Writable } from "node:stream";
import pc from "picocolors";

// Silent writable stream to prevent readline from echoing input
const silentOutput = new Writable({
  write(_chunk, _encoding, callback) {
    callback();
  },
});

export interface SearchItem {
  value: string;
  label: string;
  hint?: string;
}

export interface SearchMultiselectOptions {
  message: string;
  items: SearchItem[];
  maxVisible?: number;
}

const S_STEP_ACTIVE = pc.green("◆");
const S_STEP_CANCEL = pc.red("■");
const S_STEP_SUBMIT = pc.green("◇");
const S_RADIO_ACTIVE = pc.green("●");
const S_RADIO_INACTIVE = pc.dim("○");
const S_BAR = pc.dim("│");

export const searchMultiselect = (
  options: SearchMultiselectOptions
): Promise<string[] | null> => {
  const { message, items, maxVisible = 8 } = options;

  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: silentOutput,
      terminal: false,
    });

    // Enable raw mode for keypress detection
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    emitKeypressEvents(process.stdin, rl);

    let query = "";
    let cursor = 0;
    const selected = new Set<string>();
    let lastRenderHeight = 0;

    const filter = (item: SearchItem, q: string): boolean => {
      if (!q) return true;
      const lowerQ = q.toLowerCase();
      return (
        item.label.toLowerCase().includes(lowerQ) ||
        item.value.toLowerCase().includes(lowerQ)
      );
    };

    const getFiltered = (): SearchItem[] => {
      return items.filter((item) => filter(item, query));
    };

    const clearRender = (): void => {
      if (lastRenderHeight > 0) {
        // Move up and clear each line
        process.stdout.write(`\x1b[${lastRenderHeight}A`);
        for (let i = 0; i < lastRenderHeight; i++) {
          process.stdout.write("\x1b[2K\x1b[1B");
        }
        process.stdout.write(`\x1b[${lastRenderHeight}A`);
      }
    };

    const render = (state: "active" | "submit" | "cancel" = "active"): void => {
      clearRender();

      const lines: string[] = [];
      const filtered = getFiltered();

      // Header
      const icon =
        state === "active"
          ? S_STEP_ACTIVE
          : state === "cancel"
            ? S_STEP_CANCEL
            : S_STEP_SUBMIT;
      lines.push(`${icon}  ${pc.bold(message)}`);

      if (state === "active") {
        // Search input
        const searchLine = `${S_BAR}  ${pc.dim("Search:")} ${query}${pc.inverse(" ")}`;
        lines.push(searchLine);

        // Hint
        lines.push(
          `${S_BAR}  ${pc.dim("↑↓ move, space select, enter confirm")}`
        );
        lines.push(`${S_BAR}`);

        // Items
        const visibleStart = Math.max(
          0,
          Math.min(
            cursor - Math.floor(maxVisible / 2),
            filtered.length - maxVisible
          )
        );
        const visibleEnd = Math.min(filtered.length, visibleStart + maxVisible);
        const visibleItems = filtered.slice(visibleStart, visibleEnd);

        if (filtered.length === 0) {
          lines.push(`${S_BAR}  ${pc.dim("No matches found")}`);
        } else {
          for (let i = 0; i < visibleItems.length; i++) {
            const item = visibleItems[i];
            const actualIndex = visibleStart + i;
            const isSelected = selected.has(item.value);
            const isCursor = actualIndex === cursor;

            const radio = isSelected ? S_RADIO_ACTIVE : S_RADIO_INACTIVE;
            const label = isCursor ? pc.underline(item.label) : item.label;
            const hint = item.hint ? pc.dim(` (${item.hint})`) : "";

            const prefix = isCursor ? pc.cyan("❯") : " ";
            lines.push(`${S_BAR} ${prefix} ${radio} ${label}${hint}`);
          }

          // Show count if more items
          const hiddenBefore = visibleStart;
          const hiddenAfter = filtered.length - visibleEnd;
          if (hiddenBefore > 0 || hiddenAfter > 0) {
            const parts: string[] = [];
            if (hiddenBefore > 0) parts.push(`↑ ${hiddenBefore} more`);
            if (hiddenAfter > 0) parts.push(`↓ ${hiddenAfter} more`);
            lines.push(`${S_BAR}  ${pc.dim(parts.join("  "))}`);
          }
        }

        // Selected summary
        lines.push(`${S_BAR}`);
        if (selected.size === 0) {
          lines.push(`${S_BAR}  ${pc.dim("Selected: (none)")}`);
        } else {
          const selectedLabels = items
            .filter((item) => selected.has(item.value))
            .map((item) => item.label);
          const summary =
            selectedLabels.length <= 3
              ? selectedLabels.join(", ")
              : `${selectedLabels.slice(0, 3).join(", ")} +${selectedLabels.length - 3} more`;
          lines.push(`${S_BAR}  ${pc.green("Selected:")} ${summary}`);
        }

        lines.push(`${pc.dim("└")}`);
      } else if (state === "submit") {
        // Final state - show what was selected
        const selectedLabels = items
          .filter((item) => selected.has(item.value))
          .map((item) => item.label);
        lines.push(`${S_BAR}  ${pc.dim(selectedLabels.join(", "))}`);
      } else if (state === "cancel") {
        lines.push(`${S_BAR}  ${pc.strikethrough(pc.dim("Cancelled"))}`);
      }

      process.stdout.write(`${lines.join("\n")}\n`);
      lastRenderHeight = lines.length;
    };

    const cleanup = (): void => {
      process.stdin.removeListener("keypress", keypressHandler);
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
      }
      rl.close();
    };

    const submit = (): void => {
      render("submit");
      cleanup();
      resolve([...selected]);
    };

    const cancel = (): void => {
      render("cancel");
      cleanup();
      resolve(null);
    };

    // Handle keypresses
    const keypressHandler = (_str: string | undefined, key: Key): void => {
      if (!key) return;

      const filtered = getFiltered();

      if (key.name === "return") {
        submit();
        return;
      }

      if (key.name === "escape" || (key.ctrl && key.name === "c")) {
        cancel();
        return;
      }

      if (key.name === "up") {
        cursor = Math.max(0, cursor - 1);
        render();
        return;
      }

      if (key.name === "down") {
        cursor = Math.min(filtered.length - 1, cursor + 1);
        render();
        return;
      }

      if (key.name === "space") {
        const item = filtered[cursor];
        if (item) {
          if (selected.has(item.value)) {
            selected.delete(item.value);
          } else {
            selected.add(item.value);
          }
        }
        render();
        return;
      }

      if (key.name === "backspace") {
        query = query.slice(0, -1);
        cursor = 0;
        render();
        return;
      }

      // Regular character input
      if (key.sequence && !key.ctrl && !key.meta && key.sequence.length === 1) {
        query += key.sequence;
        cursor = 0;
        render();
      }
    };

    process.stdin.on("keypress", keypressHandler);

    // Initial render
    render();
  });
};
