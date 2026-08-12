"use client";

import { AddToKitButton } from "@docs/components/add-to-kit-button";
import { ShadcnIcon, SmoothUIIcon } from "@docs/components/installer";
import { OpenInV0Button } from "@docs/components/open-in-v0-button";
import {
  CodeExplorer,
  type ExplorerFile,
} from "@docs/components/preview/code-explorer";
import { type InstallCli, useInstallCli } from "@docs/hooks/use-install-cli";
import { usePackageManager } from "@docs/hooks/use-package-manager";
import { prettify } from "@docs/lib/kit-context";
import { Button } from "@repo/shadcn-ui/components/ui/button";
import { Separator } from "@repo/shadcn-ui/components/ui/separator";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@repo/shadcn-ui/components/ui/toggle-group";
import { cn } from "@repo/shadcn-ui/lib/utils";
import {
  Check,
  Copy,
  Monitor,
  Smartphone,
  SquareArrowOutUpRight,
  Tablet,
} from "lucide-react";
import Link from "next/link";
import { type ReactNode, useState } from "react";

import { PreviewContent, type PreviewSize } from "./content";

type PreviewShellProps = {
  blockPath?: string;
  /** Absolute registry URL for this block, e.g. `https://smoothui.dev/r/header-1.json`. */
  registryUrl?: string;
  children: ReactNode;
  className?: string;
  parsedCode: string;
  sourceComponents: SourceComponentSummary[];
  type: "component" | "block";
};

type SourceComponentSummary = {
  name: string;
  source: string;
  /** Where the registry writes the file — the path shown in the tree. */
  target: string;
};

type View = "preview" | "code";

const SHADCN_IMPORT = /@repo\/shadcn-ui\//g;
const REPO_IMPORT = /@repo\//g;

const COPIED_FEEDBACK_MS = 1600;
const CLIS: InstallCli[] = ["smoothui", "shadcn"];

const PREVIEW_SIZES: { icon: ReactNode; label: string; value: PreviewSize }[] =
  [
    {
      icon: <Monitor aria-hidden="true" size={15} />,
      label: "Desktop preview",
      value: "desktop",
    },
    {
      icon: <Tablet aria-hidden="true" size={15} />,
      label: "Tablet preview",
      value: "tablet",
    },
    {
      icon: <Smartphone aria-hidden="true" size={15} />,
      label: "Mobile preview",
      value: "mobile",
    },
  ];

// The demo is not installed anywhere — it is the usage example, so it sits at
// the root of the tree. Everything else carries the path the registry writes it
// to, resolved on the server.
const toExplorerFiles = (
  parsedCode: string,
  sourceComponents: SourceComponentSummary[]
): ExplorerFile[] => [
  { code: parsedCode, path: "demo.tsx" },
  ...sourceComponents.map((component) => ({
    code: component.source
      .replace(SHADCN_IMPORT, "@/")
      .replace(REPO_IMPORT, "@/components/smoothui/"),
    path: component.target,
  })),
];

const shadcnCommand = (manager: string, name: string) => {
  if (manager === "pnpm") {
    return `pnpm dlx shadcn add @smoothui/${name}`;
  }
  if (manager === "yarn") {
    return `yarn dlx shadcn add @smoothui/${name}`;
  }
  if (manager === "bun") {
    return `bunx shadcn add @smoothui/${name}`;
  }
  return `npx shadcn@latest add @smoothui/${name}`;
};

const installCommand = (cli: InstallCli, manager: string, name: string) =>
  cli === "smoothui"
    ? `npx smoothui-cli add ${name}`
    : shadcnCommand(manager, name);

// What the pill reads. The whole command does not fit in a toolbar, so it shows
// the part that identifies the block under the CLI you picked — and the title
// attribute carries the command in full.
const installLabel = (cli: InstallCli, name: string) =>
  cli === "smoothui" ? `smoothui add ${name}` : `@smoothui/${name}`;

/**
 * One block, one frame, its own controls.
 *
 * A blocks page is a catalogue — `hero.mdx` documents five heroes — so
 * everything you might want to do with a block lives on the block: switching to
 * its source swaps it in place, and the install command is right there rather
 * than in a section underneath. The alternative, one shared switch at the top of
 * the page, has to answer "the code of which block?" and cannot.
 */
export const PreviewShell = ({
  blockPath,
  children,
  registryUrl,
  className,
  parsedCode,
  sourceComponents,
  type,
}: PreviewShellProps) => {
  const [view, setView] = useState<View>("preview");
  const [previewSize, setPreviewSize] = useState<PreviewSize>("desktop");
  const [isCopied, setIsCopied] = useState(false);
  const [packageManager] = usePackageManager();
  const [cli, setCli] = useInstallCli();

  const popOutHref =
    type === "block" && blockPath ? `/blocks/preview/${blockPath}` : null;

  const files = toExplorerFiles(parsedCode, sourceComponents);

  const copyInstall = async () => {
    if (!blockPath) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        installCommand(cli, packageManager, blockPath)
      );
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), COPIED_FEEDBACK_MS);
    } catch {
      // Clipboard access can be denied (insecure origin, unfocused document).
      // Nothing useful to say about it — leaving the icon unchanged is the
      // honest answer, since nothing was copied.
    }
  };

  return (
    <div
      className={cn(
        "not-prose size-full overflow-hidden rounded-xl border bg-background",
        // Nothing separates one block from the next any more — no heading, no
        // description — so the gap between the frames has to do that work.
        type === "block" && "my-8 h-auto",
        // Not a fixed height: the demo decides. `min-h` only stops a one-line
        // component from collapsing into a strip, and anything taller — or a
        // demo with its own internal scroller — grows the frame instead of
        // being cut off by it.
        type === "component" && "h-auto min-h-[24rem]",
        className
      )}
    >
      <div className="flex flex-col gap-2 border-b bg-muted/30 px-2 py-2 sm:flex-row sm:items-center sm:justify-between">
        {/* Two words, no icons: the pair is the control, and an eye next to
            "Preview" only says the same thing again. */}
        <div className="inline-flex items-center gap-0.5 self-start rounded-lg bg-muted/60 p-0.5">
          <ViewTab
            isActive={view === "preview"}
            label="Preview"
            onClick={() => setView("preview")}
          />
          <ViewTab
            isActive={view === "code"}
            label="Code"
            onClick={() => setView("code")}
          />
        </div>

        <div className="flex items-center justify-end gap-1 sm:gap-1.5">
          {/* Only meaningful over a live preview, and only where the frame is
              wide enough for a narrower one to be visible. */}
          {type === "block" && view === "preview" && (
            <ToggleGroup
              className="hidden gap-0.5 sm:flex"
              onValueChange={(value) => {
                if (value) {
                  setPreviewSize(value as PreviewSize);
                }
              }}
              type="single"
              value={previewSize}
            >
              {PREVIEW_SIZES.map(({ icon, label, value }) => (
                <ToggleGroupItem
                  className="size-8 p-0 data-[state=on]:bg-fd-primary/10 data-[state=on]:text-fd-primary"
                  key={value}
                  title={label}
                  value={value}
                >
                  <span className="sr-only">{label}</span>
                  {icon}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          )}

          {blockPath ? (
            <>
              <Separator
                className="mx-0.5 hidden h-5 sm:block"
                orientation="vertical"
              />
              {/* The same two choices as a component page's install tabs, and
                  the same stored preference — so picking shadcn here changes it
                  everywhere rather than only for this block. The package manager
                  still comes from the toolbar at the bottom of the page. */}
              <div className="hidden items-center gap-1 rounded-lg border bg-background py-0.5 pr-0.5 pl-1 md:inline-flex">
                <div className="flex items-center">
                  <CliTab
                    icon={<SmoothUIIcon />}
                    isActive={cli === "smoothui"}
                    label="SmoothUI CLI"
                    onClick={() => setCli("smoothui")}
                  />
                  <CliTab
                    icon={<ShadcnIcon />}
                    isActive={cli === "shadcn"}
                    label="shadcn CLI"
                    onClick={() => setCli("shadcn")}
                  />
                </div>
                <button
                  className="flex cursor-pointer items-center gap-2 rounded-md py-1 pr-1 pl-1.5 font-mono text-muted-foreground text-xs transition-colors hover:text-foreground"
                  onClick={copyInstall}
                  title={`Copy ${installCommand(cli, packageManager, blockPath)}`}
                  type="button"
                >
                  {/* Both labels occupy the same grid cell, so the pill is as
                      wide as the longer of the two and switching CLI does not
                      shift the toolbar under the pointer. */}
                  <span className="grid grid-cols-1 grid-rows-1">
                    {CLIS.map((option) => (
                      <span
                        aria-hidden={option !== cli}
                        className={cn(
                          "col-start-1 row-start-1 whitespace-nowrap",
                          option !== cli && "invisible"
                        )}
                        key={option}
                      >
                        {installLabel(option, blockPath)}
                      </span>
                    ))}
                  </span>
                  {isCopied ? (
                    <Check
                      aria-hidden="true"
                      className="text-fd-primary"
                      size={14}
                    />
                  ) : (
                    <Copy aria-hidden="true" size={14} />
                  )}
                  <span className="sr-only">Copy the install command</span>
                </button>
              </div>
              <AddToKitButton
                iconOnly
                size="xs"
                slug={blockPath}
                title={prettify(blockPath)}
              />
              {/* Per block, not per page: a blocks page documents several
                  packages, so a single "Open in v0" at the top could only ever
                  point at one of them — and pointed at the page slug, which is
                  not a registry item at all. */}
              {registryUrl ? (
                <OpenInV0Button className="h-7 px-2" url={registryUrl} />
              ) : null}
            </>
          ) : null}

          {popOutHref ? (
            <Button
              asChild
              className="size-8 p-0"
              size="icon-sm"
              variant="ghost"
            >
              <Link href={popOutHref} rel="noopener noreferrer" target="_blank">
                <span className="sr-only">Open preview in a new tab</span>
                <SquareArrowOutUpRight aria-hidden="true" size={15} />
              </Link>
            </Button>
          ) : null}
        </div>
      </div>

      {view === "preview" ? (
        <div
          className={cn(
            "bg-background",
            // `calc(100% - header)` only worked while the frame had a fixed
            // height; against an auto-height frame it resolved to nothing.
            type === "component" ? "min-h-[calc(24rem-3.25rem)]" : "h-auto"
          )}
        >
          <PreviewContent blockPath={blockPath} size={previewSize} type={type}>
            {children}
          </PreviewContent>
        </div>
      ) : (
        <CodeExplorer
          className="h-[36rem]"
          files={files}
          installCommand={
            blockPath
              ? installCommand(cli, packageManager, blockPath)
              : undefined
          }
        />
      )}
    </div>
  );
};

const CliTab = ({
  icon,
  isActive,
  label,
  onClick,
}: {
  icon: ReactNode;
  isActive: boolean;
  label: string;
  onClick: () => void;
}) => (
  <button
    aria-pressed={isActive}
    className={cn(
      "flex size-6 cursor-pointer items-center justify-center rounded-md transition-colors",
      isActive
        ? "bg-muted text-foreground"
        : "text-muted-foreground/60 hover:text-foreground"
    )}
    onClick={onClick}
    title={label}
    type="button"
  >
    <span className="sr-only">{label}</span>
    {icon}
  </button>
);

const ViewTab = ({
  isActive,
  label,
  onClick,
}: {
  isActive: boolean;
  label: string;
  onClick: () => void;
}) => (
  <button
    aria-pressed={isActive}
    className={cn(
      "cursor-pointer rounded-md px-3 py-1 font-medium text-sm transition-colors",
      isActive
        ? "bg-background text-foreground shadow-black/5 shadow-sm"
        : "text-muted-foreground hover:text-foreground"
    )}
    onClick={onClick}
    type="button"
  >
    {label}
  </button>
);
