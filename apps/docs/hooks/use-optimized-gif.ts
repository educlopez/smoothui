import { useEffect, useRef, useState } from "react";

interface UseOptimizedGifOptions {
  gifUrl: string;
  placeholderUrl: string;
  threshold?: number;
  rootMargin?: string;
  enableMotion?: boolean;
}

interface UseOptimizedGifReturn {
  shouldLoad: boolean;
  isVisible: boolean;
  isLoaded: boolean;
  src: string;
  ref: React.RefObject<HTMLElement | null>;
}

export function useOptimizedGif({
  gifUrl,
  placeholderUrl,
  threshold = 0.1,
  rootMargin = "100px",
  enableMotion = true,
}: UseOptimizedGifOptions): UseOptimizedGifReturn {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  // Check user preferences and device capabilities
  useEffect(() => {
    const checkCapabilities = () => {
      // Check if user prefers reduced motion
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Check if device is on a slow connection
      const connection = (navigator as any).connection;
      const isSlowConnection =
        connection &&
        (connection.effectiveType === "slow-2g" ||
          connection.effectiveType === "2g" ||
          connection.effectiveType === "3g");

      // Check if device has limited memory
      const hasLimitedMemory =
        (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;

      // Check if user is on mobile (more aggressive optimization)
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      // Check if user has data saver enabled
      const hasDataSaver = connection && connection.saveData;

      setShouldLoad(
        enableMotion &&
          !prefersReducedMotion &&
          !isSlowConnection &&
          !hasLimitedMemory &&
          !hasDataSaver &&
          (!isMobile || connection?.effectiveType === "4g")
      );
    };

    checkCapabilities();

    // Listen for changes in user preferences
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    motionQuery.addEventListener("change", checkCapabilities);

    return () => motionQuery.removeEventListener("change", checkCapabilities);
  }, [enableMotion]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!(elementRef.current && shouldLoad)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [shouldLoad, threshold, rootMargin]);

  // Load GIF only when visible and conditions are met
  useEffect(() => {
    if (isVisible && shouldLoad) {
      const img = new Image();
      img.onload = () => setIsLoaded(true);
      img.onerror = () => {
        // Fallback to placeholder if GIF fails to load
        console.warn("Failed to load GIF, using placeholder");
        setIsLoaded(false);
      };
      img.src = gifUrl;
    }
  }, [isVisible, shouldLoad, gifUrl]);

  // Determine which source to use
  const src = shouldLoad && isVisible && isLoaded ? gifUrl : placeholderUrl;

  return {
    shouldLoad,
    isVisible,
    isLoaded,
    src,
    ref: elementRef,
  };
}
