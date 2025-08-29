# SmoothUI

![Screenshot of SmoothUI](/public/readme.png)

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
  - [Installation](#installation)
    - [Using shadcn CLI v3 (Recommended)](#using-shadcn-cli-v3-recommended)
    - [Manual Installation](#manual-installation)
  - [Usage](#usage)
  - [Components](#components)
  - [Troubleshooting](#troubleshooting)
    - [Authentication Error (401)](#authentication-error-401)
    - [Registry Not Found](#registry-not-found)
  - [Contributing](#contributing)
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

## Installation

### Using shadcn CLI v3 (Recommended)

SmoothUI now supports the new shadcn CLI v3 namespace system. Add the registry to your `components.json`:

```json
{
  "registries": {
    "@smoothui": "https://smoothui.dev/r/{name}.json"
  }
}
```

Then install components using the namespace:

```bash
# Install a single component
npx shadcn@latest add @smoothui/siri-orb

# Install multiple components
npx shadcn@latest add @smoothui/rich-popover @smoothui/animated-input

# View available components
npx shadcn@latest search @smoothui

# View component details before installation
npx shadcn@latest view @smoothui/siri-orb
```

### Manual Installation

To use SmoothUI components in your project, install the required dependencies:

```bash
pnpm add motion tailwindcss lucide-react clsx tailwind-merge
```

## Usage

Import and use SmoothUI components in your React application:

```typescript
import { ComponentName } from "@/components/smoothui/ui/ComponentName";

const App = () => {
  return (
    <div>
      <ComponentName />
    </div>
  );
};

export default App;
```

## Components

SmoothUI offers a variety of components, including:

- **Basic Components**

  - Accordion
  - Avatar
  - Button
  - Card
  - Input
  - Tooltip
  - And more...

- **Advanced Components**
  - Dynamic Island
  - Animated Tags
  - Apple Invites
  - Expandable Cards
  - Number Flow
  - Social Selector
  - And many more...

Visit our [documentation](https://smoothui.dev/doc) for a complete list of components and their usage.

## Troubleshooting

### Authentication Error (401)

If you get an authentication error when trying to install components, it means the Vercel deployment has deployment protection enabled. To fix this:

1. **For Production**: Use the production URL: `https://smoothui.dev/r/{name}.json`
2. **For Development**: Disable deployment protection in your Vercel project settings
3. **For Testing**: Use the static file approach with proper CORS headers

### Registry Not Found

If components are not found, ensure:
- The registry URL is correct in your `components.json`
- The component name matches exactly (case-sensitive)
- The registry files are properly generated

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Install dependencies: `pnpm install`
4. Make your changes
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

For detailed guidelines, please read our [CONTRIBUTING.md](CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <h3>
    <a href="https://smoothui.dev">Website</a>
    <span> | </span>
    <a href="https://smoothui.dev/doc">Documentation</a>
    <span> | </span>
    <a href="https://github.com/educlopez/smoothui">GitHub</a>
  </h3>
  <p>Built with ❤️ by <a href="https://x.com/educalvolpz">@educalvolpz</a></p>
</div>
