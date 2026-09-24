"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/** Height of one grid row. Tiles span as many as they need. */
const ROW = 4;

/**
 * Heights already measured, by tile key.
 *
 * Filtering the wall unmounts every tile, and without a cache the grid comes
 * back as a row of four-pixel slivers for a frame while it measures itself
 * again. Keyed by the page URL, which is stable across filters and visits.
 */
const measured = new Map<string, number>();

const rowsFor = (height: number, gap: number) =>
  Math.max(1, Math.ceil((height + gap) / (ROW + gap)));

const rowsForFrame = (
  frame: MasonryFrame,
  columnWidth: number,
  gap: number
) => {
  const imageHeight = columnWidth * (frame.height / frame.width);
  // The extra pixels cover subpixel image height so a card cannot spill
  // into the tile below. The slack sits under the card, inside the cell.
  return rowsFor(imageHeight + frame.chrome + 4, gap);
};

const rowEnd = (
  rows: number | undefined,
  ready: boolean,
  cached: number | undefined,
  gap: number
) => {
  if (rows !== undefined) {
    return `span ${rows}`;
  }
  if (ready && cached) {
    return `span ${rowsFor(cached, gap)}`;
  }
};

/**
 * Handed to whatever a tile holds so it can ask for more width.
 *
 * A gallery cannot know how big a component is — the component does, once
 * it has been laid out. `PreviewStage` measures itself and calls `report(2)`
 * when what it is showing needs a page rather than a column.
 */
export const MasonryItemContext = createContext<{
  report: (span: number) => void;
} | null>(null);

/**
 * Intrinsic poster size. The row span is computed from the column width, so
 * the tile is not measured.
 */
export interface MasonryFrame {
  /** Pixels below the scaled image: footer and card border. */
  chrome: number;
  height: number;
  width: number;
}

export interface MasonryTile {
  frame?: MasonryFrame;
  key: string;
  node: ReactNode;
}

export interface MasonryGridProps {
  className?: string;
  gap?: number;
  maxColumns?: number;
  minColumnWidth?: number;
  tiles: MasonryTile[];
}

/**
 * A packed grid where a tile is as tall as its contents and, when it asks,
 * twice as wide.
 *
 * CSS columns got the packing right and nothing else: an item cannot span
 * two of them, so every component — a tag and an application shell alike —
 * was pressed into the same narrow measure. This is a real grid on a four
 * pixel row, each tile spanning the rows it needs, `dense` so a wide tile
 * that cannot fit the remaining slot does not leave a hole behind it.
 */
export const MasonryGrid = ({
  tiles,
  gap = 16,
  minColumnWidth = 280,
  maxColumns = 4,
  className,
}: MasonryGridProps) => {
  const ref = useRef<HTMLUListElement>(null);
  const [layout, setLayout] = useState({ columns: 0, width: 0 });
  const [spans, setSpans] = useState<Record<string, number>>({});

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    const measure = () => {
      const nextWidth = node.clientWidth;
      if (nextWidth <= 0) {
        return;
      }
      const fits = Math.floor((nextWidth + gap) / (minColumnWidth + gap));
      const nextColumns = Math.max(1, Math.min(maxColumns, fits));
      setLayout((prev) =>
        prev.columns === nextColumns && Math.abs(prev.width - nextWidth) < 1
          ? prev
          : { columns: nextColumns, width: nextWidth }
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [gap, minColumnWidth, maxColumns]);

  // Only ever upward: a tile that has asked for two columns keeps them. The
  // ask is based on the demo's height at full width, but granting it changes
  // the tile's width — letting the answer travel back would be a loop.
  const report = useCallback((key: string, span: number) => {
    setSpans((prev) => (prev[key] >= span ? prev : { ...prev, [key]: span }));
  }, []);

  const { columns, width } = layout;
  const columnWidth = columns > 0 ? (width - gap * (columns - 1)) / columns : 0;

  return (
    <ul
      className={cn("m-0 list-none p-0", className)}
      ref={ref}
      style={{
        columnGap: gap,
        display: "grid",
        gridAutoFlow: "row dense",
        gridAutoRows: columns > 0 ? `${ROW}px` : "auto",
        gridTemplateColumns:
          columns > 0
            ? `repeat(${columns}, minmax(0, 1fr))`
            : `repeat(auto-fill, minmax(${minColumnWidth}px, 1fr))`,
        rowGap: gap,
      }}
    >
      {tiles.map((tile) => (
        <Cell
          gap={gap}
          itemKey={tile.key}
          key={tile.key}
          onSpan={report}
          ready={columns > 0}
          rows={
            tile.frame && columnWidth > 0
              ? rowsForFrame(tile.frame, columnWidth, gap)
              : undefined
          }
          span={
            tile.frame
              ? 1
              : Math.min(spans[tile.key] ?? 1, Math.max(1, columns || 1))
          }
        >
          {tile.node}
        </Cell>
      ))}
    </ul>
  );
};

const Cell = ({
  itemKey,
  span,
  gap,
  ready,
  rows,
  onSpan,
  children,
}: {
  itemKey: string;
  span: number;
  gap: number;
  ready: boolean;
  /** Set for posters. Skips the per-tile ResizeObserver. */
  rows?: number;
  onSpan: (key: string, span: number) => void;
  children: ReactNode;
}) => {
  const cellRef = useRef<HTMLLIElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // Remeasure when `span` changes: the extra column changes the cell's
  // width, which changes its height, and the observer would otherwise miss
  // a resize that we applied ourselves.
  useEffect(() => {
    if (rows !== undefined) {
      return;
    }

    const cell = cellRef.current;
    const inner = innerRef.current;
    if (!(cell && inner)) {
      return;
    }

    if (!ready) {
      cell.style.gridRowEnd = "";
      return;
    }

    let frame = 0;

    const apply = () => {
      if (span < 1) {
        return;
      }
      const { height } = inner.getBoundingClientRect();
      if (height <= 0) {
        return;
      }
      measured.set(itemKey, height);
      cell.style.gridRowEnd = `span ${rowsFor(height, gap)}`;
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(apply);
    };

    schedule();
    const observer = new ResizeObserver(schedule);
    observer.observe(inner);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [gap, itemKey, ready, rows, span]);

  const context = useMemo(
    () => ({ report: (value: number) => onSpan(itemKey, value) }),
    [itemKey, onSpan]
  );

  const cached = measured.get(itemKey);

  return (
    <li
      ref={cellRef}
      style={{
        gridColumnEnd: `span ${span}`,
        gridRowEnd: rowEnd(rows, ready, cached, gap),
      }}
    >
      <MasonryItemContext.Provider value={context}>
        <div ref={innerRef}>{children}</div>
      </MasonryItemContext.Provider>
    </li>
  );
};
