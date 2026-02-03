# SmoothUI Standalone CLI Design

**Date:** 2026-02-03
**Status:** Approved

## Overview

Create a standalone CLI tool (`npx smoothui add`) that installs SmoothUI components directly without requiring shadcn as a dependency. This complements the existing shadcn registry approach.

## Installation Methods

Users will have two options:

1. **Via shadcn registry**: `npx shadcn add https://smoothui.dev/r/siri-orb.json`
2. **Via smoothui CLI**: `npx smoothui add siri-orb` (standalone)

## Commands

```bash
# Add specific components
npx smoothui add siri-orb
npx smoothui add siri-orb morphing-dialog animated-tabs

# Interactive mode - browse and select
npx smoothui add

# With options
npx smoothui add siri-orb --path src/components/smoothui
npx smoothui add siri-orb --force  # Overwrite existing without asking

# List available components
npx smoothui list
npx smoothui list --json  # Machine-readable output
```

## Features

| Feature | Behavior |
|---------|----------|
| Path detection | Auto-detect existing patterns, ask to confirm |
| Interactive mode | Hybrid search + categorized list |
| npm dependencies | Auto-install with package manager detection |
| Component dependencies | Show dependency tree, then install all |
| Existing files | Prompt for each conflict (overwrite/skip/diff) |
| Import aliases | Auto-detect from tsconfig.json |

## Technical Stack

```json
{
  "@clack/prompts": "^0.11.0",
  "picocolors": "^1.1.1",
  "undici": "^6.0.0"
}
```

**Why this stack:**
- `@clack/prompts` - Beautiful, minimal prompts with spinners
- Custom search component - Built like Vercel's skills CLI for hybrid search+category picker
- `picocolors` - 2KB, faster than chalk, supports 256-color palette
- Raw Node.js readline for keyboard control (no heavy frameworks)

## File Structure

```
scripts/
├── index.ts              # Entry point, command router
├── commands/
│   ├── add.ts            # Add command (core logic)
│   ├── list.ts           # List available components
│   └── init.ts           # Future: explicit init command
├── prompts/
│   ├── search-multiselect.ts   # Custom hybrid picker
│   └── confirm.ts              # Wrapper around @clack/prompts
├── utils/
│   ├── registry.ts       # Fetch from smoothui.dev/r/
│   ├── detect.ts         # Auto-detect paths, aliases, package manager
│   ├── install.ts        # Write files, install deps
│   ├── tree.ts           # Resolve & display dependency tree
│   └── colors.ts         # Picocolors helpers + symbols
└── types.ts              # Shared TypeScript types
```

## Auto-Detection Logic

### Install Path Detection

Priority order:
1. `src/components/ui` (shadcn default)
2. `components/ui` (Next.js common)
3. `src/components` (Generic src)
4. `components` (Root components)
5. `app/components/ui` (App router pattern)

### Alias Detection

Read `tsconfig.json` or `jsconfig.json`, look for paths:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Transform component imports to match user's alias configuration.

### Package Manager Detection

Check lockfiles in priority order:
1. `bun.lockb` → bun
2. `pnpm-lock.yaml` → pnpm
3. `yarn.lock` → yarn
4. `package-lock.json` → npm

Fallback: check `packageManager` field in package.json, then default to npm.

## Dependency Resolution

```typescript
async function resolveTree(componentName: string): Promise<TreeNode> {
  const component = await fetchComponent(componentName);
  const children = await Promise.all(
    component.registryDependencies.map(url => {
      const name = extractName(url);
      return resolveTree(name);
    })
  );
  return { component, children };
}
```

- Fetch from `https://smoothui.dev/r/{name}.json`
- Recursively resolve `registryDependencies`
- Deduplicate with Set to avoid fetching same component twice
- Display tree before installation

## UI Symbols

```
◆  Active prompt
◇  Completed step
●  Selected item
○  Unselected item
❯  Cursor position
✓  Success
✗  Error
│  Vertical connector
```

## Interactive Search Multiselect

Features:
- Raw mode terminal input (`process.stdin.setRawMode(true)`)
- Real-time filtering as user types
- Categories as sections
- Keyboard: `↑↓` navigate, `space` toggle, `enter` confirm, `esc` cancel
- Selected count shown at bottom
- Max 10 visible items with scrolling

Example:
```
◆ Select components to install:
│
│  Search: morphi▌
│
│  Loaders
│    ○ grid-loader
│    ○ spinner-loader
│  Text Effects
│    ○ morphing-text
│  Dialogs
│    ● morphing-dialog
│
│  1 selected │ ↑↓ navigate │ space select │ enter confirm
```

## File Conflict Handling

```
◆ File already exists: siri-orb.tsx
│
│  (o)verwrite - Replace with new version
│  (s)kip      - Keep existing file
│  (d)iff      - Show differences first
│  (a)ll       - Overwrite all conflicts
│
│  Choice: ▌
```

Diff preview shows inline differences if user selects `d`.

## Example User Flows

### Direct Install

```
$ npx smoothui add siri-orb

◆ SmoothUI

◇ Detected: src/components/ui/ (pnpm)

◆ Resolving siri-orb...
│
│  siri-orb
│  └─ npm: motion
│
◆ Install 1 component? (Y/n) y

◇ Written: src/components/ui/siri-orb.tsx
◇ Installed: motion

✓ Done!
```

### Interactive Mode

```
$ npx smoothui add

◆ SmoothUI

◇ Detected: src/components/ui/ (pnpm)

◆ Select components:
│
│  Search: ▌
│
│  Buttons
│    ○ magnetic-button
│    ○ shimmer-button
│  Loaders
│    ○ grid-loader
│    ○ siri-orb
│  Text Effects
│    ○ morphing-text
│    ○ text-shimmer
│
│  0 selected │ ↑↓ navigate │ space select │ enter confirm

[user selects siri-orb and grid-loader]

◇ Selected: siri-orb, grid-loader

◆ Resolving dependencies...
│
│  siri-orb
│  └─ npm: motion
│  grid-loader
│  └─ (no dependencies)
│
◆ Install 2 components? (Y/n) y

◇ Written: src/components/ui/siri-orb.tsx
◇ Written: src/components/ui/grid-loader.tsx
◇ Installed: motion

✓ Done! 2 components installed.
```

## Component Categories

Components will be grouped by type for the interactive picker:

- **Buttons**: magnetic-button, shimmer-button, etc.
- **Loaders**: grid-loader, siri-orb, spinner, etc.
- **Text Effects**: morphing-text, text-shimmer, typewriter, etc.
- **Dialogs**: morphing-dialog, drawer, etc.
- **Inputs**: ai-input, search-input, etc.
- **Navigation**: animated-tabs, dock, etc.
- **Cards**: tilted-card, expandable-card, etc.
- **Effects**: particles, aurora, spotlight, etc.

Categories will be derived from the registry or maintained in a separate mapping.

## Future Enhancements

- `npx smoothui init` - Explicit configuration setup
- `npx smoothui update` - Update installed components
- `npx smoothui diff <component>` - Show what would change
- Offline cache for faster repeated installs
- Config file for persistent preferences
