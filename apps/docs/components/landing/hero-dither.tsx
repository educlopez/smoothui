"use client";

import { useReducedMotion } from "motion/react";
import { useLayoutEffect, useRef } from "react";

const CELL_CSS_PX = 2;

const BAYER_4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;
uniform sampler2D uTex;
uniform sampler2D uBayer;
uniform vec2 uResolution;
uniform float uTime;
uniform float uCell;

void main() {
  vec2 cell = floor(gl_FragCoord.xy / uCell);
  vec2 uv = (cell * uCell + uCell * 0.5) / uResolution;
  vec3 color = texture2D(uTex, uv).rgb;
  float lum = dot(color, vec3(0.2126, 0.7152, 0.0722));
  float wave = sin(cell.x * 0.042 + uTime) * 0.55
    + cos(cell.y * 0.036 - uTime * 0.72) * 0.45;
  float value = clamp(lum * 0.74 + wave * 0.2 + 0.06, 0.0, 1.0);
  float threshold = texture2D(uBayer, (mod(cell, 4.0) + 0.5) / 4.0).r;
  float bit = step(threshold, value);
  vec3 shade = mix(color * 0.72, min(color * 1.14, vec3(1.0)), bit);
  gl_FragColor = vec4(shade, 1.0);
}
`;

const images = new Map<string, HTMLImageElement>();

const loadImage = (src: string) => {
  const cached = images.get(src);
  if (cached) {
    return cached;
  }
  const image = new Image();
  image.decoding = "async";
  image.src = src;
  images.set(src, image);
  return image;
};

const compile = (
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null => {
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

type HeroDitherProps = {
  height: number;
  onFallback: () => void;
  src: string;
  width: number;
};

export const HeroDither = ({
  height,
  onFallback,
  src,
  width,
}: HeroDitherProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const reduceRef = useRef(shouldReduceMotion === true);
  const sizeRef = useRef({ height, width });
  const fallbackRef = useRef(onFallback);
  const paintRef = useRef<(() => void) | null>(null);
  reduceRef.current = shouldReduceMotion === true;
  sizeRef.current = { height, width };
  fallbackRef.current = onFallback;

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "low-power",
    });
    if (!gl) {
      fallbackRef.current();
      return;
    }

    const vertex = compile(gl, gl.VERTEX_SHADER, VERT);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const program = vertex && fragment ? gl.createProgram() : null;
    if (!(vertex && fragment && program)) {
      fallbackRef.current();
      return;
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      fallbackRef.current();
      return;
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const bayer = gl.createTexture();
    const imageTexture = gl.createTexture();
    const resolution = gl.getUniformLocation(program, "uResolution");
    const cell = gl.getUniformLocation(program, "uCell");
    const time = gl.getUniformLocation(program, "uTime");
    const position = gl.getAttribLocation(program, "aPos");

    const bind = () => {
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, bayer);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.LUMINANCE,
        4,
        4,
        0,
        gl.LUMINANCE,
        gl.UNSIGNED_BYTE,
        new Uint8Array(
          BAYER_4.map((value) => Math.round(((value + 0.5) / 16) * 255))
        )
      );
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, imageTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform1i(gl.getUniformLocation(program, "uTex"), 0);
      gl.uniform1i(gl.getUniformLocation(program, "uBayer"), 1);
      gl.uniform1f(cell, 1);
    };

    let frame = 0;
    let stopped = false;
    let visible = true;
    let uploaded = false;
    let source: HTMLImageElement | null = null;
    const started = performance.now();

    const fit = () => {
      const nextWidth = Math.max(
        1,
        Math.round(sizeRef.current.width / CELL_CSS_PX)
      );
      const nextHeight = Math.max(
        1,
        Math.round(sizeRef.current.height / CELL_CSS_PX)
      );
      const resized =
        canvas.width !== nextWidth || canvas.height !== nextHeight;
      if (resized) {
        canvas.width = nextWidth;
        canvas.height = nextHeight;
        bind();
        if (source) {
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, imageTexture);
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            source
          );
        }
      }
      gl.useProgram(program);
      gl.viewport(0, 0, nextWidth, nextHeight);
      gl.uniform2f(resolution, nextWidth, nextHeight);
    };

    const draw = (now: number) => {
      if (stopped || !uploaded) {
        return;
      }
      fit();
      const seconds = reduceRef.current ? 0 : (now - started) / 1000;
      gl.uniform1f(time, seconds * 0.85);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      canvas.style.opacity = "1";
      const keepPainting =
        !reduceRef.current && visible && document.visibilityState === "visible";
      if (keepPainting) {
        frame = requestAnimationFrame(draw);
      }
    };

    const wake = () => {
      if (stopped || reduceRef.current || !visible) {
        return;
      }
      if (document.visibilityState !== "visible") {
        return;
      }
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      wake();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      if (visible) {
        wake();
      } else {
        cancelAnimationFrame(frame);
      }
    });
    observer.observe(canvas);

    const upload = () => {
      if (stopped) {
        return;
      }
      const image = loadImage(src);
      if (image.naturalWidth < 1) {
        return;
      }
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      bind();
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image
      );
      uploaded = true;
      source = image;
      draw(performance.now());
    };

    paintRef.current = () => {
      cancelAnimationFrame(frame);
      draw(performance.now());
    };

    const image = loadImage(src);
    if (image.complete && image.naturalWidth > 0) {
      upload();
    } else {
      image.addEventListener("load", upload, { once: true });
      image.addEventListener("error", () => fallbackRef.current(), {
        once: true,
      });
    }

    return () => {
      stopped = true;
      paintRef.current = null;
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      image.removeEventListener("load", upload);
      gl.deleteTexture(imageTexture);
      gl.deleteTexture(bayer);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, [src]);

  useLayoutEffect(() => {
    paintRef.current?.();
  }, [height, width]);

  return (
    <canvas
      aria-hidden
      className="absolute inset-0 h-full w-full opacity-0 [image-rendering:pixelated]"
      ref={canvasRef}
    />
  );
};
