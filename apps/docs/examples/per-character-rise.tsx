"use client";

import PerCharacterRise from "@repo/smoothui/components/per-character-rise";

const PerCharacterRiseDemo = () => (
  <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
    <PerCharacterRise className="font-bold text-4xl tracking-tight">
      Think different.
    </PerCharacterRise>
    <PerCharacterRise className="text-lg text-muted-foreground" delay={400}>
      Crisp per-character rise.
    </PerCharacterRise>
  </div>
);

export default PerCharacterRiseDemo;
