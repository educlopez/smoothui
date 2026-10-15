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

## v4 primitives

Primitives are the owned building blocks of SmoothUI 4: button, accordion, collapsible, input, field, dialog, and the rest of the catalog under `/docs/primitives`. They wrap a headless library, add Motion microinteractions, and honor `prefers-reduced-motion`. Components, blocks, and templates compose them instead of shipping a parallel hand-built control.

### Base vs Radix style

Each dual primitive has two twins with the same public props:

| Registry URL | Twin |
| --- | --- |
| `https://smoothui.dev/r/{name}.json` | Base (product default) |
| `https://smoothui.dev/r/base-{preset}/{name}.json` | Base |
| `https://smoothui.dev/r/radix-{preset}/{name}.json` | Radix |
| `https://smoothui.dev/r/default/{name}.json` and `https://smoothui.dev/r/new-york/{name}.json` | Radix |

A few primitives are Base-only (for example Input and Field — there is no Input in Radix). Those ship the same file for every served style.

`aria-*` is not a served twin. Requests 404 until an Aria implementation exists.

On the Radix **tabs** twin, render `TabsIndicator` inside `TabsList` — the marker is no longer drawn inside the active tab, so omitting it hides the underline. Activation defaults to **manual** (`activateOnFocus={false}` maps to Radix `activationMode="manual"`). Pass `activateOnFocus` on `TabsList` for automatic activation on focus and arrow keys.

### Install

Configure the registry in `components.json`:

```json
{
  "style": "base-nova",
  "registries": {
    "@smoothui": "https://smoothui.dev/r/{style}/{name}.json"
  }
}
```

Then install a primitive:

```bash
npx shadcn@latest add @smoothui/smooth-button
npx shadcn@latest add @smoothui/accordion
npx shadcn@latest add @smoothui/collapsible
npx shadcn@latest add @smoothui/input
npx shadcn@latest add @smoothui/field
```

Or pin a style in the URL: `npx shadcn@latest add https://smoothui.dev/r/radix-nova/accordion.json`.

Owned primitives install `@base-ui/react` or `radix-ui`. They do not pull shadcn `button` / `dialog` registry dependencies.

### Blocks now depend on primitives

Blocks no longer ship a local button, input, or accordion. They import the primitives so a registry install of a block also installs the matching twin:

| Block | Primitive |
| --- | --- |
| Headers 1–4 | `smooth-button` |
| Footer 2, Footer 3, FAQ 3 | `input` and `field` (newsletter / search) |
| FAQ 1 | Always-visible Q&A cards (no collapsible or accordion; those hide answers) |
| FAQ 2 | `accordion` |
| FAQ 4 | `accordion` for answers; `tabs` for category tabs (`role=tablist`, arrow keys, `aria-controls`) |

A block JSON such as `https://smoothui.dev/r/base-nova/faq-2.json` lists those primitives in `registryDependencies`, style-prefixed when a style is in the request.
