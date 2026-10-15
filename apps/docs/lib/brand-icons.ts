// Brand marks for prose mentions in the docs (see brand-mark.tsx).
// Single-colour glyphs, drawn in currentColor. Paths come from each project's
// published logo (Simple Icons, and base-ui.com for Base UI).

export interface BrandIcon {
  paths: readonly string[];
  viewBox: string;
}

export const BRAND_ICONS = {
  "base-ui": {
    paths: [
      "M9.5001 7.01537C9.2245 6.99837 9 7.22385 9 7.49999V23C13.4183 23 17 19.4183 17 15C17 10.7497 13.6854 7.27351 9.5001 7.01537Z",
      "M8 9.8V12V23C3.58172 23 0 19.0601 0 14.2V12V1C4.41828 1 8 4.93989 8 9.8Z",
    ],
    viewBox: "0 0 17 24",
  },
  nextjs: {
    paths: [
      "M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z",
    ],
    viewBox: "0 0 24 24",
  },
  radix: {
    paths: [
      "M11.52 24a7.68 7.68 0 0 1-7.68-7.68 7.68 7.68 0 0 1 7.68-7.68V24Zm0-24v7.68H3.84V0h7.68Zm4.8 7.68a3.84 3.84 0 1 1 0-7.68 3.84 3.84 0 0 1 0 7.68Z",
    ],
    viewBox: "3.84 0 16.32 24",
  },
  shadcn: {
    paths: [
      "M22.219 11.784 11.784 22.219c-.407.407-.407 1.068 0 1.476.407.407 1.068.407 1.476 0L23.695 13.26c.407-.408.407-1.069 0-1.476-.408-.407-1.069-.407-1.476 0ZM20.132.305.305 20.132c-.407.407-.407 1.068 0 1.476.408.407 1.069.407 1.476 0L21.608 1.781c.407-.407.407-1.068 0-1.476-.408-.407-1.069-.407-1.476 0Z",
    ],
    viewBox: "0 0 24 24",
  },
} as const satisfies Record<string, BrandIcon>;

export type BrandKey = keyof typeof BRAND_ICONS;
