"use client";

import { HeroDither } from "@docs/components/landing/hero-dither";
import { Button } from "@docs/components/smoothbutton";
import { useUiSound } from "@docs/components/sound-provider";
import { sceneSrc } from "@docs/examples/shared/demo-fixtures";
import { cn } from "@repo/shadcn-ui/lib/utils";
import ImageGenerationPanel, {
  type ImageGenerationImage,
} from "@repo/smoothui/components/image-generation-panel";
import PhotoStack from "@repo/smoothui/components/photo-stack";
import { castAnimals, castPeople } from "@smoothui/data/cast";
import { landscapes } from "@smoothui/data/scenes";
import { motion, useReducedMotion } from "motion/react";
import {
  IconGrid2Fill24,
  IconHouse4Fill24,
  IconSparkleFill24,
} from "nucleo-core-fill-24";
import { useEffect, useRef, useState } from "react";

const RAMP_MS = 1700;
const QUEUE_MS = 280;

const VIEWS = [
  { icon: IconHouse4Fill24, id: "landing", label: "Landing" },
  { icon: IconGrid2Fill24, id: "dashboard", label: "Dashboard" },
  { icon: IconSparkleFill24, id: "experiment", label: "Experiment" },
] as const;

type ViewId = (typeof VIEWS)[number]["id"];

const LANDING_SCENE = landscapes[1] ?? landscapes[0];
const EXPERIMENT_SCENE = landscapes[4] ?? landscapes[0];

const PROMPTS = [
  "Pink dunes at late afternoon, pale blue sky, soft film grain",
  "A tidal cove in warm gold light, muted olive and dusty rose",
  "Sandstone canyon, dusty blue-green river, no people",
] as const;

const easeOut = (linear: number) => 1 - (1 - linear) ** 3;

const pairAt = (cursor: number): ImageGenerationImage[] => {
  const base = 1000 + cursor * 17;
  return [0, 1].map((offset) => ({
    alt: PROMPTS[(cursor + offset) % PROMPTS.length] ?? PROMPTS[0],
    id: `hero-${base + offset}`,
    seed: String(base + offset),
    src: sceneSrc(
      (landscapes[(cursor + offset) % landscapes.length] ?? landscapes[0]).id,
      "w-1200"
    ),
  }));
};

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
  const [stageHeight, setStageHeight] = useState(0);
  const [images, setImages] = useState<ImageGenerationImage[]>(() => pairAt(0));
  const [progress, setProgress] = useState(100);
  const cursor = useRef(1);
  const runId = useRef(0);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) {
      return;
    }
    const measure = () => setStageHeight(stage.getBoundingClientRect().height);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const run = () => {
    const id = ++runId.current;
    const next = pairAt(cursor.current);
    cursor.current += 1;
    setImages([]);
    setProgress(8);
    window.setTimeout(() => {
      if (runId.current !== id) {
        return;
      }
      setImages(next);
      const started = performance.now();
      const tick = (now: number) => {
        if (runId.current !== id) {
          return;
        }
        const linear = Math.min(1, (now - started) / RAMP_MS);
        setProgress(Math.round(8 + easeOut(linear) * 92));
        if (linear < 1) {
          requestAnimationFrame(tick);
        }
      };
      requestAnimationFrame(tick);
    }, QUEUE_MS);
  };

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
          className="absolute inset-0 size-full"
          height={stageHeight}
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
          className="mx-auto -mt-px min-h-[32rem] overflow-hidden rounded-2xl bg-card p-4 shadow-lg ring-1 ring-foreground/10 md:min-h-[36rem] md:p-6"
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
            {view === "dashboard" ? (
              <DashboardView
                images={images}
                onGenerate={run}
                progress={progress}
              />
            ) : null}
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
    <div className="grid h-full min-h-[28rem] items-center gap-8 md:grid-cols-2 md:gap-10">
      <div className="flex flex-col items-start px-2 text-left md:px-4">
        <p className="font-medium text-muted-foreground text-sm">
          A quiet page
        </p>
        <h2 className="mt-3 text-balance font-semibold font-title text-4xl text-foreground tracking-tight md:text-5xl">
          Built to be opened.
        </h2>
        <p className="mt-4 max-w-sm text-pretty text-base text-foreground/70 leading-relaxed">
          A headline, two actions, and one photograph. The rest of the page can
          wait.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="sm" type="button" variant="candy">
            Get started
          </Button>
          <Button size="sm" type="button" variant="outline">
            See the work
          </Button>
        </div>
      </div>
      <img
        alt={LANDING_SCENE.alt}
        className="aspect-[4/3] w-full rounded-xl object-cover"
        height={900}
        src={sceneSrc(LANDING_SCENE.id, "w-1200")}
        width={1200}
      />
    </div>
  );
}

function DashboardView({
  images,
  onGenerate,
  progress,
}: {
  images: ImageGenerationImage[];
  onGenerate: () => void;
  progress: number;
}) {
  const ready = images.filter((image) => image.seed).length;

  return (
    <div className="flex h-full min-h-[28rem] flex-col">
      <div className="mb-4 flex items-end justify-between gap-4 px-1">
        <div>
          <p className="text-muted-foreground text-xs">Overview</p>
          <p className="font-medium text-foreground text-sm">Generations</p>
        </div>
        <p className="font-mono text-muted-foreground text-xs tabular-nums">
          {ready} ready · {progress}%
        </p>
      </div>
      <ImageGenerationPanel
        aspectRatio="16 / 9"
        aspectRatios={["1:1", "4:5", "16:9"]}
        chrome="minimal"
        className="w-full flex-1 rounded-none border-0 bg-transparent shadow-none"
        composerPlacement="bottom"
        count={2}
        images={images}
        model="smoothui-diffusion v2"
        onGenerate={onGenerate}
        presets={[
          { id: "late-light", label: "Late light" },
          { id: "pale-sky", label: "Pale sky" },
          { id: "grain", label: "Film grain" },
        ]}
        progress={progress}
      />
    </div>
  );
}

function ExperimentView() {
  if (!EXPERIMENT_SCENE) {
    return null;
  }

  return (
    <div className="relative flex min-h-[28rem] items-center justify-center overflow-hidden rounded-xl">
      <img
        alt=""
        className="absolute inset-0 size-full object-cover"
        height={900}
        src={sceneSrc(EXPERIMENT_SCENE.id, "w-1400")}
        width={1400}
      />
      <div className="relative">
        <PhotoStack photos={stackPhotos} />
      </div>
    </div>
  );
}
