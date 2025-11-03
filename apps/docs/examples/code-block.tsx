"use client";

import {
  CodeBlock,
  CodeBlockBody,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockFiles,
  CodeBlockHeader,
  CodeBlockItem,
  CodeBlockSelect,
  CodeBlockSelectContent,
  CodeBlockSelectItem,
  CodeBlockSelectTrigger,
  CodeBlockSelectValue,
} from "@repo/smoothui/components/code-block";

const files = [
  {
    language: "tsx",
    filename: "example.tsx",
    code: `import { Button } from "@repo/shadcn-ui/components/ui/button";

export function App() {
  return (
    <div className="p-4">
      <Button>Click me</Button>
    </div>
  );
}
`,
  },
  {
    language: "json",
    filename: "package.json",
    code: `{
  "name": "demo",
  "private": true,
  "dependencies": {
    "@repo/smoothui": "latest"
  }
}`,
  },
];

export default function CodeBlockDemo() {
  return (
    <div className="max-w-3xl">
      <CodeBlock data={files} defaultValue={files[0].language}>
        <CodeBlockHeader>
          <CodeBlockFiles>
            {(item) => (
              <CodeBlockFilename key={item.language} value={item.language}>
                {item.filename}
              </CodeBlockFilename>
            )}
          </CodeBlockFiles>

          <div className="ml-auto flex items-center gap-2">
            <CodeBlockSelect>
              <CodeBlockSelectTrigger>
                <CodeBlockSelectValue />
              </CodeBlockSelectTrigger>
              <CodeBlockSelectContent>
                {(item) => (
                  <CodeBlockSelectItem
                    key={item.language}
                    value={item.language}
                  >
                    {item.language}
                  </CodeBlockSelectItem>
                )}
              </CodeBlockSelectContent>
            </CodeBlockSelect>

            <CodeBlockCopyButton aria-label="Copy code" />
          </div>
        </CodeBlockHeader>

        <CodeBlockBody>
          {(item) => (
            <CodeBlockItem key={item.language} value={item.language}>
              <CodeBlockContent language={item.language as any}>
                {item.code}
              </CodeBlockContent>
            </CodeBlockItem>
          )}
        </CodeBlockBody>
      </CodeBlock>
    </div>
  );
}
