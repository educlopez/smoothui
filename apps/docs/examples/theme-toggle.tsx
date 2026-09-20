"use client";

import type { ThemeToggleValue } from "@repo/smoothui/components/theme-toggle";
import ThemeToggle, {
  type ThemeToggleVariant,
} from "@repo/smoothui/components/theme-toggle";
import { useState } from "react";

/**
 * One control, centred on the stage. Captions and "Appearance" chrome live in
 * the docs column — the panel only shows the thing being explained.
 */
const VariantScene = ({
  variant,
  showSystem = false,
}: {
  variant: ThemeToggleVariant;
  showSystem?: boolean;
}) => {
  const [theme, setTheme] = useState<ThemeToggleValue>("light");
  const binaryTheme: ThemeToggleValue = theme === "system" ? "light" : theme;

  return (
    <div className="flex items-center justify-center p-8">
      <ThemeToggle
        onThemeChange={setTheme}
        showSystem={showSystem}
        size="md"
        theme={showSystem ? theme : binaryTheme}
        variant={variant}
      />
    </div>
  );
};

const FeaturesDemo = () => <VariantScene variant="sun-moon" />;
const SunMoonDemo = () => <VariantScene variant="sun-moon" />;
const PillDemo = () => <VariantScene variant="pill" />;
const SwitchDemo = () => <VariantScene variant="switch" />;
const OrbDemo = () => <VariantScene variant="orb" />;
const BinaryDemo = () => <VariantScene showSystem={false} variant="pill" />;
const ThreeWayDemo = () => <VariantScene showSystem variant="switch" />;

export const demoScenes = {
  Binary: BinaryDemo,
  Features: FeaturesDemo,
  Orb: OrbDemo,
  Pill: PillDemo,
  "Sun Moon": SunMoonDemo,
  Switch: SwitchDemo,
  "Three-way": ThreeWayDemo,
};

export default function ThemeToggleDemo() {
  return <FeaturesDemo />;
}
