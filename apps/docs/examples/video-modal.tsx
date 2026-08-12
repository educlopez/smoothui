"use client";

import VideoModal from "@repo/smoothui/components/video-modal";

const SAMPLE_VIDEO_SRC =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

export default function VideoModalDemo() {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-8">
      <VideoModal
        captions={[
          {
            label: "English",
            src: "data:text/vtt,WEBVTT%0A%0A00:00:00.000%20--%3E%2000:00:04.000%0ABigger%2C%20bolder%2C%20blazing%20fast.",
            srcLang: "en",
          },
        ]}
        poster="https://picsum.photos/seed/video-modal/1280/720"
        src={SAMPLE_VIDEO_SRC}
        thumbnailAspect="16/9"
        title="Bigger Blazes — product trailer"
      />
    </div>
  );
}
