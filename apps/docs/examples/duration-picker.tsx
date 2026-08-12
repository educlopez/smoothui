"use client";

import DurationPicker, {
  formatDuration,
} from "@repo/smoothui/components/duration-picker";
import { useState } from "react";

export default function DurationPickerDemo() {
  const [timer, setTimer] = useState(90);
  const [countdown, setCountdown] = useState(5400);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-8 px-4 py-8">
      <div className="flex flex-col items-center gap-2">
        <DurationPicker
          label="Timer"
          onValueChange={setTimer}
          units={["minutes", "seconds"]}
          value={timer}
        />
        <p className="text-muted-foreground text-xs">
          {formatDuration(timer, ["minutes", "seconds"])} selected
        </p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <DurationPicker
          label="Meeting length"
          max={7200}
          min={0}
          onValueChange={setCountdown}
          step={5}
          value={countdown}
        />
        <p className="text-muted-foreground text-xs">
          {formatDuration(countdown)} selected
        </p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <DurationPicker defaultValue={0} disabled label="Disabled" />
      </div>
    </div>
  );
}
