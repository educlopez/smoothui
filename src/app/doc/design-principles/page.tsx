import type { Metadata } from "next"

import { Breadcrumbs } from "@/components/doc/breadcrumbs"
import { CodeBlock } from "@/components/doc/codeBlock"
import { CodeBlockWrapper } from "@/components/doc/codeBlocKWarapper"
import Divider from "@/components/landing/divider"

export const metadata: Metadata = {
  title: "Design Principles",
  description:
    "Learn about SmoothUI's design system, theming, and customization options.",
}

export default function DesignPrinciplesPage() {
  const tailwindConfig = `@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-brand: var(--color-brand);
  --color-brand-secondary: var(--color-brand-secondary);
  --color-smooth-50: var(--color-smooth-50);
  --color-smooth-100: var(--color-smooth-100);
  --color-smooth-200: var(--color-smooth-200);
  --color-smooth-300: var(--color-smooth-300);
  --color-smooth-400: var(--color-smooth-400);
  --color-smooth-500: var(--color-smooth-500);
  --color-smooth-600: var(--color-smooth-600);
  --color-smooth-700: var(--color-smooth-700);
  --color-smooth-800: var(--color-smooth-800);
  --color-smooth-900: var(--color-smooth-900);
  --color-smooth-950: var(--color-smooth-950);
  --color-smooth-1000: var(--color-smooth-1000);
  --color-border: var(--color-smooth-500);
  --color-sidebar-ring: var(--color-brand);
  --color-sidebar-border: var(--color-smooth-400);
  --color-sidebar-accent-foreground: var(--color-smooth-900);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--color-smooth-1000);
  --color-sidebar-primary: var(--color-brand);
  --color-sidebar-foreground: var(--color-smooth-1000);
  --color-sidebar: var(--color-smooth-100);
  --color-ring: var(--color-brand);
  --color-input: var(--color-smooth-400);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--color-smooth-1000);
  --color-accent: var(--color-brand);
  --color-muted-foreground: var(--color-smooth-800);
  --color-muted: var(--color-smooth-200);
  --color-background: var(--color-smooth-50);
  --color-foreground: var(--color-smooth-1000);
  --color-primary: var(--color-smooth-100);
  --color-primary-foreground: var(--color-smooth-950);
  --color-secondary: var(--color-smooth-200);
  --color-secondary-foreground: var(--color-smooth-900);
  --color-popover-foreground: var(--color-smooth-1000);
  --color-popover: var(--color-smooth-50);
  --color-card-foreground: var(--color-smooth-1000);
  --color-card: var(--color-smooth-100);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  --color-brand: oklch(0.72 0.2 352.53);
  --color-brand-secondary: oklch(0.66 0.21 354.31);
  --color-smooth-50: oklch(99.11% 0 0);
  --color-smooth-100: oklch(97.91% 0 0);
  --color-smooth-200: oklch(96.42% 0 0);
  --color-smooth-300: oklch(94.61% 0 0);
  --color-smooth-400: oklch(93.1% 0 0);
  --color-smooth-500: oklch(91.28% 0 0);
  --color-smooth-600: oklch(89.14% 0 0);
  --color-smooth-700: oklch(82.97% 0 0);
  --color-smooth-800: oklch(65% 0 0);
  --color-smooth-900: oklch(61.67% 0 0);
  --color-smooth-950: oklch(54.17% 0 0);
  --color-smooth-1000: oklch(20.46% 0 0);
  --border: var(--color-smooth-300);
  --text-primary: var(--color-smooth-200);
  --text-quaternary: var(--color-smooth-1000);
  --radius: 0.625rem;
}

.dark {
  --color-smooth-50: oklch(20.02% 0 0);
  --color-smooth-100: oklch(22.64% 0 0);
  --color-smooth-200: oklch(25.62% 0 0);
  --color-smooth-300: oklch(27.68% 0 0);
  --color-smooth-400: oklch(30.12% 0 0);
  --color-smooth-500: oklch(32.5% 0 0);
  --color-smooth-600: oklch(36.39% 0 0);
  --color-smooth-700: oklch(43.13% 0 0);
  --color-smooth-800: oklch(54.52% 0 0);
  --color-smooth-900: oklch(59.31% 0 0);
  --color-smooth-950: oklch(70.58% 0 0);
  --color-smooth-1000: oklch(94.61% 0 0);
  --border: var(--color-smooth-300);
  --text-primary: var(--color-smooth-200);
  --text-quaternary: var(--color-smooth-1000);
}

/* Component NumberFlow */
@layer utilities {
  .slide-in-up {
    animation: slideInUp 0.3s forwards;
  }

  .slide-out-up {
    animation: slideOutUp 0.3s forwards;
  }

  .slide-in-down {
    animation: slideInDown 0.3s forwards;
  }

  .slide-out-down {
    animation: slideOutDown 0.3s forwards;
  }

  @keyframes slideInUp {
    from {
      transform: translateY(50px);
      filter: blur(5px);
    }
    to {
      transform: translateY(0px);
      filter: blur(0px);
    }
  }

  @keyframes slideOutUp {
    from {
      transform: translateY(0px);
      filter: blur(0px);
    }
    to {
      transform: translateY(-50px);
      filter: blur(5px);
    }
  }

  @keyframes slideInDown {
    from {
      transform: translateY(-50px);
      filter: blur(5px);
    }
    to {
      transform: translateY(0px);
      filter: blur(0px);
    }
  }

  @keyframes slideOutDown {
    from {
      transform: translateY(0px);
      filter: blur(0px);
    }
    to {
      transform: translateY(50px);
      filter: blur(5px);
    }
  }
}

/* Component PowerOffSlide */
@layer utilities {
  .loading-shimmer {
    text-fill-color: transparent;
    -webkit-text-fill-color: transparent;
    animation-delay: 0.5s;
    animation-duration: 3s;
    animation-iteration-count: infinite;
    animation-name: loading-shimmer;
    background: var(--text-quaternary)
      gradient(
        linear,
        100% 0,
        0 0,
        from(var(--text-quaternary)),
        color-stop(0.5, var(--text-primary)),
        to(var(--text-quaternary))
      );
    background: var(--text-quaternary) -webkit-gradient(
        linear,
        100% 0,
        0 0,
        from(var(--text-quaternary)),
        color-stop(0.5, var(--text-primary)),
        to(var(--text-quaternary))
      );
    background-clip: text;
    -webkit-background-clip: text;
    background-repeat: no-repeat;
    background-size: 50% 200%;
    display: inline-block;
  }

  .loading-shimmer {
    background-position: -100% top;
  }
  .loading-shimmer:hover {
    -webkit-text-fill-color: var(--text-quaternary);
    animation: none;
    background: transparent;
  }

  @keyframes loading-shimmer {
    0% {
      background-position: -100% top;
    }

    to {
      background-position: 250% top;
    }
  }
}

/* Component AppleInvites */
@layer utilities {
  .gradient-mask-t-0 {
    -webkit-mask-image: linear-gradient(#0000, #000);
    mask-image: linear-gradient(#0000, #000);
  }
}`

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Breadcrumbs groupName="Get Started" currentPage="Design Principles" />
        <div className="space-y-3.5">
          <h1
            data-table-content="Design Principles"
            data-level="1"
            className="text-foreground text-3xl font-semibold -tracking-wide"
          >
            Design Principles
          </h1>
          <p className="text-foreground/70 text-sm leading-relaxed font-normal">
            Learn about SmoothUI&apos;s design system, theming, and
            customization options.
          </p>
        </div>
      </div>
      <Divider orientation="horizontal" className="relative" />
      {/* Design Philosophy */}
      <div className="space-y-4">
        <h2
          data-table-content="Design Philosophy"
          data-level="2"
          className="text-foreground text-lg font-semibold"
        >
          Design Philosophy
        </h2>
        <p className="text-foreground/70 text-sm leading-relaxed">
          SmoothUI is built on the principles of simplicity, accessibility, and
          performance. Each component is designed to be beautiful by default
          while remaining highly customizable.
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-primary/50 rounded-lg border p-4">
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              Beautiful by Default
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Components look great out of the box with carefully chosen colors,
              spacing, and typography.
            </p>
          </div>

          <div className="bg-primary/50 rounded-lg border p-4">
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              Accessible First
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Built with accessibility in mind, following WCAG guidelines and
              best practices.
            </p>
          </div>

          <div className="bg-primary/50 rounded-lg border p-4">
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              Performance Focused
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Optimized for performance with minimal bundle size and efficient
              animations.
            </p>
          </div>
        </div>
      </div>
      <Divider orientation="horizontal" className="relative" />
      {/* Color System */}
      <div className="space-y-4">
        <h2
          data-table-content="Color System"
          data-level="2"
          className="text-foreground text-lg font-semibold"
        >
          Color System
        </h2>
        <p className="text-foreground/70 text-sm leading-relaxed">
          SmoothUI uses a carefully crafted color system based on OKLCH color
          space for better color consistency and accessibility. The system
          includes both light and dark variants.
        </p>

        <div className="space-y-4">
          <h3
            data-table-content="Brand Colors"
            data-level="3"
            className="text-foreground text-base font-semibold"
          >
            Brand Colors
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-primary/50 rounded-lg border p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-brand inset-ring-background h-12 w-12 rounded-md border-[0.5px] inset-ring-2"></div>
                <div>
                  <h4 className="text-foreground font-medium">Brand Primary</h4>
                  <p className="text-foreground/70 text-sm">
                    oklch(0.72 0.2 352.53)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary/50 rounded-lg border p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-brand-secondary inset-ring-background h-12 w-12 rounded-md border-[0.5px] inset-ring-2"></div>
                <div>
                  <h4 className="text-foreground font-medium">
                    Brand Secondary
                  </h4>
                  <p className="text-foreground/70 text-sm">
                    oklch(0.66 0.21 354.31)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3
            data-table-content="Neutral Colors"
            data-level="3"
            className="text-foreground text-base font-semibold"
          >
            Neutral Colors
          </h3>
          <p className="text-foreground/70 text-sm leading-relaxed">
            The neutral color palette provides a range of grays that work well
            in both light and dark modes.
          </p>
          <div className="grid grid-cols-5 gap-2">
            <div className="text-center">
              <div className="bg-smooth-50 inset-ring-background h-12 w-full rounded-md border-[0.5px] inset-ring-2"></div>
              <p className="text-foreground/70 mt-1 text-xs">50</p>
            </div>
            <div className="text-center">
              <div className="bg-smooth-100 inset-ring-background h-12 w-full rounded-md border-[0.5px] inset-ring-2"></div>
              <p className="text-foreground/70 mt-1 text-xs">100</p>
            </div>
            <div className="text-center">
              <div className="bg-smooth-200 inset-ring-background h-12 w-full rounded-md border-[0.5px] inset-ring-2"></div>
              <p className="text-foreground/70 mt-1 text-xs">200</p>
            </div>
            <div className="text-center">
              <div className="bg-smooth-300 inset-ring-background h-12 w-full rounded-md border-[0.5px] inset-ring-2"></div>
              <p className="text-foreground/70 mt-1 text-xs">300</p>
            </div>
            <div className="text-center">
              <div className="bg-smooth-400 inset-ring-background h-12 w-full rounded-md border-[0.5px] inset-ring-2"></div>
              <p className="text-foreground/70 mt-1 text-xs">400</p>
            </div>
            <div className="text-center">
              <div className="bg-smooth-500 inset-ring-background h-12 w-full rounded-md border-[0.5px] inset-ring-2"></div>
              <p className="text-foreground/70 mt-1 text-xs">500</p>
            </div>
            <div className="text-center">
              <div className="bg-smooth-600 inset-ring-background h-12 w-full rounded-md border-[0.5px] inset-ring-2"></div>
              <p className="text-foreground/70 mt-1 text-xs">600</p>
            </div>
            <div className="text-center">
              <div className="bg-smooth-700 inset-ring-background h-12 w-full rounded-md border-[0.5px] inset-ring-2"></div>
              <p className="text-foreground/70 mt-1 text-xs">700</p>
            </div>
            <div className="text-center">
              <div className="bg-smooth-800 inset-ring-background h-12 w-full rounded-md border-[0.5px] inset-ring-2"></div>
              <p className="text-foreground/70 mt-1 text-xs">800</p>
            </div>
            <div className="text-center">
              <div className="bg-smooth-900 inset-ring-background h-12 w-full rounded-md border-[0.5px] inset-ring-2"></div>
              <p className="text-foreground/70 mt-1 text-xs">900</p>
            </div>
            <div className="text-center">
              <div className="bg-smooth-950 inset-ring-background h-12 w-full rounded-md border-[0.5px] inset-ring-2"></div>
              <p className="text-foreground/70 mt-1 text-xs">950</p>
            </div>
            <div className="text-center">
              <div className="bg-smooth-1000 inset-ring-background h-12 w-full rounded-md border-[0.5px] inset-ring-2"></div>
              <p className="text-foreground/70 mt-1 text-xs">1000</p>
            </div>
          </div>
        </div>
      </div>
      <Divider orientation="horizontal" className="relative" />
      {/* Design System CSS */}
      <div className="space-y-4">
        <h2
          data-table-content="Design System CSS"
          data-level="2"
          className="text-foreground text-lg font-semibold"
        >
          Design System CSS
        </h2>
        <p className="text-foreground/70 text-sm leading-relaxed">
          Add this CSS to your global styles to enable the full SmoothUI design
          system:
        </p>
        <CodeBlockWrapper expandButtonTitle="Expand CSS" className="my-6">
          <CodeBlock code={tailwindConfig} fileName="global.css" lang="css" />
        </CodeBlockWrapper>
      </div>
      <Divider orientation="horizontal" className="relative" />
      {/* Customization */}
      <div className="space-y-4">
        <h2
          data-table-content="Customization"
          data-level="2"
          className="text-foreground text-lg font-semibold"
        >
          Customization
        </h2>
        <p className="text-foreground/70 text-sm leading-relaxed">
          SmoothUI components are highly customizable. Here are the main ways to
          customize them:
        </p>

        <div className="space-y-4">
          <div className="bg-primary/50 rounded-lg border p-4">
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              CSS Variables
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Override CSS variables to customize colors, spacing, and other
              design tokens globally.
            </p>
          </div>

          <div className="bg-primary/50 rounded-lg border p-4">
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              Tailwind Classes
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Use Tailwind utility classes to customize individual components or
              create variants.
            </p>
          </div>

          <div className="bg-primary/50 rounded-lg border p-4">
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              Component Props
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Many components accept props for customization like size, variant,
              and color options.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
