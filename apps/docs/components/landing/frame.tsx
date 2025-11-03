import { cn } from "@repo/shadcn-ui/lib/utils";
import React from "react";

export default function Frame({
  component,
  className,
}: {
  component: React.ComponentType<Record<string, unknown>>;
  className?: string;
  clean?: boolean;
  group: string;
}) {
  return (
    <div
      className={cn("w-full py-12 last:pb-0 odd:pt-0 md:w-[600px]", className)}
    >
      <div className="mx-auto w-full">
        <article className="grid gap-3">
          <div
            className="frame-box flex h-[340px] w-full items-center justify-center overflow-hidden rounded-lg transition md:flex-1"
            id={`component-${
              (
                component as unknown as {
                  id?: string;
                  displayName?: string;
                  name?: string;
                }
              ).id ??
              component.displayName ??
              component.name ??
              "ui"
            }`}
          >
            <div className="relative z-10 flex h-full w-full items-center justify-center">
              {React.createElement(component)}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
