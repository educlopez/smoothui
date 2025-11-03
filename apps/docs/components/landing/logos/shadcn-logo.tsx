import { cn } from "@repo/shadcn-ui/lib/utils";

interface ShadcnLogoProps {
  className?: string;
}

export function ShadcnLogo({ className, ...props }: ShadcnLogoProps) {
  return (
    <svg
      fill="currentColor"
      height="1em"
      viewBox="0 0 256 256"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={cn("h-6 w-6", className)}
    >
      <title>shadcn/ui logo</title>
      <path d="M0 0h256v256H0z" fill="none" />
      <path
        d="M208 128l-80 80M192
40L40 192"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={25}
      />
    </svg>
  );
}
