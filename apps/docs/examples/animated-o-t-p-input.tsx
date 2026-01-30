"use client";

import { Button } from "@repo/shadcn-ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/shadcn-ui/components/ui/card";
import { AnimatedOTPInput } from "@repo/smoothui/components/animated-o-t-p-input";
import { CheckCircle, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export function AnimatedOTPInputDemo() {
  const [value, setValue] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = (otp: string) => {
    setValue(otp);
    setIsComplete(true);
    setIsLoading(true);

    // Simulate verification process
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleReset = () => {
    setValue("");
    setIsComplete(false);
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-bold text-2xl">Verify Your Code</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to your device
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <AnimatedOTPInput
              maxLength={6}
              onChange={setValue}
              onComplete={handleComplete}
              value={value}
            />
          </div>

          {isComplete && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 text-center"
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Verifying code...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">
                    Code verified successfully!
                  </span>
                </div>
              )}
            </motion.div>
          )}

          <div className="flex justify-center">
            <Button className="w-full" onClick={handleReset} variant="outline">
              Reset Code
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AnimatedOTPInputDemo;
