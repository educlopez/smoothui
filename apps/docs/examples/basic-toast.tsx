"use client";

import BasicToast from "@repo/smoothui/components/basic-toast";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import { useState } from "react";

type ToastType = "success" | "error" | "info" | "warning";

const ToastScene = ({ type }: { type: ToastType }) => {
  const [showToast, setShowToast] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <SmoothButton
        onClick={() => setShowToast(true)}
        size="sm"
        variant="outline"
      >
        Show {type}
      </SmoothButton>

      {showToast ? (
        <BasicToast
          duration={3000}
          message={`This is a ${type} message example!`}
          onClose={() => setShowToast(false)}
          type={type}
        />
      ) : null}
    </div>
  );
};

const SuccessDemo = () => <ToastScene type="success" />;
const ErrorDemo = () => <ToastScene type="error" />;
const WarningDemo = () => <ToastScene type="warning" />;
const InfoDemo = () => <ToastScene type="info" />;

export const demoScenes = {
  Error: ErrorDemo,
  Features: SuccessDemo,
  Info: InfoDemo,
  Success: SuccessDemo,
  Warning: WarningDemo,
};

export default function BasicToastDemo() {
  return <SuccessDemo />;
}
