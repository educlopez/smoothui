"use client";

import {
  type ContributionData,
  ContributionGraph,
} from "@repo/smoothui/components/contribution-graph";
import { useMemo, useState } from "react";

// Generate sample contribution data
const generateSampleData = (year: number): ContributionData[] => {
  const data: ContributionData[] = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    // Randomly generate contribution data
    const count = Math.random() < 0.3 ? Math.floor(Math.random() * 20) : 0;
    const level = count === 0 ? 0 : Math.min(4, Math.ceil(count / 4));

    data.push({
      date: date.toISOString().split("T")[0],
      count,
      level,
    });
  }

  return data;
};

export function ContributionGraphDemo() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [showLegend, setShowLegend] = useState(true);
  const [showTooltips, setShowTooltips] = useState(true);

  const sampleData = useMemo(() => generateSampleData(year), [year]);

  return (
    <div className="space-y-6">
      {/* Contribution Graph */}
      <div className="max-w-lg rounded-lg border bg-background p-2">
        <ContributionGraph
          className="w-full"
          data={sampleData}
          showLegend={showLegend}
          showTooltips={showTooltips}
          year={2025}
        />
      </div>
    </div>
  );
}

export default ContributionGraphDemo;
