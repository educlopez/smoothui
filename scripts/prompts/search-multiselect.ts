import {
  createInterface,
  emitKeypressEvents,
  type Interface,
  type Key,
} from "node:readline";
import pc from "picocolors";
import { SYMBOLS } from "../constants.js";

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
  scrollOffset: number;
}

const groupByCategory = (items: SearchItem[]): Map<string, SearchItem[]> => {
  const byCategory = new Map<string, SearchItem[]>();
  for (const item of items) {
    const cat = item.category || "Other";
    if (!byCategory.has(cat)) {
      byCategory.set(cat, []);
    }
    byCategory.get(cat)?.push(item);
  }
  return byCategory;
};

const renderHeader = (message: string, searchQuery: string): void => {
  console.log(`${pc.cyan(SYMBOLS.active)}  ${message}`);
  console.log(`${pc.dim(SYMBOLS.bar)}`);
  console.log(`${pc.dim(SYMBOLS.bar)}  Search: ${searchQuery}${pc.dim("▌")}`);
  console.log(`${pc.dim(SYMBOLS.bar)}`);
};

const renderItem = (
  item: SearchItem,
  isSelected: boolean,
  isCursor: boolean
): void => {
  const icon = isSelected
    ? pc.green(SYMBOLS.selected)
    : pc.dim(SYMBOLS.unselected);
  const cursor = isCursor ? pc.cyan(SYMBOLS.cursor) : " ";
  const label = isCursor ? pc.cyan(item.label) : item.label;
  console.log(`${pc.dim(SYMBOLS.bar)}  ${cursor} ${icon} ${label}`);
};

const renderFooter = (selectedCount: number): void => {
  console.log(`${pc.dim(SYMBOLS.bar)}`);
  console.log(
    `${pc.dim(SYMBOLS.bar)}  ${pc.dim(
      `${selectedCount} selected │ ↑↓ navigate │ space select │ enter confirm │ esc cancel`
    )}`
  );
};

const renderItems = (
  byCategory: Map<string, SearchItem[]>,
  state: PromptState,
  maxVisible: number
): void => {
  let visibleIndex = 0;
  const visibleStart = state.scrollOffset;
  const visibleEnd = state.scrollOffset + maxVisible;

  for (const [category, categoryItems] of byCategory) {
    if (visibleIndex >= visibleEnd) {
      break;
    }

    if (visibleIndex >= visibleStart) {
      console.log(`${pc.dim(SYMBOLS.bar)}  ${pc.bold(pc.dim(category))}`);
    }
    visibleIndex++;

    for (const item of categoryItems) {
      if (visibleIndex >= visibleEnd) {
        break;
      }

      if (visibleIndex >= visibleStart) {
        const isSelected = state.selected.has(item.value);
        const isCursor = visibleIndex - 1 === state.cursorIndex;
        renderItem(item, isSelected, isCursor);
      }
      visibleIndex++;
    }
  }
};

const createRenderer = (
  message: string,
  items: SearchItem[],
  state: PromptState,
  maxVisible: number
): (() => void) => {
  return () => {
    const filtered = getFilteredItems(items, state.searchQuery);

    // Clear previous output
    process.stdout.write("\x1b[2J\x1b[H");

    renderHeader(message, state.searchQuery);

    const byCategory = groupByCategory(filtered);
    renderItems(byCategory, state, maxVisible);

    renderFooter(state.selected.size);
  };
};

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
      item.category?.toLowerCase().includes(query)
  );
};

const handleNavigation = (
  key: Key,
  state: PromptState,
  totalItems: number,
  maxVisible: number
): void => {
  // Guard against empty list
  if (totalItems <= 0) {
    state.cursorIndex = 0;
    state.scrollOffset = 0;
    return;
  }

  if (key.name === "up") {
    state.cursorIndex = Math.max(0, state.cursorIndex - 1);
    if (state.cursorIndex < state.scrollOffset) {
      state.scrollOffset = state.cursorIndex;
    }
  } else if (key.name === "down") {
    state.cursorIndex = Math.min(totalItems - 1, state.cursorIndex + 1);
    if (state.cursorIndex >= state.scrollOffset + maxVisible) {
      state.scrollOffset = state.cursorIndex - maxVisible + 1;
    }
  }
};

const handleSelection = (state: PromptState, filtered: SearchItem[]): void => {
  const item = filtered[state.cursorIndex];
  if (item) {
    if (state.selected.has(item.value)) {
      state.selected.delete(item.value);
    } else {
      state.selected.add(item.value);
    }
  }
};

const handleSearch = (
  str: string | undefined,
  key: Key,
  state: PromptState
): void => {
  if (key.name === "backspace") {
    state.searchQuery = state.searchQuery.slice(0, -1);
    state.cursorIndex = 0;
    state.scrollOffset = 0;
  } else if (str && str.length === 1 && !key.ctrl && !key.meta) {
    state.searchQuery += str;
    state.cursorIndex = 0;
    state.scrollOffset = 0;
  }
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
};

export const searchMultiselect = (
  options: SearchMultiselectOptions
): Promise<string[] | null> => {
  const { message, items, maxVisible = 10 } = options;

  return new Promise((resolve) => {
    const state: PromptState = {
      selected: new Set<string>(),
      searchQuery: "",
      cursorIndex: 0,
      scrollOffset: 0,
    };

    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // Enable raw mode for keypress detection
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    emitKeypressEvents(process.stdin, rl);

    const render = createRenderer(message, items, state, maxVisible);

    const onKeypress = (str: string | undefined, key: Key): void => {
      const filtered = getFilteredItems(items, state.searchQuery);
      const totalItems = filtered.length;

      if (key.name === "escape" || (key.ctrl && key.name === "c")) {
        cleanup(rl, onKeypress);
        resolve(null);
        return;
      }

      if (key.name === "return") {
        cleanup(rl, onKeypress);
        resolve([...state.selected]);
        return;
      }

      if (key.name === "up" || key.name === "down") {
        handleNavigation(key, state, totalItems, maxVisible);
      } else if (key.name === "space") {
        handleSelection(state, filtered);
      } else {
        handleSearch(str, key, state);
      }

      render();
    };

    process.stdin.on("keypress", onKeypress);
    render();
  });
};
