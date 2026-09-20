"use client";

import MusicToggle from "@repo/smoothui/components/music-toggle";
import { useState } from "react";

const PlayerDemo = () => {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0.35);

  return (
    <div className="flex items-center justify-center p-8">
      <MusicToggle
        artist="SmoothUI Radio"
        onPlayingChange={setPlaying}
        onSeek={setProgress}
        playing={playing}
        progress={progress}
        title="Midnight Drive"
      />
    </div>
  );
};

const VisualDemo = () => (
  <div className="flex items-center justify-center p-8">
    <MusicToggle
      artist="Purely visual, no audio element"
      bars={16}
      defaultPlaying
      size={72}
      title="Caller-driven playback"
    />
  </div>
);

export const demoScenes = {
  "Caller-driven": VisualDemo,
  Features: PlayerDemo,
  Player: PlayerDemo,
};

export default function MusicToggleDemo() {
  return <PlayerDemo />;
}
