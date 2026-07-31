import type { AIApprovalOption } from "@repo/smoothui/components/ai-approval";
import type { AIDiffLine } from "@repo/smoothui/components/ai-diff";
import type { AIPromptAttachment } from "@repo/smoothui/components/ai-prompt-input";
import type { AIResponseCitation } from "@repo/smoothui/components/ai-response";
import type { AISource } from "@repo/smoothui/components/ai-sources";
import type { AISuggestion } from "@repo/smoothui/components/ai-suggestions";
import type { AITask } from "@repo/smoothui/components/ai-task-list";

/**
 * A transcript turn.
 *
 * Assistant turns are a bag of optional parts rather than a block of markdown,
 * because that is what an agent turn actually is: some thinking, some tool
 * calls, some produced artifact, then prose. Adding a new part means adding one
 * field here and one branch in `chat-thread.tsx` — that is the extension point
 * as more of the AI set lands.
 */
export type ChatTurn =
  | {
      /** Files that rode along with the message. */
      attachments?: AIPromptAttachment[];
      from: "user";
      id: string;
      text: string;
      timestamp: string;
    }
  | {
      approval?: { options: AIApprovalOption[]; question: string };
      artifact?: { code: string; language: string; title: string };
      citations?: AIResponseCitation[];
      diff?: { lines: AIDiffLine[]; title: string };
      from: "assistant";
      id: string;
      reasoning?: string;
      sources?: AISource[];
      suggestions?: AISuggestion[];
      tasks?: { label: string; tasks: AITask[] };
      text?: string;
      timestamp: string;
      tool?: { args: string; name: string; result: string; summary: string };
    };

export type ChatConversation = {
  /** Sidebar grouping label — real products group by recency, so this does. */
  group: string;
  id: string;
  title: string;
  turns: ChatTurn[];
};

const RETIRE_FLAVOUR: ChatTurn[] = [
  {
    attachments: [
      { id: "a1", name: "sales-velocity-2026-q2.csv", size: 24_600 },
      { id: "a2", name: "flavour-review.pdf", size: 1_248_000 },
    ],
    from: "user",
    id: "r1",
    text: "Compare mint chip to last summer and tell me which flavour to retire before Q4.",
    timestamp: "14:31",
  },
  {
    citations: [
      { id: "1", index: 1, title: "Sales velocity export, 2026 Q2" },
      { id: "2", index: 2, title: "Flavour performance review" },
    ],
    from: "assistant",
    id: "r2",
    reasoning:
      "Pulled three summers of sales, normalised for the two stores that opened last year, then compared weekend and weekday velocity before ranking the classics.",
    sources: [
      {
        id: "s1",
        snippet: "Weekly units by flavour and store, 2024–2026.",
        title: "Sales velocity export, 2026 Q2",
        url: "internal://warehouse/sales-velocity-2026-q2.csv",
      },
      {
        id: "s2",
        snippet: "Margin per scoop after the dairy contract renewal.",
        title: "Flavour performance review",
        url: "internal://docs/flavour-performance-review.md",
      },
    ],
    suggestions: [
      { id: "g1", label: "Draft the retirement announcement" },
      { id: "g2", label: "What replaces rocky road?" },
      { id: "g3", label: "Show the margin per scoop" },
    ],
    text: "Mint chip is up 12% on last summer, and the whole gain sits on weekends [1]. Rocky road is the one to retire — down 6% year on year, lowest margin per scoop of the classics, and it does not recover in any store [2].",
    timestamp: "14:32",
    tool: {
      args: '{ "flavours": ["mint-chip", "rocky-road"], "years": 3 }',
      name: "query_sales",
      result: "412 rows",
      summary: "3 summers",
    },
  },
];

const SHIP_PRICE_CHANGE: ChatTurn[] = [
  {
    from: "user",
    id: "p1",
    text: "Raise the single scoop to 4.20 everywhere and stage the change.",
    timestamp: "11:04",
  },
  {
    approval: {
      options: [
        { id: "ship", label: "Apply to all 14 stores" },
        {
          detail: "Rolls out to the two pilot stores only",
          id: "pilot",
          label: "Pilot first",
        },
        { destructive: true, id: "discard", label: "Discard the change" },
      ],
      question: "This updates live prices in 14 stores. Apply now?",
    },
    diff: {
      lines: [
        { content: "  scoops:", kind: "context", number: 12 },
        { content: "-   single: 3.90", kind: "removed", number: 13 },
        { content: "+   single: 4.20", kind: "added", number: 13 },
        { content: "    double: 6.40", kind: "context", number: 14 },
        { content: "-   kids: 2.60", kind: "removed", number: 15 },
        { content: "+   kids: 2.80", kind: "added", number: 15 },
      ],
      title: "config/pricing.yaml",
    },
    from: "assistant",
    id: "p2",
    tasks: {
      label: "Plan",
      tasks: [
        { id: "t1", label: "Read current price table", status: "done" },
        {
          children: [
            { id: "t2a", label: "Update scoop tiers", status: "done" },
            { id: "t2b", label: "Update kids portion", status: "done" },
          ],
          id: "t2",
          label: "Stage the new prices",
          note: "2 files",
          status: "done",
        },
        { id: "t3", label: "Wait for approval", status: "running" },
        {
          id: "t4",
          label: "Publish to stores",
          note: "14 stores",
          status: "pending",
        },
      ],
    },
    text: "Staged. Kids portion moves with it to keep the ratio you set last spring — say the word and I will publish.",
    timestamp: "11:05",
  },
];

const SUMMER_CAMPAIGN: ChatTurn[] = [
  {
    from: "user",
    id: "c1",
    text: "Give me a summer campaign banner I can drop into the site.",
    timestamp: "09:12",
  },
  {
    artifact: {
      code: `export const SummerBanner = () => (
  <section className="rounded-3xl bg-gradient-to-br from-pink-200 to-sky-200 p-10">
    <p className="text-sm uppercase tracking-widest">Summer 2026</p>
    <h2 className="mt-2 text-4xl font-semibold">Two scoops, one price</h2>
    <p className="mt-3 max-w-sm text-sm">
      Every weekday before 5pm, all summer.
    </p>
  </section>
);`,
      language: "tsx",
      title: "SummerBanner.tsx",
    },
    from: "assistant",
    id: "c2",
    suggestions: [
      { id: "c-s1", label: "Make it dark mode aware" },
      { id: "c-s2", label: "Add a countdown" },
    ],
    text: "Here it is, using the pink and sky pair from your brand tokens rather than new colours.",
    timestamp: "09:13",
  },
];

export const CONVERSATIONS: ChatConversation[] = [
  {
    group: "Today",
    id: "retire-flavour",
    title: "Which flavour to retire",
    turns: RETIRE_FLAVOUR,
  },
  {
    group: "Today",
    id: "price-change",
    title: "Stage the price change",
    turns: SHIP_PRICE_CHANGE,
  },
  {
    group: "Previous 7 days",
    id: "summer-campaign",
    title: "Summer campaign banner",
    turns: SUMMER_CAMPAIGN,
  },
];

/** Follow-ups offered on an empty thread, so the composer is never a blank stare. */
export const STARTER_SUGGESTIONS: AISuggestion[] = [
  { id: "st1", label: "Which store is growing fastest?" },
  { id: "st2", label: "Draft next week's staff rota" },
  { id: "st3", label: "Summarise last month's reviews" },
];

/**
 * The reply the template plays back for anything you type.
 *
 * There is no model behind this. Everything below is a fixed script, which is
 * the honest way to demo a chat surface: the components are the product, the
 * answer is set dressing.
 */
export const SIMULATED_REPLY = {
  citations: [
    { id: "1", index: 1, title: "Store operations log, week 30" },
  ] satisfies AIResponseCitation[],
  reasoning:
    "Checked the four stores that reported this week, then compared footfall against the same week last year before answering.",
  sources: [
    {
      id: "sim-s1",
      snippet: "Hourly footfall and till receipts, week 30.",
      title: "Store operations log, week 30",
      url: "internal://warehouse/ops-log-w30.csv",
    },
  ] satisfies AISource[],
  suggestions: [
    { id: "sim-g1", label: "Break it down by store" },
    { id: "sim-g2", label: "Compare with last summer" },
  ] satisfies AISuggestion[],
  text: "Weekday afternoons are the soft spot: footfall holds but the average ticket drops about 18% after 3pm [1]. A two-scoop weekday offer is the cheapest lever you have before Q4.",
  tool: {
    args: '{ "week": 30, "stores": "all" }',
    name: "query_operations",
    result: "96 rows",
    summary: "week 30",
  },
} as const;

/** Offered by the composer's attach control — a picker stands in for a file dialog. */
export const ATTACHABLE_FILES: AIPromptAttachment[] = [
  { id: "f1", name: "ops-log-w30.csv", size: 18_400 },
  { id: "f2", name: "staff-rota-august.xlsx", size: 42_900 },
  { id: "f3", name: "supplier-invoice-3312.pdf", size: 268_000 },
];

export const MODELS = [
  { id: "opus-5", label: "Opus 5", note: "Best for planning" },
  { id: "sonnet-5", label: "Sonnet 5", note: "Fast, everyday work" },
  { id: "haiku-4-5", label: "Haiku 4.5", note: "Cheapest" },
] as const;

export const CONTEXT_LIMIT = 200_000;
