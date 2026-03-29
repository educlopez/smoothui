import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import AppDownloadStack from "../index";

describe("AppDownloadStack", () => {
  it("renders without throwing", () => {
    const { container } = render(<AppDownloadStack />);
    expect(container).toBeInTheDocument();
  });
});
