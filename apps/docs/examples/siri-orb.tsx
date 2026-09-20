"use client";

import {
  type AIState,
  useSimulatedAmplitude,
} from "@repo/smoothui/components/ai-core";
import SiriOrb from "@repo/smoothui/components/siri-orb";

const StateScene = ({ state }: { state: AIState }) => {
  const amplitude = useSimulatedAmplitude(state);

  return (
    <div className="flex items-center justify-center p-8">
      <SiriOrb amplitude={amplitude} size="120px" state={state} />
    </div>
  );
};

const IdleDemo = () => <StateScene state="idle" />;
const ListeningDemo = () => <StateScene state="listening" />;
const ThinkingDemo = () => <StateScene state="thinking" />;
const StreamingDemo = () => <StateScene state="streaming" />;
const DoneDemo = () => <StateScene state="done" />;
const ErrorDemo = () => <StateScene state="error" />;

export const demoScenes = {
  Done: DoneDemo,
  Error: ErrorDemo,
  Features: IdleDemo,
  Idle: IdleDemo,
  Listening: ListeningDemo,
  Streaming: StreamingDemo,
  Thinking: ThinkingDemo,
};

export default function SiriOrbDemo() {
  return <IdleDemo />;
}
