"use client";

import AnimatedFileUpload from "@repo/smoothui/components/animated-file-upload";

export default function AnimatedFileUploadDemo() {
  return (
    <div className="mx-auto w-full max-w-md p-4">
      <AnimatedFileUpload
        accept="image/*,.pdf,.doc,.docx"
        maxSize={10 * 1024 * 1024}
        onFilesSelected={() => {}}
      />
    </div>
  );
}
