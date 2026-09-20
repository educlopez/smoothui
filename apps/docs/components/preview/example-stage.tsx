"use client";

import {
  DEMO_SCENES_READY,
  isDemoSceneMessage,
  isDemoScenesRequestMessage,
} from "@docs/lib/demo-scenes";
import {
  type ComponentType,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

interface ExampleModule {
  default: ComponentType;
  demoScenes?: Record<string, ComponentType>;
}

/**
 * Renders the live example inside the preview iframe, and swaps it when the
 * docs column names a section that matches a `demoScenes` export.
 *
 * The default export stays on screen until a scene is asked for, so the first
 * paint is the same as it was before scenes existed.
 */
export const ExampleStage = ({
  children,
  exampleId,
}: {
  children: ReactNode;
  exampleId: string;
}) => {
  const [Scene, setScene] = useState<ComponentType | null>(null);
  const scenesRef = useRef<Record<string, ComponentType>>({});

  useEffect(() => {
    let cancelled = false;

    const announce = () => {
      const names = Object.keys(scenesRef.current);
      if (names.length === 0) {
        return;
      }
      window.parent?.postMessage(
        { scenes: names, type: DEMO_SCENES_READY },
        window.location.origin
      );
    };

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }
      if (isDemoScenesRequestMessage(event.data)) {
        announce();
        return;
      }
      if (!isDemoSceneMessage(event.data)) {
        return;
      }
      const next = scenesRef.current[event.data.scene];
      if (next) {
        setScene(() => next);
      }
    };

    const load = async () => {
      const mod = (await import(
        `@docs/examples/${exampleId}`
      )) as ExampleModule;
      if (cancelled) {
        return;
      }
      const scenes: Record<string, ComponentType> = {
        default: mod.default,
        ...mod.demoScenes,
      };
      scenesRef.current = scenes;
      announce();
    };

    window.addEventListener("message", onMessage);
    load().catch(() => {
      // The server page already 404s missing examples.
    });

    return () => {
      cancelled = true;
      window.removeEventListener("message", onMessage);
    };
  }, [exampleId]);

  if (Scene) {
    return <Scene />;
  }

  return children;
};
