"use client";

import Calendar from "@repo/smoothui/components/calendar";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

const FeaturesDemo = () => {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 9, 2));

  return (
    <div className="flex justify-center p-6">
      <Calendar
        className="rounded-lg border shadow-sm"
        mode="single"
        onSelect={setDate}
        selected={date}
      />
    </div>
  );
};

const RangeDemo = () => {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2026, 9, 2),
    to: new Date(2026, 9, 8),
  });

  return (
    <div className="flex justify-center p-6">
      <Calendar
        className="rounded-lg border shadow-sm"
        mode="range"
        onSelect={setRange}
        selected={range}
      />
    </div>
  );
};

export const demoScenes = {
  Features: FeaturesDemo,
  Range: RangeDemo,
};

export default function CalendarDemo() {
  return <FeaturesDemo />;
}
