import MagneticButton from "@repo/smoothui/components/magnetic-button";

export default function MagneticButtonDemo() {
  return (
    <div className="flex min-h-[250px] flex-col items-center justify-center gap-8">
      <p className="text-muted-foreground text-sm">
        Move your cursor near the buttons to see the magnetic effect
      </p>

      <div className="flex items-center gap-12">
        <MagneticButton variant="default">Get Started</MagneticButton>

        <MagneticButton variant="outline">Learn More</MagneticButton>

        <MagneticButton variant="secondary">Contact Us</MagneticButton>
      </div>
    </div>
  );
}
