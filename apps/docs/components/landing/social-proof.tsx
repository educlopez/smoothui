import { GithubStars } from "@docs/components/landing/navbar/github-stars";

// A slim credibility bar right under the hero — avatar stack + GitHub stars.
const FACES = [
  "orcdev",
  "jaykosai",
  "Lucas_Moveset",
  "Potato___Dragon",
  "openhunts",
  "PeteCapeCod",
];

export function SocialProof() {
  return (
    <section className="bg-background px-8 py-8 transition">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {FACES.map((handle) => (
              <img
                alt=""
                aria-hidden
                className="size-7 rounded-full border-2 border-background object-cover"
                draggable={false}
                height={28}
                key={handle}
                loading="lazy"
                src={`https://unavatar.io/x/${handle}`}
                width={28}
              />
            ))}
          </div>
          <span className="text-muted-foreground text-sm">
            Loved by developers building with shadcn/ui
          </span>
        </div>
        <span aria-hidden className="hidden h-4 w-px bg-border sm:block" />
        <GithubStars />
      </div>
    </section>
  );
}
