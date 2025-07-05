import React from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface FieldDefinition {
  name: string
  type: string
  description?: string
}

interface PropDefinition {
  name: string
  type: string
  description?: string
  required?: boolean
  fields?: FieldDefinition[]
  default?: string
}

interface PropsTableProps {
  props: PropDefinition[]
}

const InfoIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={
      className || "text-muted-foreground ml-1 inline h-4 w-4 align-middle"
    }
    aria-hidden="true"
  >
    <circle
      cx="10"
      cy="10"
      r="9"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <rect x="9" y="8" width="2" height="5" rx="1" fill="currentColor" />
    <rect x="9" y="5" width="2" height="2" rx="1" fill="currentColor" />
  </svg>
)

const PropsTable: React.FC<PropsTableProps> = ({ props }) => (
  <div className="bg-primary overflow-x-auto rounded-xl border">
    <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
      <thead className="bg-primary">
        <tr>
          <th className="text-foreground rounded-tl-xl px-4 py-3 font-semibold">
            Prop
          </th>
          <th className="text-foreground px-4 py-3 font-semibold">Type</th>
          <th className="text-foreground rounded-tr-xl px-4 py-3 font-semibold">
            Default
          </th>
        </tr>
      </thead>
      <tbody>
        {props.map((prop, idx) => (
          <React.Fragment key={prop.name}>
            <tr
              className={
                "border-t transition-colors " +
                (idx % 2 === 0 ? "bg-primary/70" : "bg-primary/90")
              }
            >
              <td className="rounded-l-xl px-4 py-3 align-top">
                <span className="text-brand bg-background inline-flex items-center gap-1 rounded border px-2 py-1 font-mono text-xs font-semibold shadow-sm">
                  {prop.name}
                  {!prop.required && (
                    <span className="text-muted-foreground">?</span>
                  )}
                  {prop.description && (
                    <span className="ml-1 align-middle">
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              tabIndex={0}
                              aria-label="Show info"
                              className="focus:outline-none"
                            >
                              <InfoIcon />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-background max-w-xs border px-4 py-3 text-xs shadow-xl">
                            <span className="text-foreground whitespace-pre-line">
                              {prop.description}
                            </span>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </span>
                  )}
                </span>
              </td>
              <td className="px-4 py-3 align-top">
                <div
                  className="bg-background text-foreground inline-block max-w-xs overflow-x-auto rounded border px-2 py-1 font-mono text-xs font-semibold whitespace-nowrap shadow-sm"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  {prop.type}
                </div>
              </td>
              <td className="text-muted-foreground rounded-r-xl px-4 py-3 align-top font-mono text-xs">
                {prop.default !== undefined ? (
                  <span className="bg-background rounded-full border px-3 py-1 shadow-sm">
                    {prop.default}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  </div>
)

export default PropsTable
