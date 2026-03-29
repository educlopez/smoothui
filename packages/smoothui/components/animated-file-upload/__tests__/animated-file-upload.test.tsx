import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import AnimatedFileUpload from "../index";

describe("AnimatedFileUpload", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <AnimatedFileUpload onFilesSelected={() => {}} />
    );
    expect(container).toBeInTheDocument();
  });
});
