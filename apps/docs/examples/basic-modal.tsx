"use client";

import BasicModal from "@repo/smoothui/components/basic-modal";
import { useState } from "react";

const Example = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4">
      <button
        className="rounded-lg bg-brand px-4 py-2 text-white transition-colors hover:bg-brand/90"
        onClick={() => setIsOpen(true)}
      >
        Open Modal
      </button>

      <BasicModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size="md"
        title="Example Modal"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            This is an example of the BasicModal component. You can customize
            the content here.
          </p>
          <div className="flex justify-end space-x-2">
            <button
              className="px-4 py-2 text-gray-600 transition-colors hover:text-gray-800"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <button
              className="rounded-lg bg-brand px-4 py-2 text-white transition-colors hover:bg-brand/90"
              onClick={() => setIsOpen(false)}
            >
              Confirm
            </button>
          </div>
        </div>
      </BasicModal>
    </div>
  );
};

export default Example;
