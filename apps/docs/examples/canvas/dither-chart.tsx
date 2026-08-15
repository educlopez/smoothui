"use client";

import DitherChart, {
  type DitherChartSeries,
} from "@repo/smoothui/components/dither-chart";
import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * A donut is the variant that survives the shrink: big arcs, big dot fields,
 * legible at 200px. The figures rotate on a slow loop, so the chart is a live
 * dial rather than a still.
 *
 * `animate` is off deliberately. The draw-in is a per-frame canvas re-dither,
 * and on a plane this dense it crawls — every screenshot catches a 5%-drawn
 * sliver that reads as a broken chart. Off, every reading paints complete and
 * the rotation carries the motion.
 */
const READINGS: DitherChartSeries[][] = [
  [
    {
      name: "Traffic",
      points: [
        { label: "Direct", value: 42 },
        { label: "Search", value: 28 },
        { label: "Social", value: 18 },
        { label: "Referral", value: 12 },
      ],
    },
  ],
  [
    {
      name: "Traffic",
      points: [
        { label: "Direct", value: 31 },
        { label: "Search", value: 37 },
        { label: "Social", value: 14 },
        { label: "Referral", value: 18 },
      ],
    },
  ],
  [
    {
      name: "Traffic",
      points: [
        { label: "Direct", value: 24 },
        { label: "Search", value: 22 },
        { label: "Social", value: 33 },
        { label: "Referral", value: 21 },
      ],
    },
  ],
];

const READING_INTERVAL_MS = 2800;
const CHART_SIZE = 208;

const DitherChartCanvasDemo = () => {
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }
    const id = setInterval(() => {
      setIndex((value) => (value + 1) % READINGS.length);
    }, READING_INTERVAL_MS);
    return () => clearInterval(id);
  }, [shouldReduceMotion]);

  return (
    <DitherChart
      animate={false}
      data={READINGS[index]}
      height={CHART_SIZE}
      matrix={4}
      pixelSize={3}
      variant="donut"
      width={CHART_SIZE}
    />
  );
};

export default DitherChartCanvasDemo;
