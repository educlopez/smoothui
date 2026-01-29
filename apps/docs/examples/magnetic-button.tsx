import MagneticButton from "@repo/smoothui/components/magnetic-button";

export default function MagneticButtonDemo() {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-8">
      <div className="text-center">
        <p className="mb-4 text-muted-foreground text-sm">
          Move your cursor near the buttons to see the magnetic effect
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-12">
        <MagneticButton>Default</MagneticButton>

        <MagneticButton strength={0.5} className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
          Strong (0.5)
        </MagneticButton>

        <MagneticButton strength={0.2} radius={100} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
          Subtle (0.2)
        </MagneticButton>
      </div>

      <div className="mt-4">
        <MagneticButton disabled className="bg-muted text-muted-foreground">
          Disabled
        </MagneticButton>
      </div>
    </div>
  );
}
