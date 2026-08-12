"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import { Check, Eye, EyeOff } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { FormEvent, ReactNode, RefObject } from "react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import {
  DURATION_INSTANT,
  SPRING_DEFAULT,
  SPRING_SNAPPY,
} from "../../lib/animation";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UPPERCASE_PATTERN = /[A-Z]/;
const NUMBER_PATTERN = /[0-9]/;

export type AuthFormMode = "sign-in" | "sign-up";

export type AuthFormStatus = "idle" | "submitting" | "success" | "error";

export interface AuthProvider {
  icon: ReactNode;
  id: string;
  label: string;
}

export interface AuthPasswordRequirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

export interface AuthFormValues {
  email: string;
  password: string;
}

export interface AuthFormFieldErrors {
  email?: string;
  password?: string;
}

export interface AuthFormProps {
  className?: string;
  error?: string;
  fieldErrors?: AuthFormFieldErrors;
  footer?: ReactNode;
  mode: AuthFormMode;
  onModeChange?: (mode: AuthFormMode) => void;
  onSubmit?: (values: AuthFormValues) => void;
  providers?: AuthProvider[];
  requirements?: AuthPasswordRequirement[];
  showMagicLink?: boolean;
  status?: AuthFormStatus;
}

const DEFAULT_REQUIREMENTS: AuthPasswordRequirement[] = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (password) => password.length >= 8,
  },
  {
    id: "uppercase",
    label: "One uppercase letter",
    test: (password) => UPPERCASE_PATTERN.test(password),
  },
  {
    id: "number",
    label: "One number",
    test: (password) => NUMBER_PATTERN.test(password),
  },
];

const SLIDE_SPRING = { ...SPRING_DEFAULT, bounce: 0 };

const panelInitial = (direction: number) => ({
  opacity: 0,
  x: direction * 16,
});
const panelExit = (direction: number) => ({ opacity: 0, x: -direction * 16 });

// ---------------------------------------------------------------------------
// AuthModeHeader — direction-aware cross-fade between sign-in / sign-up copy
// ---------------------------------------------------------------------------

interface AuthModeHeaderProps {
  direction: number;
  isSignUp: boolean;
  mode: AuthFormMode;
  shouldReduceMotion: boolean | null;
}

const AuthModeHeader = ({
  mode,
  isSignUp,
  direction,
  shouldReduceMotion,
}: AuthModeHeaderProps) => (
  <AnimatePresence custom={direction} initial={false} mode="wait">
    <motion.div
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
      custom={direction}
      exit={shouldReduceMotion ? { opacity: 0 } : panelExit(direction)}
      initial={shouldReduceMotion ? { opacity: 0 } : panelInitial(direction)}
      key={mode}
      transition={shouldReduceMotion ? DURATION_INSTANT : SLIDE_SPRING}
    >
      <h2 className="font-semibold text-foreground text-xl">
        {isSignUp ? "Create your account" : "Welcome back"}
      </h2>
      <p className="mt-1 text-muted-foreground text-sm">
        {isSignUp
          ? "Start with your email — we'll take it from there."
          : "Sign in to continue where you left off."}
      </p>
    </motion.div>
  </AnimatePresence>
);

// ---------------------------------------------------------------------------
// AuthProviderList — optional OAuth-style buttons + divider
// ---------------------------------------------------------------------------

interface AuthProviderListProps {
  providers: AuthProvider[];
}

const AuthProviderList = ({ providers }: AuthProviderListProps) => {
  if (providers.length === 0) {
    return null;
  }
  return (
    <div className="mt-5 grid gap-2">
      {providers.map((provider) => (
        <SmoothButton
          className="w-full text-sm"
          key={provider.id}
          prefix={
            <span aria-hidden="true" className="flex shrink-0 items-center">
              {provider.icon}
            </span>
          }
          size="lg"
          variant="outline"
        >
          Continue with {provider.label}
        </SmoothButton>
      ))}
      <div className="relative my-2 text-center text-xs">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          or continue with email
        </span>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t"
        />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// AuthErrorSummary — form-level error, focused automatically on failure
// ---------------------------------------------------------------------------

interface AuthErrorSummaryProps {
  error?: string;
  errorRef: RefObject<HTMLDivElement | null>;
  shouldReduceMotion: boolean | null;
  status: AuthFormStatus;
}

const AuthErrorSummary = ({
  status,
  error,
  errorRef,
  shouldReduceMotion,
}: AuthErrorSummaryProps) => (
  <AnimatePresence initial={false}>
    {status === "error" && error ? (
      <motion.div
        animate={
          shouldReduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }
        }
        className="mt-4 overflow-hidden"
        exit={
          shouldReduceMotion
            ? { opacity: 0, transition: { duration: 0 } }
            : { height: 0, opacity: 0 }
        }
        initial={
          shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }
        }
        transition={shouldReduceMotion ? DURATION_INSTANT : SPRING_SNAPPY}
      >
        <div
          className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-destructive text-sm"
          ref={errorRef}
          role="alert"
          tabIndex={-1}
        >
          {error}
        </div>
      </motion.div>
    ) : null}
  </AnimatePresence>
);

// ---------------------------------------------------------------------------
// AuthPasswordRequirements — live-ticking password rule list
// ---------------------------------------------------------------------------

interface AuthPasswordRequirementsProps {
  password: string;
  requirements: AuthPasswordRequirement[];
  requirementsId: string;
}

const AuthPasswordRequirements = ({
  password,
  requirements,
  requirementsId,
}: AuthPasswordRequirementsProps) => (
  <ul
    aria-label="Password requirements"
    className="mt-1 grid gap-1"
    id={requirementsId}
  >
    {requirements.map((requirement) => {
      const passed = requirement.test(password);
      return (
        <li
          aria-label={`${requirement.label}: ${passed ? "met" : "not met"}`}
          className="flex items-center gap-2 text-sm"
          key={requirement.id}
        >
          <span
            aria-hidden="true"
            className={cn(
              "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
              passed
                ? "border-emerald-500 bg-emerald-500 text-white"
                : "border-muted-foreground/40 text-transparent"
            )}
          >
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
          <span
            className={cn(
              "transition-colors",
              passed ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {requirement.label}
          </span>
        </li>
      );
    })}
  </ul>
);

// ---------------------------------------------------------------------------
// AuthSubmitButton — morphs idle → submitting → success
// ---------------------------------------------------------------------------

interface AuthSubmitButtonProps {
  disabled: boolean;
  isSignUp: boolean;
  shouldReduceMotion: boolean | null;
  status: AuthFormStatus;
}

const getSubmitButtonContent = (
  status: AuthFormStatus,
  isSignUp: boolean,
  shouldReduceMotion: boolean | null
) => {
  if (status === "submitting") {
    return (
      <motion.span
        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        className="flex items-center"
        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
        key="submitting"
        transition={shouldReduceMotion ? DURATION_INSTANT : SPRING_SNAPPY}
      >
        Signing in…
      </motion.span>
    );
  }
  if (status === "success") {
    return (
      <motion.span
        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
        className="flex items-center gap-2"
        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
        initial={
          shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6 }
        }
        key="success"
        transition={shouldReduceMotion ? DURATION_INSTANT : SPRING_DEFAULT}
      >
        <Check aria-hidden="true" className="h-4 w-4" />
        Success
      </motion.span>
    );
  }
  return (
    <motion.span
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      className="flex items-center gap-2"
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
      key="idle"
      transition={shouldReduceMotion ? DURATION_INSTANT : SPRING_SNAPPY}
    >
      {isSignUp ? "Create account" : "Sign in"}
    </motion.span>
  );
};

const AuthSubmitButton = ({
  status,
  isSignUp,
  shouldReduceMotion,
  disabled,
}: AuthSubmitButtonProps) => (
  <SmoothButton
    className="mt-1 w-full overflow-hidden font-semibold text-sm"
    color="accent"
    disabled={disabled}
    loading={status === "submitting"}
    size="lg"
    type="submit"
    variant="solid"
  >
    <AnimatePresence initial={false} mode="wait">
      {getSubmitButtonContent(status, isSignUp, shouldReduceMotion)}
    </AnimatePresence>
  </SmoothButton>
);

// ---------------------------------------------------------------------------
// AuthForm
// ---------------------------------------------------------------------------

export default function AuthForm({
  mode,
  onModeChange,
  providers = [],
  onSubmit,
  status = "idle",
  error,
  fieldErrors,
  requirements = DEFAULT_REQUIREMENTS,
  showMagicLink = false,
  footer,
  className,
}: AuthFormProps) {
  const shouldReduceMotion = useReducedMotion();
  const uid = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [direction, setDirection] = useState(0);
  const prevModeRef = useRef(mode);
  const passwordContentRef = useRef<HTMLDivElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const [passwordHeight, setPasswordHeight] = useState(0);

  const isSubmitting = status === "submitting";
  const isSuccess = status === "success";
  const isEmailValid = EMAIL_PATTERN.test(email.trim());
  const isSignUp = mode === "sign-up";

  const emailId = `${uid}-email`;
  const emailErrorId = `${uid}-email-error`;
  const passwordId = `${uid}-password`;
  const passwordErrorId = `${uid}-password-error`;
  const requirementsId = `${uid}-requirements`;

  useEffect(() => {
    if (prevModeRef.current !== mode) {
      setDirection(mode === "sign-up" ? 1 : -1);
      prevModeRef.current = mode;
    }
  }, [mode]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: isSignUp/password/requirements/fieldErrors intentionally re-measure the reveal height whenever the field's rendered content changes
  useLayoutEffect(() => {
    const el = passwordContentRef.current;
    if (!el) {
      return;
    }
    setPasswordHeight(isEmailValid ? el.scrollHeight : 0);
  }, [isEmailValid, isSignUp, password, requirements, fieldErrors?.password]);

  useEffect(() => {
    if (status === "error" && error) {
      errorSummaryRef.current?.focus();
    }
  }, [status, error]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.({ email, password });
  };

  const handleMagicLink = () => {
    onSubmit?.({ email, password: "" });
  };

  const getStatusMessage = () => {
    if (isSubmitting) {
      return "Submitting…";
    }
    if (isSuccess) {
      return "Success. You're signed in.";
    }
    if (status === "error" && error) {
      return error;
    }
    return "";
  };

  const passwordDescribedBy =
    [
      fieldErrors?.password ? passwordErrorId : null,
      isSignUp ? requirementsId : null,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className={cn("w-full max-w-sm", className)}>
      <AuthModeHeader
        direction={direction}
        isSignUp={isSignUp}
        mode={mode}
        shouldReduceMotion={shouldReduceMotion}
      />

      <AuthProviderList providers={providers} />

      <AuthErrorSummary
        error={error}
        errorRef={errorSummaryRef}
        shouldReduceMotion={shouldReduceMotion}
        status={status}
      />

      <form className="mt-4 grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-1.5">
          <label
            className="font-medium text-foreground text-sm"
            htmlFor={emailId}
          >
            Email
          </label>
          <input
            aria-describedby={fieldErrors?.email ? emailErrorId : undefined}
            aria-invalid={Boolean(fieldErrors?.email)}
            autoComplete="email"
            className="min-h-[44px] w-full rounded-lg border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-invalid:border-destructive"
            disabled={isSubmitting || isSuccess}
            id={emailId}
            inputMode="email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
          {fieldErrors?.email ? (
            <p
              className="text-destructive text-sm"
              id={emailErrorId}
              role="alert"
            >
              {fieldErrors.email}
            </p>
          ) : null}
        </div>

        <motion.div
          animate={
            shouldReduceMotion
              ? { opacity: isEmailValid ? 1 : 0 }
              : { height: passwordHeight, opacity: isEmailValid ? 1 : 0 }
          }
          aria-hidden={!isEmailValid}
          initial={false}
          style={
            shouldReduceMotion
              ? { height: isEmailValid ? "auto" : 0, overflow: "hidden" }
              : { overflow: "hidden" }
          }
          transition={shouldReduceMotion ? DURATION_INSTANT : SPRING_DEFAULT}
        >
          <div className="grid gap-1.5 pt-1" ref={passwordContentRef}>
            <label
              className="font-medium text-foreground text-sm"
              htmlFor={passwordId}
            >
              Password
            </label>
            <div className="relative">
              <input
                aria-describedby={passwordDescribedBy}
                aria-invalid={Boolean(fieldErrors?.password)}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                className="min-h-[44px] w-full rounded-lg border bg-background px-3 pr-11 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-invalid:border-destructive"
                disabled={isSubmitting || isSuccess}
                id={passwordId}
                minLength={isSignUp ? 8 : undefined}
                name="password"
                onChange={(event) => setPassword(event.target.value)}
                required={isEmailValid}
                tabIndex={isEmailValid ? undefined : -1}
                type={showPassword ? "text" : "password"}
                value={password}
              />
              <SmoothButton
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground hover:text-foreground [&_svg]:size-4"
                onClick={() => setShowPassword((value) => !value)}
                shape="pill"
                size="icon"
                tabIndex={isEmailValid ? undefined : -1}
                variant="ghost"
              >
                {showPassword ? (
                  <EyeOff aria-hidden="true" />
                ) : (
                  <Eye aria-hidden="true" />
                )}
              </SmoothButton>
            </div>
            {fieldErrors?.password ? (
              <p
                className="text-destructive text-sm"
                id={passwordErrorId}
                role="alert"
              >
                {fieldErrors.password}
              </p>
            ) : null}

            {isSignUp ? (
              <AuthPasswordRequirements
                password={password}
                requirements={requirements}
                requirementsId={requirementsId}
              />
            ) : null}

            {showMagicLink ? (
              <SmoothButton
                className="mt-1 -ml-3 justify-self-start"
                color="accent"
                onClick={handleMagicLink}
                size="sm"
                variant="link"
              >
                Send a magic link instead
              </SmoothButton>
            ) : null}
          </div>
        </motion.div>

        <AuthSubmitButton
          disabled={isSubmitting || isSuccess}
          isSignUp={isSignUp}
          shouldReduceMotion={shouldReduceMotion}
          status={status}
        />

        <p aria-live="polite" className="sr-only" role="status">
          {getStatusMessage()}
        </p>
      </form>

      <p className="mt-5 text-center text-muted-foreground text-sm">
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          className="font-medium text-brand underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={() => onModeChange?.(isSignUp ? "sign-in" : "sign-up")}
          type="button"
        >
          {isSignUp ? "Sign in" : "Sign up"}
        </button>
      </p>

      {footer}
    </div>
  );
}
