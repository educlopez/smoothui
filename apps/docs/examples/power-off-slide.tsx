"use client";

import PowerOffSlide from "@repo/smoothui/components/power-off-slide";
import { useState } from "react";

const PowerOffSlideDemo = () => {
  const [_poweredOff, setPoweredOff] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
      <PowerOffSlide
        duration={1500}
        label="Slide to power off"
        onPowerOff={() => setPoweredOff(true)}
      />
    </div>
  );
};

export default PowerOffSlideDemo;
