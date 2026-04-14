"use client";

import type { ComboboxOption } from "@repo/smoothui/components/combobox";
import Combobox from "@repo/smoothui/components/combobox";
import { useState } from "react";

const frameworks: ComboboxOption[] = [
  { value: "nextjs", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "nuxt", label: "Nuxt" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "gatsby", label: "Gatsby" },
  { value: "solidstart", label: "SolidStart" },
  { value: "angular", label: "Angular" },
];

const allLanguages: ComboboxOption[] = [
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "rust", label: "Rust" },
  { value: "go", label: "Go" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "ruby", label: "Ruby" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
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
