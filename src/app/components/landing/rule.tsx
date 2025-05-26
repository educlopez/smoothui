interface RuleProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  className?: string
}

export default function Rule({ position = "top-left", className }: RuleProps) {
  const getPositionClasses = (corner: string) => {
    switch (corner) {
      case "top-left":
        return "-left-[3px] -top-[3px]"
      case "top-right":
        return "-right-[3px] -top-[3px]"
      case "bottom-left":
        return "-left-[3px] -bottom-[3px]"
      case "bottom-right":
        return "-right-[3px] -bottom-[3px]"
      default:
        return "-left-[3px] -top-[3px]"
    }
  }

  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`absolute ${getPositionClasses(position)} text-smooth-950 z-2 transition ${className}`}
    >
      <path
        opacity="0.4"
        d="M4 0V8M8 4L0 4"
        stroke="currentColor"
        fillOpacity="0.4"
      />
    </svg>
  )
}
