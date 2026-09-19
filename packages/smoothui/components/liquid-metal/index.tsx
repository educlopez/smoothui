"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { useReducedMotion } from "motion/react";
import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

export type LiquidMetalVariant = "chrome" | "gold" | "mercury" | "oil";

export interface LiquidMetalProps {
  /** Content rendered above the metal surface, or clipped to it when `maskText` is on. */
  children?: ReactNode;
  className?: string;
  /** Strength of the domain warp. `0` is an almost flat sheet, `2` is molten. */
  distortion?: number;
  /** Clip the material to the shape of the text instead of filling the box. */
  maskText?: boolean;
  /** Freeze the surface on its current frame. */
  paused?: boolean;
  /** Let the pointer push the flow field around. */
  pointerInfluence?: boolean;
  /** Time multiplier for the flow. */
  speed?: number;
  variant?: LiquidMetalVariant;
}

const DEFAULT_SPEED = 1;
const DEFAULT_DISTORTION = 1;
const MAX_DPR = 2;
const MS_PER_SECOND = 1000;
const MAX_FRAME_DELTA = 1 / 20;
const POINTER_EASE = 0.08;
const POINTER_RANGE = 2;
const POINTER_CENTER = 0.5;
const TEXT_SWEEP_SECONDS = 9;
const TEXT_SWEEP_RANGE = 100;
const TEXT_POINTER_SHIFT = 18;
const TEXT_BACKGROUND_SIZE = "300% 100%";
const HALF = 0.5;

const VARIANT_INDEX: Record<LiquidMetalVariant, number> = {
  chrome: 0,
  gold: 1,
  mercury: 2,
  oil: 3,
};

/**
 * Static CSS stand-ins used when WebGL2 is unavailable or motion is reduced.
 * Hex is intentional here: these mirror the shader palettes, which are not
 * expressible with theme tokens.
 */
const FALLBACK_SURFACE: Record<LiquidMetalVariant, string> = {
  chrome:
    "conic-gradient(from 210deg at 50% 50%, #0b0d10, #8f9aa8, #e9eef5, #6f7b8c, #cfd7e2, #14181d, #b9c3cf, #0b0d10)",
  gold: "conic-gradient(from 210deg at 50% 50%, #3a2708, #b3832a, #f6dd8f, #8a5f16, #ffeeb5, #2a1c05, #d9a842, #3a2708)",
  mercury:
    "conic-gradient(from 200deg at 50% 50%, #10141a, #7f8b99, #dbe4ee, #55606d, #ffffff, #1b2028, #a6b2c0, #10141a)",
  oil: "conic-gradient(from 190deg at 50% 50%, #1b1035, #3f7fd6, #38d0c0, #b9e05f, #f2a03d, #e0509b, #6b3fd6, #1b1035)",
};

const TEXT_SURFACE: Record<LiquidMetalVariant, string> = {
  chrome:
    "linear-gradient(100deg, #4a545f 0%, #e9eef5 16%, #8f9aa8 32%, #ffffff 46%, #6f7b8c 62%, #dfe6ef 78%, #3c454f 100%)",
  gold: "linear-gradient(100deg, #7a5410 0%, #f6dd8f 16%, #b3832a 32%, #fff6d0 46%, #8a5f16 62%, #edc862 78%, #6a460b 100%)",
  mercury:
    "linear-gradient(100deg, #55606d 0%, #dbe4ee 16%, #8f9aa8 32%, #ffffff 46%, #6b7684 62%, #cfd9e5 78%, #454f5b 100%)",
  oil: "linear-gradient(100deg, #3f7fd6 0%, #38d0c0 16%, #b9e05f 32%, #f2a03d 46%, #e0509b 62%, #6b3fd6 78%, #3f7fd6 100%)",
};

const VERTEX_SHADER = `#version 300 es
in vec2 a;
void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
out vec4 fragColor;
uniform vec2 uRes;
uniform float uTime;
uniform float uDistortion;
uniform float uVariant;
uniform vec2 uPointer;

float hash(vec2 p){
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

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

float fbm(vec2 p){
  float value = 0.0;
  float amplitude = 0.5;
  mat2 turn = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++){
    value += amplitude * noise(p);
    p = turn * p;
    amplitude *= 0.5;
  }
  return value;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 aspect = vec2(uRes.x / uRes.y, 1.0);
  vec2 p = (uv - 0.5) * aspect * 2.2;
  vec2 push = uPointer * 0.55;
  float warp = clamp(uDistortion, 0.0, 3.0);

  vec2 q = vec2(fbm(p + push), fbm(p + vec2(5.2, 1.3) - push));
  vec2 flow = p + warp * 3.2 * q;
  vec2 r = vec2(
    fbm(flow + vec2(1.7, 9.2) + uTime * 0.17),
    fbm(flow + vec2(8.3, 2.8) - uTime * 0.13)
  );

  vec2 base = p + warp * 2.8 * r;
  float eps = 0.006;
  float h = fbm(base);
  float hx = fbm(base + vec2(eps, 0.0));
  float hy = fbm(base + vec2(0.0, eps));
  vec3 n = normalize(vec3((h - hx) / eps * 0.05, (h - hy) / eps * 0.05, 1.0));

  vec3 view = normalize(vec3((uv - 0.5) * aspect, 1.0));
  vec3 refl = reflect(view, n);
  float f = clamp(refl.y * 0.5 + 0.5, 0.0, 1.0);
  float sideways = clamp(refl.x * 0.5 + 0.5, 0.0, 1.0);

  vec3 lo = vec3(0.04, 0.05, 0.07);
  vec3 hi = vec3(0.90, 0.94, 0.99);
  vec3 tint = vec3(0.58, 0.68, 0.85);

  if (uVariant > 0.5 && uVariant < 1.5) {
    lo = vec3(0.16, 0.10, 0.02);
    hi = vec3(1.00, 0.90, 0.62);
    tint = vec3(0.82, 0.58, 0.14);
  } else if (uVariant > 1.5 && uVariant < 2.5) {
    lo = vec3(0.06, 0.08, 0.10);
    hi = vec3(1.00, 1.00, 1.00);
    tint = vec3(0.50, 0.58, 0.68);
  } else if (uVariant > 2.5) {
    lo = vec3(0.05, 0.03, 0.14);
    hi = vec3(0.85, 0.92, 1.00);
    tint = vec3(0.35, 0.55, 0.90);
  }

  vec3 col = mix(lo, hi, smoothstep(0.04, 0.96, f));
  col = mix(col, tint, pow(sideways, 2.0) * 0.55);

  float spec = pow(max(dot(n, normalize(vec3(0.35, 0.75, 0.55))), 0.0), 42.0);
  float fresnel = pow(1.0 - clamp(n.z, 0.0, 1.0), 3.0);
  col += spec * 0.85 + fresnel * 0.20;

  if (uVariant > 2.5) {
    vec3 sheen = 0.5 + 0.5 * cos(6.28318 * (f + h * 0.75 + vec3(0.0, 0.33, 0.67)));
    col = mix(col, sheen, 0.72);
  }

  fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

const STRIP = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

interface MetalController {
  destroy: () => void;
  setDistortion: (value: number) => void;
  setPointer: (x: number, y: number) => void;
  setRunning: (running: boolean) => void;
  setSpeed: (value: number) => void;
  setVariant: (value: LiquidMetalVariant) => void;
}

const compileShader = (
  gl: WebGL2RenderingContext,
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

const resizeCanvas = (
  canvas: HTMLCanvasElement,
  gl: WebGL2RenderingContext
) => {
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

const createMetalController = (
  canvas: HTMLCanvasElement,
  initialVariant: LiquidMetalVariant,
  initialSpeed: number,
  initialDistortion: number
): MetalController | null => {
  const gl = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    powerPreference: "low-power",
  });
  if (!gl) {
    return null;
  }

  const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
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

  // biome-ignore lint/correctness/useHookAtTopLevel: WebGL2RenderingContext.useProgram is not a React hook.
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, STRIP, gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "a");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, "uRes");
  const uTime = gl.getUniformLocation(program, "uTime");
  const uDistortion = gl.getUniformLocation(program, "uDistortion");
  const uVariant = gl.getUniformLocation(program, "uVariant");
  const uPointer = gl.getUniformLocation(program, "uPointer");

  let variant = initialVariant;
  let speed = initialSpeed;
  let distortion = initialDistortion;
  let elapsed = 0;
  let lastFrameAt = performance.now();
  let frame = 0;
  let running = false;
  let destroyed = false;
  let pointerX = 0;
  let pointerY = 0;
  let targetX = 0;
  let targetY = 0;

  const draw = () => {
    resizeCanvas(canvas, gl);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, elapsed);
    gl.uniform1f(uDistortion, distortion);
    gl.uniform1f(uVariant, VARIANT_INDEX[variant]);
    gl.uniform2f(uPointer, pointerX, pointerY);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  const tick = () => {
    if (destroyed) {
      return;
    }
    const now = performance.now();
    const delta = Math.min(
      (now - lastFrameAt) / MS_PER_SECOND,
      MAX_FRAME_DELTA
    );
    lastFrameAt = now;
    elapsed += delta * speed;
    pointerX += (targetX - pointerX) * POINTER_EASE;
    pointerY += (targetY - pointerY) * POINTER_EASE;
    draw();
    frame = requestAnimationFrame(tick);
  };

  draw();

  return {
    destroy: () => {
      destroyed = true;
      cancelAnimationFrame(frame);
      if (buffer) {
        gl.deleteBuffer(buffer);
      }
      gl.deleteProgram(program);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
    setDistortion: (value: number) => {
      distortion = value;
    },
    setPointer: (x: number, y: number) => {
      targetX = x;
      targetY = y;
    },
    setRunning: (next: boolean) => {
      if (destroyed || next === running) {
        return;
      }
      running = next;
      if (running) {
        lastFrameAt = performance.now();
        frame = requestAnimationFrame(tick);
        return;
      }
      cancelAnimationFrame(frame);
      draw();
    },
    setSpeed: (value: number) => {
      speed = value;
    },
    setVariant: (value: LiquidMetalVariant) => {
      variant = value;
    },
  };
};

const LiquidMetal = ({
  children,
  className,
  distortion = DEFAULT_DISTORTION,
  maskText = false,
  paused = false,
  pointerInfluence = true,
  speed = DEFAULT_SPEED,
  variant = "chrome",
}: LiquidMetalProps) => {
  const shouldReduceMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const controllerRef = useRef<MetalController | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [isSupported, setIsSupported] = useState(true);
  const [isInView, setIsInView] = useState(true);

  const usesShader = !(maskText || shouldReduceMotion) && isSupported;
  const isPlaying = !(paused || shouldReduceMotion) && isInView;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        setIsInView(entry.isIntersecting);
      }
    });
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  // The GL context is rebuilt only when the rendering strategy changes; live
  // uniform values are pushed through the setters in the effect below.
  // biome-ignore lint/correctness/useExhaustiveDependencies: initial uniform values must not restart the context.
  useEffect(() => {
    if (!usesShader) {
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const controller = createMetalController(
      canvas,
      variant,
      speed,
      distortion
    );
    if (!controller) {
      setIsSupported(false);
      return;
    }
    controllerRef.current = controller;
    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, [usesShader]);

  useEffect(() => {
    const controller = controllerRef.current;
    if (!controller) {
      return;
    }
    controller.setVariant(variant);
    controller.setSpeed(speed);
    controller.setDistortion(distortion);
  }, [distortion, speed, variant]);

  useEffect(() => {
    controllerRef.current?.setRunning(isPlaying);
  }, [isPlaying]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!(wrapper && pointerInfluence) || shouldReduceMotion) {
      return;
    }
    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!hoverQuery.matches) {
      return;
    }

    const handleMove = (event: PointerEvent) => {
      const rect = wrapper.getBoundingClientRect();
      const x =
        ((event.clientX - rect.left) / rect.width - POINTER_CENTER) *
        POINTER_RANGE;
      const y =
        (POINTER_CENTER - (event.clientY - rect.top) / rect.height) *
        POINTER_RANGE;
      pointerRef.current = { x, y };
      controllerRef.current?.setPointer(x, y);
    };
    const handleLeave = () => {
      pointerRef.current = { x: 0, y: 0 };
      controllerRef.current?.setPointer(0, 0);
    };

    wrapper.addEventListener("pointermove", handleMove);
    wrapper.addEventListener("pointerleave", handleLeave);
    return () => {
      wrapper.removeEventListener("pointermove", handleMove);
      wrapper.removeEventListener("pointerleave", handleLeave);
    };
  }, [pointerInfluence, shouldReduceMotion]);

  useEffect(() => {
    const node = textRef.current;
    if (!(maskText && node) || shouldReduceMotion || paused || !isInView) {
      return;
    }
    let frame = 0;
    const startedAt = performance.now();
    const step = () => {
      const seconds =
        ((performance.now() - startedAt) / MS_PER_SECOND) * Math.max(speed, 0);
      const cycle = (seconds / TEXT_SWEEP_SECONDS) % 1;
      const offset = pointerInfluence
        ? pointerRef.current.x * TEXT_POINTER_SHIFT
        : 0;
      node.style.backgroundPosition = `${cycle * TEXT_SWEEP_RANGE + offset}% 50%`;
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [isInView, maskText, paused, pointerInfluence, shouldReduceMotion, speed]);

  if (maskText) {
    const textStyle: CSSProperties = {
      backgroundClip: "text",
      backgroundImage: TEXT_SURFACE[variant],
      backgroundPosition: `${TEXT_SWEEP_RANGE * HALF}% 50%`,
      backgroundSize: TEXT_BACKGROUND_SIZE,
      color: "transparent",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    };

    return (
      <span
        className={cn("inline-block", className)}
        ref={(node) => {
          wrapperRef.current = node;
        }}
      >
        <span ref={textRef} style={textStyle}>
          {children}
        </span>
      </span>
    );
  }

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-2xl bg-background",
        className
      )}
      ref={(node) => {
        wrapperRef.current = node;
      }}
    >
      {usesShader ? (
        <div aria-hidden="true" className="absolute inset-0 z-0">
          <canvas className="h-full w-full" ref={canvasRef} />
        </div>
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0"
          style={{ backgroundImage: FALLBACK_SURFACE[variant] }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default LiquidMetal;
