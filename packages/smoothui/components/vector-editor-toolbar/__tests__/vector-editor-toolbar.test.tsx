import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { fireEvent, render, screen, waitFor } from "../../../test-utils/render";
import VectorEditorToolbar, { type VectorTool } from "../index";

const TestIcon = ({ className }: { className?: string }) => (
  <svg aria-hidden="true" className={className} viewBox="0 0 24 24">
    <rect height="24" width="24" />
  </svg>
);

const TOOLS: VectorTool[] = [
  { icon: TestIcon, id: "select", label: "Select", shortcut: "v" },
  {
    icon: TestIcon,
    id: "shape",
    items: [
      { icon: TestIcon, id: "rectangle", label: "Rectangle", shortcut: "r" },
      { icon: TestIcon, id: "ellipse", label: "Ellipse", shortcut: "e" },
    ],
    label: "Shape",
  },
];

describe("VectorEditorToolbar", () => {
  it("renders without throwing", () => {
    const { container } = render(<VectorEditorToolbar tools={TOOLS} />);
    expect(container).toBeInTheDocument();
  });

  it("renders floating with a vertical orientation and properties panel", () => {
    const { container } = render(
      <VectorEditorToolbar
        floating
        orientation="vertical"
        properties={<div>Properties</div>}
        tools={TOOLS}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it("reports the clicked tool without mutating the resolved active tool when controlled", async () => {
    const user = userEvent.setup();
    const onToolChange = vi.fn();
    render(
      <VectorEditorToolbar
        activeTool="select"
        onToolChange={onToolChange}
        tools={TOOLS}
      />
    );

    await user.click(screen.getByRole("button", { name: "Shape" }));

    expect(onToolChange).toHaveBeenCalledWith("shape");
    // Controlled: the prop never changed, so Select stays the resolved tool.
    expect(screen.getByRole("button", { name: "Select" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "Shape" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("selects a tool and updates aria-pressed when uncontrolled", async () => {
    const user = userEvent.setup();
    const onToolChange = vi.fn();
    render(<VectorEditorToolbar onToolChange={onToolChange} tools={TOOLS} />);

    expect(screen.getByRole("button", { name: "Select" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    await user.click(screen.getByRole("button", { name: "Shape" }));

    expect(onToolChange).toHaveBeenCalledWith("shape");
    expect(screen.getByRole("button", { name: "Shape" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "Select" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("opens the flyout via the corner-triangle caret", async () => {
    const user = userEvent.setup();
    render(<VectorEditorToolbar tools={TOOLS} />);

    await user.click(screen.getByRole("button", { name: "Shape options" }));

    expect(
      screen.getByRole("group", { name: "Shape options" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Rectangle" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ellipse" })).toBeInTheDocument();
  });

  it("opens the flyout by clicking a tool that is already active", async () => {
    const user = userEvent.setup();
    render(<VectorEditorToolbar tools={TOOLS} />);

    await user.click(screen.getByRole("button", { name: "Shape" }));
    expect(
      screen.queryByRole("button", { name: "Rectangle" })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Shape" }));
    expect(
      screen.getByRole("button", { name: "Rectangle" })
    ).toBeInTheDocument();
  });

  it("opens the flyout with ArrowDown from the keyboard and focuses the first item", async () => {
    const user = userEvent.setup();
    render(<VectorEditorToolbar tools={TOOLS} />);

    screen.getByRole("button", { name: "Select" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Shape" })).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("button", { name: "Rectangle" })).toHaveFocus();
  });

  it("navigates the open flyout with arrow keys and selects with Enter", async () => {
    const user = userEvent.setup();
    const onToolChange = vi.fn();
    render(<VectorEditorToolbar onToolChange={onToolChange} tools={TOOLS} />);

    screen.getByRole("button", { name: "Select" }).focus();
    await user.keyboard("{ArrowRight}{ArrowDown}");
    expect(screen.getByRole("button", { name: "Rectangle" })).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("button", { name: "Ellipse" })).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(onToolChange).toHaveBeenCalledWith("ellipse");

    // Selecting closes the flyout (its exit animation is async), leaving
    // only the cell button — which now borrows the chosen variant's label —
    // and focus returns to it.
    await waitFor(() =>
      expect(screen.getAllByRole("button", { name: "Ellipse" })).toHaveLength(1)
    );
    expect(screen.getByRole("button", { name: "Ellipse" })).toHaveFocus();
  });

  it("closes the flyout on Escape and returns focus to its trigger", async () => {
    const user = userEvent.setup();
    render(<VectorEditorToolbar tools={TOOLS} />);

    await user.click(screen.getByRole("button", { name: "Shape options" }));
    expect(screen.getByRole("button", { name: "Rectangle" })).toHaveFocus();

    await user.keyboard("{Escape}");

    await waitFor(() =>
      expect(
        screen.queryByRole("button", { name: "Rectangle" })
      ).not.toBeInTheDocument()
    );
    expect(screen.getByRole("button", { name: "Shape" })).toHaveFocus();
  });

  it("fires single-key shortcuts for top-level tools and nested flyout items", async () => {
    const user = userEvent.setup();
    const onToolChange = vi.fn();
    render(<VectorEditorToolbar onToolChange={onToolChange} tools={TOOLS} />);

    await user.keyboard("r");
    expect(onToolChange).toHaveBeenCalledWith("rectangle");

    await user.keyboard("v");
    expect(onToolChange).toHaveBeenCalledWith("select");
  });

  it("ignores shortcuts while focus is inside an input", async () => {
    const user = userEvent.setup();
    const onToolChange = vi.fn();
    render(
      <div>
        <input aria-label="Filename" />
        <VectorEditorToolbar onToolChange={onToolChange} tools={TOOLS} />
      </div>
    );

    await user.click(screen.getByRole("textbox", { name: "Filename" }));
    await user.keyboard("v");

    expect(onToolChange).not.toHaveBeenCalled();
  });

  it("ignores shortcuts while focus is inside a contenteditable element", () => {
    const onToolChange = vi.fn();
    render(
      <div>
        {/* biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: minimal contenteditable stand-in for a rich text editor */}
        <div
          contentEditable
          data-testid="editor"
          suppressContentEditableWarning
        />
        <VectorEditorToolbar onToolChange={onToolChange} tools={TOOLS} />
      </div>
    );

    // jsdom doesn't implement `isContentEditable` (it's always `undefined`),
    // so the guard is exercised by stubbing the same property a real browser
    // would report for a contenteditable element.
    const editor = screen.getByTestId("editor");
    Object.defineProperty(editor, "isContentEditable", {
      configurable: true,
      value: true,
    });

    fireEvent.keyDown(editor, { key: "v" });

    expect(onToolChange).not.toHaveBeenCalled();
  });

  it("does not fire shortcuts when shortcutsEnabled is false", async () => {
    const user = userEvent.setup();
    const onToolChange = vi.fn();
    render(
      <VectorEditorToolbar
        onToolChange={onToolChange}
        shortcutsEnabled={false}
        tools={TOOLS}
      />
    );

    await user.keyboard("v");

    expect(onToolChange).not.toHaveBeenCalled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<VectorEditorToolbar tools={TOOLS} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
