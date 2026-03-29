"use client";

import Pagination from "@repo/smoothui/components/pagination";
import { useState } from "react";

export default function PaginationDemo() {
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(10);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-muted-foreground">
          Simple (5 pages) - Page {String(page1)}
        </p>
        <Pagination page={page1} totalPages={5} onPageChange={setPage1} />
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-muted-foreground">
          With ellipsis (20 pages) - Page {String(page2)}
        </p>
        <Pagination page={page2} totalPages={20} onPageChange={setPage2} />
      </div>
    </div>
  );
}
