import { cn } from "@repo/shadcn-ui/lib/utils";
import { Library, Pencil } from "lucide-react";
import Link, { type LinkProps } from "next/link";

export default function DocsPage() {
  return (
    <main className="container z-2 flex flex-1 flex-col items-center justify-center py-24 text-center md:py-36">
      <h1 className="mb-4 font-semibold text-3xl md:text-4xl">
        Getting Started
      </h1>
      <p className="text-foreground/70 text-md">
        Portal to different sections of docs.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 text-start md:grid-cols-3">
        {[
          {
            name: "Documentation",
            description: "The guides for SmoothUI.",
            icon: <Library className="size-full" />,
            href: "/docs/guides",
          },
          {
            name: "Components",
            description: "The library of SmoothUI components.",
            icon: <Pencil className="size-full" />,
            href: "/docs/components",
          },
          {
            name: "Blocks",
            description: "The library of SmoothUI blocks.",
            icon: <Pencil className="size-full" />,
            href: "/docs/blocks",
          },
        ].map((item) => (
          <Item
            className="flex flex-row gap-4"
            href={item.href}
            key={item.name}
          >
            <Icon>{item.icon}</Icon>
            <div className="flex flex-col">
              <h2 className="mb-2 font-semibold">{item.name}</h2>
              <p className="text-foreground/70 text-sm">{item.description}</p>
            </div>
          </Item>
        ))}
      </div>
    </main>
  );
}

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 size-8 rounded-lg border bg-primary p-1 text-foreground/70">
      {children}
    </div>
  );
}

function Item(
  props: LinkProps & { children: React.ReactNode; className?: string }
) {
  return (
    <Link
      {...props}
      className={cn(
        "rounded-2xl border bg-card p-4 shadow-lg",
        props.className
      )}
    >
      {props.children}
    </Link>
  );
}
