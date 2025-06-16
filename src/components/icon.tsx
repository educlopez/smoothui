"use client"

import { useEffect, useRef, useState } from "react"
import {
  motion,
  useAnimationControls,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react"

export function Icon({ className }: { className?: string }) {
  // Eye logic
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [hasMoved, setHasMoved] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)
  const [defeated, setDefeated] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)

  // Animation controls for blinking
  const leftEyeControls = useAnimationControls()
  const rightEyeControls = useAnimationControls()

  // Springs for eye movement
  const leftEyeX = useSpring(0, { stiffness: 250, damping: 40 })
  const leftEyeY = useSpring(0, { stiffness: 250, damping: 40 })
  const rightEyeX = useSpring(0, { stiffness: 250, damping: 40 })
  const rightEyeY = useSpring(0, { stiffness: 250, damping: 40 })

  // Derived mouth movement (average of eyes, scaled)
  const mouthX = useTransform(
    [leftEyeX, rightEyeX],
    ([lx, rx]: number[]) => ((lx + rx) / 2) * 0.3
  )
  const mouthY = useTransform(
    [leftEyeY, rightEyeY],
    ([ly, ry]: number[]) => ((ly + ry) / 2) * 0.3
  )

  // Eye centers (from SVG, adjust as needed)
  const leftEyeCenter = { x: 180, y: 445 }
  const rightEyeCenter = { x: 310, y: 445 }
  const eyeRadius = 18 // How far the pupil can move

  // Mouse tracking
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY })
      setHasMoved(true)
    }
    window.addEventListener("mousemove", handle)
    return () => window.removeEventListener("mousemove", handle)
  }, [])

  // Eye movement logic
  useEffect(() => {
    if (!svgRef.current || !hasMoved) return
    const svgRect = svgRef.current.getBoundingClientRect()

    function calc(x: number, y: number) {
      const centerX = svgRect.left + x * (svgRect.width / 536)
      const centerY = svgRect.top + y * (svgRect.height / 703)
      const dx = mouse.x - centerX
      const dy = mouse.y - centerY
      const angle = Math.atan2(dy, dx)
      const dist = Math.min(Math.sqrt(dx * dx + dy * dy) / 10, eyeRadius)
      return {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
      }
    }

    const left = calc(leftEyeCenter.x, leftEyeCenter.y)
    const right = calc(rightEyeCenter.x, rightEyeCenter.y)

    leftEyeX.set(left.x)
    leftEyeY.set(left.y)
    rightEyeX.set(right.x)
    rightEyeY.set(right.y)
  }, [mouse, hasMoved, leftEyeX, leftEyeY, rightEyeX, rightEyeY])

  // Blinking logic
  useEffect(() => {
    let timeout: NodeJS.Timeout
    let mounted = true
    const blink = async () => {
      if (!mounted) return
      await Promise.all([
        leftEyeControls.start({ scaleY: 0.1 }),
        rightEyeControls.start({ scaleY: 0.1 }),
      ])
      if (!mounted) return
      await Promise.all([
        leftEyeControls.start({ scaleY: 1 }),
        rightEyeControls.start({ scaleY: 1 }),
      ])
    }
    const schedule = () => {
      timeout = setTimeout(
        () => {
          blink()
          schedule()
        },
        4000 + Math.random() * 2000
      )
    }
    schedule()
    return () => {
      mounted = false
      clearTimeout(timeout)
    }
  }, [leftEyeControls, rightEyeControls])

  // Remove click-to-blink that causes eye movement
  useEffect(() => {
    const blink = async () => {
      await Promise.all([
        leftEyeControls.start({ scaleY: 0.1 }),
        rightEyeControls.start({ scaleY: 0.1 }),
      ])
      await Promise.all([
        leftEyeControls.start({ scaleY: 1 }),
        rightEyeControls.start({ scaleY: 1 }),
      ])
    }
    // Only trigger blink on click, not eye movement
    const handleClick = (e: MouseEvent) => {
      // Defeat logic
      const now = Date.now()
      if (now - lastClickTime < 2000) {
        setClickCount((prev) => prev + 1)
      } else {
        setClickCount(1)
      }
      setLastClickTime(now)
      if (!defeated && clickCount + 1 >= 5) {
        setDefeated(true)
      } else if (!defeated) {
        blink()
      }
    }
    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  }, [leftEyeControls, rightEyeControls, clickCount, lastClickTime, defeated])

  // Defeat state reset
  useEffect(() => {
    if (defeated) {
      const timeout = setTimeout(() => {
        setDefeated(false)
        setClickCount(0)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [defeated])

  return (
    <svg
      ref={svgRef}
      width="536"
      height="703"
      viewBox="0 0 536 703"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: "block" }}
    >
      <g clipPath="url(#clip0_42_2)">
        <path
          d="M404.299 0.157369C410.697 -0.457631 417.235 0.809367 423.363 2.57737C441.208 7.72437 458.888 14.8434 476.319 21.2414C489.274 25.9954 505.634 30.6814 517.343 37.7704C523.177 41.3034 528.215 45.6554 531.504 51.7234C535.875 59.7874 536.695 68.9604 534.002 77.6924C528.706 94.8684 521.747 111.235 505.009 119.932C490.147 127.654 476.398 123.104 461.499 118.151C454.608 115.848 447.699 113.601 440.771 111.412C434.726 125.441 428.854 139.545 423.157 153.719C418.991 163.818 414.443 173.918 410.901 184.245C413.396 184.965 415.874 185.741 418.334 186.573C438.134 193.277 451.982 204.97 461.253 223.726C468.341 225.046 474.356 227.54 479.268 233.043C485.162 239.648 487.545 248.512 487.108 257.223C486.672 265.904 484.985 274.783 483.707 283.393C479.839 309.46 477.457 319.276 457.451 337.377C455.104 346.135 454.789 355.906 453.79 364.937C452.328 377.669 450.734 390.387 449.008 403.086L429.85 556.223C427.277 575.903 425.039 595.586 421.763 615.172C418.044 637.401 407.737 655.719 389.09 668.859C376.814 677.51 362.462 683.418 348.242 688.09C295.819 705.314 236.81 707.108 182.663 697.839C156.018 693.446 123.377 685.188 100.836 669.916C87.2072 660.831 76.7352 647.738 70.8672 632.446C67.2262 622.69 66.3562 611.998 64.8562 601.756L59.4852 564.661C52.3072 515.044 45.4962 465.373 39.0522 415.655L33.1102 365.405C32.0552 356.152 31.3982 346.645 29.6842 337.494C27.4512 335.419 25.2322 333.329 23.0272 331.226C7.59721 316.283 5.61521 299.182 2.70421 278.918C1.63521 271.48 0.0602112 263.743 0.00121123 256.237C-0.0697888 247.27 2.97922 237.448 9.51922 231.081C15.0302 225.715 21.7442 224.19 29.1812 224.277C41.5042 192.469 66.9762 169.776 99.5752 159.84C112.937 155.768 122.513 155.423 135.786 148.748C150.675 141.26 161.71 128.23 175.091 118.563C198.711 101.498 225.116 94.8814 253.937 99.7314C281.573 104.2 306.224 119.663 322.277 142.598C327.235 133.174 330.769 122.551 334.897 112.712L361.14 50.0344C365.346 39.8994 369.805 25.7924 376.209 17.1844C383.285 7.67336 392.611 1.91737 404.299 0.157369Z"
          fill="inherit"
          className="fill-foreground"
        />
        <path
          d="M64.1924 352.826C70.9614 353.68 77.7834 355.844 84.5364 357.08C96.5664 359.281 108.933 360.737 121.091 362.061C172.316 367.23 223.819 369.111 275.284 367.691C324.922 366.48 373.844 363.235 422.5 352.756C422.024 358.739 420.946 364.775 420.135 370.73L415.495 404.998L402.587 505.505C399.249 532.258 396.547 559.09 393.09 585.826C391.585 597.467 390.664 609.925 387.802 621.295C386.625 624.215 385.215 626.862 383.311 629.368C364.222 654.493 317.365 662.706 287.577 666.831C272.248 669.065 256.773 670.141 241.283 670.052C206.7 669.585 142.956 660.611 115.151 639.336C108.978 634.612 103.258 628.784 100.866 621.219C98.6464 614.196 98.2154 605.998 97.2034 598.711L91.1134 555.008L64.1924 352.826Z"
          fill="inherit"
          className="fill-foreground"
        />
        {/* Mouth */}
        {!defeated ? (
          <motion.path
            d="M301.208 509.132C304.581 509.323 307.565 509.871 310.297 512.002C313.585 514.565 315.477 519.073 315.92 523.137C316.498 528.457 314.171 532.898 310.853 536.876C296.839 553.678 276.572 563.208 254.962 565.077C230.563 567.187 202.779 560.379 183.911 544.389C178.964 539.674 173.099 534.233 171.671 527.265C170.882 523.417 171.468 519.242 173.719 515.974C176.125 512.478 180.085 510.193 184.248 509.545C194.403 507.966 199.794 518.141 207.048 523.301C225.703 536.574 257.288 539.085 276.83 526.401C285.061 521.058 291.219 510.839 301.208 509.132Z"
            fill="inherit"
            className="fill-background"
            style={{
              x: mouthX,
              y: mouthY,
            }}
          />
        ) : (
          <circle
            cx={245}
            cy={540}
            r={28}
            fill="inherit"
            className="fill-background"
            stroke="inherit"
            strokeWidth={8}
          />
        )}
        {/* Left Eye (cartoon style, fixed blink origin) */}
        {!defeated && (
          <motion.circle
            cx={leftEyeCenter.x}
            cy={leftEyeCenter.y}
            r="28"
            fill="inherit"
            className="fill-background"
            animate={leftEyeControls}
            transition={{ duration: 0.08 }}
            style={{
              x: leftEyeX,
              y: leftEyeY,
              originX: leftEyeCenter.x,
              originY: leftEyeCenter.y,
            }}
          />
        )}
        {/* Right Eye (cartoon style, fixed blink origin) */}
        {!defeated && (
          <motion.circle
            cx={rightEyeCenter.x}
            cy={rightEyeCenter.y}
            r="28"
            fill="inherit"
            className="fill-background"
            animate={rightEyeControls}
            transition={{ duration: 0.08 }}
            style={{
              x: rightEyeX,
              y: rightEyeY,
              originX: rightEyeCenter.x,
              originY: rightEyeCenter.y,
            }}
          />
        )}
        {/* Defeated Eyes (X) */}
        {defeated && (
          <g>
            {/* Left Eye X */}
            <motion.line
              x1={leftEyeCenter.x - 32}
              y1={leftEyeCenter.y - 32}
              x2={leftEyeCenter.x + 32}
              y2={leftEyeCenter.y + 32}
              stroke="inherit"
              className="stroke-background"
              strokeWidth={18}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.line
              x1={leftEyeCenter.x + 32}
              y1={leftEyeCenter.y - 32}
              x2={leftEyeCenter.x - 32}
              y2={leftEyeCenter.y + 32}
              stroke="inherit"
              className="stroke-background"
              strokeWidth={18}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            />
            {/* Right Eye X */}
            <motion.line
              x1={rightEyeCenter.x - 32}
              y1={rightEyeCenter.y - 32}
              x2={rightEyeCenter.x + 32}
              y2={rightEyeCenter.y + 32}
              stroke="inherit"
              className="stroke-background"
              strokeWidth={18}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.line
              x1={rightEyeCenter.x + 32}
              y1={rightEyeCenter.y - 32}
              x2={rightEyeCenter.x - 32}
              y2={rightEyeCenter.y + 32}
              stroke="inherit"
              className="stroke-background"
              strokeWidth={18}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            />
          </g>
        )}

        <path
          d="M231.559 131.695C239.765 130.96 248.367 132.266 256.208 134.712C288.137 144.672 297.145 171.777 322.489 190.569C343.249 205.963 363.832 209.487 388.419 214.014C396.65 215.53 405.078 217.043 412.783 220.421C421.586 224.281 424.535 228.643 427.979 237.395C378.308 252.268 310.496 254.053 258.517 254.392C198.181 255.731 119.461 253.42 61.3892 237.673C63.8222 230.295 67.4112 222.304 72.3122 216.249C80.9522 205.572 95.0912 197.139 108.156 193.246C115.44 191.076 123.015 189.921 130.323 187.787C138.192 185.482 145.809 182.389 153.058 178.555C159.801 174.966 166.358 170.939 172.234 166.042C194.026 147.881 199.803 134.946 231.559 131.695Z"
          fill="inherit"
          className="fill-background"
        />
        <path
          d="M33.6614 262.739C38.4404 264.642 43.1214 266.793 48.0334 268.342C65.2924 273.786 85.2564 276.873 103.136 279.529C135.747 284.41 168.634 287.232 201.6 287.978C216.235 288.34 230.927 288.065 245.569 288.058C286.814 288.04 327.348 287.376 368.333 282.213C390.863 279.375 414.269 275.867 436.172 269.774C441.575 268.271 446.736 265.938 452.099 264.284C452.792 264.876 452.639 264.568 452.861 265.433C454.029 270.004 450.541 290.316 448.874 295.605C448.019 298.319 446.784 300.649 445.296 303.054C442.533 306.57 439.196 309.593 435.424 311.995C404.243 332.044 286.459 334.297 245.414 334.418C214.973 334.37 184.54 333.419 154.155 331.566C129.677 329.925 104.269 327.578 80.3134 322.18C66.5594 319.081 49.4624 314.486 41.5254 301.678C39.8494 298.975 38.6994 296.061 37.8774 292.996C36.3574 287.326 36.0984 281.242 35.1984 275.445C34.6844 272.136 33.3524 268.58 33.2804 265.247C33.2624 264.381 33.4664 263.574 33.6614 262.739Z"
          fill="inherit"
          className="fill-background"
        />
        <path
          d="M412.275 34.1284C413.787 34.3724 415.274 34.7534 416.717 35.2654C433.429 41.0284 449.971 47.5334 466.553 53.6704C475.276 56.8984 485.819 59.8544 494.006 64.0824C496.29 65.2614 498.603 67.3664 499.663 69.7434C501.215 73.2234 499.635 77.0524 498.255 80.3364C496.331 84.9164 493.169 88.8594 488.05 89.7844C474.95 92.1544 433.953 67.5574 423.395 72.3154C421.465 73.1854 420.154 74.5254 419 76.2744C415.568 81.4764 413.503 88.1114 411.183 93.8834L400.572 120.121C396.229 131.797 391.253 143.314 386.602 154.876C383.642 162.236 381.038 170.458 377.206 177.388C367.759 175.631 357.06 173.394 348.653 168.579L384.877 79.4844L394.179 56.0674C396.164 51.0634 397.945 45.3594 400.93 40.8564C403.895 36.3824 407.216 35.0504 412.275 34.1284Z"
          fill="inherit"
          className="fill-foreground"
        />
      </g>
    </svg>
  )
}
