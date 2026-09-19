"use client";

import GravityStars from "@repo/smoothui/components/gravity-stars";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import { type ChangeEvent, useId, useState } from "react";

/**
 * Deep blue-black night sky, authored in oklch so the surface, the vignette and
 * the star tints all sit on one perceptual lightness scale. The backdrop lands
 * at L 0.145 — well under the 0.25 ceiling the headline needs to clear.
 */
const SKY_CLASS = "bg-[oklch(0.145_0.014_264)]";

/** Corners fall away, so the centre of the field carries the text. */
const VIGNETTE = [
  "radial-gradient(115% 92% at 50% 38%,",
  "transparent 0%,",
  "oklch(0.09 0.012 264 / 0.5) 70%,",
  "oklch(0.06 0.01 264 / 0.86) 100%)",
].join(" ");

const SLIDER_CLASS =
  "h-1 w-full cursor-pointer appearance-none rounded-full bg-foreground/15 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-moz-range-thumb]:size-3.5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-brand [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand";

interface FieldProps {
  id: string;
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  readout: string;
  step: number;
  value: number;
}

const Field = ({
  id,
  label,
  max,
  min,
  onChange,
  readout,
  step,
  value,
}: FieldProps) => (
  <div className="flex min-w-40 flex-1 flex-col gap-2">
    <label
      className="flex items-baseline justify-between gap-3 font-medium text-foreground text-xs"
      htmlFor={id}
    >
      <span>{label}</span>
      <span className="text-muted-foreground tabular-nums">{readout}</span>
    </label>
    <input
      className={SLIDER_CLASS}
      id={id}
      max={max}
      min={min}
      onChange={(event: ChangeEvent<HTMLInputElement>) =>
        onChange(event.target.valueAsNumber)
      }
      step={step}
      type="range"
      value={value}
    />
  </div>
);

export default function GravityStarsDemo() {
  const fieldId = useId();
  const [count, setCount] = useState(240);
  const [connectDistance, setConnectDistance] = useState(120);
  const [connect, setConnect] = useState(true);

  return (
    <div className="flex w-full flex-col gap-5">
      <GravityStars
        className={`h-[26rem] w-full rounded-3xl ${SKY_CLASS}`}
        connect={connect}
        connectDistance={connectDistance}
        count={count}
        tint={0.65}
      >
        <div className="relative flex h-full flex-col justify-center gap-4 px-7 sm:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: VIGNETTE }}
          />
          <h2 className="relative max-w-xl text-balance font-semibold text-4xl text-[oklch(0.97_0.005_265)] tracking-tight sm:text-5xl">
            The whole sky leans towards your cursor.
          </h2>
          <p className="relative max-w-md text-[oklch(0.79_0.012_265)] text-sm sm:text-base">
            Move your pointer through the field: stars fall in, swirl past, and
            get flung back out.
          </p>
          <div className="relative pt-1">
            <SmoothButton
              color="accent"
              onClick={() => setConnect((previous) => !previous)}
              shape="pill"
              size="sm"
              variant="solid"
            >
              {connect ? "Hide the constellation links" : "Draw the links back"}
            </SmoothButton>
          </div>
        </div>
      </GravityStars>

      <div className="flex flex-wrap items-end gap-6">
        <Field
          id={`${fieldId}-count`}
          label="Stars"
          max={480}
          min={60}
          onChange={setCount}
          readout={`${count}`}
          step={20}
          value={count}
        />
        <Field
          id={`${fieldId}-reach`}
          label="Link reach"
          max={190}
          min={60}
          onChange={setConnectDistance}
          readout={`${connectDistance}px`}
          step={5}
          value={connectDistance}
        />
      </div>

      <GravityStars
        className={`h-[15rem] w-full rounded-2xl ${SKY_CLASS}`}
        connectDistance={165}
        count={460}
        glow={4}
        gravity={1.5}
        starSize={1.1}
        tint={0.85}
        twinkle={0.75}
      >
        <div className="relative flex h-full flex-col justify-end gap-1 px-6 pb-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: VIGNETTE }}
          />
          <p className="relative font-medium text-[oklch(0.96_0.005_265)] text-sm">
            Constellation preset
          </p>
          <p className="relative max-w-sm text-[oklch(0.76_0.012_265)] text-xs">
            460 smaller stars at a 165px link reach and stronger gravity — the
            uniform grid keeps the link pass linear instead of quadratic.
          </p>
        </div>
      </GravityStars>
    </div>
  );
}
