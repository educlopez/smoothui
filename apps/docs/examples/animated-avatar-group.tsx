"use client";

import AnimatedAvatarGroup from "@repo/smoothui/components/animated-avatar-group";

const avatars = [
  { src: "https://i.pravatar.cc/150?img=1", alt: "User 1" },
  { src: "https://i.pravatar.cc/150?img=2", alt: "User 2" },
  { src: "https://i.pravatar.cc/150?img=3", alt: "User 3" },
  { src: "https://i.pravatar.cc/150?img=4", alt: "User 4" },
  { src: "https://i.pravatar.cc/150?img=5", alt: "User 5" },
  { src: "https://i.pravatar.cc/150?img=6", alt: "User 6" },
  { src: "https://i.pravatar.cc/150?img=7", alt: "User 7" },
  { src: "https://i.pravatar.cc/150?img=8", alt: "User 8" },
];

const AnimatedAvatarGroupDemo = () => (
  <div className="flex min-h-[300px] flex-col items-center justify-center gap-12">
    <AnimatedAvatarGroup avatars={avatars} />
    <AnimatedAvatarGroup avatars={avatars} maxVisible={6} size={48} />
  </div>
);

export default AnimatedAvatarGroupDemo;
