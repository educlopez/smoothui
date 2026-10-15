/**
 * Full Base UI React catalog mapped to SmoothUI primitives.
 * Shipped items have docs under /docs/primitives; planned ones appear in the
 * gallery and sidebar as disabled “Soon” rows.
 *
 * Base UI is the literal headless base — keep primitives small so components,
 * blocks, and templates can compose them. Optional `astryx` refs are contributor
 * hints only (https://astryx.atmeta.com/components), not user-facing copy.
 *
 * Source: https://base-ui.com/react/components (Base UI 1.8)
 */

export type PrimitiveStatus = "available" | "planned";

export interface PrimitiveInventoryItem {
  /**
   * Astryx components / compounds to study for API + UX
   * (https://astryx.atmeta.com/components).
   */
  astryx?: string[];
  /** Base UI component name(s) this maps to */
  baseUi: string[];
  category: string;
  description: string;
  /** Optional SmoothUI-specific note */
  note?: string;
  /** Docs / install slug (kebab-case) */
  slug: string;
  status: PrimitiveStatus;
  title: string;
}

/**
 * Ordered inventory. Categories drive gallery filter pills.
 * Keep Base UI coverage complete; SmoothUI-only (smooth-button) sits in Actions.
 */
export const PRIMITIVES_INVENTORY: readonly PrimitiveInventoryItem[] = [
  // —— Actions ——
  {
    astryx: ["Button", "Icon Button", "Button Group"],
    baseUi: ["Button"],
    category: "Actions",
    description:
      "Motion-polished button with variants, colors, and press feedback.",
    note: "SmoothUI-owned; Base/Radix twins under the hood.",
    slug: "smooth-button",
    status: "available",
    title: "Smooth Button",
  },
  {
    astryx: ["Toggle Button"],
    baseUi: ["Toggle"],
    category: "Actions",
    description: "Two-state button for on/off actions.",
    slug: "toggle",
    status: "available",
    title: "Toggle",
  },
  {
    astryx: ["Toggle Button Group", "Segmented Control"],
    baseUi: ["Toggle Group"],
    category: "Actions",
    description: "Group of toggles for single or multi selection.",
    note: "Astryx Segmented Control is a strong visual reference for single-select.",
    slug: "toggle-group",
    status: "available",
    title: "Toggle Group",
  },
  {
    astryx: ["Toolbar"],
    baseUi: ["Toolbar"],
    category: "Actions",
    description: "Accessible toolbar for grouped controls.",
    slug: "toolbar",
    status: "available",
    title: "Toolbar",
  },

  // —— Forms ——
  {
    astryx: ["Checkbox", "Checkbox Indicator", "Checkbox Input"],
    baseUi: ["Checkbox"],
    category: "Forms",
    description:
      "Animated checkbox with spring checkmark and indeterminate state.",
    slug: "checkbox",
    status: "available",
    title: "Checkbox",
  },
  {
    astryx: ["Checkbox List", "Checkbox List Item"],
    baseUi: ["Checkbox Group"],
    category: "Forms",
    description: "Group of checkboxes with parent/child indeterminate support.",
    note: "Ship Checkbox List API shape from Astryx on top of Base Checkbox Group.",
    slug: "checkbox-group",
    status: "available",
    title: "Checkbox Group",
  },
  {
    astryx: ["Radio", "Radio Indicator", "Radio List", "Radio List Item"],
    baseUi: ["Radio Group"],
    category: "Forms",
    description: "Animated radio group with keyboard navigation.",
    note: "Consider Radio List compound naming from Astryx for multi-row layouts.",
    slug: "radio-group",
    status: "available",
    title: "Radio Group",
  },
  {
    astryx: [
      "Selector",
      "Selector Option",
      "Complex Selector",
      "Multi Selector",
    ],
    baseUi: ["Select"],
    category: "Forms",
    description: "Animated select with search-friendly option list.",
    slug: "select",
    status: "available",
    title: "Select",
  },
  {
    astryx: ["Typeahead", "Typeahead Item", "Command Palette Input"],
    baseUi: ["Combobox", "Autocomplete"],
    category: "Forms",
    description: "Searchable combobox with async option loading.",
    note: "Base Autocomplete + Combobox; Astryx Typeahead for filter UX.",
    slug: "combobox",
    status: "available",
    title: "Combobox",
  },
  {
    astryx: ["Text Input", "Text Area", "Input Group", "Input Group Text"],
    baseUi: ["Input"],
    category: "Forms",
    description: "Text input with Base UI field integration.",
    slug: "input",
    status: "available",
    title: "Input",
  },
  {
    astryx: ["Number Input"],
    baseUi: ["Number Field"],
    category: "Forms",
    description: "Numeric input with steppers and formatting.",
    slug: "number-field",
    status: "available",
    title: "Number Field",
  },
  {
    astryx: ["Tokenizer", "Token"],
    baseUi: ["OTP Field"],
    category: "Forms",
    description: "One-time-passcode digit inputs.",
    slug: "otp-field",
    status: "available",
    title: "OTP Field",
  },
  {
    astryx: ["Slider"],
    baseUi: ["Slider"],
    category: "Forms",
    description: "Range slider with keyboard support.",
    slug: "slider",
    status: "available",
    title: "Slider",
  },
  {
    astryx: ["Switch"],
    baseUi: ["Switch"],
    category: "Forms",
    description: "On/off switch with motion thumb.",
    slug: "switch",
    status: "available",
    title: "Switch",
  },
  {
    astryx: ["Text Area"],
    baseUi: ["Input"],
    category: "Forms",
    description: "Multi-line text field matching Input styling.",
    note: "Base Input via render=<textarea />; no Radix twin.",
    slug: "textarea",
    status: "available",
    title: "Textarea",
  },
  {
    astryx: ["Input Group", "Input Group Text"],
    baseUi: [],
    category: "Forms",
    description: "Leading and trailing addons around Input.",
    note: "SmoothUI-owned compound; compose with Input.",
    slug: "input-group",
    status: "available",
    title: "Input Group",
  },
  {
    astryx: ["Field", "Field Label", "Field Status"],
    baseUi: ["Field", "Fieldset", "Form"],
    category: "Forms",
    description: "Field, label, description, and error primitives for forms.",
    note: "Astryx Field Status ↔ Base Field.Error + validity states.",
    slug: "field",
    status: "available",
    title: "Field",
  },

  // —— Overlays ——
  {
    astryx: ["Banner"],
    baseUi: [],
    category: "Overlays",
    description: "Inline info, success, warning, and destructive notices.",
    note: "SmoothUI-owned. Not Alert Dialog — use Dialog for blocking confirms. Delphi Alert is the visual ref.",
    slug: "alert",
    status: "available",
    title: "Alert",
  },
  {
    astryx: ["Command Palette"],
    baseUi: [],
    category: "Overlays",
    description: "Command palette — search and run actions in a dialog.",
    note: "SmoothUI-owned (cmdk + Dialog). Delphi Command / Astryx Command Palette refs.",
    slug: "command",
    status: "available",
    title: "Command",
  },
  {
    astryx: ["Dialog", "Dialog Header", "Alert Dialog"],
    baseUi: ["Dialog", "Alert Dialog"],
    category: "Overlays",
    description: "Modal dialog and alert dialog with Motion enter/exit.",
    note: "Study Astryx useImperativeDialog / useImperativeAlertDialog for imperative API.",
    slug: "dialog",
    status: "available",
    title: "Dialog",
  },
  {
    astryx: [
      "Dropdown Menu",
      "Dropdown Menu Item",
      "Dropdown Menu Checkbox Item",
      "Dropdown Menu Radio Item",
      "Dropdown Menu Submenu",
      "More Menu",
    ],
    baseUi: ["Menu"],
    category: "Overlays",
    description: "Dropdown menu with nested items and Motion polish.",
    slug: "dropdown-menu",
    status: "available",
    title: "Dropdown Menu",
  },
  {
    astryx: ["Context Menu", "Context Menu Item"],
    baseUi: ["Context Menu"],
    category: "Overlays",
    description: "Right-click / long-press context menu.",
    slug: "context-menu",
    status: "available",
    title: "Context Menu",
  },
  {
    astryx: ["Bottom Sheet", "Bottom Sheet Switcher"],
    baseUi: ["Drawer"],
    category: "Overlays",
    description: "Swipeable drawer from any edge, backed by Base UI Drawer.",
    note: "Mobile sheet patterns from Astryx Bottom Sheet; desktop from Base Drawer.",
    slug: "drawer",
    status: "available",
    title: "Drawer",
  },
  {
    astryx: ["Popover"],
    baseUi: ["Popover"],
    category: "Overlays",
    description: "Anchored popover for non-modal content.",
    slug: "popover",
    status: "available",
    title: "Popover",
  },
  {
    astryx: ["Hover Card"],
    baseUi: ["Preview Card"],
    category: "Overlays",
    description: "Hover preview card (link previews, rich tooltips).",
    slug: "preview-card",
    status: "available",
    title: "Preview Card",
  },
  {
    astryx: ["Tooltip"],
    baseUi: ["Tooltip"],
    category: "Overlays",
    description: "Accessible tooltip with delay and Motion fade.",
    slug: "tooltip",
    status: "available",
    title: "Tooltip",
  },
  {
    astryx: ["Toast", "Banner"],
    baseUi: ["Toast"],
    category: "Overlays",
    description: "Toast notifications with queue and swipe dismiss.",
    slug: "toast",
    status: "available",
    title: "Toast",
  },

  // —— Navigation ——
  {
    astryx: ["Collapsible", "Collapsible Group"],
    baseUi: ["Accordion"],
    category: "Navigation",
    description: "Expandable accordion sections.",
    note: "Base Accordion parts; Astryx Collapsible Group for multi-open UX.",
    slug: "accordion",
    status: "available",
    title: "Accordion",
  },
  {
    astryx: ["Collapsible"],
    baseUi: ["Collapsible"],
    category: "Navigation",
    description: "Single collapsible region.",
    slug: "collapsible",
    status: "available",
    title: "Collapsible",
  },
  {
    astryx: ["Tabs", "Tab", "Tab List", "Tab Menu", "Segmented Control"],
    baseUi: ["Tabs"],
    category: "Navigation",
    description: "Tabbed navigation with animated indicator.",
    slug: "tabs",
    status: "available",
    title: "Tabs",
  },
  {
    astryx: ["Top Nav Menu", "Nav Heading Menu"],
    baseUi: ["Menubar"],
    category: "Navigation",
    description: "Desktop-style menu bar.",
    slug: "menubar",
    status: "available",
    title: "Menubar",
  },
  {
    astryx: [
      "Top Nav",
      "Top Nav Mega Menu",
      "Side Nav",
      "Mobile Nav",
      "Breadcrumbs",
    ],
    baseUi: ["Navigation Menu"],
    category: "Navigation",
    description: "Site navigation with menus and links.",
    slug: "navigation-menu",
    status: "available",
    title: "Navigation Menu",
  },
  {
    astryx: ["Breadcrumbs", "Breadcrumb Item"],
    baseUi: [],
    category: "Navigation",
    description: "Animated breadcrumb trail with accessible markup.",
    note: "SmoothUI-owned (also listed under Components).",
    slug: "breadcrumb",
    status: "available",
    title: "Breadcrumb",
  },
  {
    astryx: ["Pagination"],
    baseUi: [],
    category: "Navigation",
    description: "Page navigation with animated active indicator.",
    note: "SmoothUI-owned (also listed under Components).",
    slug: "pagination",
    status: "available",
    title: "Pagination",
  },
  {
    astryx: ["Side Nav", "Side Nav Item", "Side Nav Section"],
    baseUi: [],
    category: "Navigation",
    description: "Collapsible app sidebar shell.",
    note: "SmoothUI-owned lean shell. Delphi Sidebar / Astryx Side Nav refs.",
    slug: "sidebar",
    status: "available",
    title: "Sidebar",
  },

  // —— Display ——
  {
    astryx: [
      "Avatar",
      "Avatar Group",
      "Avatar Group Overflow",
      "Avatar Status Dot",
    ],
    baseUi: ["Avatar"],
    category: "Display",
    description: "User avatar with image fallback.",
    note: "AvatarGroup + AvatarStatus shipped as compounds on Avatar.",
    slug: "avatar",
    status: "available",
    title: "Avatar",
  },
  {
    astryx: ["Badge", "Token", "Status Dot"],
    baseUi: [],
    category: "Display",
    description: "Compact labels, tags, and presence status dots.",
    note: "SmoothUI-owned. Delphi Badge/Tag are the visual refs.",
    slug: "badge",
    status: "available",
    title: "Badge",
  },
  {
    astryx: ["Calendar", "Date Input", "Date Range Input"],
    baseUi: [],
    category: "Display",
    description: "Date grid for single and range selection.",
    note: "SmoothUI-owned via react-day-picker. Compose with Popover for pickers.",
    slug: "calendar",
    status: "available",
    title: "Calendar",
  },
  {
    astryx: ["Code Block"],
    baseUi: [],
    category: "Display",
    description: "Syntax-highlighted code block with copy affordance.",
    note: "Existing SmoothUI Code Block (also under Components). Delphi CodeBlock ref.",
    slug: "code-block",
    status: "available",
    title: "Code Block",
  },
  {
    astryx: ["Empty State"],
    baseUi: [],
    category: "Display",
    description: "First-run and no-results empty states.",
    note: "SmoothUI-owned. Delphi Empty is the visual ref.",
    slug: "empty",
    status: "available",
    title: "Empty",
  },
  {
    astryx: ["Kbd"],
    baseUi: [],
    category: "Display",
    description: "Keyboard key hints for shortcuts.",
    note: "SmoothUI-owned. Delphi Kbd / Astryx Kbd refs.",
    slug: "kbd",
    status: "available",
    title: "Kbd",
  },
  {
    astryx: ["Progress Bar", "Spinner"],
    baseUi: ["Progress"],
    category: "Display",
    description: "Determinate and indeterminate progress bars.",
    slug: "progress",
    status: "available",
    title: "Progress",
  },
  {
    astryx: ["Status Dot", "Indicator"],
    baseUi: ["Meter"],
    category: "Display",
    description: "Semantic meter for gauges and capacity.",
    slug: "meter",
    status: "available",
    title: "Meter",
  },
  {
    astryx: ["Scrollable Area"],
    baseUi: ["Scroll Area"],
    category: "Display",
    description: "Custom scrollable region with styled scrollbars.",
    slug: "scroll-area",
    status: "available",
    title: "Scroll Area",
  },
  {
    astryx: ["Divider"],
    baseUi: ["Separator"],
    category: "Display",
    description: "Visual and semantic separator.",
    slug: "separator",
    status: "available",
    title: "Separator",
  },
  {
    astryx: ["Skeleton"],
    baseUi: [],
    category: "Display",
    description: "Loading placeholders with optional shimmer.",
    note: "SmoothUI-owned. Delphi Skeleton is the visual ref. Distinct from ContentSkeleton component.",
    slug: "skeleton",
    status: "available",
    title: "Skeleton",
  },
  {
    astryx: ["Spinner"],
    baseUi: [],
    category: "Display",
    description: "Indeterminate loading spinner.",
    note: "SmoothUI-owned. Delphi Spinner is the visual ref.",
    slug: "spinner",
    status: "available",
    title: "Spinner",
  },
] as const;

/** Category order for gallery filter pills (excludes Guide). */
export const PRIMITIVE_CATEGORY_ORDER = [
  "Actions",
  "Forms",
  "Overlays",
  "Navigation",
  "Display",
] as const;

export const getPlannedPrimitives = (): PrimitiveInventoryItem[] =>
  PRIMITIVES_INVENTORY.filter((item) => item.status === "planned");

export const getAvailablePrimitiveSlugs = (): Set<string> =>
  new Set(
    PRIMITIVES_INVENTORY.filter((item) => item.status === "available").map(
      (item) => item.slug
    )
  );

export const getAvailablePrimitiveCount = (): number =>
  PRIMITIVES_INVENTORY.filter((item) => item.status === "available").length;
