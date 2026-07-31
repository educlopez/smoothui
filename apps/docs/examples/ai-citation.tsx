"use client";

import AICitation from "@repo/smoothui/components/ai-citation";
import Image from "next/image";

/**
 * Real brand marks from logo.dev, the same service `powered-by` and `reference`
 * already use.
 */
const BrandMark = ({ domain }: { domain: string }) => (
  <Image
    alt=""
    className="size-full object-cover"
    draggable={false}
    height={28}
    src={`https://img.logo.dev/${domain}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&size=28&retina=true`}
    width={28}
  />
);

const Example = () => (
  <div className="mx-auto flex w-full max-w-lg flex-col gap-6 p-8 pt-24">
    <p className="text-foreground text-sm leading-loose">
      Teams that budget every animation against a frame report far fewer
      regressions
      <AICitation
        description="Every animation is measured against a 60fps frame budget before it ships."
        favicon={<BrandMark domain="duolingo.com" />}
        label={1}
        title="Duolingo on animation performance"
        url="https://blog.duolingo.com"
      />
      , and shipping one motion spec across platforms keeps them consistent
      <AICitation
        description="A single motion specification drives iOS, Android and web from one source."
        favicon={<BrandMark domain="strava.com" />}
        label={2}
        title="Rebuilding the Strava design language"
        url="https://strava.com/engineering"
      />
      . In practice the frame budget is the first thing to agree on.
    </p>

    <p className="text-muted-foreground text-xs">
      Hover or tab to a marker — the card grows out of the pill it belongs to.
      Escape closes it.
    </p>
  </div>
);

export default Example;
