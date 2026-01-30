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
            <time className="mb-3 block font-medium font-mono text-foreground/70 text-sm">
              {date}
            </time>
            {version && (
              <div className="relative z-10 inline-flex items-center justify-center rounded-lg border border-border px-2 py-1 font-bold font-mono text-foreground text-sm">
                {version}
              </div>
            )}
          </div>
        </div>
        <div className="relative flex-1 pb-10 md:pl-8">
          <div className="absolute top-2 left-0 hidden h-full w-px bg-border md:block">
            <div className="absolute z-10 hidden size-3 -translate-x-1/2 rounded-full border bg-primary md:block" />
          </div>
          <div className="space-y-6">
            {title && (
              <h3 className="mb-3 scroll-mt-8 font-semibold text-2xl tracking-tight md:text-3xl">
                {title}
              </h3>
            )}
            <div className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-8 prose-headings:text-balance prose-p:text-balance prose-headings:font-semibold text-foreground/70 text-sm prose-headings:tracking-tight prose-p:tracking-tight prose-a:no-underline">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
