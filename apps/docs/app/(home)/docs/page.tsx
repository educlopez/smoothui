import { Library, Pencil } from "lucide-react";
import Link, { type LinkProps } from "next/link";

export default function DocsPage() {
  return (
    <main className="container z-2 flex flex-1 flex-col items-center justify-center py-16 text-center">
      <h1 className="mb-4 font-semibold text-3xl md:text-4xl">
        Getting Started
      </h1>
      <p className="text-fd-muted-foreground">
        Portal to different sections of docs.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 text-start md:grid-cols-3">
        {[
          {
            name: "Documentation",
            description: "The core library of documentation.",
            icon: <Library className="size-full" />,
            href: "/docs/guides",
          },
          {
            name: "Components",
            description: "The library of components.",
            icon: <Pencil className="size-full" />,
            href: "/docs/components",
          },
          {
            name: "Blocks",
            description: "The library of blocks.",
            icon: <Pencil className="size-full" />,
            href: "/docs/blocks",
          },
        ].map((item) => (
          <Item href={item.href} key={item.name}>
            <Icon>{item.icon}</Icon>
            <h2 className="mb-2 font-medium">{item.name}</h2>
            <p className="text-fd-muted-foreground text-sm">
              {item.description}
            </p>
          </Item>
        ))}
      </div>
    </main>
  );
}

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 size-8 rounded-lg border bg-fd-muted p-1 text-fd-muted-foreground shadow-md">
      {children}
    </div>
  );
}

function Item(props: LinkProps & { children: React.ReactNode }) {
  return (
    <Link {...props} className="rounded-2xl border bg-fd-card p-4 shadow-lg">
      {props.children}
    </Link>
  );
}
