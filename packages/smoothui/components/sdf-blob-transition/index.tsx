"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";

export type SdfBlobVariant = "circle" | "warped" | "merge" | "radial" | "final";

export interface SdfBlobTransitionProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  onRest?: () => void;
  transitionKey: string | number;
  variant?: SdfBlobVariant;
}

const DEFAULT_DURATION_MS = 1120;
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
uniform float uVariant;
#define PI 3.14159265359

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
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

float circleSdf(vec2 p, vec2 c, float r){ return length(p - c) - r; }
float smin(float a, float b, float k){
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 aspect = vec2(uRes.x / uRes.y, 1.0);
  vec2 p = (uv - 0.5) * aspect;
  float progress = smoothstep(0.0, 1.0, uProgress);
  float grow = smoothstep(0.0, 0.86, progress);
  float exitFade = smoothstep(1.0, 0.72, progress);

  float wobble = noise(uv * 7.0 + uTime * 0.18) * 0.035;
  float ringNoise = noise(vec2(atan(p.y, p.x) * 2.0, uTime * 0.18)) * 0.075;
  float dCircle = circleSdf(p, vec2(0.0), 0.04 + grow * 0.64);
  float dWarped = circleSdf(p, vec2(0.0), 0.04 + grow * 0.62 + ringNoise * smoothstep(0.08, 0.96, progress));

  float m0 = circleSdf(p, vec2(-0.26, -0.08), 0.06 + grow * 0.42 + wobble);
  float m1 = circleSdf(p, vec2(0.24, 0.12), 0.06 + grow * 0.40 - wobble * 0.5);
  float dMerge = smin(m0, m1, 0.18);

  float angle = atan(p.y, p.x);
  float sector3 = 2.0 * PI / 3.0;
  float sector5 = 2.0 * PI / 5.0;
  float a3 = floor((angle + PI) / sector3 + 0.5) * sector3 - PI;
  float a5 = floor((angle + PI) / sector5 + 0.5) * sector5 - PI;
  float r0 = 0.17 + grow * 0.24;
  float r1 = 0.30 + grow * 0.18;
  float dR0 = circleSdf(p, vec2(cos(a3), sin(a3)) * r0, 0.04 + grow * 0.22 + wobble * 0.4);
  float dR1 = circleSdf(p, vec2(cos(a5), sin(a5)) * r1, 0.035 + grow * 0.18);
  float dRadial = smin(dR0, dR1, 0.14);

  float f0 = circleSdf(p, vec2(-0.28, -0.10), 0.08 + grow * 0.46 + wobble);
  float f1 = circleSdf(p, vec2(0.00, 0.16), 0.06 + grow * 0.42 - wobble * 0.5);
  float f2 = circleSdf(p, vec2(0.30, -0.06), 0.05 + grow * 0.40 + wobble * 0.6);
  float f3 = circleSdf(p, vec2(-0.02, -0.30), 0.04 + grow * 0.34);
  float dFinal = smin(smin(f0, f1, 0.18), smin(f2, f3, 0.16), 0.20);
  dFinal = smin(dFinal, dRadial, 0.16);

  float d = dFinal;
  if (uVariant < 0.5) {
    d = dCircle;
  } else if (uVariant < 1.5) {
    d = dWarped;
  } else if (uVariant < 2.5) {
    d = dMerge;
  } else if (uVariant < 3.5) {
    d = dRadial;
  }

  float edge = exp(-d * d * 160.0) * exitFade;
  float fill = smoothstep(0.08, -0.10, d) * smoothstep(0.0, 0.18, progress) * exitFade;
  float cell = hash(floor((uv + noise(uv * 11.0) * 0.01) * uRes / 7.0) + floor(uTime * 10.0));
  float flecks = step(0.78, cell) * edge * 0.22 * smoothstep(1.5, 4.0, uVariant);

  vec3 rose = vec3(1.0, 0.23, 0.58);
  vec3 apricot = vec3(1.0, 0.70, 0.38);
  vec3 mint = vec3(0.42, 0.94, 0.78);
  vec3 color = mix(rose, apricot, smoothstep(-0.35, 0.35, p.x + noise(uv * 5.0) * 0.18));
  color = mix(color, mint, smoothstep(0.12, 0.7, p.y + grow * 0.16));

  float alpha = (fill * 0.24 + edge * 0.72 + flecks) * uAlpha;
  gl_FragColor = vec4(color * alpha + vec3(1.0) * edge * 0.18 * uAlpha, clamp(alpha, 0.0, 0.9));
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
  setVariant: (variant: SdfBlobVariant) => void;
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

const variantToUniform = (variant: SdfBlobVariant) => {
  switch (variant) {
    case "circle":
      return 0;
    case "warped":
      return 1;
    case "merge":
      return 2;
    case "radial":
      return 3;
    default:
      return 4;
  }
};

const createController = (
  canvas: HTMLCanvasElement,
  initialVariant: SdfBlobVariant
): Controller | null => {
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
  const uVariant = gl.getUniformLocation(program, "uVariant");
  const startedAt = performance.now();
  let progress = 0;
  let alpha = 0;
  let variant = initialVariant;
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
    gl.uniform1f(uVariant, variantToUniform(variant));
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
    setVariant: (nextVariant: SdfBlobVariant) => {
      variant = nextVariant;
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

const SdfBlobTransition = ({
  children,
  className,
  duration = DEFAULT_DURATION_MS,
  onRest,
  transitionKey,
  variant = "final",
}: SdfBlobTransitionProps) => {
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
    const controller = createController(canvas, variant);
    controllerRef.current = controller;
    return () => {
      playbackRef.current?.cancel();
      controller?.destroy();
      controllerRef.current = null;
    };
  }, [variant]);

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
    controller.setVariant(variant);
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
  }, [children, duration, onRest, shouldReduceMotion, transitionKey, variant]);

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

export default SdfBlobTransition;
