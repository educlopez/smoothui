import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/shadcn-ui/components/ui/tabs";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { BoxIcon, CodeIcon, EyeIcon } from "lucide-react";
import { PreviewCode } from "./code";
import { PreviewContent } from "./content";
import { PreviewRender } from "./render";
import { PreviewSource } from "./source";

type PreviewProps = {
  path: string;
  className?: string;
  type?: "component" | "block";
};

const SHARED_IMPORT_REGEX =
  /import\s+\{([^}]+)\}\s+from\s+["']\.\.\/shared["']/;

// Map component names (PascalCase) to file names (kebab-case)
const COMPONENT_NAME_MAP: Record<string, string> = {
  HeroHeader: "hero-header",
  AnimatedText: "animated-text",
  AnimatedGroup: "animated-group",
};

async function addSharedComponents(
  blockSource: string,
  sourceComponents: { name: string; source: string }[]
) {
  const sharedImportMatch = blockSource.match(SHARED_IMPORT_REGEX);

  if (!sharedImportMatch) {
    return;
  }

  const importedComponents = sharedImportMatch[1]
    .split(",")
    .map((c) => c.trim())
    .filter((c) => !c.startsWith("type "));

  for (const component of importedComponents) {
    const fileName = COMPONENT_NAME_MAP[component] || component.toLowerCase();

    try {
      const sharedSource = await readFile(
        join(
          process.cwd(),
          "..",
          "..",
          "packages",
          "smoothui",
          "blocks",
          "shared",
          `${fileName}.tsx`
        ),
        "utf-8"
      );

      if (!sourceComponents.some((s) => s.name === `shared/${fileName}`)) {
        sourceComponents.push({
          name: `shared/${fileName}`,
          source: sharedSource,
        });
      }
    } catch {
      // skip if shared component not found
    }
  }
}

export const Preview = async ({
  path,
  className,
  type = "component",
}: PreviewProps) => {
  const code = await readFile(
    join(process.cwd(), "examples", `${path}.tsx`),
    "utf-8"
  );

  const Component = await import(`../../examples/${path}.tsx`).then(
    (module) => module.default
  );

  const parsedCode = code
    .replace(/@repo\/shadcn-ui\//g, "@/")
    .replace(/@repo\//g, "@/components/smoothui/")

    // Remove typography import
    .replace(
      /^import\s+["']@\/components\/ui\/smoothui\/typography["'];?\n?/gm,
      ""
    );

  const sourceComponentNames =
    parsedCode
      .match(/@\/components\/ui\/smoothui\/([^'"`]+)/g)
      ?.map((match) => match.replace("@/components/smoothui/", "")) || [];

  // Also check for block imports
  const blockNames =
    parsedCode
      .match(/@repo\/smoothui\/blocks\/([^'"`/]+)/g)
      ?.map((match) => match.replace("@repo/smoothui/blocks/", "")) || [];

  const sourceComponents: { name: string; source: string }[] = [];

  // Add block sources
  for (const blockName of blockNames) {
    try {
      const source = await readFile(
        join(
          process.cwd(),
          "..",
          "..",
          "packages",
          "smoothui",
          "blocks",
          blockName,
          "index.tsx"
        ),
        "utf-8"
      );

      if (sourceComponents.some((s) => s.name === blockName)) {
        continue;
      }

      sourceComponents.push({ name: blockName, source });
    } catch {
      // skip blocks that fail
    }
  }

  // Add component sources
  for (const component of sourceComponentNames) {
    const fileName = component.includes("/")
      ? `${component}.tsx`
      : `${component}/index.tsx`;

    try {
      const source = await readFile(
        join(
          process.cwd(),
          "..",
          "..",
          "packages",
          "smoothui",
          "components",
          fileName
        ),
        "utf-8"
      );

      if (sourceComponents.some((s) => s.name === component)) {
        continue;
      }

      sourceComponents.push({ name: component, source });
    } catch {
      // skip packages that fail
    }
  }

  // For blocks, also include the block itself and its shared dependencies
  if (type === "block" && !sourceComponents.some((s) => s.name === path)) {
    try {
      const blockSource = await readFile(
        join(
          process.cwd(),
          "..",
          "..",
          "packages",
          "smoothui",
          "blocks",
          path,
          "index.tsx"
        ),
        "utf-8"
      );
      sourceComponents.unshift({ name: path, source: blockSource });

      // Detect shared component imports and add them to source components
      await addSharedComponents(blockSource, sourceComponents);
    } catch {
      // skip if block source not found
    }
  }

  return (
    <div
      className={cn(
        "not-prose size-full overflow-hidden rounded-lg border bg-background",
        type === "block" &&
          "h-auto min-h-[32rem] prose-code:border-none prose-code:p-0",
        type === "component" && "h-[32rem]",
        className
      )}
    >
      <Tabs className="size-full gap-0" defaultValue="preview">
        <TabsList className="w-full rounded-none border-b">
          {sourceComponents.length > 0 && (
            <TabsTrigger value="source">
              <BoxIcon className="text-muted-foreground" size={16} />
              Source
            </TabsTrigger>
          )}
          <TabsTrigger value="code">
            <CodeIcon className="text-muted-foreground" size={16} />
            Code
          </TabsTrigger>
          <TabsTrigger value="preview">
            <EyeIcon className="text-muted-foreground" size={16} />
            Preview
          </TabsTrigger>
        </TabsList>
        {sourceComponents.length > 0 && (
          <TabsContent
            className="not-prose size-full overflow-y-auto bg-background"
            value="source"
          >
            <PreviewSource source={sourceComponents} />
          </TabsContent>
        )}
        <TabsContent
          className="size-full overflow-y-auto bg-background"
          value="code"
        >
          <PreviewCode code={parsedCode} filename="index.tsx" language="tsx" />
        </TabsContent>
        <TabsContent
          className={cn(
            "not-prose not-fumadocs-codeblock",
            type === "component"
              ? "size-full overflow-hidden"
              : "h-auto overflow-auto"
          )}
          value="preview"
        >
          <PreviewContent type={type}>
            {type === "block" ? (
              <Component />
            ) : (
              <PreviewRender>
                <Component />
              </PreviewRender>
            )}
          </PreviewContent>
        </TabsContent>
      </Tabs>
    </div>
  );
};
