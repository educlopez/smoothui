export interface RegistryFile {
  path: string;
  content: string;
  type: "registry:ui" | "registry:style";
  target?: string;
}

export interface RegistryItem {
  $schema?: string;
  name: string;
  type: "registry:ui" | "registry:style";
  title?: string;
  description?: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files: RegistryFile[];
  css?: Record<string, string>;
}

export interface Registry {
  name: string;
  homepage: string;
  items: RegistryItem[];
}

export interface TreeNode {
  component: RegistryItem;
  children: TreeNode[];
}

export interface ProjectConfig {
  componentPath: string;
  alias: string;
  packageManager: "npm" | "pnpm" | "yarn" | "bun";
}

export interface Category {
  name: string;
  components: string[];
}
