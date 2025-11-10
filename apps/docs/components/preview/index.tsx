import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { PreviewRender } from "./render";
import { PreviewShell } from "./shell";

type PreviewProps = {
  path: string;
  className?: string;
  type?: "component" | "block";
};

const SHARED_IMPORT_REGEX =
  /import\s+\{([^}]+)\}\s+from\s+["']\.\.\/shared["']/;
const REPO_SHADCN_IMPORT_REGEX = /@repo\/shadcn-ui\//g;
const REPO_SMOOTHUI_IMPORT_REGEX = /@repo\/smoothui\//g;
const REPO_ROOT_IMPORT_REGEX = /@repo\//g;
const TYPOGRAPHY_IMPORT_REGEX =
  /^import\s+["']@\/components\/ui\/smoothui\/typography["'];?\n?/gm;
const REPO_COMPONENT_IMPORT_REGEX = /@repo\/smoothui\/components\/([^'"`]+)/g;
const LOCAL_COMPONENT_IMPORT_REGEX = /@\/components\/ui\/smoothui\/([^'"`]+)/g;
const BLOCK_IMPORT_REGEX = /@repo\/smoothui\/blocks\/([^'"`/]+)/g;
const FILE_EXTENSION_REGEX = /\.(tsx|ts|jsx|js)$/;

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

type SourceComponent = { name: string; source: string };

type GatherSourceArgs = {
  code: string;
  parsedCode: string;
  type: "component" | "block";
  path: string;
};

const stripExtension = (value: string) =>
  value.replace(FILE_EXTENSION_REGEX, "");

const extractImportNames = (input: string, regex: RegExp) => {
  const matches = new Set<string>();
  const globalRegex = new RegExp(regex.source, regex.flags);
  let match = globalRegex.exec(input);

  while (match) {
    matches.add(match[1]);
    match = globalRegex.exec(input);
  }

  return [...matches];
};

const readOptionalFile = async (filePath: string) => {
  try {
    return await readFile(filePath, "utf-8");
  } catch {
    return null;
  }
};

const readFirstExisting = async (filePaths: string[]) => {
  for (const filePath of filePaths) {
    const source = await readOptionalFile(filePath);

    if (source) {
      return source;
    }
  }

  return null;
};

const gatherSourceComponents = async ({
  code,
  parsedCode,
  type,
  path,
}: GatherSourceArgs) => {
  const sourceComponents: SourceComponent[] = [];
  const addSourceComponent = (
    name: string,
    source: string,
    options: { prepend?: boolean } = {}
  ) => {
    if (sourceComponents.some((component) => component.name === name)) {
      return;
    }

    if (options.prepend) {
      sourceComponents.unshift({ name, source });
      return;
    }

    sourceComponents.push({ name, source });
  };

  const repoComponentNames = extractImportNames(
    code,
    REPO_COMPONENT_IMPORT_REGEX
  ).map(stripExtension);

  for (const component of repoComponentNames) {
    const basePath = join(
      process.cwd(),
      "..",
      "..",
      "packages",
      "smoothui",
      "components",
      component
    );
    const source = await readFirstExisting([
      `${basePath}.tsx`,
      join(basePath, "index.tsx"),
    ]);

    if (source) {
      addSourceComponent(component, source);
    }
  }

  const blockNames = extractImportNames(parsedCode, BLOCK_IMPORT_REGEX);

  for (const blockName of blockNames) {
    const source = await readOptionalFile(
      join(
        process.cwd(),
        "..",
        "..",
        "packages",
        "smoothui",
        "blocks",
        blockName,
        "index.tsx"
      )
    );

    if (source) {
      addSourceComponent(blockName, source);
    }
  }

  const localComponentNames = extractImportNames(
    parsedCode,
    LOCAL_COMPONENT_IMPORT_REGEX
  );

  for (const component of localComponentNames) {
    const fileName = component.includes("/")
      ? `${component}.tsx`
      : `${component}/index.tsx`;
    const source = await readOptionalFile(
      join(
        process.cwd(),
        "..",
        "..",
        "packages",
        "smoothui",
        "components",
        fileName
      )
    );

    if (source) {
      addSourceComponent(component, source);
    }
  }

  if (type === "block" && !sourceComponents.some((s) => s.name === path)) {
    const blockSource = await readOptionalFile(
      join(
        process.cwd(),
        "..",
        "..",
        "packages",
        "smoothui",
        "blocks",
        path,
        "index.tsx"
      )
    );

    if (blockSource) {
      addSourceComponent(path, blockSource, { prepend: true });
      await addSharedComponents(blockSource, sourceComponents);
    }
  }

  return sourceComponents;
};

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
    .replace(REPO_SHADCN_IMPORT_REGEX, "@/")
    .replace(REPO_SMOOTHUI_IMPORT_REGEX, "@/components/smoothui/")
    .replace(REPO_ROOT_IMPORT_REGEX, "@/")
    // Remove typography import
    .replace(TYPOGRAPHY_IMPORT_REGEX, "");

  const sourceComponents = await gatherSourceComponents({
    code,
    parsedCode,
    path,
    type,
  });

  return (
    <PreviewShell
      blockPath={type === "block" ? path : undefined}
      className={className}
      parsedCode={parsedCode}
      sourceComponents={sourceComponents}
      type={type}
    >
      {type === "component" ? (
        <PreviewRender>
          <Component />
        </PreviewRender>
      ) : null}
    </PreviewShell>
  );
};
