"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import type { DialogProps } from "@radix-ui/react-dialog"
import { CornerDownLeft, LayoutDashboard } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Separator } from "@/components/ui/separator"
import { aiComponents } from "@/app/doc/data/aiComponents"
import { basicComponents } from "@/app/doc/data/basicComponents"
import { components } from "@/app/doc/data/components"
import { textComponents } from "@/app/doc/data/textComponentes"
import type { ComponentsProps } from "@/app/doc/data/typeComponent"

interface SearchDialogProps extends DialogProps {}

export function SearchDialog({
  open,
  onOpenChange,
  ...props
}: SearchDialogProps) {
  const router = useRouter()
  const [selectedType, setSelectedType] = React.useState<"component" | null>(
    null
  )
  const [copyPayload, setCopyPayload] = React.useState("")

  // Combine all component data files
  const allComponents = React.useMemo(() => {
    return [
      ...aiComponents,
      ...basicComponents,
      ...textComponents,
      ...components,
    ]
  }, [])

  const getComponentGroup = React.useCallback(
    (component: ComponentsProps): string => {
      // Check which data file the component belongs to
      if (aiComponents.some((aiComp) => aiComp.slug === component.slug))
        return "ai"
      if (
        basicComponents.some((basicComp) => basicComp.slug === component.slug)
      )
        return "basic"
      if (textComponents.some((textComp) => textComp.slug === component.slug))
        return "text"
      if (components.some((comp) => comp.slug === component.slug))
        return "components"

      // Fallback logic
      if (component.componentTitle.toLowerCase().includes("ai")) return "ai"
      if (component.type === "block") return "components"
      return "components"
    },
    []
  )

  const handleComponentHighlight = React.useCallback(
    (component: ComponentsProps) => {
      setSelectedType("component")
      setCopyPayload(`npx shadcn@latest add @smoothui/${component.slug}`)
    },
    []
  )

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      onOpenChange?.(false)
      command()
    },
    [onOpenChange]
  )

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "c" && (e.metaKey || e.ctrlKey)) {
        runCommand(() => {
          if (copyPayload) {
            navigator.clipboard.writeText(copyPayload)
          }
        })
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [copyPayload, runCommand])

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} {...props}>
      <Command
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
          <CommandEmpty className="text-muted-foreground py-12 text-center text-sm">
            No results found.
          </CommandEmpty>

          <CommandGroup
            heading="Components"
            className="!p-0 [&_[cmdk-group-heading]]:scroll-mt-16 [&_[cmdk-group-heading]]:!p-3 [&_[cmdk-group-heading]]:!pb-1"
          >
            {allComponents.map((component) => (
              <CommandMenuItem
                key={component.slug}
                value={`${component.componentTitle} ${component.info}`}
                keywords={["component"]}
                onHighlight={() => handleComponentHighlight(component)}
                onSelect={() => {
                  runCommand(() => {
                    const group = getComponentGroup(component)
                    router.push(`/doc/${group}/${component.slug}`)
                  })
                }}
              >
                <LayoutDashboard size={14} className="mr-2" />
                <div className="flex flex-1 items-center gap-2">
                  <span className="font-medium">
                    {component.componentTitle}
                  </span>
                  {component.isNew && (
                    <Badge variant="secondary" className="text-xs">
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
        </CommandList>
      </Command>
      <div className="text-muted-foreground absolute inset-x-0 bottom-0 z-20 flex h-10 items-center gap-2 rounded-b-xl border-t border-t-neutral-100 bg-neutral-50 px-4 text-xs font-medium dark:border-t-neutral-700 dark:bg-neutral-800">
        <div className="flex items-center gap-2">
          <CommandMenuKbd>
            <CornerDownLeft />
          </CommandMenuKbd>{" "}
          {selectedType === "component" ? "Go to Component" : null}
        </div>
        {selectedType === "component" && (
          <>
            <Separator orientation="vertical" className="!h-4" />
            <div className="flex items-center gap-1">
              <CommandMenuKbd>⌘</CommandMenuKbd>
              <CommandMenuKbd>C</CommandMenuKbd>
              Copy Install Command
            </div>
          </>
        )}
      </div>
    </CommandDialog>
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

  React.useEffect(() => {
    const observer = new MutationObserver((mutations) => {
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

    if (ref.current) {
      observer.observe(ref.current, { attributes: true })
    }

    return () => observer.disconnect()
  }, [onHighlight])

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
        "bg-background text-muted-foreground pointer-events-none flex h-5 items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium select-none [&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    />
  )
}
