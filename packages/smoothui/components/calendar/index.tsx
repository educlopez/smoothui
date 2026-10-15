"use client";

import { cn } from "@repo/smoothui-utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { type ComponentProps, useEffect, useRef } from "react";
import {
  type DayButton,
  DayPicker,
  getDefaultClassNames,
} from "react-day-picker";

export type CalendarProps = ComponentProps<typeof DayPicker>;

const CalendarDayButton = ({
  className,
  day,
  modifiers,
  ...props
}: ComponentProps<typeof DayButton>) => {
  const defaultClassNames = getDefaultClassNames();
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (modifiers.focused) {
      ref.current?.focus();
    }
  }, [modifiers.focused]);

  return (
    <button
      {...props}
      className={cn(
        "flex aspect-square size-auto w-full min-w-(--cell-size) flex-col items-center justify-center gap-1 rounded-md p-0 font-normal text-sm leading-none",
        "hover:bg-foreground/10",
        "group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10",
        "group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-ring/50",
        // Use foreground fill — primary can be near-invisible in dark themes
        "data-[selected-single=true]:bg-foreground data-[selected-single=true]:text-background",
        "data-[range-start=true]:rounded-l-md data-[range-start=true]:bg-foreground data-[range-start=true]:text-background",
        "data-[range-end=true]:rounded-r-md data-[range-end=true]:bg-foreground data-[range-end=true]:text-background",
        "data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-foreground/15 data-[range-middle=true]:text-foreground",
        defaultClassNames.day_button,
        className
      )}
      data-day={`${day.date.getFullYear()}-${day.date.getMonth() + 1}-${day.date.getDate()}`}
      data-range-end={modifiers.range_end || undefined}
      data-range-middle={modifiers.range_middle || undefined}
      data-range-start={modifiers.range_start || undefined}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
          ? "true"
          : undefined
      }
      ref={ref}
      type="button"
    />
  );
};

const CalendarChevron = ({
  orientation,
  className: chevronClass,
  ...chevronProps
}: {
  className?: string;
  orientation?: "left" | "right" | "up" | "down";
} & ComponentProps<"svg">) => {
  const Icon = orientation === "left" ? ChevronLeftIcon : ChevronRightIcon;
  return <Icon className={cn("size-4", chevronClass)} {...chevronProps} />;
};

/**
 * SmoothUI Calendar — react-day-picker with SmoothUI surface tokens.
 * Compose with Popover for a date-picker field.
 */
export default function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      className={cn("group/calendar w-fit p-3 [--cell-size:2rem]", className)}
      classNames={{
        button_next: cn(
          "inline-flex size-(--cell-size) select-none items-center justify-center rounded-md p-0 text-muted-foreground hover:bg-foreground/10 hover:text-foreground disabled:opacity-50",
          defaultClassNames.button_next
        ),
        button_previous: cn(
          "inline-flex size-(--cell-size) select-none items-center justify-center rounded-md p-0 text-muted-foreground hover:bg-foreground/10 hover:text-foreground disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        caption_label: cn(
          "select-none font-medium text-sm",
          defaultClassNames.caption_label
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center",
          "[&:first-child[data-selected=true]_button]:rounded-l-md",
          "[&:last-child[data-selected=true]_button]:rounded-r-md",
          defaultClassNames.day
        ),
        disabled: cn(
          "text-muted-foreground/40 opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between",
          defaultClassNames.nav
        ),
        outside: cn("text-muted-foreground/50", defaultClassNames.outside),
        range_end: cn(
          "rounded-r-md bg-primary/15",
          defaultClassNames.range_end
        ),
        range_middle: cn(
          "rounded-none bg-primary/15",
          defaultClassNames.range_middle
        ),
        range_start: cn(
          "rounded-l-md bg-primary/15",
          defaultClassNames.range_start
        ),
        root: cn("w-fit", defaultClassNames.root),
        today: cn(
          "rounded-md bg-foreground/10 font-medium text-foreground data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        weekday: cn(
          "flex-1 select-none rounded-md font-normal text-[0.8rem] text-muted-foreground",
          defaultClassNames.weekday
        ),
        weekdays: cn("flex", defaultClassNames.weekdays),
        ...classNames,
      }}
      components={{
        Chevron: CalendarChevron,
        DayButton: CalendarDayButton,
      }}
      data-slot="calendar"
      showOutsideDays={showOutsideDays}
      {...props}
    />
  );
}
