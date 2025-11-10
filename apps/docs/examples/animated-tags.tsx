"use client";

import AnimatedTags from "@repo/smoothui/components/animated-tags";
import { useState } from "react";

const Example = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <AnimatedTags
        initialTags={[
          "react",
          "typescript",
          "tailwindcss",
          "nextjs",
          "framer-motion",
          "shadcn",
        ]}
        onChange={setSelectedTags}
        selectedTags={selectedTags}
      />
    </div>
  );
};

export default Example;
