import type { Metadata } from "next"

import { BodyText } from "@/components/doc/BodyText"
import { Breadcrumbs } from "@/components/doc/breadcrumbs"
import { CodeBlock } from "@/components/doc/codeBlock"
import { FeatureCard } from "@/components/doc/FeatureCard"
import { InlineCode } from "@/components/doc/InlineCode"
import { List } from "@/components/doc/List"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/doc/tabs"
import { Title } from "@/components/doc/Title"
import Divider from "@/components/landing/divider"

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
          <Title level={1} tableContent="Installation">
            Installation
          </Title>
          <BodyText>
            Get started with SmoothUI by installing components using the shadcn
            CLI or manual installation methods.
          </BodyText>
        </div>
      </div>
      <Divider orientation="horizontal" className="relative" />
      {/* Official Registry Installation */}
      <div className="space-y-4">
        <Title level={2} tableContent="Installation (Official Registry)">
          Installation (Official Registry)
        </Title>
        <BodyText>
          SmoothUI is an official shadcn registry, so you can install components
          directly without any configuration. Just use the{" "}
          <InlineCode>@smoothui</InlineCode> namespace.
        </BodyText>
        <FeatureCard title="No Configuration Required" variant="info">
          Since SmoothUI is an official registry, you don&apos;t need to add
          anything to your <InlineCode>components.json</InlineCode> file. Just
          install components directly!
        </FeatureCard>

        <div className="space-y-6">
          <div className="space-y-4">
            <Title level={3} tableContent="Install Components">
              Install Components
            </Title>
            <BodyText>
              Install SmoothUI components using the shadcn CLI with the{" "}
              <InlineCode>@smoothui</InlineCode> namespace:
            </BodyText>
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
            <Title level={3} tableContent="Use Components">
              Use Components
            </Title>
            <BodyText>
              Import and use the installed components in your React application:
            </BodyText>
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
      <Divider orientation="horizontal" className="relative" />
      {/* Manual Installation */}
      <div className="space-y-4">
        <Title level={2} tableContent="Manual Installation">
          Manual Installation
        </Title>
        <BodyText>
          If you prefer to install components manually, you will need to install
          the following dependencies:
        </BodyText>

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
          <Title level={3} tableContent="Manual Component Installation">
            Manual Component Installation
          </Title>
          <BodyText>
            After installing the dependencies, you can manually copy component
            files from the SmoothUI repository:
          </BodyText>
          <List type="ordered">
            <li>Visit the component page on the SmoothUI website</li>
            <li>Copy the component code from the code block</li>
            <li>Create the component file in your project</li>
            <li>Import and use the component in your application</li>
          </List>
        </div>
      </div>
    </div>
  )
}
