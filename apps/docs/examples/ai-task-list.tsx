"use client";

import AITaskList, {
  type AITask,
} from "@repo/smoothui/components/ai-task-list";
import { useEffect, useState } from "react";

const STEP_MS = 1400;

const buildTasks = (progress: number): AITask[] => {
  const statusAt = (index: number): AITask["status"] => {
    if (index < progress) {
      return "done";
    }
    if (index === progress) {
      return "running";
    }
    return "pending";
  };

  return [
    {
      id: "verify",
      label: "Verify vendor records",
      note: "12 suppliers",
      status: statusAt(0),
      children: [
        {
          id: "verify-ids",
          label: "Match tax and contact IDs",
          note: "12/12",
          status: statusAt(0),
        },
        {
          id: "verify-stale",
          label: "Flag stale records",
          note: "0",
          status: statusAt(0),
        },
      ],
    },
    {
      id: "reorder",
      label: "Build reorder task list",
      note: "7 SKUs",
      status: statusAt(1),
      children: [
        {
          id: "reorder-pos",
          label: "Read the POS export",
          note: "3 files",
          status: statusAt(1),
        },
        {
          id: "reorder-risk",
          label: "Score stockout risk",
          note: "68%",
          status: statusAt(1),
        },
      ],
    },
    {
      id: "email",
      label: "Draft supplier emails",
      note: "2 messages",
      status: progress > 2 ? "failed" : statusAt(2),
    },
  ];
};

const Example = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setProgress((current) => (current + 1) % 4),
      STEP_MS
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto w-full max-w-md p-8">
      {/* Only the running row animates. Completed rows settle and go quiet. */}
      <AITaskList label="Reorder run" tasks={buildTasks(progress)} />
    </div>
  );
};

export default Example;
