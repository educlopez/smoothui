import type { Metadata } from "next"
import Link from "next/link"

import { Breadcrumbs } from "@/components/doc/breadcrumbs"
import { CodeBlock } from "@/components/doc/codeBlock"
import { ComponentSearch } from "@/components/doc/ComponentSearch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/doc/tabs"

import { CodeBlockWrapper } from "../../components/doc/codeBlocKWarapper"

export const metadata: Metadata = {
  title: "Introduction",
  description:
    "Learn what SmoothUI is and how to get started with customizable React components built using TailwindCSS and Framer Motion.",
}

export default function GetStartedPage() {
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
}
`

  const codeInstall = `motion tailwindcss lucide-react clsx tailwind-merge`

  return (
    <>
      <div className="space-y-8">
        <div className="space-y-4">
          <Breadcrumbs groupName="Get Started" currentPage="Introduction" />
          <div className="space-y-3.5">
            <h1
              data-table-content="Introduction"
              data-level="1"
              className="text-foreground text-3xl font-bold -tracking-wide"
            >
              Introduction
            </h1>
            <p className="text-primary-foreground text-[16px] leading-relaxed font-normal">
              SmoothUI is a collection of beautifully designed components with
              smooth animations built with React, Tailwind CSS, and Motion.
            </p>

            {/* Component Search */}
            <div className="mt-6">
              <ComponentSearch
                className="max-w-md"
                placeholder="Search components, tags, or features..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2
            data-table-content="Installation"
            data-level="2"
            className="text-foreground text-2xl font-bold"
          >
            Installation
          </h2>

          <div className="space-y-6">
            <div className="space-y-4">
              <h3
                data-table-content="Using shadcn CLI v3 (Recommended)"
                data-level="3"
                className="text-foreground text-xl font-semibold"
              >
                Using shadcn CLI v3 (Recommended)
              </h3>
              <p className="text-primary-foreground text-[16px] leading-relaxed">
                SmoothUI is fully compatible with the new shadcn CLI v3
                namespace system. This is the easiest way to install and manage
                SmoothUI components.
              </p>

              <div className="space-y-4">
                <h4 className="text-foreground text-lg font-medium">
                  Step 1: Configure the Registry
                </h4>
                <p className="text-primary-foreground text-[16px] leading-relaxed">
                  Add the SmoothUI registry to your{" "}
                  <code className="bg-primary rounded border px-1.5 py-0.5 text-sm">
                    components.json
                  </code>{" "}
                  file:
                </p>
                <CodeBlock
                  code={`"registries": {
    "@smoothui": "https://smoothui.dev/r/{name}.json"
  }
`}
                  fileName="components.json"
                  lang="json"
                />
              </div>

              <div className="space-y-4">
                <h4 className="text-foreground text-lg font-medium">
                  Step 2: Install Components
                </h4>
                <p className="text-primary-foreground text-[16px] leading-relaxed">
                  Install components using the namespace:
                </p>
                <CodeBlock
                  code={`# Install a single component
npx shadcn@latest add @smoothui/siri-orb

# Install multiple components
npx shadcn@latest add @smoothui/rich-popover @smoothui/animated-input

# Install components with dependencies
npx shadcn@latest add @smoothui/scrollable-card-stack`}
                  fileName="Terminal"
                  lang="shell"
                />
              </div>

              <div className="space-y-4">
                <h4 className="text-foreground text-lg font-medium">
                  Step 3: Use Components
                </h4>
                <p className="text-primary-foreground text-[16px] leading-relaxed">
                  Import and use the installed components:
                </p>
                <CodeBlock
                  code={`import { SiriOrb } from "@/components/smoothui/ui/SiriOrb"
import { RichPopover } from "@/components/smoothui/ui/RichPopover"

export default function App() {
  return (
    <div>
      <SiriOrb size="200px" />
      <RichPopover />
    </div>
  )
}`}
                  fileName="App.tsx"
                  lang="tsx"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3
                data-table-content="Manual Installation"
                data-level="3"
                className="text-foreground text-xl font-semibold"
              >
                Manual Installation
              </h3>
              <p className="text-primary-foreground text-[16px] leading-relaxed">
                If you prefer to install components manually, you will need to
                install the following dependencies:
              </p>
            </div>
          </div>

          <Tabs defaultValue="npm">
            <TabsList className="text-primary-foreground bg-primary border">
              <TabsTrigger
                value="npm"
                className="data-[state=active]:bg-brand-secondary data-[state=active]:shadow-custom-brand data-[state=active]:border-none data-[state=active]:text-white"
              >
                npm
              </TabsTrigger>
              <TabsTrigger
                value="pnpm"
                className="data-[state=active]:bg-brand-secondary data-[state=active]:shadow-custom-brand data-[state=active]:border-none data-[state=active]:text-white"
              >
                pnpm
              </TabsTrigger>
              <TabsTrigger
                value="yarn"
                className="data-[state=active]:bg-brand-secondary data-[state=active]:shadow-custom-brand data-[state=active]:border-none data-[state=active]:text-white"
              >
                yarn
              </TabsTrigger>
              <TabsTrigger
                value="bun"
                className="data-[state=active]:bg-brand-secondary data-[state=active]:shadow-custom-brand data-[state=active]:border-none data-[state=active]:text-white"
              >
                bun
              </TabsTrigger>
            </TabsList>
            <TabsContent value="npm">
              <CodeBlock
                code={codeInstall}
                fileName="Terminal"
                installCommand="npm install"
                lang="shell"
              />
            </TabsContent>
            <TabsContent value="pnpm">
              <CodeBlock
                code={codeInstall}
                fileName="Terminal"
                installCommand="pnpm install"
                lang="shell"
              />
            </TabsContent>
            <TabsContent value="yarn">
              <CodeBlock
                code={codeInstall}
                fileName="Terminal"
                installCommand="yarn add"
                lang="shell"
              />
            </TabsContent>
            <TabsContent value="bun">
              <CodeBlock
                code={codeInstall}
                fileName="Terminal"
                installCommand="bun add"
                lang="shell"
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <h2
            data-table-content="Registry System"
            data-level="2"
            className="text-foreground text-2xl font-bold"
          >
            Registry System
          </h2>
          <p className="text-primary-foreground text-[16px] leading-relaxed">
            SmoothUI uses a custom registry system compatible with shadcn CLI
            v3. Each component includes all necessary dependencies and
            utilities.
          </p>

          <div className="space-y-4">
            <h3 className="text-foreground text-xl font-semibold">
              Automatic Dependencies
            </h3>
            <ul className="text-primary-foreground list-inside list-disc space-y-2 text-[16px] leading-relaxed">
              <li>
                <strong>Package Dependencies</strong>: Required npm packages are
                automatically included
              </li>
              <li>
                <strong>Utility Files</strong>: Shared utilities like{" "}
                <code className="bg-primary rounded border px-1.5 py-0.5 text-sm">
                  cn
                </code>{" "}
                are automatically bundled
              </li>
              <li>
                <strong>Import Paths</strong>: All import paths are
                automatically resolved
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-foreground text-xl font-semibold">
              Component Structure
            </h3>
            <p className="text-primary-foreground text-[16px] leading-relaxed">
              When you install a component, you get:
            </p>
            <CodeBlock
              code={`components/smoothui/ui/
├── ComponentName.tsx    # Main component file
lib/utils/
└── cn.ts               # Utility functions (if needed)`}
              fileName="File Structure"
              lang="shell"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-foreground text-xl font-semibold">
              Registry Features
            </h3>
            <ul className="text-primary-foreground list-inside list-disc space-y-2 text-[16px] leading-relaxed">
              <li>
                <strong>Self-contained</strong>: Each component includes all
                necessary dependencies
              </li>
              <li>
                <strong>Type-safe</strong>: Full TypeScript support with proper
                types
              </li>
              <li>
                <strong>Optimized</strong>: Components are optimized for
                performance
              </li>
              <li>
                <strong>Accessible</strong>: Built-in accessibility features
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <h2
            data-table-content="MCP Support"
            data-level="2"
            className="text-foreground text-2xl font-bold"
          >
            MCP Support
          </h2>
          <p className="text-primary-foreground text-[16px] leading-relaxed">
            SmoothUI is fully compatible with the shadcn MCP server, enabling AI
            assistants to discover and install components automatically.
          </p>

          <div className="bg-primary/50 rounded-lg border p-4">
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              🤖 AI Assistant Integration
            </h3>
            <p className="text-primary-foreground mb-3 text-[16px] leading-relaxed">
              With MCP support, AI assistants like Claude, Cursor, and GitHub
              Copilot can discover, install, and help you use SmoothUI
              components seamlessly.
            </p>
            <Link
              href="/doc/mcp"
              className="text-brand font-medium hover:underline"
            >
              Learn more about MCP support →
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <h2
            data-table-content="Design System"
            data-level="2"
            className="text-foreground text-2xl font-bold"
          >
            Design System
          </h2>
          <p className="text-primary-foreground text-[16px] leading-relaxed">
            SmoothUI uses a carefully crafted design system with both light and
            dark variants. Add this to your global.css:
          </p>
          <CodeBlockWrapper expandButtonTitle="Expand" className="my-6">
            <CodeBlock code={tailwindConfig} fileName="global.css" lang="css" />
          </CodeBlockWrapper>
        </div>

        <div className="space-y-4">
          <h2
            data-table-content="Usage Tips"
            data-level="2"
            className="text-foreground text-2xl font-bold"
          >
            Usage Tips
          </h2>
          <div className="space-y-3">
            <p className="text-primary-foreground text-[16px] leading-relaxed">
              Here are some tips to get the most out of SmoothUI components:
            </p>
            <ul className="text-primary-foreground list-disc space-y-2 pl-6 text-[16px]">
              <li>
                All components support both light and dark modes out of the box
              </li>
              <li>Use the provided color system for consistent theming</li>
              <li>Components are built with motion for smooth animations</li>
              <li>Each component can be customized using Tailwind classes</li>
              <li>
                Check individual component documentation for specific
                customization options
              </li>
            </ul>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="space-y-4">
          <h2
            data-table-content="Quick Navigation"
            data-level="2"
            className="text-foreground text-xl font-semibold"
          >
            Quick Navigation
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/doc/components"
              className="group bg-primary hover:bg-primary/80 rounded-lg border p-4 transition-colors"
            >
              <h3 className="group-hover:text-brand font-semibold transition-colors">
                Browse Components
              </h3>
              <p className="text-foreground/70 mt-1 text-sm">
                Explore all available components with live demos
              </p>
            </Link>

            <Link
              href="/doc/tags"
              className="group bg-primary hover:bg-primary/80 rounded-lg border p-4 transition-colors"
            >
              <h3 className="group-hover:text-brand font-semibold transition-colors">
                Browse by Tags
              </h3>
              <p className="text-foreground/70 mt-1 text-sm">
                Discover components by technology and features
              </p>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
