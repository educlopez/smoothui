"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { Volume2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

// SVG content for copying
const LOGOMARK_SVG = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M329.205 6.05469C331.396 0.985458 337.281 -1.34888 342.351 0.84082L355.644 6.58301C356.018 6.74496 356.377 6.93032 356.722 7.13086L439.729 42.9902C444.799 45.1805 447.134 51.066 444.944 56.1357L439.202 69.4277C437.012 74.4976 431.126 76.8315 426.056 74.6416L351.12 42.2705L330.918 89.0332C376.141 114.344 408.567 159.794 416.052 213.239H429.756V278.752H397.765L397.27 282.408L386.144 369.047C383.266 392.108 380.937 415.238 377.957 438.284C376.66 448.318 375.865 459.058 373.398 468.858C372.384 471.375 371.168 473.657 369.527 475.817C353.072 497.475 312.68 504.556 287.003 508.111C273.789 510.037 260.45 510.964 247.098 510.888C217.287 510.485 162.338 502.749 138.37 484.41C133.049 480.338 128.118 475.314 126.057 468.793C124.143 462.739 123.772 455.672 122.899 449.391L117.649 411.719L99.9443 278.752H67.7119V213.239H80.5723C92.1014 130.913 162.808 67.5599 248.312 67.5596C266.066 67.5596 283.183 70.2933 299.265 75.3594L329.205 6.05469ZM298.618 347.714C290.008 349.185 284.699 357.994 277.604 362.6C260.758 373.533 233.532 371.369 217.451 359.928C211.198 355.48 206.551 346.709 197.798 348.069C194.209 348.628 190.796 350.598 188.722 353.611C186.781 356.428 186.276 360.028 186.956 363.345C188.187 369.351 193.243 374.041 197.507 378.105C213.771 391.889 237.722 397.757 258.754 395.938C277.382 394.327 294.852 386.112 306.932 371.629C309.792 368.2 311.798 364.372 311.3 359.786C310.918 356.283 309.287 352.397 306.453 350.188C304.098 348.351 301.526 347.879 298.618 347.714ZM187.43 188.242C177.489 188.242 169.43 196.301 169.43 206.242V305.578C169.43 315.519 177.489 323.578 187.43 323.578H194.529C204.47 323.578 212.529 315.519 212.529 305.578V206.242C212.529 196.301 204.47 188.242 194.529 188.242H187.43ZM302.939 188.242C292.998 188.242 284.94 196.301 284.939 206.242V305.578C284.939 315.519 292.998 323.578 302.939 323.578H310.04C319.981 323.578 328.04 315.519 328.04 305.578V206.242C328.04 196.301 319.981 188.242 310.04 188.242H302.939Z" fill="currentColor"/>
</svg>`;

const WORDMARK_SVG = `<svg width="439" height="82" viewBox="0 0 439 82" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M41.4199 1.66723C42.0246 0.267567 43.6491 -0.377561 45.0488 0.226799C45.1236 0.259111 45.1962 0.29627 45.2666 0.334221L58.5156 6.05785C59.9153 6.66262 60.5606 8.28796 59.9561 9.68774C59.3511 11.0873 57.7249 11.7319 56.3252 11.1272L45.3896 6.40258L42.1533 13.8938C49.3957 17.9475 54.5874 25.225 55.7861 33.7844H57.9834V44.2766H52.8594L52.7803 44.8616L50.998 58.7375C50.5372 62.4309 50.1647 66.1354 49.6875 69.8264C49.4797 71.4334 49.3521 73.1533 48.957 74.7229C48.7946 75.1259 48.5996 75.4913 48.3369 75.8372C45.7015 79.3057 39.2325 80.4405 35.1201 81.01C33.0041 81.3184 30.8677 81.4666 28.7295 81.4543C23.9552 81.3898 15.1552 80.151 11.3164 77.2141C10.4643 76.562 9.67397 75.7565 9.34375 74.7122C9.03748 73.7429 8.97753 72.6114 8.83789 71.6057L7.99707 65.5715L5.16113 44.2766H0V33.7844H2.06152C3.90799 20.5995 15.23 10.4525 28.9238 10.4524C31.7672 10.4524 34.5086 10.8901 37.084 11.7014L41.4199 1.66723ZM36.9805 55.3215C35.6016 55.5574 34.7515 56.9677 33.6152 57.7053C30.9174 59.4563 26.5569 59.1098 23.9814 57.2776C22.9801 56.5653 22.2357 55.1605 20.834 55.3782C20.2593 55.4676 19.712 55.7832 19.3799 56.2659C19.0693 56.717 18.9888 57.2933 19.0977 57.8245C19.2949 58.7863 20.1042 59.5378 20.7871 60.1887C23.3918 62.396 27.2274 63.3353 30.5957 63.0442C33.579 62.7862 36.3778 61.4711 38.3125 59.1516C38.7706 58.6024 39.0915 57.9886 39.0117 57.2541C38.9505 56.6932 38.6892 56.0708 38.2354 55.717C37.8582 55.423 37.4461 55.3479 36.9805 55.3215ZM19.7422 29.7805C17.8362 29.7805 16.2902 31.3257 16.29 33.2317V48.0041C16.2901 49.9103 17.8361 51.4553 19.7422 51.4553C21.6481 51.4551 23.1933 49.9101 23.1934 48.0041V33.2317C23.1932 31.3258 21.648 29.7807 19.7422 29.7805ZM38.2412 29.7805C36.3353 29.7806 34.7903 31.3258 34.79 33.2317V48.0041C34.7901 49.9102 36.3352 51.4552 38.2412 51.4553C40.1473 51.4553 41.6923 49.9103 41.6924 48.0041V33.2317C41.6922 31.3257 40.1472 29.7805 38.2412 29.7805Z" fill="currentColor"/>
<path d="M106.052 71.018C102.648 71.018 99.5893 70.426 96.876 69.242C94.212 68.0087 92.1153 66.3313 90.586 64.21C89.0567 62.0393 88.2673 59.548 88.218 56.736H95.396C95.6427 59.1533 96.6293 61.2007 98.356 62.878C100.132 64.506 102.697 65.32 106.052 65.32C109.259 65.32 111.775 64.5307 113.6 62.952C115.475 61.324 116.412 59.252 116.412 56.736C116.412 54.7627 115.869 53.1593 114.784 51.926C113.699 50.6927 112.342 49.7553 110.714 49.114C109.086 48.4727 106.891 47.782 104.128 47.042C100.724 46.154 97.986 45.266 95.914 44.378C93.8913 43.49 92.14 42.1087 90.66 40.234C89.2293 38.31 88.514 35.7447 88.514 32.538C88.514 29.726 89.2293 27.2347 90.66 25.064C92.0907 22.8933 94.0887 21.216 96.654 20.032C99.2687 18.848 102.253 18.256 105.608 18.256C110.443 18.256 114.389 19.4647 117.448 21.882C120.556 24.2993 122.307 27.506 122.702 31.502H115.302C115.055 29.5287 114.019 27.802 112.194 26.322C110.369 24.7927 107.951 24.028 104.942 24.028C102.13 24.028 99.836 24.768 98.06 26.248C96.284 27.6787 95.396 29.7013 95.396 32.316C95.396 34.1907 95.914 35.72 96.95 36.904C98.0353 38.088 99.3427 39.0007 100.872 39.642C102.451 40.234 104.646 40.9247 107.458 41.714C110.862 42.6513 113.6 43.5887 115.672 44.526C117.744 45.414 119.52 46.82 121 48.744C122.48 50.6187 123.22 53.184 123.22 56.44C123.22 58.956 122.554 61.324 121.222 63.544C119.89 65.764 117.917 67.5647 115.302 68.946C112.687 70.3273 109.604 71.018 106.052 71.018ZM181.896 29.208C185.053 29.208 187.865 29.874 190.332 31.206C192.798 32.4887 194.747 34.4373 196.178 37.052C197.608 39.6667 198.324 42.8487 198.324 46.598V70.5H191.664V47.56C191.664 43.5147 190.652 40.4313 188.63 38.31C186.656 36.1393 183.968 35.054 180.564 35.054C177.061 35.054 174.274 36.1887 172.202 38.458C170.13 40.678 169.094 43.9093 169.094 48.152V70.5H162.434V47.56C162.434 43.5147 161.422 40.4313 159.4 38.31C157.426 36.1393 154.738 35.054 151.334 35.054C147.831 35.054 145.044 36.1887 142.972 38.458C140.9 40.678 139.864 43.9093 139.864 48.152V70.5H133.13V29.948H139.864V35.794C141.196 33.6727 142.972 32.0447 145.192 30.91C147.461 29.7753 149.952 29.208 152.666 29.208C156.07 29.208 159.079 29.9727 161.694 31.502C164.308 33.0313 166.257 35.276 167.54 38.236C168.674 35.3747 170.549 33.1547 173.164 31.576C175.778 29.9973 178.689 29.208 181.896 29.208ZM227.056 71.166C223.257 71.166 219.804 70.3027 216.696 68.576C213.637 66.8493 211.22 64.4073 209.444 61.25C207.717 58.0433 206.854 54.3433 206.854 50.15C206.854 46.006 207.742 42.3553 209.518 39.198C211.343 35.9913 213.81 33.5493 216.918 31.872C220.026 30.1453 223.504 29.282 227.352 29.282C231.2 29.282 234.678 30.1453 237.786 31.872C240.894 33.5493 243.336 35.9667 245.112 39.124C246.937 42.2813 247.85 45.9567 247.85 50.15C247.85 54.3433 246.913 58.0433 245.038 61.25C243.213 64.4073 240.721 66.8493 237.564 68.576C234.407 70.3027 230.904 71.166 227.056 71.166ZM227.056 65.246C229.473 65.246 231.743 64.6787 233.864 63.544C235.985 62.4093 237.687 60.7073 238.97 58.438C240.302 56.1687 240.968 53.406 240.968 50.15C240.968 46.894 240.327 44.1313 239.044 41.862C237.761 39.5927 236.084 37.9153 234.012 36.83C231.94 35.6953 229.695 35.128 227.278 35.128C224.811 35.128 222.542 35.6953 220.47 36.83C218.447 37.9153 216.819 39.5927 215.586 41.862C214.353 44.1313 213.736 46.894 213.736 50.15C213.736 53.4553 214.328 56.2427 215.512 58.512C216.745 60.7813 218.373 62.4833 220.396 63.618C222.419 64.7033 224.639 65.246 227.056 65.246ZM274.39 71.166C270.591 71.166 267.138 70.3027 264.03 68.576C260.971 66.8493 258.554 64.4073 256.778 61.25C255.051 58.0433 254.188 54.3433 254.188 50.15C254.188 46.006 255.076 42.3553 256.852 39.198C258.677 35.9913 261.144 33.5493 264.252 31.872C267.36 30.1453 270.838 29.282 274.686 29.282C278.534 29.282 282.012 30.1453 285.12 31.872C288.228 33.5493 290.67 35.9667 292.446 39.124C294.271 42.2813 295.184 45.9567 295.184 50.15C295.184 54.3433 294.247 58.0433 292.372 61.25C290.547 64.4073 288.055 66.8493 284.898 68.576C281.741 70.3027 278.238 71.166 274.39 71.166ZM274.39 65.246C276.807 65.246 279.077 64.6787 281.198 63.544C283.319 62.4093 285.021 60.7073 286.304 58.438C287.636 56.1687 288.302 53.406 288.302 50.15C288.302 46.894 287.661 44.1313 286.378 41.862C285.095 39.5927 283.418 37.9153 281.346 36.83C279.274 35.6953 277.029 35.128 274.612 35.128C272.145 35.128 269.876 35.6953 267.804 36.83C265.781 37.9153 264.153 39.5927 262.92 41.862C261.687 44.1313 261.07 46.894 261.07 50.15C261.07 53.4553 261.662 56.2427 262.846 58.512C264.079 60.7813 265.707 62.4833 267.73 63.618C269.753 64.7033 271.973 65.246 274.39 65.246ZM312.252 35.498V59.4C312.252 61.3733 312.671 62.7793 313.51 63.618C314.349 64.4073 315.804 64.802 317.876 64.802H322.834V70.5H316.766C313.017 70.5 310.205 69.6367 308.33 67.91C306.455 66.1833 305.518 63.3467 305.518 59.4V35.498H300.264V29.948H305.518V19.736H312.252V29.948H322.834V35.498H312.252ZM351.121 29.208C354.18 29.208 356.942 29.874 359.409 31.206C361.876 32.4887 363.8 34.4373 365.181 37.052C366.612 39.6667 367.327 42.8487 367.327 46.598V70.5H360.667V47.56C360.667 43.5147 359.656 40.4313 357.633 38.31C355.61 36.1393 352.848 35.054 349.345 35.054C345.793 35.054 342.956 36.164 340.835 38.384C338.763 40.604 337.727 43.8353 337.727 48.078V70.5H330.993V15.74H337.727V35.72C339.059 33.648 340.884 32.0447 343.203 30.91C345.571 29.7753 348.21 29.208 351.121 29.208ZM414.291 29.948V70.5H407.557V64.506C406.274 66.578 404.474 68.206 402.155 69.39C399.886 70.5247 397.37 71.092 394.607 71.092C391.45 71.092 388.613 70.4507 386.097 69.168C383.581 67.836 381.583 65.8627 380.103 63.248C378.672 60.6333 377.957 57.4513 377.957 53.702V29.948H384.617V52.814C384.617 56.81 385.628 59.8933 387.651 62.064C389.674 64.1853 392.436 65.246 395.939 65.246C399.54 65.246 402.377 64.136 404.449 61.916C406.521 59.696 407.557 56.4647 407.557 52.222V29.948H414.291ZM429.139 23.362C427.856 23.362 426.771 22.918 425.883 22.03C424.995 21.142 424.551 20.0567 424.551 18.774C424.551 17.4913 424.995 16.406 425.883 15.518C426.771 14.63 427.856 14.186 429.139 14.186C430.372 14.186 431.408 14.63 432.247 15.518C433.135 16.406 433.579 17.4913 433.579 18.774C433.579 20.0567 433.135 21.142 432.247 22.03C431.408 22.918 430.372 23.362 429.139 23.362ZM432.395 29.948V70.5H425.661V29.948H432.395Z" fill="currentColor"/>
</svg>`;

interface LogoContextMenuContextValue {
  isOpen: boolean;
  position: { x: number; y: number };
  openMenu: (e: React.MouseEvent) => void;
  closeMenu: () => void;
}

const LogoContextMenuContext =
  createContext<LogoContextMenuContextValue | null>(null);

export function LogoContextMenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const openMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setIsOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <LogoContextMenuContext.Provider
      value={{ isOpen, position, openMenu, closeMenu }}
    >
      {children}
      <LogoContextMenuPopup />
    </LogoContextMenuContext.Provider>
  );
}

export function useLogoContextMenu() {
  const context = useContext(LogoContextMenuContext);
  if (!context) {
    throw new Error(
      "useLogoContextMenu must be used within LogoContextMenuProvider"
    );
  }
  return context;
}

function LogoContextMenuPopup() {
  const context = useContext(LogoContextMenuContext);
  const menuRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isOpen = context?.isOpen ?? false;
  const position = context?.position ?? { x: 0, y: 0 };
  const closeMenu = context?.closeMenu ?? (() => {});

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, closeMenu]);

  if (!mounted || !context) return null;

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const playPronunciation = (e: React.MouseEvent) => {
    handleMenuClick(e);
    const audio = new Audio("/smoothui-pronunciation.mp3");
    audio.play();
    closeMenu();
  };

  const copyToClipboard = async (e: React.MouseEvent, content: string) => {
    handleMenuClick(e);
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      // Silently fail - clipboard API may not be available in all contexts
    }
    closeMenu();
  };

  const downloadAll = async (e: React.MouseEvent) => {
    handleMenuClick(e);
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();

    // Add SVG files
    zip.file("smoothui-symbol.svg", LOGOMARK_SVG);
    zip.file("smoothui-wordmark.svg", WORDMARK_SVG);

    // Generate and download zip
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "smoothui-logos.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    closeMenu();
  };

  // Adjust position to stay within viewport
  const adjustedPosition = { ...position };
  if (typeof window !== "undefined") {
    const menuWidth = 220;
    const menuHeight = 220;
    if (position.x + menuWidth > window.innerWidth) {
      adjustedPosition.x = window.innerWidth - menuWidth - 16;
    }
    if (position.y + menuHeight > window.innerHeight) {
      adjustedPosition.y = window.innerHeight - menuHeight - 16;
    }
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          animate={
            shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }
          }
          className={cn(
            "fixed z-[100] min-w-[220px] rounded-lg bg-popover p-1 shadow-xl ring-1 ring-border"
          )}
          exit={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.95, y: -4 }
          }
          initial={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.95, y: -4 }
          }
          ref={menuRef}
          style={{
            left: adjustedPosition.x,
            top: adjustedPosition.y,
          }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { type: "spring", duration: 0.2, bounce: 0 }
          }
        >
          {/* Pronunciation Section */}
          <div className="border-border border-b py-1">
            <button
              className="flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-popover-foreground transition-colors hover:bg-muted"
              onClick={(e) => playPronunciation(e)}
              type="button"
            >
              <span className="font-medium">/smooth-yoo-eye/</span>
              <Volume2
                aria-hidden="true"
                className="size-4 text-muted-foreground"
              />
            </button>
          </div>

          {/* Copy Options */}
          <div className="border-border border-b py-1">
            <button
              className="flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-popover-foreground text-sm transition-colors hover:bg-muted"
              onClick={(e) => copyToClipboard(e, LOGOMARK_SVG)}
              type="button"
            >
              <span>Copy Symbol</span>
              <span className="text-muted-foreground text-xs">svg</span>
            </button>
            <button
              className="flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-popover-foreground text-sm transition-colors hover:bg-muted"
              onClick={(e) => copyToClipboard(e, WORDMARK_SVG)}
              type="button"
            >
              <span>Copy Wordmark</span>
              <span className="text-muted-foreground text-xs">svg</span>
            </button>
          </div>

          {/* Download All */}
          <div className="pt-1">
            <button
              className="flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-popover-foreground text-sm transition-colors hover:bg-muted"
              onClick={(e) => downloadAll(e)}
              type="button"
            >
              <span>Download all</span>
              <span className="text-muted-foreground text-xs">zip</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
