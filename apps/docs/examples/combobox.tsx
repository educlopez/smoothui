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

export default function ComboboxDemo() {
  const [framework, setFramework] = useState("");
  const [language, setLanguage] = useState("");

  return (
    <div className="flex w-full max-w-sm flex-col gap-8 p-8">
      <div className="flex flex-col gap-2">
        <h3 className="font-medium text-lg">Basic Combobox</h3>
        <Combobox
          aria-label="Framework selection"
          onValueChange={setFramework}
          options={frameworks}
          placeholder="Select a framework…"
          searchPlaceholder="Search frameworks…"
          value={framework}
        />
        {framework && (
          <p className="text-muted-foreground text-sm">Selected: {framework}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-medium text-lg">Async Search</h3>
        <Combobox
          aria-label="Language selection"
          emptyText="No languages found."
          onSearch={simulateSearch}
          onValueChange={setLanguage}
          placeholder="Search languages…"
          searchDebounce={200}
          searchPlaceholder="Type to search…"
          value={language}
        />
        {language && (
          <p className="text-muted-foreground text-sm">Selected: {language}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-medium text-lg">Disabled</h3>
        <Combobox
          aria-label="Disabled combobox"
          disabled
          options={frameworks}
          placeholder="Not available"
        />
      </div>
    </div>
  );
}
