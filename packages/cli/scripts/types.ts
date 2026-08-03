export interface RegistryFile {
  content: string;
  path: string;
  target?: string;
  type: "registry:ui" | "registry:style";
}

export interface RegistryItem {
  $schema?: string;
  css?: Record<string, string>;
  dependencies?: string[];
  description?: string;
  devDependencies?: string[];
  files: RegistryFile[];
  name: string;
  registryDependencies?: string[];
  title?: string;
  type: "registry:ui" | "registry:style";
}

export interface Registry {
  homepage: string;
  items: RegistryItem[];
  name: string;
}

export interface TreeNode {
  children: TreeNode[];
  component: RegistryItem;
}

export interface ProjectConfig {
  alias: string;
  componentPath: string;
  packageManager: "npm" | "pnpm" | "yarn" | "bun";
}

export interface Category {
  components: string[];
  name: string;
}
