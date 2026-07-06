import { fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { render } from "../../../test-utils/render";
import AiBranch, {
  AIBranch,
  AIBranchMessages,
  AIBranchNext,
  AIBranchPage,
  AIBranchPrevious,
  AIBranchSelector,
} from "../index";

const branches = [
  {
    id: "1",
    userMessage: "Hello",
    aiResponse: "Hi there",
    timestamp: new Date(),
    isActive: true,
  },
  {
    id: "2",
    userMessage: "How are you?",
    aiResponse: "I'm good",
    timestamp: new Date(),
    isActive: false,
  },
  {
    id: "3",
    userMessage: "Bye",
    aiResponse: "See you",
    timestamp: new Date(),
    isActive: false,
  },
];

describe("AiBranch (legacy)", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <AiBranch branches={branches.slice(0, 1)} onBranchSelect={() => {}} />
    );
    expect(container).toBeInTheDocument();
  });

  it("shows the active branch's messages", () => {
    const { getByText } = render(
      <AiBranch branches={branches} onBranchSelect={() => {}} />
    );
    expect(getByText("Hello")).toBeInTheDocument();
    expect(getByText("Hi there")).toBeInTheDocument();
  });

  it("navigates to the next branch and calls onBranchSelect", () => {
    const onBranchSelect = vi.fn();
    const { getByLabelText, getByText } = render(
      <AiBranch branches={branches} onBranchSelect={onBranchSelect} />
    );

    fireEvent.click(getByLabelText("Next branch"));

    expect(getByText("How are you?")).toBeInTheDocument();
    expect(onBranchSelect).toHaveBeenCalledWith("2");
  });

  it("wraps around to the last branch when going previous from the first", () => {
    const onBranchSelect = vi.fn();
    const { getByLabelText, getByText } = render(
      <AiBranch branches={branches} onBranchSelect={onBranchSelect} />
    );

    fireEvent.click(getByLabelText("Previous branch"));

    expect(getByText("Bye")).toBeInTheDocument();
    expect(onBranchSelect).toHaveBeenCalledWith("3");
  });

  it("wraps around to the first branch when going next from the last", () => {
    const onBranchSelect = vi.fn();
    const { getByLabelText, getByText } = render(
      <AiBranch branches={branches} onBranchSelect={onBranchSelect} />
    );

    fireEvent.click(getByLabelText("Next branch"));
    fireEvent.click(getByLabelText("Next branch"));

    expect(getByText("Bye")).toBeInTheDocument();

    fireEvent.click(getByLabelText("Next branch"));

    expect(getByText("Hello")).toBeInTheDocument();
    expect(onBranchSelect).toHaveBeenLastCalledWith("1");
  });

  it("shows the branch counter", () => {
    const { getByText } = render(
      <AiBranch branches={branches} onBranchSelect={() => {}} />
    );
    expect(getByText("1/3")).toBeInTheDocument();
  });

  it("hides navigation controls when there is a single branch", () => {
    const { queryByLabelText } = render(
      <AiBranch branches={branches.slice(0, 1)} onBranchSelect={() => {}} />
    );
    expect(queryByLabelText("Previous branch")).not.toBeInTheDocument();
    expect(queryByLabelText("Next branch")).not.toBeInTheDocument();
  });
});

describe("AIBranch (compound API)", () => {
  it("renders the current branch and hides others", () => {
    const { getByText } = render(
      <AIBranch>
        <AIBranchMessages>
          <div>Branch one</div>
          <div>Branch two</div>
        </AIBranchMessages>
      </AIBranch>
    );

    expect(getByText("Branch one")).toBeInTheDocument();
    expect(getByText("Branch two")).toBeInTheDocument();
  });

  it("navigates between branches and calls onBranchChange", () => {
    const onBranchChange = vi.fn();
    const { getByLabelText, getByText } = render(
      <AIBranch onBranchChange={onBranchChange}>
        <AIBranchMessages>
          <div>Branch one</div>
          <div>Branch two</div>
        </AIBranchMessages>
        <AIBranchSelector from="assistant">
          <AIBranchPrevious />
          <AIBranchPage />
          <AIBranchNext />
        </AIBranchSelector>
      </AIBranch>
    );

    expect(getByText("1 of 2")).toBeInTheDocument();

    fireEvent.click(getByLabelText("Next branch"));

    expect(getByText("2 of 2")).toBeInTheDocument();
    expect(onBranchChange).toHaveBeenCalledWith(1);

    fireEvent.click(getByLabelText("Previous branch"));

    expect(getByText("1 of 2")).toBeInTheDocument();
    expect(onBranchChange).toHaveBeenCalledWith(0);
  });

  it("does not render the selector when there is only one branch", () => {
    const { queryByLabelText } = render(
      <AIBranch>
        <AIBranchMessages>
          <div>Only branch</div>
        </AIBranchMessages>
        <AIBranchSelector from="user">
          <AIBranchPrevious />
          <AIBranchNext />
        </AIBranchSelector>
      </AIBranch>
    );

    expect(queryByLabelText("Next branch")).not.toBeInTheDocument();
  });

  it("throws when branch sub-components are used outside AIBranch", () => {
    expect(() => render(<AIBranchPage />)).toThrow(
      "AIBranch components must be used within AIBranch"
    );
  });
});
