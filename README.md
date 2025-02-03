# SmoothUI

![Screenshot of SmoothUI](/public/readme.png)

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white)
![Motion](https://img.shields.io/badge/Motion-yellow)
[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fpheralb%2Fsvgl%2Fbadge%3Fref%3Dmain&style=flat)](https://actions-badge.atrox.dev/educlopez/smoothui/goto?ref=main)
![GitHub stars](https://img.shields.io/github/stars/educlopez/smoothui)
![GitHub issues](https://img.shields.io/github/issues/educlopez/smoothui)
![GitHub forks](https://img.shields.io/github/forks/educlopez/smoothui)
![GitHub PRs](https://img.shields.io/github/issues-pr/educlopez/smoothui)

</div>
SmoothUI is a collection of beautifully designed components with smooth animations built with React, Tailwind CSS, and Motion. This project aims to provide developers with a set of reusable UI components that enhance user experience through delightful animations and modern design patterns.

## Table of Contents

- [SmoothUI](#smoothui)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- **Smooth Animations**: Built-in animations powered by Motion for delightful user experiences.
- **Responsive Design**: Fully responsive components designed with Tailwind CSS.
- **Easy to Use**: Simple API for integrating components into your projects.
- **Customizable**: Tailwind CSS utility classes allow for easy customization of styles.
- **Dark Mode Support**: Components support both light and dark themes out of the box.

## Installation

To use SmoothUI components, you will need to install the following dependencies:

```bash
pnpm install motion tailwindcss lucide-react clsx tailwind-merge
```

## Usage

After installing the dependencies, you can start using SmoothUI components in your React application. Here’s an example of how to use a component:

```typescript
import MyNewComponent from "@/app/doc/_components/ui/MyNewComponent";
const App = () => {
    return (
        <div>
            <MyNewComponent />
        </div>
    );
};
export default App;
```

## Contributing

Thank you for your interest in contributing to SmoothUI! Please follow these steps to contribute:

1. **Fork the Repository**: Click the "Fork" button in the top right corner of the page.
2. **Clone Your Fork**: Run the following command to clone your forked repository to your local machine:
   ```bash
   git clone https://github.com/yourusername/smoothui.git
   ```
3. **Create a New Branch**: Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b my-feature
   ```
4. **Make Your Changes**: Implement your changes and commit them with a descriptive message:
   ```bash
   git commit -m "Add my feature"
   ```
5. **Push Your Changes**: Push your changes to your forked repository:
   ```bash
   git push origin my-feature
   ```
6. **Create a Pull Request**: Go to the original SmoothUI repository on GitHub and click on the "Pull Requests" tab. Click the "New Pull Request" button and select your forked repository and branch.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Thank you for contributing to SmoothUI! We appreciate your help in making this project better. If you have any questions, feel free to reach out to the maintainers.
