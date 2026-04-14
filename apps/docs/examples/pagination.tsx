"use client";

import Pagination from "@repo/smoothui/components/pagination";
import { useState } from "react";

export default function PaginationDemo() {
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(10);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-2">
        <p className="text-muted-foreground text-sm">
          Simple (5 pages) - Page {String(page1)}
        </p>
        <Pagination onPageChange={setPage1} page={page1} totalPages={5} />
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-muted-foreground text-sm">
          With ellipsis (20 pages) - Page {String(page2)}
        </p>
        <Pagination onPageChange={setPage2} page={page2} totalPages={20} />
      </div>
    </div>
  );
}
