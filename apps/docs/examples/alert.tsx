"use client";

import Alert from "@repo/smoothui/components/alert";

const FeaturesDemo = () => (
  <div className="flex w-full max-w-md flex-col gap-3 p-8">
    <Alert title="Heads up">Your changes have been saved.</Alert>
    <Alert title="Synced" variant="success">
      Everything is up to date.
    </Alert>
    <Alert title="Review needed" variant="warning">
      Three items need attention before publish.
    </Alert>
    <Alert title="Action failed" variant="destructive">
      Could not delete the project. Try again.
    </Alert>
  </div>
);

export const demoScenes = {
  Features: FeaturesDemo,
};

export default function AlertDemo() {
  return <FeaturesDemo />;
}
