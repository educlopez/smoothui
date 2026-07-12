import { act, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { render } from "../../../test-utils/render";
import InteractiveImageSelector, { type ImageData } from "../index";

const images: ImageData[] = [
  { id: 1, src: "https://example.com/1.jpg" },
  { id: 2, src: "https://example.com/2.jpg" },
];

const findButtonByIconClass = (
  buttons: HTMLElement[],
  iconClass: string
): HTMLElement | undefined =>
  buttons.find(
    (button) =>
      !button.hasAttribute("disabled") &&
      button.querySelector(`svg.${iconClass}`)
  );

describe("InteractiveImageSelector", () => {
  it("renders without throwing", () => {
    const { container } = render(<InteractiveImageSelector images={images} />);
    expect(container).toBeInTheDocument();
  });

  it("renders all provided images", () => {
    const { getAllByRole } = render(
      <InteractiveImageSelector images={images} />
    );
    expect(getAllByRole("img")).toHaveLength(2);
  });

  it("enters selection mode when Select is clicked", () => {
    const { getByRole, getByText } = render(
      <InteractiveImageSelector images={images} />
    );

    fireEvent.click(getByRole("button", { name: "Select images" }));

    expect(getByText("0 selected")).toBeInTheDocument();
    expect(
      getByRole("button", { name: "Cancel selection" })
    ).toBeInTheDocument();
  });

  it("selects an image and reports the count uncontrolled", () => {
    const { getAllByRole, getByRole, getByText } = render(
      <InteractiveImageSelector images={images} />
    );

    fireEvent.click(getByRole("button", { name: "Select images" }));
    fireEvent.click(getAllByRole("img")[0]);

    expect(getByText("1 selected")).toBeInTheDocument();
  });

  it("calls onChange with the newly selected ids when controlled", () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(
      <InteractiveImageSelector
        images={images}
        onChange={onChange}
        selectable
        selectedImages={[]}
      />
    );

    fireEvent.click(getAllByRole("img")[1]);

    expect(onChange).toHaveBeenCalledWith([2]);
  });

  it("does not select images when not in selecting mode", () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(
      <InteractiveImageSelector images={images} onChange={onChange} />
    );

    fireEvent.click(getAllByRole("img")[0]);

    expect(onChange).not.toHaveBeenCalled();
  });

  it("calls onShare with selected image ids", () => {
    const onShare = vi.fn();
    const { getAllByRole } = render(
      <InteractiveImageSelector images={images} onShare={onShare} selectable />
    );

    fireEvent.click(getAllByRole("img")[0]);
    const shareButton = findButtonByIconClass(
      getAllByRole("button"),
      "lucide-share2"
    );
    expect(shareButton).toBeDefined();
    if (shareButton) {
      fireEvent.click(shareButton);
    }

    expect(onShare).toHaveBeenCalledWith([1]);
  });

  it("calls onDelete and removes the selected image", async () => {
    const onDelete = vi.fn();
    const { getAllByRole } = render(
      <InteractiveImageSelector
        images={images}
        onDelete={onDelete}
        selectable
      />
    );

    fireEvent.click(getAllByRole("img")[0]);
    const deleteButton = findButtonByIconClass(
      getAllByRole("button"),
      "lucide-trash2"
    );
    expect(deleteButton).toBeDefined();
    if (deleteButton) {
      fireEvent.click(deleteButton);
    }

    expect(onDelete).toHaveBeenCalledWith([1]);
    await waitFor(() => expect(getAllByRole("img")).toHaveLength(1));
  });

  it("cancels selection and clears selected images", async () => {
    const { getAllByRole, getByRole, queryByText } = render(
      <InteractiveImageSelector images={images} selectable />
    );

    fireEvent.click(getAllByRole("img")[0]);
    fireEvent.click(getByRole("button", { name: "Cancel selection" }));

    await waitFor(() =>
      expect(queryByText("1 selected")).not.toBeInTheDocument()
    );
  });

  it("resets images after the reset delay", () => {
    vi.useFakeTimers();
    const { getAllByRole, getByRole } = render(
      <InteractiveImageSelector images={images} selectable />
    );

    fireEvent.click(getAllByRole("img")[0]);
    fireEvent.click(getByRole("button", { name: "Reset selection" }));

    expect(getByRole("button", { name: "Reset selection" })).toBeDisabled();

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(getByRole("button", { name: "Reset selection" })).not.toBeDisabled();
    vi.useRealTimers();
  });
});
