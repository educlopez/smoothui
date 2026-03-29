"use client";

import Drawer from "@repo/smoothui/components/drawer";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import { useState } from "react";

type Side = "top" | "right" | "bottom" | "left";

const DrawerDemo = () => {
  const [openSide, setOpenSide] = useState<Side | null>(null);

  const sides: Side[] = ["top", "right", "bottom", "left"];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {sides.map((side) => (
        <div key={side}>
          <SmoothButton
            onClick={() => setOpenSide(side)}
            variant="outline"
          >
            Open {side}
          </SmoothButton>
          <Drawer
            description={`This drawer slides in from the ${side}.`}
            open={openSide === side}
            onOpenChange={(open) => {
              if (!open) {
                setOpenSide(null);
              }
            }}
            side={side}
            title={`${side.charAt(0).toUpperCase() + side.slice(1)} Drawer`}
          >
            <p className="text-muted-foreground py-4">
              Drawer content goes here. Click outside or press Escape to close.
            </p>
          </Drawer>
        </div>
      ))}
    </div>
  );
};

export default DrawerDemo;
