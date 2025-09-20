"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import type { DialogProps } from "@radix-ui/react-dialog"
import { CornerDownLeftIcon, Search, SquareDashedIcon } from "lucide-react"

import { isComponentNew } from "@/lib/componentUtils"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { aiComponents } from "@/app/doc/data/aiComponents"
import { basicComponents } from "@/app/doc/data/basicComponents"
import { faqsBlocks } from "@/app/doc/data/block-faqs"
import { footerBlocks } from "@/app/doc/data/block-footer"
import { heroBlocks } from "@/app/doc/data/block-hero"
import { logoCloudBlocks } from "@/app/doc/data/block-logo-cloud"
import { pricingBlocks } from "@/app/doc/data/block-pricing"
import { statsBlocks } from "@/app/doc/data/block-stats"
import { teamBlocks } from "@/app/doc/data/block-team"
import { testimonialBlocks } from "@/app/doc/data/block-testimonials"
import { components } from "@/app/doc/data/components"
import { textComponents } from "@/app/doc/data/textComponentes"
import type { ComponentsProps } from "@/app/doc/data/typeComponent"

import { useMutationObserver } from "../ui/hooks/use-mutation-observer"

export function SearchDialog({ ...props }: DialogProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [selectedType, setSelectedType] = React.useState<
    "component" | "block" | null
  >(null)
  const [copyPayload, setCopyPayload] = React.useState("")

  const handleComponentHighlight = React.useCallback(
    (component: ComponentsProps) => {
      setSelectedType("component")
      setCopyPayload(`npx shadcn@latest add @smoothui/${component.slug}`)
    },
    []
  )

  const handleBlockHighlight = React.useCallback(() => {
    setSelectedType("block")
    setCopyPayload("")
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return
        }

        e.preventDefault()
        setOpen((open) => !open)
      }

      if (e.key === "c" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        if (copyPayload && selectedType === "component") {
          navigator.clipboard.writeText(copyPayload)
        }
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [copyPayload, selectedType])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Desktop Search Button */}
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className={cn(
            "bg-primary hover:text-foreground text-foreground/70 relative hidden h-8 w-full justify-start border pl-2.5 font-normal shadow-none sm:pr-12 md:flex md:w-40 lg:w-56 xl:w-64"
          )}
          onClick={() => setOpen(true)}
          {...props}
        >
          <span className="inline-flex">Search...</span>
          <div className="absolute top-1.5 right-1.5 hidden gap-1 sm:flex">
            <CommandMenuKbd>⌘</CommandMenuKbd>
            <CommandMenuKbd className="aspect-square">K</CommandMenuKbd>
          </div>
        </Button>
      </DialogTrigger>

      {/* Mobile Search Button */}
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="md:hidden"
          onClick={() => setOpen(true)}
        >
          <Search className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="rounded-xl border bg-clip-padding p-2 pb-11 shadow-2xl"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Search components...</DialogTitle>
          <DialogDescription>
            Search for a component or block...
          </DialogDescription>
        </DialogHeader>
        <Command
          className="**:data-[slot=command-input-wrapper]:bg-input/50 **:data-[slot=command-input-wrapper]:border-input rounded-none bg-transparent **:data-[slot=command-input]:!h-9 **:data-[slot=command-input]:py-0 **:data-[slot=command-input-wrapper]:mb-0 **:data-[slot=command-input-wrapper]:!h-9 **:data-[slot=command-input-wrapper]:rounded-md **:data-[slot=command-input-wrapper]:border"
          filter={(value, search, keywords) => {
            const extendValue = value + " " + (keywords?.join(" ") || "")
            if (extendValue.toLowerCase().includes(search.toLowerCase())) {
              return 1
            }
            return 0
          }}
        >
          <CommandInput placeholder="Search components..." />
          <CommandList className="no-scrollbar min-h-80 scroll-pt-2 scroll-pb-1.5">
            <CommandEmpty className="text-foreground/70 py-12 text-center text-sm">
              No results found.
            </CommandEmpty>

            {/* AI Components */}
            {aiComponents && aiComponents.length > 0 && (
              <CommandGroup
                heading="AI Components"
                className="!p-0 [&_[cmdk-group-heading]]:scroll-mt-16 [&_[cmdk-group-heading]]:!p-3 [&_[cmdk-group-heading]]:!pb-1"
              >
                {aiComponents.map((component) => (
                  <CommandMenuItem
                    key={component.slug}
                    value={`${component.componentTitle} ${component.info ?? ""}`}
                    keywords={[
                      "component",
                      "ai",
                      component.componentTitle,
                      component.slug,
                      ...(component.info ? [component.info] : []),
                    ].filter((item): item is string => Boolean(item))}
                    onHighlight={() => handleComponentHighlight(component)}
                    onSelect={() => {
                      runCommand(() => {
                        router.push(`/doc/ai/${component.slug}`)
                      })
                    }}
                  >
                    <div className="border-muted-foreground aspect-square size-4 rounded-full border border-dashed" />
                    <div className="flex flex-1 items-center gap-2">
                      <span className="font-medium">
                        {component.componentTitle}
                      </span>
                      {isComponentNew(component) && (
                        <Badge
                          variant="secondary"
                          className="border-border border text-xs"
                        >
                          New
                        </Badge>
                      )}
                    </div>
                    <span className="text-foreground/70 ml-auto font-mono text-xs font-normal tabular-nums">
                      {component.slug}
                    </span>
                  </CommandMenuItem>
                ))}
              </CommandGroup>
            )}

            {/* Basic Components */}
            {basicComponents && basicComponents.length > 0 && (
              <CommandGroup
                heading="Basic Components"
                className="!p-0 [&_[cmdk-group-heading]]:scroll-mt-16 [&_[cmdk-group-heading]]:!p-3 [&_[cmdk-group-heading]]:!pb-1"
              >
                {basicComponents.map((component) => (
                  <CommandMenuItem
                    key={component.slug}
                    value={`${component.componentTitle} ${component.info ?? ""}`}
                    keywords={[
                      "component",
                      "basic",
                      component.componentTitle,
                      component.slug,
                      ...(component.info ? [component.info] : []),
                    ].filter((item): item is string => Boolean(item))}
                    onHighlight={() => handleComponentHighlight(component)}
                    onSelect={() => {
                      runCommand(() => {
                        router.push(`/doc/basic/${component.slug}`)
                      })
                    }}
                  >
                    <div className="border-muted-foreground aspect-square size-4 rounded-full border border-dashed" />
                    <div className="flex flex-1 items-center gap-2">
                      <span className="font-medium">
                        {component.componentTitle}
                      </span>
                      {isComponentNew(component) && (
                        <Badge
                          variant="secondary"
                          className="border-border border text-xs"
                        >
                          New
                        </Badge>
                      )}
                    </div>
                    <span className="text-foreground/70 ml-auto font-mono text-xs font-normal tabular-nums">
                      {component.slug}
                    </span>
                  </CommandMenuItem>
                ))}
              </CommandGroup>
            )}

            {/* Text Components */}
            {textComponents && textComponents.length > 0 && (
              <CommandGroup
                heading="Text Components"
                className="!p-0 [&_[cmdk-group-heading]]:scroll-mt-16 [&_[cmdk-group-heading]]:!p-3 [&_[cmdk-group-heading]]:!pb-1"
              >
                {textComponents.map((component) => (
                  <CommandMenuItem
                    key={component.slug}
                    value={`${component.componentTitle} ${component.info ?? ""}`}
                    keywords={[
                      "component",
                      "text",
                      component.componentTitle,
                      component.slug,
                      ...(component.info ? [component.info] : []),
                    ].filter((item): item is string => Boolean(item))}
                    onHighlight={() => handleComponentHighlight(component)}
                    onSelect={() => {
                      runCommand(() => {
                        router.push(`/doc/text/${component.slug}`)
                      })
                    }}
                  >
                    <div className="border-muted-foreground aspect-square size-4 rounded-full border border-dashed" />
                    <div className="flex flex-1 items-center gap-2">
                      <span className="font-medium">
                        {component.componentTitle}
                      </span>
                      {isComponentNew(component) && (
                        <Badge
                          variant="secondary"
                          className="border-border border text-xs"
                        >
                          New
                        </Badge>
                      )}
                    </div>
                    <span className="text-foreground/70 ml-auto font-mono text-xs font-normal tabular-nums">
                      {component.slug}
                    </span>
                  </CommandMenuItem>
                ))}
              </CommandGroup>
            )}

            {/* Components */}
            {components && components.length > 0 && (
              <CommandGroup
                heading="Components"
                className="!p-0 [&_[cmdk-group-heading]]:scroll-mt-16 [&_[cmdk-group-heading]]:!p-3 [&_[cmdk-group-heading]]:!pb-1"
              >
                {components.map((component) => (
                  <CommandMenuItem
                    key={component.slug}
                    value={`${component.componentTitle} ${component.info ?? ""}`}
                    keywords={[
                      "component",
                      component.componentTitle,
                      component.slug,
                      ...(component.info ? [component.info] : []),
                    ].filter((item): item is string => Boolean(item))}
                    onHighlight={() => handleComponentHighlight(component)}
                    onSelect={() => {
                      runCommand(() => {
                        router.push(`/doc/components/${component.slug}`)
                      })
                    }}
                  >
                    <div className="border-muted-foreground aspect-square size-4 rounded-full border border-dashed" />
                    <div className="flex flex-1 items-center gap-2">
                      <span className="font-medium">
                        {component.componentTitle}
                      </span>
                      {isComponentNew(component) && (
                        <Badge
                          variant="secondary"
                          className="border-border border text-xs"
                        >
                          New
                        </Badge>
                      )}
                    </div>
                    <span className="text-foreground/70 ml-auto font-mono text-xs font-normal tabular-nums">
                      {component.slug}
                    </span>
                  </CommandMenuItem>
                ))}
              </CommandGroup>
            )}

            {/* Hero Blocks */}
            {heroBlocks && heroBlocks.length > 0 && (
              <CommandGroup
                heading="Hero Blocks"
                className="!p-0 [&_[cmdk-group-heading]]:!p-3"
              >
                {heroBlocks.map((block) => (
                  <CommandMenuItem
                    key={block.title}
                    value={block.title}
                    onHighlight={handleBlockHighlight}
                    keywords={["block", block.title, block.description, "hero"]}
                    onSelect={() => {
                      runCommand(() =>
                        router.push(
                          `/doc/blocks/hero#${block.title.toLowerCase().replace(/\s+/g, "-")}`
                        )
                      )
                    }}
                  >
                    <SquareDashedIcon />
                    {block.title}
                    <span className="text-foreground/70 ml-auto font-mono text-xs font-normal tabular-nums">
                      {block.title.toLowerCase().replace(/\s+/g, "-")}
                    </span>
                  </CommandMenuItem>
                ))}
              </CommandGroup>
            )}

            {/* Pricing Blocks */}
            {pricingBlocks && pricingBlocks.length > 0 && (
              <CommandGroup
                heading="Pricing Blocks"
                className="!p-0 [&_[cmdk-group-heading]]:!p-3"
              >
                {pricingBlocks.map((block) => (
                  <CommandMenuItem
                    key={block.title}
                    value={block.title}
                    onHighlight={handleBlockHighlight}
                    keywords={[
                      "block",
                      block.title,
                      block.description,
                      "pricing",
                    ]}
                    onSelect={() => {
                      runCommand(() =>
                        router.push(
                          `/doc/blocks/pricing#${block.title.toLowerCase().replace(/\s+/g, "-")}`
                        )
                      )
                    }}
                  >
                    <SquareDashedIcon />
                    {block.title}
                    <span className="text-foreground/70 ml-auto font-mono text-xs font-normal tabular-nums">
                      {block.title.toLowerCase().replace(/\s+/g, "-")}
                    </span>
                  </CommandMenuItem>
                ))}
              </CommandGroup>
            )}

            {/* Testimonial Blocks */}
            {testimonialBlocks && testimonialBlocks.length > 0 && (
              <CommandGroup
                heading="Testimonial Blocks"
                className="!p-0 [&_[cmdk-group-heading]]:!p-3"
              >
                {testimonialBlocks.map((block) => (
                  <CommandMenuItem
                    key={block.title}
                    value={block.title}
                    onHighlight={handleBlockHighlight}
                    keywords={[
                      "block",
                      block.title,
                      block.description,
                      "testimonial",
                    ]}
                    onSelect={() => {
                      runCommand(() =>
                        router.push(
                          `/doc/blocks/testimonial#${block.title.toLowerCase().replace(/\s+/g, "-")}`
                        )
                      )
                    }}
                  >
                    <SquareDashedIcon />
                    {block.title}
                    <span className="text-foreground/70 ml-auto font-mono text-xs font-normal tabular-nums">
                      {block.title.toLowerCase().replace(/\s+/g, "-")}
                    </span>
                  </CommandMenuItem>
                ))}
              </CommandGroup>
            )}

            {/* Logo Cloud Blocks */}
            {logoCloudBlocks && logoCloudBlocks.length > 0 && (
              <CommandGroup
                heading="Logo Cloud Blocks"
                className="!p-0 [&_[cmdk-group-heading]]:!p-3"
              >
                {logoCloudBlocks.map((block) => (
                  <CommandMenuItem
                    key={block.title}
                    value={block.title}
                    onHighlight={handleBlockHighlight}
                    keywords={[
                      "block",
                      block.title,
                      block.description,
                      "logo-cloud",
                    ]}
                    onSelect={() => {
                      runCommand(() =>
                        router.push(
                          `/doc/blocks/logo-cloud#${block.title.toLowerCase().replace(/\s+/g, "-")}`
                        )
                      )
                    }}
                  >
                    <SquareDashedIcon />
                    {block.title}
                    <span className="text-foreground/70 ml-auto font-mono text-xs font-normal tabular-nums">
                      {block.title.toLowerCase().replace(/\s+/g, "-")}
                    </span>
                  </CommandMenuItem>
                ))}
              </CommandGroup>
            )}

            {/* Stats Blocks */}
            {statsBlocks && statsBlocks.length > 0 && (
              <CommandGroup
                heading="Stats Blocks"
                className="!p-0 [&_[cmdk-group-heading]]:!p-3"
              >
                {statsBlocks.map((block) => (
                  <CommandMenuItem
                    key={block.title}
                    value={block.title}
                    onHighlight={handleBlockHighlight}
                    keywords={[
                      "block",
                      block.title,
                      block.description,
                      "stats",
                    ]}
                    onSelect={() => {
                      runCommand(() =>
                        router.push(
                          `/doc/blocks/stats#${block.title.toLowerCase().replace(/\s+/g, "-")}`
                        )
                      )
                    }}
                  >
                    <SquareDashedIcon />
                    {block.title}
                    <span className="text-foreground/70 ml-auto font-mono text-xs font-normal tabular-nums">
                      {block.title.toLowerCase().replace(/\s+/g, "-")}
                    </span>
                  </CommandMenuItem>
                ))}
              </CommandGroup>
            )}

            {/* Team Blocks */}
            {teamBlocks && teamBlocks.length > 0 && (
              <CommandGroup
                heading="Team Blocks"
                className="!p-0 [&_[cmdk-group-heading]]:!p-3"
              >
                {teamBlocks.map((block) => (
                  <CommandMenuItem
                    key={block.title}
                    value={block.title}
                    onHighlight={handleBlockHighlight}
                    keywords={["block", block.title, block.description, "team"]}
                    onSelect={() => {
                      runCommand(() =>
                        router.push(
                          `/doc/blocks/team#${block.title.toLowerCase().replace(/\s+/g, "-")}`
                        )
                      )
                    }}
                  >
                    <SquareDashedIcon />
                    {block.title}
                    <span className="text-foreground/70 ml-auto font-mono text-xs font-normal tabular-nums">
                      {block.title.toLowerCase().replace(/\s+/g, "-")}
                    </span>
                  </CommandMenuItem>
                ))}
              </CommandGroup>
            )}

            {/* Footer Blocks */}
            {footerBlocks && footerBlocks.length > 0 && (
              <CommandGroup
                heading="Footer Blocks"
                className="!p-0 [&_[cmdk-group-heading]]:!p-3"
              >
                {footerBlocks.map((block) => (
                  <CommandMenuItem
                    key={block.title}
                    value={block.title}
                    onHighlight={handleBlockHighlight}
                    keywords={[
                      "block",
                      block.title,
                      block.description,
                      "footer",
                    ]}
                    onSelect={() => {
                      runCommand(() =>
                        router.push(
                          `/doc/blocks/footer#${block.title.toLowerCase().replace(/\s+/g, "-")}`
                        )
                      )
                    }}
                  >
                    <SquareDashedIcon />
                    {block.title}
                    <span className="text-foreground/70 ml-auto font-mono text-xs font-normal tabular-nums">
                      {block.title.toLowerCase().replace(/\s+/g, "-")}
                    </span>
                  </CommandMenuItem>
                ))}
              </CommandGroup>
            )}

            {/* FAQs Blocks */}
            {faqsBlocks && faqsBlocks.length > 0 && (
              <CommandGroup
                heading="FAQs Blocks"
                className="!p-0 [&_[cmdk-group-heading]]:!p-3"
              >
                {faqsBlocks.map((block) => (
                  <CommandMenuItem
                    key={block.title}
                    value={block.title}
                    onHighlight={handleBlockHighlight}
                    keywords={["block", block.title, block.description, "faqs"]}
                    onSelect={() => {
                      runCommand(() =>
                        router.push(
                          `/doc/blocks/faqs#${block.title.toLowerCase().replace(/\s+/g, "-")}`
                        )
                      )
                    }}
                  >
                    <SquareDashedIcon />
                    {block.title}
                    <span className="text-foreground/70 ml-auto font-mono text-xs font-normal tabular-nums">
                      {block.title.toLowerCase().replace(/\s+/g, "-")}
                    </span>
                  </CommandMenuItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
        <div className="text-foreground/70 bg-border absolute inset-x-0 bottom-0 z-20 flex h-10 items-center gap-2 rounded-b-xl border-t px-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <CommandMenuKbd>
              <CornerDownLeftIcon />
            </CommandMenuKbd>{" "}
            {selectedType === "component"
              ? "Go to Component"
              : selectedType === "block"
                ? "Go to Block"
                : null}
          </div>
          {copyPayload && selectedType === "component" && (
            <>
              <Separator orientation="vertical" className="!h-4" />
              <div className="flex items-center gap-1">
                <CommandMenuKbd>⌘</CommandMenuKbd>
                <CommandMenuKbd>C</CommandMenuKbd>
                {copyPayload}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function CommandMenuItem({
  children,
  className,
  onHighlight,
  ...props
}: React.ComponentProps<typeof CommandItem> & {
  onHighlight?: () => void
  "data-selected"?: string
  "aria-selected"?: string
}) {
  const ref = React.useRef<HTMLDivElement>(null)

  useMutationObserver(ref, (mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "aria-selected" &&
        ref.current?.getAttribute("aria-selected") === "true"
      ) {
        onHighlight?.()
      }
    })
  })

  return (
    <CommandItem
      ref={ref}
      className={cn(
        "data-[selected=true]:border-input data-[selected=true]:bg-input/50 h-9 rounded-md border border-transparent !px-3 font-medium",
        className
      )}
      {...props}
    >
      {children}
    </CommandItem>
  )
}

function CommandMenuKbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "bg-background text-foreground/70 pointer-events-none flex h-5 items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium select-none [&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    />
  )
}
