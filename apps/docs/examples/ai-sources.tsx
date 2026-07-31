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
    id: "1",
    favicon: <BrandMark domain="canva.com" />,
    title: "How Canva scaled its design system to 100+ engineers",
    url: "https://canva.com/engineering",
    snippet: "Tokens shipped as a single package, versioned with the product.",
  },
  {
    id: "2",
    favicon: <BrandMark domain="strava.com" />,
    title: "Rebuilding the Strava design language",
    url: "https://strava.com/engineering",
    snippet: "One motion spec across iOS, Android and web.",
  },
  {
    id: "3",
    favicon: <BrandMark domain="duolingo.com" />,
    title: "Duolingo on animation performance",
    url: "https://blog.duolingo.com",
    snippet: "Every animation budgeted against a 60fps frame.",
  },
  {
    id: "4",
    favicon: <BrandMark domain="ramp.com" />,
    title: "Ramp on component API design",
    url: "https://ramp.com/blog",
  },
  {
    id: "5",
    favicon: <BrandMark domain="linear.app" />,
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
