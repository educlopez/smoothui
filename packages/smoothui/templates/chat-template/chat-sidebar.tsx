"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import SiriOrb from "@repo/smoothui/components/siri-orb";
import {
  LogOut,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Settings,
  Sun,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChatConversation } from "./chat-data";

/** A real photograph, so the footer is a person and not a lettered circle. */
const USER_AVATAR =
  "https://ik.imagekit.io/16u211libb/avatar-educalvolpz.jpeg?tr=w-64,h-64";

export type ChatSidebarProps = {
  activeId: string;
  className?: string;
  /** Icon rail instead of the full pane. Keeps navigation reachable. */
  collapsed?: boolean;
  conversations: ChatConversation[];
  onNewChat: () => void;
  onSelect: (id: string) => void;
  onToggleCollapsed?: () => void;
};

export const ChatSidebar = ({
  activeId,
  className,
  collapsed = false,
  conversations,
  onNewChat,
  onSelect,
  onToggleCollapsed,
}: ChatSidebarProps) => {
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  // The search filters for real. A search box that does nothing is the kind of
  // fake content this template exists to avoid.
  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matching = needle
      ? conversations.filter((conversation) =>
          conversation.title.toLowerCase().includes(needle)
        )
      : conversations;

    const byGroup = new Map<string, ChatConversation[]>();
    for (const conversation of matching) {
      const bucket = byGroup.get(conversation.group) ?? [];
      bucket.push(conversation);
      byGroup.set(conversation.group, bucket);
    }
    return [...byGroup.entries()];
  }, [conversations, query]);

  if (collapsed) {
    return (
      <aside
        className={cn(
          "flex h-full w-[4.5rem] shrink-0 flex-col items-center gap-2 border-border/60 border-r bg-muted/60 py-3",
          className
        )}
      >
        <SiriOrb size="22px" state="idle" />
        <RailButton
          icon={<PanelLeftOpen aria-hidden="true" size={16} />}
          label="Expand sidebar"
          onClick={onToggleCollapsed}
        />
        <RailButton
          icon={<Plus aria-hidden="true" size={16} />}
          label="New chat"
          onClick={onNewChat}
        />
        <RailButton
          icon={<Search aria-hidden="true" size={16} />}
          label="Search chats"
          onClick={() => {
            onToggleCollapsed?.();
            // Expanding and focusing in one action, so the icon is a shortcut
            // rather than a two-step detour.
            requestAnimationFrame(() => searchRef.current?.focus());
          }}
        />
        <div className="mt-auto">
          <AccountMenu align="rail" />
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "flex h-full w-[17rem] shrink-0 flex-col gap-3 border-border/60 border-r bg-muted/60 p-3",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 px-1">
        <span className="flex items-center gap-2 font-medium text-sm">
          <SiriOrb size="22px" state="idle" />
          Scoop Assistant
        </span>
        <button
          aria-label="Collapse sidebar"
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          onClick={onToggleCollapsed}
          type="button"
        >
          <PanelLeftClose aria-hidden="true" size={16} />
        </button>
      </div>

      <button
        className="flex items-center gap-2 rounded-xl border border-border/60 bg-background px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
        onClick={onNewChat}
        type="button"
      >
        <Plus aria-hidden="true" size={15} />
        New chat
      </button>

      {/* Icon and field share one flex row rather than absolute-positioning the
          icon over padding: the gap is then a single value instead of two that
          have to be kept in sync, and `type="search"` cannot push the text away
          with its own intrinsic padding. */}
      <label className="flex items-center gap-2 rounded-xl border border-transparent bg-muted px-2.5 py-2 transition-colors focus-within:border-border focus-within:bg-background">
        <span className="sr-only">Search chats</span>
        <Search
          aria-hidden="true"
          className="shrink-0 text-muted-foreground"
          size={14}
        />
        <input
          className="w-full appearance-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search chats"
          ref={searchRef}
          type="search"
          value={query}
        />
      </label>

      <nav className="-mx-1 flex-1 overflow-y-auto px-1">
        {groups.length === 0 && (
          <p className="px-2 py-6 text-center text-muted-foreground text-xs">
            No chats match “{query}”.
          </p>
        )}

        {groups.map(([group, items]) => (
          <div className="mb-3" key={group}>
            <p className="px-2 pt-1 pb-1.5 font-medium text-[0.7rem] text-muted-foreground/80 uppercase tracking-wide">
              {group}
            </p>
            <ul className="flex flex-col gap-0.5">
              {items.map((conversation) => (
                <li key={conversation.id}>
                  <button
                    aria-current={
                      conversation.id === activeId ? "page" : undefined
                    }
                    className={cn(
                      "w-full truncate rounded-lg px-2 py-2 text-left text-sm transition-colors",
                      conversation.id === activeId
                        ? "bg-background text-foreground shadow-black/5 shadow-xs"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    onClick={() => onSelect(conversation.id)}
                    type="button"
                  >
                    {conversation.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-border/60 border-t pt-3">
        <AccountMenu align="pane" />
      </div>
    </aside>
  );
};

const RailButton = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) => (
  <button
    aria-label={label}
    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    onClick={onClick}
    title={label}
    type="button"
  >
    {icon}
  </button>
);

/**
 * The account menu, with the theme switch inside it.
 *
 * It flips the `dark` class on the document root rather than shipping a theme
 * provider: that is the one contract every Tailwind setup already has, so the
 * control works the moment the template is installed instead of after wiring.
 */
const AccountMenu = ({ align }: { align: "pane" | "rail" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const toggleTheme = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    setIsDark(next);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={cn(
          "flex w-full items-center gap-2 rounded-xl text-left transition-colors hover:bg-muted",
          align === "pane" ? "p-1.5" : "justify-center p-1"
        )}
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <img
          alt="Edu Calvo"
          className="size-7 shrink-0 rounded-full object-cover"
          height={28}
          src={USER_AVATAR}
          width={28}
        />
        {align === "pane" && (
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm">Edu Calvo</span>
            <span className="block text-muted-foreground text-xs">
              Pro plan
            </span>
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute bottom-full left-0 z-10 mb-2 w-52 origin-bottom-left overflow-hidden rounded-xl border border-border/60 bg-background p-1 shadow-black/10 shadow-lg"
          role="menu"
        >
          <MenuItem
            icon={
              isDark ? (
                <Sun aria-hidden="true" size={14} />
              ) : (
                <Moon aria-hidden="true" size={14} />
              )
            }
            label={isDark ? "Light mode" : "Dark mode"}
            onClick={toggleTheme}
          />
          <MenuItem
            icon={<Settings aria-hidden="true" size={14} />}
            label="Settings"
          />
          <MenuItem
            icon={<LogOut aria-hidden="true" size={14} />}
            label="Sign out"
          />
        </div>
      )}
    </div>
  );
};

const MenuItem = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) => (
  <button
    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
    onClick={onClick}
    role="menuitem"
    type="button"
  >
    {icon}
    {label}
  </button>
);

export default ChatSidebar;
