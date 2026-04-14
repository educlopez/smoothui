"use client";

import BasicModal from "@repo/smoothui/components/basic-modal";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import { useState } from "react";

const Example = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <SmoothButton onClick={() => setIsOpen(true)} variant="candy">
        Open Modal
      </SmoothButton>

      <BasicModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size="md"
        title="Example Modal"
      >
        <div className="space-y-4">
          <p className="text-foreground/70">
            This is an example of the BasicModal component. You can customize
            the content here.
          </p>
          <div className="flex justify-end space-x-2">
            <SmoothButton onClick={() => setIsOpen(false)} variant="outline">
              Cancel
            </SmoothButton>
            <SmoothButton onClick={() => setIsOpen(false)} variant="candy">
              Confirm
            </SmoothButton>
          </div>
        </div>
      </BasicModal>
    </div>
  );
};

export default Example;
