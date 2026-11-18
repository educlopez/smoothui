/**
 * Viewport screenshots of given routes, for verification evidence.
 *
 * `pnpm capture:posters` recaptures component-index WebPs and rewrites the
 * gallery manifest. `pnpm test:browser` runs the Playwright suite against a
 * server it starts itself. This script does neither: it shoots the routes you
 * name, at 1440x900 and 390x844, against a base URL that is already up
 * (local or production), and only writes files under `--out`.
 *
 *   pnpm verify:capture -- --url http://127.0.0.1:3000 --routes /,/docs/components --out ./evidence
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { type BrowserContext, chromium } from "@playwright/test";

const DESKTOP = { height: 900, id: "desktop", width: 1440 } as const;
const MOBILE = { height: 844, id: "mobile", width: 390 } as const;
const VIEWPORTS = [DESKTOP, MOBILE] as const;

/** Entrance motion starts at opacity 0. Posters wait this long; so do we. */
const SETTLE_MS = 1200;
const GOTO_TIMEOUT_MS = 60_000;
const NETWORK_IDLE_MS = 4000;

const UNSAFE_FILENAME = /[^a-zA-Z0-9]+/g;
const EDGE_DASH = /^-+|-+$/g;

interface ShotRecord {
  file: string;
  route: string;
  status: number;
  viewport: string;
}

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const readFlag = (name: string): string | undefined => {
  const index = process.argv.indexOf(`--${name}`);
  if (index === -1) {
    return;
  }
  const value = process.argv[index + 1];
  if (!value || value.startsWith("--")) {
    return;
  }
  return value;
};

class CaptureUsageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CaptureUsageError";
  }
}

function failUsage(message: string): never {
  process.stderr.write(`${message}\n`);
  throw new CaptureUsageError(message);
}

function usage(): never {
  failUsage(
    "usage: pnpm verify:capture -- --url <base> --routes <a,b> --out <dir>"
  );
}

const routeSlug = (route: string): string => {
  const withoutHash = route.split("#")[0] ?? route;
  const path = withoutHash.split("?")[0] ?? withoutHash;
  const query = withoutHash.includes("?")
    ? (withoutHash.split("?")[1] ?? "")
    : "";
  const base = path.replace(/^\/+|\/+$/g, "") || "home";
  const raw = query ? `${base}-${query}` : base;
  const slug = raw.replace(UNSAFE_FILENAME, "-").replace(EDGE_DASH, "");
  return slug || "route";
};

const parseBase = (value: string): URL => {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    failUsage(`--url is not a URL: ${value}`);
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    failUsage(`--url must be http or https: ${value}`);
  }
  return url;
};

const targetFor = (base: URL, route: string): string => {
  if (route.startsWith("http://") || route.startsWith("https://")) {
    return route;
  }
  const path = route.startsWith("/") ? route : `/${route}`;
  return new URL(path, base).href;
};

const shoot = async (
  context: BrowserContext,
  target: string,
  file: string
): Promise<number> => {
  const page = await context.newPage();
  try {
    const response = await page.goto(target, {
      timeout: GOTO_TIMEOUT_MS,
      waitUntil: "load",
    });
    const status = response?.status() ?? 0;
    await page
      .waitForLoadState("networkidle", { timeout: NETWORK_IDLE_MS })
      .catch(() => undefined);
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    await wait(SETTLE_MS);
    await page.screenshot({ fullPage: false, path: file, type: "png" });
    return status;
  } finally {
    await page.close();
  }
};

const main = async (): Promise<void> => {
  if (process.argv.includes("--help")) {
    usage();
  }

  const urlFlag = readFlag("url");
  const routesFlag = readFlag("routes");
  const outFlag = readFlag("out");
  if (!urlFlag) {
    usage();
  }
  if (!routesFlag) {
    usage();
  }
  if (!outFlag) {
    usage();
  }

  const base = parseBase(urlFlag);
  const routes = routesFlag
    .split(",")
    .map((route) => route.trim())
    .filter((route) => route.length > 0);
  if (routes.length === 0) {
    usage();
  }

  mkdirSync(outFlag, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const shots: ShotRecord[] = [];
  const failures: string[] = [];

  try {
    for (const route of routes) {
      const target = targetFor(base, route);
      const slug = routeSlug(route);
      for (const viewport of VIEWPORTS) {
        const fileName = `${slug}.${viewport.id}.png`;
        const file = join(outFlag, fileName);
        const context = await browser.newContext({
          hasTouch: viewport.id === "mobile",
          isMobile: viewport.id === "mobile",
          reducedMotion: "reduce",
          viewport: { height: viewport.height, width: viewport.width },
        });
        try {
          const status = await shoot(context, target, file);
          shots.push({
            file: fileName,
            route,
            status,
            viewport: viewport.id,
          });
          process.stdout.write(`${file} ${status}\n`);
          if (status < 200 || status >= 400) {
            failures.push(`${target} ${viewport.id} HTTP ${status}`);
          }
        } catch (error) {
          const message =
            error instanceof Error ? error.message : String(error);
          failures.push(`${target} ${viewport.id}: ${message}`);
          process.stderr.write(`${target} ${viewport.id}: ${message}\n`);
        } finally {
          await context.close();
        }
      }
    }
  } finally {
    await browser.close();
  }

  writeFileSync(
    join(outFlag, "manifest.json"),
    `${JSON.stringify(
      {
        capturedAt: new Date().toISOString(),
        shots,
        url: base.origin,
      },
      null,
      2
    )}\n`
  );

  if (failures.length > 0) {
    process.stderr.write(`${failures.join("\n")}\n`);
    process.exit(1);
  }
};

try {
  await main();
} catch (error) {
  if (error instanceof CaptureUsageError) {
    process.exit(2);
  }
  throw error;
}
