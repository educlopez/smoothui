"use client";

import NotificationBadge from "@repo/smoothui/components/notification-badge";
import { Bell, Mail, MessageSquare, User } from "lucide-react";
import { useState } from "react";

export default function NotificationBadgeDemo() {
  const [count, setCount] = useState(5);

  return (
    <div className="flex w-full flex-col gap-8">
      {/* Dot Variant */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground text-sm">Dot Variant</h3>
        <div className="flex items-center gap-6">
          <NotificationBadge variant="dot">
            <button
              className="rounded-lg bg-muted p-2 hover:bg-muted/80"
              type="button"
            >
              <Bell className="h-5 w-5" />
            </button>
          </NotificationBadge>
          <NotificationBadge ping variant="dot">
            <button
              className="rounded-lg bg-muted p-2 hover:bg-muted/80"
              type="button"
            >
              <Mail className="h-5 w-5" />
            </button>
          </NotificationBadge>
        </div>
      </div>

      {/* Count Variant */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground text-sm">Count Variant</h3>
        <div className="flex flex-wrap items-center gap-6">
          <NotificationBadge count={3} variant="count">
            <button
              className="rounded-lg bg-muted p-2 hover:bg-muted/80"
              type="button"
            >
              <MessageSquare className="h-5 w-5" />
            </button>
          </NotificationBadge>
          <NotificationBadge count={42} variant="count">
            <button
              className="rounded-lg bg-muted p-2 hover:bg-muted/80"
              type="button"
            >
              <Bell className="h-5 w-5" />
            </button>
          </NotificationBadge>
          <NotificationBadge count={150} max={99} variant="count">
            <button
              className="rounded-lg bg-muted p-2 hover:bg-muted/80"
              type="button"
            >
              <Mail className="h-5 w-5" />
            </button>
          </NotificationBadge>
        </div>
      </div>

      {/* Interactive Count */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground text-sm">
          Interactive Count (Click to change)
        </h3>
        <div className="flex items-center gap-4">
          <NotificationBadge count={count} variant="count">
            <button
              className="rounded-lg bg-muted p-2 hover:bg-muted/80"
              type="button"
            >
              <Bell className="h-6 w-6" />
            </button>
          </NotificationBadge>
          <div className="flex gap-2">
            <button
              className="rounded-md bg-primary px-3 py-1 text-primary-foreground text-sm hover:bg-primary/90"
              onClick={() => setCount((c) => Math.max(0, c - 1))}
              type="button"
            >
              -
            </button>
            <button
              className="rounded-md bg-primary px-3 py-1 text-primary-foreground text-sm hover:bg-primary/90"
              onClick={() => setCount((c) => c + 1)}
              type="button"
            >
              +
            </button>
            <button
              className="rounded-md bg-muted px-3 py-1 text-sm hover:bg-muted/80"
              onClick={() => setCount(0)}
              type="button"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Status Variant */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground text-sm">Status Variant</h3>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <NotificationBadge
              position="bottom-right"
              status="online"
              variant="status"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <User className="h-5 w-5" />
              </div>
            </NotificationBadge>
            <span className="text-muted-foreground text-xs">Online</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <NotificationBadge
              position="bottom-right"
              status="away"
              variant="status"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <User className="h-5 w-5" />
              </div>
            </NotificationBadge>
            <span className="text-muted-foreground text-xs">Away</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <NotificationBadge
              position="bottom-right"
              status="busy"
              variant="status"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <User className="h-5 w-5" />
              </div>
            </NotificationBadge>
            <span className="text-muted-foreground text-xs">Busy</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <NotificationBadge
              position="bottom-right"
              status="offline"
              variant="status"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <User className="h-5 w-5" />
              </div>
            </NotificationBadge>
            <span className="text-muted-foreground text-xs">Offline</span>
          </div>
        </div>
      </div>

      {/* Positions */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground text-sm">
          Position Options
        </h3>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <NotificationBadge count={1} position="top-right" variant="count">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Bell className="h-5 w-5" />
              </div>
            </NotificationBadge>
            <span className="text-muted-foreground text-xs">Top Right</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <NotificationBadge count={2} position="top-left" variant="count">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Bell className="h-5 w-5" />
              </div>
            </NotificationBadge>
            <span className="text-muted-foreground text-xs">Top Left</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <NotificationBadge
              count={3}
              position="bottom-right"
              variant="count"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Bell className="h-5 w-5" />
              </div>
            </NotificationBadge>
            <span className="text-muted-foreground text-xs">Bottom Right</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <NotificationBadge count={4} position="bottom-left" variant="count">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Bell className="h-5 w-5" />
              </div>
            </NotificationBadge>
            <span className="text-muted-foreground text-xs">Bottom Left</span>
          </div>
        </div>
      </div>

      {/* Ping Animation */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground text-sm">
          Ping Animation (Attention-grabbing)
        </h3>
        <div className="flex items-center gap-6">
          <NotificationBadge ping variant="dot">
            <button
              className="rounded-lg bg-muted p-2 hover:bg-muted/80"
              type="button"
            >
              <Bell className="h-5 w-5" />
            </button>
          </NotificationBadge>
          <NotificationBadge count={7} ping variant="count">
            <button
              className="rounded-lg bg-muted p-2 hover:bg-muted/80"
              type="button"
            >
              <Mail className="h-5 w-5" />
            </button>
          </NotificationBadge>
        </div>
      </div>
    </div>
  );
}
