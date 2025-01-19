import { Breadcrumbs } from "@/app/doc/_components/breadcrumbs"
import { CodeBlock } from "@/app/doc/_components/codeBlock"

export default function GetStartedPage() {
  const tailwindConfig = `import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark1: "hsl(0 0% 8.5%)",
        dark2: "hsl(0 0% 11.0%)",
        dark3: "hsl(0 0% 13.6%)",
        dark4: "hsl(0 0% 15.8%)",
        dark5: "hsl(0 0% 17.9%)",
        dark6: "hsl(0 0% 20.5%)",
        dark7: "hsl(0 0% 24.3%)",
        dark8: "hsl(0 0% 31.2%)",
        dark9: "hsl(0 0% 43.9%)",
        dark10: "hsl(0 0% 49.4%)",
        dark11: "hsl(0 0% 62.8%)",
        dark12: "hsl(0 0% 93.0%)",
        light1: "hsl(0 0% 99.0%)",
        light2: "hsl(0 0% 97.3%)",
        light3: "hsl(0 0% 95.1%)",
        light4: "hsl(0 0% 93.0%)",
        light5: "hsl(0 0% 90.9%)",
        light6: "hsl(0 0% 88.3%)",
        light7: "hsl(0 0% 84.5%)",
        light8: "hsl(0 0% 77.6%)",
        light9: "hsl(0 0% 65.9%)",
        light10: "hsl(0 0% 60.4%)",
        light11: "hsl(0 0% 43.5%)",
        light12: "hsl(0 0% 9.0%)",
      },
    },
  },
  plugins: [],
}`

  const installDeps = `npm install motion lucide-react clsx tailwind-merge`

  return (
    <>
      <div className="space-y-8">
        <div className="space-y-4">
          <Breadcrumbs groupName="Get Started" currentPage="Introduction" />
          <div className="space-y-3.5">
            <h1
              data-table-content="Introduction"
              data-level="1"
              className="text-3xl font-bold -tracking-wide text-light12 dark:text-dark12"
            >
              Introduction
            </h1>
            <p className="text-[16px] font-normal leading-relaxed text-light11 dark:text-dark11">
              SmoothUI is a collection of beautifully designed components with
              smooth animations built with React, Tailwind CSS, and Framer
              Motion.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2
            data-table-content="Installation"
            data-level="2"
            className="text-2xl font-bold text-light12 dark:text-dark12"
          >
            Installation
          </h2>
          <p className="text-[16px] leading-relaxed text-light11 dark:text-dark11">
            To use SmoothUI components, you will need to install the following
            dependencies:
          </p>
          <CodeBlock code={installDeps} fileName="Terminal" lang="shell" />
        </div>

        <div className="space-y-4">
          <h2
            data-table-content="Color System"
            data-level="2"
            className="text-2xl font-bold text-light12 dark:text-dark12"
          >
            Color System
          </h2>
          <p className="text-[16px] leading-relaxed text-light11 dark:text-dark11">
            SmoothUI uses a carefully crafted color system with both light and
            dark variants. Add these colors to your tailwind.config.ts:
          </p>
          <CodeBlock code={tailwindConfig} fileName="tailwind.config.ts" />
        </div>

        <div className="space-y-4">
          <h2
            data-table-content="Usage Tips"
            data-level="2"
            className="text-2xl font-bold text-light12 dark:text-dark12"
          >
            Usage Tips
          </h2>
          <div className="space-y-3">
            <p className="text-[16px] leading-relaxed text-light11 dark:text-dark11">
              Here are some tips to get the most out of SmoothUI components:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-[16px] text-light11 dark:text-dark11">
              <li>
                All components support both light and dark modes out of the box
              </li>
              <li>Use the provided color system for consistent theming</li>
              <li>Components are built with motion for smooth animations</li>
              <li>Each component can be customized using Tailwind classes</li>
              <li>
                Check individual component documentation for specific
                customization options
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
