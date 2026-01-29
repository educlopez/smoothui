"use client";

import AnimatedToggle from "@repo/smoothui/components/animated-toggle";
import { useState } from "react";

const SunIcon = () => (
  <svg
    className="size-full"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" x2="12" y1="1" y2="3" />
    <line x1="12" x2="12" y1="21" y2="23" />
    <line x1="4.22" x2="5.64" y1="4.22" y2="5.64" />
    <line x1="18.36" x2="19.78" y1="18.36" y2="19.78" />
    <line x1="1" x2="3" y1="12" y2="12" />
    <line x1="21" x2="23" y1="12" y2="12" />
    <line x1="4.22" x2="5.64" y1="19.78" y2="18.36" />
    <line x1="18.36" x2="19.78" y1="5.64" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg
    className="size-full"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="size-full"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="3"
    viewBox="0 0 24 24"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const XIcon = () => (
  <svg
    className="size-full"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="3"
    viewBox="0 0 24 24"
  >
    <line x1="18" x2="6" y1="6" y2="18" />
    <line x1="6" x2="18" y1="6" y2="18" />
  </svg>
);

export default function AnimatedToggleDemo() {
  const [defaultChecked, setDefaultChecked] = useState(false);
  const [morphChecked, setMorphChecked] = useState(false);
  const [iconChecked, setIconChecked] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">Default variant</p>
        <div className="flex items-center gap-6">
          <AnimatedToggle
            checked={defaultChecked}
            label="Default toggle small"
            onChange={setDefaultChecked}
            size="sm"
            variant="default"
          />
          <AnimatedToggle
            checked={defaultChecked}
            label="Default toggle medium"
            onChange={setDefaultChecked}
            size="md"
            variant="default"
          />
          <AnimatedToggle
            checked={defaultChecked}
            label="Default toggle large"
            onChange={setDefaultChecked}
            size="lg"
            variant="default"
          />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">Morph variant</p>
        <div className="flex items-center gap-6">
          <AnimatedToggle
            checked={morphChecked}
            label="Morph toggle small"
            onChange={setMorphChecked}
            size="sm"
            variant="morph"
          />
          <AnimatedToggle
            checked={morphChecked}
            label="Morph toggle medium"
            onChange={setMorphChecked}
            size="md"
            variant="morph"
          />
          <AnimatedToggle
            checked={morphChecked}
            label="Morph toggle large"
            onChange={setMorphChecked}
            size="lg"
            variant="morph"
          />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">Icon variant</p>
        <div className="flex items-center gap-6">
          <AnimatedToggle
            checked={iconChecked}
            icons={{ on: <SunIcon />, off: <MoonIcon /> }}
            label="Theme toggle small"
            onChange={setIconChecked}
            size="sm"
            variant="icon"
          />
          <AnimatedToggle
            checked={iconChecked}
            icons={{ on: <SunIcon />, off: <MoonIcon /> }}
            label="Theme toggle medium"
            onChange={setIconChecked}
            size="md"
            variant="icon"
          />
          <AnimatedToggle
            checked={iconChecked}
            icons={{ on: <SunIcon />, off: <MoonIcon /> }}
            label="Theme toggle large"
            onChange={setIconChecked}
            size="lg"
            variant="icon"
          />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">With check/x icons</p>
        <div className="flex items-center gap-6">
          <AnimatedToggle
            icons={{ on: <CheckIcon />, off: <XIcon /> }}
            label="Confirmation toggle"
            size="md"
            variant="icon"
          />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">Disabled state</p>
        <div className="flex items-center gap-6">
          <AnimatedToggle
            disabled
            label="Disabled toggle off"
            size="md"
            variant="default"
          />
          <AnimatedToggle
            defaultChecked
            disabled
            label="Disabled toggle on"
            size="md"
            variant="default"
          />
        </div>
      </div>
    </div>
  );
}
