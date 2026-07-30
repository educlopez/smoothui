# Chat template reference audit — AlignUI vs SmoothUI

Source: https://ai-template.alignui.com/ (walked landing/empty state, two seeded conversations, Projects grid + project detail, sidebar collapse, user menu, dark mode, kebab menu, composer "+" menu). Read-only browser audit, no code changed here.

## AlignUI inventory (numeric)

**App shell**
- Sidebar: `272px` expanded (`w-[272px]`), `72px` collapsed icon rail (`w-18`). Toggle animates `transition-all duration-300 ease-in-out` → computed `cubic-bezier(0.4, 0, 0.2, 1)`. `z-index: 50/60`, `position: fixed` on mobile / `relative` at `lg`.
- The chat panel sits inset inside the shell: outer wrapper has `lg:p-1.5 lg:pl-0` (6px), so the panel reads as a rounded card floating next to the sidebar rather than a flush pane.
- Header is **not a fixed bar**. It's an `absolute top-4 left-5` breadcrumb (`h-28px`, transparent background) floating over the scrollable transcript — content scrolls underneath it. Breadcrumb text `14px`, `text-soft-400`. Chevron next to it and a kebab menu top-right (Share / Export) — both real dropdowns, the chevron does nothing.
- Transcript column: capped around `700px`. Turn wrapper uses `space-y-3.5` (14px vertical gap between turns), `pt-30` (120px, clears the floating header), `pb-24` (96px, clears the composer).
- Composer: floating card, `698px` wide, `rounded-[19px]` desktop / `rounded-[15px]` mobile, `shadow-complex-2` (no border), `p-3 pt-0` desktop / `p-2.5 pt-0` mobile, `transition-all duration-200`.

**Sidebar order**: logo → collapse toggle → New chat → Projects → Library (dead link in the demo) → search field (inline, not a modal) → "Pinned" group (folders) → "Recents" (flat recency list, no per-day grouping until scrolled) → "Yesterday" group → user footer (avatar, name, "Pro" badge, email, chevron → menu).

**User menu**: profile row → Dark Mode toggle → Settings → Language → Need help? → Log out → version + Terms & Conditions footer.

**Transcript turn treatment**
- User turn: `bg-bg-soft-200`, `max-w-md` (448px cap), `rounded-[14px] rounded-br-[8px]` (asymmetric "tail" corner), `px-3.5 py-2.5`, text `14px/leading-5` mobile → `15px/leading-6` desktop. No avatar, no timestamp, **no action icons at all** on user turns.
- Assistant turn: no bubble, bare text (`px-1`), action row (copy / thumbs-up / thumbs-down, `size-6` icon buttons) rendered **always visible**, not hover-gated. No avatar, no timestamp anywhere in the whole app.
- Attachment: shown as a file chip (icon + filename + type label, e.g. "license-agreement.pdf / PDF") right-aligned above the user bubble it belongs to. An image attachment renders the same way as a rounded thumbnail instead of a chip.
- **All sidebar conversations render the identical fixture transcript** regardless of which title you click (`/chat/1`, `/chat/2`, … are the same script) — the demo data isn't actually wired per conversation.

**Rich answer parts**: none. No reasoning/thinking trace, no tool-call UI, no tables, no code blocks, no plans/todos, no approvals, no artifacts/canvas. The whole "rich parts inside answers" category is absent from this reference.

**Composer**: text field, `+` menu (opens upward) with 5 rows — Generate image, Upload image or file, Deep research, Agent mode, Study and learn — and a `GPT-4` model pill. Both the model pill and the breadcrumb chevron are visually interactive but non-functional in the public demo.

**Empty state**: "Hello {name}" + "What can I help you with today?" — no suggestion chips, no starter prompts.

**Projects**: grid of cards (folder icon, name, one-line description, "Updated N days ago"), "Create project" button, search box, sort-by dropdown. Project detail page: composer pinned at top (new chat scoped to the project), "Project files" row with type-colored file icons (green xlsx, blue doc, red pdf) + a `+` to add more, "Instructions" row with a pencil edit affordance, and a "Chats in this project" list (icon + one-line description + time, kebab reveals on hover).

**Motion**: sidebar collapse/expand `300ms ease-in-out`; composer hover/transition `200ms`; transcript entrance is a fade-in on route change (opacity ramps in over the seeded messages, no stagger visible in devtools). No visible streaming-text treatment since nothing in the demo actually streams.

**Typography / density**: Inter throughout (`Inter, "Inter Fallback", Inter, Arial, Helvetica, sans-serif`), body base `16px`. Light bg `#fff`, dark bg `rgb(23,23,23)` (`#171717`, Tailwind neutral-900). Borders are near-absent — the whole surface relies on `shadow-complex-*` and background-tint separation (`bg-soft-200`, `bg-white-0`) rather than 1px borders.

## Our template today

Files: `packages/smoothui/templates/chat-template/index.tsx`, `chat-sidebar.tsx`, `chat-thread.tsx`, `chat-data.ts`.

- Shell: fixed-width `w-64` (256px) sidebar with a real border-right, hidden below `md` (no icon-rail collapsed state — it's all-or-nothing), flat bordered header (`border-b`), flat bordered composer bar (`border-t`). Transcript capped at `max-w-2xl` (672px).
- `ChatTurn` is a discriminated union covering user turns and a rich assistant bag: `reasoning`, `tool`, `tasks`, `diff`, `artifact`, `citations`, `sources`, `suggestions`, `approval` — all optional, rendered in agent-turn order. This is already far more complete than AlignUI's reference on the "rich parts" axis: reasoning traces (`AIReasoning`), tool calls (`AIToolCall`), plans (`AITaskList`), diffs (`AIDiff`), artifacts/canvas (`AIArtifact` with a real rendered preview, not a grey box), approvals (`AIApproval`), citations/sources (`AIResponse` + `AISources`), context-window meter (`AIContextMeter`) — none of which exist in the AlignUI demo at all.
- `AIMessage` already reveals its action row on hover **and** focus-within (keyboard-accessible), timestamps are shown, and a live simulated thinking → tool → streaming pipeline exists in `chat-thread.tsx` (no backend, per constraints).
- Sidebar: branding + `SiriOrb`, New chat, live-filtering search (already inline, already real — matches AlignUI's inline-filter pattern), grouped conversation list (`Today` / `Previous 7 days`), footer with a real photo avatar + plan label + a bare Settings icon button (no menu).
- No Projects concept, no per-turn attachment rendering (though `AIPromptInput` already supports `attachments`/`onAttach` — just unused in the template), no user dropdown menu, no dark-mode toggle in the sidebar, no sidebar collapse-to-icon-rail (only fully hidden).
- Available AI components (`packages/smoothui/components/ai-*`): approval, artifact, branch, citation, context-meter, conversation, core, diff, input, loader, message, orb-face, prompt-input, reasoning, response, sources, suggestions, task-list, tool-call. No existing `ai-attachment`/file-chip, `ai-project`, or sidebar-rail component.

## Gap list (prioritised)

1. **Attachment/file chip rendered in the transcript** — `ChatTurn` (user variant) has no `attachments` field, so a past user turn can never show "the user attached X" the way AlignUI's file-chip does, even though `AIPromptInput` already collects attachments on the way in. Add `attachments?: {id,name,size}[]` to the user turn type, render a small chip (icon + name) above the bubble. Effort: **S**. Uses `chat-data.ts` type + a small addition inside `AIMessage`'s children in `chat-thread.tsx`; no new package component strictly required (reuse `Paperclip` icon already imported in `ai-prompt-input`).

2. **Sidebar collapse-to-icon-rail instead of hide-entirely** — AlignUI keeps a 72px icon rail (logo, new chat, projects, library, search) when collapsed so navigation never fully disappears; our `ChatSidebar` only supports `hidden md:flex` / fully gone. Effort: **M**. Existing component: extend `chat-sidebar.tsx` with a collapsed-rail render branch; no new package component needed.

3. **User account menu** — AlignUI's footer avatar opens a real menu (Dark Mode toggle, Settings, Language, Need help?, Log out). Ours is a bare Settings icon button with no menu at all. Effort: **S–M**. Can compose from `@repo/shadcn-ui` dropdown-menu primitives already in the design system; no new smoothui component needed.

4. **Dark-mode toggle inside the chat surface** — the reference exposes theme switching from the user menu; our template has no visible affordance for it (relies entirely on the host app). Worth exposing at least as an optional prop/toggle so the template demos convincingly stand-alone. Effort: **S**.

5. **Projects concept** — grid of project cards + project detail (pinned composer, project files with type-colored icons, editable instructions, "chats in this project" list). We only have flat date-based grouping ("Today" / "Previous 7 days"). This is the single biggest structural gap. Effort: **L** — needs a new page/section and likely a new `ai-project-card` / `ai-file-chip` pattern; no existing package component covers it.

6. **Composer "+" menu with multiple actions** — AlignUI's attach button opens a 5-item menu (Generate image, Upload file, Deep research, Agent mode, Study and learn) rather than a single "attach a file" action. Our composer's `children` slot currently only holds a static "Opus 5" label button. Effort: **M**. Compose from shadcn dropdown/popover; extend the composer button in `chat-thread.tsx`.

7. **Asymmetric "tail" corner on the user bubble** — AlignUI's `rounded-[14px] rounded-br-[8px]` reads as a speech-bubble tail; check whether `AIMessage`'s default user-bubble radius is uniform and consider the same asymmetric treatment for polish. Effort: **S**, purely cosmetic in `ai-message`.

8. **Floating/inset header + rounded card panel skin** — AlignUI treats the whole chat surface as a rounded card floating with padding inside the shell, with an absolutely-positioned transparent breadcrumb over the scroll area rather than a bordered sticky bar. This is a legitimate alternate skin worth having as a style option, not a structural gap. Effort: **S**, `chat-thread.tsx` header styling.

## Do NOT copy

- **Dead interactive-looking controls.** AlignUI's model picker (`GPT-4 ⌄`), the breadcrumb chevron, and the "Library" sidebar link all look clickable but do nothing in the public demo. Anything we ship that looks like a control must either work or not look like a control — half of this is exactly the "fake content" trap our own CLAUDE.md already forbids.
- **One fixture transcript behind every sidebar item.** Every conversation title in the AlignUI demo (`User research analysis`, `Competitive analysis`, …) opens the exact same seeded thread. Our `chat-data.ts` already does the right thing (distinct turns per conversation id) — don't regress toward a single shared script for convenience.
- **Always-visible action icons under every assistant message.** It reads fine in a 3-message demo but becomes visual noise on a long thread. Our hover/focus-within reveal in `AIMessage` is the more accessible and less noisy pattern — keep it.
- **No timestamps anywhere.** AlignUI never shows a time on any turn. Ours already does (`turn.timestamp`) — don't drop it to match; timestamps are useful and cheap.
- **Zero rich-answer parts.** AlignUI's reference has nothing to teach us about reasoning traces, tool calls, diffs, plans, or artifacts — our template is already ahead here. Resist the urge to "simplify down" to AlignUI's bare-bubble level in the name of matching a reference; the gap list above is about shell/chrome polish, not stripping capability we already have.
