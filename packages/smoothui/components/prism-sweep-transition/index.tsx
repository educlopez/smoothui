"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { useReducedMotion } from "motion/react";
import {
  type ReactNode,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";

export type PrismSweepDirection = "left" | "right" | "up" | "down";
export type PrismSweepTone = "prism" | "chroma" | "aperture" | "beam";

export interface PrismSweepTransitionProps {
  /** Content rendered underneath the sweep. */
  children: ReactNode;
  /** Optional wrapper className. */
  className?: string;
  /** Direction the prism field travels from. */
  direction?: PrismSweepDirection;
  /** Total sweep duration, in milliseconds. */
  duration?: number;
  /** Called after the sweep finishes. */
  onRest?: () => void;
  /** Optional tone preset for the shader palette and field behavior. */
  tone?: PrismSweepTone;
  /** Key that starts a new sweep when it changes. */
  transitionKey: string | number;
}

const DEFAULT_DURATION_MS = 1240;
const OUTRO_MS = 82;
const CONTENT_SWAP_RATIO = 0.52;
const MAX_DEVICE_PIXEL_RATIO = 2;
const MIN_PHASE_MS = 80;
const HIDDEN_OPACITY = 0;
const VISIBLE_OPACITY = 1;

const VERTEX_SHADER = `
attribute vec2 position;
varying vec2 vUv;

void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;

varying vec2 vUv;

uniform vec2 uResolution;
uniform float uClock;
uniform float uTravel;
uniform float uOpacity;
uniform float uAxis;
uniform float uForward;
uniform float uSpan;
uniform float uSoftness;
uniform float uBend;
uniform float uFacet;
uniform float uBloom;
uniform vec3 uInk;
uniform vec3 uPearl;
uniform vec3 uWarm;
uniform vec3 uCool;

float saturate(float value) {
  return clamp(value, 0.0, 1.0);
}

float triangleWave(float value) {
  return abs(fract(value) * 2.0 - 1.0);
}

float softRidge(float distance, float width) {
  return exp(-distance * distance / max(width, 0.0001));
}

void main() {
  vec2 uv = vUv;
  vec2 pixel = 1.0 / max(uResolution, vec2(1.0));

  float mainAxis = mix(uv.x, uv.y, uAxis);
  float crossAxis = mix(uv.y, uv.x, uAxis);
  mainAxis = mix(mainAxis, 1.0 - mainAxis, step(0.0, -uForward));

  float time = uClock * 0.42;
  float drift =
      sin(crossAxis * 7.0 + time * 1.8) * 0.024
    + sin(crossAxis * 17.0 - time * 1.1 + 1.6) * 0.010
    + sin((mainAxis + crossAxis) * 11.0 + time * 0.7) * 0.006;
  drift *= uBend;

  float travel = -0.34 + uTravel * 1.68;
  float d = mainAxis - travel - drift;
  float ad = abs(d);

  float field = 1.0 - smoothstep(uSpan, uSpan + uSoftness, ad);
  float inner = 1.0 - smoothstep(uSpan * 0.28, uSpan, ad);
  float frontRidge = softRidge(d - uSpan * 0.34, 0.0017 + pixel.x * 16.0);
  float backRidge = softRidge(d + uSpan * 0.54, 0.0035 + pixel.y * 14.0) * 0.55;

  float facetGrid = triangleWave(crossAxis * uFacet + mainAxis * 2.1 + time * 0.35);
  float facetCuts = smoothstep(0.18, 0.92, facetGrid);
  float diagonal = triangleWave((crossAxis - mainAxis * 0.36) * (uFacet * 0.44) - time * 0.2);
  float caustic = pow(1.0 - diagonal, 4.0) * 0.42 + pow(facetCuts, 2.2) * 0.22;

  float glass = saturate(field * (0.5 + inner * 0.42) + frontRidge * 0.52 + backRidge * 0.2);
  float gateIn = smoothstep(0.02, 0.14, uTravel);
  float gateOut = 1.0 - smoothstep(0.9, 1.0, uTravel);
  float envelope = gateIn * gateOut;

  vec3 base = mix(uCool, uWarm, saturate(crossAxis * 0.82 + drift * 4.5));
  vec3 prism = mix(base, uPearl, inner * 0.36 + frontRidge * 0.5);
  prism = mix(prism, uInk, smoothstep(0.55, 0.0, ad) * 0.1);
  prism += caustic * uBloom * mix(uWarm, uPearl, 0.38);
  prism += frontRidge * uBloom * mix(uWarm, uCool, 0.22) * 0.72;
  prism += backRidge * uBloom * uCool * 0.7;

  float vignette = smoothstep(0.0, 0.025, crossAxis) * smoothstep(1.0, 0.975, crossAxis);
  float alpha = saturate(glass * 0.64 + frontRidge * 0.24 + backRidge * 0.14);
  alpha *= uOpacity * envelope * vignette;

  gl_FragColor = vec4(prism * alpha, alpha);
}
`;

const FULLSCREEN_TRIANGLES = new Float32Array([
  -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
]);

const TONE_CONFIGS = {
  aperture: {
    bend: 0.42,
    bloom: 0.86,
    cool: [0.92, 0.78, 0.66],
    facet: 9.5,
    ink: [0.24, 0.16, 0.12],
    pearl: [1, 0.96, 0.88],
    softness: 0.076,
    span: 0.17,
    warm: [1, 0.62, 0.38],
  },
  beam: {
    bend: 0.12,
    bloom: 1.08,
    cool: [0.86, 0.72, 0.5],
    facet: 18,
    ink: [0.2, 0.13, 0.07],
    pearl: [1, 0.9, 0.68],
    softness: 0.038,
    span: 0.092,
    warm: [1, 0.48, 0.18],
  },
  chroma: {
    bend: 0.9,
    bloom: 0.78,
    cool: [0.38, 0.86, 0.84],
    facet: 13.5,
    ink: [0.18, 0.16, 0.3],
    pearl: [0.96, 0.88, 1],
    softness: 0.082,
    span: 0.15,
    warm: [1, 0.34, 0.72],
  },
  prism: {
    bend: 0.76,
    bloom: 0.58,
    cool: [0.28, 0.78, 0.86],
    facet: 12,
    ink: [0.2, 0.16, 0.26],
    pearl: [0.94, 0.82, 0.9],
    softness: 0.07,
    span: 0.14,
    warm: [0.98, 0.28, 0.58],
  },
} as const satisfies Record<
  PrismSweepTone,
  {
    bend: number;
    bloom: number;
    cool: readonly [number, number, number];
    facet: number;
    ink: readonly [number, number, number];
    pearl: readonly [number, number, number];
    softness: number;
    span: number;
    warm: readonly [number, number, number];
  }
>;

interface UniformMap {
  uAxis: WebGLUniformLocation | null;
  uBend: WebGLUniformLocation | null;
  uBloom: WebGLUniformLocation | null;
  uClock: WebGLUniformLocation | null;
  uCool: WebGLUniformLocation | null;
  uFacet: WebGLUniformLocation | null;
  uForward: WebGLUniformLocation | null;
  uInk: WebGLUniformLocation | null;
  uOpacity: WebGLUniformLocation | null;
  uPearl: WebGLUniformLocation | null;
  uResolution: WebGLUniformLocation | null;
  uSoftness: WebGLUniformLocation | null;
  uSpan: WebGLUniformLocation | null;
  uTravel: WebGLUniformLocation | null;
  uWarm: WebGLUniformLocation | null;
}

interface ShaderController {
  destroy: () => void;
  getTravel: () => number;
  setDirection: (direction: PrismSweepDirection) => void;
  setOpacity: (opacity: number) => void;
  setTone: (tone: PrismSweepTone) => void;
  setTravel: (travel: number) => void;
}

interface ShaderControllerState {
  animationFrame: number;
  buffer: WebGLBuffer | null;
  direction: PrismSweepDirection;
  gl: WebGLRenderingContext;
  opacity: number;
  program: WebGLProgram;
  startedAt: number;
  tone: PrismSweepTone;
  travel: number;
  uniforms: UniformMap;
}

interface SweepPlayback {
  cancel: () => void;
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const directionToShader = (direction: PrismSweepDirection) => {
  switch (direction) {
    case "right":
      return { axis: 0, forward: -1 };
    case "up":
      return { axis: 1, forward: 1 };
    case "down":
      return { axis: 1, forward: -1 };
    default:
      return { axis: 0, forward: 1 };
  }
};

const easePrismTravel = (progress: number) => {
  const clamped = clamp01(progress);
  return 1 - (1 - clamped) ** 3.35;
};

const easeOpacityOut = (progress: number) => {
  const clamped = clamp01(progress);
  return clamped * clamped * (3 - 2 * clamped);
};

const compileShader = (
  gl: WebGLRenderingContext,
  type: number,
  source: string
) => {
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

const createProgram = (gl: WebGLRenderingContext) => {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

  if (!(vertex && fragment)) {
    return null;
  }

  const program = gl.createProgram();
  if (!program) {
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

  return program;
};

const resizeCanvas = (canvas: HTMLCanvasElement, gl: WebGLRenderingContext) => {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO);
  const width = Math.max(1, Math.round(rect.width * dpr));
  const height = Math.max(1, Math.round(rect.height * dpr));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  gl.viewport(0, 0, width, height);
};

const getUniforms = (gl: WebGLRenderingContext, program: WebGLProgram) => ({
  uAxis: gl.getUniformLocation(program, "uAxis"),
  uBend: gl.getUniformLocation(program, "uBend"),
  uBloom: gl.getUniformLocation(program, "uBloom"),
  uClock: gl.getUniformLocation(program, "uClock"),
  uCool: gl.getUniformLocation(program, "uCool"),
  uFacet: gl.getUniformLocation(program, "uFacet"),
  uForward: gl.getUniformLocation(program, "uForward"),
  uInk: gl.getUniformLocation(program, "uInk"),
  uOpacity: gl.getUniformLocation(program, "uOpacity"),
  uPearl: gl.getUniformLocation(program, "uPearl"),
  uResolution: gl.getUniformLocation(program, "uResolution"),
  uSoftness: gl.getUniformLocation(program, "uSoftness"),
  uSpan: gl.getUniformLocation(program, "uSpan"),
  uTravel: gl.getUniformLocation(program, "uTravel"),
  uWarm: gl.getUniformLocation(program, "uWarm"),
});

const setRgbUniform = (
  gl: WebGLRenderingContext,
  location: WebGLUniformLocation | null,
  value: readonly [number, number, number]
) => {
  gl.uniform3f(location, value[0], value[1], value[2]);
};

const drawShader = (
  canvas: HTMLCanvasElement,
  state: ShaderControllerState
) => {
  const { gl, uniforms } = state;
  const directionUniforms = directionToShader(state.direction);
  const toneConfig = TONE_CONFIGS[state.tone];

  resizeCanvas(canvas, gl);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.uniform2f(uniforms.uResolution, canvas.width, canvas.height);
  gl.uniform1f(uniforms.uClock, (performance.now() - state.startedAt) / 1000);
  gl.uniform1f(uniforms.uTravel, state.travel);
  gl.uniform1f(uniforms.uOpacity, state.opacity);
  gl.uniform1f(uniforms.uAxis, directionUniforms.axis);
  gl.uniform1f(uniforms.uForward, directionUniforms.forward);
  gl.uniform1f(uniforms.uSpan, toneConfig.span);
  gl.uniform1f(uniforms.uSoftness, toneConfig.softness);
  gl.uniform1f(uniforms.uBend, toneConfig.bend);
  gl.uniform1f(uniforms.uFacet, toneConfig.facet);
  gl.uniform1f(uniforms.uBloom, toneConfig.bloom);
  setRgbUniform(gl, uniforms.uInk, toneConfig.ink);
  setRgbUniform(gl, uniforms.uPearl, toneConfig.pearl);
  setRgbUniform(gl, uniforms.uWarm, toneConfig.warm);
  setRgbUniform(gl, uniforms.uCool, toneConfig.cool);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
};

const createShaderController = (
  canvas: HTMLCanvasElement,
  direction: PrismSweepDirection,
  tone: PrismSweepTone
) => {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    depth: false,
    premultipliedAlpha: true,
    preserveDrawingBuffer: false,
    stencil: false,
  });

  if (!gl) {
    return null;
  }

  const program = createProgram(gl);
  if (!program) {
    return null;
  }

  const buffer = gl.createBuffer();
  const position = gl.getAttribLocation(program, "position");

  // biome-ignore lint/correctness/useHookAtTopLevel: WebGLRenderingContext.useProgram is not a React hook.
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, FULLSCREEN_TRIANGLES, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  const state: ShaderControllerState = {
    animationFrame: 0,
    buffer,
    direction,
    gl,
    opacity: HIDDEN_OPACITY,
    program,
    startedAt: performance.now(),
    tone,
    travel: 0,
    uniforms: getUniforms(gl, program),
  };

  let destroyed = false;
  const tick = () => {
    if (destroyed) {
      return;
    }

    drawShader(canvas, state);
    state.animationFrame = requestAnimationFrame(tick);
  };

  state.animationFrame = requestAnimationFrame(tick);

  return {
    destroy: () => {
      destroyed = true;
      cancelAnimationFrame(state.animationFrame);
      state.gl.clear(state.gl.COLOR_BUFFER_BIT);
      if (state.buffer) {
        state.gl.deleteBuffer(state.buffer);
      }
      state.gl.deleteProgram(state.program);
    },
    getTravel: () => state.travel,
    setDirection: (nextDirection: PrismSweepDirection) => {
      state.direction = nextDirection;
    },
    setOpacity: (opacity: number) => {
      state.opacity = clamp01(opacity);
    },
    setTone: (nextTone: PrismSweepTone) => {
      state.tone = nextTone;
    },
    setTravel: (travel: number) => {
      state.travel = clamp01(travel);
    },
  } satisfies ShaderController;
};

const useShaderController = ({
  canvasRef,
  direction,
  tone,
}: {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  direction: PrismSweepDirection;
  tone: PrismSweepTone;
}) => {
  const controllerRef = useRef<ShaderController | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const controller = createShaderController(canvas, direction, tone);
    controllerRef.current = controller;

    return () => {
      controller?.destroy();
      controllerRef.current = null;
    };
  }, [canvasRef, direction, tone]);

  useEffect(() => {
    controllerRef.current?.setDirection(direction);
    controllerRef.current?.setTone(tone);
  }, [direction, tone]);

  return controllerRef;
};

const playFrameSweep = (
  controller: ShaderController,
  {
    direction,
    duration,
    midpoint,
    onComplete,
    onMidpoint,
    outroMs,
  }: {
    direction: PrismSweepDirection;
    duration: number;
    midpoint: number;
    onComplete: () => void;
    onMidpoint: () => void;
    outroMs: number;
  }
): SweepPlayback => {
  let animationFrame = 0;
  let midpointReached = false;
  let cancelled = false;
  const startedAt = performance.now();
  const startTravel = controller.getTravel();
  const sweepMs = Math.max(MIN_PHASE_MS, duration * (1 - startTravel));

  controller.setDirection(direction);
  controller.setOpacity(VISIBLE_OPACITY);

  const finishSweep = () => {
    const outroStartedAt = performance.now();

    const fadeOut = () => {
      if (cancelled) {
        return;
      }

      const outroRaw = clamp01((performance.now() - outroStartedAt) / outroMs);
      controller.setOpacity(VISIBLE_OPACITY * (1 - easeOpacityOut(outroRaw)));

      if (outroRaw < 1) {
        animationFrame = requestAnimationFrame(fadeOut);
        return;
      }

      controller.setOpacity(HIDDEN_OPACITY);
      controller.setTravel(0);
      onComplete();
    };

    animationFrame = requestAnimationFrame(fadeOut);
  };

  const advance = () => {
    if (cancelled) {
      return;
    }

    const raw = clamp01((performance.now() - startedAt) / sweepMs);
    const nextTravel = startTravel + (1 - startTravel) * easePrismTravel(raw);
    controller.setTravel(nextTravel);

    if (!(midpointReached || nextTravel < midpoint)) {
      midpointReached = true;
      onMidpoint();
    }

    if (raw < 1) {
      animationFrame = requestAnimationFrame(advance);
      return;
    }

    if (!midpointReached) {
      onMidpoint();
    }
    controller.setTravel(1);
    finishSweep();
  };

  animationFrame = requestAnimationFrame(advance);

  return {
    cancel: () => {
      cancelled = true;
      cancelAnimationFrame(animationFrame);
    },
  };
};

/**
 * PrismSweepTransition — a frame-level route/state transition with a custom
 * faceted caustic shader tuned for SmoothUI previews.
 */
const PrismSweepTransition = ({
  children,
  className,
  direction = "left",
  duration = DEFAULT_DURATION_MS,
  onRest,
  tone = "prism",
  transitionKey,
}: PrismSweepTransitionProps) => {
  const shouldReduceMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playbackRef = useRef<SweepPlayback | null>(null);
  const [renderedChildren, setRenderedChildren] = useState(children);
  const [isSweeping, setIsSweeping] = useState(false);
  const previousKey = useRef(transitionKey);
  const controllerRef = useShaderController({ canvasRef, direction, tone });

  useEffect(() => {
    if (previousKey.current === transitionKey) {
      setRenderedChildren(children);
      return;
    }

    previousKey.current = transitionKey;
    playbackRef.current?.cancel();

    if (shouldReduceMotion) {
      setRenderedChildren(children);
      setIsSweeping(false);
      onRest?.();
      return;
    }

    const controller = controllerRef.current;
    if (!controller) {
      setRenderedChildren(children);
      setIsSweeping(false);
      onRest?.();
      return;
    }

    setIsSweeping(true);
    playbackRef.current = playFrameSweep(controller, {
      direction,
      duration: Math.max(MIN_PHASE_MS, duration),
      midpoint: CONTENT_SWAP_RATIO,
      onComplete: () => {
        setIsSweeping(false);
        playbackRef.current = null;
        onRest?.();
      },
      onMidpoint: () => setRenderedChildren(children),
      outroMs: OUTRO_MS,
    });

    return () => {
      playbackRef.current?.cancel();
    };
  }, [
    children,
    controllerRef,
    direction,
    duration,
    onRest,
    shouldReduceMotion,
    transitionKey,
  ]);

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-2xl bg-background text-foreground",
        className
      )}
      data-sweeping={isSweeping ? "true" : "false"}
    >
      <div className="relative z-0">{renderedChildren}</div>
      <canvas
        className={cn(
          "pointer-events-none absolute inset-0 z-10 h-full w-full transition-opacity duration-75",
          isSweeping && !shouldReduceMotion ? "opacity-100" : "opacity-0"
        )}
        ref={canvasRef}
      />
    </div>
  );
};

export default PrismSweepTransition;
