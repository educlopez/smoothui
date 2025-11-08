"use client";

import { Button } from "@repo/shadcn-ui/components/ui/button";
import { Separator } from "@repo/shadcn-ui/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/shadcn-ui/components/ui/tabs";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@repo/shadcn-ui/components/ui/toggle-group";
import { cn } from "@repo/shadcn-ui/lib/utils";
import {
  BoxIcon,
  CodeIcon,
  EyeIcon,
  Fullscreen,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useState } from "react";

import { PreviewCode } from "./code";
import { PreviewContent, type PreviewSize } from "./content";
import { PreviewSource } from "./source";

type PreviewShellProps = {
  type: "component" | "block";
  blockPath?: string;
  parsedCode: string;
  sourceComponents: { name: string; source: string }[];
  className?: string;
  children: ReactNode;
};

const previewSizes: { label: string; value: PreviewSize; icon: ReactNode }[] = [
  {
    label: "Desktop preview",
    value: "desktop",
    icon: <Monitor className="h-4 w-4" />,
  },
  {
    label: "Tablet preview",
    value: "tablet",
    icon: <Tablet className="h-4 w-4" />,
  },
  {
    label: "Mobile preview",
    value: "mobile",
    icon: <Smartphone className="h-4 w-4" />,
  },
];

export const PreviewShell = ({
  type,
  blockPath,
  parsedCode,
  sourceComponents,
  className,
  children,
}: PreviewShellProps) => {
  const [previewSize, setPreviewSize] = useState<PreviewSize>("desktop");
  const iframeSrc =
    type === "block" && blockPath ? `/blocks/preview/${blockPath}` : null;

  return (
    <div
      className={cn(
        "not-prose size-full overflow-hidden rounded-lg border bg-background",
        type === "block" &&
          "h-auto min-h-[32rem] prose-code:border-none prose-code:p-0",
        type === "component" && "h-[32rem]",
        className
      )}
    >
      <Tabs className="flex h-full flex-col gap-0" defaultValue="preview">
        <div className="flex flex-col gap-2 border-b bg-muted/30 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="flex h-9 items-center gap-1 rounded-md bg-transparent p-0 shadow-none">
            <TabsTrigger value="preview">
              <EyeIcon className="text-muted-foreground" size={16} />
              Preview
            </TabsTrigger>
            <TabsTrigger value="code">
              <CodeIcon className="text-muted-foreground" size={16} />
              Code
            </TabsTrigger>
            {sourceComponents.length > 0 && (
              <TabsTrigger value="source">
                <BoxIcon className="text-muted-foreground" size={16} />
                Source
              </TabsTrigger>
            )}
          </TabsList>
          {type === "block" && (
            <div className="flex items-center justify-end gap-1 sm:gap-1.5">
              <ToggleGroup
                className="hidden gap-0.5 rounded-md border bg-background p-1 sm:flex"
                onValueChange={(value) => {
                  if (!value) {
                    return;
                  }
                  setPreviewSize(value as PreviewSize);
                }}
                type="single"
                value={previewSize}
              >
                {previewSizes.map(({ label, value, icon }) => (
                  <ToggleGroupItem
                    className="h-8 w-8 p-0 data-[state=on]:bg-fd-primary/10 data-[state=on]:text-fd-primary"
                    key={value}
                    title={label}
                    value={value}
                  >
                    <span className="sr-only">{label}</span>
                    {icon}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <Separator
                className="hidden h-6 sm:flex"
                orientation="vertical"
              />
              {iframeSrc && (
                <Button
                  asChild
                  className="h-8 w-8 rounded-md p-0"
                  size="icon-sm"
                  variant="ghost"
                >
                  <Link
                    href={iframeSrc}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="sr-only">Open preview in new tab</span>
                    <Fullscreen className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
        <TabsContent
          className={cn(
            "flex-1 overflow-y-auto bg-background",
            type === "component"
              ? "size-full overflow-hidden"
              : "h-auto overflow-auto"
          )}
          value="preview"
        >
          <PreviewContent blockPath={blockPath} size={previewSize} type={type}>
            {children}
          </PreviewContent>
        </TabsContent>
        <TabsContent
          className="flex-1 overflow-y-auto bg-background"
          value="code"
        >
          <PreviewCode code={parsedCode} filename="index.tsx" language="tsx" />
        </TabsContent>
        {sourceComponents.length > 0 && (
          <TabsContent
            className="flex-1 overflow-y-auto bg-background"
            value="source"
          >
            <PreviewSource source={sourceComponents} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
