"use client";

import { AlertCircle, CheckCircle, Info, X, XCircle } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type ToastType = "success" | "error" | "info" | "warning";

export type ToastProps = {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
  isVisible?: boolean;
  className?: string;
};

const toastIcons = {
  success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
  warning: <AlertCircle className="h-5 w-5 text-amber-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
};

const toastClasses = {
  success:
    "border-emerald-100 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950",
  error: "border-red-100 bg-red-50 dark:border-red-900 dark:bg-red-950",
  warning:
    "border-amber-100 bg-amber-50 dark:border-amber-900 dark:bg-amber-950",
  info: "border-blue-100 bg-blue-50 dark:border-blue-900 dark:bg-blue-950",
};

export default function BasicToast({
  message,
  type = "info",
  duration = 3000,
  onClose,
  isVisible = true,
  className = "",
}: ToastProps) {
  const [visible, setVisible] = useState(isVisible);
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!mounted) {
    return null;
  }

  const toastContent = (
    <AnimatePresence>
      {visible && (
        <motion.div
          animate={
            shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0, scale: 1 }
          }
          className={`fixed top-4 right-4 z-50 flex w-80 items-center gap-3 rounded-lg border p-4 shadow-lg ${toastClasses[type]} ${className}`}
          exit={
            shouldReduceMotion
              ? { opacity: 0, transition: { duration: 0 } }
              : {
                  opacity: 0,
                  x: 50,
                  scale: 0.8,
                  transition: { duration: 0.15 },
                }
          }
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 0, x: 50, scale: 0.8 }
          }
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { type: "spring", bounce: 0.1, duration: 0.25 }
          }
        >
          <div className="flex-shrink-0">{toastIcons[type]}</div>
          <p className="flex-1 text-sm">{message}</p>
          <button
            className="flex-shrink-0 rounded-full p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            onClick={() => {
              setVisible(false);
              onClose?.();
            }}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(toastContent, document.body);
}

// Example of how to use this component:
export function ToastDemo() {
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<ToastType>("success");

  const handleShowToast = (type: ToastType) => {
    setToastType(type);
    setShowToast(true);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-md bg-emerald-500 px-3 py-1.5 text-sm text-white hover:bg-emerald-600"
          onClick={() => handleShowToast("success")}
          type="button"
        >
          Success Toast
        </button>
        <button
          className="rounded-md bg-red-500 px-3 py-1.5 text-sm text-white hover:bg-red-600"
          onClick={() => handleShowToast("error")}
          type="button"
        >
          Error Toast
        </button>
        <button
          className="rounded-md bg-amber-500 px-3 py-1.5 text-sm text-white hover:bg-amber-600"
          onClick={() => handleShowToast("warning")}
          type="button"
        >
          Warning Toast
        </button>
        <button
          className="rounded-md bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600"
          onClick={() => handleShowToast("info")}
          type="button"
        >
          Info Toast
        </button>
      </div>

      <AnimatePresence>
        {showToast && (
          <BasicToast
            duration={3000}
            message={`This is a ${toastType} message example!`}
            onClose={() => setShowToast(false)}
            type={toastType}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
