"use client";

import { PreviewCode } from "@docs/components/preview/code";
import { cn } from "@repo/shadcn-ui/lib/utils";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Folder,
  FolderOpen,
  Terminal,
} from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";

export type ExplorerFile = {
  code: string;
  /** Path the file lands at after installing, e.g. `components/smoothui/header-1/index.tsx`. */
  path: string;
};

type ExplorerProps = {
  /** Extra classes for the outer grid — usually a height. */
  className?: string;
  files: ExplorerFile[];
  /** Copied by the terminal button. Omitted for pages with no install command. */
  installCommand?: string;
};

type TreeNode = {
  children: TreeNode[];
  /** Index into `files`, for leaves only. */
  fileIndex?: number;
  name: string;
};

const COPIED_FEEDBACK_MS = 1600;

export const languageOf = (path: string) => {
  if (path.endsWith(".css")) {
    return "css";
  }
  if (path.endsWith(".ts")) {
    return "ts";
  }
  return "tsx";
};

/**
 * What to call a file in a tab.
 *
 * Every package ships its component as `index.tsx`, so the basename alone gives
 * you two tabs called `index.tsx` and no way to tell them apart. An index is
 * named by the folder it belongs to; anything else is unambiguous already.
 */
export const tabLabel = (path: string) => {
  const segments = path.split("/");
  const name = segments.at(-1) ?? path;

  return name.startsWith("index.") ? segments.slice(-2).join("/") : name;
};

/**
 * The badge an editor puts in front of a filename.
 *
 * React's atom for `.tsx`/`.jsx`, the TypeScript and CSS marks for the rest —
 * so the tree reads at a glance the way a sidebar in VS Code does, instead of
 * repeating one generic document icon down the whole list.
 */
export const FileTypeIcon = ({ path }: { path: string }) => {
  const language = languageOf(path);

  if (language === "css") {
    return (
      <TypeBadge
        className="bg-sky-500/15 text-sky-600 dark:text-sky-400"
        label="css"
      />
    );
  }

  if (language === "ts") {
    return (
      <TypeBadge
        className="bg-blue-500/15 text-blue-600 dark:text-blue-400"
        label="ts"
      />
    );
  }

  return (
    <svg
      aria-hidden="true"
      className="size-3.5 shrink-0 text-[#61dafb]"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="2.1" />
      <g fill="none" stroke="currentColor" strokeWidth="1.1">
        <ellipse cx="12" cy="12" rx="10" ry="4.2" />
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="4.2"
          transform="rotate(60 12 12)"
        />
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="4.2"
          transform="rotate(120 12 12)"
        />
      </g>
    </svg>
  );
};

const TypeBadge = ({
  className,
  label,
}: {
  className: string;
  label: string;
}) => (
  <span
    aria-hidden="true"
    className={cn(
      "flex size-3.5 shrink-0 items-center justify-center rounded-[3px] font-semibold text-[7px] uppercase leading-none",
      className
    )}
  >
    {label}
  </span>
);
const INDENT_PX = 12;
const BASE_INDENT_PX = 8;

const buildTree = (files: ExplorerFile[]): TreeNode[] => {
  const root: TreeNode = { children: [], name: "" };

  files.forEach((file, fileIndex) => {
    const segments = file.path.split("/");
    let node = root;

    segments.forEach((segment, depth) => {
      const isLeaf = depth === segments.length - 1;
      let next = node.children.find(
        (child) =>
          child.name === segment && (child.fileIndex === undefined) !== isLeaf
      );

      if (!next) {
        next = { children: [], name: segment };
        if (isLeaf) {
          next.fileIndex = fileIndex;
        }
        node.children.push(next);
      }

      node = next;
    });
  });

  return root.children.map(collapseSingleChildFolders);
};

/**
 * `components` → `smoothui` → `header-1` is three rows to say one thing.
 *
 * A folder whose only entry is another folder carries no choice, so it is merged
 * into it and shown as `components/smoothui` — the same shorthand VS Code and
 * GitHub use. The path stays honest (it is where the registry writes the file);
 * only the indentation it cost disappears.
 */
const collapseSingleChildFolders = (node: TreeNode): TreeNode => {
  if (node.fileIndex !== undefined) {
    return node;
  }

  let merged = node;

  while (
    merged.children.length === 1 &&
    merged.children[0].fileIndex === undefined
  ) {
    const [only] = merged.children;
    merged = { children: only.children, name: `${merged.name}/${only.name}` };
  }

  return {
    ...merged,
    children: merged.children.map(collapseSingleChildFolders),
  };
};

/**
 * A file tree beside the source, rather than a row of tabs.
 *
 * Tabs work for two files. A block pulls in its own source, its shared parts and
 * whatever shadcn primitives it uses, and at that point a flat strip of names
 * stops telling you what you are looking at — where the file lives is half the
 * answer. The paths are the ones you get after installing, so the tree doubles
 * as a map of what lands in your project.
 */
export const CodeExplorer = ({
  className,
  files,
  installCommand,
}: ExplorerProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState<"code" | "cli" | null>(null);

  const tree = useMemo(() => buildTree(files), [files]);
  const active = files[activeIndex] ?? files[0];
  const segments = active?.path.split("/") ?? [];
  const fileName = segments.at(-1) ?? "";
  const directory = segments.slice(0, -1).join("/");

  const copy = async (value: string, kind: "code" | "cli") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      setTimeout(() => setCopied(null), COPIED_FEEDBACK_MS);
    } catch {
      // Clipboard access can be denied or hang on an unfocused document. Leaving
      // the icon unchanged is the honest answer: nothing was copied.
    }
  };

  return (
    <div
      className={cn(
        "grid grid-cols-1 bg-background sm:grid-cols-[16rem_1fr]",
        className
      )}
    >
      <div className="hidden overflow-y-auto border-r bg-muted/20 py-3 sm:block">
        <div className="px-4 pb-2 font-mono text-[11px] text-muted-foreground/70 uppercase tracking-wider">
          Files
        </div>
        {tree.map((node) => (
          <TreeBranch
            activeIndex={activeIndex}
            depth={0}
            key={node.name}
            node={node}
            onSelect={setActiveIndex}
          />
        ))}
      </div>

      <div className="flex min-w-0 flex-col">
        <div className="flex items-center justify-between gap-2 border-b px-3 py-2">
          <div className="flex min-w-0 items-center gap-1.5 font-mono text-muted-foreground text-xs">
            <FileTypeIcon path={active?.path ?? ""} />
            {directory && (
              <span className="truncate text-muted-foreground/60">
                {directory}/
              </span>
            )}
            <span className="truncate text-foreground">{fileName}</span>
          </div>
          <div className="flex shrink-0 items-center gap-0.5">
            <ToolbarIcon
              label="Copy code"
              onClick={() => active && copy(active.code, "code")}
            >
              {copied === "code" ? (
                <Check
                  aria-hidden="true"
                  className="text-fd-primary"
                  size={14}
                />
              ) : (
                <Copy aria-hidden="true" size={14} />
              )}
            </ToolbarIcon>
            {installCommand ? (
              <ToolbarIcon
                label="Copy install command"
                onClick={() => copy(installCommand, "cli")}
              >
                {copied === "cli" ? (
                  <Check
                    aria-hidden="true"
                    className="text-fd-primary"
                    size={14}
                  />
                ) : (
                  <Terminal aria-hidden="true" size={14} />
                )}
              </ToolbarIcon>
            ) : null}
          </div>
        </div>

        {/* Line numbers come from a CSS counter over Shiki's own `.line` spans:
            the highlighter already emits one per line, so nothing has to be
            re-parsed to number them. */}
        {/* The code surface has to reach the bottom of the pane, not stop at the
            last line: Fumadocs sizes its `figure`/`pre` to the content, which
            left a slab of page background under short files. `min-h-full` on the
            `pre` fills the box without capping a long file. */}
        <div
          className={cn(
            "code-explorer-lines min-h-0 w-full min-w-0 flex-1 overflow-auto bg-background",
            "[&_.fd-scroll-container]:h-full [&_.fd-scroll-container]:max-h-none!",
            "[&_figure]:my-0 [&_figure]:h-full [&_pre]:min-h-full",
            // Fumadocs paints its code block on `--fd-card`, a shade off the
            // page. Inside our own framed panel that reads as a second surface
            // for no reason.
            "[&_figure]:bg-background! [&_pre]:bg-background!",
            "[&>div]:h-full"
          )}
        >
          {active ? (
            <PreviewCode
              code={active.code}
              filename={fileName}
              language={languageOf(active.path)}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

const TreeBranch = ({
  activeIndex,
  depth,
  node,
  onSelect,
}: {
  activeIndex: number;
  depth: number;
  node: TreeNode;
  onSelect: (index: number) => void;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const padding = BASE_INDENT_PX + depth * INDENT_PX;

  if (node.fileIndex !== undefined) {
    const isActive = node.fileIndex === activeIndex;
    return (
      <button
        aria-current={isActive ? "true" : undefined}
        className={cn(
          "flex w-full cursor-pointer items-center gap-1.5 py-1 pr-2 text-left font-mono text-xs transition-colors",
          isActive
            ? "bg-foreground/5 text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
        onClick={() => onSelect(node.fileIndex as number)}
        style={{ paddingLeft: padding + 16 }}
        type="button"
      >
        <FileTypeIcon path={node.name} />
        <span className="truncate">{node.name}</span>
      </button>
    );
  }

  return (
    <div>
      <button
        aria-expanded={isOpen}
        className="flex w-full cursor-pointer items-center gap-1.5 py-1 pr-2 text-left font-mono text-muted-foreground/80 text-xs transition-colors hover:text-foreground"
        onClick={() => setIsOpen((open) => !open)}
        style={{ paddingLeft: padding }}
        type="button"
      >
        {isOpen ? (
          <ChevronDown aria-hidden="true" className="shrink-0" size={12} />
        ) : (
          <ChevronRight aria-hidden="true" className="shrink-0" size={12} />
        )}
        {isOpen ? (
          <FolderOpen aria-hidden="true" className="shrink-0" size={13} />
        ) : (
          <Folder aria-hidden="true" className="shrink-0" size={13} />
        )}
        <span className="truncate">{node.name}</span>
      </button>
      {isOpen &&
        node.children.map((child) => (
          <TreeBranch
            activeIndex={activeIndex}
            depth={depth + 1}
            key={child.name}
            node={child}
            onSelect={onSelect}
          />
        ))}
    </div>
  );
};

const ToolbarIcon = ({
  children,
  label,
  onClick,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
}) => (
  <button
    className="flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    onClick={onClick}
    title={label}
    type="button"
  >
    <span className="sr-only">{label}</span>
    {children}
  </button>
);
