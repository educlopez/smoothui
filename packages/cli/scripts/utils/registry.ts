import { REGISTRY_URL } from "../constants.js";
import type { Registry, RegistryItem } from "../types.js";

const registryUrl = process.env.SMOOTHUI_REGISTRY_URL || REGISTRY_URL;
const REGISTRY_URL_PATTERN = /\/r\/([^/]+)\.json$/;

export async function fetchRegistry(): Promise<Registry> {
  const url = `${registryUrl}/r/registry.json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch registry: ${response.status}`);
  }

  return response.json();
}

export async function fetchComponent(name: string): Promise<RegistryItem> {
  const url = `${registryUrl}/r/${name}.json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Component "${name}" not found`);
  }

  return response.json();
}

export function extractNameFromUrl(url: string): string {
  // Extract "animated-border" from "https://smoothui.dev/r/animated-border.json"
  const match = url.match(REGISTRY_URL_PATTERN);
  return match ? match[1] : url;
}

export async function getAvailableComponents(): Promise<string[]> {
  const registry = await fetchRegistry();
  return registry.items.map((item) => item.name);
}
