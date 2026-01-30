import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "./smoothbutton";

export function SponsorsEmptyState() {
  return (
    <div className="not-prose mb-12 rounded-lg border border-dashed bg-linear-to-br from-background via-background to-brand/5 p-12 text-center">
      <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border bg-linear-to-br from-background via-background to-brand/10">
        <Heart className="absolute top-1/2 left-1/2 z-1 h-6 w-6 -translate-x-1/2 -translate-y-1/2 fill-red-500 text-red-500" />
        <Heart className="absolute top-1/2 left-1/2 z-0 h-8 w-8 -translate-x-1/2 -translate-y-1/2 animate-pulse fill-red-500 text-red-500 opacity-75" />
      </div>
      <h3 className="mb-2 font-semibold text-foreground text-lg">
        No Active Sponsors Yet
      </h3>
      <p className="mb-6 text-foreground/70">
        We&apos;re looking for sponsors to help support SmoothUI! Your
        sponsorship helps us continue building and improving this project for
        the community.
      </p>
      <Button asChild variant="outline">
        <Link
          className="no-prose no-underline"
          href="https://github.com/sponsors/educlopez"
          rel="noopener noreferrer"
          target="_blank"
        >
          Become a Sponsor
        </Link>
      </Button>
    </div>
  );
}
