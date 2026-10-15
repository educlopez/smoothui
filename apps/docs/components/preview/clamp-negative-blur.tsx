"use client";

import { useLayoutEffect } from "react";

const BLUR_AMOUNT = /blur\(\s*(-?[\d.]+)px\s*\)/gi;

const clampBlur = (value: string): string =>
  value.replace(
    BLUR_AMOUNT,
    (_match, amount: string) => `blur(${Math.max(0, Number(amount))}px)`
  );

let installed = false;

const installClamp = () => {
  if (installed || typeof window === "undefined") {
    return;
  }
  installed = true;
  const proto = CSSStyleDeclaration.prototype;
  const originalSetProperty = proto.setProperty;
  proto.setProperty = function setProperty(property, value, priority) {
    const nextValue =
      (property === "filter" || property === "webkitFilter") &&
      typeof value === "string"
        ? clampBlur(value)
        : value;
    return originalSetProperty.call(this, property, nextValue, priority);
  };

  const describe = (name: "filter" | "webkitFilter") => {
    const descriptor = Object.getOwnPropertyDescriptor(proto, name);
    if (!(descriptor?.set && descriptor.get)) {
      return;
    }
    Object.defineProperty(proto, name, {
      configurable: true,
      enumerable: descriptor.enumerable,
      get() {
        return descriptor.get?.call(this);
      },
      set(value: string) {
        descriptor.set?.call(
          this,
          typeof value === "string" ? clampBlur(value) : value
        );
      },
    });
  };

  describe("filter");
  describe("webkitFilter");
};

/**
 * Hero block springs can overshoot `blur(0px)` into a negative radius, which
 * Chromium logs as `blur(-0.55px)`. Clamp at the style boundary so the docs
 * preview never writes an invalid filter.
 */
if (typeof window !== "undefined") {
  installClamp();
}

export function ClampNegativeBlur() {
  useLayoutEffect(() => {
    installClamp();
  }, []);

  return null;
}
