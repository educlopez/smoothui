"use client";

import DitherImage, {
  type DitherAlgorithm,
} from "@repo/smoothui/components/dither-image";
import { sceneById } from "@smoothui/data/scenes";

interface Sample {
  algorithm: DitherAlgorithm;
  caption: string;
  levels: number;
  pixelSize: number;
  seed: string;
}

/** One photograph across every algorithm, so the algorithm is the variable. */
const SAMPLE_SCENE = sceneById("golden-ridge");

const SAMPLES: Sample[] = [
  {
    algorithm: "bayer",
    caption: "Bayer 8×8 · 2 levels",
    levels: 2,
    pixelSize: 3,
    seed: "dither-bayer",
  },
  {
    algorithm: "atkinson",
    caption: "Atkinson · 2 levels",
    levels: 2,
    pixelSize: 3,
    seed: "dither-atkinson",
  },
  {
    algorithm: "floyd-steinberg",
    caption: "Floyd–Steinberg · 4 levels",
    levels: 4,
    pixelSize: 2,
    seed: "dither-floyd",
  },
  {
    algorithm: "threshold",
    caption: "Threshold · 2 levels",
    levels: 2,
    pixelSize: 4,
    seed: "dither-threshold",
  },
];

const SAMPLE_WIDTH = 320;
const SAMPLE_HEIGHT = 220;
const DUOTONE_PALETTE = ["#0b1026", "#3b2f8f", "#f2557a", "#ffd9a0"];

const DitherImageDemo = () => (
  <div className="mx-auto w-full max-w-5xl px-4 py-8">
    <div className="flex flex-wrap justify-center gap-6">
      {SAMPLES.map((sample) => (
        <figure className="flex flex-col gap-2" key={sample.seed}>
          <DitherImage
            algorithm={sample.algorithm}
            alt={SAMPLE_SCENE?.alt ?? ""}
            className="border border-foreground/20"
            height={SAMPLE_HEIGHT}
            levels={sample.levels}
            pixelSize={sample.pixelSize}
            src={`${SAMPLE_SCENE?.src}?tr=w-640,h-440,f-auto`}
            width={SAMPLE_WIDTH}
          />
          <figcaption className="text-muted-foreground text-xs">
            {sample.caption}
          </figcaption>
        </figure>
      ))}
    </div>

    <div className="mt-10 flex flex-wrap justify-center gap-6">
      <figure className="flex flex-col gap-2">
        <DitherImage
          algorithm="floyd-steinberg"
          alt="A pale dune crest in deep shadow, on a four-stop palette"
          className="border border-foreground/20"
          height={SAMPLE_HEIGHT}
          levels={4}
          palette={DUOTONE_PALETTE}
          pixelSize={3}
          src="https://ik.imagekit.io/16u211libb/smoothui/scenes/dune-shadow.webp?tr=w-640,h-440,f-auto"
          width={SAMPLE_WIDTH}
        />
        <figcaption className="text-muted-foreground text-xs">
          Custom four-stop palette
        </figcaption>
      </figure>

      <figure className="flex flex-col gap-2">
        <DitherImage
          algorithm="bayer"
          alt="Blue mountain ridges receding into night"
          className="border border-foreground/20"
          height={SAMPLE_HEIGHT}
          levels={3}
          pixelSize={3}
          progressive
          src="https://ik.imagekit.io/16u211libb/smoothui/scenes/blue-ridge-night.webp?tr=w-640,h-440,f-auto"
          width={SAMPLE_WIDTH}
        />
        <figcaption className="text-muted-foreground text-xs">
          Progressive reveal on scroll
        </figcaption>
      </figure>
    </div>
  </div>
);

export default DitherImageDemo;
