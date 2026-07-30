"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { useState } from "react";
import { type ChatConversation, CONVERSATIONS } from "./chat-data";
import ChatSidebar from "./chat-sidebar";
import ChatThread from "./chat-thread";

const NEW_CHAT_ID = "__new__";

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

  const active = conversations.find(
    (conversation) => conversation.id === activeId
  );

  return (
    <div
      className={cn(
        "flex h-full min-h-0 w-full overflow-hidden bg-background text-foreground",
        className
      )}
    >
      {/* Collapses to an icon rail rather than disappearing, so navigation stays
          one click away. Hidden entirely below `md`, where a drawer belongs to
          the app that installs this, not to a template living inside a frame. */}
      <ChatSidebar
        activeId={activeId}
        className="hidden md:flex"
        collapsed={!isSidebarOpen}
        conversations={conversations}
        onNewChat={() => setActiveId(NEW_CHAT_ID)}
        onSelect={setActiveId}
        onToggleCollapsed={() => setIsSidebarOpen((open) => !open)}
      />

      {/* Keyed on the conversation so switching remounts the thread: whatever was
          streaming is abandoned, exactly as a cancelled request would be, and the
          pane needs no reset effect of its own. */}
      <ChatThread
        key={activeId}
        title={active?.title ?? "New chat"}
        turns={active?.turns ?? []}
      />
    </div>
  );
};

export default ChatTemplate;
export type { ChatConversation, ChatTurn } from "./chat-data";
