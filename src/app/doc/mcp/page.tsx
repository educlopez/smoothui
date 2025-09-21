import type { Metadata } from "next"

import { BodyText } from "@/components/doc/BodyText"
import { Breadcrumbs } from "@/components/doc/breadcrumbs"
import { CodeBlock } from "@/components/doc/codeBlock"
import { InlineCode } from "@/components/doc/InlineCode"
import { List } from "@/components/doc/List"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/doc/tabs"
import { Title } from "@/components/doc/Title"
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
          <Title level={1} tableContent="MCP Server">
            MCP Server
          </Title>
          <BodyText>
            MCP support for registry developers - Enable AI assistants to
            discover and use SmoothUI components.
          </BodyText>
        </div>
      </div>

      <div className="space-y-4">
        <BodyText>
          The <strong>shadcn MCP server</strong> works out of the box with any
          shadcn-compatible registry. You do not need to do anything special to
          enable MCP support for your SmoothUI registry.
        </BodyText>
      </div>
      <Divider orientation="horizontal" className="relative" />
      <div className="space-y-4">
        <Title level={2} tableContent="Prerequisites">
          Prerequisites
        </Title>
        <BodyText>
          The MCP server works by requesting your registry index. Make sure you
          have a registry item file at the root of your registry named{" "}
          <InlineCode>registry</InlineCode>.
        </BodyText>

        <BodyText>
          For example, if your registry is hosted at{" "}
          <InlineCode>https://smoothui.dev/r/[name].json</InlineCode>, you
          should have a file at{" "}
          <InlineCode>https://smoothui.dev/r/registry.json</InlineCode>.
        </BodyText>

        <BodyText>
          This file must be a valid JSON file that conforms to the registry
          schema.
        </BodyText>
      </div>
      <Divider orientation="horizontal" className="relative" />
      <div className="space-y-4">
        <Title level={2} tableContent="Configuring MCP">
          Configuring MCP
        </Title>
        <BodyText>
          Ask your registry consumers to configure your registry in their{" "}
          <InlineCode>components.json</InlineCode> file and install the shadcn
          MCP server:
        </BodyText>

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
              <BodyText>
                <strong>Configure your registry</strong> in your{" "}
                <InlineCode>components.json</InlineCode> file:
              </BodyText>
              <CodeBlock
                code={`{
  "registries": {
    "@smoothui": "https://smoothui.dev/r/{name}.json"
  }
}`}
                fileName="components.json"
                lang="json"
              />

              <BodyText>
                <strong>Run the following command</strong> in your project:
              </BodyText>
              <CodeBlock
                code="npx shadcn@latest mcp init --client claude"
                fileName="Terminal"
                lang="shell"
              />

              <BodyText>
                <strong>Restart Claude Code</strong> and try the following
                prompts:
              </BodyText>
              <List className="list-inside">
                <li>Show me the components in the smoothui registry</li>
                <li>
                  Create a landing page using items from the smoothui registry
                </li>
                <li>Install the SiriOrb component from smoothui</li>
              </List>

              <BodyText>
                <strong>Note:</strong> You can use <InlineCode>/mcp</InlineCode>{" "}
                command in Claude Code to debug the MCP server.
              </BodyText>
            </div>
          </TabsContent>

          <TabsContent value="cursor" className="mt-4">
            <div className="space-y-4">
              <BodyText>
                <strong>Configure your registry</strong> in your{" "}
                <InlineCode>components.json</InlineCode> file:
              </BodyText>
              <CodeBlock
                code={`{
  "registries": {
    "@smoothui": "https://smoothui.dev/r/{name}.json"
  }
}`}
                fileName="components.json"
                lang="json"
              />

              <BodyText>
                <strong>Run the following command</strong> in your project:
              </BodyText>
              <CodeBlock
                code="npx shadcn@latest mcp init --client cursor"
                fileName="Terminal"
                lang="shell"
              />

              <BodyText>
                Open <strong>Cursor Settings</strong> and{" "}
                <strong>Enable the MCP server</strong> for shadcn. Then try the
                following prompts:
              </BodyText>
              <List className="list-inside">
                <li>Show me the components in the smoothui registry</li>
                <li>
                  Create a landing page using items from the smoothui registry
                </li>
                <li>Install the SiriOrb component from smoothui</li>
              </List>
            </div>
          </TabsContent>

          <TabsContent value="vscode" className="mt-4">
            <div className="space-y-4">
              <BodyText>
                <strong>Configure your registry</strong> in your{" "}
                <InlineCode>components.json</InlineCode> file:
              </BodyText>
              <CodeBlock
                code={`{
  "registries": {
    "@smoothui": "https://smoothui.dev/r/{name}.json"
  }
}`}
                fileName="components.json"
                lang="json"
              />

              <BodyText>
                <strong>Run the following command</strong> in your project:
              </BodyText>
              <CodeBlock
                code="npx shadcn@latest mcp init --client vscode"
                fileName="Terminal"
                lang="shell"
              />

              <BodyText>
                Open <InlineCode>.vscode/mcp.json</InlineCode> and click{" "}
                <strong>Start</strong> next to the shadcn server. Then try the
                following prompts with GitHub Copilot:
              </BodyText>
              <List className="list-inside">
                <li>Show me the components in the smoothui registry</li>
                <li>
                  Create a landing page using items from the smoothui registry
                </li>
                <li>Install the SiriOrb component from smoothui</li>
              </List>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Divider orientation="horizontal" className="relative" />
      <div className="space-y-4">
        <Title level={2} tableContent="Example Prompts">
          Example Prompts
        </Title>
        <BodyText>
          Once MCP is configured, you can use these prompts with your AI
          assistant:
        </BodyText>

        <div className="space-y-4">
          <div className="bg-primary/50 rounded-lg border p-4">
            <Title level={3} className="mb-2">
              Component Discovery
            </Title>
            <List className="list-inside">
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
            </List>
          </div>

          <div className="bg-primary/50 rounded-lg border p-4">
            <Title level={3} className="mb-2">
              Component Installation
            </Title>
            <List className="list-inside">
              <li>&ldquo;Install the SiriOrb component from smoothui&rdquo;</li>
              <li>&ldquo;Add the RichPopover component to my project&rdquo;</li>
              <li>
                &ldquo;Install multiple components: SiriOrb, AnimatedInput, and
                ScrollableCardStack&rdquo;
              </li>
            </List>
          </div>

          <div className="bg-primary/50 rounded-lg border p-4">
            <Title level={3} className="mb-2">
              Component Usage
            </Title>
            <List className="list-inside">
              <li>
                &ldquo;Create a landing page using the SiriOrb component&rdquo;
              </li>
              <li>
                &ldquo;Show me how to use the ScrollableCardStack
                component&rdquo;
              </li>
              <li>&ldquo;Build a dashboard with smoothui components&rdquo;</li>
            </List>
          </div>
        </div>
      </div>
      <Divider orientation="horizontal" className="relative" />
      <div className="space-y-4">
        <Title level={2} tableContent="SmoothUI MCP Features">
          SmoothUI MCP Features
        </Title>
        <BodyText>
          SmoothUI registry is fully MCP-compatible and includes:
        </BodyText>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-primary/50 rounded-lg border p-4">
            <Title level={3} className="mb-2">
              Component Discovery
            </Title>
            <BodyText>
              AI assistants can discover all available SmoothUI components and
              their descriptions.
            </BodyText>
          </div>

          <div className="bg-primary/50 rounded-lg border p-4">
            <Title level={3} className="mb-2">
              Automatic Installation
            </Title>
            <BodyText>
              Components are installed with all dependencies and utilities
              automatically included.
            </BodyText>
          </div>

          <div className="bg-primary/50 rounded-lg border p-4">
            <Title level={3} className="mb-2">
              Smart Dependencies
            </Title>
            <BodyText>
              Required packages like <InlineCode>clsx</InlineCode> and{" "}
              <InlineCode>tailwind-merge</InlineCode> are automatically detected
              and included.
            </BodyText>
          </div>

          <div className="bg-primary/50 rounded-lg border p-4">
            <Title level={3} className="mb-2">
              Usage Examples
            </Title>
            <BodyText>
              AI assistants can provide usage examples and help integrate
              components into your projects.
            </BodyText>
          </div>
        </div>
      </div>
      <Divider orientation="horizontal" className="relative" />
      <div className="space-y-4">
        <Title level={2} tableContent="Learn More">
          Learn More
        </Title>
        <BodyText>
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
        </BodyText>
      </div>
    </div>
  )
}
