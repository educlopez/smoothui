import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "../../../test-utils/render";
import AnimatedFileUpload from "../index";

const createFile = (name: string, size: number, type = "image/png") => {
  const file = new File([new Uint8Array(size)], name, { type });
  return file;
};

describe("AnimatedFileUpload", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <AnimatedFileUpload onFilesSelected={() => {}} />
    );
    expect(container).toBeInTheDocument();
  });

  it("adds a file selected through the input and calls onFilesSelected", () => {
    const onFilesSelected = vi.fn();
    const { container } = render(
      <AnimatedFileUpload onFilesSelected={onFilesSelected} />
    );
    const input = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const file = createFile("photo.png", 2048);

    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText("photo.png")).toBeInTheDocument();
    expect(screen.getByText("2.0 KB")).toBeInTheDocument();
    expect(onFilesSelected).toHaveBeenCalledWith([file]);
  });

  it("removes a file when the remove button is clicked", () => {
    const onFilesSelected = vi.fn();
    const { container } = render(
      <AnimatedFileUpload onFilesSelected={onFilesSelected} />
    );
    const input = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const file = createFile("doc.pdf", 512, "application/pdf");

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByLabelText("Remove doc.pdf"));

    expect(screen.queryByText("doc.pdf")).not.toBeInTheDocument();
    expect(onFilesSelected).toHaveBeenLastCalledWith([]);
  });

  it("keeps only the first file when multiple is false", () => {
    const onFilesSelected = vi.fn();
    const { container } = render(
      <AnimatedFileUpload multiple={false} onFilesSelected={onFilesSelected} />
    );
    const input = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const first = createFile("a.png", 100);
    const second = createFile("b.png", 100);

    fireEvent.change(input, { target: { files: [first, second] } });

    expect(screen.getByText("a.png")).toBeInTheDocument();
    expect(screen.queryByText("b.png")).not.toBeInTheDocument();
    expect(onFilesSelected).toHaveBeenCalledWith([first]);
  });

  it("rejects files over maxSize and shows an error", () => {
    const onFilesSelected = vi.fn();
    const { container } = render(
      <AnimatedFileUpload maxSize={1024} onFilesSelected={onFilesSelected} />
    );
    const input = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const oversized = createFile("big.png", 2048);

    fireEvent.change(input, { target: { files: [oversized] } });

    expect(
      screen.getByText("1 file(s) exceed the 1.0 KB limit")
    ).toBeInTheDocument();
    expect(onFilesSelected).not.toHaveBeenCalled();
  });

  it("toggles drag-over state on drag enter and leave", () => {
    const { getByLabelText } = render(
      <AnimatedFileUpload onFilesSelected={() => {}} />
    );
    const dropzone = getByLabelText(
      "File upload area. Drag and drop files or press to browse"
    );

    fireEvent.dragEnter(dropzone);
    expect(dropzone.className).toContain("border-primary");

    fireEvent.dragLeave(dropzone);
    expect(dropzone.className).not.toContain("border-primary");
  });

  it("adds files dropped on the dropzone", () => {
    const onFilesSelected = vi.fn();
    const { getByLabelText } = render(
      <AnimatedFileUpload onFilesSelected={onFilesSelected} />
    );
    const dropzone = getByLabelText(
      "File upload area. Drag and drop files or press to browse"
    );
    const file = createFile("dropped.png", 100);

    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });

    expect(screen.getByText("dropped.png")).toBeInTheDocument();
    expect(onFilesSelected).toHaveBeenCalledWith([file]);
  });

  it("does not open the file picker or accept drops when disabled", () => {
    const onFilesSelected = vi.fn();
    const { getByLabelText } = render(
      <AnimatedFileUpload disabled onFilesSelected={onFilesSelected} />
    );
    const dropzone = getByLabelText(
      "File upload area. Drag and drop files or press to browse"
    );

    expect(dropzone).toHaveAttribute("tabIndex", "-1");

    fireEvent.drop(dropzone, {
      dataTransfer: { files: [createFile("nope.png", 10)] },
    });

    expect(screen.queryByText("nope.png")).not.toBeInTheDocument();
    expect(onFilesSelected).not.toHaveBeenCalled();
  });

  it("opens the file picker on Enter and Space keys", () => {
    const { getByLabelText } = render(
      <AnimatedFileUpload onFilesSelected={() => {}} />
    );
    const dropzone = getByLabelText(
      "File upload area. Drag and drop files or press to browse"
    );
    const input = dropzone.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const clickSpy = vi.spyOn(input, "click");

    fireEvent.keyDown(dropzone, { key: "Enter" });
    fireEvent.keyDown(dropzone, { key: " " });

    expect(clickSpy.mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it("formats megabyte-sized files", () => {
    const onFilesSelected = vi.fn();
    const { container } = render(
      <AnimatedFileUpload onFilesSelected={onFilesSelected} />
    );
    const input = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const big = createFile("video.mp4", 5 * 1024 * 1024, "video/mp4");

    fireEvent.change(input, { target: { files: [big] } });

    expect(screen.getByText("5.0 MB")).toBeInTheDocument();
  });
});
