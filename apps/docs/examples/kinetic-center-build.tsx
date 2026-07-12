"use client";

import KineticCenterBuild from "@repo/smoothui/components/kinetic-center-build";

const KineticCenterBuildDemo = () => (
  <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
    <KineticCenterBuild
      className="font-bold text-4xl tracking-tight"
      phrases={["Words push left", "Type locks center", "Build the line"]}
    />
  </div>
);

export default KineticCenterBuildDemo;
