# SmoothUI 4.0 registry names

Installing a component used to use the old package name in the registry URL.
Those names now resolve to the current package. Prefer the new name going forward.

| Old name | New name | Install |
| --- | --- | --- |
| `animated-input` | `float-input` | `npx shadcn@latest add https://smoothui.dev/r/float-input.json` |
| `animated-number-input` | `digit-roll` | `npx shadcn@latest add https://smoothui.dev/r/digit-roll.json` |
| `animated-o-t-p-input` | `otp-slots` | `npx shadcn@latest add https://smoothui.dev/r/otp-slots.json` |
| `animated-progress-bar` | `progress` | `npx shadcn@latest add https://smoothui.dev/r/progress.json` |
| `animated-tabs` | `tabs` | `npx shadcn@latest add https://smoothui.dev/r/tabs.json` |
| `animated-toggle` | `morph-toggle` | `npx shadcn@latest add https://smoothui.dev/r/morph-toggle.json` |
| `animated-tooltip` | `tooltip` | `npx shadcn@latest add https://smoothui.dev/r/tooltip.json` |
| `basic-accordion` | `accordion` | `npx shadcn@latest add https://smoothui.dev/r/accordion.json` |
| `basic-dropdown` | `dropdown-menu` | `npx shadcn@latest add https://smoothui.dev/r/dropdown-menu.json` |
| `basic-modal` | `dialog` | `npx shadcn@latest add https://smoothui.dev/r/dialog.json` |
| `basic-toast` | `toast` | `npx shadcn@latest add https://smoothui.dev/r/toast.json` |
| `country-dialog` | `country-picker` | `npx shadcn@latest add https://smoothui.dev/r/country-picker.json` |
| `notification-badge` | `count-badge` | `npx shadcn@latest add https://smoothui.dev/r/count-badge.json` |
| `searchable-dropdown` | `combobox` | `npx shadcn@latest add https://smoothui.dev/r/combobox.json` |
| `skeleton-loader` | `content-skeleton` | `npx shadcn@latest add https://smoothui.dev/r/content-skeleton.json` |

`https://smoothui.dev/r/{old}.json` still returns the new item.

`aria-*` styles (React Aria) are not served yet. `/r/aria-{preset}/{name}.json` returns 404 with `{ "error": "React Aria styles are not supported yet" }` until an Aria twin exists. Use `base-*` or `radix-*` (or `default` / `new-york`) instead.
