# SmoothUI

![Screenshot of SmoothUI](/apps/docs/public/readme.png)

<div align="center">

![Next.js Badge](https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=fff&style=flat)
![Tailwind CSS Badge](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=fff&style=flat)
![Motion Badge](https://img.shields.io/badge/Motion-ECD53F?style=flat)

[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fpheralb%2Fsvgl%2Fbadge%3Fref%3Dmain&style=flat)](https://actions-badge.atrox.dev/educlopez/smoothui/goto?ref=main)
![GitHub stars](https://img.shields.io/github/stars/educlopez/smoothui)
![GitHub issues](https://img.shields.io/github/issues/educlopez/smoothui)
![GitHub forks](https://img.shields.io/github/forks/educlopez/smoothui)
![GitHub PRs](https://img.shields.io/github/issues-pr/educlopez/smoothui)
[![Website](https://img.shields.io/badge/website-smoothui.dev-blue)](https://smoothui.dev)

</div>

SmoothUI is a collection of beautifully designed components with smooth animations built with React, Tailwind CSS, and Motion. This project aims to provide developers with a set of reusable UI components that enhance user experience through delightful animations and modern design patterns.

## Table of Contents

- [SmoothUI](#smoothui)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Quick Start](#quick-start)
  - [Installation](#installation)
    - [Using SmoothUI CLI](#using-smoothui-cli)
    - [Using shadcn CLI](#using-shadcn-cli)
    - [Manual Installation](#manual-installation)
  - [Usage](#usage)
    - [Basic Usage](#basic-usage)
    - [Advanced Usage](#advanced-usage)
  - [Available Components](#available-components)
    - [UI Components](#ui-components)
    - [Interactive Components](#interactive-components)
    - [Layout Components](#layout-components)
    - [Utility Components](#utility-components)
  - [MCP Support](#mcp-support)
    - [🤖 AI Assistant Integration](#-ai-assistant-integration)
    - [Quick MCP Setup](#quick-mcp-setup)
  - [Registry System](#registry-system)
    - [Automatic Dependencies](#automatic-dependencies)
    - [Component Structure](#component-structure)
    - [Registry Features](#registry-features)
  - [Troubleshooting](#troubleshooting)
    - [Common Issues](#common-issues)
      - [1. Authentication Error (401)](#1-authentication-error-401)
      - [2. Registry Not Found](#2-registry-not-found)
      - [3. Import Path Issues](#3-import-path-issues)
      - [4. Missing Dependencies](#4-missing-dependencies)
    - [Getting Help](#getting-help)
  - [Contributing](#contributing)
    - [Development Setup](#development-setup)
  - [License](#license)

## Features

- **Modern Design System**: A cohesive and contemporary design language with a new mascot called Smoothy
- **Smooth Animations**: Built-in animations powered by Motion for delightful user experiences
- **Responsive Design**: Fully responsive components designed with Tailwind CSS
- **Dark Mode Support**: Components support both light and dark themes out of the box
- **Color Customization**: Dynamic color switcher for easy theme customization
- **Documentation**: Comprehensive documentation with props, examples, and usage guidelines
- **Accessibility**: Enhanced accessibility features across all components
- **TypeScript Support**: Full TypeScript support with type definitions
- **Easy Integration**: Simple API for integrating components into your projects
- **CLI Tools**: Dedicated SmoothUI CLI and shadcn registry support for easy component installation

## Quick Start

Get started with SmoothUI in just one command:

```bash
# Using SmoothUI CLI (recommended)
npx smoothui-cli add siri-orb

# Or using shadcn CLI
npx shadcn@latest add @smoothui/siri-orb
```

Then use the component:

```tsx
import { SiriOrb } from "@/components/smoothui/ui/SiriOrb";

export default function App() {
  return <SiriOrb size="200px" />;
}
```

## Installation

### Using SmoothUI CLI

The SmoothUI CLI provides an interactive way to browse and install components with automatic dependency resolution.

```bash
# Add a single component
npx smoothui-cli add siri-orb

# Add multiple components
npx smoothui-cli add siri-orb rich-popover animated-input

# Interactive mode - browse and select components
npx smoothui-cli add

# List all available components
npx smoothui-cli list
```

**Features:**

- Interactive component picker with search and categories
- Auto-detects package manager (npm, pnpm, yarn, bun)
- Auto-detects component paths and tsconfig aliases
- Shows dependency tree before installation
- Handles file conflicts with overwrite prompts
- Auto-installs npm dependencies

### Using shadcn CLI

SmoothUI is an official shadcn registry, so you can install components directly using the `@smoothui` namespace:

```bash
# Install a single component
npx shadcn@latest add @smoothui/siri-orb

# Install multiple components
npx shadcn@latest add @smoothui/rich-popover @smoothui/animated-input
```

### Manual Installation

If you prefer to install components manually, you can copy the component files directly:

1. **Install dependencies**:

```bash
pnpm add motion tailwindcss lucide-react clsx tailwind-merge
```

2. **Copy component files** from the [components directory](src/components/smoothui/ui/)

3. **Set up utilities**:

```bash
# Create lib/utils/cn.ts
mkdir -p lib/utils
```

```tsx
// lib/utils/cn.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Usage

### Basic Usage

```tsx
import { SiriOrb } from "@/components/smoothui/ui/SiriOrb";

export default function App() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SiriOrb
        size="200px"
        colors={{
          bg: "oklch(95% 0.02 264.695)",
          c1: "oklch(75% 0.15 350)",
          c2: "oklch(80% 0.12 200)",
          c3: "oklch(78% 0.14 280)",
        }}
        animationDuration={20}
      />
    </div>
  );
}
```

### Advanced Usage

```tsx
import { RichPopover } from "@/components/smoothui/ui/RichPopover";
import { ScrollableCardStack } from "@/components/smoothui/ui/ScrollableCardStack";

export default function Dashboard() {
  const cards = [
    {
      id: "1",
      name: "John Doe",
      handle: "@johndoe",
      avatar: "/avatars/john.jpg",
      video: "/videos/john.mp4",
      href: "https://twitter.com/johndoe",
    },
    // ... more cards
  ];

  return (
    <div className="space-y-8">
      <RichPopover />
      <ScrollableCardStack items={cards} />
    </div>
  );
}
```

## Available Components

SmoothUI includes a wide variety of components:

### UI Components

- **SiriOrb** - Animated orb with smooth color transitions
- **RichPopover** - Advanced popover with rich content
- **ScrollableCardStack** - Interactive card stack with smooth scrolling
- **AnimatedInput** - Input field with smooth animations
- **DynamicIsland** - iOS-style dynamic island component
- **FluidMorph** - Fluid morphing animations
- **MatrixCard** - Matrix-style card with particle effects

### Interactive Components

- **CursorFollow** - Custom cursor following component
- **ScrambleHover** - Text scramble effect on hover
- **WaveText** - Animated wave text effect
- **TypewriterText** - Typewriter text animation

### Layout Components

- **ExpandableCards** - Expandable card layout
- **ScrollableCardStack** - Stack of scrollable cards
- **AppDownloadStack** - App download showcase

### Utility Components

- **ButtonCopy** - Copy button with feedback
- **ClipCornersButton** - Button with clipped corners
- **DotMorphButton** - Button with morphing dot animation

[View all components →](https://smoothui.dev)

## MCP Support

SmoothUI is fully compatible with the **shadcn MCP server**, enabling AI assistants to discover and install components automatically.

### 🤖 AI Assistant Integration

With MCP support, AI assistants like **Claude**, **Cursor**, and **GitHub Copilot** can:

- **Discover Components**: Browse all available SmoothUI components
- **Install Components**: Automatically install components with dependencies
- **Provide Usage Examples**: Get code examples and integration help
- **Smart Suggestions**: Receive intelligent component recommendations

### Quick MCP Setup

1. **Configure your registry** in `components.json`:

```json
{
  "registries": {
    "@smoothui": "https://smoothui.dev/r/{name}.json"
  }
}
```

2. **Install MCP server**:

```bash
npx shadcn@latest mcp init --client claude
# or for Cursor: npx shadcn@latest mcp init --client cursor
# or for VS Code: npx shadcn@latest mcp init --client vscode
```

3. **Try these prompts**:

- "Show me the components in the smoothui registry"
- "Install the SiriOrb component from smoothui"
- "Create a landing page using smoothui components"

[Learn more about MCP support →](https://smoothui.dev/doc/mcp)

## Registry System

SmoothUI uses a custom registry system compatible with shadcn CLI v3. Each component includes:

### Automatic Dependencies

- **Package Dependencies**: Required npm packages are automatically included
- **Utility Files**: Shared utilities like `cn` are automatically bundled
- **Import Paths**: All import paths are automatically resolved

### Component Structure

When you install a component, you get:

```
components/smoothui/ui/
├── ComponentName.tsx    # Main component file
lib/utils/
└── cn.ts               # Utility functions (if needed)
```

### Registry Features

- **Self-contained**: Each component includes all necessary dependencies
- **Type-safe**: Full TypeScript support with proper types
- **Optimized**: Components are optimized for performance
- **Accessible**: Built-in accessibility features

## Troubleshooting

### Common Issues

#### 1. Authentication Error (401)

**Error**: `You are not authorized to access the item`

**Solution**: This usually happens with Vercel preview deployments. Use the production URL:

```json
{
  "registries": {
    "@smoothui": "https://smoothui.dev/r/{name}.json"
  }
}
```

#### 2. Registry Not Found

**Error**: `The item at https://smoothui.dev/r/registry.json was not found`

**Solution**: The search command might not work as expected. Install components directly:

```bash
npx shadcn@latest add @smoothui/siri-orb
```

#### 3. Import Path Issues

**Error**: `Cannot find module '@/lib/utils/cn'`

**Solution**: Make sure your `tsconfig.json` includes the path alias:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### 4. Missing Dependencies

**Error**: `Cannot find module 'clsx'`

**Solution**: Install missing dependencies:

```bash
pnpm add clsx tailwind-merge motion
```

### Getting Help

- **Documentation**: Visit [smoothui.dev](https://smoothui.dev) for detailed documentation
- **Issues**: Report bugs on [GitHub Issues](https://github.com/educlopez/smoothui/issues)
- **Discussions**: Join discussions on [GitHub Discussions](https://github.com/educlopez/smoothui/discussions)

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. **Clone the repository**:

```bash
git clone https://github.com/educlopez/smoothui.git
cd smoothui
```

2. **Install dependencies**:

```bash
pnpm install
```

3. **Start development server**:

```bash
pnpm dev
```

4. **Build registry**:

```bash
pnpm run build:registry
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
