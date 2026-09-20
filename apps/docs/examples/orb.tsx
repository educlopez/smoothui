"use client";

import Orb, { type OrbProps } from "@repo/smoothui/components/orb";

const PRESETS: Record<string, OrbProps> = {
  bloom: {
    aberration: 0.8,
    blobScale: 3,
    colors: ["#f25aed", "#ffffff"],
    inner: 0.38,
    rim: 1.3,
  },
  drop: {
    aberration: 0.2,
    blobScale: 2.4,
    colors: ["#7c5cff", "#12f7d6"],
    glow: 0.55,
    grain: 0.2,
    rim: 1.1,
    turbulence: 0.55,
    wobble: 0.8,
  },
  ember: {
    blobScale: 4.2,
    colors: ["#ff7a1a", "#ffd166"],
    flow: 0.85,
    inner: 0.7,
    rim: 0.6,
    shading: 0,
    specular: 0.1,
    turbulence: 0.6,
  },
  glass: {
    blobScale: 1.7,
    colors: ["#06121f", "#2f6fed", "#8ad8ff", "#ffffff"],
    contrast: 1.2,
    inner: 0.22,
    iridescence: 0.5,
    rim: 2,
    specular: 0.7,
  },
};

const PresetScene = ({ preset }: { preset: keyof typeof PRESETS }) => (
  <div className="flex items-center justify-center p-8">
    <Orb {...PRESETS[preset]} size={280} />
  </div>
);

const BloomDemo = () => <PresetScene preset="bloom" />;
const GlassDemo = () => <PresetScene preset="glass" />;
const EmberDemo = () => <PresetScene preset="ember" />;
const DropDemo = () => <PresetScene preset="drop" />;

export const demoScenes = {
  Bloom: BloomDemo,
  Drop: DropDemo,
  Ember: EmberDemo,
  Features: BloomDemo,
  Glass: GlassDemo,
};

export default function OrbDemo() {
  return <BloomDemo />;
}
