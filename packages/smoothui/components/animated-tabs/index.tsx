"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { type ReactNode, useCallback, useId, useState } from "react";

export type AnimatedTabsProps = {
  tabs: { id: string; label: string; icon?: ReactNode }[];
  activeTab?: string;
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: "underline" | "pill" | "segment";
  layoutId?: string;
  className?: string;
};

const SPRING = {
  type: "spring" as const,
  duration: 0.25,
  bounce: 0.05,
};

export default function AnimatedTabs({
  tabs,
  activeTab: controlledActiveTab,
  defaultTab,
  onChange,
  variant = "underline",
  layoutId: customLayoutId,
  className,
}: AnimatedTabsProps) {
  const shouldReduceMotion = useReducedMotion();
  const generatedId = useId();
  const layoutId = customLayoutId ?? `animated-tabs-${generatedId}`;

  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultTab ?? tabs[0]?.id ?? ""
  );

  const isControlled = controlledActiveTab !== undefined;
  const activeTab = isControlled ? controlledActiveTab : internalActiveTab;

  const handleTabChange = useCallback(
    (tabId: string) => {
      if (!isControlled) {
        setInternalActiveTab(tabId);
      }
      onChange?.(tabId);
    },
    [isControlled, onChange]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, currentIndex: number) => {
      let newIndex = currentIndex;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        newIndex = (currentIndex + 1) % tabs.length;
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") {
        event.preventDefault();
        newIndex = 0;
      } else if (event.key === "End") {
        event.preventDefault();
        newIndex = tabs.length - 1;
      } else {
        return;
      }

      const newTab = tabs[newIndex];
      if (newTab) {
        handleTabChange(newTab.id);
        const tabElement = document.getElementById(
          `${layoutId}-tab-${newTab.id}`
        );
        tabElement?.focus();
      }
    },
    [tabs, handleTabChange, layoutId]
  );

  const baseContainerStyles = cn(
    "relative inline-flex",
    variant === "underline" && "gap-1 border-border border-b",
    variant === "pill" && "gap-1 rounded-full bg-muted p-1",
    variant === "segment" && "gap-0 rounded-lg bg-muted p-1"
  );

  const getTabStyles = (isActive: boolean) =>
    cn(
      "relative z-10 flex items-center justify-center gap-2 px-4 py-2 font-medium text-sm transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      variant === "underline" && [
        "rounded-t-md",
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
      ],
      variant === "pill" && [
        "rounded-full",
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
      ],
      variant === "segment" && [
        "flex-1 rounded-md",
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
      ]
    );

  const getIndicatorStyles = () =>
    cn(
      "absolute",
      variant === "underline" && "right-0 bottom-0 left-0 h-0.5 bg-primary",
      variant === "pill" && "inset-0 rounded-full bg-background shadow-sm",
      variant === "segment" && "inset-0 rounded-md bg-background shadow-sm"
    );

  return (
    <div
      aria-label="Tabs"
      className={cn(baseContainerStyles, className)}
      role="tablist"
    >
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            aria-selected={isActive}
            className={getTabStyles(isActive)}
            id={`${layoutId}-tab-${tab.id}`}
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            role="tab"
            tabIndex={isActive ? 0 : -1}
            type="button"
          >
            {isActive && (
              <motion.span
                className={getIndicatorStyles()}
                layout
                layoutId={layoutId}
                style={{ originY: "0px" }}
                transition={shouldReduceMotion ? { duration: 0 } : SPRING}
              />
            )}
            {tab.icon && <span className="relative z-10">{tab.icon}</span>}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
