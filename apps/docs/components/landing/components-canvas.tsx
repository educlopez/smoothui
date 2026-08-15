"use client";

import { CanvasFocusOverlay } from "@docs/components/landing/canvas-focus-overlay";
import Divider from "@docs/components/landing/divider";
import { SectionHeader } from "@docs/components/landing/section-header";
import { Button } from "@docs/components/smoothbutton";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  type ComponentType,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/**
 * Canvas demos are authored for this section specifically — one idea, sized to
 * the tile, no controls and no chrome — because the docs examples are built to
 * fill a documentation frame and arrive here either cluttered or cropped.
 *
 * Loaded per tile and client-only: each is a live component, and the section
 * is the argument that they are live rather than screenshots.
 */
const demoCache = new Map<string, ComponentType>();

const getCanvasDemo = (slug: string): ComponentType => {
  const cached = demoCache.get(slug);
  if (cached) {
    return cached;
  }
  const Demo = dynamic(
    () =>
      import(`@docs/examples/canvas/${slug}`).catch(() => ({
        default: () => null,
      })),
    { loading: () => null, ssr: false }
  );
  demoCache.set(slug, Demo);
  return Demo;
};

/**
 * The catalogue as a canvas you drag around, not a section you scroll past.
 *
 * Panning is pointer-driven with inertia, and the world wraps on both axes, so
 * there is no edge to hit. The page keeps its own scroll — the wheel is never
 * intercepted, because a section that eats the wheel traps the reader.
 *
 * Tiles are the real components, mounted and running. `GalleryPreview` defers
 * each demo until it actually intersects the viewport, so panning across the
 * world mounts demos as they arrive rather than all at once.
 */

type CanvasTile = {
  /** Base position in world space, px. */
  bx: number;
  by: number;
  /** Tile width in px. */
  w: number;
  slug: string;
  title: string;
};

/** World size. Positions wrap against this, so it is the repeat interval. */
const WORLD_W = 3400;
const WORLD_H = 2400;

/**
 * Hand-placed, and deliberately sparse — the reference reads as space because
 * of the gaps, not the tiles. An even scatter would look like a contact sheet.
 * The most spectacular components sit apart from each other so no two
 * showstoppers compete in the same glance.
 */
const TILES: CanvasTile[] = [
  { bx: 240, by: 180, slug: "liquid-metal", title: "Liquid Metal", w: 340 },
  { bx: 900, by: 120, slug: "dynamic-island", title: "Dynamic Island", w: 300 },
  { bx: 1560, by: 260, slug: "dither-chart", title: "Dither Chart", w: 280 },
  { bx: 2280, by: 140, slug: "motion-loader", title: "Motion Loader", w: 200 },
  { bx: 2900, by: 300, slug: "number-flow", title: "Number Flow", w: 240 },

  {
    bx: 560,
    by: 700,
    slug: "holographic-foil",
    title: "Holographic Foil",
    w: 300,
  },
  { bx: 1300, by: 640, slug: "dock", title: "Dock", w: 380 },
  {
    bx: 2020,
    by: 780,
    slug: "emoji-reaction",
    title: "Emoji Reaction",
    w: 260,
  },
  { bx: 2700, by: 660, slug: "siri-orb", title: "Siri Orb", w: 230 },

  { bx: 180, by: 1200, slug: "wallet-card", title: "Wallet Card", w: 320 },
  {
    bx: 860,
    by: 1320,
    slug: "aurora-curtain",
    title: "Aurora Curtain",
    w: 360,
  },
  { bx: 1620, by: 1160, slug: "phototab", title: "Phototab", w: 270 },
  { bx: 2340, by: 1300, slug: "glass-card", title: "Glass Card", w: 320 },
  { bx: 3000, by: 1140, slug: "tilt-card", title: "Tilt Card", w: 260 },

  { bx: 460, by: 1780, slug: "arcade-pixel", title: "Arcade Pixel", w: 330 },
  { bx: 1180, by: 1900, slug: "gravity-stars", title: "Gravity Stars", w: 340 },
  { bx: 1900, by: 1740, slug: "folder-reveal", title: "Folder Reveal", w: 260 },
  { bx: 2560, by: 1880, slug: "apple-invites", title: "Apple Invites", w: 300 },
  { bx: 3160, by: 1700, slug: "morph-surface", title: "Morph Surface", w: 250 },

  {
    bx: 700,
    by: 2180,
    slug: "scrollable-card-stack",
    title: "Card Stack",
    w: 260,
  },
  {
    bx: 1480,
    by: 2240,
    slug: "power-off-slide",
    title: "Power Off Slide",
    w: 240,
  },
  { bx: 2200, by: 2120, slug: "ai-orb-face", title: "AI Orb Face", w: 240 },
  {
    bx: 2860,
    by: 2260,
    slug: "coverflow-carousel",
    title: "Coverflow",
    w: 300,
  },
];

/** Rotation applied to a tile sitting a full half-viewport off centre. */
const MAX_WARP_DEG = 30;
/** How far those edge tiles are pushed back, so the warp reads as depth. */
const MAX_WARP_DEPTH_PX = 260;
/** Velocity retained per frame once the pointer is released. */
const INERTIA_DECAY = 0.94;
/** Below this px/frame the drift is stopped rather than crawling forever. */
const MIN_VELOCITY = 0.02;
/** Idle drift so the canvas is never completely dead before first contact. */
const AMBIENT_DRIFT = 0.12;
/** Pointer travel, in px, past which a release is a pan and not a click. */
const DRAG_CLICK_THRESHOLD = 6;

const wrap = (value: number, size: number) => ((value % size) + size) % size;

export function ComponentsCanvas() {
  const shouldReduceMotion = useReducedMotion();
  // Resolved once: `dynamic()` returns a new component identity on every call,
  // and remounting a tile mid-drag would restart its animation.
  const demos = useMemo(() => {
    const map: Record<string, ComponentType> = {};
    for (const tile of TILES) {
      map[tile.slug] = getCanvasDemo(tile.slug);
    }
    return map;
  }, []);
  const viewportRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState<CanvasTile | null>(null);
  // Read inside the rAF loop rather than closed over, so opening a panel stops
  // the plane without tearing down and rebuilding the whole drag session.
  const pausedRef = useRef(false);
  pausedRef.current = focused !== null;

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }
    const viewport = viewportRef.current;
    const plane = planeRef.current;
    if (!(viewport && plane)) {
      return;
    }
    // Pointer panning is a mouse affordance. On touch the same gesture is the
    // page scroll, and stealing it would trap the reader mid-page.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    const tiles = Array.from(
      plane.querySelectorAll<HTMLElement>("[data-canvas-tile]")
    );

    let panX = 0;
    let panY = 0;
    let velX = -AMBIENT_DRIFT;
    let velY = -AMBIENT_DRIFT * 0.4;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let dragDistance = 0;
    let activePointer: number | null = null;
    let frame = 0;

    const paint = () => {
      const vw = viewport.clientWidth;
      const vh = viewport.clientHeight;
      const centreX = vw / 2;
      const margin = 460;

      for (const tile of tiles) {
        const bx = Number(tile.dataset.bx ?? 0);
        const by = Number(tile.dataset.by ?? 0);

        // Wrap into the world, then shift the far side into negative space so
        // a tile leaving on the right re-enters on the left without a jump.
        let sx = wrap(bx - panX, WORLD_W);
        let sy = wrap(by - panY, WORLD_H);
        if (sx > vw + margin) {
          sx -= WORLD_W;
        }
        if (sy > vh + margin) {
          sy -= WORLD_H;
        }

        const fromCentre = (sx - centreX) / centreX;
        const rotateY = -fromCentre * MAX_WARP_DEG;
        const z = -(Math.abs(fromCentre) ** 1.6) * MAX_WARP_DEPTH_PX;

        // The tile itself is only translated, so its box — and therefore the
        // hit area of the button inside it — lands exactly where the browser
        // says it does. The 3D warp goes on an inner wrapper holding just the
        // demo: a perspective-projected element paints away from its layout
        // box, and clicks were being tested against the box, not the paint.
        tile.style.transform = `translate3d(${sx}px, ${sy}px, 0)`;
        const warp = tile.querySelector<HTMLElement>("[data-canvas-warp]");
        if (warp) {
          warp.style.transform = `perspective(1600px) rotateY(${rotateY}deg) translateZ(${z}px)`;
        }
        // Anything far outside the frame stops costing layout and paint.
        const onScreen =
          sx > -margin && sx < vw + margin && sy > -margin && sy < vh + margin;
        tile.style.contentVisibility = onScreen ? "visible" : "hidden";
      }
    };

    const tick = () => {
      if (pausedRef.current) {
        frame = requestAnimationFrame(tick);
        return;
      }
      if (!dragging) {
        velX *= INERTIA_DECAY;
        velY *= INERTIA_DECAY;
        if (Math.abs(velX) < MIN_VELOCITY && Math.abs(velY) < MIN_VELOCITY) {
          velX = -AMBIENT_DRIFT;
          velY = -AMBIENT_DRIFT * 0.4;
        }
        panX += velX;
        panY += velY;
      }
      paint();
      frame = requestAnimationFrame(tick);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!event.isTrusted) {
        return;
      }
      activePointer = event.pointerId;
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      dragDistance = 0;
      velX = 0;
      velY = 0;
      // Deliberately NOT setPointerCapture: capturing on the viewport
      // redirects the subsequent `click` to the viewport, so it never reaches
      // the tile's own button and opening a component stopped working.
      // Listening on the window covers a drag that leaves the section instead.
      viewport.style.cursor = "grabbing";
    };

    const onPointerMove = (event: PointerEvent) => {
      // Canvas demos animate themselves by dispatching synthetic pointer
      // events — the dock sweeps a cursor across itself, the tilt card traces
      // an orbit. Those bubble up here, and while the pointer was down they
      // were being read as drag input, which sent the plane flying.
      if (!(dragging && event.isTrusted) || event.pointerId !== activePointer) {
        return;
      }
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      dragDistance += Math.abs(dx) + Math.abs(dy);
      panX -= dx;
      panY -= dy;
      velX = -dx;
      velY = -dy;
    };

    /**
     * Releasing after a drag still fires a click, so panning across the canvas
     * would navigate to whichever tile happened to be under the cursor. Only a
     * near-stationary press counts as a click on a tile.
     */
    const onClickCapture = (event: MouseEvent) => {
      if (dragDistance > DRAG_CLICK_THRESHOLD) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const endDrag = (event: PointerEvent) => {
      if (!dragging || event.pointerId !== activePointer) {
        return;
      }
      dragging = false;
      activePointer = null;
      viewport.style.cursor = "grab";
    };

    viewport.addEventListener("click", onClickCapture, true);
    viewport.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    viewport.style.cursor = "grab";
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      viewport.removeEventListener("click", onClickCapture, true);
      viewport.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, [shouldReduceMotion]);

  return (
    <section className="relative bg-background py-24 transition">
      <Divider />
      <SectionHeader
        description="Drag to move through it. Every tile is the real component, mounted and running — not a screenshot."
        title="The catalogue, adrift"
      />

      <div
        className={cn(
          "relative mt-16 w-full overflow-hidden bg-muted/15",
          shouldReduceMotion ? "h-auto py-10" : "h-[86vh] min-h-[620px]"
        )}
        ref={viewportRef}
      >
        {shouldReduceMotion ? (
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-8 sm:grid-cols-2 lg:grid-cols-3">
            {TILES.slice(0, 9).map((tile) => {
              const Demo = demos[tile.slug];
              return (
                <Link
                  className="flex items-center justify-center"
                  href={`/docs/components/${tile.slug}`}
                  key={tile.slug}
                >
                  <Demo />
                </Link>
              );
            })}
          </div>
        ) : (
          // No `preserve-3d` here. Each tile now carries its own perspective on
          // an inner wrapper, so the plane never becomes a 3D rendering
          // context — which is what made hit testing unreliable: tiles pushed
          // back with `translateZ` painted in one place and answered clicks in
          // another, so only the tiles near the centre (z ≈ 0) responded.
          <div className="absolute inset-0" ref={planeRef}>
            {TILES.map((tile) => {
              const Demo = demos[tile.slug];
              return (
                <div
                  className="absolute top-0 left-0 will-change-transform"
                  data-bx={tile.bx}
                  data-by={tile.by}
                  data-canvas-tile
                  key={tile.slug}
                  style={{ width: tile.w }}
                >
                  {/* No card, no border, no caption, and no hover box either:
                      the component floats on the section surface and nothing
                      else does. A hover rectangle can never frame these well —
                      each demo's layout box is larger than the shape it
                      actually paints, so the box reads as badly cropped. */}
                  <div className="relative select-none">
                    <div
                      className="pointer-events-none"
                      data-canvas-warp
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <Demo />
                    </div>
                    {/* Stretched over the demo rather than wrapping it: the
                        demo has its own controls, and nesting them inside a
                        single control would swallow them. A drag that crosses
                        a tile is suppressed before it reaches this. */}
                    {/* Deliberately larger than the tile's layout box. Several
                        demos paint outside it — canvas bloom, glows, shadows —
                        so a hit area clipped to the box misses parts of the
                        component the visitor can plainly see. The layout is
                        sparse enough that a halo cannot overlap a neighbour. */}
                    <button
                      aria-label={`Open ${tile.title}`}
                      className="absolute -inset-6 z-10 cursor-pointer"
                      onClick={() => setFocused(tile)}
                      type="button"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {shouldReduceMotion ? null : (
          <>
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-background to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-background to-transparent" />
          </>
        )}
      </div>

      <CanvasFocusOverlay
        onClose={() => setFocused(null)}
        slug={focused?.slug ?? null}
        title={focused?.title ?? null}
      />

      <div className="mx-auto mt-8 flex justify-center">
        <Button asChild size="lg" variant="candy">
          <Link href="/docs/components">View all components</Link>
        </Button>
      </div>
    </section>
  );
}
