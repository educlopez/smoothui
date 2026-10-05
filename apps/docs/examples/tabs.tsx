"use client";

import {
  TabsIndicator,
  TabsList,
  TabsPanel,
  TabsRoot,
  TabsTab,
} from "@repo/smoothui/components/tabs";

const FeaturesDemo = () => (
  <div className="flex w-full items-center justify-center p-8">
    <TabsRoot className="w-full max-w-md" defaultValue="overview">
      <TabsList variant="underline">
        <TabsTab value="overview">Overview</TabsTab>
        <TabsTab value="projects">Projects</TabsTab>
        <TabsTab value="account">Account</TabsTab>
        <TabsIndicator />
      </TabsList>
      <TabsPanel animated value="overview">
        Workspace stats and recent activity.
      </TabsPanel>
      <TabsPanel animated value="projects">
        Milestones, deadlines, and assignees.
      </TabsPanel>
      <TabsPanel animated value="account">
        Profile and notification preferences.
      </TabsPanel>
    </TabsRoot>
  </div>
);

const PillDemo = () => (
  <div className="flex w-full items-center justify-center p-8">
    <TabsRoot className="w-full max-w-sm" defaultValue="day">
      <TabsList className="mx-auto" variant="pill">
        <TabsTab value="day">Day</TabsTab>
        <TabsTab value="week">Week</TabsTab>
        <TabsTab value="month">Month</TabsTab>
        <TabsIndicator />
      </TabsList>
      <TabsPanel className="text-center" value="day">
        Daily view
      </TabsPanel>
      <TabsPanel className="text-center" value="week">
        Weekly view
      </TabsPanel>
      <TabsPanel className="text-center" value="month">
        Monthly view
      </TabsPanel>
    </TabsRoot>
  </div>
);

const SegmentDemo = () => (
  <div className="flex w-full items-center justify-center p-8">
    <TabsRoot className="w-full max-w-xs" defaultValue="list">
      <TabsList variant="segment">
        <TabsTab value="list">List</TabsTab>
        <TabsTab value="board">Board</TabsTab>
        <TabsTab value="calendar">Calendar</TabsTab>
        <TabsIndicator />
      </TabsList>
    </TabsRoot>
  </div>
);

const DisabledDemo = () => (
  <div className="flex w-full items-center justify-center p-8">
    <TabsRoot className="w-full max-w-md" defaultValue="overview">
      <TabsList variant="underline">
        <TabsTab value="overview">Overview</TabsTab>
        <TabsTab disabled value="billing">
          Billing
        </TabsTab>
        <TabsTab value="account">Account</TabsTab>
        <TabsIndicator />
      </TabsList>
      <TabsPanel value="overview">
        Billing is unavailable on this plan.
      </TabsPanel>
      <TabsPanel value="billing">Billing details.</TabsPanel>
      <TabsPanel value="account">Profile and preferences.</TabsPanel>
    </TabsRoot>
  </div>
);

export const demoScenes = {
  Disabled: DisabledDemo,
  Features: FeaturesDemo,
  Pill: PillDemo,
  Segment: SegmentDemo,
};

export default function TabsDemo() {
  return <FeaturesDemo />;
}
