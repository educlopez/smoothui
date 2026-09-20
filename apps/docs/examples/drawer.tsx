"use client";

import Drawer from "@repo/smoothui/components/drawer";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import { useState } from "react";

type Side = "top" | "right" | "bottom" | "left";

const DrawerSideScene = ({ side }: { side: Side }) => {
  const [open, setOpen] = useState(false);
  const label = side.charAt(0).toUpperCase() + side.slice(1);

  return (
    <div className="flex items-center justify-center p-8">
      <SmoothButton onClick={() => setOpen(true)} variant="outline">
        Open {label}
      </SmoothButton>

      <Drawer
        description={`This drawer slides in from the ${side}.`}
        onOpenChange={setOpen}
        open={open}
        side={side}
        title={`${label} Drawer`}
      >
        <p className="py-4 text-muted-foreground">
          Drawer content goes here. Click outside or press Escape to close.
        </p>
      </Drawer>
    </div>
  );
};

const TopDemo = () => <DrawerSideScene side="top" />;
const RightDemo = () => <DrawerSideScene side="right" />;
const BottomDemo = () => <DrawerSideScene side="bottom" />;
const LeftDemo = () => <DrawerSideScene side="left" />;

export const demoScenes = {
  Bottom: BottomDemo,
  Features: RightDemo,
  Left: LeftDemo,
  Right: RightDemo,
  Top: TopDemo,
};

export default function DrawerDemo() {
  return <RightDemo />;
}
