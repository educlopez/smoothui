"use client";

import MotionLoader, {
  type MotionLoaderVariant,
} from "@repo/smoothui/components/motion-loader";

const LOADER_SIZE = 44;

const LoaderScene = ({ variant }: { variant: MotionLoaderVariant }) => (
  <div className="flex items-center justify-center p-8">
    <MotionLoader
      label={`Loading ${variant}`}
      size={LOADER_SIZE}
      variant={variant}
    />
  </div>
);

const OrbitDemo = () => <LoaderScene variant="orbit" />;
const NewtonCradleDemo = () => <LoaderScene variant="newton-cradle" />;
const PendulumDemo = () => <LoaderScene variant="pendulum" />;
const HourglassDemo = () => <LoaderScene variant="hourglass" />;
const MorphRingDemo = () => <LoaderScene variant="morph-ring" />;
const SquareSnakeDemo = () => <LoaderScene variant="square-snake" />;
const CometDemo = () => <LoaderScene variant="comet" />;
const RadarDemo = () => <LoaderScene variant="radar" />;
const CubeFlipDemo = () => <LoaderScene variant="cube-flip" />;
const WaveBarsDemo = () => <LoaderScene variant="wave-bars" />;
const BreathingGlowDemo = () => <LoaderScene variant="breathing-glow" />;
const DotRingDemo = () => <LoaderScene variant="dot-ring" />;

export const demoScenes = {
  "Breathing Glow": BreathingGlowDemo,
  Comet: CometDemo,
  "Cube Flip": CubeFlipDemo,
  "Dot Ring": DotRingDemo,
  Features: OrbitDemo,
  Hourglass: HourglassDemo,
  "Morph Ring": MorphRingDemo,
  "Newton Cradle": NewtonCradleDemo,
  Orbit: OrbitDemo,
  Pendulum: PendulumDemo,
  Radar: RadarDemo,
  "Square Snake": SquareSnakeDemo,
  "Wave Bars": WaveBarsDemo,
};

export default function MotionLoaderDemo() {
  return <OrbitDemo />;
}
