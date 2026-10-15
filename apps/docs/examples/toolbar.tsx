"use client";

import Toolbar, {
  ToolbarButton,
  ToolbarGroup,
  ToolbarLink,
  ToolbarSeparator,
} from "@repo/smoothui/components/toolbar";
import { Bold, Italic, Underline } from "lucide-react";

const FeaturesDemo = () => (
  <div className="flex items-center justify-center p-8">
    <Toolbar>
      <ToolbarGroup aria-label="Text style">
        <ToolbarButton aria-label="Bold">
          <Bold className="size-4" />
        </ToolbarButton>
        <ToolbarButton aria-label="Italic">
          <Italic className="size-4" />
        </ToolbarButton>
        <ToolbarButton aria-label="Underline">
          <Underline className="size-4" />
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup aria-label="Actions">
        <ToolbarButton>Save</ToolbarButton>
        <ToolbarButton>Share</ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarLink href="#">Edited 2m ago</ToolbarLink>
    </Toolbar>
  </div>
);

const VerticalDemo = () => (
  <div className="flex items-center justify-center p-8">
    <Toolbar orientation="vertical">
      <ToolbarButton aria-label="Bold">
        <Bold className="size-4" />
      </ToolbarButton>
      <ToolbarButton aria-label="Italic">
        <Italic className="size-4" />
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton>Save</ToolbarButton>
    </Toolbar>
  </div>
);

export const demoScenes = {
  Features: FeaturesDemo,
  Vertical: VerticalDemo,
};

export default function ToolbarDemo() {
  return <FeaturesDemo />;
}
