"use client";

import { CHANGELOG } from "@docs/lib/changelog-data";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "fumadocs-ui/components/ui/popover";
import Link from "next/link";
import { useEffect, useState } from "react";

// Tracks the newest changelog entry the user has seen, so the bell trigger
// can show an unread dot without a hydration mismatch (state starts empty
// and is only populated client-side in an effect).
const SEEN_STORAGE_KEY = "smoothui-changelog-seen";

const getNewestChangelogDate = () => CHANGELOG[0]?.date;

function useChangelogUnread() {
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    const newestDate = getNewestChangelogDate();
    if (!newestDate || typeof window === "undefined") {
      return;
    }
    try {
      const seen = window.localStorage.getItem(SEEN_STORAGE_KEY);
      const newestTime = Date.parse(newestDate);
      const seenTime = seen ? Date.parse(seen) : 0;
      if (Number.isNaN(newestTime)) {
        return;
      }
      setHasUnread(!seenTime || newestTime > seenTime);
    } catch {
      // localStorage unavailable (privacy mode, etc.) — skip the indicator.
    }
  }, []);

  const markAsSeen = () => {
    const newestDate = getNewestChangelogDate();
    if (!(newestDate && typeof window !== "undefined")) {
      return;
    }
    try {
      window.localStorage.setItem(SEEN_STORAGE_KEY, newestDate);
    } catch {
      // Ignore write failures — worst case the dot reappears next visit.
    }
    setHasUnread(false);
  };

  return { hasUnread, markAsSeen };
}

function BellIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="18"
      viewBox="0 0 20 20"
      width="18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.875 13.5367C16.875 13.9997 16.4997 14.375 16.0368 14.375H3.96327C3.50031 14.375 3.125 13.9997 3.125 13.5367C3.125 13.4031 3.15696 13.2713 3.21822 13.1526L4.1665 11.3134C4.32966 10.997 4.42335 10.6494 4.44131 10.2938L4.58626 7.42413C4.7305 4.54901 7.11155 2.29166 10 2.29166C12.8884 2.29166 15.2695 4.54901 15.4137 7.42413L15.5587 10.2938C15.5767 10.6494 15.6703 10.997 15.8335 11.3134L16.7817 13.1526C16.843 13.2713 16.875 13.4031 16.875 13.5367Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M13.3332 14.375C13.3332 16.2159 11.8408 17.7083 9.99984 17.7083C8.15889 17.7083 6.6665 16.2159 6.6665 14.375"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="-mt-0.5 ml-1 inline h-3 w-3 -translate-x-1 opacity-0 transition duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus:translate-x-0 group-focus:opacity-100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChangelogPopover() {
  const { hasUnread, markAsSeen } = useChangelogUnread();

  return (
    <Popover
      onOpenChange={(open) => {
        if (open) {
          markAsSeen();
        }
      }}
    >
      <PopoverTrigger asChild>
        <button
          aria-label="Changelog"
          className={buttonVariants({
            color: "ghost",
            size: "icon-sm",
            className: "relative text-fd-muted-foreground",
          })}
          type="button"
        >
          <BellIcon />
          {hasUnread && (
            <span
              aria-hidden="true"
              className="absolute top-0.5 right-0.5 size-1.5 rounded-full bg-brand"
            />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[340px] overflow-hidden rounded-2xl p-0"
        sideOffset={8}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <span className="font-semibold text-sm">What's new</span>
          <Link
            className="text-muted-foreground text-xs transition-colors hover:text-foreground"
            href="/docs/guides/changelog"
          >
            View all →
          </Link>
        </div>
        <ul className="max-h-[420px] divide-y overflow-y-auto">
          {CHANGELOG.map((entry) => (
            <li
              className="group relative px-4 py-3.5 transition-colors hover:bg-fd-accent"
              key={entry.id}
            >
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-brand/10 px-1.5 py-0.5 font-mono text-[10px] text-brand">
                  v{entry.version}
                </span>
                <span className="text-muted-foreground/60 text-xs">
                  {entry.date}
                </span>
              </div>
              <h3 className="mt-1.5 font-semibold text-sm leading-snug">
                <Link
                  className="outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  href={entry.href}
                >
                  <span className="absolute inset-0 z-10" />
                  {entry.title}
                  <ArrowIcon />
                </Link>
              </h3>
              <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
                {entry.description}
              </p>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
