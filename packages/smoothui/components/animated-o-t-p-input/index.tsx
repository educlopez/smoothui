"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type ReactNode, useContext, useEffect, useState } from "react";

// Animation constants
const EASE_OUT_QUINT_X1 = 0.22;
const EASE_OUT_QUINT_Y1 = 1;
const EASE_OUT_QUINT_X2 = 0.36;
const EASE_OUT_QUINT_Y2 = 1;
const EASE_OUT_QUINT = [
  EASE_OUT_QUINT_X1,
  EASE_OUT_QUINT_Y1,
  EASE_OUT_QUINT_X2,
  EASE_OUT_QUINT_Y2,
] as const;
const ANIMATION_DURATION_SHORT = 0.1;
const ANIMATION_DURATION_MEDIUM = 0.15;
const ANIMATION_DURATION_STANDARD = 0.2;
const ANIMATION_DURATION_LONG = 0.3;
const STAGGER_DELAY = 0.05;
const SCALE_FILLED = 1.05;
const SCALE_HOVER = 1.02;
const SCALE_TAP = 0.98;
const INITIAL_SCALE = 0.8;
const INITIAL_Y = 10;
const SEPARATOR_DELAY = 0.15;

export type AnimatedInputOTPProps = {
  containerClassName?: string;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  maxLength?: number;
  className?: string;
};

function AnimatedInputOTP({
  className,
  containerClassName,
  value,
  onChange,
  onComplete,
  maxLength = 6,
  children,
  ...props
}: AnimatedInputOTPProps & { children: ReactNode }) {
  const handleChange = (newValue: string) => {
    // Only allow numeric characters
    const numericValue = newValue.replace(/[^0-9]/g, "");
    onChange?.(numericValue);
  };

  return (
    <OTPInput
      className={cn("disabled:cursor-not-allowed", className)}
      containerClassName={cn(
        "flex items-center gap-2 has-disabled:opacity-50",
        containerClassName
      )}
      data-slot="input-otp"
      maxLength={maxLength}
      onChange={handleChange}
      onComplete={onComplete}
      value={value}
      {...props}
    >
      {children}
    </OTPInput>
  );
}

type AnimatedInputOTPGroupProps = {
  className?: string;
  children?: ReactNode;
};

function AnimatedInputOTPGroup({
  className,
  children,
}: AnimatedInputOTPGroupProps) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex items-center", className)}
      data-slot="input-otp-group"
      initial={{ opacity: 0, y: INITIAL_Y }}
      transition={{
        duration: ANIMATION_DURATION_LONG,
        ease: EASE_OUT_QUINT,
      }}
    >
      {children}
    </motion.div>
  );
}

type AnimatedInputOTPSlotProps = {
  index: number;
  className?: string;
};

function AnimatedInputOTPSlot({ index, className }: AnimatedInputOTPSlotProps) {
  const inputOTPContext = useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};
  const [isFilled, setIsFilled] = useState(false);

  useEffect(() => {
    if (char && !isFilled) {
      setIsFilled(true);
    } else if (!char && isFilled) {
      setIsFilled(false);
    }
  }, [char, isFilled]);

  return (
    <motion.div
      animate={{
        opacity: 1,
        y: 0,
        scale: isFilled ? SCALE_FILLED : 1,
      }}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center border-input border-y border-r text-sm shadow-xs outline-none transition-all first:rounded-l-md first:border-l last:rounded-r-md aria-invalid:border-destructive data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-[3px] data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-destructive/20 dark:bg-input/30 dark:data-[active=true]:aria-invalid:ring-destructive/40",
        className
      )}
      data-active={isActive}
      data-slot="input-otp-slot"
      initial={{ opacity: 0, scale: INITIAL_SCALE, y: INITIAL_Y }}
      transition={{
        duration: ANIMATION_DURATION_STANDARD,
        delay: index * STAGGER_DELAY,
        ease: EASE_OUT_QUINT,
        scale: {
          duration: ANIMATION_DURATION_MEDIUM,
          ease: EASE_OUT_QUINT,
        },
      }}
      whileHover={{
        scale: SCALE_HOVER,
        transition: {
          duration: ANIMATION_DURATION_MEDIUM,
          ease: EASE_OUT_QUINT,
        },
      }}
      whileTap={{
        scale: SCALE_TAP,
        transition: {
          duration: ANIMATION_DURATION_SHORT,
          ease: EASE_OUT_QUINT,
        },
      }}
    >
      <AnimatePresence mode="wait">
        {char && (
          <motion.span
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            className="font-medium"
            exit={{ opacity: 0, scale: 0.5, rotateY: 90 }}
            initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
            key={char}
            transition={{
              duration: ANIMATION_DURATION_STANDARD,
              ease: EASE_OUT_QUINT,
            }}
          >
            {char}
          </motion.span>
        )}
      </AnimatePresence>

      {hasFakeCaret && (
        <motion.div
          animate={{ opacity: 1 }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: ANIMATION_DURATION_SHORT }}
        >
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            className="h-4 w-px bg-foreground"
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      )}
    </motion.div>
  );
}

function AnimatedInputOTPSeparator() {
  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      data-slot="input-otp-separator"
      initial={{ opacity: 0, scale: INITIAL_SCALE }}
      transition={{
        duration: ANIMATION_DURATION_LONG,
        delay: SEPARATOR_DELAY,
        ease: EASE_OUT_QUINT,
      }}
    >
      <MinusIcon className="h-4 w-4 text-muted-foreground" />
    </motion.div>
  );
}

// Main component that combines everything
export function AnimatedOTPInput({
  maxLength = 6,
  className,
  value,
  onChange,
  onComplete,
  ...props
}: AnimatedInputOTPProps) {
  return (
    <AnimatedInputOTP
      className={className}
      maxLength={maxLength}
      onChange={onChange}
      onComplete={onComplete}
      value={value}
      {...props}
    >
      <AnimatedInputOTPGroup>
        <AnimatedInputOTPSlot index={0} />
        <AnimatedInputOTPSlot index={1} />
        <AnimatedInputOTPSlot index={2} />
      </AnimatedInputOTPGroup>
      <AnimatedInputOTPSeparator />
      <AnimatedInputOTPGroup>
        <AnimatedInputOTPSlot index={3} />
        <AnimatedInputOTPSlot index={4} />
        <AnimatedInputOTPSlot index={5} />
      </AnimatedInputOTPGroup>
    </AnimatedInputOTP>
  );
}

export {
  AnimatedInputOTP,
  AnimatedInputOTPGroup,
  AnimatedInputOTPSlot,
  AnimatedInputOTPSeparator,
};

export default AnimatedOTPInput;
