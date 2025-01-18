import Image from "next/image"
import Link from "next/link"

import { components, ComponentsProps } from "@/app/data"

import Logo from "./../../../../../public/images/icon.png"
import { SidebarButton } from "./sidebarButton"

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen flex-1 flex-col overflow-y-auto overflow-x-visible border-r border-light3 p-6 pt-7 transition dark:border-dark3 dark:bg-dark2 lg:flex">
      <div className="-mx-0.5 flex items-center justify-between px-6 pb-[14px]">
        <Link href="/">
          <Image src={Logo} alt="Logo SmoothUI" width={36} />
        </Link>
      </div>
      <nav
        className="h-full overflow-y-auto px-6 pb-10 pt-[20px] [-ms-overflow-style:none] [scrollbar-width:none] max-lg:hidden [&::-webkit-scrollbar]:hidden"
        style={{
          maskImage:
            "linear-gradient(#0c0c0c,#0c0c0c,transparent 0,#0c0c0c 24px,#0c0c0c calc(100% - 60px),transparent)",
        }}
      >
        {/* <div className="flex flex-col gap-1">
          <span className="-ml-0.5 text-xs font-medium text-light12 dark:text-dark12">
            Get Started
          </span>
          <div className="flex flex-col">
            <SidebarButton key="1" name="Nombre" slug="/" />
          </div>
        </div> */}
        <div aria-hidden className="top-dotted mx-1 mb-6 mt-4 h-px" />
        <div className="flex flex-col gap-1">
          <span className="relative z-[1] -ml-0.5 text-xs font-medium text-light12 dark:text-dark12">
            Components
          </span>
          <div className="flex flex-col pb-8">
            {components
              .slice()
              .reverse()
              .map((component: ComponentsProps) => (
                <SidebarButton
                  key={component.componentTitle}
                  name={component.componentTitle}
                  slug={`/doc/${component.slug}`}
                  isNew={component.isNew}
                  isUpdated={component.isUpdated}
                />
              ))}
          </div>
        </div>
      </nav>
    </aside>
  )
}
