"use client";

import { usePackageManager } from "@docs/hooks/use-package-manager";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";

const PnpmIcon = ({ colored }: { colored?: boolean }) => (
  <svg
    className="size-3.5"
    viewBox="0 0 256 256"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 0v85h85V0H0Zm93.5 0v85h85V0h-85Zm93.5 0v85h85V0h-85ZM93.5 93.5v85h85v-85h-85Zm93.5 0v85h85v-85h-85ZM0 187v85h85v-85H0Zm93.5 0v85h85v-85h-85Zm93.5 0v85h85v-85h-85Z"
      fill={colored ? "#f9ad00" : "currentColor"}
    />
  </svg>
);

const NpmIcon = ({ colored }: { colored?: boolean }) => (
  <svg
    className="size-3.5"
    viewBox="0 0 256 256"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0h256v256H0z" fill={colored ? "#c00" : "currentColor"} />
    <path
      className={colored ? "" : "hidden"}
      d="M48 48h160v160h-32V80h-48v128H48z"
      fill={colored ? "#fff" : "currentColor"}
    />
    <path
      className={colored ? "hidden" : ""}
      d="M48 48h160v160h-32V80h-48v128H48z"
      fill="currentColor"
    />
  </svg>
);

const YarnIcon = ({ colored }: { colored?: boolean }) => (
  <svg
    className="size-3.5"
    viewBox="0 0 256 256"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="128"
      cy="128"
      fill={colored ? "#2c8ebb" : "currentColor"}
      r="128"
    />
    <path
      className={colored ? "" : "invert"}
      d="M203 160c-7.5.2-14.3 3.5-21.8 8.3-12.5 8-25 12.4-25 12.4s-1.4 2.1-5.4 3-33 3.1-35.4 3.2c-6.4 0-10.3-1.6-11.4-4.3-3.3-7.9 4.8-11.4 4.8-11.4s-1.8-1.1-2.8-2.1c-1-.9-2-2.8-2.3-2.1-1.2 3-1.9 10.4-5.2 13.7-4.6 4.6-13.2 3.1-18.3.4-5.6-3 .4-10 .4-10s-3 1.8-5.4-1.9c-2.2-3.4-4.2-9.1-3.7-16.2.6-8.1 9.6-15.9 9.6-15.9s-1.6-11.9 3.6-24.2c4.7-11.1 17.4-20.1 17.4-20.1s-10.7-11.8-6.7-22.4c2.6-6.9 3.6-6.9 4.5-7.2 3-1.1 5.8-2.4 8-4.7 10.6-11.5 24.2-9.3 24.2-9.3s6.4-19.6 12.4-15.8c1.8 1.2 8.4 15.9 8.4 15.9s7-4.1 7.8-2.6c4.3 8.3 4.8 24.1 2.9 33.7-3.2 15.9-11.1 24.4-14.3 29.7-.7 1.2 8.5 5.2 14.4 21.4 5.4 14.8.6 27.3 1.4 28.6.2.2.2.3.2.3s6.2.5 18.6-7.2c6.6-4.1 14.5-8.7 23.5-8.8 8.6-.2 9.1 10 2.6 11.6-7.9 1.9-12 3.6-21.8 10-11.2 7.5-22.5 10.7-28.5 12.5"
      fill={colored ? "#fff" : "currentColor"}
    />
  </svg>
);

const BunIcon = ({ colored }: { colored?: boolean }) => (
  <svg
    className="size-3.5"
    viewBox="0 0 80 70"
    xmlns="http://www.w3.org/2000/svg"
  >
    {colored ? (
      <>
        <path
          d="M73 35.7c0 15.21-15.67 27.54-35 27.54S3 50.91 3 35.7C3 26.27 9 17.94 18.22 13S33.18 3 38 3s8.94 4.13 19.78 10C67 17.94 73 26.27 73 35.7Z"
          fill="#fbf0df"
        />
        <path
          d="M73 35.7a21.67 21.67 0 0 0-.8-5.78c-2.73 33.3-43.35 34.9-59.32 24.94A40 40 0 0 0 38 63.24c19.3 0 35-12.35 35-27.54Z"
          fill="#f6dece"
        />
        <ellipse cx="25.7" cy="33.29" rx="5.51" ry="5.51" />
        <ellipse cx="50.47" cy="33.29" rx="5.51" ry="5.51" />
        <circle cx="24" cy="31.57" fill="#fff" r="2.07" />
        <circle cx="48.77" cy="31.57" fill="#fff" r="2.07" />
        <ellipse cx="53.22" cy="40.18" fill="#febbd0" rx="5.85" ry="3.44" />
        <ellipse cx="22.95" cy="40.18" fill="#febbd0" rx="5.85" ry="3.44" />
        <path
          d="M45.05 43a8.93 8.93 0 0 1-2.92 4.71 6.81 6.81 0 0 1-4 1.88 6.84 6.84 0 0 1-4.13-1.88A8.93 8.93 0 0 1 31.12 43a.72.72 0 0 1 .8-.81h12.34a.72.72 0 0 1 .79.81Z"
          fill="#b71422"
        />
      </>
    ) : (
      <path
        d="M38 65.75C17.32 65.75.5 52.27.5 35.7c0-10 6.18-19.33 16.53-24.92 3-1.6 5.57-3.21 7.86-4.62 1.26-.78 2.45-1.51 3.6-2.19C32 1.89 35 .5 38 .5s5.62 1.2 8.9 3.14c1 .57 2 1.19 3.07 1.87 2.49 1.54 5.3 3.28 9 5.27C69.32 16.37 75.5 25.69 75.5 35.7c0 16.57-16.82 30.05-37.5 30.05ZM38 3c-2.42 0-5 1.25-8.25 3.13-1.13.66-2.3 1.39-3.54 2.15-2.33 1.44-5 3.07-8 4.7C8.69 18.13 3 26.62 3 35.7c0 15.19 15.7 27.55 35 27.55S73 50.89 73 35.7c0-9.08-5.69-17.57-15.22-22.7-3.78-2-6.73-3.88-9.12-5.36-1.09-.67-2.09-1.29-3-1.84C42.63 4 40.42 3 38 3Z"
        fill="currentColor"
      />
    )}
  </svg>
);

const packageManagers = [
  { id: "pnpm", icon: PnpmIcon },
  { id: "npm", icon: NpmIcon },
  { id: "yarn", icon: YarnIcon },
  { id: "bun", icon: BunIcon },
] as const;

type PackageManager = (typeof packageManagers)[number]["id"];

interface PackageManagerTabsProps {
  pnpm: string;
  npm: string;
  yarn: string;
  bun: string;
}

export const PackageManagerTabs = ({
  pnpm,
  npm,
  yarn,
  bun,
}: PackageManagerTabsProps) => {
  const [activePm, setActivePm] = usePackageManager();

  const commands: Record<PackageManager, string> = { pnpm, npm, yarn, bun };
  const currentCommand = commands[activePm];

  return (
    <div className="not-prose my-4 overflow-hidden rounded-lg border border-border">
      {/* Package manager tabs header */}
      <div className="flex items-center justify-between bg-muted/50 px-3 py-2">
        <div className="flex items-center gap-1">
          {packageManagers.map((pm) => {
            const isActive = activePm === pm.id;
            return (
              <button
                className={cn(
                  "flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-medium text-xs transition-all",
                  isActive
                    ? "border-border bg-background text-foreground shadow-sm"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
                key={pm.id}
                onClick={() => setActivePm(pm.id)}
                type="button"
              >
                <pm.icon colored={isActive} />
                {pm.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Code block with Shiki highlighting */}
      <div className="[&_figure]:!my-0 [&_figure]:!rounded-none [&_pre]:!rounded-none [&_figure]:border-0">
        <DynamicCodeBlock code={currentCommand} lang="bash" />
      </div>
    </div>
  );
};
