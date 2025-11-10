"use client";

import { Button } from "@docs/components/smoothbutton";
import BasicModal from "@repo/smoothui/components/basic-modal";
import { useState } from "react";

const Example = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)} variant="candy">
        Open Modal
      </Button>

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
            <Button onClick={() => setIsOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={() => setIsOpen(false)} variant="candy">
              Confirm
            </Button>
          </div>
        </div>
      </BasicModal>
    </div>
  );
};

export default Example;
