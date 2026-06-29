"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";

export type AkellaTransitionVariant =
  | "noise"
  | "zoom"
  | "circle"
  | "wipe"
  | "luma"
  | "planetary"
  | "stripes"
  | "push";

export interface AkellaImageTransitionProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  onRest?: () => void;
  transitionKey: string | number;
  variant?: AkellaTransitionVariant;
}

const DEFAULT_DURATION_MS = 1080;
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
float parabola(float x, float k){ return pow(4.0 * x * (1.0 - x), k); }
mat2 rot(float a){ float s = sin(a); float c = cos(a); return mat2(c, -s, s, c); }

vec4 paint(vec2 uv, float mask, vec3 color, float glow){
  float exitFade = smoothstep(1.0, 0.76, uProgress);
  float entryFade = smoothstep(0.0, 0.10, uProgress);
  float alpha = clamp((mask * 0.76 + glow * 0.24) * entryFade * exitFade * uAlpha, 0.0, 0.92);
  return vec4(color * alpha + vec3(1.0) * glow * 0.16 * uAlpha, alpha);
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 aspect = vec2(uRes.x / uRes.y, 1.0);
  vec2 p = (uv - 0.5) * aspect;
  float progress = smoothstep(0.0, 1.0, uProgress);
  vec3 pink = vec3(1.0, 0.20, 0.58);
  vec3 cyan = vec3(0.12, 0.86, 1.0);
  vec3 gold = vec3(1.0, 0.72, 0.28);
  vec3 mint = vec3(0.45, 1.0, 0.72);

  float mask = 0.0;
  float glow = 0.0;
  vec3 color = mix(pink, cyan, uv.x);

  if (uVariant < 0.5) {
    // Demo 1 — turbulent noise threshold. Chunky, organic gate.
    float n1 = noise(uv * vec2(18.0, 12.0) + uTime * 0.42);
    float n2 = noise(uv * vec2(52.0, 44.0) - uTime * 0.18);
    float threshold = progress * 1.35 - 0.18;
    float gate = smoothstep(threshold - 0.18, threshold + 0.18, uv.x * 0.62 + uv.y * 0.28 + n1 * 0.34 + n2 * 0.08);
    mask = pow(gate * (1.0 - gate) * 4.0, 0.74) + step(0.74, n2) * gate * 0.22;
    glow = exp(-pow(uv.x + n1 * 0.26 - progress, 2.0) * 26.0);
    color = mix(vec3(1.0, 0.10, 0.55), vec3(0.18, 1.0, 0.78), n1);
  } else if (uVariant < 1.5) {
    // Demo 2 — zoom mix. Large central lens, not a sweep.
    float yGate = smoothstep(0.0, 1.0, progress * 2.15 + uv.y - 1.08);
    vec2 z = (uv - 0.5) * mix(1.75, 0.35, yGate) + 0.5;
    float lens = 1.0 - smoothstep(0.12, 0.78, length((z - 0.5) * aspect));
    float seam = exp(-pow(yGate - 0.5, 2.0) * 20.0);
    mask = (lens * 0.72 + seam * 0.42) * parabola(progress, 0.42);
    glow = seam * 0.9 + lens * 0.25;
    color = mix(vec3(1.0, 0.80, 0.34), vec3(0.70, 0.92, 1.0), yGate);
  } else if (uVariant < 2.5) {
    // Demo 3 — noisy circular reveal.
    float n = noise(uv * 9.0 + uTime * 0.25);
    float radius = progress * 1.08 + n * 0.045;
    float d = length(p) - radius * 0.72;
    mask = exp(-d * d * 42.0) + smoothstep(0.08, -0.12, d) * 0.18;
    glow = exp(-d * d * 140.0);
    color = mix(vec3(1.0, 0.22, 0.58), vec3(1.0, 0.75, 0.32), atan(p.y, p.x) / PI * 0.5 + 0.5);
  } else if (uVariant < 3.5) {
    // Demo 4 — displacement wipe. Narrow noisy blade.
    float n = noise(uv * vec2(12.0, 26.0) + vec2(uTime * 0.26, -uTime * 0.12));
    float blade = progress * 1.32 - 0.16 + n * 0.11;
    float edge = blade - uv.x;
    float front = exp(-edge * edge * 120.0);
    float fillSide = smoothstep(-0.03, 0.16, edge) * 0.18;
    mask = front * 0.92 + fillSide;
    glow = front;
    color = mix(vec3(0.12, 0.92, 1.0), vec3(1.0, 1.0, 1.0), front * 0.38);
  } else if (uVariant < 4.5) {
    // Demo 5 — luminance displacement. Horizontal ribbons pulled vertically.
    float lum = noise(uv * 5.0 + vec2(0.0, uTime * 0.22));
    float displacedY = uv.y + progress * (lum - 0.5) * 0.55;
    float ribbons = sin(displacedY * 58.0 + uTime * 1.25) * 0.5 + 0.5;
    float fine = sin(displacedY * 132.0 - uTime * 1.8) * 0.5 + 0.5;
    float window = smoothstep(0.03, 0.5, progress) * smoothstep(1.0, 0.72, progress);
    mask = (smoothstep(0.58, 0.92, ribbons) * 0.74 + smoothstep(0.76, 0.98, fine) * 0.22) * window;
    glow = smoothstep(0.84, 1.0, ribbons) * window;
    color = mix(vec3(1.0, 0.68, 0.22), vec3(1.0, 0.20, 0.62), lum);
  } else if (uVariant < 5.5) {
    // Demo 6 — planetary rotated displacement. Spiral vortex.
    vec2 disp = vec2(noise(uv * 5.5 + uTime * 0.12), noise(uv * 5.5 + 4.2 - uTime * 0.10)) - 0.5;
    vec2 q = rot(PI * 0.25) * (p + disp * 0.44 * parabola(progress, 0.55));
    float ang = atan(q.y, q.x);
    float rr = length(q);
    float arms = sin(ang * 5.0 + rr * 18.0 - uTime * 1.8);
    float core = 1.0 - smoothstep(0.0, 0.42, rr);
    mask = (smoothstep(0.08, 0.92, arms) * 0.72 + core * 0.38) * parabola(progress, 0.58);
    glow = exp(-abs(arms) * 1.5) * parabola(progress, 0.85);
    color = mix(vec3(0.10, 0.88, 1.0), vec3(1.0, 0.66, 0.18), rr + core * 0.35);
  } else if (uVariant < 6.5) {
    // Demo 7 — divided UV stripe displacement. Barcode shutter.
    vec2 divided = fract(uv * vec2(42.0, 1.0));
    float stripeCore = step(0.18, divided.x) * step(divided.x, 0.62);
    float diagonal = uv.x + uv.y * 0.18 + divided.x * 0.06;
    float sweep = smoothstep(-0.10, 1.12, progress * 1.32 - diagonal + 0.18);
    float shutter = stripeCore * sweep * smoothstep(0.04, 0.56, progress) * smoothstep(1.0, 0.78, progress);
    mask = shutter * 0.92;
    glow = stripeCore * exp(-pow(progress - uv.x, 2.0) * 30.0) * 0.86;
    color = mix(vec3(1.0, 0.15, 0.55), vec3(0.12, 0.88, 1.0), divided.x);
  } else {
    // Demo 8 — noise push/pull. Vertical flow with directional pressure.
    float hn = noise(uv * uRes / 115.0 + uTime * 0.12);
    vec2 centerDir = normalize(vec2(0.5) - uv + 0.001);
    float pull = centerDir.y * (1.0 + hn * 0.7) * parabola(progress, 0.62);
    float bands = sin((uv.y + pull * 0.52) * 28.0 + hn * 5.0);
    float pressure = smoothstep(-0.22, 0.96, bands) * parabola(progress, 0.62);
    float verticalGlow = exp(-pow(uv.y - (0.5 + pull * 0.22), 2.0) * 18.0);
    mask = pressure * 0.78 + verticalGlow * 0.22;
    glow = verticalGlow * pressure;
    color = mix(vec3(0.48, 1.0, 0.74), vec3(1.0, 0.22, 0.58), hn);
  }

  gl_FragColor = paint(uv, mask, color, glow);
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
  setVariant: (variant: AkellaTransitionVariant) => void;
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const easeOutQuart = (value: number) => 1 - (1 - value) ** 4;
const easeInOutCubic = (value: number) =>
  value < 0.5 ? 4 * value ** 3 : 1 - (-2 * value + 2) ** 3 / 2;

const variantToUniform = (variant: AkellaTransitionVariant) => {
  switch (variant) {
    case "noise":
      return 0;
    case "zoom":
      return 1;
    case "circle":
      return 2;
    case "wipe":
      return 3;
    case "luma":
      return 4;
    case "planetary":
      return 5;
    case "stripes":
      return 6;
    default:
      return 7;
  }
};

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

const createController = (
  canvas: HTMLCanvasElement,
  initialVariant: AkellaTransitionVariant
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
    setVariant: (nextVariant: AkellaTransitionVariant) => {
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

const AkellaImageTransition = ({
  children,
  className,
  duration = DEFAULT_DURATION_MS,
  onRest,
  transitionKey,
  variant = "noise",
}: AkellaImageTransitionProps) => {
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

export default AkellaImageTransition;
