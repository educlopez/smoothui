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
        Edit profile
      </SmoothButton>

      <Dialog
        description="Update your public profile details."
        footer={
          <SmoothButton onClick={() => setOpen(false)} variant="candy">
            Save
          </SmoothButton>
        }
        onOpenChange={setOpen}
        open={open}
        title="Edit profile"
      >
        <p className="text-muted-foreground text-sm">
          Changes apply to your workspace profile and public bio.
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
        Delete account
      </SmoothButton>

      <AlertDialog
        description="This permanently deletes your account and all workspace data."
        footer={
          <>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-gradient-to-b from-brand to-brand-secondary text-white hover:from-brand-secondary hover:to-brand-secondary">
              Delete
            </AlertDialogAction>
          </>
        }
        onOpenChange={setOpen}
        open={open}
        title="Delete account?"
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
