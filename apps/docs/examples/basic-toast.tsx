"use client";

import BasicToast from "@repo/smoothui/components/basic-toast";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";
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
        <SmoothButton
          onClick={() => handleShowToast("success")}
          size="sm"
          variant="outline"
        >
          <CheckCircle className="h-4 w-4 text-emerald-500" />
          Success
        </SmoothButton>
        <SmoothButton
          onClick={() => handleShowToast("error")}
          size="sm"
          variant="outline"
        >
          <XCircle className="h-4 w-4 text-red-500" />
          Error
        </SmoothButton>
        <SmoothButton
          onClick={() => handleShowToast("warning")}
          size="sm"
          variant="outline"
        >
          <AlertCircle className="h-4 w-4 text-amber-500" />
          Warning
        </SmoothButton>
        <SmoothButton
          onClick={() => handleShowToast("info")}
          size="sm"
          variant="outline"
        >
          <Info className="h-4 w-4 text-blue-500" />
          Info
        </SmoothButton>
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
