"use client";

import Dialog, {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
} from "@repo/smoothui/components/dialog";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import { useState } from "react";

const DialogDemo = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <SmoothButton onClick={() => setDialogOpen(true)} variant="candy">
        Open Dialog
      </SmoothButton>
      <SmoothButton onClick={() => setAlertOpen(true)} variant="outline">
        Open Alert Dialog
      </SmoothButton>

      <Dialog
        description="This is a standard dialog. Press Escape or click the X to close."
        footer={
          <SmoothButton onClick={() => setDialogOpen(false)} variant="candy">
            Got it
          </SmoothButton>
        }
        onOpenChange={setDialogOpen}
        open={dialogOpen}
        title="Dialog Title"
      >
        <p className="text-muted-foreground text-sm">
          Dialog content goes here. This dialog supports keyboard navigation,
          focus trapping, and backdrop dismiss.
        </p>
      </Dialog>

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
        onOpenChange={setAlertOpen}
        open={alertOpen}
        title="Are you absolutely sure?"
      />
    </div>
  );
};

export default DialogDemo;
