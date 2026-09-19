"use client";

import MusicToggle from "@repo/smoothui/components/music-toggle";
import { useState } from "react";

export default function MusicToggleDemo() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0.35);

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-8 px-4 py-8">
      <MusicToggle
        artist="SmoothUI Radio"
        onPlayingChange={setPlaying}
        onSeek={setProgress}
        playing={playing}
        progress={progress}
        title="Midnight Drive"
      />
      <MusicToggle
        artist="Purely visual, no audio element"
        bars={16}
        defaultPlaying
        size={72}
        title="Caller-driven playback"
      />
    </div>
  );
}
