"use client";

import ChatTemplate from "@repo/smoothui/templates/chat-template";

/**
 * A chat app owns the whole viewport, so this fills it.
 *
 * `min-h` matters because of how the block preview measures: the iframe's height
 * comes from the content's `scrollHeight`, so a lone `h-dvh` would just settle at
 * the iframe's current height and never grow. The floor gives it a real app-sized
 * screen inside the docs frame, while `h-dvh` takes over when the preview is
 * opened on its own.
 */
const Example = () => (
  <div className="h-dvh min-h-[900px] w-full">
    <ChatTemplate />
  </div>
);

export default Example;
