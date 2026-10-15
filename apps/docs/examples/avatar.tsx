"use client";

import Avatar, { AvatarGroup } from "@repo/smoothui/components/avatar";
import { getAvatarUrl, somePeople } from "@smoothui/data";

const PEOPLE = somePeople(5);
const [ada, grace, linus, margaret, alan] = PEOPLE;

const FeaturesDemo = () => (
  <div className="flex items-center justify-center gap-4 p-8">
    <Avatar
      alt={ada.name}
      fallback={ada.initials}
      size="sm"
      src={getAvatarUrl(ada.avatar, 24)}
    />
    <Avatar
      alt={grace.name}
      fallback={grace.initials}
      size="md"
      src={getAvatarUrl(grace.avatar, 32)}
    />
    <Avatar
      alt={linus.name}
      fallback={linus.initials}
      size="lg"
      src={getAvatarUrl(linus.avatar, 40)}
    />
  </div>
);

const GroupDemo = () => (
  <div className="flex items-center justify-center p-8">
    <AvatarGroup aria-label="Project members" max={3}>
      <Avatar
        alt={ada.name}
        fallback={ada.initials}
        src={getAvatarUrl(ada.avatar, 32)}
      />
      <Avatar
        alt={grace.name}
        fallback={grace.initials}
        src={getAvatarUrl(grace.avatar, 32)}
      />
      <Avatar
        alt={linus.name}
        fallback={linus.initials}
        src={getAvatarUrl(linus.avatar, 32)}
      />
      <Avatar
        alt={margaret.name}
        fallback={margaret.initials}
        src={getAvatarUrl(margaret.avatar, 32)}
      />
      <Avatar
        alt={alan.name}
        fallback={alan.initials}
        src={getAvatarUrl(alan.avatar, 32)}
      />
    </AvatarGroup>
  </div>
);

const StatusDemo = () => (
  <div className="flex items-center justify-center gap-4 p-8">
    <Avatar
      alt={ada.name}
      fallback={ada.initials}
      size="lg"
      src={getAvatarUrl(ada.avatar, 40)}
      status="online"
    />
    <Avatar
      alt={grace.name}
      fallback={grace.initials}
      size="lg"
      src={getAvatarUrl(grace.avatar, 40)}
      status="away"
    />
    <Avatar
      alt={linus.name}
      fallback={linus.initials}
      size="lg"
      src={getAvatarUrl(linus.avatar, 40)}
      status="busy"
    />
    <Avatar
      alt={margaret.name}
      fallback={margaret.initials}
      size="lg"
      src={getAvatarUrl(margaret.avatar, 40)}
      status="offline"
    />
  </div>
);

export const demoScenes = {
  Features: FeaturesDemo,
  Group: GroupDemo,
  Status: StatusDemo,
};

export default function AvatarDemo() {
  return <FeaturesDemo />;
}
