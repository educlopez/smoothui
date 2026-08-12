import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import AuthForm from "../index";

describe("AuthForm", () => {
  it("renders without throwing in sign-in mode", () => {
    const { container } = render(<AuthForm mode="sign-in" />);
    expect(container).toBeInTheDocument();
  });

  it("renders without throwing in sign-up mode", () => {
    const { container } = render(<AuthForm mode="sign-up" />);
    expect(container).toBeInTheDocument();
  });
});
