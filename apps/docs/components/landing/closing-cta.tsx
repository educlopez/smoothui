import Divider from "@docs/components/landing/divider";
import { Button } from "@docs/components/smoothbutton";
import Link from "next/link";

export function ClosingCta() {
  return (
    <section className="relative bg-background px-8 py-28 transition">
      <Divider />
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <h2 className="text-balance font-semibold font-title text-3xl text-foreground tracking-tight md:text-4xl">
          Ship animated UI today
        </h2>
        <p className="max-w-md text-balance text-muted-foreground">
          50+ components, one command. Drop SmoothUI into your shadcn/ui project
          and start shipping.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="sm" variant="candy">
            <Link href="/docs/components">Browse components</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/docs/guides">Read the docs</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
