"use client";

import GitHubStarsAnimation from "@repo/smoothui/components/github-stars-animation";

export default function GitHubStarsAnimationDemo() {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-8">
      <GitHubStarsAnimation
        maxAvatars={5}
        owner="educlopez"
        repo="smoothui"
        showAvatars
      />
      <GitHubStarsAnimation
        maxAvatars={3}
        owner="educlopez"
        repo="smoothui"
        showAvatars={false}
      />
    </div>
  );
}




