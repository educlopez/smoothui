/** postMessage type: the docs column asking the iframe to show a named scene. */
export const DEMO_SCENE_MESSAGE = "SMOOTHUI_DEMO_SCENE";

/** postMessage type: the iframe listing the scenes it can show. */
export const DEMO_SCENES_READY = "SMOOTHUI_DEMO_SCENES";

/** postMessage type: the parent asking the iframe to re-announce its scenes. */
export const DEMO_SCENES_REQUEST = "SMOOTHUI_DEMO_SCENES_REQUEST";

export interface DemoSceneMessage {
  scene: string;
  type: typeof DEMO_SCENE_MESSAGE;
}

export interface DemoScenesReadyMessage {
  scenes: string[];
  type: typeof DEMO_SCENES_READY;
}

export interface DemoScenesRequestMessage {
  type: typeof DEMO_SCENES_REQUEST;
}

export const isDemoSceneMessage = (
  value: unknown
): value is DemoSceneMessage => {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const message = value as { scene?: unknown; type?: unknown };
  return (
    message.type === DEMO_SCENE_MESSAGE && typeof message.scene === "string"
  );
};

export const isDemoScenesReadyMessage = (
  value: unknown
): value is DemoScenesReadyMessage => {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const message = value as { scenes?: unknown; type?: unknown };
  return (
    message.type === DEMO_SCENES_READY &&
    Array.isArray(message.scenes) &&
    message.scenes.every((scene) => typeof scene === "string")
  );
};

export const isDemoScenesRequestMessage = (
  value: unknown
): value is DemoScenesRequestMessage => {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  return (value as { type?: unknown }).type === DEMO_SCENES_REQUEST;
};
