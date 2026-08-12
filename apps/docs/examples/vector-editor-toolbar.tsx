"use client";

import SmoothButton from "@repo/smoothui/components/smooth-button";
import type { VectorTool } from "@repo/smoothui/components/vector-editor-toolbar";
import VectorEditorToolbar from "@repo/smoothui/components/vector-editor-toolbar";
import {
  Circle,
  MousePointer2,
  Move,
  PenTool,
  Spline,
  Square,
} from "lucide-react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

const tools: VectorTool[] = [
  { icon: MousePointer2, id: "select", label: "Select", shortcut: "v" },
  { icon: Move, id: "move", label: "Move", shortcut: "m" },
  {
    icon: PenTool,
    id: "pen",
    items: [
      { icon: PenTool, id: "pen-line", label: "Straight pen", shortcut: "p" },
      { icon: Spline, id: "pen-curve", label: "Curvature pen", shortcut: "c" },
    ],
    label: "Pen",
    shortcut: "p",
  },
  {
    icon: Square,
    id: "shape",
    items: [
      {
        icon: Square,
        id: "shape-rectangle",
        label: "Rectangle",
        shortcut: "r",
      },
      { icon: Circle, id: "shape-ellipse", label: "Ellipse", shortcut: "o" },
    ],
    label: "Shape",
    shortcut: "r",
  },
];

type Point = { x: number; y: number };
type ShapeKind = "ellipse" | "path" | "rect";

type Shape = {
  closed: boolean;
  /** Translation applied on top of the local geometry, so moving is one update. */
  dx: number;
  dy: number;
  fill: string;
  height: number;
  id: string;
  kind: ShapeKind;
  points: Point[];
  radius: number;
  smooth: boolean;
  strokeWidth: number;
  width: number;
  x: number;
  y: number;
};

type ShapeStyle = Pick<Shape, "fill" | "radius" | "strokeWidth">;

type Draft =
  | { kind: "create"; origin: Point; shape: Shape }
  | { kind: "move"; id: string; origin: Point; start: Point }
  | { kind: "none" };

const FILL_OPTIONS = [
  { label: "Brand", value: "var(--color-brand)" },
  { label: "Blue", value: "var(--color-blue)" },
  { label: "Green", value: "var(--color-green)" },
  { label: "Amber", value: "var(--color-amber)" },
  { label: "No fill", value: "none" },
];

const DEFAULT_STYLE: ShapeStyle = {
  fill: "var(--color-brand)",
  radius: 10,
  strokeWidth: 2,
};

const MIN_DRAW_SIZE = 5;
const CLOSE_RADIUS = 10;
const HIT_PADDING = 6;
const HANDLE_SIZE = 7;
const FILL_OPACITY = 0.22;
const MAX_STROKE_WIDTH = 12;
const MAX_CORNER_RADIUS = 60;

const SEED_SHAPES: Shape[] = [
  {
    closed: false,
    dx: 0,
    dy: 0,
    fill: "var(--color-blue)",
    height: 96,
    id: "seed-rect",
    kind: "rect",
    points: [],
    radius: 14,
    smooth: false,
    strokeWidth: 2,
    width: 148,
    x: 96,
    y: 150,
  },
  {
    closed: false,
    dx: 0,
    dy: 0,
    fill: "var(--color-amber)",
    height: 104,
    id: "seed-ellipse",
    kind: "ellipse",
    points: [],
    radius: 0,
    smooth: false,
    strokeWidth: 2,
    width: 104,
    x: 286,
    y: 196,
  },
];

const getBounds = (shape: Shape) => {
  if (shape.kind !== "path") {
    return {
      height: shape.height,
      width: shape.width,
      x: shape.x,
      y: shape.y,
    };
  }
  const xs = shape.points.map((point) => point.x);
  const ys = shape.points.map((point) => point.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  return {
    height: Math.max(...ys) - minY,
    width: Math.max(...xs) - minX,
    x: minX,
    y: minY,
  };
};

const buildPathD = (points: Point[], closed: boolean, smooth: boolean) => {
  const [first, ...rest] = points;
  if (!first) {
    return "";
  }
  let d = `M ${first.x} ${first.y}`;
  if (!smooth || points.length < 3) {
    for (const point of rest) {
      d += ` L ${point.x} ${point.y}`;
    }
  } else {
    for (let index = 1; index < points.length - 1; index++) {
      const current = points[index];
      const next = points[index + 1];
      d += ` Q ${current.x} ${current.y} ${(current.x + next.x) / 2} ${
        (current.y + next.y) / 2
      }`;
    }
    const last = points.at(-1);
    if (last) {
      d += ` L ${last.x} ${last.y}`;
    }
  }
  return closed ? `${d} Z` : d;
};

const isInsideShape = (shape: Shape, point: Point) => {
  const bounds = getBounds(shape);
  const localX = point.x - shape.dx;
  const localY = point.y - shape.dy;
  return (
    localX >= bounds.x - HIT_PADDING &&
    localX <= bounds.x + bounds.width + HIT_PADDING &&
    localY >= bounds.y - HIT_PADDING &&
    localY <= bounds.y + bounds.height + HIT_PADDING
  );
};

const hitTest = (shapes: Shape[], point: Point): Shape | undefined => {
  for (let index = shapes.length - 1; index >= 0; index--) {
    const shape = shapes[index];
    if (isInsideShape(shape, point)) {
      return shape;
    }
  }
};

const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

const rectFromPoints = (origin: Point, current: Point) => ({
  height: Math.abs(current.y - origin.y),
  width: Math.abs(current.x - origin.x),
  x: Math.min(origin.x, current.x),
  y: Math.min(origin.y, current.y),
});

const PEN_HINT = "Click to place points, then click the first point to close.";
const RECT_HINT = "Drag on the canvas to draw a rectangle.";

// The parent ids are reachable too, both by shortcut and by clicking the cell.
const HINTS: Record<string, string> = {
  move: "Drag any shape to move it.",
  pen: PEN_HINT,
  "pen-curve": "Click to place points; they connect with a smooth curve.",
  "pen-line": PEN_HINT,
  select: "Click a shape to select it. Backspace deletes it.",
  shape: RECT_HINT,
  "shape-ellipse": "Drag on the canvas to draw an ellipse.",
  "shape-rectangle": RECT_HINT,
};

/** Controlled number inputs go NaN the moment the field is cleared. */
const clampNumber = (
  raw: string,
  fallback: number,
  min: number,
  max: number
) => {
  const parsed = Number.parseFloat(raw);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, parsed));
};

const strokeFor = (shape: Shape) =>
  shape.fill === "none" ? "var(--color-foreground)" : shape.fill;

export default function VectorEditorToolbarDemo() {
  const [activeTool, setActiveTool] = useState("select");
  const [shapes, setShapes] = useState<Shape[]>(SEED_SHAPES);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [style, setStyle] = useState<ShapeStyle>(DEFAULT_STYLE);
  const [draft, setDraft] = useState<Draft>({ kind: "none" });
  const [penPoints, setPenPoints] = useState<Point[]>([]);
  const [pointer, setPointer] = useState<Point | null>(null);

  const nextIdRef = useRef(1);
  const isPenTool = activeTool.startsWith("pen");
  const isShapeTool = activeTool.startsWith("shape");
  const selected = shapes.find((shape) => shape.id === selectedId);
  const activeStyle: ShapeStyle = selected
    ? {
        fill: selected.fill,
        radius: selected.radius,
        strokeWidth: selected.strokeWidth,
      }
    : style;

  const commitPenPath = useCallback(
    (closed: boolean) => {
      if (penPoints.length < 2) {
        setPenPoints([]);
        return;
      }
      const id = `shape-${nextIdRef.current++}`;
      setShapes((previous) => [
        ...previous,
        {
          closed,
          dx: 0,
          dy: 0,
          fill: style.fill,
          height: 0,
          id,
          kind: "path",
          points: penPoints,
          radius: 0,
          smooth: activeTool === "pen-curve",
          strokeWidth: style.strokeWidth,
          width: 0,
          x: 0,
          y: 0,
        },
      ]);
      setSelectedId(id);
      setPenPoints([]);
    },
    [activeTool, penPoints, style.fill, style.strokeWidth]
  );

  // Canvas-level keys. Editable targets are skipped so typing a stroke width
  // never deletes the shape being edited.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { target } = event;
      if (target instanceof HTMLElement && target.tagName === "INPUT") {
        return;
      }
      if (event.key === "Escape") {
        setPenPoints([]);
        setSelectedId(null);
        return;
      }
      if (event.key === "Enter" && penPoints.length > 1) {
        event.preventDefault();
        commitPenPath(false);
        return;
      }
      if (
        (event.key === "Backspace" || event.key === "Delete") &&
        selectedId !== null
      ) {
        event.preventDefault();
        setShapes((previous) =>
          previous.filter((shape) => shape.id !== selectedId)
        );
        setSelectedId(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [commitPenPath, penPoints.length, selectedId]);

  const toLocal = (event: ReactPointerEvent<SVGSVGElement>): Point => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const handlePenDown = (point: Point) => {
    const [first] = penPoints;
    if (
      first &&
      penPoints.length > 1 &&
      distance(point, first) < CLOSE_RADIUS
    ) {
      commitPenPath(true);
      return;
    }
    setPenPoints((previous) => [...previous, point]);
  };

  const handlePointerDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    const point = toLocal(event);

    if (isPenTool) {
      handlePenDown(point);
      return;
    }

    if (isShapeTool) {
      event.currentTarget.setPointerCapture(event.pointerId);
      const id = `shape-${nextIdRef.current++}`;
      setDraft({
        kind: "create",
        origin: point,
        shape: {
          closed: false,
          dx: 0,
          dy: 0,
          fill: style.fill,
          height: 0,
          id,
          kind: activeTool === "shape-ellipse" ? "ellipse" : "rect",
          points: [],
          radius: style.radius,
          smooth: false,
          strokeWidth: style.strokeWidth,
          width: 0,
          x: point.x,
          y: point.y,
        },
      });
      return;
    }

    const hit = hitTest(shapes, point);
    setSelectedId(hit?.id ?? null);
    if (hit && activeTool === "move") {
      event.currentTarget.setPointerCapture(event.pointerId);
      setDraft({
        id: hit.id,
        kind: "move",
        origin: point,
        start: { x: hit.dx, y: hit.dy },
      });
    }
  };

  const handlePointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    const point = toLocal(event);
    // Only the pen preview needs to follow an idle cursor, so nothing else pays
    // for a re-render on every mouse move.
    if (isPenTool) {
      setPointer(point);
    }

    if (draft.kind === "create") {
      const next = rectFromPoints(draft.origin, point);
      setDraft({ ...draft, shape: { ...draft.shape, ...next } });
      return;
    }
    if (draft.kind === "move") {
      setShapes((previous) =>
        previous.map((shape) =>
          shape.id === draft.id
            ? {
                ...shape,
                dx: draft.start.x + (point.x - draft.origin.x),
                dy: draft.start.y + (point.y - draft.origin.y),
              }
            : shape
        )
      );
    }
  };

  const handlePointerUp = () => {
    if (draft.kind === "create") {
      const { shape } = draft;
      if (shape.width >= MIN_DRAW_SIZE && shape.height >= MIN_DRAW_SIZE) {
        setShapes((previous) => [...previous, shape]);
        setSelectedId(shape.id);
      }
    }
    setDraft({ kind: "none" });
  };

  const updateStyle = (patch: Partial<ShapeStyle>) => {
    setStyle((previous) => ({ ...previous, ...patch }));
    if (selectedId) {
      setShapes((previous) =>
        previous.map((shape) =>
          shape.id === selectedId ? { ...shape, ...patch } : shape
        )
      );
    }
  };

  const renderShape = (shape: Shape) => {
    const common = {
      fill: shape.fill,
      fillOpacity: shape.fill === "none" ? 0 : FILL_OPACITY,
      stroke: strokeFor(shape),
      strokeWidth: shape.strokeWidth,
    };
    if (shape.kind === "rect") {
      return (
        <rect
          {...common}
          height={shape.height}
          rx={Math.min(shape.radius, Math.min(shape.width, shape.height) / 2)}
          width={shape.width}
          x={shape.x}
          y={shape.y}
        />
      );
    }
    if (shape.kind === "ellipse") {
      return (
        <ellipse
          {...common}
          cx={shape.x + shape.width / 2}
          cy={shape.y + shape.height / 2}
          rx={shape.width / 2}
          ry={shape.height / 2}
        />
      );
    }
    return (
      <path
        {...common}
        d={buildPathD(shape.points, shape.closed, shape.smooth)}
        fillOpacity={shape.closed && shape.fill !== "none" ? FILL_OPACITY : 0}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  };

  const renderSelection = (shape: Shape) => {
    const bounds = getBounds(shape);
    const corners: Point[] = [
      { x: bounds.x, y: bounds.y },
      { x: bounds.x + bounds.width, y: bounds.y },
      { x: bounds.x, y: bounds.y + bounds.height },
      { x: bounds.x + bounds.width, y: bounds.y + bounds.height },
    ];
    const anchors = shape.kind === "path" ? shape.points : corners;
    return (
      <>
        <rect
          fill="none"
          height={bounds.height}
          stroke="var(--color-brand)"
          strokeDasharray="4 3"
          strokeWidth={1}
          width={bounds.width}
          x={bounds.x}
          y={bounds.y}
        />
        {anchors.map((anchor) => (
          <rect
            fill="var(--color-background)"
            height={HANDLE_SIZE}
            key={`${anchor.x}-${anchor.y}`}
            stroke="var(--color-brand)"
            strokeWidth={1.5}
            width={HANDLE_SIZE}
            x={anchor.x - HANDLE_SIZE / 2}
            y={anchor.y - HANDLE_SIZE / 2}
          />
        ))}
      </>
    );
  };

  const drawsRectangles = isShapeTool && activeTool !== "shape-ellipse";
  const showRadius = selected?.kind === "rect" || drawsRectangles;
  const showProperties = isPenTool || isShapeTool || Boolean(selected);

  const properties = showProperties ? (
    <div className="flex flex-wrap items-center gap-3 text-xs">
      <label className="flex items-center gap-2">
        <span className="text-foreground/60">Stroke</span>
        <input
          className="w-14 rounded-md border border-foreground/15 bg-background px-2 py-1 tabular-nums"
          max={MAX_STROKE_WIDTH}
          min={1}
          onChange={(event) =>
            updateStyle({
              strokeWidth: clampNumber(
                event.target.value,
                activeStyle.strokeWidth,
                1,
                MAX_STROKE_WIDTH
              ),
            })
          }
          type="number"
          value={activeStyle.strokeWidth}
        />
      </label>
      {showRadius ? (
        <label className="flex items-center gap-2">
          <span className="text-foreground/60">Radius</span>
          <input
            className="w-14 rounded-md border border-foreground/15 bg-background px-2 py-1 tabular-nums"
            max={MAX_CORNER_RADIUS}
            min={0}
            onChange={(event) =>
              updateStyle({
                radius: clampNumber(
                  event.target.value,
                  activeStyle.radius,
                  0,
                  MAX_CORNER_RADIUS
                ),
              })
            }
            type="number"
            value={activeStyle.radius}
          />
        </label>
      ) : null}
      <span className="h-5 w-px bg-foreground/10" />
      <div aria-label="Fill" className="flex items-center gap-1" role="group">
        {FILL_OPTIONS.map((option) => {
          const isActive = activeStyle.fill === option.value;
          return (
            <button
              aria-label={option.label}
              aria-pressed={isActive}
              className={`flex size-6 cursor-pointer items-center justify-center rounded-md ring-offset-1 ring-offset-background transition-[box-shadow] ease-out ${
                isActive ? "ring-2 ring-brand" : "ring-1 ring-foreground/15"
              }`}
              key={option.value}
              onClick={() => updateStyle({ fill: option.value })}
              type="button"
            >
              {option.value === "none" ? (
                <span className="h-3.5 w-px rotate-45 bg-foreground/40" />
              ) : (
                <span
                  className="size-3.5 rounded-sm"
                  style={{ backgroundColor: option.value }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  ) : undefined;

  const penPreview =
    penPoints.length > 0 && pointer ? [...penPoints, pointer] : penPoints;
  const canClosePen =
    penPoints.length > 1 &&
    pointer !== null &&
    distance(pointer, penPoints[0]) < CLOSE_RADIUS;

  const handleClear = () => {
    setShapes([]);
    setSelectedId(null);
    setPenPoints([]);
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 px-4 py-8">
      <div className="relative h-[440px] w-full overflow-hidden rounded-2xl border border-foreground/10 bg-muted/20">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(var(--color-foreground) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        <svg
          aria-label="Vector canvas"
          className="absolute inset-0 h-full w-full"
          onPointerDown={handlePointerDown}
          onPointerLeave={() => setPointer(null)}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          role="application"
          style={{ cursor: isPenTool || isShapeTool ? "crosshair" : "default" }}
        >
          <title>Vector canvas</title>
          {shapes.map((shape) => (
            <g key={shape.id} transform={`translate(${shape.dx} ${shape.dy})`}>
              {renderShape(shape)}
              {shape.id === selectedId ? renderSelection(shape) : null}
            </g>
          ))}

          {draft.kind === "create" ? (
            <g opacity={0.8}>{renderShape(draft.shape)}</g>
          ) : null}

          {penPoints.length > 0 ? (
            <g>
              <path
                d={buildPathD(penPreview, false, activeTool === "pen-curve")}
                fill="none"
                stroke={
                  style.fill === "none" ? "var(--color-foreground)" : style.fill
                }
                strokeDasharray="5 4"
                strokeLinecap="round"
                strokeWidth={style.strokeWidth}
              />
              {penPoints.map((point, index) => (
                <rect
                  fill={
                    index === 0 && canClosePen
                      ? "var(--color-brand)"
                      : "var(--color-background)"
                  }
                  height={HANDLE_SIZE}
                  key={`${point.x}-${point.y}`}
                  stroke="var(--color-brand)"
                  strokeWidth={1.5}
                  width={HANDLE_SIZE}
                  x={point.x - HANDLE_SIZE / 2}
                  y={point.y - HANDLE_SIZE / 2}
                />
              ))}
            </g>
          ) : null}
        </svg>

        {shapes.length === 0 && penPoints.length === 0 ? (
          <p className="pointer-events-none absolute inset-x-0 bottom-1/2 text-center text-foreground/35 text-sm">
            Pick a tool and draw something.
          </p>
        ) : null}

        <p className="pointer-events-none absolute bottom-3 left-4 text-foreground/45 text-xs">
          {HINTS[activeTool] ?? "Pick a tool to start."}
        </p>

        <VectorEditorToolbar
          activeTool={activeTool}
          floating
          onToolChange={setActiveTool}
          properties={properties}
          tools={tools}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-foreground/50 text-xs tabular-nums">
          {shapes.length} {shapes.length === 1 ? "shape" : "shapes"} on canvas
        </p>
        <SmoothButton
          color="neutral"
          disabled={shapes.length === 0}
          onClick={handleClear}
          size="sm"
          variant="outline"
        >
          Clear canvas
        </SmoothButton>
      </div>
    </div>
  );
}
