import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../test-utils/render";
import PreviewCard from "../index";
import RadixPreviewCard from "../preview-card.radix";

// Portaled content lives outside landmarks in jsdom; the region rule is page-level.
const NO_REGION = { rules: { region: { enabled: false } } };

describe("PreviewCard", () => {
  it("has no accessibility violations when closed", async () => {
    const { container } = render(
      <PreviewCard trigger={<a href="/profile">@smoothui</a>}>
        <p>Profile details</p>
      </PreviewCard>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when open", async () => {
    const { baseElement } = render(
      <PreviewCard open trigger={<a href="/profile">@smoothui</a>}>
        <p>Profile details</p>
      </PreviewCard>
    );
    const results = await axe(baseElement, NO_REGION);
    expect(results).toHaveNoViolations();
  });

  it("renders the card content when open", async () => {
    render(
      <PreviewCard open trigger={<a href="/profile">@smoothui</a>}>
        <p>Profile details</p>
      </PreviewCard>
    );
    expect(await screen.findByText("Profile details")).toBeInTheDocument();
  });

  it("renders the animated popup with the overlay surface", async () => {
    render(
      <PreviewCard open trigger={<a href="/profile">@smoothui</a>}>
        <p>Profile details</p>
      </PreviewCard>
    );
    await screen.findByText("Profile details");
    const popup = document.querySelector("[data-slot='preview-card-popup']");
    expect(popup).not.toBeNull();
    expect(popup?.className).toContain("bg-popover");
  });
});

describe("PreviewCard (Radix twin)", () => {
  it("has no accessibility violations when open", async () => {
    const { baseElement } = render(
      <RadixPreviewCard open trigger={<a href="/profile">@smoothui</a>}>
        <p>Profile details</p>
      </RadixPreviewCard>
    );
    expect(await screen.findByText("Profile details")).toBeInTheDocument();
    const results = await axe(baseElement, NO_REGION);
    expect(results).toHaveNoViolations();
  });
});
