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
    <section className="relative isolate z-20 bg-background px-6 py-10 transition sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 text-center sm:flex-row sm:gap-6 sm:text-left">
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <div className="flex shrink-0 -space-x-2">
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
          <span className="max-w-[16rem] text-pretty text-muted-foreground text-sm sm:max-w-none">
            Loved by developers building with shadcn/ui
          </span>
        </div>
        <span aria-hidden className="hidden h-4 w-px bg-border sm:block" />
        <GithubStars />
      </div>
    </section>
  );
}
