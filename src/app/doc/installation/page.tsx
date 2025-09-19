import type { Metadata } from "next"

import { Breadcrumbs } from "@/components/doc/breadcrumbs"
import { CodeBlock } from "@/components/doc/codeBlock"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/doc/tabs"

export const metadata: Metadata = {
  title: "Installation",
  description:
    "Learn how to install SmoothUI components using shadcn CLI or manual installation methods.",
}

export default function InstallationPage() {
  const codeInstall = `motion tailwindcss lucide-react clsx tailwind-merge`

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Breadcrumbs groupName="Get Started" currentPage="Installation" />
        <div className="space-y-3.5">
          <h1
            data-table-content="Installation"
            data-level="1"
            className="text-foreground text-3xl font-semibold -tracking-wide"
          >
            Installation
          </h1>
          <p className="text-foreground/70 text-sm leading-relaxed font-normal">
            Get started with SmoothUI by installing components using the shadcn
            CLI or manual installation methods.
          </p>
        </div>
      </div>

      {/* Official Registry Installation */}
      <div className="space-y-4">
        <h2
          data-table-content="Installation (Official Registry)"
          data-level="2"
          className="text-foreground text-lg font-semibold"
        >
          Installation (Official Registry)
        </h2>
        <p className="text-foreground/70 text-sm leading-relaxed">
          SmoothUI is an official shadcn registry, so you can install components
          directly without any configuration. Just use the{" "}
          <code className="bg-primary rounded border px-1.5 py-0.5 text-sm">
            @smoothui
          </code>{" "}
          namespace.
        </p>

        <div className="bg-primary/50 rounded-lg border p-4">
          <h3 className="text-foreground mb-2 text-base font-semibold">
            🚀 No Configuration Required
          </h3>
          <p className="text-foreground/70 text-sm leading-relaxed">
            Since SmoothUI is an official registry, you don't need to add
            anything to your{" "}
            <code className="bg-primary rounded border px-1.5 py-0.5 text-sm">
              components.json
            </code>{" "}
            file. Just install components directly!
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3
              data-table-content="Install Components"
              data-level="3"
              className="text-foreground text-base font-semibold"
            >
              Install Components
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Install SmoothUI components using the shadcn CLI with the{" "}
              <code className="bg-primary rounded border px-1.5 py-0.5 text-sm">
                @smoothui
              </code>{" "}
              namespace:
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
            <h3
              data-table-content="Use Components"
              data-level="3"
              className="text-foreground text-base font-semibold"
            >
              Use Components
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Import and use the installed components in your React application:
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
      </div>

      {/* Manual Installation */}
      <div className="space-y-4">
        <h2
          data-table-content="Manual Installation"
          data-level="2"
          className="text-foreground text-lg font-semibold"
        >
          Manual Installation
        </h2>
        <p className="text-foreground/70 text-sm leading-relaxed">
          If you prefer to install components manually, you will need to install
          the following dependencies:
        </p>

        <Tabs defaultValue="npm">
          <TabsList className="text-foreground/70 bg-primary border">
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

        <div className="space-y-4">
          <h3
            data-table-content="Manual Component Installation"
            data-level="3"
            className="text-foreground text-base font-semibold"
          >
            Manual Component Installation
          </h3>
          <p className="text-foreground/70 text-sm leading-relaxed">
            After installing the dependencies, you can manually copy component
            files from the SmoothUI repository:
          </p>
          <ol className="text-foreground/70 list-decimal space-y-2 pl-6 text-sm leading-relaxed">
            <li>Visit the component page on the SmoothUI website</li>
            <li>Copy the component code from the code block</li>
            <li>Create the component file in your project</li>
            <li>Import and use the component in your application</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
