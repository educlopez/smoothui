"use client";

import FigmaComment from "@repo/smoothui/components/figma-comment";
import { getImageKitUrl } from "@smoothui/data";
import { somePeople } from "@smoothui/data/people";

const [PERSON] = somePeople(1, 11);

export default function FigmaCommentDemo() {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-8 p-8">
      <FigmaComment
        authorName={PERSON.name}
        avatarAlt={PERSON.name}
        avatarUrl={getImageKitUrl(`${PERSON.avatar}`, {
          format: "auto",
          height: 48,
          quality: 85,
          width: 48,
        })}
        message="What happens if we adjust this to handle a light and dark mode? I'm not sure if we're ready to handle..."
        timestamp="Just now"
        width={200}
      />
    </div>
  );
}
