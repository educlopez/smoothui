"use client";

import {
  ToggleGroupItem,
  ToggleGroupRoot,
} from "@repo/smoothui/components/toggle-group";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { useState } from "react";

const FeaturesDemo = () => {
  const [value, setValue] = useState<string[]>(["center"]);

  return (
    <div className="flex items-center justify-center p-8">
      <ToggleGroupRoot
        aria-label="Text alignment"
        onValueChange={setValue}
        value={value}
      >
        <ToggleGroupItem aria-label="Align left" value="left">
          <AlignLeft className="size-4" />
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Align center" value="center">
          <AlignCenter className="size-4" />
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Align right" value="right">
          <AlignRight className="size-4" />
        </ToggleGroupItem>
      </ToggleGroupRoot>
    </div>
  );
};

const MultipleDemo = () => (
  <div className="flex items-center justify-center p-8">
    <ToggleGroupRoot aria-label="Text style" defaultValue={["bold"]} multiple>
      <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
      <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
    </ToggleGroupRoot>
  </div>
);

const DisabledDemo = () => (
  <div className="flex flex-col items-center justify-center gap-4 p-8">
    <ToggleGroupRoot
      aria-label="Whole group disabled"
      defaultValue={["center"]}
      disabled
    >
      <ToggleGroupItem aria-label="Align left" value="left">
        <AlignLeft className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="Align center" value="center">
        <AlignCenter className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="Align right" value="right">
        <AlignRight className="size-4" />
      </ToggleGroupItem>
    </ToggleGroupRoot>
    <ToggleGroupRoot aria-label="One item disabled" defaultValue={["left"]}>
      <ToggleGroupItem aria-label="Align left" value="left">
        <AlignLeft className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="Align center" disabled value="center">
        <AlignCenter className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="Align right" value="right">
        <AlignRight className="size-4" />
      </ToggleGroupItem>
    </ToggleGroupRoot>
  </div>
);

export const demoScenes = {
  Disabled: DisabledDemo,
  Features: FeaturesDemo,
  Multiple: MultipleDemo,
};

export default function ToggleGroupDemo() {
  return <FeaturesDemo />;
}
