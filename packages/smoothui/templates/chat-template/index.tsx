"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { type ChatConversation, CONVERSATIONS } from "./chat-data";
import ChatSidebar from "./chat-sidebar";
import ChatThread from "./chat-thread";

const NEW_CHAT_ID = "__new__";

/** No overshoot: a drawer that bounces past its edge reads as a bug. */
const DRAWER_SPRING = { type: "spring" as const, duration: 0.3, bounce: 0 };
const SCRIM_FADE = { duration: 0.2 };

export type ChatTemplateProps = {
  className?: string;
  /** Which conversation opens first. Defaults to the newest one. */
  defaultConversationId?: string;
  /** Swap in your own transcripts. The shape is `ChatConversation`. */
  conversations?: ChatConversation[];
};

/**
 * A full chat surface — sidebar, thread, composer — wired to a fixed script.
 *
 * There is no model behind it and no network call anywhere: every reply is
 * scripted in `chat-data.ts`. Point the composer at your own endpoint and the
 * rest of the template is already the product.
 */
const ChatTemplate = ({
  className,
  conversations = CONVERSATIONS,
  defaultConversationId,
}: ChatTemplateProps) => {
  const [activeId, setActiveId] = useState(
    defaultConversationId ?? conversations[0]?.id ?? NEW_CHAT_ID
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // Narrow screens have no column for the list, so it arrives as a drawer.
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const open = (id: string) => {
    setActiveId(id);
    setIsDrawerOpen(false);
  };

  const active = conversations.find(
    (conversation) => conversation.id === activeId
  );

  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 w-full overflow-hidden bg-background text-foreground",
        className
      )}
    >
      {/* Collapses to an icon rail rather than disappearing, so navigation stays
          one click away. */}
      <ChatSidebar
        activeId={activeId}
        className="hidden md:flex"
        collapsed={!isSidebarOpen}
        conversations={conversations}
        onNewChat={() => open(NEW_CHAT_ID)}
        onSelect={open}
        onToggleCollapsed={() => setIsSidebarOpen((isOpen) => !isOpen)}
      />

      {/* Below `md` the same list slides over the thread. Without it there is no
          way to change conversation on a phone, which is most of what a chat
          app's navigation is for.

          Both children are keyed: `AnimatePresence` tracks its direct children by
          key, and without one it never runs the enter or the exit — the panel
          just sat parked off-screen. */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.button
              animate={{ opacity: 1 }}
              aria-label="Close conversations"
              className="absolute inset-0 z-20 cursor-default bg-foreground/20 md:hidden"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key="chat-drawer-scrim"
              onClick={() => setIsDrawerOpen(false)}
              transition={shouldReduceMotion ? { duration: 0 } : SCRIM_FADE}
              type="button"
            />
            {/* Reduced motion keeps the fade and drops the travel, rather than
                removing the transition altogether. */}
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="absolute inset-y-0 left-0 z-30 flex md:hidden"
              exit={
                shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: "-100%" }
              }
              initial={
                shouldReduceMotion ? { opacity: 0 } : { opacity: 1, x: "-100%" }
              }
              key="chat-drawer-panel"
              transition={shouldReduceMotion ? SCRIM_FADE : DRAWER_SPRING}
            >
              <ChatSidebar
                activeId={activeId}
                className="h-full bg-background shadow-black/10 shadow-xl"
                collapsed={false}
                conversations={conversations}
                onNewChat={() => open(NEW_CHAT_ID)}
                onSelect={open}
                onToggleCollapsed={() => setIsDrawerOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ChatThread
        key={activeId}
        onOpenSidebar={() => setIsDrawerOpen(true)}
        title={active?.title ?? "New chat"}
        turns={active?.turns ?? []}
      />
    </div>
  );
};

export default ChatTemplate;
export type { ChatConversation, ChatTurn } from "./chat-data";
