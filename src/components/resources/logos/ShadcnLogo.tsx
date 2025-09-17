import { cn } from "@/components/smoothui/utils/cn"

interface ShadcnLogoProps {
  className?: string
}

export function ShadcnLogo({ className, ...props }: ShadcnLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="1em"
      height="1em"
      fill="currentColor"
      {...props}
      className={cn("h-6 w-6", className)}
    >
      <title>shadcn/ui logo</title>
      <path fill="none" d="M0 0h256v256H0z" />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth={25}
        strokeLinecap="round"
        d="M208 128l-80 80M192
40L40 192"
      />
    </svg>
  )
}
