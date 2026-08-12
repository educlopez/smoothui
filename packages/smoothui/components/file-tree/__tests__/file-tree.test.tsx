import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { fireEvent, render, screen } from "../../../test-utils/render";
import FileTree, { type FileTreeItem } from "../index";

const flatItems: FileTreeItem[] = [
  { id: "apple", name: "apple.ts", type: "file" },
  { id: "banana", name: "banana.ts", type: "file" },
  { id: "cherry", name: "cherry.ts", type: "file" },
];

const nestedItems: FileTreeItem[] = [
  {
    children: [{ id: "folder/child", name: "child.ts", type: "file" }],
    id: "folder",
    name: "folder",
    type: "folder",
  },
  { id: "other", name: "other.ts", type: "file" },
];

const getRow = (name: string) =>
  screen.getByText(name).closest('[role="treeitem"]') as HTMLElement;

describe("FileTree", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<FileTree items={flatItems} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(<FileTree items={flatItems} />);
    expect(container).toBeInTheDocument();
  });
});

describe("FileTree interactions", () => {
  it("moves focus through visible nodes with Arrow Down and Arrow Up", () => {
    render(<FileTree items={flatItems} />);
    const apple = getRow("apple.ts");
    const banana = getRow("banana.ts");
    const cherry = getRow("cherry.ts");

    apple.focus();
    fireEvent.keyDown(apple, { key: "ArrowDown" });
    expect(document.activeElement).toBe(banana);

    fireEvent.keyDown(banana, { key: "ArrowDown" });
    expect(document.activeElement).toBe(cherry);

    fireEvent.keyDown(cherry, { key: "ArrowUp" });
    expect(document.activeElement).toBe(banana);
  });

  it("jumps to the first/last visible node with Home and End", () => {
    render(<FileTree items={flatItems} />);
    const apple = getRow("apple.ts");
    const banana = getRow("banana.ts");
    const cherry = getRow("cherry.ts");

    banana.focus();
    fireEvent.keyDown(banana, { key: "End" });
    expect(document.activeElement).toBe(cherry);

    fireEvent.keyDown(cherry, { key: "Home" });
    expect(document.activeElement).toBe(apple);
  });

  it("expands a folder on the first Arrow Right and descends into it on the second", () => {
    render(<FileTree items={nestedItems} />);
    const folder = getRow("folder");

    folder.focus();
    fireEvent.keyDown(folder, { key: "ArrowRight" });
    expect(folder).toHaveAttribute("aria-expanded", "true");
    expect(document.activeElement).toBe(folder);

    fireEvent.keyDown(folder, { key: "ArrowRight" });
    const child = getRow("child.ts");
    expect(document.activeElement).toBe(child);
  });

  it("collapses an expanded folder on Arrow Left, then moves to the parent on the next", () => {
    render(<FileTree defaultExpanded={["folder"]} items={nestedItems} />);
    const folder = getRow("folder");
    const child = getRow("child.ts");

    child.focus();
    fireEvent.keyDown(child, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(folder);

    fireEvent.keyDown(folder, { key: "ArrowLeft" });
    expect(folder).toHaveAttribute("aria-expanded", "false");
  });

  it("selects the focused node with Enter and with Space", () => {
    const onSelectedChange = vi.fn();
    render(<FileTree items={flatItems} onSelectedChange={onSelectedChange} />);
    const banana = getRow("banana.ts");

    banana.focus();
    fireEvent.keyDown(banana, { key: "Enter" });
    expect(onSelectedChange).toHaveBeenCalledWith("banana");
    expect(banana).toHaveAttribute("aria-selected", "true");

    const cherry = getRow("cherry.ts");
    fireEvent.keyDown(cherry, { key: " " });
    expect(onSelectedChange).toHaveBeenLastCalledWith("cherry");
  });

  it("jumps to the next node starting with a typed letter", () => {
    render(<FileTree items={flatItems} />);
    const apple = getRow("apple.ts");
    const cherry = getRow("cherry.ts");

    apple.focus();
    fireEvent.keyDown(apple, { key: "c" });
    expect(document.activeElement).toBe(cherry);
  });

  it("in controlled mode, reflects the expanded/selected props and reports changes without mutating them", () => {
    const onExpandedChange = vi.fn();
    const onSelectedChange = vi.fn();
    render(
      <FileTree
        expanded={["folder"]}
        items={nestedItems}
        onExpandedChange={onExpandedChange}
        onSelectedChange={onSelectedChange}
        selected="other"
      />
    );

    const folder = getRow("folder");
    expect(folder).toHaveAttribute("aria-expanded", "true");

    // Controlled `expanded` makes the child part of keyboard navigation
    // (not just present in the DOM - the child is always rendered for the
    // collapse/expand height animation, so this proves the controlled prop
    // actually drives the visible-node list used by ArrowDown, not just markup).
    folder.focus();
    fireEvent.keyDown(folder, { key: "ArrowDown" });
    expect(document.activeElement).toBe(getRow("child.ts"));

    // Controlled `selected` is reflected without any interaction.
    expect(getRow("other.ts")).toHaveAttribute("aria-selected", "true");

    fireEvent.click(folder);

    expect(onSelectedChange).toHaveBeenCalledWith("folder");
    // Folder was open per the controlled prop, so toggling reports collapse.
    expect(onExpandedChange).toHaveBeenCalledWith([]);
    // The component never owns the state itself in controlled mode, so the
    // prop-driven expanded folder is still expanded since the parent hasn't
    // re-rendered with the new list yet.
    expect(folder).toHaveAttribute("aria-expanded", "true");
  });
});
