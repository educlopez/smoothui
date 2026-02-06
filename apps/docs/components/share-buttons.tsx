"use client";

import { Check, Copy, Linkedin, Twitter } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const fullUrl = `https://smoothui.dev${url}`;
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-foreground/60 text-sm">Share:</span>
      <a
        aria-label="Share on Twitter"
        className="rounded-md p-2 text-foreground/60 transition-colors hover:bg-accent hover:text-foreground"
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        <Twitter className="h-4 w-4" />
      </a>
      <a
        aria-label="Share on LinkedIn"
        className="rounded-md p-2 text-foreground/60 transition-colors hover:bg-accent hover:text-foreground"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        <Linkedin className="h-4 w-4" />
      </a>
      <button
        aria-label="Copy link"
        className="rounded-md p-2 text-foreground/60 transition-colors hover:bg-accent hover:text-foreground"
        onClick={copyToClipboard}
        type="button"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}
