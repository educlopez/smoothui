"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Hand } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type PreviewSourceProps = {
  source: { name: string; source: string }[];
};

const parseCode = (code: string) =>
  code
    .replace(/@repo\/shadcn-ui\//g, "@/")
    .replace(/@repo\//g, "@/components/smoothui/");

export const PreviewSource = ({ source }: PreviewSourceProps) => (
  <Accordion collapsible defaultValue={source.at(0)?.name} type="single">
    {source.map(({ name, source: sourceCode }) => (
      <AccordionItem key={name} value={name}>
        <AccordionTrigger className="rounded-none bg-secondary px-4">
          <div className="flex items-center gap-2 text-sm">
            <Hand className="size-4 text-muted-foreground" />
            <span>{name}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent
          className="overflow-visible"
          style={{ overflow: "visible" }}
        >
          <div className="relative [&_figure]:rounded-none [&_figure]:border-none">
            <DynamicCodeBlock
              code={parseCode(sourceCode)}
              lang="tsx"
              options={{
                themes: {
                  light: "catppuccin-latte",
                  dark: "catppuccin-mocha",
                },
              }}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);
