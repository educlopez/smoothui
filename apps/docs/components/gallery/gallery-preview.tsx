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
      ssr: false,
      loading: () => <PreviewSkeleton />,
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

export const GalleryPreview = ({ slug, title }: GalleryPreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);

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
      ref={containerRef}
      aria-label={`Preview of ${title}`}
      className={cn(
        "relative h-[200px] w-full overflow-hidden rounded-t-lg bg-muted/30",
        "pointer-events-none select-none"
      )}
    >
      {isVisible && ExampleComponent ? (
        <div className="flex h-full w-full items-center justify-center [&>*]:scale-[0.6] [&>*]:transform">
          <ErrorBoundaryWrapper onError={() => setHasError(true)}>
            {hasError ? (
              <PreviewFallback title={title} />
            ) : (
              <ExampleComponent />
            )}
          </ErrorBoundaryWrapper>
        </div>
      ) : (
        <PreviewSkeleton />
      )}
    </div>
  );
};
