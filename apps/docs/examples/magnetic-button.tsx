import MagneticButton from "@repo/smoothui/components/magnetic-button";

export default function MagneticButtonDemo() {
  return (
    <div className="flex min-h-[350px] flex-col items-center justify-center gap-8">
      <p className="text-muted-foreground text-sm">
        Move your cursor near the buttons to see the magnetic effect
      </p>

      <div className="flex flex-wrap items-center justify-center gap-8">
        <MagneticButton variant="default">Default</MagneticButton>

        <MagneticButton variant="secondary">Secondary</MagneticButton>

        <MagneticButton variant="destructive">Destructive</MagneticButton>

        <MagneticButton variant="outline">Outline</MagneticButton>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-8">
        <MagneticButton size="sm" variant="default">
          Small
        </MagneticButton>

        <MagneticButton size="default" variant="default">
          Default
        </MagneticButton>

        <MagneticButton size="lg" variant="default">
          Large
        </MagneticButton>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-8">
        <MagneticButton strength={0.5} variant="secondary">
          Strong (0.5)
        </MagneticButton>

        <MagneticButton radius={100} strength={0.2} variant="outline">
          Subtle (0.2)
        </MagneticButton>

        <MagneticButton disabled variant="default">
          Disabled
        </MagneticButton>
      </div>
    </div>
  );
}
