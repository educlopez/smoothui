"use client";

import { Button } from "@repo/shadcn-ui/components/ui/button";
import NotificationBadge from "@repo/smoothui/components/notification-badge";
import { Bell } from "lucide-react";
import { useState } from "react";

export default function NotificationBadgeDemo() {
  const [count, setCount] = useState(5);

  return (
    <div className="flex flex-col items-center gap-6">
      <NotificationBadge count={count} variant="count">
        <button className="rounded-xl bg-muted p-4" type="button">
          <Bell className="h-8 w-8" />
        </button>
      </NotificationBadge>

      <div className="flex gap-2">
        <Button
          onClick={() => setCount((c) => Math.max(0, c - 1))}
          size="icon"
          variant="outline"
        >
          −
        </Button>
        <Button
          onClick={() => setCount((c) => c + 1)}
          size="icon"
          variant="outline"
        >
          +
        </Button>
      </div>
    </div>
  );
}
