import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { render, screen, waitFor, within } from "../../../test-utils/render";
import EmojiReaction, {
  type EmojiReactionItem,
  type EmojiReactionProps,
} from "../index";

/**
 * EmojiReaction is fully controlled — it never mutates its own count or
 * `reacted` state. This harness mirrors the documented usage pattern
 * (increment/decrement `count` and flip `reacted` inside `onReact`) so
 * interaction tests can assert on real, visible outcomes.
 */
const ControlledEmojiReaction = ({
  initialReactions,
  onReact,
  ...rest
}: Omit<EmojiReactionProps, "reactions"> & {
  initialReactions: EmojiReactionItem[];
}) => {
  const [reactions, setReactions] = useState(initialReactions);

  const handleReact = (id: string, nextReacted: boolean) => {
    setReactions((previous) => {
      const existing = previous.find((reaction) => reaction.id === id);
      if (existing) {
        return previous.map((reaction) =>
          reaction.id === id
            ? {
                ...reaction,
                count: (reaction.count ?? 0) + (nextReacted ? 1 : -1),
                reacted: nextReacted,
              }
            : reaction
        );
      }
      return [
        ...previous,
        { count: 1, emoji: id, id, label: id, reacted: true },
      ];
    });
    onReact?.(id, nextReacted);
  };

  return (
    <EmojiReaction {...rest} onReact={handleReact} reactions={reactions} />
  );
};

describe("EmojiReaction", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <EmojiReaction
        reactions={[
          { count: 3, emoji: "🎉", id: "party", label: "Party" },
          { emoji: "🔥", id: "fire", label: "Fire", reacted: true },
        ]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(
      <EmojiReaction
        reactions={[
          { count: 3, emoji: "🎉", id: "party", label: "Party" },
          { emoji: "🔥", id: "fire", label: "Fire", reacted: true },
        ]}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it("renders with the extra reactions picker open", () => {
    const { container } = render(
      <EmojiReaction
        defaultPickerOpen
        reactions={[{ count: 1, emoji: "👍", id: "thumb", label: "Thumbs up" }]}
        showPicker
      />
    );
    expect(container).toBeInTheDocument();
  });

  it("reacts and un-reacts, flipping aria-pressed and the visible count", async () => {
    const user = userEvent.setup();
    const onReact = vi.fn();
    render(
      <ControlledEmojiReaction
        initialReactions={[
          { count: 3, emoji: "🎉", id: "party", label: "Party" },
        ]}
        onReact={onReact}
      />
    );

    const button = screen.getByRole("button", { name: "Party, 3 reactions" });
    expect(button).toHaveAttribute("aria-pressed", "false");

    await user.click(button);
    expect(onReact).toHaveBeenCalledWith("party", true);
    const reacted = screen.getByRole("button", { name: "Party, 4 reactions" });
    expect(reacted).toHaveAttribute("aria-pressed", "true");

    await user.click(reacted);
    expect(onReact).toHaveBeenCalledWith("party", false);
    expect(
      screen.getByRole("button", { name: "Party, 3 reactions" })
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("enforces mutual exclusivity by default (allowMultiple=false)", async () => {
    const user = userEvent.setup();
    render(
      <ControlledEmojiReaction
        initialReactions={[
          { count: 1, emoji: "🎉", id: "party", label: "Party" },
          { count: 2, emoji: "🔥", id: "fire", label: "Fire" },
        ]}
      />
    );

    await user.click(screen.getByRole("button", { name: "Party, 1 reaction" }));
    expect(
      screen.getByRole("button", { name: "Party, 2 reactions" })
    ).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "Fire, 2 reactions" }));

    // Selecting Fire must un-react Party, since only one reaction may be
    // active at a time when allowMultiple is false.
    expect(
      screen.getByRole("button", { name: "Party, 1 reaction" })
    ).toHaveAttribute("aria-pressed", "false");
    expect(
      screen.getByRole("button", { name: "Fire, 3 reactions" })
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("keeps reactions independent when allowMultiple is true", async () => {
    const user = userEvent.setup();
    const onReact = vi.fn();
    render(
      <ControlledEmojiReaction
        allowMultiple
        initialReactions={[
          { count: 1, emoji: "🎉", id: "party", label: "Party" },
          { count: 2, emoji: "🔥", id: "fire", label: "Fire" },
        ]}
        onReact={onReact}
      />
    );

    await user.click(screen.getByRole("button", { name: "Party, 1 reaction" }));
    await user.click(screen.getByRole("button", { name: "Fire, 2 reactions" }));

    expect(onReact).not.toHaveBeenCalledWith("party", false);
    expect(
      screen.getByRole("button", { name: "Party, 2 reactions" })
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "Fire, 3 reactions" })
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("opens the picker on click and closes on Escape, returning focus", async () => {
    const user = userEvent.setup();
    render(
      <ControlledEmojiReaction
        initialReactions={[
          { count: 1, emoji: "👍", id: "thumb", label: "Thumbs up" },
        ]}
        showPicker
      />
    );

    const trigger = screen.getByRole("button", { name: "More reactions" });
    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const menu = screen.getByRole("menu");
    expect(
      within(menu).getByRole("menuitem", { name: "React with 🎉" })
    ).toHaveFocus();

    await user.keyboard("{Escape}");

    await waitFor(() =>
      expect(screen.queryByRole("menu")).not.toBeInTheDocument()
    );
    expect(trigger).toHaveFocus();
  });

  it("opens the picker on Enter and navigates emoji with arrow keys", async () => {
    const user = userEvent.setup();
    render(
      <ControlledEmojiReaction
        initialReactions={[
          { count: 1, emoji: "👍", id: "thumb", label: "Thumbs up" },
        ]}
        showPicker
      />
    );

    screen.getByRole("button", { name: "More reactions" }).focus();
    await user.keyboard("{Enter}");

    const menu = screen.getByRole("menu");
    expect(
      within(menu).getByRole("menuitem", { name: "React with 🎉" })
    ).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(
      within(menu).getByRole("menuitem", { name: "React with 🔥" })
    ).toHaveFocus();

    await user.keyboard("{ArrowLeft}");
    expect(
      within(menu).getByRole("menuitem", { name: "React with 🎉" })
    ).toHaveFocus();
  });

  it("routes a picker selection of an existing reaction through the same handler as a pill", async () => {
    const user = userEvent.setup();
    render(
      <ControlledEmojiReaction
        initialReactions={[
          { count: 1, emoji: "🎉", id: "party", label: "Party", reacted: true },
          { count: 0, emoji: "🔥", id: "fire", label: "Fire" },
        ]}
        showPicker
      />
    );

    await user.click(screen.getByRole("button", { name: "More reactions" }));
    // "🔥" is a default picker emoji that already exists as the Fire pill.
    await user.click(screen.getByRole("menuitem", { name: "React with 🔥" }));

    expect(
      screen.getByRole("button", { name: "Fire, 1 reaction" })
    ).toHaveAttribute("aria-pressed", "true");
    // The previously active pill was un-reacted, which only happens on the
    // shared handleReact path (the same one a pill click uses) enforcing
    // allowMultiple exclusivity — not the "append a brand-new reaction"
    // fallback used for emojis that aren't already in the bar.
    expect(
      screen.getByRole("button", { name: "Party, 0 reactions" })
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("reports a brand-new picker emoji via onReact with the emoji as the id", async () => {
    const user = userEvent.setup();
    const onReact = vi.fn();
    render(
      <ControlledEmojiReaction
        initialReactions={[
          { count: 1, emoji: "👍", id: "thumb", label: "Thumbs up" },
        ]}
        onReact={onReact}
        showPicker
      />
    );

    await user.click(screen.getByRole("button", { name: "More reactions" }));
    await user.click(screen.getByRole("menuitem", { name: "React with 🎉" }));

    expect(onReact).toHaveBeenCalledWith("🎉", true);
  });
});
