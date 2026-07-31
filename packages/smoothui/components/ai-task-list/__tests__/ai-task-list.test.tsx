import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import AITaskList, { type AITask } from "../index";

const TASKS: AITask[] = [
  {
    id: "a",
    label: "Verify records",
    status: "done",
    children: [
      { id: "a1", label: "Match IDs", status: "done" },
      { id: "a2", label: "Flag stale", status: "running" },
    ],
  },
  { id: "b", label: "Draft emails", status: "pending" },
];

describe("AITaskList", () => {
  it("renders every task and sub-task", () => {
    render(<AITaskList tasks={TASKS} />);
    expect(screen.getByText("Verify records")).toBeInTheDocument();
    expect(screen.getByText("Match IDs")).toBeInTheDocument();
    expect(screen.getByText("Draft emails")).toBeInTheDocument();
  });

  it("derives the count from the data, including nested tasks", () => {
    // 4 tasks total, 2 done — a count passed in as a prop would drift.
    render(<AITaskList tasks={TASKS} />);
    expect(screen.getByText("2/4")).toBeInTheDocument();
  });

  it("indents sub-tasks", () => {
    const { container } = render(<AITaskList tasks={TASKS} />);
    const items = [...container.querySelectorAll("li")];
    expect(items[0]?.style.paddingLeft).toBe("0px");
    expect(items[1]?.style.paddingLeft).not.toBe("0px");
  });

  it("draws a mark for done and failed but not for pending", () => {
    const { container } = render(
      <AITaskList
        tasks={[
          { id: "1", label: "done", status: "done" },
          { id: "2", label: "failed", status: "failed" },
          { id: "3", label: "pending", status: "pending" },
        ]}
      />
    );
    expect(container.querySelectorAll("path")).toHaveLength(2);
  });

  it("takes a custom label", () => {
    render(<AITaskList label="Reorder run" tasks={TASKS} />);
    expect(screen.getByText("Reorder run")).toBeInTheDocument();
  });
});
