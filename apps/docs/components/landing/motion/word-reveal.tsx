"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type ElementType, useRef } from "react";
import {
  GSAP_DURATION,
  GSAP_EASE_OUT,
  prefersReducedMotion,
} from "./constants";
import { registerLandingGsap } from "./register";

registerLandingGsap();

interface WordRevealProps {
  as?: ElementType;
  className?: string;
  text: string;
}

export function WordReveal({
  as: Tag = "span",
  className,
  text,
}: WordRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const words = text.split(" ");
  const occurrence = new Map<string, number>();
  const wordKeys = words.map((word) => {
    const count = occurrence.get(word) ?? 0;
    occurrence.set(word, count + 1);
    return `${word}-${count}`;
  });

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) {
        return;
      }

      const wordEls = gsap.utils.toArray<HTMLElement>("[data-word]", root);
      if (prefersReducedMotion()) {
        gsap.set(wordEls, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        wordEls,
        { opacity: 0, y: "110%" },
        {
          duration: GSAP_DURATION.complex,
          ease: GSAP_EASE_OUT,
          opacity: 1,
          scrollTrigger: {
            once: true,
            start: "top 85%",
            trigger: root,
          },
          stagger: 0.035,
          y: "0%",
        }
      );
    },
    { scope: ref }
  );

  return (
    <Tag className={className} ref={ref}>
      {words.map((word, index) => (
        <span
          className="inline-block overflow-hidden pb-[0.12em] align-bottom"
          key={wordKeys[index]}
        >
          <span className="inline-block will-change-transform" data-word>
            {word}
            {index < words.length - 1 ? "\u00A0" : null}
          </span>
        </span>
      ))}
    </Tag>
  );
}
