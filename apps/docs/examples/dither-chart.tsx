"use client";

import type { DitherChartSeries } from "@repo/smoothui/components/dither-chart";
import DitherChart, {
  type DitherChartVariant,
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

const DATA_BY_VARIANT: Record<DitherChartVariant, DitherChartSeries[]> = {
  bar: TRAFFIC,
  bubbles: TRAFFIC,
  donut: BREAKDOWN,
  funnel: FUNNEL,
  gauge: GAUGE,
  heatmap: HEATMAP,
  line: TRAFFIC,
  stacked: TRAFFIC,
};

const CHART_WIDTH = 260;
const CHART_HEIGHT = 150;

const ChartScene = ({ variant }: { variant: DitherChartVariant }) => (
  <div className="flex items-center justify-center p-8">
    <DitherChart
      data={DATA_BY_VARIANT[variant]}
      height={CHART_HEIGHT}
      variant={variant}
      width={CHART_WIDTH}
    />
  </div>
);

const LineDemo = () => <ChartScene variant="line" />;
const BarDemo = () => <ChartScene variant="bar" />;
const StackedDemo = () => <ChartScene variant="stacked" />;
const DonutDemo = () => <ChartScene variant="donut" />;
const GaugeDemo = () => <ChartScene variant="gauge" />;
const FunnelDemo = () => <ChartScene variant="funnel" />;
const HeatmapDemo = () => <ChartScene variant="heatmap" />;
const BubblesDemo = () => <ChartScene variant="bubbles" />;

export const demoScenes = {
  Bar: BarDemo,
  Bubbles: BubblesDemo,
  Donut: DonutDemo,
  Features: LineDemo,
  Funnel: FunnelDemo,
  Gauge: GaugeDemo,
  Heatmap: HeatmapDemo,
  Line: LineDemo,
  Stacked: StackedDemo,
};

export default function DitherChartDemo() {
  return <LineDemo />;
}
