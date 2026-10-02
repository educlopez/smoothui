"use client";

import Empty from "@repo/smoothui/components/empty";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import { InboxIcon, SearchIcon } from "lucide-react";

const FeaturesDemo = () => (
  <div className="w-full max-w-md p-4">
    <Empty
      action={<SmoothButton size="sm">Add item</SmoothButton>}
      description="Add your first item to get started."
      icon={<InboxIcon />}
      title="No items yet"
    />
  </div>
);

const SearchDemo = () => (
  <div className="w-full max-w-md p-4">
    <Empty
      description="Try a different keyword or clear filters."
      icon={<SearchIcon />}
      title="No results"
    />
  </div>
);

export const demoScenes = {
  Features: FeaturesDemo,
  Search: SearchDemo,
};

export default function EmptyDemo() {
  return <FeaturesDemo />;
}
