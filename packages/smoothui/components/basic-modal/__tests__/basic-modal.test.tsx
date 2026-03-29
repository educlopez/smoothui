import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import BasicModal from "../index";

describe("BasicModal", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <BasicModal isOpen={false} onClose={() => {}}>
        <p>Modal content</p>
      </BasicModal>
    );
    expect(container).toBeInTheDocument();
  });
});
