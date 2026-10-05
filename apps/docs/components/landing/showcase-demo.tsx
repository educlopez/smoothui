"use client";

import {
  METADATA_DESCRIPTION,
  METADATA_DETAILS,
  METADATA_SCENE,
  PHOTO_TABS,
  sceneSrc,
} from "@docs/examples/shared/demo-fixtures";

import Checkbox from "@repo/smoothui/components/checkbox";
import DynamicIsland from "@repo/smoothui/components/dynamic-island";
import ImageMetadataPreview from "@repo/smoothui/components/image-metadata-preview";
import NumberFlow from "@repo/smoothui/components/number-flow";
import PhotoStack, {
  type PhotoStackPhoto,
} from "@repo/smoothui/components/photo-stack";
import Phototab, { type PhototabTab } from "@repo/smoothui/components/phototab";
import UserAccountAvatar from "@repo/smoothui/components/user-account-avatar";
import { getImageKitUrl } from "@smoothui/data";
import { castAnimals, castPeople } from "@smoothui/data/cast";
import { somePeople } from "@smoothui/data/people";
import { Mountain, TreePine, Waves } from "lucide-react";
import { useId, useState } from "react";

const [AVATAR_PERSON] = somePeople(1, 7);
const SCENE = `${METADATA_SCENE.src}?tr=w-800,f-auto`;

function IslandDemo() {
  const [view, setView] = useState<"idle" | "ring" | "timer">("idle");
  return (
    <div className="motion-reduce:[&_div]:!filter-none w-full -translate-y-8 [&_button[aria-label=music]]:hidden [&_button[aria-label=notification]]:hidden [&_button]:min-h-10 [&_button]:min-w-10">
      <DynamicIsland
        idleContent={
          <span className="block px-6 py-3 text-sm text-white">
            Clear skies · 22°
          </span>
        }
        ringContent={
          <span className="block px-6 py-3 text-sm text-white">
            Incoming call · Preview
          </span>
        }
        timerContent={
          <span className="block px-10 py-3 font-mono text-white">05:00</span>
        }
        view={view}
        onViewChange={(next) => {
          if (next === "idle" || next === "ring" || next === "timer") {
            setView(next);
          }
        }}
      />
    </div>
  );
}

function CounterDemo() {
  const [value, setValue] = useState(128);
  return (
    <div className="flex min-h-52 items-center justify-center">
      <NumberFlow onChange={setValue} value={value} />
    </div>
  );
}

function MetadataDemo() {
  const [message, setMessage] = useState("");
  const share = async () => {
    try {
      await navigator.clipboard.writeText(SCENE);
      setMessage("Image link copied.");
    } catch {
      setMessage("Unable to copy the image link.");
    }
  };
  return (
    <div
      data-metadata-stage
      className="relative h-[520px] w-full [&>div]:left-1/2 [&>div]:w-full [&>div]:max-w-[300px] [&>div]:-translate-x-1/2 [&_button[aria-label=Connect]]:hidden [&_img]:h-auto [&_img]:w-full"
    >
      <ImageMetadataPreview
        imageSrc={SCENE}
        alt={METADATA_SCENE.alt}
        filename={`${METADATA_SCENE.id}.webp`}
        description={METADATA_DESCRIPTION}
        metadata={METADATA_DETAILS}
        onShare={share}
      />
      <p
        className="absolute inset-x-0 bottom-0 text-center text-muted-foreground text-xs"
        role="status"
      >
        {message}
      </p>
    </div>
  );
}

export function ShowcaseDemo({ slug }: { slug: string }) {
  if (slug === "user-account-avatar") {
    return <AvatarDemo />;
  }
  if (slug === "checkbox") {
    return <CheckboxDemo />;
  }
  if (slug === "dynamic-island") {
    return <IslandDemo />;
  }
  if (slug === "number-flow") {
    return <CounterDemo />;
  }
  if (slug === "phototab") {
    return <PhototabDemo />;
  }
  if (slug === "photo-stack") {
    return <PhotoStackDemo />;
  }
  return <MetadataDemo />;
}

const PHOTO_TAB_ICONS = [
  <Mountain key="mountain" />,
  <Waves key="waves" />,
  <TreePine key="trees" />,
];

function PhototabDemo() {
  const tabs: PhototabTab[] = PHOTO_TABS.map((tab, index) => ({
    icon: PHOTO_TAB_ICONS[index],
    image: sceneSrc(tab.scene, "w-600,h-600"),
    name: tab.name,
  }));
  return (
    <div className="flex w-full justify-center">
      <Phototab
        height={360}
        tabListClassName="translate-y-0! md:translate-y-0!"
        tabs={tabs}
      />
    </div>
  );
}

const STACK_PHOTOS: PhotoStackPhoto[] = [
  castPeople[0],
  castPeople[3],
  castPeople[13],
  ...castAnimals.slice(0, 1),
].map((image) => ({
  alt: image.alt,
  id: image.id,
  name: image.name,
  role: image.role,
  src: `${image.src}?tr=w-640,h-800,f-auto`,
}));

function PhotoStackDemo() {
  return (
    <div className="flex items-center justify-center py-4">
      <PhotoStack className="-translate-x-2.5" photos={STACK_PHOTOS} />
    </div>
  );
}

function CheckboxDemo() {
  const [checked, setChecked] = useState(false);
  const id = useId();
  return (
    <div className="flex min-h-52 items-center justify-center gap-3">
      <Checkbox checked={checked} id={id} onCheckedChange={setChecked} />
      <label
        className="flex min-h-11 cursor-pointer items-center text-sm"
        htmlFor={id}
      >
        Check this out
      </label>
    </div>
  );
}

function AvatarDemo() {
  const [user, setUser] = useState({
    avatar: getImageKitUrl(AVATAR_PERSON.avatar, {
      format: "auto",
      height: 96,
      width: 96,
    }),
    email: AVATAR_PERSON.email,
    name: AVATAR_PERSON.name,
  });
  const [order, setOrder] = useState("");
  return (
    <div className="[&_[data-radix-popper-content-wrapper]]:!relative [&_[data-radix-popper-content-wrapper]]:!transform-none [&_[data-radix-popper-content-wrapper]]:!min-w-0 flex w-full flex-col items-center gap-3 [&_[role=dialog]]:max-w-full">
      <UserAccountAvatar
        inline
        user={user}
        onProfileSave={setUser}
        onOrderView={setOrder}
        orders={[
          {
            date: "2026-09-19",
            id: "ORD100",
            progress: 100,
            status: "delivered",
          },
        ]}
      />
      {order ? (
        <p role="status" className="text-muted-foreground text-xs">
          Selected order {order}
        </p>
      ) : null}
    </div>
  );
}
