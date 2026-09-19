"use client";

import BorderBeam from "@repo/smoothui/components/border-beam";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import { Pause, Play } from "lucide-react";
import { useState } from "react";

const Chip = ({ children }: { children: string }) => (
  <code className="w-fit rounded-sm bg-foreground/5 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
    {children}
  </code>
);

const cardBody =
  "flex min-h-[176px] flex-col justify-center gap-2 overflow-hidden p-5";
const cardTitle = "font-medium text-[14px] text-foreground tracking-tight";
const cardNote = "text-[12px] text-muted-foreground leading-snug";

export default function BorderBeamDemo() {
  const [isActive, setIsActive] = useState(true);

  return (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <BorderBeam className="bg-background" duration={5} radius={6} size={84}>
        <div className={cardBody}>
          <Chip>{"radius={6}"}</Chip>
          <h3 className={cardTitle}>Tight corners</h3>
          <p className={cardNote}>
            The hardest case: a 90° swing inside six pixels, leaving square with
            the next edge.
          </p>
        </div>
      </BorderBeam>

      <BorderBeam
        borderWidth={1.5}
        className="bg-background"
        duration={4.5}
        radius={999}
      >
        <div className={`${cardBody} px-8`}>
          <Chip>{"radius={999}"}</Chip>
          <h3 className={cardTitle}>Pill</h3>
          <p className={cardNote}>
            The tangent turns continuously, so there is no seam where the arc
            meets the straight run.
          </p>
        </div>
      </BorderBeam>

      <BorderBeam duration={6} radius="squircle" size={92}>
        <div className={`${cardBody} px-7`}>
          <Chip>{'radius="squircle"'}</Chip>
          <h3 className={cardTitle}>Continuous corners</h3>
          <p className={cardNote}>
            A squircle has no constant-radius arc at all, and the beam still
            tracks it.
          </p>
        </div>
      </BorderBeam>

      <BorderBeam
        beams={2}
        borderWidth={2}
        className="bg-background"
        duration={7}
        radius={20}
        size={76}
      >
        <div className={cardBody}>
          <Chip>{"beams={2}"}</Chip>
          <h3 className={cardTitle}>Two beams</h3>
          <p className={cardNote}>
            Phase offsets along one path, so they stay half a lap apart at any
            duration.
          </p>
        </div>
      </BorderBeam>

      <BorderBeam
        borderWidth={1.5}
        className="bg-background"
        colorFrom="var(--color-amber)"
        colorTo="var(--color-green)"
        duration={5.5}
        radius={20}
        size={96}
      >
        <div className={cardBody}>
          <Chip>{"colorFrom / colorTo"}</Chip>
          <h3 className={cardTitle}>Any two colours</h3>
          <p className={cardNote}>
            The tail fades in from one and the head burns out in the other.
          </p>
        </div>
      </BorderBeam>

      <BorderBeam
        active={isActive}
        className="bg-background"
        duration={4}
        pauseOnHover
        radius={20}
        reverse
      >
        <div className={`${cardBody} items-start`}>
          <Chip>{"reverse · pauseOnHover"}</Chip>
          <h3 className={cardTitle}>Counter-clockwise</h3>
          <p className={cardNote}>
            Hover to freeze it mid-corner and check the angle.
          </p>
          <SmoothButton
            aria-pressed={isActive}
            color="accent"
            onClick={() => setIsActive((value) => !value)}
            prefix={isActive ? <Pause /> : <Play />}
            shape="pill"
            size="xs"
            variant="outline"
          >
            {isActive ? "Stop" : "Start"}
          </SmoothButton>
        </div>
      </BorderBeam>
    </div>
  );
}
