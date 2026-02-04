import {
  createInterface,
  emitKeypressEvents,
  type Interface,
  type Key,
} from "node:readline";
import pc from "picocolors";

// Symbols
const S = {
  active: "◆",
  done: "◇",
  selected: "●",
  unselected: "○",
  pointer: "❯",
  bar: "│",
};

interface SearchItem {
  value: string;
  label: string;
  category?: string;
}

interface SearchMultiselectOptions {
  message: string;
  items: SearchItem[];
  maxVisible?: number;
}

interface PromptState {
  selected: Set<string>;
  searchQuery: string;
  cursorIndex: number;
}

const getFilteredItems = (
  items: SearchItem[],
  searchQuery: string
): SearchItem[] => {
  if (!searchQuery) {
    return items;
  }
  const query = searchQuery.toLowerCase();
  return items.filter(
    (item) =>
      item.label.toLowerCase().includes(query) ||
      item.value.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query)
  );
};

const formatSelected = (selected: Set<string>, maxShow = 3): string => {
  const arr = [...selected];
  if (arr.length === 0) return "";
  if (arr.length <= maxShow) return arr.join(", ");
  return `${arr.slice(0, maxShow).join(", ")} +${arr.length - maxShow} more`;
};

const render = (
  message: string,
  items: SearchItem[],
  state: PromptState,
  maxVisible: number
): void => {
  const filtered = getFilteredItems(items, state.searchQuery);
  const total = filtered.length;

  // Clear screen and move to top
  process.stdout.write("\x1b[2J\x1b[H");

  // Header
  console.log(
    `${pc.green(S.active)}  ${message} ${pc.dim("(space to toggle)")}`
  );
  console.log(`${pc.dim(S.bar)}`);

  // Search input
  const searchDisplay = state.searchQuery || pc.dim("Type to search...");
  console.log(
    `${pc.dim(S.bar)}  ${pc.cyan("Search:")} ${searchDisplay}${pc.inverse(" ")}`
  );
  console.log(`${pc.dim(S.bar)}`);

  // Calculate visible window (centered scrolling like Vercel)
  const halfVisible = Math.floor(maxVisible / 2);
  let startIndex = Math.max(0, state.cursorIndex - halfVisible);
  const endIndex = Math.min(total, startIndex + maxVisible);

  // Adjust start if we're near the end
  if (endIndex - startIndex < maxVisible && startIndex > 0) {
    startIndex = Math.max(0, endIndex - maxVisible);
  }

  // Show "↑ N more" indicator
  if (startIndex > 0) {
    console.log(`${pc.dim(S.bar)}  ${pc.dim(`↑ ${startIndex} more`)}`);
  }

  // Render items
  for (let i = startIndex; i < endIndex; i++) {
    const item = filtered[i];
    const isSelected = state.selected.has(item.value);
    const isCursor = i === state.cursorIndex;

    const pointer = isCursor ? pc.cyan(S.pointer) : " ";
    const checkbox = isSelected ? pc.green(S.selected) : pc.dim(S.unselected);
    const label = isCursor ? pc.cyan(item.label) : item.label;
    const hint = item.category ? pc.dim(` (${item.category})`) : "";

    console.log(`${pc.dim(S.bar)}  ${pointer} ${checkbox} ${label}${hint}`);
  }

  // Show "↓ N more" indicator
  const remaining = total - endIndex;
  if (remaining > 0) {
    console.log(`${pc.dim(S.bar)}  ${pc.dim(`↓ ${remaining} more`)}`);
  }

  // Empty state
  if (total === 0) {
    console.log(`${pc.dim(S.bar)}  ${pc.dim("No components found")}`);
  }

  console.log(`${pc.dim(S.bar)}`);

  // Selected summary
  const selectedSummary = formatSelected(state.selected);
  if (selectedSummary) {
    console.log(
      `${pc.dim(S.bar)}  ${pc.green("Selected:")} ${selectedSummary}`
    );
    console.log(`${pc.dim(S.bar)}`);
  }

  // Footer with keyboard hints
  console.log(
    `${pc.dim(S.bar)}  ${pc.dim("↑↓ navigate • space select • enter confirm • esc cancel")}`
  );
};

const cleanup = (
  rl: Interface,
  onKeypress?: (str: string | undefined, key: Key) => void
): void => {
  if (onKeypress) {
    process.stdin.removeListener("keypress", onKeypress);
  }
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(false);
  }
  rl.close();
  // Show cursor
  process.stdout.write("\x1b[?25h");
};

export const searchMultiselect = (
  options: SearchMultiselectOptions
): Promise<string[] | null> => {
  const { message, items, maxVisible = 8 } = options;

  return new Promise((resolve) => {
    const state: PromptState = {
      selected: new Set<string>(),
      searchQuery: "",
      cursorIndex: 0,
    };

    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // Enable raw mode and hide cursor
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
      process.stdout.write("\x1b[?25l"); // Hide cursor
    }
    emitKeypressEvents(process.stdin, rl);

    const doRender = () => render(message, items, state, maxVisible);

    const onKeypress = (str: string | undefined, key: Key): void => {
      const filtered = getFilteredItems(items, state.searchQuery);
      const totalItems = filtered.length;

      // Cancel
      if (key.name === "escape" || (key.ctrl && key.name === "c")) {
        cleanup(rl, onKeypress);
        process.stdout.write("\x1b[2J\x1b[H"); // Clear screen
        resolve(null);
        return;
      }

      // Submit
      if (key.name === "return") {
        cleanup(rl, onKeypress);
        process.stdout.write("\x1b[2J\x1b[H"); // Clear screen
        resolve([...state.selected]);
        return;
      }

      // Navigation
      if (key.name === "up") {
        state.cursorIndex = Math.max(0, state.cursorIndex - 1);
      } else if (key.name === "down") {
        state.cursorIndex = Math.min(totalItems - 1, state.cursorIndex + 1);
      }
      // Selection
      else if (key.name === "space") {
        const item = filtered[state.cursorIndex];
        if (item) {
          if (state.selected.has(item.value)) {
            state.selected.delete(item.value);
          } else {
            state.selected.add(item.value);
          }
        }
      }
      // Search input
      else if (key.name === "backspace") {
        state.searchQuery = state.searchQuery.slice(0, -1);
        state.cursorIndex = 0;
      } else if (str && str.length === 1 && !key.ctrl && !key.meta) {
        state.searchQuery += str;
        state.cursorIndex = 0;
      }

      // Guard cursor against empty results
      if (totalItems === 0) {
        state.cursorIndex = 0;
      } else if (state.cursorIndex >= totalItems) {
        state.cursorIndex = totalItems - 1;
      }

      doRender();
    };

    process.stdin.on("keypress", onKeypress);
    doRender();
  });
};
