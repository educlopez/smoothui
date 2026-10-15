import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../test-utils/render";
import OTPField from "../index";
import RadixOTPField from "../otp-field.radix";

describe("OTPField", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <OTPField label="Verification code" length={4} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders the configured number of slots", () => {
    render(<OTPField aria-label="Code" length={4} />);
    expect(screen.getAllByRole("textbox")).toHaveLength(4);
  });
});

describe("OTPField (Radix-parity twin)", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <RadixOTPField label="Verification code" length={4} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders slots", () => {
    render(<RadixOTPField aria-label="PIN" length={6} />);
    expect(screen.getAllByRole("textbox")).toHaveLength(6);
  });
});
