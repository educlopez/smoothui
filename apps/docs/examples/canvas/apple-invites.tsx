"use client";

import {
  INVITE_HOSTS,
  INVITES,
  inviteImage,
} from "@docs/examples/shared/demo-fixtures";
import type { Event } from "@repo/smoothui/components/apple-invites";
import AppleInvites from "@repo/smoothui/components/apple-invites";

/** The component autoplays on its own; this is just a slightly brisker pace. */
const INTERVAL_MS = 2800;
const CARD_WIDTH = 140;

const events: Event[] = INVITES.map((invite, index) => ({
  badge: invite.badge,
  id: invite.id,
  image: inviteImage(invite.scene, 400, 640),
  location: invite.location,
  participants: [
    { avatar: `${INVITE_HOSTS[index].avatar}?tr=w-72,h-72,f-auto` },
  ],
  subtitle: invite.subtitle,
  title: invite.title,
}));

/**
 * Already self-driving — the invitation deck advances on its own interval, and
 * the neighbours lean in either side. The wrapper only supplies the fixed box
 * the component measures itself against.
 */
const AppleInvitesCanvasDemo = () => (
  <div className="h-[248px] w-[330px] overflow-hidden">
    <AppleInvites
      cardWidth={CARD_WIDTH}
      events={events}
      interval={INTERVAL_MS}
    />
  </div>
);

export default AppleInvitesCanvasDemo;
