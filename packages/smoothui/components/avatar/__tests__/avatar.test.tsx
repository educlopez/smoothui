import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../test-utils/render";
import RadixAvatar, { AvatarGroup as RadixAvatarGroup } from "../avatar.radix";
import Avatar, { AvatarGroup } from "../index";

describe("Avatar", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <Avatar alt="Ada Lovelace" fallback="AL" status="online" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("shows the fallback when there is no image", () => {
    render(<Avatar fallback="AL" />);
    expect(screen.getByText("AL")).toBeInTheDocument();
  });

  it("applies size classes", () => {
    const { container } = render(<Avatar fallback="AL" size="lg" />);
    const root = container.querySelector("[data-slot='avatar']");
    expect(root).toHaveAttribute("data-size", "lg");
    expect(root?.className).toContain("size-10");
  });

  it("announces the status dot", () => {
    render(<Avatar fallback="AL" status="busy" />);
    expect(screen.getByRole("img", { name: "busy" })).toBeInTheDocument();
  });
});

describe("AvatarGroup", () => {
  it("collapses extras into a +N overflow chip", () => {
    render(
      <AvatarGroup aria-label="Members" max={2}>
        <Avatar fallback="A" />
        <Avatar fallback="B" />
        <Avatar fallback="C" />
        <Avatar fallback="D" />
      </AvatarGroup>
    );
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.queryByText("C")).toBeNull();
    expect(screen.getByText("+2")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Members" })).toBeInTheDocument();
  });

  it("shows no overflow when under the limit", () => {
    render(
      <AvatarGroup max={5}>
        <Avatar fallback="A" />
        <Avatar fallback="B" />
      </AvatarGroup>
    );
    expect(screen.queryByText(/^\+/)).toBeNull();
  });

  it("passes group size down to avatars", () => {
    const { container } = render(
      <AvatarGroup size="sm">
        <Avatar fallback="A" />
      </AvatarGroup>
    );
    expect(container.querySelector("[data-slot='avatar']")).toHaveAttribute(
      "data-size",
      "sm"
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <AvatarGroup aria-label="Members" max={1}>
        <Avatar fallback="A" />
        <Avatar fallback="B" />
      </AvatarGroup>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("Avatar (Radix twin)", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <RadixAvatarGroup aria-label="Members" max={1}>
        <RadixAvatar fallback="A" status="away" />
        <RadixAvatar fallback="B" />
      </RadixAvatarGroup>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders fallback and overflow", () => {
    render(
      <RadixAvatarGroup max={1}>
        <RadixAvatar fallback="A" />
        <RadixAvatar fallback="B" />
      </RadixAvatarGroup>
    );
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("+1")).toBeInTheDocument();
  });
});
