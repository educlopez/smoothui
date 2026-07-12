"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface ApertureBlurTransitionProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  onRest?: () => void;
  transitionKey: string | number;
}

const DEFAULT_DURATION_MS = 760;
const MIDPOINT = 0.48;
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

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 aspect = vec2(uRes.x / uRes.y, 1.0);
  vec2 p = (uv - 0.5) * aspect;
  float r = length(p);
  float a = atan(p.y, p.x);

  float progress = smoothstep(0.0, 1.0, uProgress);
  float radius = mix(0.05, 0.82, progress);
  float apertureNoise = sin(a * 8.0 + uTime * 0.9) * 0.018 + sin(a * 17.0 - uTime * 0.6) * 0.006;
  float d = r - radius - apertureNoise;

  float exitFade = smoothstep(0.94, 0.58, progress);
  float ring = exp(-d * d * 210.0) * exitFade;
  float innerGlow = smoothstep(radius + 0.18, radius - 0.02, r) * smoothstep(0.0, 0.34, progress) * exitFade;
  float outerFeather = smoothstep(radius + 0.22, radius - 0.04, r) * exitFade * 0.55;
  float grain = hash(floor(uv * uRes / 3.0) + floor(uTime * 18.0)) * 0.045;

  vec3 champagne = vec3(1.0, 0.82, 0.56);
  vec3 rose = vec3(1.0, 0.34, 0.62);
  vec3 cyan = vec3(0.62, 0.92, 1.0);
  vec3 color = mix(champagne, rose, smoothstep(-0.4, 0.4, sin(a * 2.0 + uTime * 0.7)));
  color = mix(color, cyan, ring * 0.38 + smoothstep(0.74, 1.0, progress) * 0.18);

  float highlight = ring * (0.82 + grain) + innerGlow * 0.18 + outerFeather * 0.08;
  float alpha = clamp(highlight * uAlpha, 0.0, 0.88);
  gl_FragColor = vec4(color * alpha + vec3(1.0) * ring * 0.22 * uAlpha, alpha);
}
`;
const STRIP = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

interface Playback {
  cancel: () => void;
}

interface Controller {
  destroy: () => void;
  getProgress: () => number;
  setAlpha: (alpha: number) => void;
  setProgress: (progress: number) => void;
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const easeOutCubic = (value: number) => 1 - (1 - value) ** 3;
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
    getProgress: () => progress,
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
    const progress = easeOutCubic(raw);
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
      const fadeRaw = clamp01((performance.now() - fadeStartedAt) / 70);
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

const ApertureBlurTransition = ({
  children,
  className,
  duration = DEFAULT_DURATION_MS,
  onRest,
  transitionKey,
}: ApertureBlurTransitionProps) => {
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

export default ApertureBlurTransition;
