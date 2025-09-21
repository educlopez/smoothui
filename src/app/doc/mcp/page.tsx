import type { Metadata } from "next"

import { Breadcrumbs } from "@/components/doc/breadcrumbs"
import { CodeBlock } from "@/components/doc/codeBlock"
import { InlineCode } from "@/components/doc/InlineCode"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/doc/tabs"
import Divider from "@/components/landing/divider"

export const metadata: Metadata = {
  title: "MCP Server",
  description:
    "MCP support for SmoothUI registry - Enable AI assistants to discover and use SmoothUI components.",
}

export default function MCPPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Breadcrumbs groupName="Get Started" currentPage="MCP Server" />
        <div className="space-y-3.5">
          <h1
            data-table-content="MCP Server"
            data-level="1"
            className="text-foreground text-3xl font-bold -tracking-wide"
          >
            MCP Server
          </h1>
          <p className="text-foreground/70 text-sm leading-relaxed font-normal">
            MCP support for registry developers - Enable AI assistants to
            discover and use SmoothUI components.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-foreground/70 text-sm leading-relaxed">
          The <strong>shadcn MCP server</strong> works out of the box with any
          shadcn-compatible registry. You do not need to do anything special to
          enable MCP support for your SmoothUI registry.
        </p>
      </div>
      <Divider orientation="horizontal" className="relative" />
      <div className="space-y-4">
        <h2
          data-table-content="Prerequisites"
          data-level="2"
          className="text-foreground text-lg font-semibold"
        >
          Prerequisites
        </h2>
        <p className="text-foreground/70 text-sm leading-relaxed">
          The MCP server works by requesting your registry index. Make sure you
          have a registry item file at the root of your registry named{" "}
          <InlineCode>registry</InlineCode>.
        </p>

        <p className="text-foreground/70 text-sm leading-relaxed">
          For example, if your registry is hosted at{" "}
          <InlineCode>https://smoothui.dev/r/[name].json</InlineCode>, you
          should have a file at{" "}
          <InlineCode>https://smoothui.dev/r/registry.json</InlineCode>.
        </p>

        <p className="text-foreground/70 text-sm leading-relaxed">
          This file must be a valid JSON file that conforms to the registry
          schema.
        </p>
      </div>
      <Divider orientation="horizontal" className="relative" />
      <div className="space-y-4">
        <h2
          data-table-content="Configuring MCP"
          data-level="2"
          className="text-foreground text-lg font-semibold"
        >
          Configuring MCP
        </h2>
        <p className="text-foreground/70 text-sm leading-relaxed">
          Ask your registry consumers to configure your registry in their{" "}
          <InlineCode>components.json</InlineCode> file and install the shadcn
          MCP server:
        </p>

        <Tabs defaultValue="claude">
          <TabsList className="text-foreground/70 bg-primary border">
            <TabsTrigger
              value="claude"
              className="data-[state=active]:bg-brand-secondary data-[state=active]:shadow-custom-brand data-[state=active]:border-none data-[state=active]:text-white"
            >
              Claude Code
            </TabsTrigger>
            <TabsTrigger
              value="cursor"
              className="data-[state=active]:bg-brand-secondary data-[state=active]:shadow-custom-brand data-[state=active]:border-none data-[state=active]:text-white"
            >
              Cursor
            </TabsTrigger>
            <TabsTrigger
              value="vscode"
              className="data-[state=active]:bg-brand-secondary data-[state=active]:shadow-custom-brand data-[state=active]:border-none data-[state=active]:text-white"
            >
              VS Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="claude" className="mt-4">
            <div className="space-y-4">
              <p className="text-foreground/70 text-sm leading-relaxed">
                <strong>Configure your registry</strong> in your{" "}
                <InlineCode>components.json</InlineCode> file:
              </p>
              <CodeBlock
                code={`{
  "registries": {
    "@smoothui": "https://smoothui.dev/r/{name}.json"
  }
}`}
                fileName="components.json"
                lang="json"
              />

              <p className="text-foreground/70 text-sm leading-relaxed">
                <strong>Run the following command</strong> in your project:
              </p>
              <CodeBlock
                code="npx shadcn@latest mcp init --client claude"
                fileName="Terminal"
                lang="shell"
              />

              <p className="text-foreground/70 text-sm leading-relaxed">
                <strong>Restart Claude Code</strong> and try the following
                prompts:
              </p>
              <ul className="text-foreground/70 list-inside list-disc space-y-2 text-sm leading-relaxed">
                <li>Show me the components in the smoothui registry</li>
                <li>
                  Create a landing page using items from the smoothui registry
                </li>
                <li>Install the SiriOrb component from smoothui</li>
              </ul>

              <p className="text-foreground/70 text-sm leading-relaxed">
                <strong>Note:</strong> You can use <InlineCode>/mcp</InlineCode>{" "}
                command in Claude Code to debug the MCP server.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="cursor" className="mt-4">
            <div className="space-y-4">
              <p className="text-foreground/70 text-sm leading-relaxed">
                <strong>Configure your registry</strong> in your{" "}
                <InlineCode>components.json</InlineCode> file:
              </p>
              <CodeBlock
                code={`{
  "registries": {
    "@smoothui": "https://smoothui.dev/r/{name}.json"
  }
}`}
                fileName="components.json"
                lang="json"
              />

              <p className="text-foreground/70 text-sm leading-relaxed">
                <strong>Run the following command</strong> in your project:
              </p>
              <CodeBlock
                code="npx shadcn@latest mcp init --client cursor"
                fileName="Terminal"
                lang="shell"
              />

              <p className="text-foreground/70 text-sm leading-relaxed">
                Open <strong>Cursor Settings</strong> and{" "}
                <strong>Enable the MCP server</strong> for shadcn. Then try the
                following prompts:
              </p>
              <ul className="text-foreground/70 list-inside list-disc space-y-2 text-sm leading-relaxed">
                <li>Show me the components in the smoothui registry</li>
                <li>
                  Create a landing page using items from the smoothui registry
                </li>
                <li>Install the SiriOrb component from smoothui</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="vscode" className="mt-4">
            <div className="space-y-4">
              <p className="text-foreground/70 text-sm leading-relaxed">
                <strong>Configure your registry</strong> in your{" "}
                <InlineCode>components.json</InlineCode> file:
              </p>
              <CodeBlock
                code={`{
  "registries": {
    "@smoothui": "https://smoothui.dev/r/{name}.json"
  }
}`}
                fileName="components.json"
                lang="json"
              />

              <p className="text-foreground/70 text-sm leading-relaxed">
                <strong>Run the following command</strong> in your project:
              </p>
              <CodeBlock
                code="npx shadcn@latest mcp init --client vscode"
                fileName="Terminal"
                lang="shell"
              />

              <p className="text-foreground/70 text-sm leading-relaxed">
                Open <InlineCode>.vscode/mcp.json</InlineCode> and click{" "}
                <strong>Start</strong> next to the shadcn server. Then try the
                following prompts with GitHub Copilot:
              </p>
              <ul className="text-foreground/70 list-inside list-disc space-y-2 text-sm leading-relaxed">
                <li>Show me the components in the smoothui registry</li>
                <li>
                  Create a landing page using items from the smoothui registry
                </li>
                <li>Install the SiriOrb component from smoothui</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Divider orientation="horizontal" className="relative" />
      <div className="space-y-4">
        <h2
          data-table-content="Example Prompts"
          data-level="2"
          className="text-foreground text-lg font-semibold"
        >
          Example Prompts
        </h2>
        <p className="text-foreground/70 text-sm leading-relaxed">
          Once MCP is configured, you can use these prompts with your AI
          assistant:
        </p>

        <div className="space-y-4">
          <div className="bg-primary/50 rounded-lg border p-4">
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              Component Discovery
            </h3>
            <ul className="text-foreground/70 list-inside list-disc space-y-2 text-sm leading-relaxed">
              <li>
                &ldquo;Show me all available components in the smoothui
                registry&rdquo;
              </li>
              <li>
                &ldquo;What animation components are available in
                smoothui?&rdquo;
              </li>
              <li>
                &ldquo;List all interactive components from smoothui&rdquo;
              </li>
            </ul>
          </div>

          <div className="bg-primary/50 rounded-lg border p-4">
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              Component Installation
            </h3>
            <ul className="text-foreground/70 list-inside list-disc space-y-2 text-sm leading-relaxed">
              <li>&ldquo;Install the SiriOrb component from smoothui&rdquo;</li>
              <li>&ldquo;Add the RichPopover component to my project&rdquo;</li>
              <li>
                &ldquo;Install multiple components: SiriOrb, AnimatedInput, and
                ScrollableCardStack&rdquo;
              </li>
            </ul>
          </div>

          <div className="bg-primary/50 rounded-lg border p-4">
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              Component Usage
            </h3>
            <ul className="text-foreground/70 list-inside list-disc space-y-2 text-sm leading-relaxed">
              <li>
                &ldquo;Create a landing page using the SiriOrb component&rdquo;
              </li>
              <li>
                &ldquo;Show me how to use the ScrollableCardStack
                component&rdquo;
              </li>
              <li>&ldquo;Build a dashboard with smoothui components&rdquo;</li>
            </ul>
          </div>
        </div>
      </div>
      <Divider orientation="horizontal" className="relative" />
      <div className="space-y-4">
        <h2
          data-table-content="SmoothUI MCP Features"
          data-level="2"
          className="text-foreground text-lg font-semibold"
        >
          SmoothUI MCP Features
        </h2>
        <p className="text-foreground/70 text-sm leading-relaxed">
          SmoothUI registry is fully MCP-compatible and includes:
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-primary/50 rounded-lg border p-4">
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              Component Discovery
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              AI assistants can discover all available SmoothUI components and
              their descriptions.
            </p>
          </div>

          <div className="bg-primary/50 rounded-lg border p-4">
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              Automatic Installation
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Components are installed with all dependencies and utilities
              automatically included.
            </p>
          </div>

          <div className="bg-primary/50 rounded-lg border p-4">
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              Smart Dependencies
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Required packages like <InlineCode>clsx</InlineCode> and{" "}
              <InlineCode>tailwind-merge</InlineCode> are automatically detected
              and included.
            </p>
          </div>

          <div className="bg-primary/50 rounded-lg border p-4">
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              Usage Examples
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              AI assistants can provide usage examples and help integrate
              components into your projects.
            </p>
          </div>
        </div>
      </div>
      <Divider orientation="horizontal" className="relative" />
      <div className="space-y-4">
        <h2
          data-table-content="Learn More"
          data-level="2"
          className="text-foreground text-lg font-semibold"
        >
          Learn More
        </h2>
        <p className="text-foreground/70 text-sm leading-relaxed">
          You can read more about the MCP server in the{" "}
          <a
            href="https://ui.shadcn.com/docs/mcp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:underline"
          >
            shadcn MCP documentation
          </a>
          .
        </p>
      </div>
    </div>
  )
}
