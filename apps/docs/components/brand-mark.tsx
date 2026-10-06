import { BRAND_ICONS, type BrandKey } from "@docs/lib/brand-icons";
import { splitBrandText } from "@docs/lib/brand-text";
import { cn } from "@repo/shadcn-ui/lib/utils";
import {
  Children,
  cache,
  cloneElement,
  Fragment,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

// Marks are drawn to the height of the text and capped in width, so a wide
// wordmark such as Motion does not push the line apart.
const MARK_HEIGHT_EM = 0.95;
const MARK_MAX_WIDTH_EM = 1.5;

/** A project name with its mark in front, kept on one line. */
export const Brand = ({
  brand,
  children,
  className,
}: {
  brand: BrandKey;
  children: ReactNode;
  className?: string;
}) => {
  const icon = BRAND_ICONS[brand];
  const [, , width, height] = icon.viewBox.split(" ").map(Number);
  const ratio = width / height;
  const markHeight = Math.min(MARK_HEIGHT_EM, MARK_MAX_WIDTH_EM / ratio);

  return (
    <span className={cn("whitespace-nowrap", className)}>
      <svg
        aria-hidden="true"
        className="mr-[0.3em] inline-block shrink-0 align-[-0.14em] text-foreground/80"
        fill="currentColor"
        focusable="false"
        style={{ height: `${markHeight}em`, width: `${markHeight * ratio}em` }}
        viewBox={icon.viewBox}
      >
        {icon.paths.map((d) => (
          <path d={d} key={d} />
        ))}
      </svg>
      {children}
    </span>
  );
};

// A page renders once per request, so this set is the marks it already shows.
// Only the first mention of each project gets one; marking every repeat turns
// a page about a single framework into a wall of logos.
const shownOnPage = cache(() => new Set<BrandKey>());

// Only wrappers that carry running text are walked into. Code, components and
// anything unknown are returned as they are, so a name inside `code` or a
// custom component never turns into a mark.
const TEXT_TAGS = new Set(["a", "b", "em", "i", "strong", "del"]);

/** Replaces project names in running text with <Brand>, leaving the rest as is. */
export const brandify = (node: ReactNode): ReactNode => {
  if (typeof node === "string") {
    const parts = splitBrandText(node);
    if (parts.length === 1 && typeof parts[0] === "string") {
      return node;
    }
    const shown = shownOnPage();
    return parts.map((part, index) => {
      if (typeof part === "string" || shown.has(part.brand)) {
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: static split of one string, never reordered
          <Fragment key={index}>
            {typeof part === "string" ? part : part.name}
          </Fragment>
        );
      }
      shown.add(part.brand);
      return (
        // biome-ignore lint/suspicious/noArrayIndexKey: static split of one string, never reordered
        <Brand brand={part.brand} key={index}>
          {part.name}
        </Brand>
      );
    });
  }

  if (Array.isArray(node)) {
    return Children.map(node, brandify);
  }

  if (
    isValidElement<{ children?: ReactNode }>(node) &&
    typeof node.type === "string" &&
    TEXT_TAGS.has(node.type)
  ) {
    const element = node as ReactElement<{ children?: ReactNode }>;
    return cloneElement(element, undefined, brandify(element.props.children));
  }

  return node;
};
