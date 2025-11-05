"use client";

export function ChangelogEntry({
  date,
  version,
  title,
  children,
}: {
  date: string;
  version?: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative m-0">
      <div className="flex flex-col gap-y-6 md:flex-row">
        <div className="shrink-0 md:w-48">
          <div className="pb-10 md:sticky md:top-16">
            <time className="text-foreground/70 mb-3 block font-mono text-sm font-medium">
              {date}
            </time>
            {version && (
              <div className="text-foreground border-border relative z-10 inline-flex items-center justify-center rounded-lg border px-2 py-1 font-mono text-sm font-bold">
                {version}
              </div>
            )}
          </div>
        </div>
        <div className="relative flex-1 pb-10 md:pl-8">
          <div className="bg-border absolute top-2 left-0 hidden h-full w-px md:block">
            <div className="bg-primary absolute z-10 hidden size-3 -translate-x-1/2 rounded-full border md:block" />
          </div>
          <div className="space-y-6">
            {title && (
              <h3 className="mb-3 font-semibold text-2xl md:text-3xl scroll-mt-8 tracking-tight">
                {title}
              </h3>
            )}
            <div className="prose text-foreground/70 dark:prose-invert prose-headings:scroll-mt-8 prose-headings:font-semibold prose-a:no-underline prose-headings:tracking-tight prose-headings:text-balance prose-p:tracking-tight prose-p:text-balance max-w-none text-sm">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

