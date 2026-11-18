import { cn } from "@repo/shadcn-ui/lib/utils";
import type { Metadata } from "next";
import Link, { type LinkProps } from "next/link";
import { IconBooksFill24, IconPencilFill24 } from "nucleo-core-fill-24";

const DOCS_DESCRIPTION =
  "Docs for SmoothUI: animated React components on Motion and Tailwind, installed from the shadcn registry.";

export const metadata: Metadata = {
  alternates: {
    canonical: "/docs",
  },
  description: DOCS_DESCRIPTION,
  // Without these, this page inherited the root layout's title and description
  // verbatim, so / and /docs were duplicates of each other. Open Graph and
  // Twitter are set too: the root layout defines them absolutely, and a child
  // title does not replace that social title on its own.
  openGraph: {
    description: DOCS_DESCRIPTION,
    title: "Documentation",
    url: "/docs",
  },
  title: "Documentation",
  twitter: {
    description: DOCS_DESCRIPTION,
    title: "Documentation",
  },
};

const PORTAL = [
  {
    description: "The guides for SmoothUI.",
    href: "/docs/guides",
    icon: <IconBooksFill24 className="size-full" />,
    name: "Documentation",
  },
  {
    description: "The library of SmoothUI components.",
    href: "/docs/components",
    icon: <IconPencilFill24 className="size-full" />,
    name: "Components",
  },
  {
    description: "The library of SmoothUI blocks.",
    href: "/docs/blocks",
    icon: <IconPencilFill24 className="size-full" />,
    name: "Blocks",
  },
] as const;

export default function DocsPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 pt-16 pb-16 md:pt-24">
      <div className="mx-auto w-full max-w-3xl text-center">
        <h1 className="font-semibold text-3xl text-foreground md:text-4xl">
          SmoothUI documentation
        </h1>
        <p className="mt-3 text-balance text-base text-foreground/70 leading-relaxed">
          Guides, components and blocks. Pick a section, or keep reading for how
          to install them.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {PORTAL.map((item) => (
          <Item
            className="flex flex-row gap-4"
            href={item.href}
            key={item.name}
          >
            <Icon>{item.icon}</Icon>
            <div className="flex flex-col">
              <h2 className="mb-1 font-semibold text-foreground">
                {item.name}
              </h2>
              <p className="text-foreground/70 text-sm">{item.description}</p>
            </div>
          </Item>
        ))}
      </div>

      <div className="mx-auto mt-16 w-full max-w-3xl space-y-4 text-base text-foreground/80 leading-relaxed">
        <p>
          SmoothUI is a library of animated React components, blocks and
          templates. You install them into your own project the same way you
          install shadcn/ui: the files land in your repo, you own the code, and
          you change whatever the design needs. It is for people who already
          ship React interfaces and want motion that feels finished, without
          designing every spring by hand.
        </p>
        <p>
          The stack is React, Motion and Tailwind CSS. Components follow shadcn
          patterns and install from the SmoothUI registry, so a button, an input
          or a whole pricing section arrives with its animation, its
          reduced-motion behaviour and its design tokens. Motion is the
          animation engine. SmoothUI is the set of components on top of it:
          primitives, interactive components, and page sections you can read and
          edit.
        </p>
        <p>
          Use the docs when a shadcn project needs motion, when a marketing page
          needs a hero or a pricing table, or when you want a component you can
          open in the editor. A one-off fade is often just CSS. Choosing an
          animation engine is a different question, and it lives on the blog
          post linked below. This page is the map.
        </p>

        <h2 className="mt-12 font-semibold text-2xl text-foreground">
          How to install
        </h2>
      </div>
      <div className="mx-auto mt-4 w-full max-w-3xl space-y-4 text-base text-foreground/80 leading-relaxed">
        <p>
          You need a React project with Tailwind CSS. If shadcn is not
          initialized yet, the{" "}
          <TextLink href="/docs/guides/getting-started">
            getting started guide
          </TextLink>{" "}
          walks through that first. The{" "}
          <TextLink href="/docs/guides/installation">
            installation guide
          </TextLink>{" "}
          covers the CLI, the registry and a manual copy. Two commands cover
          almost every component.
        </p>
        <p>SmoothUI CLI:</p>
        <pre className="overflow-x-auto rounded-xl border border-border bg-card p-4 font-mono text-foreground text-sm">
          <code>npx smoothui-cli@latest add smooth-button</code>
        </pre>
        <p>The same component from the shadcn registry:</p>
        <pre className="overflow-x-auto rounded-xl border border-border bg-card p-4 font-mono text-foreground text-sm">
          <code>npx shadcn@latest add @smoothui/smooth-button</code>
        </pre>
        <p>
          Both copy the component into your project and pull in what it needs,
          including Motion. Run{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground text-sm">
            npx smoothui-cli@latest add
          </code>{" "}
          with no name to pick from a list. After the first component, browse
          the catalogue instead of installing blindly.
        </p>
      </div>

      <div className="mx-auto mt-12 w-full max-w-3xl">
        <h2 className="font-semibold text-2xl text-foreground">
          Where to go next
        </h2>
      </div>
      <div className="mx-auto mt-4 w-full max-w-3xl space-y-4 text-base text-foreground/80 leading-relaxed">
        <p>
          Components are the individual pieces: buttons, text, inputs, cards.
          Blocks are full sections for a marketing page. Guides explain setup,
          themes and how motion should behave in a shadcn project.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <TextLink href="/docs/components">Components</TextLink> — every
            animated component, with a live preview and the install command.
          </li>
          <li>
            <TextLink href="/docs/blocks">Blocks</TextLink> — heroes, pricing,
            testimonials, footers and the other page sections.
          </li>
          <li>
            <TextLink href="/docs/guides/animated-components">
              Animated components
            </TextLink>{" "}
            — what the motion in the catalogue actually does.
          </li>
          <li>
            <TextLink href="/docs/guides/themes">Themes</TextLink> — colour
            themes you can install into any shadcn project.
          </li>
          <li>
            <TextLink href="/docs/guides/add-animations-to-shadcn">
              Add animations to shadcn
            </TextLink>{" "}
            — CSS, hand-rolled Motion, or a pre-animated component.
          </li>
          <li>
            <TextLink href="/blog/best-react-animation-libraries">
              Best react animation libraries
            </TextLink>{" "}
            — the comparison of animation engines, and where SmoothUI sits on
            top of Motion.
          </li>
          <li>
            <TextLink href="/blog/ai-design-slop">AI design slop</TextLink> —
            why generated UI looks the same, and what to check before you ship
            it.
          </li>
        </ul>
      </div>
    </main>
  );
}

function TextLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      className="focus-ring rounded-sm font-medium text-foreground underline underline-offset-4 outline-none"
      href={href}
    >
      {children}
    </Link>
  );
}

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 size-8 shrink-0 rounded-lg border border-border bg-primary p-1 text-foreground/70">
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
        "focus-ring rounded-2xl border border-border bg-card p-4 shadow-lg outline-none",
        props.className
      )}
    >
      {props.children}
    </Link>
  );
}
