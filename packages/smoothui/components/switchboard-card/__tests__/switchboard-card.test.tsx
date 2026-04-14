import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import SwitchboardCard from "../index";

describe("SwitchboardCard", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <SwitchboardCard subtitle="Subtitle" title="Test" />
    );
    expect(container).toBeInTheDocument();
  });
});
