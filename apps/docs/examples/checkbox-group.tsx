"use client";

import {
  CheckboxGroup,
  CheckboxGroupItem,
} from "@repo/smoothui/components/checkbox-group";
import { useState } from "react";

const FRUITS = ["fuji", "gala", "granny"];

const FeaturesDemo = () => {
  const [value, setValue] = useState<string[]>(["fuji"]);

  return (
    <div className="flex w-full max-w-xs items-center justify-center p-8">
      <CheckboxGroup
        allValues={FRUITS}
        aria-label="Apples"
        onValueChange={setValue}
        value={value}
      >
        <CheckboxGroupItem parent>All apples</CheckboxGroupItem>
        <CheckboxGroupItem value="fuji">Fuji</CheckboxGroupItem>
        <CheckboxGroupItem value="gala">Gala</CheckboxGroupItem>
        <CheckboxGroupItem value="granny">Granny Smith</CheckboxGroupItem>
      </CheckboxGroup>
    </div>
  );
};

const DisabledDemo = () => (
  <div className="flex w-full max-w-xs items-center justify-center p-8">
    <CheckboxGroup
      allValues={FRUITS}
      aria-label="Apples"
      defaultValue={["gala"]}
      disabled
    >
      <CheckboxGroupItem parent>All apples</CheckboxGroupItem>
      <CheckboxGroupItem value="fuji">Fuji</CheckboxGroupItem>
      <CheckboxGroupItem value="gala">Gala</CheckboxGroupItem>
      <CheckboxGroupItem value="granny">Granny Smith</CheckboxGroupItem>
    </CheckboxGroup>
  </div>
);

export const demoScenes = {
  Disabled: DisabledDemo,
  Features: FeaturesDemo,
};

export default function CheckboxGroupDemo() {
  return <FeaturesDemo />;
}
