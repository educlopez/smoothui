"use client";

import FigmaComment from "@repo/smoothui/components/figma-comment";
import { getImageKitUrl } from "@smoothui/data";

export default function FigmaCommentDemo() {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-8 p-8">
      <FigmaComment
        authorName="Edu Calvo"
        avatarAlt="Edu's avatar"
        avatarUrl={getImageKitUrl(
          "https://ik.imagekit.io/16u211libb/avatar-educalvolpz.jpeg?updatedAt=1765524159631",
          {
            width: 48,
            height: 48,
            quality: 85,
            format: "auto",
          }
        )}
        message="What happens if we adjust this to handle a light and dark mode? I'm not sure if we're ready to handle..."
        timestamp="Just now"
        width={200}
      />
    </div>
  );
}
