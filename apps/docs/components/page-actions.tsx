"use client";

import { cn } from "@docs/lib/cn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/shadcn-ui/components/ui/dropdown-menu";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";
import {
  IconCheckFill24,
  IconChevronDownFill24,
  IconCopy2Fill24,
  IconExternalLinkFill24,
  IconFileFill24,
} from "nucleo-core-fill-24";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

const cache = new Map<string, string>();

const askPrompt = (url: string) =>
  `I'm looking at this SmoothUI documentation: ${url}.\nHelp me understand how to use it. Be ready to explain concepts, give examples, or help debug based on it.`;

type PageActionItem = {
  description: string;
  external?: boolean;
  href: string;
  icon: ReactNode;
  title: string;
};

function MarkdownIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M14.85 3H1.15C.52 3 0 3.52 0 4.15v7.69C0 12.48.52 13 1.15 13h13.69c.64 0 1.15-.52 1.15-1.15V4.15C16 3.52 15.48 3 14.85 3zM9 11H7.5L5.75 8.25V11H4V5h1.5l1.75 2.75V5H9zm3.5.5L10.5 8H12V5h1.5v3H15z" />
    </svg>
  );
}

function OpenAIIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  );
}

function AnthropicIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z" />
    </svg>
  );
}

function CursorIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M11.928 0 0 21.067l5.006 1.345L11.93 5.6l1.695 16.812L24 24 11.928 0Z" />
    </svg>
  );
}

function VSCodeIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M23.154 2.3a1.5 1.5 0 0 0-.547-.447L18.18.088a1.54 1.54 0 0 0-1.77.326l-7.86 7.24-4.27-3.24a1.03 1.03 0 0 0-1.32.074L.71 6.88a1.03 1.03 0 0 0-.01 1.48l4.55 4.39-4.55 4.39a1.03 1.03 0 0 0 .01 1.48l2.25 2.39a1.03 1.03 0 0 0 1.32.074l4.27-3.24 7.86 7.24a1.54 1.54 0 0 0 1.77.326l4.426-1.765a1.5 1.5 0 0 0 .547-.447 1.5 1.5 0 0 0 .346-.96V3.26a1.5 1.5 0 0 0-.346-.96zM18.52 18.73l-8.47-7.71 8.47-7.71v15.42z" />
    </svg>
  );
}

export function PageActions({
  githubUrl,
  markdownUrl,
}: {
  githubUrl: string;
  markdownUrl: string;
}) {
  const [isLoading, setLoading] = useState(false);
  const [checked, onClick] = useCopyButton(async () => {
    const cached = cache.get(markdownUrl);
    if (cached) {
      return navigator.clipboard.writeText(cached);
    }

    setLoading(true);

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/plain": fetch(markdownUrl).then(async (res) => {
            const content = await res.text();
            cache.set(markdownUrl, content);
            return content;
          }),
        }),
      ]);
    } finally {
      setLoading(false);
    }
  });

  const items = useMemo((): PageActionItem[] => {
    const fullMarkdownUrl =
      typeof window === "undefined"
        ? markdownUrl
        : new URL(markdownUrl, window.location.origin).toString();
    const q = askPrompt(fullMarkdownUrl);

    return [
      {
        description: "View page as Markdown format",
        href: fullMarkdownUrl,
        icon: <MarkdownIcon className="size-4" />,
        title: "View as Markdown",
      },
      {
        description: "Install MCP Server on Cursor",
        href: "/docs/guides/mcp",
        icon: <CursorIcon className="size-4" />,
        title: "Add to Cursor",
      },
      {
        description: "Install MCP Server on VS Code",
        href: "/docs/guides/mcp",
        icon: <VSCodeIcon className="size-4" />,
        title: "Add to VS Code",
      },
      {
        description: "View source on GitHub",
        external: true,
        href: githubUrl,
        icon: <IconFileFill24 className="size-4" />,
        title: "Open in GitHub",
      },
      {
        description: "Ask questions about this page",
        external: true,
        href: `https://chatgpt.com/?${new URLSearchParams({ q })}`,
        icon: <OpenAIIcon className="size-4" />,
        title: "Open in ChatGPT",
      },
      {
        description: "Ask questions about this page",
        external: true,
        href: `https://claude.ai/new?${new URLSearchParams({ q })}`,
        icon: <AnthropicIcon className="size-4" />,
        title: "Open in Claude",
      },
    ];
  }, [githubUrl, markdownUrl]);

  return (
    <div className="inline-flex h-8 items-stretch overflow-hidden rounded-full border border-border bg-card text-foreground text-sm shadow-sm">
      <button
        className={cn(
          "inline-flex items-center gap-1.5 px-3 transition-colors hover:bg-muted/60",
          "disabled:pointer-events-none disabled:opacity-50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
        )}
        disabled={isLoading}
        onClick={onClick}
        type="button"
      >
        {checked ? (
          <IconCheckFill24 className="size-3.5" />
        ) : (
          <IconCopy2Fill24 className="size-3.5" />
        )}
        <span className="font-medium">Copy Markdown</span>
      </button>

      <div aria-hidden className="w-px self-stretch bg-border" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label="More page actions"
            className={cn(
              "inline-flex items-center px-2 transition-colors hover:bg-muted/60",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
              "data-[state=open]:bg-muted/60"
            )}
            type="button"
          >
            <IconChevronDownFill24 className="size-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-72 rounded-xl p-1.5 shadow-lg"
          sideOffset={8}
        >
          {items.map((item) => (
            <DropdownMenuItem
              asChild
              className="cursor-pointer items-start rounded-lg px-2.5 py-2"
              key={`${item.title}-${item.href}`}
            >
              <a
                href={item.href}
                {...(item.external
                  ? { rel: "noreferrer noopener", target: "_blank" }
                  : {})}
              >
                <span className="mt-0.5 text-muted-foreground">
                  {item.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-foreground text-sm leading-tight">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block text-muted-foreground text-xs leading-snug">
                    {item.description}
                  </span>
                </span>
                {item.external ? (
                  <IconExternalLinkFill24 className="mt-0.5 size-3.5 text-muted-foreground" />
                ) : null}
              </a>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
