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

import { PreviewStage } from "./preview-stage";

export interface GalleryPreviewProps {
  children?: ReactNode;
  /**
   * Render the demo immediately instead of waiting for the tile to approach
   * the viewport. First screenful of a gallery only.
   */
  eager?: boolean;
  /** Landing demos are live, unscaled and uncropped; gallery defaults stay inert. */
  interactive?: boolean;
  slug: string;
  title: string;
}

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

interface ErrorBoundaryProps {
  children: ReactNode;
  onError: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

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

export const GalleryPreview = ({
  interactive = false,
  children,
  eager = false,
  slug,
  title,
}: GalleryPreviewProps) => {
  const containerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(eager);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!interactive || isVisible) {
      return;
    }
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
  }, [interactive, isVisible]);

  const ExampleComponent = children ? null : getExampleComponent(slug);

  const demo = (
    <ErrorBoundaryWrapper onError={() => setHasError(true)}>
      {hasError ? (
        <PreviewFallback title={title} />
      ) : (
        (children ?? (ExampleComponent ? <ExampleComponent /> : null))
      )}
    </ErrorBoundaryWrapper>
  );

  if (interactive) {
    return (
      <figure
        aria-label={`Preview of ${title}`}
        className="[&_[role=tablist]]:!translate-y-0 relative m-0 min-h-72 w-full rounded-xl bg-primary px-4 py-6"
        ref={containerRef}
      >
        <div className="flex min-h-60 w-full items-center justify-center">
          {isVisible ? demo : <PreviewSkeleton />}
        </div>
      </figure>
    );
  }

  return (
    <figure
      aria-label={`Preview of ${title}`}
      className={cn(
        "relative m-0 w-full overflow-hidden bg-primary",
        "isolate [contain:layout_paint]",
        "before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(var(--dots-color)_1px,transparent_1px)] before:[--dots-color:--alpha(var(--color-foreground)/5%)] before:[background-size:16px_16px]",
        "pointer-events-none select-none"
      )}
    >
      <PreviewStage eager={eager}>{demo}</PreviewStage>
    </figure>
  );
};
