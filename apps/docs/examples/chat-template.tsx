"use client";

import ChatTemplate from "@repo/smoothui/templates/chat-template";

/**
 * A chat app owns the whole viewport, so this fills it.
 *
 * The `min-h` floor is there for how the block preview measures: the iframe's
 * height comes from the content's `scrollHeight`, so a lone `h-dvh` would settle
 * at the iframe's current height and never grow, and the docs frame would show a
 * squashed app.
 *
 * It is gated at `md` on purpose. On a phone the floor is taller than the screen,
 * which pushed the composer — the one control the whole surface exists for —
 * below the bottom edge. There, `h-dvh` alone is exactly right.
 */
const Example = () => (
  <div className="h-dvh w-full md:min-h-[900px]">
    <ChatTemplate />
  </div>
);

export default Example;
