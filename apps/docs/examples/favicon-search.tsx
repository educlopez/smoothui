"use client";

import type { FaviconSearchResult } from "@repo/smoothui/components/favicon-search";
import FaviconSearch from "@repo/smoothui/components/favicon-search";
import { useEffect, useState } from "react";

const SEARCH_DELAY_MS = 300;

const ALL_RESULTS: FaviconSearchResult[] = [
  {
    description: "The React framework for the web",
    id: "nextjs",
    title: "Next.js",
    url: "https://nextjs.org",
  },
  {
    description: "A utility-first CSS framework",
    id: "tailwind",
    title: "Tailwind CSS",
    url: "https://tailwindcss.com",
  },
  {
    description: "A production-ready motion library for React",
    id: "motion",
    title: "Motion",
    url: "https://motion.dev",
  },
  {
    description: "Beautifully designed components built with Radix UI",
    id: "shadcn",
    title: "shadcn/ui",
    url: "https://ui.shadcn.com",
  },
  {
    description: "Beautiful & consistent icon toolkit",
    id: "lucide",
    title: "Lucide Icons",
    url: "https://lucide.dev",
  },
];

export default function FaviconSearchDemo() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<FaviconSearchResult[]>(ALL_RESULTS);

  useEffect(() => {
    if (!value) {
      setResults(ALL_RESULTS);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timeout = window.setTimeout(() => {
      const query = value.toLowerCase();
      setResults(
        ALL_RESULTS.filter(
          (result) =>
            result.title.toLowerCase().includes(query) ||
            result.description?.toLowerCase().includes(query)
        )
      );
      setLoading(false);
    }, SEARCH_DELAY_MS);

    return () => window.clearTimeout(timeout);
  }, [value]);

  return (
    <div className="mx-auto w-full max-w-md px-4 py-8">
      <FaviconSearch
        loading={loading}
        onValueChange={setValue}
        results={results}
        showShortcut
        value={value}
      />
    </div>
  );
}
