"use client";

import {
  INVITE_HOSTS,
  INVITES,
  inviteImage,
} from "@docs/examples/shared/demo-fixtures";
import AppleInvites, {
  type Event,
} from "@repo/smoothui/components/apple-invites";

const AVATAR_SIZE = 72;

const demoEvents: Event[] = INVITES.map((invite, index) => ({
  badge: invite.badge,
  id: invite.id,
  image: inviteImage(invite.scene, 640, 900),
  location: invite.location,
  participants: [
    {
      avatar: `${INVITE_HOSTS[index].avatar}?tr=w-${AVATAR_SIZE},h-${AVATAR_SIZE},f-auto`,
    },
  ],
  subtitle: invite.subtitle,
  title: invite.title,
}));

const Example = () => (
  <div className="flex min-h-[500px] items-center justify-center">
    <AppleInvites
      cardWidth={{
        base: 100,
        lg: 220,
        md: 180,
        sm: 140,
        xl: 260,
      }}
      events={demoEvents}
    />
  </div>
);

export default Example;
