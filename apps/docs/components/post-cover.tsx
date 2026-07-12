import { cn } from "@repo/shadcn-ui/lib/utils";
import Image from "next/image";

// On-brand mesh-gradient fallbacks. Posts without an `image` get a deterministic
// one based on their slug, so every post still has a distinct cover.
const GRADIENTS = [
  [
    "radial-gradient(ellipse 80% 60% at 20% 30%, var(--color-brand) 0%, transparent 60%)",
    "radial-gradient(ellipse 60% 80% at 75% 70%, var(--color-brand-secondary) 0%, transparent 55%)",
    "radial-gradient(ellipse 50% 50% at 55% 20%, var(--color-brand-light) 0%, transparent 50%)",
    "linear-gradient(135deg, var(--color-brand-secondary) 0%, var(--color-brand-light) 100%)",
  ],
  [
    "radial-gradient(ellipse 70% 70% at 80% 25%, var(--color-brand) 0%, transparent 55%)",
    "radial-gradient(ellipse 60% 60% at 25% 75%, var(--color-brand-light) 0%, transparent 55%)",
    "radial-gradient(ellipse 50% 50% at 50% 50%, var(--color-brand-lighter) 0%, transparent 60%)",
    "linear-gradient(120deg, var(--color-brand-light) 0%, var(--color-brand-secondary) 100%)",
  ],
  [
    "radial-gradient(ellipse 65% 75% at 35% 80%, var(--color-brand-secondary) 0%, transparent 55%)",
    "radial-gradient(ellipse 70% 60% at 70% 20%, var(--color-brand) 0%, transparent 55%)",
    "radial-gradient(ellipse 45% 45% at 20% 30%, var(--color-brand-lighter) 0%, transparent 55%)",
    "linear-gradient(150deg, var(--color-brand-secondary) 0%, var(--color-brand-lighter) 100%)",
  ],
];

function gradientFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 100_000;
  }
  return GRADIENTS[hash % GRADIENTS.length].join(", ");
}

export function PostCover({
  image,
  alt = "",
  seed,
  className,
  sizes = "(max-width: 768px) 100vw, 400px",
}: {
  image?: string;
  alt?: string;
  seed: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {image ? (
        <Image
          alt={alt}
          className="object-cover object-center"
          draggable={false}
          fill
          sizes={sizes}
          src={image}
        />
      ) : (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: gradientFor(seed) }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-40 mix-blend-soft-light"
            style={{
              backgroundImage:
                "radial-gradient(circle at 70% 25%, white 0%, transparent 40%)",
            }}
          />
        </>
      )}
    </div>
  );
}
