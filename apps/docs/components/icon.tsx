"use client";

import { motion, useTransform } from "motion/react";
import { type MascotExpression, useMascotMotion } from "./mascot-motion";

interface IconProps {
  className?: string;
  expression?: MascotExpression;
  reactionKey?: number;
}

const EYE_CENTERS = [143, 277];
const SPIRAL = "M0 0 C-1 -7 9 -9 11 -1 C13 8 2 14 -7 11 C-16 8 -17 -4 -11 -11";
const MOUTHS = [
  { id: "smile", path: "M150 432 Q221.5 494 293 432" },
  { id: "grin", path: "M144 421 Q218 516 293 421" },
  { id: "curious", path: "M164 435 Q222 467 279 421" },
  { id: "wave", path: "M150 435 q18 -24 36 0 t36 0 t36 0" },
  { id: "oh", path: "M218 406 a27 33 0 1 0 0 66 a27 33 0 1 0 0 -66" },
];
const MOUTH_BY_EXPRESSION = {
  curious: "curious",
  dizzy: "wave",
  happy: "grin",
  neutral: "smile",
  surprised: "oh",
  wink: "smile",
};

export function Icon({ className, expression, reactionKey = 0 }: IconProps) {
  const { blink, controls, eyeX, eyeY, face, ref, transition } =
    useMascotMotion(expression, reactionKey);
  const turn = useTransform(eyeX, (value) => value * 0.075);
  const mouthX = useTransform(eyeX, (value) => value * 0.26);
  const mouthY = useTransform(eyeY, (value) => value * 0.24);

  return (
    <motion.svg
      aria-hidden="true"
      animate={controls}
      className={className}
      data-expression={face}
      data-mascot=""
      fill="none"
      height="597"
      ref={ref}
      style={{
        display: "block",
        overflow: "visible",
        transformOrigin: "50% 88%",
      }}
      viewBox="0 0 443 597"
      width="443"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.g style={{ rotate: turn, transformOrigin: "211px 446px" }}>
        <path
          className="fill-foreground"
          d="M209.511 81.9998C100.987 81.9998 13.0107 169.976 13.0107 278.5H406.011C406.011 169.976 318.035 81.9998 209.511 81.9998Z"
        />
        <path
          className="fill-foreground"
          d="M31.0107 279.07C37.7797 279.924 88.001 279.07 88.001 279.07L211.001 279.07C211.001 279.07 281.395 279.102 326.501 279.07C351.033 279.052 340.501 279 389.319 279C388.843 284.983 387.765 291.019 386.954 296.974L382.314 331.242L369.406 431.749C366.068 458.502 363.366 485.334 359.909 512.07C358.404 523.711 357.483 536.169 354.621 547.539C353.444 550.459 352.034 553.106 350.13 555.612C331.041 580.737 284.184 588.95 254.396 593.075C239.067 595.309 223.592 596.385 208.102 596.296C173.519 595.829 109.775 586.855 81.9698 565.58C75.7968 560.856 70.0768 555.028 67.6848 547.463C65.4648 540.44 65.0338 532.242 64.0218 524.955L57.9317 481.252L31.0107 279.07Z"
        />
        <rect
          className="fill-foreground"
          height="76"
          rx="10"
          width="420"
          y="251"
        />
        <path
          className="fill-foreground"
          d="M335.493 11.8972C335.898 12.0719 336.283 12.2729 336.652 12.4924L433.04 54.1314C438.11 56.3216 440.444 62.2072 438.254 67.2772L430.322 85.6372C428.132 90.707 422.247 93.0417 417.177 90.8515L328.776 52.6628L290.686 140.835C288.496 145.905 282.61 148.24 277.54 146.049L259.18 138.118C254.11 135.928 251.776 130.042 253.966 124.972L303.987 9.18003C306.178 4.11004 312.063 1.77552 317.133 3.96573L335.493 11.8972Z"
        />

        <motion.g style={{ x: mouthX, y: mouthY }}>
          {MOUTHS.map(({ id, path }) => (
            <motion.path
              animate={{ opacity: Number(MOUTH_BY_EXPRESSION[face] === id) }}
              className="stroke-background"
              d={path}
              fill="none"
              initial={false}
              key={id}
              strokeLinecap="round"
              strokeWidth={id === "oh" ? 23 : 30}
              transition={transition}
            />
          ))}
        </motion.g>

        <motion.g data-mascot-gaze="" style={{ x: eyeX, y: eyeY }}>
          {EYE_CENTERS.map((x, index) => {
            const right = index === 1;
            const happy = face === "happy";
            const wink = face === "wink" && right;
            const dizzy = face === "dizzy";
            const curious = face === "curious";
            const surprised = face === "surprised";
            const lid = curious && right ? 0.7 : 1;

            return (
              <g key={x} transform={`translate(${x} 301)`}>
                <motion.g
                  animate={{
                    opacity: Number(!(happy || wink || dizzy)),
                    scaleX: surprised ? 1.14 : 1,
                    scaleY: surprised ? 1.06 : lid,
                    y: curious && !right ? -9 : 0,
                  }}
                  initial={false}
                  style={{ transformOrigin: "0px 0px" }}
                  transition={transition}
                >
                  <motion.rect
                    className="fill-background"
                    height="157"
                    rx="18"
                    style={{ scaleY: blink, transformOrigin: "0px 0px" }}
                    width="50"
                    x="-25"
                    y="-79"
                  />
                </motion.g>
                <motion.path
                  animate={{ opacity: Number(happy || wink) }}
                  className="stroke-background"
                  d={wink ? "M-30 8 Q0 19 30 8" : "M-30 10 Q0 -45 30 10"}
                  initial={false}
                  strokeLinecap="round"
                  strokeWidth={wink ? 29 : 38}
                  transition={transition}
                />
                <motion.path
                  animate={{ opacity: Number(dizzy) }}
                  className="stroke-background"
                  d={SPIRAL}
                  initial={false}
                  strokeLinecap="round"
                  strokeWidth={11}
                  transform="scale(2)"
                  transition={transition}
                />
                <motion.path
                  animate={{ opacity: curious && right ? 0.9 : 0 }}
                  className="stroke-background"
                  d="M-29 -87 Q0 -107 30 -97"
                  initial={false}
                  strokeLinecap="round"
                  strokeWidth={16}
                  transition={transition}
                />
              </g>
            );
          })}
        </motion.g>
      </motion.g>
    </motion.svg>
  );
}
