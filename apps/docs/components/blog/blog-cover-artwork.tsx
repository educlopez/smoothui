import { blogCover } from "@docs/lib/blog-cover";
import { ArtworkPattern } from "../landing/artwork-pattern";
import { BlogCoverIllustration } from "./blog-cover-illustration";

/**
 * Decorative Oat fragment over the vivid landscape stage.
 * No titles — the post heading outside supplies the accessible name.
 */
export function BlogCoverArtwork({ seed }: { seed: string }) {
  const direction = blogCover(seed);
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center p-[8%] [container-type:inline-size]"
      data-blog-cover={direction.kind}
    >
      <ArtworkPattern variant={direction.pattern} />
      <div className="relative z-10 flex size-full items-center justify-center">
        <BlogCoverIllustration kind={direction.kind} />
      </div>
    </div>
  );
}
