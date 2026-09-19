"use client";

import type { DitherChartSeries } from "@repo/smoothui/components/dither-chart";
import DitherChart, {
  DITHER_CHART_VARIANTS,
} from "@repo/smoothui/components/dither-chart";

const TRAFFIC: DitherChartSeries[] = [
  {
    name: "Visitors",
    points: [
      { label: "Mon", value: 34 },
      { label: "Tue", value: 52 },
      { label: "Wed", value: 41 },
      { label: "Thu", value: 68 },
      { label: "Fri", value: 84 },
      { label: "Sat", value: 61 },
      { label: "Sun", value: 73 },
    ],
  },
  {
    name: "Signups",
    points: [
      { label: "Mon", value: 18 },
      { label: "Tue", value: 24 },
      { label: "Wed", value: 30 },
      { label: "Thu", value: 27 },
      { label: "Fri", value: 44 },
      { label: "Sat", value: 33 },
      { label: "Sun", value: 39 },
    ],
  },
];

const BREAKDOWN: DitherChartSeries[] = [
  {
    name: "Channels",
    points: [
      { label: "Direct", value: 42 },
      { label: "Search", value: 28 },
      { label: "Social", value: 18 },
      { label: "Referral", value: 12 },
    ],
  },
];

const GAUGE: DitherChartSeries[] = [
  { name: "Uptime", points: [{ label: "Current", value: 78 }] },
];

const FUNNEL: DitherChartSeries[] = [
  {
    name: "Funnel",
    points: [
      { label: "Visits", value: 100 },
      { label: "Signups", value: 64 },
      { label: "Trials", value: 38 },
      { label: "Paid", value: 17 },
    ],
  },
];

const HEATMAP: DitherChartSeries[] = [
  {
    name: "Morning",
    points: [
      { label: "Mon", value: 12 },
      { label: "Tue", value: 34 },
      { label: "Wed", value: 55 },
      { label: "Thu", value: 21 },
      { label: "Fri", value: 68 },
      { label: "Sat", value: 40 },
    ],
  },
  {
    name: "Afternoon",
    points: [
      { label: "Mon", value: 48 },
      { label: "Tue", value: 72 },
      { label: "Wed", value: 30 },
      { label: "Thu", value: 88 },
      { label: "Fri", value: 51 },
      { label: "Sat", value: 24 },
    ],
  },
  {
    name: "Evening",
    points: [
      { label: "Mon", value: 90 },
      { label: "Tue", value: 44 },
      { label: "Wed", value: 66 },
      { label: "Thu", value: 15 },
      { label: "Fri", value: 79 },
      { label: "Sat", value: 58 },
    ],
  },
];

const DATA_BY_VARIANT: Record<string, DitherChartSeries[]> = {
  bar: TRAFFIC,
  bubbles: TRAFFIC,
  donut: BREAKDOWN,
  funnel: FUNNEL,
  gauge: GAUGE,
  heatmap: HEATMAP,
  line: TRAFFIC,
  stacked: TRAFFIC,
};

const CAPTIONS: Record<string, string> = {
  bar: "Grouped bars, one group per day",
  bubbles: "Bubble size and height follow the value",
  donut: "Traffic share by channel",
  funnel: "Conversion funnel, top to bottom",
  gauge: "Uptime as a 0–100 dial",
  heatmap: "Activity per slot and day",
  line: "Weekly visitors and signups",
  stacked: "Visitors stacked over signups",
};

const CHART_WIDTH = 260;
const CHART_HEIGHT = 150;

export default function DitherChartDemo() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {DITHER_CHART_VARIANTS.map((variant) => (
          <div
            className="flex flex-col items-center rounded-2xl border border-foreground/20 bg-background p-4"
            key={variant}
          >
            <DitherChart
              caption={CAPTIONS[variant]}
              data={DATA_BY_VARIANT[variant]}
              height={CHART_HEIGHT}
              label={variant}
              variant={variant}
              width={CHART_WIDTH}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
