"use client";

import { Github } from "lucide-react";
import Link from "next/link";

export function GithubStars() {
  return (
    <Link
      className="flex items-center gap-2 font-medium text-sm transition-colors hover:text-brand"
      href="https://github.com/educlopez/smoothui"
      rel="noopener noreferrer"
      target="_blank"
    >
      <Github className="size-4" />
      <span>educlopez/smoothui</span>
    </Link>
  );
}
