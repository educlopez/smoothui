import { cn } from "@repo/shadcn-ui/lib/utils";

interface LandingAtmosphereProps {
  className?: string;
  /** Softens the vignette for photo-backed sections. */
  tone?: "default" | "on-dark";
}

export function LandingAtmosphere({
  className,
  tone = "default",
}: LandingAtmosphereProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden",
        className
      )}
    >
      <div className="landing-grain absolute inset-0" />
      <div
        className={cn(
          "landing-vignette absolute inset-0",
          tone === "on-dark" && "landing-vignette-dark"
        )}
      />
    </div>
  );
}
