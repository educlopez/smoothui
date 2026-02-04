# smoothui-cli

CLI to install [SmoothUI](https://smoothui.dev) components - beautifully designed React components with smooth animations.

## Installation

```bash
npx smoothui-cli add siri-orb
```

## Usage

### Add components

```bash
# Add a single component
npx smoothui-cli add siri-orb

# Add multiple components
npx smoothui-cli add siri-orb grid-loader animated-tabs

# Interactive mode - browse and select
npx smoothui-cli add
```

### List components

```bash
# Show all available components
npx smoothui-cli list

# JSON output
npx smoothui-cli list --json
```

### Options

```bash
# Custom install path
npx smoothui-cli add siri-orb --path src/components/ui

# Force overwrite existing files
npx smoothui-cli add siri-orb --force
```

## Features

- Interactive component picker with search and categories
- Auto-detects package manager (npm, pnpm, yarn, bun)
- Auto-detects component paths and tsconfig aliases
- Shows dependency tree before installation
- Handles file conflicts with overwrite prompts
- Auto-installs npm dependencies

## Alternative: shadcn CLI

You can also use the shadcn CLI with the `@smoothui` registry:

```bash
npx shadcn@latest add @smoothui/siri-orb
```

## Links

- [Documentation](https://smoothui.dev)
- [Components](https://smoothui.dev/docs/components)
- [GitHub](https://github.com/educlopez/smoothui)

## License

MIT
