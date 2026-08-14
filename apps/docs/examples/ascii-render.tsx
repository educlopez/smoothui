"use client";

import AsciiRender, {
  type AsciiRenderSource,
} from "@repo/smoothui/components/ascii-render";
import { useState } from "react";

const PORTRAIT: AsciiRenderSource = {
  src: "https://ik.imagekit.io/16u211libb/smoothui/scenes/rust-peak.webp?tr=w-720,h-720,f-auto",
  type: "image",
};

const LANDSCAPE: AsciiRenderSource = {
  src: "https://ik.imagekit.io/16u211libb/smoothui/scenes/golden-ridge.webp?tr=w-960,h-540,f-auto",
  type: "image",
};

const BLOCK_CHARSET = "█▓▒░ ";
const DENSE_CHARSET =
  '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`. ';

const AsciiRenderDemo = () => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <figure className="flex flex-col gap-2">
          <AsciiRender
            alt="A portrait photograph rendered as monochrome ASCII characters"
            className="border border-foreground/20 p-3"
            color="mono"
            columns={72}
            fontSize={9}
            source={PORTRAIT}
          />
          <figcaption className="text-muted-foreground text-xs">
            Mono · 72 columns · default ramp
          </figcaption>
        </figure>

        <figure className="flex flex-col gap-2">
          <AsciiRender
            alt="A landscape photograph rendered as ASCII characters tinted with the source colours"
            className="border border-foreground/20 p-3"
            color="source"
            columns={96}
            fontSize={8}
            source={LANDSCAPE}
          />
          <figcaption className="text-muted-foreground text-xs">
            Source colour · 96 columns
          </figcaption>
        </figure>

        <figure className="flex flex-col gap-2">
          <AsciiRender
            alt="A portrait photograph rendered with Unicode block characters"
            charset={BLOCK_CHARSET}
            className="border border-foreground/20 p-3"
            color="mono"
            columns={64}
            fontSize={10}
            source={PORTRAIT}
          />
          <figcaption className="text-muted-foreground text-xs">
            Block ramp · inverted off
          </figcaption>
        </figure>

        <figure className="flex flex-col gap-2">
          <AsciiRender
            alt="A landscape photograph rendered with a dense 68 character ramp, inverted"
            charset={DENSE_CHARSET}
            className="border border-foreground/20 p-3"
            color="mono"
            columns={110}
            fontSize={7}
            invert
            paused={isPaused}
            source={LANDSCAPE}
          />
          <figcaption className="flex items-center justify-between gap-3 text-muted-foreground text-xs">
            <span>Dense ramp · inverted</span>
            <button
              className="rounded-full border border-foreground/20 px-3 py-1 font-medium text-foreground"
              onClick={() => setIsPaused((previous) => !previous)}
              type="button"
            >
              {isPaused ? "Resume" : "Pause"}
            </button>
          </figcaption>
        </figure>
      </div>
    </div>
  );
};

export default AsciiRenderDemo;
