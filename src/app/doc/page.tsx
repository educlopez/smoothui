import { Breadcrumbs } from "@/app/doc/_components/breadcrumbs"
import { CodeBlock } from "@/app/doc/_components/codeBlock"

export default function GetStartedPage() {
  const tailwindConfig = `@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

@theme {
  /* Colors */
  --color-dark1: hsl(0 0% 8.5%);
  --color-dark2: hsl(0 0% 11.0%);
  --color-dark3: hsl(0 0% 13.6%);
  --color-dark4: hsl(0 0% 15.8%);
  --color-dark5: hsl(0 0% 17.9%);
  --color-dark6: hsl(0 0% 20.5%);
  --color-dark7: hsl(0 0% 24.3%);
  --color-dark8: hsl(0 0% 31.2%);
  --color-dark9: hsl(0 0% 43.9%);
  --color-dark10: hsl(0 0% 49.4%);
  --color-dark11: hsl(0 0% 62.8%);
  --color-dark12: hsl(0 0% 93.0%);
  --color-light1: hsl(0 0% 99.0%);
  --color-light2: hsl(0 0% 97.3%);
  --color-light3: hsl(0 0% 95.1%);
  --color-light4: hsl(0 0% 93.0%);
  --color-light5: hsl(0 0% 90.9%);
  --color-light6: hsl(0 0% 88.3%);
  --color-light7: hsl(0 0% 84.5%);
  --color-light8: hsl(0 0% 77.6%);
  --color-light9: hsl(0 0% 65.9%);
  --color-light10: hsl(0 0% 60.4%);
  --color-light11: hsl(0 0% 43.5%);
  --color-light12: hsl(0 0% 9.0%);
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
              className="text-light12 dark:text-dark12 text-3xl font-bold -tracking-wide"
            >
              Introduction
            </h1>
            <p className="text-light11 dark:text-dark11 text-[16px] leading-relaxed font-normal">
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
            className="text-light12 dark:text-dark12 text-2xl font-bold"
          >
            Installation
          </h2>
          <p className="text-light11 dark:text-dark11 text-[16px] leading-relaxed">
            To use SmoothUI components, you will need to install the following
            dependencies:
          </p>
          <CodeBlock code={installDeps} fileName="Terminal" lang="shell" />
        </div>

        <div className="space-y-4">
          <h2
            data-table-content="Color System"
            data-level="2"
            className="text-light12 dark:text-dark12 text-2xl font-bold"
          >
            Color System
          </h2>
          <p className="text-light11 dark:text-dark11 text-[16px] leading-relaxed">
            SmoothUI uses a carefully crafted color system with both light and
            dark variants. Add these colors to your tailwind.config.ts:
          </p>
          <CodeBlock code={tailwindConfig} fileName="global.css" lang="css" />
        </div>

        <div className="space-y-4">
          <h2
            data-table-content="Usage Tips"
            data-level="2"
            className="text-light12 dark:text-dark12 text-2xl font-bold"
          >
            Usage Tips
          </h2>
          <div className="space-y-3">
            <p className="text-light11 dark:text-dark11 text-[16px] leading-relaxed">
              Here are some tips to get the most out of SmoothUI components:
            </p>
            <ul className="text-light11 dark:text-dark11 list-disc space-y-2 pl-6 text-[16px]">
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
