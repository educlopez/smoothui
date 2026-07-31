import { readFile } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";

import { domain } from "@docs/lib/domain";

import { PreviewRender } from "./render";
import { PreviewShell } from "./shell";

interface PreviewProps {
  className?: string;
  path: string;
  type?: "component" | "block";
}

// Blocks reach the shared folder from different depths — `../shared` from a
// group, `../../shared` from inside a block — so the hop count has to be open.
const SHARED_IMPORT_REGEX =
  /import\s+\{([^}]+)\}\s+from\s+["'](?:\.\.\/)+shared["']/;
const REPO_SHADCN_IMPORT_REGEX = /@repo\/shadcn-ui\//g;
const REPO_SMOOTHUI_IMPORT_REGEX = /@repo\/smoothui\//g;
const REPO_ROOT_IMPORT_REGEX = /@repo\//g;
const TYPOGRAPHY_IMPORT_REGEX =
  /^import\s+["']@\/components\/ui\/smoothui\/typography["'];?\n?/gm;
const REPO_COMPONENT_IMPORT_REGEX = /@repo\/smoothui\/components\/([^'"`]+)/g;
const LOCAL_COMPONENT_IMPORT_REGEX = /@\/components\/ui\/smoothui\/([^'"`]+)/g;
// Blocks are grouped on disk — `blocks/headers/header-1` — so the capture has to
// keep the slash. Stopping at the first one resolved every hero to
// `blocks/headers/index.tsx`, which does not exist, and the source silently came
// back empty.
const BLOCK_IMPORT_REGEX = /@repo\/smoothui\/blocks\/([^'"`]+)/g;
// Templates were missing from this list entirely, so a template's own source —
// and therefore every component it composes — never resolved.
const TEMPLATE_IMPORT_REGEX = /@repo\/smoothui\/templates\/([^'"`]+)/g;
const FILE_EXTENSION_REGEX = /\.(tsx|ts|jsx|js)$/;
const SHADCN_UI_IMPORT_REGEX = /@repo\/shadcn-ui\/components\/ui\/([\w-]+)/g;

// Map component names (PascalCase) to file names (kebab-case)
const COMPONENT_NAME_MAP: Record<string, string> = {
  AnimatedGroup: "animated-group",
  AnimatedText: "animated-text",
  HeroHeader: "hero-header",
};

async function addSharedComponents(
  blockSource: string,
  sourceComponents: SourceComponent[]
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
      const sharedPath = join(
        SMOOTHUI_ROOT,
        "blocks",
        "shared",
        `${fileName}.tsx`
      );
      const sharedSource = await readFile(sharedPath, "utf-8");

      if (!sourceComponents.some((s) => s.name === `shared/${fileName}`)) {
        sourceComponents.push({
          name: `shared/${fileName}`,
          source: sharedSource,
          target: toInstallTarget(sharedPath),
        });
      }
    } catch {
      // skip if shared component not found
    }
  }
}

interface SourceComponent {
  name: string;
  source: string;
  /** Where the registry writes this file, e.g. `components/smoothui/header-1/index.tsx`. */
  target: string;
}

/**
 * Repo path → the path the file lands at after installing.
 *
 * Mirrors `lib/package.ts`, which targets every package at
 * `components/smoothui/<package>/`. Blocks are grouped a level deeper on disk
 * (`blocks/headers/header-1`), and the group is a repo detail that does not
 * survive installation, so it is dropped.
 */
const toInstallTarget = (absolutePath: string) => {
  if (absolutePath.startsWith(SHADCN_UI_ROOT)) {
    return relative(SHADCN_UI_ROOT, absolutePath).replace(/\\/g, "/");
  }

  const segments = relative(SMOOTHUI_ROOT, absolutePath)
    .replace(/\\/g, "/")
    .split("/");

  // Drop the `blocks`/`components` root, then the group folder blocks add.
  const withoutRoot = segments.slice(1);
  const withoutGroup =
    segments[0] === "blocks" && withoutRoot.length > 2
      ? withoutRoot.slice(1)
      : withoutRoot;

  return `components/smoothui/${withoutGroup.join("/")}`;
};

interface GatherSourceArgs {
  code: string;
  parsedCode: string;
  path: string;
  type: "component" | "block";
}

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

// `.css` belongs here: a block that imports a CSS module does not work without
// it, so leaving it out of the tree hid a file the user has to copy.
const RELATIVE_SOURCE_EXTENSIONS = [".tsx", ".ts", ".jsx", ".js", ".css"];
const SOURCE_EXTENSION_REGEX = /\.(tsx|ts|jsx|js)$/;
const SMOOTHUI_ROOT = join(process.cwd(), "..", "..", "packages", "smoothui");
const SHADCN_UI_ROOT = join(process.cwd(), "..", "..", "packages", "shadcn-ui");

const readFirstExisting = async (filePaths: string[]) => {
  for (const filePath of filePaths) {
    const source = await readOptionalFile(filePath);

    if (source) {
      return { path: filePath, source };
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
    options?: { prepend?: boolean; target?: string }
  ) => void;
  processedFilePaths: Set<string>;
}) => {
  const importMatches = new Set<string>();
  RELATIVE_IMPORT_REGEX.lastIndex = 0;
  let match = RELATIVE_IMPORT_REGEX.exec(source);

  while (match) {
    const [, specifier] = match;
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

    // A block reaching `../../shared` used to be dropped for leaving its own
    // folder, which is exactly the file the user is most likely to be missing.
    // The bound that matters is the workspace, not the package.
    if (!resolvedPath.startsWith(SMOOTHUI_ROOT)) {
      continue;
    }

    processedFilePaths.add(resolvedPath);

    const relativePath = relative(baseDir, resolvedPath).replace(/\\/g, "/");
    const displayName = relativePath.startsWith("..")
      ? removeExtension(
          relative(SMOOTHUI_ROOT, resolvedPath).replace(/\\/g, "/")
        )
      : `${rootName}/${removeExtension(relativePath)}`;

    addSourceComponent(displayName, resolvedSource, {
      target: toInstallTarget(resolvedPath),
    });

    await collectRelativeSources({
      addSourceComponent,
      baseDir,
      filePath: resolvedPath,
      processedFilePaths,
      rootName,
      source: resolvedSource,
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
    options: { prepend?: boolean; target?: string } = {}
  ) => {
    if (sourceComponents.some((component) => component.name === name)) {
      return;
    }

    const entry = {
      name,
      source,
      target: options.target ?? `components/smoothui/${name}/index.tsx`,
    };

    if (options.prepend) {
      sourceComponents.unshift(entry);
      return;
    }

    sourceComponents.push(entry);
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
      addSourceComponent(component, source, {
        target: toInstallTarget(sourcePath),
      });
      await collectRelativeSources({
        addSourceComponent,
        baseDir: dirname(sourcePath),
        filePath: sourcePath,
        processedFilePaths,
        rootName: component,
        source,
      });
    }
  }

  // Matched against the original source, not the rewritten one: `parsedCode` has
  // already turned `@repo/smoothui/…` into `@/components/smoothui/…`, so this
  // pattern could never match it and every block came back without its source.
  const blockNames = extractImportNames(code, BLOCK_IMPORT_REGEX);

  for (const blockName of blockNames) {
    const blockPath = join(
      process.cwd(),
      "..",
      "..",
      "packages",
      "smoothui",
      "blocks",
      blockName,
      "index.tsx"
    );
    const source = await readOptionalFile(blockPath);

    if (source) {
      processedFilePaths.add(blockPath);
      // The group is how the repo files them, not what the block is called.
      addSourceComponent(blockName.split("/").pop() ?? blockName, source, {
        target: toInstallTarget(blockPath),
      });
      await collectRelativeSources({
        addSourceComponent,
        baseDir: dirname(blockPath),
        filePath: blockPath,
        processedFilePaths,
        rootName: blockName,
        source,
      });
      await addSharedComponents(source, sourceComponents);
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
      addSourceComponent(component, source, {
        target: toInstallTarget(componentPath),
      });
      await collectRelativeSources({
        addSourceComponent,
        baseDir: dirname(componentPath),
        filePath: componentPath,
        processedFilePaths,
        rootName: component,
        source,
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
      addSourceComponent(path, blockSource, {
        prepend: true,
        target: toInstallTarget(blockFilePath),
      });
      await collectRelativeSources({
        addSourceComponent,
        baseDir: dirname(blockFilePath),
        filePath: blockFilePath,
        processedFilePaths,
        rootName: path,
        source: blockSource,
      });
      await addSharedComponents(blockSource, sourceComponents);
    }
  }

  const templateNames = extractImportNames(code, TEMPLATE_IMPORT_REGEX);

  for (const templateName of templateNames) {
    const templatePath = join(
      SMOOTHUI_ROOT,
      "templates",
      templateName,
      "index.tsx"
    );
    const source = await readOptionalFile(templatePath);

    if (!source) {
      continue;
    }

    processedFilePaths.add(templatePath);
    addSourceComponent(templateName, source, {
      target: toInstallTarget(templatePath),
    });
    await collectRelativeSources({
      addSourceComponent,
      baseDir: dirname(templatePath),
      filePath: templatePath,
      processedFilePaths,
      rootName: templateName,
      source,
    });

    // A template composes registry components by their workspace path, so the
    // list has to be gathered from the template's files, not from the example
    // that renders it.
    const composed = extractImportNames(
      [source, ...sourceComponents.map((entry) => entry.source)].join("\n"),
      REPO_COMPONENT_IMPORT_REGEX
    ).map(stripExtension);

    for (const component of composed) {
      const basePath = join(SMOOTHUI_ROOT, "components", component);
      const resolved = await readFirstExisting([
        `${basePath}.tsx`,
        join(basePath, "index.tsx"),
      ]);

      if (resolved) {
        processedFilePaths.add(resolved.path);
        addSourceComponent(component, resolved.source, {
          target: toInstallTarget(resolved.path),
        });
      }
    }
  }

  // shadcn primitives last: a block's Button and Card are files the user needs
  // too, and the tree was showing our source while silently dropping theirs.
  const shadcnNames = extractImportNames(
    [code, ...sourceComponents.map((component) => component.source)].join("\n"),
    SHADCN_UI_IMPORT_REGEX
  );

  for (const name of shadcnNames) {
    const uiPath = join(SHADCN_UI_ROOT, "components", "ui", `${name}.tsx`);
    const source = await readOptionalFile(uiPath);

    if (source) {
      addSourceComponent(`ui/${name}`, source, {
        target: toInstallTarget(uiPath),
      });
    }
  }

  return sourceComponents;
};

/**
 * Everything a preview needs, read once on the server.
 *
 * Split out of `Preview` so the docs page can lay the same three pieces out
 * differently — stacked in the MDX flow, or split with a sticky preview column —
 * without reading and resolving the sources twice.
 */
export const loadPreview = async ({
  path,
  type = "component",
}: Omit<PreviewProps, "className">) => {
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

  return { Component, parsedCode, sourceComponents };
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
      registryUrl={type === "block" ? `${domain}/r/${path}.json` : undefined}
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
