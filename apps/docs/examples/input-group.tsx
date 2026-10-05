"use client";

import Input from "@repo/smoothui/components/input";
import InputGroup, {
  InputGroupAddon,
  InputGroupText,
} from "@repo/smoothui/components/input-group";

const FeaturesDemo = () => (
  <div className="flex w-full max-w-sm flex-col gap-4 p-8">
    <InputGroup>
      <InputGroupAddon>
        <InputGroupText>$</InputGroupText>
      </InputGroupAddon>
      <Input aria-label="Amount" placeholder="0.00" />
    </InputGroup>
    <InputGroup>
      <InputGroupAddon>
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <Input aria-label="Domain" placeholder="smoothui.dev" />
      <InputGroupAddon align="end">
        <InputGroupText>/docs</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  </div>
);

export const demoScenes = {
  Features: FeaturesDemo,
};

export default function InputGroupDemo() {
  return <FeaturesDemo />;
}
