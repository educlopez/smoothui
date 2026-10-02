"use client";

import { Button } from "@docs/components/smoothbutton";
import { useUiSound } from "@docs/components/sound-provider";
import { sceneSrc } from "@docs/examples/shared/demo-fixtures";
import { cn } from "@repo/shadcn-ui/lib/utils";
import PhotoStack from "@repo/smoothui/components/photo-stack";
import { castAnimals, castPeople } from "@smoothui/data/cast";
import { landscapes } from "@smoothui/data/scenes";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  IconArrowTrendUpFill24,
  IconBellFill24,
  IconGearFill24,
  IconGrid2Fill24,
  IconHouse4Fill24,
  IconSparkleFill24,
  IconUsersFill24,
} from "nucleo-core-fill-24";
import { useEffect, useMemo, useRef, useState } from "react";

const VIEWS = [
  { icon: IconHouse4Fill24, id: "landing", label: "Landing" },
  { icon: IconGrid2Fill24, id: "dashboard", label: "Dashboard" },
  { icon: IconSparkleFill24, id: "experiment", label: "Experiment" },
] as const;

type ViewId = (typeof VIEWS)[number]["id"];

const EXPERIMENT_SCENE = landscapes[4] ?? landscapes[0];
const LANDING_HERO_SCENE =
  landscapes.find((scene) => scene.id === "tidal-cove") ??
  landscapes[7] ??
  landscapes[0];

const CUSTOMERS = [
  {
    arr: "$13.6k",
    date: "10/31",
    name: "Northwind",
    next: "11/30",
    revenue: "$4.3M",
  },
  {
    arr: "$29.4k",
    date: "03/15",
    name: "Linear",
    next: "03/15",
    revenue: "$892k",
  },
  {
    arr: "$38.4k",
    date: "07/22",
    name: "Harbor",
    next: "07/22",
    revenue: "$1.2M",
  },
  {
    arr: "$10.6k",
    date: "01/08",
    name: "Twine",
    next: "01/08",
    revenue: "$567k",
  },
  {
    arr: "$14.4k",
    date: "05/12",
    name: "Cedar",
    next: "05/12",
    revenue: "$345k",
  },
] as const;

const LOGO_STRIP = [
  "Northwind",
  "Vercel",
  "Harbor",
  "Stripe",
  "Spotify",
  "Twine",
] as const;

const DASH_NAV = [
  { icon: IconHouse4Fill24, id: "overview", label: "Overview" },
  { icon: IconGrid2Fill24, id: "projects", label: "Projects" },
  { icon: IconSparkleFill24, id: "deployments", label: "Deployments" },
  { icon: IconUsersFill24, id: "team", label: "Team" },
  { icon: IconGearFill24, id: "settings", label: "Settings" },
] as const;

type DashSection = (typeof DASH_NAV)[number]["id"];

const KPIS = [
  {
    change: "+12.4%",
    id: "visitors",
    label: "Visitors",
    up: true,
    value: "184.2k",
  },
  {
    change: "+8.1%",
    id: "requests",
    label: "Requests",
    up: true,
    value: "2.4M",
  },
  {
    change: "+4.2%",
    id: "bandwidth",
    label: "Bandwidth",
    up: true,
    value: "812 GB",
  },
  {
    change: "−0.4%",
    id: "errors",
    label: "Error rate",
    up: false,
    value: "0.18%",
  },
] as const;

const PROJECTS = [
  {
    domain: "sparkbites.dev",
    framework: "Next.js",
    href: "https://sparkbites.dev",
    id: "sparkbites",
    logo: "/sparkbites.png",
    name: "Sparkbites",
    status: "Ready",
    tone: "ok" as const,
  },
  {
    domain: "skills.smoothui.dev",
    framework: "Docs",
    href: "https://skills.smoothui.dev",
    id: "skills",
    logo: "/logomark-smoothui.svg",
    name: "SmoothUI Skills",
    status: "Ready",
    tone: "ok" as const,
  },
  {
    domain: "wingtics.com",
    framework: "Analytics",
    href: "https://wingtics.com",
    id: "wingtics",
    logo: "https://wingtics.com/icon.svg",
    name: "Wingtics",
    status: "Building",
    tone: "pending" as const,
  },
  {
    domain: "thegridcn.dev",
    framework: "Directory",
    href: "https://thegridcn.dev",
    id: "thegridcn",
    logo: "https://thegridcn.com/favicon.svg",
    name: "The Grid CN",
    status: "Ready",
    tone: "ok" as const,
  },
  {
    domain: "codevator.dev",
    framework: "Next.js",
    href: "https://codevator.dev",
    id: "codevator",
    logo: "https://codevator.dev/apple-icon.png",
    name: "Codevator",
    status: "Error",
    tone: "error" as const,
  },
] as const;

const PROJECT_BY_DOMAIN = Object.fromEntries(
  PROJECTS.map((project) => [project.domain, project])
) as Record<(typeof PROJECTS)[number]["domain"], (typeof PROJECTS)[number]>;

const DEPLOYS = [
  {
    branch: "main",
    commit: "feat: bite cards refresh",
    domain: "sparkbites.dev" as const,
    id: "d1",
    project: "Sparkbites",
    status: "Ready",
    time: "2m ago",
    tone: "ok" as const,
  },
  {
    branch: "main",
    commit: "docs: skill install notes",
    domain: "skills.smoothui.dev" as const,
    id: "d2",
    project: "SmoothUI Skills",
    status: "Ready",
    time: "18m ago",
    tone: "ok" as const,
  },
  {
    branch: "feat/charts",
    commit: "feat: funnel sparkline",
    domain: "wingtics.com" as const,
    id: "d3",
    project: "Wingtics",
    status: "Building",
    time: "24m ago",
    tone: "pending" as const,
  },
  {
    branch: "main",
    commit: "chore: grid filters",
    domain: "thegridcn.dev" as const,
    id: "d4",
    project: "The Grid CN",
    status: "Ready",
    time: "1h ago",
    tone: "ok" as const,
  },
  {
    branch: "main",
    commit: "fix: typecheck",
    domain: "codevator.dev" as const,
    id: "d5",
    project: "Codevator",
    status: "Error",
    time: "3h ago",
    tone: "error" as const,
  },
] as const;

type ActivityKind = "person" | "project" | "system";

const ACTIVITY = [
  {
    domain: "sparkbites.dev",
    id: "a1",
    kind: "project" as ActivityKind,
    kpi: "visitors",
    meta: "sparkbites.dev · Production",
    title: "Deployment Ready — main",
  },
  {
    id: "a2",
    kind: "person" as ActivityKind,
    kpi: "requests",
    meta: "18m ago · Maya",
    personIndex: 0,
    title: "Invited Luca to Wingtics",
  },
  {
    domain: "skills.smoothui.dev",
    id: "a3",
    kind: "project" as ActivityKind,
    kpi: "bandwidth",
    meta: "skills.smoothui.dev · Preview",
    title: "Build started — docs update",
  },
  {
    domain: "codevator.dev",
    id: "a4",
    kind: "system" as ActivityKind,
    kpi: "errors",
    mark: "!",
    markClass: "bg-destructive text-white",
    meta: "codevator.dev · 3h ago",
    title: "Build failed — Typecheck",
  },
  {
    domain: "thegridcn.dev",
    id: "a5",
    kind: "person" as ActivityKind,
    kpi: "visitors",
    meta: "5h ago · Nora",
    personIndex: 1,
    title: "Domain thegridcn.dev verified",
  },
] as const;

const CHART_BARS = [38, 52, 44, 68, 61, 78, 72, 86, 80, 94, 88, 100] as const;

const CHART_SERIES = {
  bandwidth: [42, 48, 55, 51, 60, 66, 70, 74, 78, 82, 90, 96],
  errors: [72, 64, 58, 51, 48, 42, 38, 34, 30, 28, 24, 22],
  requests: [...CHART_BARS],
  visitors: [28, 34, 40, 48, 45, 58, 62, 70, 66, 78, 84, 92],
} as const;

const CHART_META = {
  bandwidth: {
    title: "Bandwidth",
    unit: "GB",
    values: [48, 54, 61, 57, 66, 72, 76, 81, 86, 90, 98, 104],
  },
  errors: {
    title: "Error rate",
    unit: "%",
    values: [
      0.42, 0.38, 0.34, 0.3, 0.28, 0.25, 0.22, 0.2, 0.18, 0.17, 0.15, 0.14,
    ],
  },
  requests: {
    title: "Edge requests",
    unit: "M",
    values: [1.1, 1.3, 1.2, 1.6, 1.5, 1.8, 1.7, 2.0, 1.9, 2.2, 2.1, 2.4],
  },
  visitors: {
    title: "Visitors",
    unit: "k",
    values: [92, 104, 118, 132, 128, 148, 156, 168, 162, 176, 180, 184],
  },
} as const;

const CHART_WEEKS = [
  "12w ago",
  "11w ago",
  "10w ago",
  "9w ago",
  "8w ago",
  "7w ago",
  "6w ago",
  "5w ago",
  "4w ago",
  "3w ago",
  "2w ago",
  "This week",
] as const;

function formatChartValue(kpi: keyof typeof CHART_META, index: number): string {
  const meta = CHART_META[kpi];
  const value = meta.values[index] ?? 0;
  if (kpi === "errors") {
    return `${value}${meta.unit}`;
  }
  return `${value}${meta.unit}`;
}

function EdgeRequestsChart({
  activeKpi,
  shouldReduceMotion,
}: {
  activeKpi: (typeof KPIS)[number]["id"] | null;
  shouldReduceMotion: boolean | null;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const seriesKey = activeKpi ?? "requests";
  const bars = CHART_SERIES[seriesKey];
  const meta = CHART_META[seriesKey];

  return (
    <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/8">
      <div className="mb-3 flex items-end justify-between gap-2">
        <div>
          <p className="font-medium text-foreground text-sm">{meta.title}</p>
          <p className="text-muted-foreground text-xs">
            Last 12 weeks · click a KPI to filter
          </p>
        </div>
        {hovered === null ? null : (
          <motion.p
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            className="text-right"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 4 }}
            key={`${seriesKey}-${hovered}`}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.15, ease: [0.23, 1, 0.32, 1] }
            }
          >
            <span className="block font-medium font-title text-foreground text-sm tabular-nums">
              {formatChartValue(seriesKey, hovered)}
            </span>
            <span className="block text-[10px] text-muted-foreground">
              {CHART_WEEKS[hovered]}
            </span>
          </motion.p>
        )}
      </div>
      <div
        aria-label={`${meta.title} over the last 12 weeks`}
        className="relative flex h-44 items-end gap-1.5"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setHovered(null);
          }
        }}
        onMouseLeave={(event) => {
          if (event.currentTarget.contains(document.activeElement)) {
            return;
          }
          setHovered(null);
        }}
        role="img"
      >
        {bars.map((value, index) => {
          const isActive = hovered === index;
          const isDimmed = hovered !== null && !isActive;
          return (
            <button
              aria-label={`${CHART_WEEKS[index]}: ${formatChartValue(seriesKey, index)}`}
              className="group relative flex h-full flex-1 items-end outline-none"
              key={`${seriesKey}-bar-${index}`}
              onFocus={() => setHovered(index)}
              onMouseEnter={() => setHovered(index)}
              type="button"
            >
              <motion.span
                animate={
                  shouldReduceMotion
                    ? { opacity: isDimmed ? 0.35 : 1, scaleY: 1 }
                    : {
                        opacity: isDimmed ? 0.35 : 1,
                        scaleY: 1,
                      }
                }
                className={cn(
                  "block w-full origin-bottom rounded-t-md bg-brand transition-[filter] duration-150",
                  isActive && "brightness-110"
                )}
                initial={
                  shouldReduceMotion
                    ? { opacity: 1, scaleY: 1 }
                    : { opacity: 0.4, scaleY: 0 }
                }
                style={{ height: `${value}%` }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        delay: index * 0.03,
                        opacity: { duration: 0.15 },
                        scaleY: {
                          bounce: 0.08,
                          duration: 0.35,
                          type: "spring",
                        },
                      }
                }
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProjectLogo({
  className,
  domain,
  name,
}: {
  className?: string;
  domain: string;
  name: string;
}) {
  const project = PROJECT_BY_DOMAIN[domain as keyof typeof PROJECT_BY_DOMAIN];
  const sources = [
    project?.logo,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
  ].filter((candidate): candidate is string => Boolean(candidate));
  const [sourceIndex, setSourceIndex] = useState(0);
  const src = sources[sourceIndex];
  const monogram = (
    <span
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-lg bg-foreground font-medium text-background text-xs",
        className
      )}
    >
      {name.slice(0, 1).toUpperCase()}
    </span>
  );

  if (!src) {
    return monogram;
  }

  return (
    <span
      className={cn(
        "grid size-9 shrink-0 place-items-center overflow-hidden rounded-lg bg-muted ring-1 ring-foreground/10",
        className
      )}
    >
      <img
        alt=""
        className="size-6 object-contain"
        height={36}
        onError={() => {
          setSourceIndex((current) => current + 1);
        }}
        src={src}
        width={36}
      />
    </span>
  );
}

const stackPhotos = [
  castPeople[0],
  castPeople[3],
  castPeople[13],
  castAnimals[0],
]
  .filter((person) => person !== undefined)
  .map((person) => ({
    ...person,
    src: `${person.src}?tr=w-640,h-800,f-auto`,
  }));

function StudioLogo({
  className,
  markOnly = false,
}: {
  className?: string;
  markOnly?: boolean;
}) {
  return (
    <svg
      aria-hidden
      className={cn("h-7 w-auto text-foreground", className)}
      fill="none"
      height="28"
      viewBox={markOnly ? "0 0 40 48" : "0 0 171 48"}
      width={markOnly ? "23" : "100"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m12.3463 5.5224c2.4265-1.00503 5.0273-1.5224 7.6537-1.5224v10c-1.3133 0-2.6136.2586-3.8269.7613-1.2132.5025-2.3156 1.239-3.2442 2.1676s-1.6651 2.031-2.1676 3.2442c-.5027 1.2133-.7613 2.5136-.7613 3.8269h-10c0-2.6264.517371-5.2272 1.5224-7.6537 1.00514-2.4265 2.47829-4.6312 4.33543-6.48847 1.85726-1.85714 4.06194-3.33029 6.48847-4.33543z"
        fill="var(--color-brand)"
      />
      <path
        d="m0 24c0 2.6264.517371 5.2272 1.5224 7.6537 1.00514 2.4265 2.47829 4.6312 4.33543 6.4885 1.85726 1.8571 4.06194 3.3303 6.48847 4.3354 2.4265 1.005 5.0273 1.5224 7.6537 1.5224s5.2272-.5174 7.6537-1.5224c2.4265-1.0051 4.6312-2.4783 6.4885-4.3354 1.8571-1.8573 3.3303-4.062 4.3354-6.4885 1.005-2.4265 1.5224-5.0273 1.5224-7.6537h-10c0 1.3133-.2586 2.6136-.7613 3.8269-.5025 1.2132-1.239 2.3156-2.1676 3.2442s-2.031 1.6651-3.2442 2.1676c-1.2133.5027-2.5136.7613-3.8269.7613s-2.6136-.2586-3.8269-.7613c-1.2132-.5025-2.3156-1.239-3.2442-2.1676s-1.6651-2.031-2.1676-3.2442c-.5027-1.2133-.7613-2.5136-.7613-3.8269z"
        fill="var(--color-brand)"
        opacity=".5"
      />
      <path
        d="m20.0004 17.6362c-3.5146 0-6.3637 2.8491-6.3637 6.3637h12.7273c0-3.5146-2.8491-6.3637-6.3636-6.3637z"
        fill="var(--color-brand)"
        opacity=".5"
      />
      <path
        d="m20.0004 30.3638c-3.5146 0-6.3637-2.8491-6.3637-6.3637h12.7273c0 3.5146-2.8491 6.3637-6.3636 6.3637z"
        fill="var(--color-brand)"
      />
      {markOnly ? null : (
        <g fill="currentColor">
          <path d="m55.8857 32.5138c-1.404-.594-2.484-1.485-3.24-2.646-.756-1.134-1.134-2.511-1.134-4.104h4.725c.027 1.188.432 2.133 1.242 2.781.783.675 1.89.999 3.294.999 1.35 0 2.43-.243 3.186-.756s1.134-1.215 1.134-2.106c0-.621-.216-1.107-.648-1.458-.432-.324-.945-.567-1.593-.729-.648-.135-1.539-.297-2.727-.459-1.674-.216-3.051-.459-4.104-.783-1.08-.297-1.998-.864-2.754-1.728s-1.134-2.079-1.134-3.699c0-1.323.324-2.484 1.026-3.483.675-.999 1.647-1.755 2.916-2.295 1.242-.54 2.727-.81 4.455-.81 1.674 0 3.186.297 4.509.864 1.296.594 2.322 1.404 3.078 2.457.729 1.053 1.107 2.295 1.107 3.699h-4.644c-.108-.972-.513-1.755-1.215-2.295s-1.674-.837-2.916-.837c-1.296 0-2.268.243-2.943.702-.702.459-1.026 1.107-1.026 1.944 0 .648.216 1.161.648 1.485.432.351.972.594 1.62.729.648.162 1.539.297 2.727.432 1.674.216 3.051.486 4.104.783s1.971.864 2.727 1.728 1.161 2.079 1.161 3.699c0 1.35-.351 2.511-1.053 3.537s-1.728 1.836-3.051 2.403c-1.323.594-2.889.864-4.698.864s-3.402-.297-4.779-.918z" />
          <path d="m74.417 32.4868c-1.134-.648-1.998-1.539-2.619-2.673s-.918-2.403-.918-3.861c0-1.431.297-2.7.918-3.834s1.485-1.998 2.619-2.646c1.107-.621 2.376-.945 3.807-.945 1.242 0 2.349.324 3.348.918s1.782 1.458 2.376 2.565c.567 1.134.864 2.403.864 3.861v1.296h-9.855c.081.945.405 1.674.945 2.214s1.323.783 2.349.783c.675 0 1.242-.162 1.674-.486s.702-.729.81-1.242h3.996c-.216 1.512-.945 2.727-2.133 3.645s-2.646 1.35-4.374 1.35c-1.431 0-2.7-.297-3.807-.945zm6.372-7.776c-.054-.81-.297-1.458-.783-1.971-.486-.486-1.134-.756-1.944-.756-.918 0-1.62.243-2.133.729s-.837 1.161-.945 1.998z" />
          <path d="m88.5758 37.6438c-1.188-.81-1.836-2.025-1.971-3.645h4.023c.054.621.378 1.08.918 1.377s1.242.432 2.133.432c1.08 0 1.89-.297 2.43-.918.54-.594.783-1.539.783-2.835v-.999c-.999 1.35-2.565 2.025-4.698 2.025-1.215 0-2.268-.27-3.186-.864-.918-.567-1.62-1.377-2.106-2.457-.513-1.08-.756-2.322-.756-3.753 0-1.458.243-2.754.756-3.888.486-1.134 1.215-1.998 2.133-2.646.918-.621 1.971-.945 3.159-.945 2.133 0 3.699.756 4.698 2.214v-1.542h4.0232v12.855c0 4.536-2.4842 6.777-7.4252 6.777-2.106 0-3.753-.378-4.914-1.188zm7.398-8.937c.621-.729.945-1.674.945-2.862 0-1.161-.324-2.133-.945-2.889-.648-.756-1.458-1.134-2.43-1.134-.999 0-1.809.378-2.457 1.134s-.945 1.728-.945 2.889.297 2.106.945 2.835c.621.756 1.431 1.107 2.457 1.107.972 0 1.782-.351 2.43-1.08z" />
          <path d="m103.103 19.1998h3.996v1.785c.486-.756 1.107-1.377 1.917-1.809s1.755-.648 2.835-.648c2.214 0 3.726.891 4.509 2.673 1.269-1.782 3.078-2.673 5.454-2.673 3.483 0 5.238 2.187 5.238 6.534v7.938h-4.077v-7.722c0-1.026-.243-1.809-.729-2.403s-1.161-.891-2.025-.891c-.972 0-1.755.351-2.322 1.053s-.837 1.62-.837 2.781v7.182h-4.05v-7.722c0-1.026-.243-1.809-.729-2.403s-1.161-.891-2.025-.891c-.972 0-1.755.351-2.322 1.053s-.837 1.62-.837 2.781v7.182h-3.996z" />
          <path d="m132.066 32.4868c-1.134-.648-1.998-1.539-2.619-2.673s-.918-2.403-.918-3.861c0-1.431.297-2.7.918-3.834s1.485-1.998 2.619-2.646c1.107-.621 2.376-.945 3.807-.945 1.242 0 2.349.324 3.348.918s1.782 1.458 2.376 2.565c.567 1.134.864 2.403.864 3.861v1.296h-9.855c.081.945.405 1.674.945 2.214s1.323.783 2.349.783c.675 0 1.242-.162 1.674-.486s.702-.729.81-1.242h3.996c-.216 1.512-.945 2.727-2.133 3.645s-2.646 1.35-4.374 1.35c-1.431 0-2.7-.297-3.807-.945zm6.372-7.776c-.054-.81-.297-1.458-.783-1.971-.486-.486-1.134-.756-1.944-.756-.918 0-1.62.243-2.133.729s-.837 1.161-.945 1.998z" />
          <path d="m144.146 19.1998h3.996v1.785c.486-.756 1.107-1.377 1.917-1.809s1.755-.648 2.835-.648c3.456 0 5.211 2.187 5.211 6.534v7.938h-4.05v-7.722c0-1.026-.243-1.809-.729-2.403s-1.161-.891-2.025-.891c-.972 0-1.755.351-2.322 1.053s-.837 1.62-.837 2.781v7.182h-3.996z" />
          <path d="m166.065 33.1078c-1.08 0-1.917-.108-2.511-.324-.621-.216-1.08-.594-1.35-1.161-.297-.567-.432-1.377-.405-2.403v-6.615h-2.997v-3.645h2.997v-3.78h3.996v3.78h3.672v3.645h-3.672v4.563c0 .702.027 1.188.081 1.485.054.324.216.54.432.675s.567.189 1.08.189c.378 0 1.461-.027 2.082-.081v3.537c-1.215.108-2.73.135-3.405.135z" />
        </g>
      )}
    </svg>
  );
}

export function HeroStage() {
  const shouldReduceMotion = useReducedMotion();
  const playClick = useUiSound("/sounds/button.wav", 0.4);
  const [view, setView] = useState<ViewId>("landing");

  return (
    <div className="@container mask-[radial-gradient(ellipse_80%_95%_at_50%_0%,#000_80%,transparent_100%)] relative z-10 border-b pt-12 lg:pt-20">
      <div className="pb-2">
        <div className="mx-auto flex max-w-3xl items-center justify-center gap-1 px-4 md:gap-2 md:px-11">
          <div
            aria-label="Previews"
            className="relative z-20 grid w-full grid-cols-3 items-center justify-center *:h-14"
            role="tablist"
          >
            {VIEWS.map((item) => {
              const selected = item.id === view;
              const Icon = item.icon;
              return (
                <button
                  aria-selected={selected}
                  className="group flex cursor-pointer items-center justify-center px-2"
                  id={`hero-tab-${item.id}`}
                  key={item.id}
                  onClick={() => {
                    setView(item.id);
                    playClick();
                  }}
                  role="tab"
                  type="button"
                >
                  <span
                    className={cn(
                      "flex h-10 items-center gap-2 rounded-full px-4 text-sm ring-1 transition-[transform,background-color,color,box-shadow] duration-150 group-active:scale-[0.99] [&>svg]:size-4",
                      selected
                        ? "bg-card text-foreground shadow-md shadow-primary/10 ring-border-illustration"
                        : "bg-background/70 text-foreground/75 ring-foreground/15 group-hover:bg-foreground/5 group-hover:text-foreground group-hover:ring-foreground/25"
                    )}
                  >
                    <Icon className="size-4" />
                    <span className="max-md:sr-only">{item.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative mx-auto -mt-2 max-w-6xl max-md:mx-1 lg:px-10">
        <div className="aspect-square rounded-2xl bg-card p-1 shadow-2xl shadow-black/25 ring-1 ring-foreground/10 backdrop-blur sm:aspect-[3/2]">
          <div
            aria-labelledby={`hero-tab-${view}`}
            className="relative aspect-square origin-top overflow-hidden rounded-xl border-4 border-transparent border-l-8 bg-card shadow ring-1 ring-foreground/5 sm:aspect-[3/2] dark:bg-background"
            role="tabpanel"
          >
            <motion.div
              animate={{ opacity: 1 }}
              className="h-full min-h-0"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              key={view}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.25, ease: [0.23, 1, 0.32, 1] }
              }
            >
              {view === "landing" ? <LandingView /> : null}
              {view === "dashboard" ? <DashboardView /> : null}
              {view === "experiment" ? <ExperimentView /> : null}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LandingView() {
  const playClick = useUiSound("/sounds/button.wav", 0.35);
  const heroUrl = LANDING_HERO_SCENE
    ? sceneSrc(LANDING_HERO_SCENE.id, "w-1600")
    : sceneSrc("terracotta-dunes", "w-1600");

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      <header className="relative z-20 flex items-center justify-between gap-3 px-4 py-3 md:px-5">
        <StudioLogo className="h-6" />
        <Button
          onClick={() => playClick()}
          size="sm"
          type="button"
          variant="outline"
        >
          Start free
        </Button>
      </header>

      <div className="relative z-10 flex justify-center px-4">
        <div className="relative flex flex-wrap items-center justify-center gap-2 py-1">
          <span className="rounded-full bg-foreground px-2 py-0.5 text-[10px] text-background">
            New
          </span>
          <button
            className="group flex items-center gap-1.5 text-foreground/80 text-xs hover:text-foreground"
            onClick={() => playClick()}
            type="button"
          >
            Meet Studio 2 — motion that ships
            <svg
              aria-hidden
              className="size-3.5 opacity-50 transition-opacity group-hover:opacity-100"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-5 py-3 text-center md:py-4">
        <h2 className="text-balance font-semibold font-title text-foreground text-xl leading-[1.1] tracking-tight md:text-2xl lg:text-3xl">
          Unlock growth with quieter analytics
        </h2>
        <p className="mx-auto mt-2 mb-3 max-w-lg text-balance text-muted-foreground text-xs md:text-sm">
          Give your team insights that drive conversions, tighten pipelines, and
          keep the fold calm.
        </p>
        <Button
          onClick={() => playClick()}
          size="sm"
          type="button"
          variant="candy"
        >
          Book a demo
        </Button>
      </div>

      <div className="relative min-h-0 flex-1 border-border border-y">
        <div className="mask-t-from-25% absolute inset-0 overflow-hidden">
          <img
            alt=""
            className="absolute inset-0 size-full scale-110 object-cover object-top blur-xl dark:opacity-50"
            height={900}
            src={heroUrl}
            width={1600}
          />
          <div className="absolute inset-0 bg-background/20 dark:bg-foreground/10" />
        </div>

        <div className="relative flex h-full items-start justify-center px-4 py-4 md:px-8 md:py-6">
          <div className="relative w-full max-w-3xl rounded-2xl border border-transparent bg-card/90 p-3 shadow-black/10 shadow-md ring-1 ring-border-illustration backdrop-blur-sm md:p-4">
            <div className="mb-3">
              <p className="font-medium text-foreground text-sm">Customers</p>
              <p className="mt-0.5 line-clamp-1 text-muted-foreground text-xs">
                New seats by primary channel this week
              </p>
            </div>
            <div className="mask-b-from-55% overflow-hidden">
              <table className="w-full min-w-[28rem] border-collapse text-left text-xs">
                <thead className="bg-foreground/5">
                  <tr className="*:border *:border-border *:px-2.5 *:py-1.5 *:font-medium">
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Revenue</th>
                    <th>ARR</th>
                    <th className="max-md:hidden">Next</th>
                  </tr>
                </thead>
                <tbody className="text-foreground/75">
                  {CUSTOMERS.map((row) => (
                    <tr
                      className="*:border *:border-border *:px-2.5 *:py-1.5"
                      key={row.name}
                    >
                      <td className="font-medium text-foreground">
                        {row.name}
                      </td>
                      <td>{row.date}</td>
                      <td>{row.revenue}</td>
                      <td>{row.arr}</td>
                      <td className="max-md:hidden">{row.next}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-3 gap-2 px-4 py-3 md:grid-cols-6 md:px-6">
        {LOGO_STRIP.map((name) => (
          <div className="flex h-8 items-center justify-center" key={name}>
            <span className="select-none font-medium text-[10px] text-foreground/45 tracking-wide md:text-xs">
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardView() {
  const shouldReduceMotion = useReducedMotion();
  const playClick = useUiSound("/sounds/button.wav", 0.35);
  const [section, setSection] = useState<DashSection>("overview");
  const [activeKpi, setActiveKpi] = useState<
    (typeof KPIS)[number]["id"] | null
  >(null);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const activity = useMemo(
    () =>
      ACTIVITY.filter((item) => !dismissed.includes(item.id)).filter((item) =>
        activeKpi ? item.kpi === activeKpi : true
      ),
    [activeKpi, dismissed]
  );

  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    const onPointerDown = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <div className="flex h-full bg-background">
      <aside className="flex w-14 shrink-0 flex-col border-border border-r bg-card py-3 md:w-44 md:px-2">
        <div className="mb-4 flex justify-center px-2 md:justify-start md:px-3">
          <StudioLogo className="h-6 md:hidden" markOnly />
          <StudioLogo className="hidden h-6 md:block" />
        </div>
        <nav aria-label="Dashboard" className="flex flex-1 flex-col gap-1">
          {DASH_NAV.map((item) => {
            const Icon = item.icon;
            const active = item.id === section;
            return (
              <button
                className={cn(
                  "mx-1 flex items-center gap-2 rounded-lg px-2 py-2 text-left text-xs transition-colors duration-150 md:px-3",
                  active
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                )}
                key={item.id}
                onClick={() => {
                  setSection(item.id);
                  playClick();
                }}
                type="button"
              >
                <Icon className="size-4 shrink-0" />
                <span className="hidden truncate md:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="mt-auto flex items-center gap-2 px-2 pt-3 md:px-3">
          <img
            alt=""
            className="size-7 rounded-full object-cover"
            height={56}
            src={stackPhotos[0]?.src}
            width={56}
          />
          <div className="hidden min-w-0 md:block">
            <p className="truncate font-medium text-foreground text-xs">
              {stackPhotos[0]?.name ?? "Maya Solis"}
            </p>
            <p className="truncate text-[10px] text-muted-foreground">Admin</p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-border border-b px-4 py-3 md:px-5">
          <div>
            <p className="text-muted-foreground text-xs">Monday · Sep 27</p>
            <h2 className="font-medium text-foreground text-sm md:text-base">
              {DASH_NAV.find((item) => item.id === section)?.label ??
                "Overview"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label="Notifications"
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-foreground transition-colors duration-150 hover:bg-foreground/10"
              onClick={() => playClick()}
              type="button"
            >
              <IconBellFill24 className="size-3.5" />
            </button>
            <div
              className="relative flex size-8 shrink-0 items-center justify-center"
              ref={menuRef}
            >
              <button
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                aria-label="Account menu"
                className="inline-flex size-8 items-center justify-center overflow-hidden rounded-full outline-none ring-1 ring-foreground/10 ring-offset-background transition-transform duration-150 hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]"
                onClick={() => {
                  setMenuOpen((value) => !value);
                  playClick();
                }}
                type="button"
              >
                <img
                  alt=""
                  className="size-8 rounded-full object-cover"
                  height={64}
                  src={stackPhotos[0]?.src}
                  width={64}
                />
              </button>
              <AnimatePresence>
                {menuOpen ? (
                  <motion.div
                    animate={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : { opacity: 1, scale: 1, y: 0 }
                    }
                    className="absolute top-[calc(100%+0.5rem)] right-0 z-50 min-w-40 origin-top-right rounded-xl bg-card p-1 shadow-lg ring-1 ring-foreground/10"
                    exit={
                      shouldReduceMotion
                        ? { opacity: 0, transition: { duration: 0 } }
                        : { opacity: 0, scale: 0.96, y: -4 }
                    }
                    initial={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : { opacity: 0, scale: 0.96, y: -4 }
                    }
                    role="menu"
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { bounce: 0.1, duration: 0.25, type: "spring" }
                    }
                  >
                    {(
                      [
                        { id: "profile", label: "Profile" },
                        { id: "settings", label: "Settings" },
                        { id: "team", label: "Team" },
                        { danger: true, id: "logout", label: "Log out" },
                      ] as const
                    ).map((item, index) => (
                      <div key={item.id}>
                        {item.id === "team" || item.id === "logout" ? (
                          <div className="my-1 h-px bg-border" />
                        ) : null}
                        <button
                          className={cn(
                            "flex w-full rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors duration-150",
                            "danger" in item && item.danger
                              ? "text-destructive hover:bg-destructive/10"
                              : "text-foreground hover:bg-muted"
                          )}
                          onClick={() => {
                            if (item.id === "settings") {
                              setSection("settings");
                            }
                            if (item.id === "team") {
                              setSection("team");
                            }
                            setMenuOpen(false);
                            playClick();
                          }}
                          role="menuitem"
                          style={
                            shouldReduceMotion
                              ? undefined
                              : { transitionDelay: `${index * 20}ms` }
                          }
                          type="button"
                        >
                          {item.label}
                        </button>
                      </div>
                    ))}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <div className="flex-1 space-y-4 overflow-auto p-4 md:p-5">
          {section === "overview" ? (
            <>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {KPIS.map((kpi) => {
                  const selected = activeKpi === kpi.id;
                  return (
                    <button
                      aria-pressed={selected}
                      className={cn(
                        "rounded-xl p-3 text-left ring-1 transition-colors duration-150",
                        selected
                          ? "bg-foreground text-background ring-foreground"
                          : "bg-card ring-foreground/8 hover:bg-muted"
                      )}
                      key={kpi.id}
                      onClick={() => {
                        setActiveKpi((current) =>
                          current === kpi.id ? null : kpi.id
                        );
                        playClick();
                      }}
                      type="button"
                    >
                      <p
                        className={cn(
                          "text-xs",
                          selected
                            ? "text-background/70"
                            : "text-muted-foreground"
                        )}
                      >
                        {kpi.label}
                      </p>
                      <p className="mt-1 font-semibold font-title text-xl tracking-tight">
                        {kpi.value}
                      </p>
                      <p
                        className={cn(
                          "mt-2 inline-flex items-center gap-1 text-[11px]",
                          selected && "text-background/80",
                          !(selected || kpi.up) && "text-muted-foreground",
                          !(selected || !kpi.up) && "text-foreground"
                        )}
                      >
                        <IconArrowTrendUpFill24
                          className={cn(
                            "size-3",
                            !kpi.up && "rotate-180 opacity-70"
                          )}
                        />
                        {kpi.change}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="grid min-h-0 gap-3 md:grid-cols-[1.4fr_1fr]">
                <EdgeRequestsChart
                  activeKpi={activeKpi}
                  shouldReduceMotion={shouldReduceMotion}
                />

                <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/8">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <p className="font-medium text-foreground text-sm">
                      Recent activity
                    </p>
                    {activeKpi || dismissed.length > 0 ? (
                      <button
                        className="text-muted-foreground text-xs hover:text-foreground"
                        onClick={() => {
                          setActiveKpi(null);
                          setDismissed([]);
                          playClick();
                        }}
                        type="button"
                      >
                        Reset
                      </button>
                    ) : null}
                  </div>
                  <ul className="space-y-1.5">
                    <AnimatePresence initial={false}>
                      {activity.map((item) => {
                        const person =
                          item.kind === "person" && "personIndex" in item
                            ? stackPhotos[item.personIndex]
                            : undefined;
                        const domain =
                          "domain" in item ? item.domain : undefined;
                        return (
                          <motion.li
                            animate={{ height: "auto", opacity: 1 }}
                            className="overflow-hidden"
                            exit={{ height: 0, opacity: 0 }}
                            initial={{ height: 0, opacity: 0 }}
                            key={item.id}
                            transition={{ duration: 0.2 }}
                          >
                            <button
                              className="flex w-full items-center gap-2.5 rounded-lg px-1 py-1.5 text-left hover:bg-muted"
                              onClick={() => {
                                setDismissed((current) => [
                                  ...current,
                                  item.id,
                                ]);
                                playClick();
                              }}
                              type="button"
                            >
                              {person ? (
                                <img
                                  alt=""
                                  className="size-7 shrink-0 rounded-full object-cover ring-1 ring-foreground/10"
                                  height={56}
                                  src={person.src}
                                  width={56}
                                />
                              ) : "mark" in item ? (
                                <span
                                  className={cn(
                                    "grid size-7 shrink-0 place-items-center rounded-full font-medium text-[10px]",
                                    item.markClass
                                  )}
                                >
                                  {item.mark}
                                </span>
                              ) : domain ? (
                                <ProjectLogo
                                  className="size-7 rounded-full [&_img]:size-4"
                                  domain={domain}
                                  name={item.title}
                                />
                              ) : (
                                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-muted font-medium text-[10px] text-foreground">
                                  ·
                                </span>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-foreground text-xs">
                                  {item.title}
                                </p>
                                <p className="truncate text-[10px] text-muted-foreground">
                                  {item.meta}
                                </p>
                              </div>
                            </button>
                          </motion.li>
                        );
                      })}
                    </AnimatePresence>
                    {activity.length === 0 ? (
                      <li className="text-muted-foreground text-xs">
                        Nothing left in this filter.
                      </li>
                    ) : null}
                  </ul>
                </div>
              </div>
            </>
          ) : null}

          {section === "projects" ? (
            <div className="space-y-2">
              {PROJECTS.map((project) => (
                <button
                  className="flex w-full items-center gap-3 rounded-xl bg-card p-3 text-left ring-1 ring-foreground/8 transition-colors duration-150 hover:bg-muted"
                  key={project.id}
                  onClick={() => {
                    setSection("deployments");
                    playClick();
                  }}
                  type="button"
                >
                  <ProjectLogo domain={project.domain} name={project.name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium text-foreground text-sm">
                        {project.name}
                      </p>
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 text-[10px]",
                          project.tone === "ok" &&
                            "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
                          project.tone === "pending" &&
                            "bg-amber-500/15 text-amber-700 dark:text-amber-400",
                          project.tone === "error" &&
                            "bg-destructive/15 text-destructive"
                        )}
                      >
                        {project.status}
                      </span>
                    </div>
                    <p className="truncate text-muted-foreground text-xs">
                      {project.framework} ·{" "}
                      {project.href.replace("https://", "")}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : null}

          {section === "deployments" ? (
            <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/8">
              <div className="border-border border-b px-4 py-3">
                <p className="font-medium text-foreground text-sm">
                  Deployments
                </p>
                <p className="text-muted-foreground text-xs">
                  Latest builds across the team
                </p>
              </div>
              <ul>
                {DEPLOYS.map((deploy) => (
                  <li
                    className="flex items-center gap-3 border-border border-b px-4 py-3 last:border-b-0"
                    key={deploy.id}
                  >
                    <ProjectLogo
                      className="size-8 [&_img]:size-5"
                      domain={deploy.domain}
                      name={deploy.project}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-foreground text-xs">
                        <span className="font-medium">{deploy.project}</span>
                        {" · "}
                        {deploy.commit}
                      </p>
                      <p className="truncate text-[10px] text-muted-foreground">
                        {deploy.branch} · {deploy.time}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-1.5 py-0.5 text-[10px]",
                        deploy.tone === "ok" &&
                          "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
                        deploy.tone === "pending" &&
                          "bg-amber-500/15 text-amber-700 dark:text-amber-400",
                        deploy.tone === "error" &&
                          "bg-destructive/15 text-destructive"
                      )}
                    >
                      {deploy.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {section === "team" || section === "settings" ? (
            <div className="rounded-xl bg-card p-6 ring-1 ring-foreground/8">
              <p className="font-medium text-foreground text-sm">
                {section === "team" ? "Team" : "Settings"}
              </p>
              <p className="mt-2 max-w-sm text-muted-foreground text-sm">
                {section === "team"
                  ? "Maya, Luca, and Nora ship to Production. Invite another seat from Overview."
                  : "Domains, env vars, and deploy hooks live here in the full product."}
              </p>
              <div className="mt-4 flex -space-x-2">
                {stackPhotos.slice(0, 3).map((person) => (
                  <img
                    alt=""
                    className="size-8 rounded-full object-cover ring-2 ring-card"
                    height={64}
                    key={person.id}
                    src={person.src}
                    width={64}
                  />
                ))}
              </div>
              <Button
                className="mt-4"
                onClick={() => {
                  setSection("overview");
                  playClick();
                }}
                size="sm"
                type="button"
                variant="outline"
              >
                Back to Overview
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ExperimentView() {
  if (!EXPERIMENT_SCENE) {
    return null;
  }

  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden">
      <img
        alt=""
        className="absolute inset-0 size-full scale-110 object-cover blur-xl"
        height={900}
        src={sceneSrc(EXPERIMENT_SCENE.id, "w-1400")}
        width={1400}
      />
      <div className="absolute inset-0 bg-foreground/10" />
      <div className="relative">
        <PhotoStack photos={stackPhotos} />
      </div>
    </div>
  );
}
