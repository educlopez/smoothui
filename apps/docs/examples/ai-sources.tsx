"use client";

import AISources, { type AISource } from "@repo/smoothui/components/ai-sources";
import Image from "next/image";

/**
 * Real brand marks from logo.dev, the same service `powered-by` and `reference`
 * already use. A source row without its real logo is a placeholder that shipped.
 */
const BrandMark = ({ domain }: { domain: string }) => (
  <Image
    alt=""
    className="size-full object-cover"
    draggable={false}
    height={36}
    src={`https://img.logo.dev/${domain}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&size=36&retina=true`}
    width={36}
  />
);

const SOURCES: AISource[] = [
  {
    favicon: <BrandMark domain="canva.com" />,
    id: "1",
    snippet: "Tokens shipped as a single package, versioned with the product.",
    title: "How Canva scaled its design system to 100+ engineers",
    url: "https://canva.com/engineering",
  },
  {
    favicon: <BrandMark domain="strava.com" />,
    id: "2",
    snippet: "One motion spec across iOS, Android and web.",
    title: "Rebuilding the Strava design language",
    url: "https://strava.com/engineering",
  },
  {
    favicon: <BrandMark domain="duolingo.com" />,
    id: "3",
    snippet: "Every animation budgeted against a 60fps frame.",
    title: "Duolingo on animation performance",
    url: "https://blog.duolingo.com",
  },
  {
    favicon: <BrandMark domain="ramp.com" />,
    id: "4",
    title: "Ramp on component API design",
    url: "https://ramp.com/blog",
  },
  {
    favicon: <BrandMark domain="linear.app" />,
    id: "5",
    title: "How Linear thinks about interface latency",
    url: "https://linear.app/blog",
  },
];

const Example = () => (
  <div className="mx-auto flex w-full max-w-lg flex-col gap-8 p-8">
    {/* Hover the stack to see it fan apart, then open it — each logo travels
        into its own row rather than one set disappearing and another appearing. */}
    <AISources sources={SOURCES} />
    <AISources
      defaultOpen
      label="Retrieved chunks"
      sources={SOURCES.slice(0, 2)}
    />
  </div>
);

export default Example;
