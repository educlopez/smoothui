"use client";

import OTPField from "@repo/smoothui/components/otp-field";
import { useState } from "react";

const FeaturesDemo = () => {
  const [value, setValue] = useState("");

  return (
    <div className="flex items-center justify-center p-8">
      <OTPField
        label="Verification code"
        length={6}
        onValueChange={setValue}
        value={value}
      />
    </div>
  );
};

const MaskedDemo = () => (
  <div className="flex items-center justify-center p-8">
    <OTPField defaultValue="4821" label="Access code" length={4} mask />
  </div>
);

export const demoScenes = {
  Features: FeaturesDemo,
  Masked: MaskedDemo,
};

export default function OTPFieldDemo() {
  return <FeaturesDemo />;
}
