"use client";

import ImageGenerationPanel, {
  type ImageGenerationImage,
  type ImageGenerationStatus,
} from "@repo/smoothui/components/image-generation-panel";
import { sceneById } from "@smoothui/data/scenes";
import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

const SCRIPTED_PROMPT = "a lighthouse at dusk, long exposure, cinematic";

const ASPECT_RATIO = "16 / 9";
const RESULT_WIDTH = 1024;
const RESULT_HEIGHT = 576;
/** Small enough that `image-rendering: pixelated` gives real chunky blocks. */
const PREVIEW_WIDTH = 32;
const PREVIEW_HEIGHT = 18;

/** Start replaying once a quarter of the panel is on screen. */
const IN_VIEW_AMOUNT = 0.25;

const TYPE_MS = 26;
const LEAD_IN_MS = 400;
const QUEUE_MS = 500;
const RAMP_MS = 3200;
const HOLD_MS = 2600;

/** Two decimals is all the resolve needs — it caps the ramp at ~100 renders. */
const PROGRESS_QUANTUM = 100;

/** Cycled per run, so re-generating returns a different picture each time. */
const RESULTS = [
  sceneById("moonrise-valley"),
  sceneById("golden-ridge"),
  sceneById("nebula-canyon"),
  sceneById("lake-camp"),
].filter((scene): scene is NonNullable<typeof scene> => scene !== undefined);

const makeImage = (batch: number): ImageGenerationImage[] => {
  const scene = RESULTS[batch % RESULTS.length];
  return [
    {
      alt: SCRIPTED_PROMPT,
      id: `${batch}`,
      preview: `${scene.src}?tr=w-${PREVIEW_WIDTH},h-${PREVIEW_HEIGHT},f-auto`,
      src: `${scene.src}?tr=w-${RESULT_WIDTH},h-${RESULT_HEIGHT},f-auto`,
    },
  ];
};

export default function ImageGenerationPanelDemo() {
  const [prompt, setPrompt] = useState("");
  const [typing, setTyping] = useState(true);
  const [status, setStatus] = useState<ImageGenerationStatus>("idle");
  const [images, setImages] = useState<ImageGenerationImage[]>([]);
  const [progress, setProgress] = useState(0);
  const [run, setRun] = useState(0);

  const batchRef = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(stageRef, { amount: IN_VIEW_AMOUNT });
  const [isTabVisible, setIsTabVisible] = useState(true);

  useEffect(() => {
    const sync = () => setIsTabVisible(!document.hidden);
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  // Browsers suspend requestAnimationFrame in a hidden tab and throttle
  // setTimeout to ~1/s, so an unguarded loop would be discovered frozen at 0%.
  // Gating on visibility + viewport means the cycle always starts from the top
  // the moment someone is actually looking at it.
  const isPlaying = isInView && isTabVisible;

  // The panel is worthless as a still frame, so the demo plays the whole cycle
  // and loops it: prompt types into the bar, request queues, the tile resolves
  // out of its mosaic under the scan sweep. Nobody has to press anything.
  // biome-ignore lint/correctness/useExhaustiveDependencies: `run` is a restart token — bumping it must tear the loop down and start a fresh cycle, so it belongs in the deps even though the body never reads it
  useEffect(() => {
    if (!isPlaying) {
      return;
    }
    let cancelled = false;
    let frameId = 0;
    const timeouts = new Set<number>();

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(() => {
          timeouts.delete(id);
          resolve();
        }, ms);
        timeouts.add(id);
      });

    const typeOut = async (text: string) => {
      for (let index = 1; index <= text.length; index += 1) {
        if (cancelled) {
          return;
        }
        setPrompt(text.slice(0, index));
        // biome-ignore lint/performance/noAwaitInLoops: a typewriter is sequential by definition — the next character must wait for the previous delay
        await sleep(TYPE_MS);
      }
    };

    const rampProgress = () =>
      new Promise<void>((resolve) => {
        const startedAt = performance.now();
        let lastCommitted = -1;
        const step = (now: number) => {
          if (cancelled) {
            resolve();
            return;
          }
          const ratio = Math.min(1, (now - startedAt) / RAMP_MS);
          const quantized =
            Math.round(ratio * PROGRESS_QUANTUM) / PROGRESS_QUANTUM;
          if (quantized !== lastCommitted) {
            lastCommitted = quantized;
            setProgress(quantized);
          }
          if (ratio < 1) {
            frameId = requestAnimationFrame(step);
            return;
          }
          resolve();
        };
        frameId = requestAnimationFrame(step);
      });

    const cycle = async () => {
      while (!cancelled) {
        batchRef.current += 1;
        const batch = batchRef.current;

        setStatus("idle");
        setTyping(true);
        setPrompt("");
        setImages([]);
        setProgress(0);
        // biome-ignore lint/performance/noAwaitInLoops: the cycle is a timeline — every phase must finish before the next begins
        await sleep(LEAD_IN_MS);
        if (cancelled) {
          return;
        }

        await typeOut(SCRIPTED_PROMPT);
        if (cancelled) {
          return;
        }

        setTyping(false);
        setStatus("queued");
        await sleep(QUEUE_MS);
        if (cancelled) {
          return;
        }

        setImages(makeImage(batch));
        setStatus("generating");
        await rampProgress();
        if (cancelled) {
          return;
        }

        setProgress(1);
        setStatus("done");
        await sleep(HOLD_MS);
      }
    };

    cycle();

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      for (const id of timeouts) {
        window.clearTimeout(id);
      }
    };
  }, [isPlaying, run]);

  return (
    <div className="flex w-full justify-center px-4 py-8" ref={stageRef}>
      <ImageGenerationPanel
        aspectRatio={ASPECT_RATIO}
        aspectRatios={[]}
        chrome="minimal"
        className="max-w-xl"
        composerPlacement="bottom"
        count={1}
        images={images}
        onGenerate={() => setRun((value) => value + 1)}
        presets={[]}
        progress={progress}
        prompt={prompt}
        status={status}
        typing={typing}
      />
    </div>
  );
}
