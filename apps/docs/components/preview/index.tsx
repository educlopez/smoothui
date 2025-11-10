import { readFile } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";

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

const RELATIVE_IMPORT_REGEX =
  /import\s+(?:type\s+)?(?:[\w*\s{},$]+from\s+)?["'](\.[^"']+)["']/g;

const RELATIVE_SOURCE_EXTENSIONS = [".tsx", ".ts", ".jsx", ".js"];
const SOURCE_EXTENSION_REGEX = /\.(tsx|ts|jsx|js)$/;

const readFirstExisting = async (filePaths: string[]) => {
  for (const filePath of filePaths) {
    const source = await readOptionalFile(filePath);

    if (source) {
      return { source, path: filePath };
    }
  }

  return null;
};

const stripQueryFromImport = (importPath: string) =>
  importPath.split("?", 1)[0];

const removeExtension = (filePath: string) =>
  filePath.replace(SOURCE_EXTENSION_REGEX, "");

const resolveRelativeImportPath = async (
  baseDir: string,
  importSpecifier: string
) => {
  const sanitizedSpecifier = stripQueryFromImport(importSpecifier);
  const specifierExtension = extname(sanitizedSpecifier);

  if (
    specifierExtension &&
    !RELATIVE_SOURCE_EXTENSIONS.includes(specifierExtension)
  ) {
    return null;
  }

  const hasExtension =
    specifierExtension !== "" &&
    RELATIVE_SOURCE_EXTENSIONS.includes(specifierExtension);

  const candidates: string[] = [];

  if (hasExtension) {
    candidates.push(resolve(baseDir, sanitizedSpecifier));
  } else {
    for (const extension of RELATIVE_SOURCE_EXTENSIONS) {
      candidates.push(resolve(baseDir, `${sanitizedSpecifier}${extension}`));
    }

    for (const extension of RELATIVE_SOURCE_EXTENSIONS) {
      candidates.push(
        resolve(baseDir, join(sanitizedSpecifier, `index${extension}`))
      );
    }
  }

  for (const candidate of candidates) {
    const source = await readOptionalFile(candidate);

    if (source) {
      return { filePath: candidate, source };
    }
  }

  return null;
};

const collectRelativeSources = async ({
  baseDir,
  filePath,
  rootName,
  source,
  addSourceComponent,
  processedFilePaths,
}: {
  baseDir: string;
  filePath: string;
  rootName: string;
  source: string;
  addSourceComponent: (
    name: string,
    source: string,
    options?: { prepend?: boolean }
  ) => void;
  processedFilePaths: Set<string>;
}) => {
  const importMatches = new Set<string>();
  RELATIVE_IMPORT_REGEX.lastIndex = 0;
  let match = RELATIVE_IMPORT_REGEX.exec(source);

  while (match) {
    const specifier = match[1];
    importMatches.add(specifier);
    match = RELATIVE_IMPORT_REGEX.exec(source);
  }

  for (const importSpecifier of importMatches) {
    const resolved = await resolveRelativeImportPath(
      dirname(filePath),
      importSpecifier
    );

    if (!resolved) {
      continue;
    }

    const { filePath: resolvedPath, source: resolvedSource } = resolved;

    if (processedFilePaths.has(resolvedPath)) {
      continue;
    }

    const relativePath = relative(baseDir, resolvedPath);

    if (relativePath.startsWith("..")) {
      continue;
    }

    processedFilePaths.add(resolvedPath);

    const displayName = `${rootName}/${removeExtension(
      relativePath.replace(/\\/g, "/")
    )}`;

    addSourceComponent(displayName, resolvedSource);

    await collectRelativeSources({
      baseDir,
      filePath: resolvedPath,
      rootName,
      source: resolvedSource,
      addSourceComponent,
      processedFilePaths,
    });
  }
};

const gatherSourceComponents = async ({
  code,
  parsedCode,
  type,
  path,
}: GatherSourceArgs) => {
  const sourceComponents: SourceComponent[] = [];
  const processedFilePaths = new Set<string>();
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
    const resolvedSource = await readFirstExisting([
      `${basePath}.tsx`,
      join(basePath, "index.tsx"),
    ]);

    if (resolvedSource) {
      const { source, path: sourcePath } = resolvedSource;
      processedFilePaths.add(sourcePath);
      addSourceComponent(component, source);
      await collectRelativeSources({
        baseDir: dirname(sourcePath),
        filePath: sourcePath,
        rootName: component,
        source,
        addSourceComponent,
        processedFilePaths,
      });
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
    const componentPath = join(
      process.cwd(),
      "..",
      "..",
      "packages",
      "smoothui",
      "components",
      fileName
    );
    const source = await readOptionalFile(componentPath);

    if (source) {
      processedFilePaths.add(componentPath);
      addSourceComponent(component, source);
      await collectRelativeSources({
        baseDir: dirname(componentPath),
        filePath: componentPath,
        rootName: component,
        source,
        addSourceComponent,
        processedFilePaths,
      });
    }
  }

  if (type === "block" && !sourceComponents.some((s) => s.name === path)) {
    const blockFilePath = join(
      process.cwd(),
      "..",
      "..",
      "packages",
      "smoothui",
      "blocks",
      path,
      "index.tsx"
    );
    const blockSource = await readOptionalFile(blockFilePath);

    if (blockSource) {
      processedFilePaths.add(blockFilePath);
      addSourceComponent(path, blockSource, { prepend: true });
      await collectRelativeSources({
        baseDir: dirname(blockFilePath),
        filePath: blockFilePath,
        rootName: path,
        source: blockSource,
        addSourceComponent,
        processedFilePaths,
      });
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
