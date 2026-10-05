"use client";

import type { ComboboxOption } from "@repo/smoothui/components/combobox";
import Combobox from "@repo/smoothui/components/combobox";
import { useState } from "react";

const frameworks: ComboboxOption[] = [
  { label: "Next.js", value: "nextjs" },
  { label: "Remix", value: "remix" },
  { label: "Astro", value: "astro" },
  { label: "Nuxt", value: "nuxt" },
  { label: "SvelteKit", value: "sveltekit" },
  { label: "Gatsby", value: "gatsby" },
  { label: "SolidStart", value: "solidstart" },
  { label: "Angular", value: "angular" },
];

const allLanguages: ComboboxOption[] = [
  { label: "TypeScript", value: "typescript" },
  { label: "JavaScript", value: "javascript" },
  { label: "Python", value: "python" },
  { label: "Rust", value: "rust" },
  { label: "Go", value: "go" },
  { label: "Swift", value: "swift" },
  { label: "Kotlin", value: "kotlin" },
  { label: "Ruby", value: "ruby" },
  { label: "Java", value: "java" },
  { label: "C#", value: "csharp" },
];

const simulateSearch = (query: string): Promise<ComboboxOption[]> =>
  new Promise((resolve) => {
    setTimeout(() => {
      const filtered = allLanguages.filter((lang) =>
        lang.label.toLowerCase().includes(query.toLowerCase())
      );
      resolve(filtered);
    }, 600);
  });

const BasicDemo = () => {
  const [framework, setFramework] = useState("");

  return (
    <div className="flex w-full max-w-sm items-center justify-center p-8">
      <Combobox
        aria-label="Framework"
        onValueChange={setFramework}
        options={frameworks}
        placeholder="Select a framework…"
        searchPlaceholder="Search…"
        value={framework}
      />
    </div>
  );
};

const AsyncDemo = () => {
  const [language, setLanguage] = useState("");

  return (
    <div className="flex w-full max-w-sm items-center justify-center p-8">
      <Combobox
        aria-label="Language"
        emptyText="No languages found."
        onSearch={simulateSearch}
        onValueChange={setLanguage}
        placeholder="Search languages…"
        searchDebounce={200}
        searchPlaceholder="Type to search…"
        value={language}
      />
    </div>
  );
};

const DisabledDemo = () => (
  <div className="flex w-full max-w-sm items-center justify-center p-8">
    <Combobox
      aria-label="Unavailable"
      disabled
      options={frameworks}
      placeholder="Not available"
    />
  </div>
);

export const demoScenes = {
  Async: AsyncDemo,
  Disabled: DisabledDemo,
  Features: BasicDemo,
};

export default function ComboboxDemo() {
  return <BasicDemo />;
}
