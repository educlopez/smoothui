import React from "react"

import type { ComponentsProps } from "@/app/data"

export default function Frame({ component }: { component: ComponentsProps }) {
  return (
    <div className="w-full py-12 last:pb-0 odd:pt-0 md:w-[600px]">
      <div className="mx-auto w-full px-4">
        <article className="grid gap-3">
          <div className="flex justify-between gap-8">
            <div className="flex items-center gap-2">
              {/* <span className="relative inline-flex h-6 w-6 select-none items-center justify-center overflow-hidden rounded-full align-middle">
                <div className="false h-6 w-6 rounded-full bg-red-300 object-cover" />
                <div className="absolute inset-0 flex rounded-full border border-light11 dark:border-dark11"></div>
              </span> */}
              <h3 className="text-sm font-medium text-light12 transition dark:text-dark12">
                <span className="text-light11 transition dark:text-dark11">
                  #{component.id}
                </span>{" "}
                {component.componentTitle}
              </h3>
            </div>
          </div>
          <div className="relative flex h-auto w-full items-center justify-center overflow-hidden rounded-lg border border-light3 bg-light2 transition dark:border-dark3 dark:bg-dark2 md:h-[640px] md:flex-1">
            {component.componentUi
              ? React.createElement(component.componentUi)
              : null}
          </div>
          <div className="flex justify-between gap-8">
            <div className="flex items-center gap-1 odd:border-pink-400">
              {component.tags.map((tag) => (
                <div
                  key={tag}
                  className="inline-flex h-[24px] cursor-default select-none items-center justify-center gap-2 rounded-full border border-light3 px-2 text-xs text-light11 transition dark:border-dark3 dark:text-dark11"
                >
                  {tag}
                </div>
              ))}
            </div>
            {/* <a
              className="cursor-pointer text-light11 transition hover:text-light12 dark:text-dark11 hover:dark:text-dark12"
              target="_blank"
              rel="noopener nofollow"
              href="https://x.com/educlopez93"
            >
              <svg height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
            </a> */}
          </div>
          <p className="text-sm text-light12 transition dark:text-dark12">
            {component.info}
          </p>
        </article>
      </div>
    </div>
  )
}
