"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface ChromaBlurTransitionProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  onRest?: () => void;
  transitionKey: string | number;
}

const DEFAULT_DURATION_MS = 1040;
const MIDPOINT = 0.5;
const MAX_DPR = 2;
const VERTEX_SHADER =
  "attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }";
const FRAGMENT_SHADER = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform float uProgress;
uniform float uAlpha;
#define PI 3.14159265359

float hash(vec2 p){ return fract(sin(dot(p, vec2(41.0, 289.0))) * 45758.5453); }
float noise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float p = smoothstep(0.0, 1.0, uProgress);
  float field = uv.x * 0.62 + uv.y * 0.38;
  float n = noise(uv * 10.0 + vec2(uTime * 0.28, -uTime * 0.18));
  float wave = sin((uv.y + n * 0.12) * 28.0 + uTime * 2.2) * 0.018;
  float front = p * 1.42 - 0.2;
  float d = field + wave - front;

  float curtain = exp(-d * d * 34.0);
  float softGrain = noise(uv * 34.0 + uTime * 0.18) * 0.055;
  float chroma = exp(-(d + 0.045) * (d + 0.045) * 52.0) + exp(-(d - 0.045) * (d - 0.045) * 52.0);
  float exitFade = smoothstep(1.0, 0.74, p);
  float entryFade = smoothstep(0.0, 0.16, p);

  vec3 brandPink = vec3(1.0, 0.32, 0.64);
  vec3 champagne = vec3(1.0, 0.82, 0.56);
  vec3 seafoam = vec3(0.52, 0.90, 0.78);
  vec3 porcelain = vec3(1.0, 0.97, 0.90);
  vec3 color = mix(brandPink, champagne, smoothstep(-0.18, 0.18, sin((uv.y + n) * PI * 2.0)));
  color = mix(color, seafoam, smoothstep(0.2, 1.0, chroma) * 0.34);
  color = mix(color, porcelain, 0.16);

  float alpha = (curtain * 0.72 + chroma * 0.18 + softGrain * curtain) * entryFade * exitFade * uAlpha;
  gl_FragColor = vec4(color * alpha, clamp(alpha, 0.0, 0.86));
}
`;
const STRIP = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

interface Playback {
  cancel: () => void;
}
interface Controller {
  destroy: () => void;
  setAlpha: (alpha: number) => void;
  setProgress: (progress: number) => void;
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const easeOutQuart = (value: number) => 1 - (1 - value) ** 4;
const easeInOutCubic = (value: number) =>
  value < 0.5 ? 4 * value ** 3 : 1 - (-2 * value + 2) ** 3 / 2;

const compile = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) {
    return null;
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

const resize = (canvas: HTMLCanvasElement, gl: WebGLRenderingContext) => {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
  const width = Math.max(1, Math.round(rect.width * dpr));
  const height = Math.max(1, Math.round(rect.height * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  gl.viewport(0, 0, width, height);
};

const createController = (canvas: HTMLCanvasElement): Controller | null => {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    premultipliedAlpha: true,
  });
  if (!gl) {
    return null;
  }
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  if (!(vertex && fragment && program)) {
    return null;
  }
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  // biome-ignore lint/correctness/useHookAtTopLevel: WebGLRenderingContext.useProgram is not a React hook.
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, STRIP, gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "a");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  const uRes = gl.getUniformLocation(program, "uRes");
  const uTime = gl.getUniformLocation(program, "uTime");
  const uProgress = gl.getUniformLocation(program, "uProgress");
  const uAlpha = gl.getUniformLocation(program, "uAlpha");
  const startedAt = performance.now();
  let progress = 0;
  let alpha = 0;
  let frame = 0;
  let destroyed = false;

  const tick = () => {
    if (destroyed) {
      return;
    }
    resize(canvas, gl);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, (performance.now() - startedAt) / 1000);
    gl.uniform1f(uProgress, progress);
    gl.uniform1f(uAlpha, alpha);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);

  return {
    destroy: () => {
      destroyed = true;
      cancelAnimationFrame(frame);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (buffer) {
        gl.deleteBuffer(buffer);
      }
      gl.deleteProgram(program);
    },
    setAlpha: (nextAlpha: number) => {
      alpha = clamp01(nextAlpha);
    },
    setProgress: (nextProgress: number) => {
      progress = clamp01(nextProgress);
    },
  };
};

const play = (
  controller: Controller,
  duration: number,
  onMidpoint: () => void,
  onComplete: () => void
): Playback => {
  let frame = 0;
  let cancelled = false;
  let didSwap = false;
  const startedAt = performance.now();
  controller.setAlpha(1);

  const advance = () => {
    if (cancelled) {
      return;
    }
    const raw = clamp01((performance.now() - startedAt) / duration);
    const progress = easeOutQuart(raw);
    controller.setProgress(progress);
    if (!(didSwap || progress < MIDPOINT)) {
      didSwap = true;
      onMidpoint();
    }
    if (raw < 1) {
      frame = requestAnimationFrame(advance);
      return;
    }
    if (!didSwap) {
      onMidpoint();
    }
    const fadeStartedAt = performance.now();
    const fade = () => {
      if (cancelled) {
        return;
      }
      const fadeRaw = clamp01((performance.now() - fadeStartedAt) / 90);
      controller.setAlpha(1 - easeInOutCubic(fadeRaw));
      if (fadeRaw < 1) {
        frame = requestAnimationFrame(fade);
        return;
      }
      controller.setAlpha(0);
      controller.setProgress(0);
      onComplete();
    };
    frame = requestAnimationFrame(fade);
  };
  frame = requestAnimationFrame(advance);

  return {
    cancel: () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    },
  };
};

const ChromaBlurTransition = ({
  children,
  className,
  duration = DEFAULT_DURATION_MS,
  onRest,
  transitionKey,
}: ChromaBlurTransitionProps) => {
  const shouldReduceMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<Controller | null>(null);
  const playbackRef = useRef<Playback | null>(null);
  const previousKey = useRef(transitionKey);
  const [renderedChildren, setRenderedChildren] = useState(children);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const controller = createController(canvas);
    controllerRef.current = controller;
    return () => {
      playbackRef.current?.cancel();
      controller?.destroy();
      controllerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (previousKey.current === transitionKey) {
      setRenderedChildren(children);
      return;
    }
    previousKey.current = transitionKey;
    playbackRef.current?.cancel();

    if (shouldReduceMotion) {
      setRenderedChildren(children);
      setIsActive(false);
      onRest?.();
      return;
    }

    const controller = controllerRef.current;
    if (!controller) {
      setRenderedChildren(children);
      onRest?.();
      return;
    }
    setIsActive(true);
    playbackRef.current = play(
      controller,
      duration,
      () => setRenderedChildren(children),
      () => {
        setIsActive(false);
        playbackRef.current = null;
        onRest?.();
      }
    );
  }, [children, duration, onRest, shouldReduceMotion, transitionKey]);

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-2xl bg-background text-foreground",
        className
      )}
      data-transitioning={isActive ? "true" : "false"}
    >
      <div className="relative z-0">{renderedChildren}</div>
      <canvas
        className={cn(
          "pointer-events-none absolute inset-0 z-10 h-full w-full transition-opacity duration-75",
          isActive && !shouldReduceMotion ? "opacity-100" : "opacity-0"
        )}
        ref={canvasRef}
      />
    </div>
  );
};

export default ChromaBlurTransition;
