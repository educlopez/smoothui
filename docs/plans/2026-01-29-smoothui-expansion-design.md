# SmoothUI Expansion Design

**Date:** 2026-01-29
**Status:** Approved
**Scope:** 7 new components + 6 new blocks

## Overview

Expand SmoothUI with high-impact components and blocks that:
- Work for both SaaS landing pages and dashboard UIs
- Feature "wow effect" animations across all four types: micro-interactions, data storytelling, spatial/depth, and fluid morphing
- Follow existing accessibility and animation standards

---

## Components (7)

### 1. Animated Tabs (`animated-tabs`)

**Purpose:** Tab navigation with a smooth sliding indicator that follows the active tab.

**Variants:**
- **Underline** - Sliding underline indicator (default)
- **Pill** - Background pill that morphs between tabs
- **Segment** - iOS-style segmented control

**Props:**
```typescript
type AnimatedTabsProps = {
  tabs: { id: string; label: string; icon?: ReactNode }[];
  activeTab?: string;
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: "underline" | "pill" | "segment";
  layoutId?: string; // for nested usage
};
```

**Animation Details:**
- Indicator uses `layout` prop from Motion for smooth position/size transitions
- Spring animation: `duration: 0.25`, `bounce: 0.05`
- Reduced motion: instant switch, no sliding
- Tab content can use `AnimatePresence` for enter/exit (optional, user controls)

**Accessibility:**
- `role="tablist"` on container
- `role="tab"` with `aria-selected` on each tab
- Keyboard navigation (arrow keys)
- Focus ring styling

**Use Cases:**
- Pricing toggle (Monthly/Annual)
- Dashboard data views (Overview/Analytics/Settings)
- Feature comparison sections

---

### 2. Skeleton Loader (`skeleton-loader`)

**Purpose:** Animated placeholder that indicates content is loading, with smooth shimmer or pulse effects.

**Variants:**
- **Shimmer** - Gradient sweep effect (default)
- **Pulse** - Subtle opacity fade in/out
- **Wave** - Ripple effect from left to right

**Props:**
```typescript
type SkeletonLoaderProps = {
  variant?: "shimmer" | "pulse" | "wave";
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
};

// Preset shapes for common patterns
type SkeletonTextProps = { lines?: number; lastLineWidth?: string };
type SkeletonAvatarProps = { size?: "sm" | "md" | "lg" };
type SkeletonCardProps = { showAvatar?: boolean; showImage?: boolean };
```

**Animation Details:**
- Shimmer: CSS gradient animation (no JS, better performance)
- Pulse: Motion `animate` with opacity `[0.4, 1, 0.4]` loop
- Wave: Pseudo-element with translateX animation
- Reduced motion: static gray background, no animation

**Composable Presets:**
- `SkeletonText` - Multiple lines with varying widths
- `SkeletonAvatar` - Circular placeholder
- `SkeletonCard` - Card layout with optional image/avatar areas

**Why CSS for Shimmer:** Shimmer runs constantly during loading - CSS animations are more performant than JS-driven Motion loops for this use case.

---

### 3. Notification Badge (`notification-badge`)

**Purpose:** Animated badge/dot for showing counts, status, or alerts with satisfying number transitions.

**Variants:**
- **Dot** - Simple indicator dot (pings on change)
- **Count** - Number badge with animated transitions
- **Status** - Colored dot with optional pulse (online/offline/busy)

**Props:**
```typescript
type NotificationBadgeProps = {
  variant?: "dot" | "count" | "status";
  count?: number;
  max?: number; // shows "99+" if exceeded
  status?: "online" | "offline" | "busy" | "away";
  showZero?: boolean;
  ping?: boolean; // enables ping animation on dot
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  children?: ReactNode; // element to attach badge to
  className?: string;
};
```

**Animation Details:**
- **Count changes:** Scale pop (`1 → 1.2 → 1`) + number morphs using existing `number-flow` pattern
- **New notification:** Subtle ping ripple effect (CSS animation)
- **Appear/disappear:** Scale from 0 with spring
- Reduced motion: instant appear, no ping/pop effects

**Positioning:**
- Uses absolute positioning relative to `children` wrapper
- Negative offset to overlap the edge naturally
- `position` prop controls which corner

**Compound Usage:**
```tsx
<NotificationBadge count={5} position="top-right">
  <BellIcon />
</NotificationBadge>
```

---

### 4. Magnetic Button (`magnetic-button`)

**Purpose:** Button that subtly follows the cursor when hovering nearby, creating a magnetic/gravitational pull effect.

**Props:**
```typescript
type MagneticButtonProps = {
  children: ReactNode;
  strength?: number; // 0-1, default 0.3
  radius?: number; // activation radius in px, default 150
  springConfig?: { duration?: number; bounce?: number };
  disabled?: boolean;
  asChild?: boolean; // render as child element (Radix pattern)
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;
```

**Animation Details:**
- Track cursor position relative to button center
- Apply `transform: translate(x, y)` based on cursor distance
- Movement is proportional to `strength` and capped by `radius`
- Spring return to origin: `duration: 0.4`, `bounce: 0.1`
- Inner content can have subtle counter-movement for depth (optional)

**Implementation Approach:**
- Use `onMouseMove` on a wrapper div (larger hit area)
- Calculate offset: `(cursorPos - buttonCenter) * strength`
- Apply via Motion's `animate` for smooth spring physics
- `onMouseLeave` springs back to `{ x: 0, y: 0 }`

**Critical Guards:**
- Hover device detection required (no effect on touch)
- Reduced motion: completely disabled, normal button behavior
- `disabled` prop also disables magnetic effect

**Performance:**
- Uses `transform` only (GPU accelerated)
- Throttle mousemove to ~60fps if needed

---

### 5. Animated Toggle (`animated-toggle`)

**Purpose:** On/off switch with satisfying morph animation on the thumb/track.

**Variants:**
- **Default** - Smooth sliding thumb with color transition
- **Morph** - Thumb morphs shape (circle → squircle → circle)
- **Icon** - Thumb contains icon that transitions (sun/moon, check/x)

**Props:**
```typescript
type AnimatedToggleProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  variant?: "default" | "morph" | "icon";
  icons?: { on: ReactNode; off: ReactNode }; // for icon variant
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  label?: string;
  className?: string;
};
```

**Animation Details:**
- **Track:** Background color spring transition (`duration: 0.2`)
- **Thumb movement:** `translateX` with spring (`duration: 0.25`, `bounce: 0.1`)
- **Morph variant:** `borderRadius` animates during travel (more rounded at edges, squircle mid-transit)
- **Icon variant:** Crossfade icons with scale (`0.8 → 1`)
- Reduced motion: instant state change, no sliding

**Sizes:**
- `sm`: 36×20px, thumb 16px
- `md`: 44×24px, thumb 20px (default)
- `lg`: 52×28px, thumb 24px

**Accessibility:**
- `role="switch"` with `aria-checked`
- Keyboard toggle on Space/Enter
- Focus ring on track
- Optional visible label with `aria-labelledby`

---

### 6. Comparison Slider (`comparison-slider`)

**Purpose:** Before/after image comparison with a draggable divider, great for showcasing transformations.

**Props:**
```typescript
type ComparisonSliderProps = {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  initialPosition?: number; // 0-100, default 50
  orientation?: "horizontal" | "vertical";
  showLabels?: boolean;
  dividerColor?: string;
  className?: string;
};
```

**Animation Details:**
- **Drag handle:** Spring snap to cursor position during drag
- **Initial reveal:** On mount, handle slides from 0% → `initialPosition` (spring, `duration: 0.5`)
- **Hover state:** Handle grows slightly, grip lines appear
- **Labels:** Fade in/out based on which side is more visible
- Reduced motion: no initial reveal animation, starts at position

**Interaction:**
- Drag divider left/right (or up/down for vertical)
- Click anywhere to jump handle to that position (spring)
- Keyboard: arrow keys move handle 5% per press
- Touch: full touch drag support

**Implementation:**
- CSS `clip-path` on "after" image based on handle position
- Handle position stored as percentage (0-100)
- `onPointerDown/Move/Up` for unified mouse+touch handling

**Accessibility:**
- `role="slider"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- `aria-label="Image comparison slider"`
- Keyboard navigation support

---

### 7. Animated Checkbox (`animated-checkbox`)

**Purpose:** Checkbox with satisfying check animation - the checkmark draws itself in with a smooth stroke.

**Variants:**
- **Draw** - Checkmark draws/strokes in (default)
- **Pop** - Checkmark pops in with scale bounce
- **Morph** - Box morphs into filled state, then checkmark appears

**Props:**
```typescript
type AnimatedCheckboxProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  variant?: "draw" | "pop" | "morph";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  indeterminate?: boolean;
  label?: ReactNode;
  className?: string;
};
```

**Animation Details:**
- **Draw variant:** SVG `pathLength` animates from 0 → 1 (`duration: 0.2`)
- **Pop variant:** Checkmark scales `0 → 1.2 → 1` with spring (`bounce: 0.15`)
- **Morph variant:** Background fills with scale, then checkmark fades in
- **Uncheck:** Reverse animations (draw out, scale down)
- Reduced motion: instant appear/disappear

**Sizes:**
- `sm`: 16×16px
- `md`: 20×20px (default)
- `lg`: 24×24px

**Indeterminate State:**
- Shows horizontal dash instead of checkmark
- Same animation treatment per variant

**Accessibility:**
- Native `<input type="checkbox">` visually hidden
- Custom visual synced via `checked` state
- Label clickable, properly associated
- Focus ring on box

---

## Blocks (6)

### FAQ-3: Searchable FAQ (`faq-3`)

**Purpose:** FAQ section with real-time search filtering and animated results.

**Layout:**
- Search input at top (full width)
- Results filter as user types with staggered fade animation
- "No results" state with suggestion to contact support
- Optional: highlight matching text in questions

**Animation Details:**
- Matching items: staggered fade-in (`delay: index * 0.05`)
- Non-matching: fade out and collapse height smoothly
- Search icon → spinner while filtering (for perceived responsiveness)
- Reduced motion: instant show/hide, no stagger

---

### FAQ-4: Categorized FAQ (`faq-4`)

**Purpose:** FAQ organized by categories with tab navigation.

**Layout:**
- Category tabs at top (uses `animated-tabs` component internally)
- FAQ items below, filtered by selected category
- Badge showing count per category
- Mobile: tabs become horizontal scroll or dropdown

**Animation Details:**
- Tab switch: `AnimatePresence` with slide direction based on tab index
- Items stagger in when category changes
- Accordion expand/collapse for answers (reuse existing accordion pattern)
- Reduced motion: instant switch, no slide/stagger

**Categories Example:**
- General, Billing, Technical, Account

---

### Footer-3: Mega Footer (`footer-3`)

**Purpose:** Comprehensive footer with multiple link columns, newsletter signup, and social links.

**Layout:**
- Top section: Logo + tagline | 4-5 link columns (Products, Resources, Company, Legal, etc.)
- Middle section: Newsletter signup form with animated submit button
- Bottom section: Copyright | Social icons | Language/region selector
- Full-width, generous padding

**Animation Details:**
- Link hover: subtle underline draw-in effect
- Social icons: scale + color transition on hover
- Newsletter submit: loading state with spinner, success checkmark
- Staggered reveal on scroll-into-view (optional, off by default)
- Reduced motion: standard hover states, no stagger

---

### Footer-4: Minimal Footer (`footer-4`)

**Purpose:** Clean, compact footer for apps and minimal landing pages.

**Layout:**
- Single row on desktop: Logo | Inline links | Social icons
- Two rows on mobile: Logo + links stacked | Social icons
- Subtle top border or background differentiation

**Animation Details:**
- Links: opacity + translateX micro-shift on hover
- Social icons: gentle lift (`translateY: -2px`) on hover
- Entire footer fades in on scroll-into-view
- Reduced motion: opacity-only transitions

**Use Case:** SaaS dashboards, app footers, minimal marketing pages where full mega-footer is overkill.

---

### Logo-Cloud-3: Infinite Marquee (`logo-cloud-3`)

**Purpose:** Continuously scrolling logo strip, creates sense of momentum and many partners.

**Layout:**
- Single or double row of logos scrolling horizontally
- Seamless loop (logos duplicated for infinite effect)
- Optional: rows scroll opposite directions for visual interest
- Fade masks on edges for smooth appearance

**Animation Details:**
- CSS `animation` with `translateX` for performance (not Motion)
- Speed: ~30-40px/second (configurable via CSS variable)
- Pause on hover (entire strip)
- Individual logo: subtle scale on hover while paused
- Reduced motion: static grid layout, no scroll

**Implementation:**
- Duplicate logo array for seamless loop
- CSS `@keyframes` for infinite scroll
- `animation-play-state: paused` on hover

---

### Logo-Cloud-4: Interactive Grid (`logo-cloud-4`)

**Purpose:** Logo grid with hover effects revealing company names or additional info.

**Layout:**
- Responsive grid: 4-6 columns on desktop, 2-3 on mobile
- Logos are grayscale by default, colorize on hover
- Tooltip or overlay shows company name on hover
- Optional: "And 50+ more" badge at end

**Animation Details:**
- Grayscale → color: CSS `filter` transition (`duration: 0.2`)
- Hover scale: subtle `1 → 1.05` lift
- Tooltip: fade + slide up from below logo
- Grid items stagger-in on scroll-into-view
- Reduced motion: instant color, no scale/stagger

**Depth Effect:**
- Slight `translateY` on hover creates lift
- Subtle shadow increase reinforces depth

---

## Shared Requirements

### All Components & Blocks

1. **Animation Standards:**
   - Import `useReducedMotion` from `motion/react`
   - Spring animations: `duration: 0.2-0.25`, `bounce ≤ 0.1`
   - Use `cubic-bezier` values, never string easing
   - Only animate `transform` and `opacity`

2. **Accessibility:**
   - Proper ARIA attributes
   - Keyboard navigation
   - Focus indicators
   - `prefers-reduced-motion` support

3. **Responsiveness:**
   - Mobile-first approach
   - Touch device support
   - Hover device detection for cursor effects

4. **Code Quality:**
   - `"use client"` directive
   - TypeScript with explicit prop types
   - Export types as `[ComponentName]Props`
   - Use `cn()` from `@repo/shadcn-ui/lib/utils`

---

## Implementation Order (Suggested)

**Phase 1 - Foundation Components:**
1. `animated-tabs` (used by FAQ-4 block)
2. `skeleton-loader` (universal utility)
3. `notification-badge` (common UI element)

**Phase 2 - Interactive Components:**
4. `animated-toggle`
5. `animated-checkbox`
6. `magnetic-button`
7. `comparison-slider`

**Phase 3 - Blocks:**
8. `faq-3` (searchable)
9. `faq-4` (categorized, uses animated-tabs)
10. `footer-3` (mega)
11. `footer-4` (minimal)
12. `logo-cloud-3` (marquee)
13. `logo-cloud-4` (interactive grid)

---

## File Structure

### Components
```
packages/smoothui/components/
├── animated-tabs/
│   ├── index.tsx
│   ├── package.json
│   └── tsconfig.json
├── skeleton-loader/
├── notification-badge/
├── magnetic-button/
├── animated-toggle/
├── comparison-slider/
└── animated-checkbox/
```

### Blocks
```
packages/smoothui/blocks/
├── faq-3/
├── faq-4/
├── footer-3/
├── footer-4/
├── logo-cloud-3/
└── logo-cloud-4/
```

### Documentation
```
apps/docs/content/docs/components/
├── animated-tabs.mdx
├── skeleton-loader.mdx
├── notification-badge.mdx
├── magnetic-button.mdx
├── animated-toggle.mdx
├── comparison-slider.mdx
└── animated-checkbox.mdx

apps/docs/content/docs/blocks/
├── faq-3.mdx
├── faq-4.mdx
├── footer-3.mdx
├── footer-4.mdx
├── logo-cloud-3.mdx
└── logo-cloud-4.mdx
```

### Examples
```
apps/docs/examples/
├── animated-tabs.tsx
├── skeleton-loader.tsx
├── notification-badge.tsx
├── magnetic-button.tsx
├── animated-toggle.tsx
├── comparison-slider.tsx
├── animated-checkbox.tsx
├── faq-3.tsx
├── faq-4.tsx
├── footer-3.tsx
├── footer-4.tsx
├── logo-cloud-3.tsx
└── logo-cloud-4.tsx
```
