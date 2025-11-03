"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { useParams } from "next/navigation";
import { type ReactNode, useId } from "react";

export function Body({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  const mode = useMode();

  return (
    <body className={cn(mode, "relative flex min-h-screen flex-col")}>
      {children}
    </body>
  );
}

export function useMode(): string | undefined {
  const { slug } = useParams();
  return Array.isArray(slug) && slug.length > 0 ? slug[0] : undefined;
}

export function FumadocsIcon(props: React.SVGProps<SVGSVGElement>) {
  const id = useId();
  return (
    <svg height="80" viewBox="0 0 180 180" width="80" {...props}>
      <title>Fumadocs Icon</title>
      <circle
        cx="90"
        cy="90"
        fill={`url(#${id}-iconGradient)`}
        r="89"
        stroke="var(--color-fd-primary)"
        strokeWidth="1"
      />
      <defs>
        <linearGradient
          gradientTransform="rotate(45)"
          id={`${id}-iconGradient`}
        >
          <stop offset="45%" stopColor="var(--color-fd-background)" />
          <stop offset="100%" stopColor="var(--color-fd-primary)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
