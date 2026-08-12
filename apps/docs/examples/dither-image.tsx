"use client";

import DitherImage, {
  type DitherAlgorithm,
} from "@repo/smoothui/components/dither-image";

interface Sample {
  algorithm: DitherAlgorithm;
  alt: string;
  caption: string;
  levels: number;
  pixelSize: number;
  seed: string;
}

const SAMPLES: Sample[] = [
  {
    algorithm: "bayer",
    alt: "Mountain ridge at dawn",
    caption: "Bayer 8×8 · 2 levels",
    levels: 2,
    pixelSize: 3,
    seed: "dither-bayer",
  },
  {
    algorithm: "atkinson",
    alt: "Empty coastal road",
    caption: "Atkinson · 2 levels",
    levels: 2,
    pixelSize: 3,
    seed: "dither-atkinson",
  },
  {
    algorithm: "floyd-steinberg",
    alt: "Dense forest canopy",
    caption: "Floyd–Steinberg · 4 levels",
    levels: 4,
    pixelSize: 2,
    seed: "dither-floyd",
  },
  {
    algorithm: "threshold",
    alt: "Brutalist concrete facade",
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
            alt={sample.alt}
            className="border border-foreground/20"
            height={SAMPLE_HEIGHT}
            levels={sample.levels}
            pixelSize={sample.pixelSize}
            src={`https://picsum.photos/seed/${sample.seed}/640/440`}
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
          alt="City skyline at night, rendered with a four colour ramp"
          className="border border-foreground/20"
          height={SAMPLE_HEIGHT}
          levels={4}
          palette={DUOTONE_PALETTE}
          pixelSize={3}
          src="https://picsum.photos/seed/dither-palette/640/440"
          width={SAMPLE_WIDTH}
        />
        <figcaption className="text-muted-foreground text-xs">
          Custom four-stop palette
        </figcaption>
      </figure>

      <figure className="flex flex-col gap-2">
        <DitherImage
          algorithm="bayer"
          alt="Sand dunes seen from above"
          className="border border-foreground/20"
          height={SAMPLE_HEIGHT}
          levels={3}
          pixelSize={3}
          progressive
          src="https://picsum.photos/seed/dither-progressive/640/440"
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
