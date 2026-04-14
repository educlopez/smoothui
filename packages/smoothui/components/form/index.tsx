"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { Check } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type React from "react";
import {
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  DURATION_INSTANT,
  SPRING_DEFAULT,
  SPRING_SNAPPY,
} from "../../lib/animation";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STAGGER_DELAY = 0.04;
const SHAKE_KEYFRAMES = [0, -6, 5, -4, 3, -1, 0];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FormErrors = Record<string, string | undefined>;

export interface FormProps extends React.ComponentProps<"form"> {
  /** Form contents */
  children: React.ReactNode;
  /** Optional CSS class */
  className?: string;
  /** External errors object (e.g. from react-hook-form's `formState.errors`) */
  errors?: FormErrors;
  /** Callback invoked on native form submit with current errors map */
  onFormSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export interface FormFieldProps {
  /** Field contents (label, input, message) */
  children: React.ReactNode;
  /** Optional CSS class for the field wrapper */
  className?: string;
  /** Unique field name — used to look up errors */
  name: string;
}

export interface FormLabelProps extends React.ComponentProps<"label"> {
  /** Label text */
  children: React.ReactNode;
  /** Optional CSS class */
  className?: string;
}

export interface FormMessageProps {
  /** Override the error message (otherwise pulled from FormField context) */
  children?: React.ReactNode;
  /** Optional CSS class */
  className?: string;
}

export interface FormDescriptionProps extends React.ComponentProps<"p"> {
  /** Description text */
  children: React.ReactNode;
  /** Optional CSS class */
  className?: string;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface FormContextValue {
  errors: FormErrors;
  prevErrors: FormErrors;
  submitCount: number;
}

interface FormFieldContextValue {
  error: string | undefined;
  fieldIndex: number;
  formDescriptionId: string;
  formItemId: string;
  formMessageId: string;
  id: string;
  name: string;
  prevError: string | undefined;
  submitCount: number;
}

const FormContext = createContext<FormContextValue>({
  errors: {},
  submitCount: 0,
  prevErrors: {},
});
const FormFieldContext = createContext<FormFieldContextValue | null>(null);

const useFormCtx = () => useContext(FormContext);

const useFormFieldCtx = () => {
  const ctx = useContext(FormFieldContext);
  if (!ctx) {
    throw new Error("FormLabel / FormMessage must be used inside <FormField>");
  }
  return ctx;
};

// ---------------------------------------------------------------------------
// Form
// ---------------------------------------------------------------------------

export default function Form({
  errors = {},
  onFormSubmit,
  className,
  children,
  ...props
}: FormProps) {
  const [submitCount, setSubmitCount] = useState(0);
  const prevErrorsRef = useRef<FormErrors>({});
  const [prevErrors, setPrevErrors] = useState<FormErrors>({});

  const ctxValue = useMemo(
    () => ({ errors, submitCount, prevErrors }),
    [errors, submitCount, prevErrors]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      setPrevErrors(prevErrorsRef.current);
      prevErrorsRef.current = errors;
      setSubmitCount((c) => c + 1);
      if (onFormSubmit) {
        onFormSubmit(e);
      }
    },
    [onFormSubmit, errors]
  );

  return (
    <FormContext.Provider value={ctxValue}>
      <form
        className={cn("grid gap-3", className)}
        noValidate
        onSubmit={handleSubmit}
        {...props}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// FormField — staggered entrance + validation shake
// ---------------------------------------------------------------------------

let fieldCounter = 0;

export function FormField({ name, className, children }: FormFieldProps) {
  const { errors, submitCount, prevErrors } = useFormCtx();
  const id = useId();
  const error = errors[name];
  const prevError = prevErrors[name];

  // Stable field index for stagger animation
  const fieldIndexRef = useRef<number | null>(null);
  if (fieldIndexRef.current === null) {
    fieldIndexRef.current = fieldCounter;
    fieldCounter += 1;
  }

  // Reset counter on unmount of the first field (index 0)
  useEffect(() => {
    return () => {
      if (fieldIndexRef.current === 0) {
        fieldCounter = 0;
      }
    };
  }, []);

  const ctxValue = useMemo(
    () => ({
      name,
      id,
      error,
      formItemId: `${id}-form-item`,
      formDescriptionId: `${id}-form-item-description`,
      formMessageId: `${id}-form-item-message`,
      fieldIndex: fieldIndexRef.current ?? 0,
      submitCount,
      prevError,
    }),
    [name, id, error, submitCount, prevError]
  );

  return (
    <FormFieldContext.Provider value={ctxValue}>
      <FormFieldInner className={className}>{children}</FormFieldInner>
    </FormFieldContext.Provider>
  );
}

/** Inner component that can consume FormFieldContext */
function FormFieldInner({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const shouldReduceMotion = useReducedMotion();
  const { error, fieldIndex, submitCount, prevError } = useFormFieldCtx();

  // Shake when a new error appears on submit
  const shouldShake = error && submitCount > 0;
  const [shakeKey, setShakeKey] = useState(0);

  useEffect(() => {
    if (shouldShake) {
      setShakeKey((k) => k + 1);
    }
  }, [shouldShake, submitCount]);

  return (
    <motion.div
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      className={cn("grid gap-1.5", className)}
      data-slot="form-field"
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
      transition={
        shouldReduceMotion
          ? DURATION_INSTANT
          : {
              ...SPRING_DEFAULT,
              delay: fieldIndex * STAGGER_DELAY,
            }
      }
    >
      <motion.div
        animate={
          shouldShake && !shouldReduceMotion ? { x: SHAKE_KEYFRAMES } : { x: 0 }
        }
        className="grid gap-1.5"
        key={shakeKey}
        transition={
          shouldReduceMotion
            ? DURATION_INSTANT
            : { duration: 0.4, ease: [0.36, 0.07, 0.19, 0.97] }
        }
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// FormLabel
// ---------------------------------------------------------------------------

export function FormLabel({ className, children, ...props }: FormLabelProps) {
  const { formItemId, error } = useFormFieldCtx();

  return (
    <label
      className={cn(
        "font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        error && "text-destructive",
        className
      )}
      data-slot="form-label"
      htmlFor={formItemId}
      {...props}
    >
      {children}
    </label>
  );
}

// ---------------------------------------------------------------------------
// FormControl — renders a wrapper with animated focus ring
// ---------------------------------------------------------------------------

export function FormControl({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const { formItemId, formDescriptionId, formMessageId, error } =
    useFormFieldCtx();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      animate={
        shouldReduceMotion
          ? {}
          : {
              boxShadow: isFocused
                ? "0 0 0 3px hsl(var(--ring) / 0.3)"
                : "0 0 0 0px hsl(var(--ring) / 0)",
            }
      }
      className={cn("rounded-md", className)}
      data-slot="form-control"
      onBlur={() => setIsFocused(false)}
      onFocus={() => setIsFocused(true)}
      transition={shouldReduceMotion ? DURATION_INSTANT : SPRING_SNAPPY}
    >
      {cloneChildWithA11y(children, {
        id: formItemId,
        "aria-describedby": error
          ? `${formDescriptionId} ${formMessageId}`
          : formDescriptionId,
        "aria-invalid": error ? true : undefined,
      })}
    </motion.div>
  );
}

function cloneChildWithA11y(
  children: React.ReactNode,
  a11yProps: Record<string, unknown>
): React.ReactNode {
  const child = Array.isArray(children) ? children[0] : children;
  if (child && typeof child === "object" && "type" in child) {
    const element = child as React.ReactElement<Record<string, unknown>>;
    // biome-ignore lint/suspicious/noExplicitAny: cloneElement requires flexible typing
    return cloneElement(element as any, a11yProps);
  }
  return children;
}

// ---------------------------------------------------------------------------
// FormDescription
// ---------------------------------------------------------------------------

export function FormDescription({
  className,
  children,
  ...props
}: FormDescriptionProps) {
  const { formDescriptionId } = useFormFieldCtx();

  return (
    <p
      className={cn("text-muted-foreground text-sm", className)}
      data-slot="form-description"
      id={formDescriptionId}
      {...props}
    >
      {children}
    </p>
  );
}

// ---------------------------------------------------------------------------
// FormMessage — animated error message with success state
// ---------------------------------------------------------------------------

export function FormMessage({ className, children }: FormMessageProps) {
  const shouldReduceMotion = useReducedMotion();
  const { error, formMessageId, submitCount, prevError } = useFormFieldCtx();

  const body = children ?? error;

  // Show success checkmark when error was just cleared after a submit
  const wasError = prevError && !error && submitCount > 0;

  return (
    <div>
      <AnimatePresence mode="wait">
        {body ? (
          <motion.p
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            className={cn("text-destructive text-sm", className)}
            data-slot="form-message"
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : { opacity: 0, y: -4 }
            }
            id={formMessageId}
            initial={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -4 }
            }
            key={typeof body === "string" ? body : "message"}
            role="alert"
            transition={shouldReduceMotion ? DURATION_INSTANT : SPRING_DEFAULT}
          >
            {body}
          </motion.p>
        ) : wasError ? (
          <motion.div
            animate={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }
            }
            className="flex items-center gap-1 text-sm"
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : { opacity: 0, scale: 0.9 }
            }
            initial={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }
            }
            key="success"
            transition={
              shouldReduceMotion
                ? DURATION_INSTANT
                : {
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    duration: 0.25,
                  }
            }
          >
            <motion.span
              animate={shouldReduceMotion ? {} : { scale: 1 }}
              initial={shouldReduceMotion ? {} : { scale: 0 }}
              transition={
                shouldReduceMotion
                  ? DURATION_INSTANT
                  : {
                      type: "spring",
                      stiffness: 400,
                      damping: 15,
                      duration: 0.2,
                      delay: 0.05,
                    }
              }
            >
              <Check className="size-3.5 text-emerald-500" />
            </motion.span>
            <span className="text-emerald-500">Looks good</span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
