"use client";

import { usePackageManager } from "@docs/hooks/use-package-manager";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { useState } from "react";

interface InstallerProps {
  packageName: string;
}

const SmoothUIIcon = () => (
  <svg
    className="size-4"
    fill="currentColor"
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M329.205 6.05469C331.396 0.985458 337.281 -1.34888 342.351 0.84082L355.644 6.58301C356.018 6.74496 356.377 6.93032 356.722 7.13086L439.729 42.9902C444.799 45.1805 447.134 51.066 444.944 56.1357L439.202 69.4277C437.012 74.4976 431.126 76.8315 426.056 74.6416L351.12 42.2705L330.918 89.0332C376.141 114.344 408.567 159.794 416.052 213.239H429.756V278.752H397.765L397.27 282.408L386.144 369.047C383.266 392.108 380.937 415.238 377.957 438.284C376.66 448.318 375.865 459.058 373.398 468.858C372.384 471.375 371.168 473.657 369.527 475.817C353.072 497.475 312.68 504.556 287.003 508.111C273.789 510.037 260.45 510.964 247.098 510.888C217.287 510.485 162.338 502.749 138.37 484.41C133.049 480.338 128.118 475.314 126.057 468.793C124.143 462.739 123.772 455.672 122.899 449.391L117.649 411.719L99.9443 278.752H67.7119V213.239H80.5723C92.1014 130.913 162.808 67.5599 248.312 67.5596C266.066 67.5596 283.183 70.2933 299.265 75.3594L329.205 6.05469ZM298.618 347.714C290.008 349.185 284.699 357.994 277.604 362.6C260.758 373.533 233.532 371.369 217.451 359.928C211.198 355.48 206.551 346.709 197.798 348.069C194.209 348.628 190.796 350.598 188.722 353.611C186.781 356.428 186.276 360.028 186.956 363.345C188.187 369.351 193.243 374.041 197.507 378.105C213.771 391.889 237.722 397.757 258.754 395.938C277.382 394.327 294.852 386.112 306.932 371.629C309.792 368.2 311.798 364.372 311.3 359.786C310.918 356.283 309.287 352.397 306.453 350.188C304.098 348.351 301.526 347.879 298.618 347.714ZM187.43 188.242C177.489 188.242 169.43 196.301 169.43 206.242V305.578C169.43 315.519 177.489 323.578 187.43 323.578H194.529C204.47 323.578 212.529 315.519 212.529 305.578V206.242C212.529 196.301 204.47 188.242 194.529 188.242H187.43ZM302.939 188.242C292.998 188.242 284.94 196.301 284.939 206.242V305.578C284.939 315.519 292.998 323.578 302.939 323.578H310.04C319.981 323.578 328.04 315.519 328.04 305.578V206.242C328.04 196.301 319.981 188.242 310.04 188.242H302.939Z" />
  </svg>
);

const ShadcnIcon = () => (
  <svg
    className="size-4"
    viewBox="0 0 256 256"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M208 128L128 208"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="32"
    />
    <path
      d="M192 40L40 192"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="32"
    />
  </svg>
);

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

export const Installer = ({ packageName }: InstallerProps) => {
  const [activeTab, setActiveTab] = useState<"smoothui" | "shadcn">("smoothui");
  const [activePm, setActivePm] = usePackageManager();

  const smoothuiCommand = `npx smoothui-cli add ${packageName}`;

  const shadcnCommands: Record<PackageManager, string> = {
    pnpm: `pnpm dlx shadcn add @smoothui/${packageName}`,
    npm: `npx shadcn@latest add @smoothui/${packageName}`,
    yarn: `yarn dlx shadcn add @smoothui/${packageName}`,
    bun: `bunx shadcn add @smoothui/${packageName}`,
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      {/* Main tabs header */}
      <div className="flex flex-col gap-2 bg-muted/50 px-2 py-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <div className="flex items-center gap-1">
          <button
            className={cn(
              "flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-medium text-sm transition-all",
              activeTab === "smoothui"
                ? "border-border bg-background text-foreground shadow-sm"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setActiveTab("smoothui")}
            type="button"
          >
            <SmoothUIIcon />
            SmoothUI CLI
          </button>
          <button
            className={cn(
              "flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-medium text-sm transition-all",
              activeTab === "shadcn"
                ? "border-border bg-background text-foreground shadow-sm"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setActiveTab("shadcn")}
            type="button"
          >
            <ShadcnIcon />
            shadcn CLI
          </button>
        </div>

        {/* Package manager tabs - always render but hide when not shadcn */}
        <div
          className={cn(
            "flex items-center gap-0.5 transition-opacity",
            activeTab === "shadcn"
              ? "opacity-100"
              : "pointer-events-none hidden opacity-0 sm:flex"
          )}
        >
          {packageManagers.map((pm) => {
            const isActive = activePm === pm.id;
            return (
              <button
                className={cn(
                  "flex items-center gap-1 rounded border px-2 py-1 font-medium text-xs transition-all",
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

      {/* Code block */}
      <div className="[&_figure]:!my-0 [&_figure]:!rounded-none [&_pre]:!rounded-none [&_figure]:border-0">
        <DynamicCodeBlock
          code={
            activeTab === "smoothui"
              ? smoothuiCommand
              : shadcnCommands[activePm]
          }
          lang="bash"
        />
      </div>
    </div>
  );
};
