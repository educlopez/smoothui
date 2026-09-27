"use client";

import { Button } from "@docs/components/smoothbutton";
import { useUiSound } from "@docs/components/sound-provider";
import { sceneSrc } from "@docs/examples/shared/demo-fixtures";
import { cn } from "@repo/shadcn-ui/lib/utils";
import DitherChart from "@repo/smoothui/components/dither-chart";
import DitherImage from "@repo/smoothui/components/dither-image";
import PhotoStack from "@repo/smoothui/components/photo-stack";
import ShaderRevealTransition from "@repo/smoothui/components/shader-reveal-transition";
import { castAnimals, castPeople } from "@smoothui/data/cast";
import { landscapes } from "@smoothui/data/scenes";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  IconArrowTrendUpFill24,
  IconBellFill24,
  IconFolderImageFill24,
  IconGearFill24,
  IconGrid2Fill24,
  IconHouse4Fill24,
  IconImageSparkleFill24,
  IconLayersStackedFill24,
  IconSparkleFill24,
  IconUsersFill24,
} from "nucleo-core-fill-24";
import { useMemo, useState } from "react";

const VIEWS = [
  { icon: IconHouse4Fill24, id: "landing", label: "Landing" },
  { icon: IconGrid2Fill24, id: "dashboard", label: "Dashboard" },
  { icon: IconSparkleFill24, id: "experiment", label: "Experiment" },
] as const;

type ViewId = (typeof VIEWS)[number]["id"];

const LANDING_SCENES = [
  landscapes[1],
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

type DashSection = (typeof DASH_NAV)[number]["id"];

const KPIS = [
  {
    change: "+12.4%",
    id: "revenue",
    label: "Revenue",
    up: true,
    value: "$48.2k",
  },
  {
    change: "+8.1%",
    id: "users",
    label: "Active users",
    up: true,
    value: "12,480",
  },
  {
    change: "+21%",
    id: "gens",
    label: "Generations",
    up: true,
    value: "3,912",
  },
  { change: "−1.8%", id: "bounce", label: "Bounce", up: false, value: "24.6%" },
] as const;

const ACTIVITY = [
  {
    id: "a1",
    kpi: "gens",
    meta: "2m ago · Maya",
    title: "Late light dunes exported",
  },
  {
    id: "a2",
    kpi: "users",
    meta: "18m ago · Luca",
    title: "Team seat invited",
  },
  {
    id: "a3",
    kpi: "revenue",
    meta: "1h ago · System",
    title: "Weekly digest sent",
  },
  {
    id: "a4",
    kpi: "gens",
    meta: "3h ago · Nora",
    title: "Library folder renamed",
  },
] as const;

const CHART_DATA = [
  {
    name: "Generations",
    points: [
      { label: "W1", value: 38 },
      { label: "W2", value: 52 },
      { label: "W3", value: 44 },
      { label: "W4", value: 68 },
      { label: "W5", value: 61 },
      { label: "W6", value: 78 },
      { label: "W7", value: 72 },
      { label: "W8", value: 86 },
      { label: "W9", value: 80 },
      { label: "W10", value: 94 },
      { label: "W11", value: 88 },
      { label: "W12", value: 100 },
    ],
  },
];

const PIXEL_STEPS = [2, 4, 6, 8] as const;

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

export function HeroStage({ src: _src }: { src: string }) {
  const shouldReduceMotion = useReducedMotion();
  const playClick = useUiSound("/sounds/button.wav", 0.4);
  const [view, setView] = useState<ViewId>("landing");

  return (
    <div className="@container relative z-10 border-background border-b pt-8 [mask-image:radial-gradient(ellipse_80%_95%_at_50%_0%,#000_72%,transparent_100%)] md:pt-12">
      <div className="border-border-illustration border-y pb-2">
        <div className="mx-auto max-w-3xl px-4 md:px-11">
          <div
            aria-label="Previews"
            className="relative z-20 grid grid-cols-3 items-center justify-center gap-px divide-x divide-border-illustration border-border-illustration border-x *:h-16"
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
                      "flex h-10 items-center gap-2 rounded-full px-4 text-sm ring-1 ring-border-illustration transition-[transform,background-color,color,box-shadow] duration-150 group-active:scale-[0.99] [&>svg]:size-4",
                      selected
                        ? "bg-card text-foreground shadow-md shadow-primary/10"
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
      </div>

      <div className="relative mx-auto -mt-2 max-w-6xl max-md:mx-1 lg:px-10">
        <div className="rounded-2xl bg-card/90 p-1 shadow-2xl shadow-black/25 ring-1 ring-foreground/10 backdrop-blur-sm">
          <div
            aria-labelledby={`hero-tab-${view}`}
            className="relative min-h-[32rem] origin-top overflow-hidden rounded-xl border-4 border-transparent border-l-8 bg-card shadow ring-1 ring-foreground/5 md:min-h-[36rem] dark:bg-background"
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
    </div>
  );
}

function LandingView() {
  const playClick = useUiSound("/sounds/button.wav", 0.35);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [ditherOn, setDitherOn] = useState(true);
  const [pixelSize, setPixelSize] = useState<(typeof PIXEL_STEPS)[number]>(4);
  const scene = LANDING_SCENES[sceneIndex] ?? LANDING_SCENES[0];

  if (!scene) {
    return null;
  }

  const sceneUrl = sceneSrc(scene.id, "w-1200");

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
        <Button
          onClick={() => playClick()}
          size="sm"
          type="button"
          variant="candy"
        >
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
            Click a feature to swap the still. Toggle the dither shader and
            scrub the grain — the fold reacts.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              onClick={() => playClick()}
              size="sm"
              type="button"
              variant="candy"
            >
              Get started
            </Button>
            <Button
              onClick={() => {
                setDitherOn((value) => !value);
                playClick();
              }}
              size="sm"
              type="button"
              variant="outline"
            >
              {ditherOn ? "Photo clear" : "Apply dither"}
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground text-xs">Grain</span>
            {PIXEL_STEPS.map((step) => (
              <button
                aria-pressed={pixelSize === step}
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs ring-1 ring-border transition-colors duration-150",
                  pixelSize === step
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                )}
                disabled={!ditherOn}
                key={step}
                onClick={() => {
                  setPixelSize(step);
                  playClick();
                }}
                type="button"
              >
                {step}px
              </button>
            ))}
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
          <ShaderRevealTransition
            className="absolute inset-0"
            transitionKey={`${scene.id}-${ditherOn}-${pixelSize}`}
            variant="noise"
          >
            {ditherOn ? (
              <DitherImage
                alt={scene.alt}
                className="size-full [&_canvas]:size-full [&_canvas]:object-cover"
                height={480}
                pixelSize={pixelSize}
                src={sceneUrl}
                width={640}
              />
            ) : (
              <img
                alt={scene.alt}
                className="size-full object-cover"
                height={900}
                src={sceneUrl}
                width={1200}
              />
            )}
          </ShaderRevealTransition>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/55 to-transparent p-4 pt-16">
            <p className="font-medium text-background text-sm">{scene.alt}</p>
            <p className="text-background/80 text-xs">
              {ditherOn ? `Bayer · ${pixelSize}px` : "Hero still · clear"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 border-border border-t p-4 md:grid-cols-3 md:p-5">
        {LANDING_FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          const featureScene = LANDING_SCENES[index];
          const active = sceneIndex === index;
          return (
            <button
              aria-pressed={active}
              className={cn(
                "rounded-xl p-3 text-left ring-1 transition-colors duration-150",
                active
                  ? "bg-foreground text-background ring-foreground"
                  : "bg-card text-foreground ring-foreground/8 hover:bg-muted"
              )}
              key={feature.title}
              onClick={() => {
                setSceneIndex(index);
                playClick();
              }}
              type="button"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span
                  className={cn(
                    "grid size-8 place-items-center rounded-lg",
                    active ? "bg-background/15" : "bg-muted"
                  )}
                >
                  <Icon className="size-4" />
                </span>
                {featureScene ? (
                  <img
                    alt=""
                    className="size-10 rounded-lg object-cover"
                    height={80}
                    src={sceneSrc(featureScene.id, "w-160")}
                    width={80}
                  />
                ) : null}
              </div>
              <p className="font-medium text-sm">{feature.title}</p>
              <p
                className={cn(
                  "mt-1 text-xs leading-relaxed",
                  active ? "text-background/75" : "text-muted-foreground"
                )}
              >
                {feature.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DashboardView() {
  const playClick = useUiSound("/sounds/button.wav", 0.35);
  const [section, setSection] = useState<DashSection>("overview");
  const [activeKpi, setActiveKpi] = useState<
    (typeof KPIS)[number]["id"] | null
  >(null);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("Pink dunes at late light");
  const [spark, setSpark] = useState(0);

  const activity = useMemo(
    () =>
      ACTIVITY.filter((item) => !dismissed.includes(item.id)).filter((item) =>
        activeKpi ? item.kpi === activeKpi : true
      ),
    [activeKpi, dismissed]
  );

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
              className="grid size-8 place-items-center rounded-full bg-muted text-foreground transition-colors duration-150 hover:bg-foreground/10"
              onClick={() => playClick()}
              type="button"
            >
              <IconBellFill24 className="size-3.5" />
            </button>
            <Button
              onClick={() => playClick()}
              size="sm"
              type="button"
              variant="outline"
            >
              Export
            </Button>
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
                <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/8">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        Weekly volume
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Dither chart · click a KPI to filter activity
                      </p>
                    </div>
                  </div>
                  <DitherChart
                    animate
                    className="w-full"
                    data={CHART_DATA}
                    height={180}
                    label="Weekly generations"
                    variant="bar"
                    width={420}
                  />
                </div>

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
                  <ul className="space-y-2">
                    <AnimatePresence initial={false}>
                      {activity.map((item) => (
                        <motion.li
                          animate={{ height: "auto", opacity: 1 }}
                          className="overflow-hidden"
                          exit={{ height: 0, opacity: 0 }}
                          initial={{ height: 0, opacity: 0 }}
                          key={item.id}
                          transition={{ duration: 0.2 }}
                        >
                          <button
                            className="flex w-full gap-3 rounded-lg px-1 py-1.5 text-left hover:bg-muted"
                            onClick={() => {
                              setDismissed((current) => [...current, item.id]);
                              playClick();
                            }}
                            type="button"
                          >
                            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-foreground" />
                            <div className="min-w-0">
                              <p className="truncate text-foreground text-xs">
                                {item.title}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                {item.meta} · dismiss
                              </p>
                            </div>
                          </button>
                        </motion.li>
                      ))}
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

          {section === "generations" ? (
            <div className="grid gap-4 md:grid-cols-[1fr_0.9fr]">
              <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/8">
                <p className="font-medium text-foreground text-sm">Prompt</p>
                <label className="mt-3 block">
                  <span className="sr-only">Prompt</span>
                  <textarea
                    className="min-h-28 w-full resize-none rounded-lg bg-background px-3 py-2 text-foreground text-sm outline-none ring-1 ring-border focus:ring-foreground/30"
                    onChange={(event) => setPrompt(event.target.value)}
                    value={prompt}
                  />
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    onClick={() => {
                      setSpark((value) => value + 1);
                      playClick();
                    }}
                    size="sm"
                    type="button"
                    variant="candy"
                  >
                    Generate
                  </Button>
                  <Button
                    onClick={() => {
                      setPrompt("");
                      playClick();
                    }}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    Clear
                  </Button>
                </div>
              </div>
              <div className="relative min-h-48 overflow-hidden rounded-xl ring-1 ring-foreground/8">
                <ShaderRevealTransition
                  className="absolute inset-0"
                  transitionKey={`gen-${spark}`}
                  variant="circle"
                >
                  <DitherImage
                    alt="Generation preview"
                    className="size-full [&_canvas]:size-full [&_canvas]:object-cover"
                    height={320}
                    pixelSize={5}
                    src={sceneSrc(
                      LANDING_SCENES[spark % LANDING_SCENES.length]?.id ??
                        LANDING_SCENES[0]?.id ??
                        "desert-dunes",
                      "w-900"
                    )}
                    width={420}
                  />
                </ShaderRevealTransition>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/50 to-transparent p-3 pt-12">
                  <p className="truncate text-background text-xs">
                    {prompt || "—"}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {section === "library" ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {LANDING_SCENES.map((item, index) => (
                <button
                  className="group relative aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-foreground/8"
                  key={item.id}
                  onClick={() => {
                    setSection("generations");
                    setSpark(index);
                    setPrompt(item.alt);
                    playClick();
                  }}
                  type="button"
                >
                  <img
                    alt={item.alt}
                    className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
                    height={240}
                    src={sceneSrc(item.id, "w-480")}
                    width={320}
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/60 to-transparent p-2 text-left text-[11px] text-background">
                    {item.alt}
                  </span>
                </button>
              ))}
            </div>
          ) : null}

          {section === "team" || section === "settings" ? (
            <div className="rounded-xl bg-card p-6 ring-1 ring-foreground/8">
              <p className="font-medium text-foreground text-sm">
                {section === "team" ? "Team" : "Settings"}
              </p>
              <p className="mt-2 max-w-sm text-muted-foreground text-sm">
                {section === "team"
                  ? "Maya, Luca, and Nora are online. Invite another seat from Overview."
                  : "Theme, notifications, and export defaults live here in the full product."}
              </p>
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
