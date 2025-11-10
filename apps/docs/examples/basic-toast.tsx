"use client";

import BasicToast from "@repo/smoothui/components/basic-toast";
import { useState } from "react";

const Example = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  const handleShowToast = (type: "success" | "error" | "info" | "warning") => {
    setToastType(type);
    setShowToast(true);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-md bg-emerald-500 px-3 py-1.5 text-sm text-white hover:bg-emerald-600"
          onClick={() => handleShowToast("success")}
          type="button"
        >
          Success Toast
        </button>
        <button
          className="rounded-md bg-red-500 px-3 py-1.5 text-sm text-white hover:bg-red-600"
          onClick={() => handleShowToast("error")}
          type="button"
        >
          Error Toast
        </button>
        <button
          className="rounded-md bg-amber-500 px-3 py-1.5 text-sm text-white hover:bg-amber-600"
          onClick={() => handleShowToast("warning")}
          type="button"
        >
          Warning Toast
        </button>
        <button
          className="rounded-md bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600"
          onClick={() => handleShowToast("info")}
          type="button"
        >
          Info Toast
        </button>
      </div>

      {showToast && (
        <BasicToast
          duration={3000}
          message={`This is a ${toastType} message example!`}
          onClose={() => setShowToast(false)}
          type={toastType}
        />
      )}
    </div>
  );
};

export default Example;
