"use client";

import Dialog, {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
} from "@repo/smoothui/components/dialog";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import { useState } from "react";

const DialogScene = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-center p-8">
      <SmoothButton onClick={() => setOpen(true)} variant="candy">
        Open Dialog
      </SmoothButton>

      <Dialog
        description="This is a standard dialog. Press Escape or click the X to close."
        footer={
          <SmoothButton onClick={() => setOpen(false)} variant="candy">
            Got it
          </SmoothButton>
        }
        onOpenChange={setOpen}
        open={open}
        title="Dialog Title"
      >
        <p className="text-muted-foreground text-sm">
          Dialog content goes here. This dialog supports keyboard navigation,
          focus trapping, and backdrop dismiss.
        </p>
      </Dialog>
    </div>
  );
};

const AlertDialogScene = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-center p-8">
      <SmoothButton onClick={() => setOpen(true)} variant="outline">
        Open Alert Dialog
      </SmoothButton>

      <AlertDialog
        description="This action cannot be undone. This will permanently delete your account and remove your data."
        footer={
          <>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-gradient-to-b from-brand to-brand-secondary text-white hover:from-brand-secondary hover:to-brand-secondary">
              Continue
            </AlertDialogAction>
          </>
        }
        onOpenChange={setOpen}
        open={open}
        title="Are you absolutely sure?"
      />
    </div>
  );
};

export const demoScenes = {
  "Alert Dialog": AlertDialogScene,
  Dialog: DialogScene,
  Features: DialogScene,
};

export default function DialogDemo() {
  return <DialogScene />;
}
