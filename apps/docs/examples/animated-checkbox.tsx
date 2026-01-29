"use client";

import AnimatedCheckbox from "@repo/smoothui/components/animated-checkbox";
import { useState } from "react";

export default function AnimatedCheckboxDemo() {
  const [drawChecked, setDrawChecked] = useState(false);
  const [popChecked, setPopChecked] = useState(false);
  const [morphChecked, setMorphChecked] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">Draw variant</p>
        <div className="flex items-center gap-6">
          <AnimatedCheckbox
            checked={drawChecked}
            label="Small"
            onChange={setDrawChecked}
            size="sm"
            variant="draw"
          />
          <AnimatedCheckbox
            checked={drawChecked}
            label="Medium"
            onChange={setDrawChecked}
            size="md"
            variant="draw"
          />
          <AnimatedCheckbox
            checked={drawChecked}
            label="Large"
            onChange={setDrawChecked}
            size="lg"
            variant="draw"
          />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">Pop variant</p>
        <div className="flex items-center gap-6">
          <AnimatedCheckbox
            checked={popChecked}
            label="Small"
            onChange={setPopChecked}
            size="sm"
            variant="pop"
          />
          <AnimatedCheckbox
            checked={popChecked}
            label="Medium"
            onChange={setPopChecked}
            size="md"
            variant="pop"
          />
          <AnimatedCheckbox
            checked={popChecked}
            label="Large"
            onChange={setPopChecked}
            size="lg"
            variant="pop"
          />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">Morph variant</p>
        <div className="flex items-center gap-6">
          <AnimatedCheckbox
            checked={morphChecked}
            label="Small"
            onChange={setMorphChecked}
            size="sm"
            variant="morph"
          />
          <AnimatedCheckbox
            checked={morphChecked}
            label="Medium"
            onChange={setMorphChecked}
            size="md"
            variant="morph"
          />
          <AnimatedCheckbox
            checked={morphChecked}
            label="Large"
            onChange={setMorphChecked}
            size="lg"
            variant="morph"
          />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">Indeterminate state</p>
        <div className="flex items-center gap-6">
          <AnimatedCheckbox
            indeterminate
            label="Draw indeterminate"
            size="md"
            variant="draw"
          />
          <AnimatedCheckbox
            indeterminate
            label="Pop indeterminate"
            size="md"
            variant="pop"
          />
          <AnimatedCheckbox
            indeterminate
            label="Morph indeterminate"
            size="md"
            variant="morph"
          />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">Disabled state</p>
        <div className="flex items-center gap-6">
          <AnimatedCheckbox
            disabled
            label="Disabled unchecked"
            size="md"
            variant="draw"
          />
          <AnimatedCheckbox
            defaultChecked
            disabled
            label="Disabled checked"
            size="md"
            variant="draw"
          />
        </div>
      </div>
    </div>
  );
}
