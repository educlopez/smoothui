"use client";

import FadeThrough from "@repo/smoothui/components/fade-through";

const FadeThroughDemo = () => (
  <div className="flex min-h-[300px] flex-col items-center justify-center gap-8 text-center">
    <div className="flex flex-col items-center gap-2">
      <p className="text-muted-foreground text-sm uppercase tracking-widest">
        We help you
      </p>
      <FadeThrough
        className="font-bold text-4xl tracking-tight"
        phrases={["Ship faster.", "Build smarter.", "Scale further."]}
      />
    </div>

    <FadeThrough
      className="text-lg text-muted-foreground"
      interval={3000}
      phrases={[
        "Beautifully animated components.",
        "Accessible by default.",
        "Copy-paste ready.",
      ]}
    />
  </div>
);

export default FadeThroughDemo;
