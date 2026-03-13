"use client";

import SmoothButton from "@repo/smoothui/components/smooth-button";
import AnimatedStepper from "@repo/smoothui/components/animated-stepper";
import { useState } from "react";

const steps = [
  {
    label: "Account",
    description: "Create your account",
    content: (
      <div className="rounded-lg border bg-muted/30 p-6">
        <h3 className="mb-2 font-medium">Account Details</h3>
        <p className="text-muted-foreground text-sm">
          Enter your email and create a password to get started.
        </p>
      </div>
    ),
  },
  {
    label: "Profile",
    description: "Set up your profile",
    content: (
      <div className="rounded-lg border bg-muted/30 p-6">
        <h3 className="mb-2 font-medium">Profile Information</h3>
        <p className="text-muted-foreground text-sm">
          Add your name, avatar, and bio to personalize your experience.
        </p>
      </div>
    ),
  },
  {
    label: "Preferences",
    description: "Choose your preferences",
    content: (
      <div className="rounded-lg border bg-muted/30 p-6">
        <h3 className="mb-2 font-medium">Preferences</h3>
        <p className="text-muted-foreground text-sm">
          Select your notification preferences and theme.
        </p>
      </div>
    ),
  },
  {
    label: "Complete",
    description: "You're all set",
    content: (
      <div className="rounded-lg border bg-muted/30 p-6">
        <h3 className="mb-2 font-medium">All Done!</h3>
        <p className="text-muted-foreground text-sm">
          Your account is ready. Start exploring the platform.
        </p>
      </div>
    ),
  },
];

export default function AnimatedStepperDemo() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8 p-4">
      <AnimatedStepper
        allowClickNavigation
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        steps={steps}
      />

      <div className="flex justify-between">
        <SmoothButton
          disabled={currentStep === 0}
          onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
          size="sm"
          variant="outline"
        >
          Previous
        </SmoothButton>
        <SmoothButton
          disabled={currentStep === steps.length - 1}
          onClick={() =>
            setCurrentStep((s) => Math.min(steps.length - 1, s + 1))
          }
          size="sm"
          variant="candy"
        >
          Next
        </SmoothButton>
      </div>
    </div>
  );
}
