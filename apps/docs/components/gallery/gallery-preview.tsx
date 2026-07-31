"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import dynamic from "next/dynamic";
import {
  Component,
  type ComponentType,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

export type GalleryPreviewProps = {
  /** Tallest the card may grow before the demo is cropped instead. */
  maxHeight?: number;
  /** Shortest the card may be, so a one-line demo still reads as a card. */
  minHeight?: number;
  slug: string;
  title: string;
};

/**
 * Cache of dynamically imported example components.
 * Prevents re-creating dynamic imports on every render.
 */
const componentCache = new Map<string, ComponentType>();

const getExampleComponent = (slug: string): ComponentType => {
  const cached = componentCache.get(slug);
  if (cached) {
    return cached;
  }

  const LazyComponent = dynamic(
    () =>
      import(`@docs/examples/${slug}`).catch(() => ({
        default: () => null,
      })),
    {
      loading: () => <PreviewSkeleton />,
      ssr: false,
    }
  );

  componentCache.set(slug, LazyComponent);
  return LazyComponent;
};

const PreviewSkeleton = () => (
  <div className="flex h-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-primary" />
  </div>
);

const PreviewFallback = ({ title }: { title: string }) => (
  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
    <span className="text-sm">{title}</span>
  </div>
);

/**
 * Error boundary wrapper using a class component
 * (error boundaries require class components in React).
 */
type ErrorBoundaryProps = {
  children: ReactNode;
  onError: () => void;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundaryWrapper extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(): void {
    this.props.onError();
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

/* Demos lay out on a stage sized to availWidth / BASE_SCALE, then the stage
   scales down until the whole demo fits the cell. MIN_SCALE stops tall demos
   from becoming unreadable — below it they center-crop instead. */
const BASE_SCALE = 0.75;
const MIN_SCALE = 0.45;
const SETTLE_DELAY_MS = 600;
const DEFAULT_MIN_HEIGHT = 200;
const DEFAULT_MAX_HEIGHT = 360;

export const GalleryPreview = ({
  maxHeight = DEFAULT_MAX_HEIGHT,
  minHeight = DEFAULT_MIN_HEIGHT,
  slug,
  title,
}: GalleryPreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [scale, setScale] = useState(BASE_SCALE);
  // The card is as tall as the demo actually is once scaled to the column, which
  // is what makes the grid a masonry instead of a wall of identical boxes: a
  // logo cloud is a strip, a hero is a page.
  const [height, setHeight] = useState(minHeight);

  useEffect(() => {
    if (!isVisible) {
      return;
    }
    const frame = frameRef.current;
    const stage = stageRef.current;
    if (!(frame && stage)) {
      return;
    }
    const compute = () => {
      const availW = frame.clientWidth;
      const w = stage.scrollWidth;
      const h = stage.scrollHeight;
      if (!(availW && w && h)) {
        return;
      }
      const fit = Math.max(MIN_SCALE, Math.min(availW / w, BASE_SCALE));
      setScale(fit);
      setHeight(Math.round(Math.min(Math.max(h * fit, minHeight), maxHeight)));
    };
    compute();
    const observer = new ResizeObserver(compute);
    observer.observe(frame);
    observer.observe(stage);
    const settle = setTimeout(compute, SETTLE_DELAY_MS);
    return () => {
      observer.disconnect();
      clearTimeout(settle);
    };
  }, [isVisible, maxHeight, minHeight]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  const ExampleComponent = isVisible ? getExampleComponent(slug) : null;

  return (
    <div
      aria-label={`Preview of ${title}`}
      className={cn(
        "relative w-full overflow-hidden bg-primary p-6",
        // contain:paint clips fixed/portal-less absolute demo content and
        // caps its z-index so previews never paint over the sticky nav.
        "isolate [contain:layout_paint]",
        "before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(var(--dots-color)_1px,transparent_1px)] before:[--dots-color:--alpha(var(--color-foreground)/5%)] before:[background-size:16px_16px]",
        "pointer-events-none select-none"
      )}
      ref={containerRef}
      style={{ height }}
    >
      {isVisible && ExampleComponent ? (
        <div
          className="relative z-10 flex h-full w-full items-center justify-center"
          ref={frameRef}
        >
          <div
            className="flex shrink-0 items-center justify-center"
            ref={stageRef}
            style={{
              minHeight: "100%",
              transform: `scale(${scale})`,
              width: `${100 / BASE_SCALE}%`,
            }}
          >
            <ErrorBoundaryWrapper onError={() => setHasError(true)}>
              {hasError ? (
                <PreviewFallback title={title} />
              ) : (
                <ExampleComponent />
              )}
            </ErrorBoundaryWrapper>
          </div>
        </div>
      ) : (
        <PreviewSkeleton />
      )}
    </div>
  );
};
