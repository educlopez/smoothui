# Contributing to SmoothUI

Thank you for your interest in contributing to SmoothUI! This guide will help you get started with the process of contributing to the project.

## Table of Contents

- [Contributing to SmoothUI](#contributing-to-smoothui)
  - [Table of Contents](#table-of-contents)
  - [Forking the Repository](#forking-the-repository)
  - [Setting Up Your Development Environment](#setting-up-your-development-environment)
  - [Adding New Components](#adding-new-components)
  - [Submitting Your Changes](#submitting-your-changes)
  - [Code Style and Best Practices](#code-style-and-best-practices)
  - [Additional Resources](#additional-resources)

## Forking the Repository

1. **Go to the SmoothUI GitHub Repository**: Navigate to the [SmoothUI GitHub repository](https://github.com/educlopez/smoothui).

2. **Fork the Repository**: Click the "Fork" button in the top right corner of the page. This will create a copy of the repository under your GitHub account.

3. **Clone Your Fork**: Open your terminal and run the following command to clone your forked repository to your local machine:

   ```bash
   git clone https://github.com/yourusername/smoothui.git
   ```

4. **Navigate to the Project Directory**:
   ```bash
   cd smoothui
   ```

## Setting Up Your Development Environment

1. **Install Dependencies**: Make sure you have Node.js and npm installed. Then, run the following command to install the project dependencies:

   ```bash
   npm install
   ```

2. **Run the Development Server**: Start the development server to see the project in action:

   ```bash
   npm run dev
   ```

3. **Open the Project**: Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the project.

## Adding New Components

1. **Create a New Component**: In the `src/app/doc/_components/smoothui/` directory, create a new file for your component. Use a descriptive name for the file, e.g., `MyNewComponent.tsx`.

2. **Implement Your Component**: Write your component code using React and TypeScript. Make sure to follow the existing structure and conventions used in the project.

3. **Export Your Component**: Ensure that your component is exported properly. For example:

   ```typescript
   const MyNewComponent = () => {
     return <div>Hello, SmoothUI!</div>;
   };

   export default MyNewComponent;
   ```

4. **Update the Components Data**: If your component needs to be included in the components list, update the `src/app/doc/data.ts` file to add your component's information.

## Submitting Your Changes

1. **Commit Your Changes**: After making your changes, commit them with a descriptive message:

   ```bash
   git add .
   git commit -m "Add MyNewComponent"
   ```

2. **Push Your Changes**: Push your changes to your forked repository:

   ```bash
   git push origin main
   ```

3. **Create a Pull Request**: Go to the original SmoothUI repository on GitHub and click on the "Pull Requests" tab. Click the "New Pull Request" button and select your forked repository and branch. Provide a clear description of your changes and submit the pull request.

## Code Style and Best Practices

- **Follow the Existing Code Style**: Ensure that your code follows the existing style and conventions used in the project.
- **Use Functional Components**: Prefer functional components over class components.
- **TypeScript**: Use TypeScript for all new components and prefer interfaces over types.
- **Testing**: If applicable, write tests for your new components.

## Additional Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Next.js Documentation](https://nextjs.org/docs)

Thank you for contributing to SmoothUI! We appreciate your help in making this project better. If you have any questions, feel free to reach out to the maintainers.
