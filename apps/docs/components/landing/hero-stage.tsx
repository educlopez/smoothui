"use client";

import { HeroDither } from "@docs/components/landing/hero-dither";
import { Button } from "@docs/components/smoothbutton";
import { useUiSound } from "@docs/components/sound-provider";
import { sceneSrc } from "@docs/examples/shared/demo-fixtures";
import { cn } from "@repo/shadcn-ui/lib/utils";
import PhotoStack from "@repo/smoothui/components/photo-stack";
import { castAnimals, castPeople } from "@smoothui/data/cast";
import { landscapes } from "@smoothui/data/scenes";
import { motion, useReducedMotion } from "motion/react";
import {
  IconArrowTrendUpFill24,
  IconBellFill24,
  IconChartBarTrendUpFill24,
  IconFolderImageFill24,
  IconGearFill24,
  IconGrid2Fill24,
  IconHouse4Fill24,
  IconImageSparkleFill24,
  IconLayersStackedFill24,
  IconSparkleFill24,
  IconUsersFill24,
} from "nucleo-core-fill-24";
import { useEffect, useRef, useState } from "react";

const VIEWS = [
  { icon: IconHouse4Fill24, id: "landing", label: "Landing" },
  { icon: IconGrid2Fill24, id: "dashboard", label: "Dashboard" },
  { icon: IconSparkleFill24, id: "experiment", label: "Experiment" },
] as const;

type ViewId = (typeof VIEWS)[number]["id"];

const LANDING_SCENE = landscapes[1] ?? landscapes[0];
const LANDING_FEATURE_SCENES = [
  landscapes[0],
  landscapes[2],
  landscapes[5],
].filter((scene) => scene !== undefined);
const EXPERIMENT_SCENE = landscapes[4] ?? landscapes[0];

const LANDING_FEATURES = [
  {
    description: "Spring physics that stay under a quarter second.",
    icon: IconSparkleFill24,
    title: "Motion first",
  },
  {
    description: "Install once, restyle with the tokens you already use.",
    icon: IconLayersStackedFill24,
    title: "Drop in",
  },
  {
    description: "Reduced motion is a first-class path, not an afterthought.",
    icon: IconImageSparkleFill24,
    title: "Accessible",
  },
] as const;

const DASH_NAV = [
  { icon: IconHouse4Fill24, id: "overview", label: "Overview" },
  { icon: IconImageSparkleFill24, id: "generations", label: "Generations" },
  { icon: IconFolderImageFill24, id: "library", label: "Library" },
  { icon: IconUsersFill24, id: "team", label: "Team" },
  { icon: IconGearFill24, id: "settings", label: "Settings" },
] as const;

const KPIS = [
  {
    change: "+12.4%",
    label: "Revenue",
    up: true,
    value: "$48.2k",
  },
  {
    change: "+8.1%",
    label: "Active users",
    up: true,
    value: "12,480",
  },
  {
    change: "+21%",
    label: "Generations",
    up: true,
    value: "3,912",
  },
  {
    change: "−1.8%",
    label: "Bounce",
    up: false,
    value: "24.6%",
  },
] as const;

const CHART_BARS = [38, 52, 44, 68, 61, 78, 72, 86, 80, 94, 88, 100] as const;

const ACTIVITY = [
  {
    meta: "2m ago · Maya",
    title: "Late light dunes exported",
  },
  {
    meta: "18m ago · Luca",
    title: "Team seat invited",
  },
  {
    meta: "1h ago · System",
    title: "Weekly digest sent",
  },
  {
    meta: "3h ago · Nora",
    title: "Library folder renamed",
  },
] as const;

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

export function HeroStage({ src }: { src: string }) {
  const shouldReduceMotion = useReducedMotion();
  const playClick = useUiSound("/sounds/button.wav", 0.4);
  const stageRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<ViewId>("landing");
  const [stageSize, setStageSize] = useState({ height: 0, width: 0 });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) {
      return;
    }
    const measure = () => {
      const box = stage.getBoundingClientRect();
      setStageSize({ height: box.height, width: box.width });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative mt-16 w-full" ref={stageRef}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-full"
      >
        <img
          alt=""
          className="size-full object-cover"
          height={573}
          src={src}
          width={1024}
        />
        <HeroDither
          height={stageSize.height}
          onFallback={() => undefined}
          src={src}
          width={stageSize.width}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto max-w-3xl border-border border-x bg-background">
          <div
            aria-label="Previews"
            className="grid grid-cols-3 border-border border-y"
            role="tablist"
          >
            {VIEWS.map((item) => {
              const selected = item.id === view;
              const Icon = item.icon;
              return (
                <button
                  aria-selected={selected}
                  className="group flex h-16 cursor-pointer items-center justify-center border-border border-r px-2 last:border-r-0"
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
                      "flex h-10 items-center gap-2 rounded-full px-4 text-sm ring-1 ring-border transition-colors duration-150",
                      selected
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground group-hover:bg-foreground/5 group-hover:text-foreground"
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

        <div
          aria-labelledby={`hero-tab-${view}`}
          className="mx-auto -mt-px min-h-[32rem] overflow-hidden rounded-2xl bg-card shadow-lg ring-1 ring-foreground/10 md:min-h-[36rem]"
          role="tabpanel"
        >
          <motion.div
            animate={{ opacity: 1 }}
            className="h-full"
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
  );
}

function LandingView() {
  if (!LANDING_SCENE) {
    return null;
  }

  return (
    <div className="flex h-full min-h-[32rem] flex-col bg-background md:min-h-[36rem]">
      <header className="flex items-center justify-between gap-3 border-border border-b px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-full bg-foreground text-[10px] text-background">
            S
          </span>
          <span className="font-medium text-foreground text-sm">Studio</span>
        </div>
        <nav
          aria-label="Landing preview"
          className="hidden items-center gap-4 text-muted-foreground text-xs md:flex"
        >
          <span>Product</span>
          <span>Pricing</span>
          <span>Customers</span>
        </nav>
        <Button size="sm" type="button" variant="candy">
          Start free
        </Button>
      </header>

      <div className="grid flex-1 gap-6 p-4 md:grid-cols-[1.05fr_0.95fr] md:gap-8 md:p-6">
        <div className="flex flex-col justify-center">
          <p className="font-medium text-muted-foreground text-xs uppercase tracking-[0.16em]">
            A quiet page
          </p>
          <h2 className="mt-3 text-balance font-semibold font-title text-3xl text-foreground tracking-tight md:text-4xl lg:text-5xl">
            Built to be opened.
          </h2>
          <p className="mt-4 max-w-md text-pretty text-foreground/70 text-sm leading-relaxed md:text-base">
            A headline, two actions, and a photograph that holds the fold. The
            rest of the page earns its place below.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="sm" type="button" variant="candy">
              Get started
            </Button>
            <Button size="sm" type="button" variant="outline">
              See the work
            </Button>
          </div>
          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2">
              {stackPhotos.slice(0, 3).map((person) => (
                <img
                  alt=""
                  className="size-8 rounded-full object-cover ring-2 ring-background"
                  height={64}
                  key={person.id}
                  src={person.src}
                  width={64}
                />
              ))}
            </div>
            <p className="text-muted-foreground text-xs">
              Trusted by teams shipping motion every week
            </p>
          </div>
        </div>

        <div className="relative min-h-52 overflow-hidden rounded-2xl ring-1 ring-foreground/10 md:min-h-0">
          <img
            alt={LANDING_SCENE.alt}
            className="absolute inset-0 size-full object-cover"
            height={900}
            src={sceneSrc(LANDING_SCENE.id, "w-1200")}
            width={1200}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/55 to-transparent p-4 pt-16">
            <p className="font-medium text-background text-sm">
              Terracotta dunes
            </p>
            <p className="text-background/80 text-xs">Hero still · 16:9</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 border-border border-t p-4 md:grid-cols-3 md:p-5">
        {LANDING_FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          const scene = LANDING_FEATURE_SCENES[index];
          return (
            <div
              className="rounded-xl bg-card p-3 ring-1 ring-foreground/8"
              key={feature.title}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-muted text-foreground">
                  <Icon className="size-4" />
                </span>
                {scene ? (
                  <img
                    alt=""
                    className="size-10 rounded-lg object-cover"
                    height={80}
                    src={sceneSrc(scene.id, "w-160")}
                    width={80}
                  />
                ) : null}
              </div>
              <p className="font-medium text-foreground text-sm">
                {feature.title}
              </p>
              <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DashboardView() {
  return (
    <div className="flex h-full min-h-[32rem] bg-background md:min-h-[36rem]">
      <aside className="flex w-14 shrink-0 flex-col border-border border-r bg-card py-3 md:w-44 md:px-2">
        <div className="mb-4 flex items-center gap-2 px-2 md:px-3">
          <span className="grid size-7 place-items-center rounded-lg bg-foreground text-[10px] text-background">
            S
          </span>
          <span className="hidden font-medium text-foreground text-sm md:inline">
            Studio
          </span>
        </div>
        <nav aria-label="Dashboard" className="flex flex-1 flex-col gap-1">
          {DASH_NAV.map((item) => {
            const Icon = item.icon;
            const active = item.id === "overview";
            return (
              <span
                className={cn(
                  "mx-1 flex items-center gap-2 rounded-lg px-2 py-2 text-xs md:px-3",
                  active
                    ? "bg-foreground text-background"
                    : "text-muted-foreground"
                )}
                key={item.id}
              >
                <Icon className="size-4 shrink-0" />
                <span className="hidden truncate md:inline">{item.label}</span>
              </span>
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
              Overview
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-full bg-muted text-foreground">
              <IconBellFill24 className="size-3.5" />
            </span>
            <Button size="sm" type="button" variant="outline">
              Export
            </Button>
          </div>
        </header>

        <div className="flex-1 space-y-4 overflow-hidden p-4 md:p-5">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {KPIS.map((kpi) => (
              <div
                className="rounded-xl bg-card p-3 ring-1 ring-foreground/8"
                key={kpi.label}
              >
                <p className="text-muted-foreground text-xs">{kpi.label}</p>
                <p className="mt-1 font-semibold font-title text-foreground text-xl tracking-tight">
                  {kpi.value}
                </p>
                <p
                  className={cn(
                    "mt-2 inline-flex items-center gap-1 text-[11px]",
                    kpi.up ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  <IconArrowTrendUpFill24
                    className={cn("size-3", !kpi.up && "rotate-180 opacity-70")}
                  />
                  {kpi.change}
                </p>
              </div>
            ))}
          </div>

          <div className="grid min-h-0 flex-1 gap-3 md:grid-cols-[1.4fr_1fr]">
            <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/8">
              <div className="mb-4 flex items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-foreground text-sm">
                    Weekly volume
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Generations across the team
                  </p>
                </div>
                <IconChartBarTrendUpFill24 className="size-4 text-muted-foreground" />
              </div>
              <div className="flex h-32 items-end gap-1.5 md:h-40">
                {CHART_BARS.map((height, index) => (
                  <div
                    aria-hidden
                    className="flex-1 rounded-t-md bg-foreground"
                    key={`bar-${height}-${index}`}
                    style={{
                      height: `${height}%`,
                      opacity: 0.35 + height / 200,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/8">
              <p className="font-medium text-foreground text-sm">
                Recent activity
              </p>
              <ul className="mt-3 space-y-3">
                {ACTIVITY.map((item) => (
                  <li className="flex gap-3" key={item.title}>
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-foreground" />
                    <div className="min-w-0">
                      <p className="truncate text-foreground text-xs">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {item.meta}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
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
    <div className="relative flex min-h-[32rem] items-center justify-center overflow-hidden md:min-h-[36rem]">
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
