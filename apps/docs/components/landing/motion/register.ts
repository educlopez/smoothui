"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export const registerLandingGsap = () => {
  if (registered) {
    return;
  }
  gsap.registerPlugin(useGSAP, ScrollTrigger);
  registered = true;
};
