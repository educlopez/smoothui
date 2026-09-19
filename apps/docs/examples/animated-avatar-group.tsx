"use client";

import AnimatedAvatarGroup from "@repo/smoothui/components/animated-avatar-group";
import { somePeople } from "@smoothui/data/people";

const avatars = somePeople(8).map((person) => ({
  alt: person.name,
  src: `${person.avatar}?tr=w-150,h-150,f-auto`,
}));

const AnimatedAvatarGroupDemo = () => (
  <div className="flex min-h-[300px] flex-col items-center justify-center gap-12">
    <AnimatedAvatarGroup avatars={avatars} />
    <AnimatedAvatarGroup avatars={avatars} maxVisible={6} size={48} />
  </div>
);

export default AnimatedAvatarGroupDemo;
