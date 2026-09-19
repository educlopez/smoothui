import { blogCover } from "@docs/lib/blog-cover";
import { ArtworkPattern } from "../landing/artwork-pattern";
import { BlogCoverIllustration } from "./blog-cover-illustration";

/** Decorative editorial layer; the adjacent post heading supplies its accessible name. */
export function BlogCoverArtwork({ seed }: { seed: string }) {
  const direction = blogCover(seed);
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center p-[7%] [container-type:inline-size]"
      data-blog-cover={direction.kind}
    >
      <ArtworkPattern variant={direction.pattern} />
      <div className="relative flex h-full w-full flex-col items-center justify-center rounded-[5cqw] border border-white/70 bg-white/75 px-[5%] py-[4%] text-center text-[#29272c] shadow-[0_12px_40px_#20102a18] backdrop-blur-md">
        <span className="font-mono text-[#514c58] text-[clamp(7px,1.8cqw,12px)] uppercase tracking-[0.18em]">
          SmoothUI Journal
        </span>
        <div className="min-h-0 w-[74%] flex-1 [&>svg]:h-full [&>svg]:w-full">
          <BlogCoverIllustration kind={direction.kind} />
        </div>
        <span className="text-balance font-semibold text-[clamp(13px,4cqw,36px)] leading-tight tracking-tight">
          {direction.label}
        </span>
        <span className="mt-[2%] text-[#514c58] text-[clamp(8px,2cqw,16px)]">
          {direction.detail}
        </span>
      </div>
    </div>
  );
}
