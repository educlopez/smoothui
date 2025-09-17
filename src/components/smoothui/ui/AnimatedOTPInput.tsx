"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { MinusIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"

interface AnimatedInputOTPProps {
  containerClassName?: string
  value?: string
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
  maxLength?: number
  className?: string
}

function AnimatedInputOTP({
  className,
  containerClassName,
  value,
  onChange,
  onComplete,
  maxLength = 6,
  children,
  ...props
}: AnimatedInputOTPProps & { children: React.ReactNode }) {
  const handleChange = (newValue: string) => {
    // Only allow numeric characters
    const numericValue = newValue.replace(/[^0-9]/g, "")
    onChange?.(numericValue)
  }

  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "flex items-center gap-2 has-disabled:opacity-50",
        containerClassName
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      value={value}
      onChange={handleChange}
      onComplete={onComplete}
      maxLength={maxLength}
      {...props}
    >
      {children}
    </OTPInput>
  )
}

function AnimatedInputOTPGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <motion.div
      data-slot="input-otp-group"
      className={cn("flex items-center", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1], // ease-out-quint
      }}
      {...(props as any)}
    />
  )
}

interface AnimatedInputOTPSlotProps extends React.ComponentProps<"div"> {
  index: number
}

function AnimatedInputOTPSlot({
  index,
  className,
  ...props
}: AnimatedInputOTPSlotProps) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}
  const [isFilled, setIsFilled] = React.useState(false)

  React.useEffect(() => {
    if (char && !isFilled) {
      setIsFilled(true)
    } else if (!char && isFilled) {
      setIsFilled(false)
    }
  }, [char, isFilled])

  return (
    <motion.div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive dark:bg-input/30 border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]",
        className
      )}
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isFilled ? 1.05 : 1,
      }}
      transition={{
        duration: 0.2,
        delay: index * 0.05, // Staggered animation
        ease: [0.22, 1, 0.36, 1], // ease-out-quint
        scale: {
          duration: 0.15,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.15, ease: [0.22, 1, 0.36, 1] },
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1, ease: [0.22, 1, 0.36, 1] },
      }}
      {...(props as any)}
    >
      <AnimatePresence mode="wait">
        {char && (
          <motion.span
            key={char}
            initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotateY: 90 }}
            transition={{
              duration: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-medium"
          >
            {char}
          </motion.span>
        )}
      </AnimatePresence>

      {hasFakeCaret && (
        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          <motion.div
            className="bg-foreground h-4 w-px"
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      )}
    </motion.div>
  )
}

function AnimatedInputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <motion.div
      data-slot="input-otp-separator"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        delay: 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...(props as any)}
    >
      <MinusIcon className="text-muted-foreground h-4 w-4" />
    </motion.div>
  )
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
      maxLength={maxLength}
      className={className}
      value={value}
      onChange={onChange}
      onComplete={onComplete}
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
  )
}

export {
  AnimatedInputOTP,
  AnimatedInputOTPGroup,
  AnimatedInputOTPSlot,
  AnimatedInputOTPSeparator,
}

export default AnimatedOTPInput
