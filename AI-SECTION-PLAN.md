# SmoothUI — AI section overhaul + Orb family

Date: 2026-07-29 · Status: slice 1 built (foundation + 3 orbs), pending visual review.
Refs studied: beautiful-ui (turbodesign), ai-sdk elements, aicss.dev, prompt-kit, orbs.jakubantalik.com

---

## 1. Where we are

| Component | Reality | Verdict |
|---|---|---|
| `agent-avatar` | Canvas generative pixel avatar, seeded. Own animation loop (pulse/breathe/wave/sparkle). | Solid, keep. Needs `state` prop. |
| `ai-branch` | Compound: Branch / Messages / Selector / Previous / Next / Page. Motion + reduced-motion OK. | Good bones. Needs polish, not rebuild. |
| `ai-input` | **Misnamed.** Default export is `MorphSurface` — a feedback dock that morphs pill → panel. Not a prompt input at all. | Rename → `morph-surface` (Others). Build a real `ai-prompt-input`. |
| `siri-orb` | Pure CSS conic-gradient + `@property --angle`. No states, no audio reactivity, listed under **Others**. | Promote to AI. Becomes orb #1 of a family. |

Gap: we have **3** AI components. Refs ship 20–45 each. The AI section is the single
biggest catalog hole and the highest-demand category in 2026.

Infra we can lean on: raw WebGL precedent (`sdf-blob-transition`, `shader-reveal-*`),
GSAP available, Motion 12, `smoothui` metadata block in every `package.json`.

---

## 2. Design principles for the AI section (our DS, not theirs)

The refs are *functional*. Our differentiator is **motion craft**. Rules:

1. **One state contract across the whole section.**
   ```ts
   type AIState = "idle" | "listening" | "thinking" | "streaming" | "done" | "error";
   ```
   Every AI component accepts it. Orb, avatar, input, tool card, message — all read the
   same enum so a page transitions as one organism instead of N independent widgets.

2. **Amplitude channel.** `amplitude?: number` (0–1) on every reactive surface, fed by mic
   or token rate. Orbs, waveforms and the input glow all consume it. Optional — degrades to
   a synthetic idle oscillation when absent.

3. **Motion budget per state** (SmoothUI animation rules, unchanged):
   - state→state morph: spring `duration 0.25 / bounce 0.1`
   - enter: `cubic-bezier(.23,1,.32,1)`, 0.2–0.25s
   - ambient loops (orb rotation, breathing): 8–20s linear, only `transform`/`opacity`/`filter`
   - `useReducedMotion` mandatory; ambient loops stop, state changes go instant.

4. **Layout-shift-free streaming.** Text streaming reserves height; never reflow the page
   mid-token. Use character/word opacity staggers (we already own 28 text components —
   reuse `soft-blur-in`, `per-word-crossfade`, `shimmer-sweep`).

5. **Compound components**, dot-notation exports, like `ai-branch` already does. Not
   monolithic props bags.

6. **Zero external deps** beyond `motion` + `lucide-react`. No `ai` SDK types — accept
   plain shapes so it works with any backend.

---

## 3. Proposed catalog

### Phase A — Chat surface (the 80% case)

| # | Component | What | Animation opportunity |
|---|---|---|---|
| A1 | `ai-prompt-input` | Real composer: autogrow textarea, attachment tray, model chip, send/stop morph, `/` command menu, char counter. | Send↔Stop icon morph (path morph, not crossfade). Border glow driven by `amplitude`. Attachment chips spring in with stagger from cursor. Height autogrow via `layout` (Motion) so it never jumps. |
| A2 | `ai-message` | User/assistant bubble, avatar slot, actions row (copy/retry/like) revealed on hover, timestamp. | Actions row: origin-aware slide+fade from the bubble edge, hover-device gated. Copy → checkmark via `button-copy` primitive we own. |
| A3 | `ai-response` | Streaming markdown text with cursor, inline citation pills, follow-up suggestion row. | Per-word `soft-blur-in` stagger tied to token arrival, not a fixed timer. Blinking caret that *rides* the last glyph. Citations pop with `spring bounce 0.1` when their sentence completes. |
| A4 | `ai-reasoning` | Collapsible "Thinking…" trace, elapsed timer, auto-collapses when done. | Auto-collapse choreography: height spring + content fade-out, then a shimmer sweep on the summary line to signal "settled". Shimmer only while active. |
| A5 | `ai-conversation` | Scroll container: stick-to-bottom, "jump to latest" pill, new-message nudge. | The pill: scale+blur in from bottom, magnetic-ish. Scroll-anchoring so streaming never fights the user's scroll. |
| A6 | `ai-suggestions` | Prompt suggestion chips / empty state. | Stagger-from-center on mount (we own `stagger-from-center`). Chip press → morphs into the input value. |
| A7 | `ai-loader` | Family of thinking indicators: dots, shimmer bar, pixel grid, elapsed churn label. | Variants share one duration token so a page never has two out-of-phase loaders. |

### Phase B — Agent / tool states

| # | Component | What | Animation opportunity |
|---|---|---|---|
| B1 | `ai-tool-call` | Collapsible tool invocation: name, args, result, status badge (pending/running/ok/error). | Status badge is a **single morphing dot**: pulse → spinner arc → check → cross. One element, no swaps. Row expands with height spring, args fade in staggered. |
| B2 | `ai-task-list` | Live agent plan: nested steps, running/done/failed, progress counters. | Checkbox → check draw (stroke-dashoffset). The running row gets a travelling gradient underline. Completed rows settle down by 1px with a micro-scale. |
| B3 | `ai-sources` | Favicon stack that expands to a source list, hover cards with title/desc. | Stacked favicons fan out on hover (`layoutId` shared element into the list row). We already own `photo-stack` drag math — reuse the fan geometry. |
| B4 | `ai-citation` | Inline superscript pill → popover with source preview. | Origin-aware popover (`transform-origin` from the pill), `gooey-popover` treatment available. |
| B5 | `ai-approval` | Human-in-the-loop card: question + option buttons + confirm/deny. | Chosen option expands to fill the card while siblings collapse and desaturate. Decisive, one spring. |
| B6 | `ai-diff` | Proposed code/data edit with +/- lines, accept/reject. | Added lines sweep in green from the left with a clip-path wipe; rejected lines collapse height to 0. Accept → whole block flashes and settles. |
| B7 | `ai-artifact` | Generated-artifact frame: title bar, tabs (preview/code), copy, open. | Tab switch uses `shared-axis-x` (we own it). Preview↔code is a `layoutId` morph, not a crossfade. |
| B8 | `ai-context-meter` | Token/context window usage ring + tooltip breakdown. | Ring fills with `number-flow` on the label (we own it). Warning threshold shifts hue, not size. |

### Phase C — Orb family (`ai-orb-*`)

Unified API, shared across all variants:

```ts
type AIOrbProps = {
  state?: AIState;            // drives preset motion
  amplitude?: number;         // 0–1, mic or token rate
  size?: number | string;
  colors?: { c1: string; c2: string; c3: string; bg?: string };
  speed?: number;             // multiplier on ambient loop
  reactive?: boolean;         // auto-attach mic via useAudioAmplitude
};
```

Plus one shared hook: `useAudioAmplitude()` → mic RMS, throttled to rAF, SSR-safe,
returns 0 when denied. This is the piece the refs don't ship and is what makes the
family feel alive instead of decorative.

| # | Variant | Tech | Look |
|---|---|---|---|
| C1 | `siri-orb` (existing) | CSS conic-gradient | keep, add `state`/`amplitude` |
| C2 | `ai-orb-aura` | CSS radial gradients + blur | Soft breathing halo, no hard edge. Cheapest, works at 16px. |
| C3 | `ai-orb-rings` | SVG arcs | Concentric arcs, different speeds/phases. Gemini-ish. Draws on `thinking`. |
| C4 | `ai-orb-blob` | WebGL, fbm noise SDF | Organic metaball that swells with amplitude. Our shader precedent applies. |
| C5 | `ai-orb-liquid` | WebGL, domain-warped noise + iridescence | Liquid-metal / oil-slick sphere. Highest "wow", Pro-tier quality. |
| C6 | `ai-orb-particles` | Canvas 2D | Swarm that disperses on `listening`, converges on `thinking`, bursts on `done`. |
| C7 | `ai-orb-waveform` | Canvas 2D | Circular waveform ring from real mic FFT. The "voice mode" orb. |
| C8 | `ai-orb-mesh` | CSS/WebGL gradient mesh | 3D-lit sphere with specular highlight that tracks cursor. |

State presets (identical semantics in every variant, different rendering):

- `idle` — slow ambient loop, low saturation, ~0.3 scale of full motion
- `listening` — expands, amplitude-reactive, high responsiveness (low damping)
- `thinking` — fast internal churn, *no* size change (so layout stays calm)
- `streaming` — pulses in sync with token rate
- `done` — one settle overshoot, then back to idle
- `error` — desaturate + single lateral shake, ≤200ms

---

## 4. Housekeeping in the same pass

- Move `siri-orb` from **Others** → **AI** in `apps/docs/content/docs/components/meta.json`.
- Rename `ai-input` → `morph-surface`, keep a re-export shim for one release.
- Sub-group the AI section in `meta.json`: `---AI · Chat---`, `---AI · Agent---`, `---AI · Orbs---`.
- Add an `/docs/components/ai` overview page showing the shared `AIState` contract.
- Consider one AI **block** (`blocks/ai/chat-panel`) composing A1+A2+A3+A5 — proves the
  contract and is the demo people screenshot.

---

## 5. Decisions taken (2026-07-29)

1. Build **Phase A and Phase C in parallel**.
2. Orb tech: **mostly CSS/Canvas, 1–2 WebGL** (blob and liquid only).
3. **Everything ships in OSS** — the AI section is the biggest traffic hook right now.
4. `ai-input` → `morph-surface` **rename now, with a deprecated re-export** for one release.

---

## 6. Slice 1 — built

| Package | Notes |
|---|---|
| `ai-core` | `AIState`, `AI_STATE_MOTION` presets, `useAmplitudeValue`, `useAudioAmplitude` (real mic RMS as a `MotionValue`), `useSimulatedAmplitude`. Ships via `/r/ai-core.json` as a dependency of the others — no pollution of non-AI components. |
| `siri-orb` | Upgraded in place: `state` + `amplitude` props, loudness tightens the gradient, error shake, reduced-motion. Docs previously claimed audio reactivity that did not exist — now true. Moved from **Others** to **AI · Orbs**. |
| `ai-orb-aura` | New. CSS-only breathing halo, size-proportional blur and drift so it holds from 16px to hero. |
| `ai-orb-rings` | New. Counter-rotating SVG arcs, `thinking` churns without changing the footprint. |

Nav is now sub-grouped: `AI · Chat` and `AI · Orbs`.

**Bugs found and fixed during the visual pass**
- `ai-orb-rings`: arcs orbited their own bounding box instead of the viewBox centre.
  Fixed with `transform-box: view-box`.
- `ai-orb-aura`: Tailwind's fixed `blur-2xl`/`blur-xl` destroyed the 20px orb. Blur and
  lobe drift are now ratios of `--orb-size`.

---

## 6b. Slice 2 — status legibility rebuilt + two new components

Feedback on slice 1: *"no queda clara las diferencias de status"*. Correct — the states
only varied speed, scale and saturation. **Two states that differ only in tempo look like
the same state.** Fixed by giving each state a categorically different *motif*.

New in `ai-core`: `AIOrbStatusLayer` — one shared status vocabulary every orb renders.

| State | Motif | Reads as |
|---|---|---|
| `idle` | nothing drawn | at rest — the absence is the signal |
| `listening` | concentric rings tracking loudness | receiving |
| `thinking` | short arc sweeping the perimeter | working |
| `streaming` | rings emitted on a rhythm, over a steady inner ring | emitting |
| `done` | one outward ping plus a drawn checkmark | finished |
| `error` | ring broken into four gaps | faulted |

Status now travels on **three independent channels at once** — the motif, the accent-tinted
bloom (green on `done`, red on `error`), and the ambient tempo. It survives being seen out
of the corner of an eye. Presets also gained `glow`, `hueRotate`, `accent`, `pulseSeconds`.

Docs gain a **six-up grid** on every orb page: all states rendered simultaneously, which is
the only honest way to judge whether they are distinguishable.

New components:

| Package | Notes |
|---|---|
| `ai-orb-waveform` | Canvas circular waveform. Loudness deflects the ring and is remembered in a 48-frame history, so a syllable leaves a travelling wake instead of a spike. |
| `ai-prompt-input` | The real composer. Autogrow via layout spring, attachment chips with stagger, counter past 80% of `maxLength`, Enter/Shift+Enter, toolbar slot via `children`, `streaming` turns submit into stop. |

**Bugs found and fixed in the second visual pass**
- `error` was washed out: the root `saturate(0.3)` also desaturated the semantic accent, so
  the red identifying the state disappeared. The filter now applies only to the orb body —
  bloom and status layer sit outside it.
- `done` left a green ring stuck on screen: Motion does not reliably apply `opacity`
  keyframes to SVG shapes. Ping and pulse now animate `r` + `strokeOpacity` with explicit
  `initial`/`animate`.
- `streaming` could render nothing between pulses and became indistinguishable from `idle`.
  Added a steady inner ring.
- `ai-prompt-input` send glyph pointed left: a `-90°` rotation on an apex-up triangle.
  Rotation dropped; the path morph carries the transition on its own.

**Test coverage**: 36 new tests across the five packages, including contract tests that
assert every state owns a distinct motif and that `thinking` never changes scale. Full
suite: 434 passing, coverage gate green.

---

## 6c. Slice 3 — the shared overlay was wrong; state moved into the material

Feedback: the new orbs were mediocre, `siri-orb` was the only good one, the same layer was
pasted onto all of them, and *"sale hasta un check que da ridículo"*. All correct.

**What was wrong.** `AIOrbStatusLayer` made four different materials look like one widget in
costume, and it pushed literal iconography — a checkmark, a warning ring — onto pieces that
are decorative by nature. **Deleted.** Nothing renders on top of an orb any more.

**What replaced it.** State reaches each orb through its own substance:

| Orb | How state shows |
|---|---|
| `siri-orb` | Back to close to what it was: state drives rotation speed, scale and saturation; loudness tightens the gradient. Bloom uses its own palette, not a semantic green/red. |
| `ai-orb-rings` | `turbulence` fragments each arc into more, shorter dashes. Calm draws one long sweep; churning draws a broken, busy stroke. |
| `ai-orb-waveform` | `turbulence` admits the higher harmonics. Calm is near-circular; churning grows fine jagged detail. |
| `ai-orb-aura` | Lobe drift and bloom strength only, in its own colours. |

`AI_STATE_MOTION` gained `turbulence` and `tumble` — the two channels a shader actually
needs. `thinking` is max turbulence with an unchanged silhouette; `done` flattens the field
almost still, because stillness reads as finished; `error` stalls the tumble while keeping
turbulence mid, so the surface twitches in place instead of flowing.

**Two new orbs.**

- **`ai-orb-liquid`** — WebGL, and the shader itself is what reacts. Domain-warped fbm
  (noise displaced by noise), view-dependent iridescence, continuous tumble, Fresnel rim,
  all resolved in one pass. Uniforms chase their targets so a state change reads as a
  substance settling rather than a value snapping.
- **`ai-orb-face`** — the character. Gaze follows the pointer and looks *away* while
  thinking, natural blink cadence, squint/widen per state, happy arcs and a hop on `done`,
  spiral eyes on `error`. Timings lifted from the SmoothUI moai so they read as the same
  creature. This is the one piece that *can* be explicit about status, because a face
  earning an expression is not the same as a sticker on a decorative orb.

**Bugs found in this pass**
- Shader v1 looked like marbled paper: `fract()` on a band index wraps discontinuously and
  those seams are the tell. Replaced with a cyclic cosine ramp; weights raised to a power
  before normalising, since plain cosine weights blend all three stops at once and average
  the palette to grey.
- Value noise left axis-aligned blockiness under heavy warping — swapped for gradient noise.
- No diffuse term meant the disc read flat however good the noise was; added sphere lighting.
- `WEBGL_lose_context` in the effect cleanup left the canvas permanently dead on hot reload
  or remount. Removed.
- `ai-orb-face`: the squint and the blink both wrote `scaleY` and fought. The squint now
  drives the rect's `height`; the blink owns `scaleY` alone.
- `ai-orb-face`: an `error` timeout reset the face to neutral after 2.2s, so a broken
  assistant ended up looking fine. Spiral eyes now persist for as long as the state does.
- A blink spans several `await`s, so `controls.start()` fired after unmount and threw.
  Guarded with a mounted ref — **the same bug existed in `apps/docs/components/icon.tsx`**
  (the site's moai) and was throwing on every page; fixed there too.

**Verification**: 48 tests across the AI packages, full suite 445 passing, coverage gate
green, lint and typecheck clean, no console exceptions after the fixes.

---

## 6d. Slice 4 — cut the basics, references, liquid rebuilt

**Deleted**: `ai-orb-aura`, `ai-orb-rings`, `ai-orb-waveform`. Too basic. A soft gradient
blob, three rotating arcs and a wobbling ring are things anyone builds in an afternoon;
they were catalogue filler, not a reason to install SmoothUI. The orb family is now
`siri-orb` (CSS, the one that already worked), `ai-orb-liquid` (shader) and `ai-orb-face`
(character).

### References studied

| Reference | What is worth taking |
|---|---|
| [orb-ui](https://github.com/alexanderqchen/orb-ui) | Theme vocabulary: `radial` is a "four-lobe radial field with input-reactive rim and output-reactive twisting"; `cloud` an "atmospheric sphere with inverse listening scale". Note **inverse** scale on listening — it shrinks to listen. Also splits input volume from output volume, which we collapse into one `amplitude`. |
| [Voice Powered Orb (21st.dev)](https://21st.dev/@isaiahbjork/components/voice-powered-orb) | Rotation speed *and* visual intensity both modulate from audio level, not just size. |
| [react-ai-orb](https://github.com/Steve0929/react-ai-orb) | Palette exposed as explicit start/end gradient stops — a small API surface people actually use. |
| [Building a Voice Reactive Orb in React](https://medium.com/@therealmilesjackson/building-a-voice-reactive-orb-in-react-audio-visualization-for-voice-assistants-2bee12797b93) | Glow rendered in the fragment shader with the analyser driving movement *and* brightness. |
| [react-3d-ai-assistant](https://www.npmjs.com/package/@ibrahim-org/react-3d-ai-assistant) | Iridescent glass shader **plus blinking eyes** — independent confirmation that the character orb is a real category, not a novelty. |
| [Fluid Voice Orb](https://contra.com/community/ouTrpqMC-discover-the-fluid-voice-orb-inspired) / [voiceorb](https://github.com/aguscruiz/voiceorb) | The ChatGPT-voice-mode lineage: Perlin displacement, dynamic colour, **Fresnel edge glow that intensifies with voice**. |
| [Orb shader with React Native Skia](https://www.animatereactnative.com/post/orb-shader-animation-with-react-native-skia) | Layered cosine patterns for the iridescent look — the same technique the ramp uses. |

**The consensus across all of them, and why the first liquid was wrong**

1. They are **emissive**, not lit. Not one uses a specular highlight. A specular dot implies
   a lamp off-screen and reads as shiny plastic — that was the "brillo raro".
2. The **silhouette moves**. Every good one displaces its boundary. A perfect circle with a
   texture inside always reads as a textured circle.
3. **Fresnel rim brightness tracks the voice.** The edge is where the audio shows.
4. Palettes have a **dark anchor**. Three pastels of similar lightness average into cotton
   candy with nothing for the light to glow against.

### Liquid v2

- Specular and diffuse lighting removed entirely. Brightness now comes from a core falloff
  plus a luminous rim and an outward halo.
- Silhouette deformed by harmonics of the angle, swelling with loudness.
- Palette re-anchored: deep violet body, brand magenta plume, cyan rim. `c1` must stay
  clearly darker than `c2`/`c3`.
- Alpha follows the deformed outline plus the halo, so there is no circular cut.

**Bug found**: the first attempt at the wobbling outline sampled fbm along the direction
vector, and gradient noise cell structure showed up on the unit circle as flat facets — the
orb rendered as a **polygon**. Angular harmonics are periodic by construction and always
close smoothly.

**State check**: 143 test files, 430 tests passing, coverage gate green, typecheck and lint
clean.

---

## 6e. Slice 5 — orbs paused, chat and agent surface built

**Orbs paused.** Kept: `siri-orb` (with the state + amplitude wiring) and `ai-orb-face`
(the cartoon, still to iterate). `ai-orb-liquid` deleted along with the three basics.
The orb family is deliberately two components until the character gets another pass.

**Built** — seven components, all wired to the same `AIState` vocabulary:

| Component | The animation idea that earns it |
|---|---|
| `ai-conversation` | Follows the bottom **only while the reader is already there**. Scrolling up during a stream is an explicit act; dragging people back is how chat UIs become unusable. Jump-to-latest pill when it stops following. |
| `ai-response` | Words animate in as they **arrive**, not on a timer. A timer-driven typewriter drifts out of step with the real stream and starts lying about how fast the model answers. Caret is inline, so it rides the last glyph for free. |
| `ai-message` | Action row slides out of the bubble's **own edge** — origin-aware, so it reads as belonging to that message. Revealed on hover *and* focus, always in the DOM so tab order never shifts. |
| `ai-reasoning` | Shimmer exists **only while streaming**, so it means "still working" rather than being decoration. Auto-collapses ~600ms after finishing; a manual toggle hands control back permanently. |
| `ai-tool-call` | Status is **one ring that evolves** — breathes, opens a gap and spins, then closes and draws a check or cross inside itself. The ring never unmounts, so the eye tracks one object. |
| `ai-suggestions` | Centre-out stagger. A left-to-right sweep implies ranking; these are alternatives of equal weight. |
| `ai-loader` | Three variants sharing one exported cycle length, so mixing them stays in sync. The bar sweeps and never fakes a percentage. |

Nav is now `AI · Chat` (7), `AI · Agent` (2), `AI · Orbs` (2).

**Bugs found in the browser pass**
- `ai-response`: words stayed **permanently blurred**. The stagger delay was derived from
  the render-time index and went negative as the text grew, so the entrance never resolved.
  The transition object is now hoisted and constant — token arrival is the stagger.
- `ai-response`: citations rendered as literal `[1]`. The tokenizer split on whitespace only,
  so `[1],` with glued punctuation never matched. Now splits on markers too, and bare
  punctuation stays as text rather than becoming its own inline-block.
- `ai-conversation`: `Element.scrollTo` is missing in jsdom and some older engines, and the
  component threw. Falls back to assigning `scrollTop`.
- `ai-message`: the prop was called `role`, which is an ARIA attribute — accessibility
  linters reject `role="user"` as an invalid role. Renamed to `from`, matching what the
  AI Elements reference does for the same reason.

**State**: 149 test files, 457 tests passing, coverage gate green, typecheck clean, zero lint
errors across the AI packages.

### Still to build from the reference sweep

Phase A leftovers are done. Remaining Phase B: `ai-sources` (favicon stack fanning into a
list), `ai-citation` (pill → source popover), `ai-approval` (human-in-the-loop card),
`ai-task-list` (live agent plan), `ai-diff`, `ai-artifact`, `ai-context-meter`.

---

## 6f. Slice 6 — Phase B complete

Seven agent-surface components, closing out the reference sweep.

| Component | The animation idea that earns it |
|---|---|
| `ai-sources` | Favicon stack fans on hover, then each favicon **travels** into its own row via a shared layout id. The icon the eye was tracking is the icon that lands. |
| `ai-citation` | The card scales up **from the pill** (`transform-origin: bottom center`), so the pointer never loses the thread. Opens on hover *and* focus, closes on Escape. |
| `ai-approval` | The chosen option expands to fill the card while the alternatives collapse out of existence. Leaving them greyed out invites a second look at something that already happened. |
| `ai-task-list` | The check **draws itself**. A travelling underline marks the running row and only that row — one moving thing at a time is what makes "which step is live" readable. Header counts derive from the data. |
| `ai-diff` | Added lines wipe in with a clip path; a wipe has a direction and direction says the line was *written*. Context lines do not animate. Accept flashes once; reject collapses the lines to nothing. |
| `ai-artifact` | Preview always sits left of code, so the swap has a direction and a memory. The tab indicator is one shared element sliding, not two tabs changing colour. |
| `ai-context-meter` | Crossing a threshold changes **hue, not size** — growing the ring would read as progress, the opposite of the message. |

Nav: `AI · Chat` (9), `AI · Agent` (7), `AI · Orbs` (2).

**Bugs found in the browser pass**
- `ai-task-list`: the drawn check rendered as a **stub**. Motion's `pathLength` shorthand
  left `stroke-dasharray` pinned at `0 1`, and an explicit `strokeDashoffset` animation was
  equally stuck at its initial value — verified in the live DOM. Replaced with a CSS
  keyframe on mount, which also moves the reduced-motion case into a media query with no JS
  branch. **Motion cannot be trusted to animate dash values on these paths.**
- `ai-context-meter`: `formatTokens(1800)` returned `"2k"`. A token count that rounds away
  precision at the low end is a lie; now anything under 10k keeps one decimal.
- `ai-citation`: same static-element-interaction lint as `ai-message` — hover/focus tracking
  on a wrapper. Justified with an ignore, because the anchor inside is the real control and
  works without the wrapper.
- Two test assertions did not account for exit animations keeping elements mounted for a
  frame; wrapped in `waitFor` rather than weakened.

**State**: 156 test files, 498 tests passing, coverage gate green, typecheck clean, zero lint
errors across the AI packages.

**The AI section is now 20 components**, up from 3 at the start: 9 chat, 7 agent, 2 orbs,
plus `ai-core` and the legacy `agent-avatar` / `ai-branch` / `ai-input`.

---

## 7. Reference registry — the durable list

Every reference that has informed this work, with full URLs. **This section is the
source of truth**; earlier slices recorded some of these as bare names, which was
not good enough to work from later.

### Primary component libraries

| Reference | URL | What it covers |
|---|---|---|
| AI Elements (Vercel) | https://elements.ai-sdk.dev | The broadest catalogue — chatbot, code, voice, workflow |
| Beautiful UI (Turbo) | https://beautiful-ui-five.vercel.app | Agent-native primitives, strong on loading and task states |
| AIcss | https://www.aicss.dev | Thinking, tool states, structured outputs |
| prompt-kit | https://www.prompt-kit.com/docs | Chat primitives, source/citation patterns |

### Orb references

| Reference | URL |
|---|---|
| orb-ui | https://github.com/alexanderqchen/orb-ui |
| Thinking orbs | https://orbs.jakubantalik.com |
| Voice Powered Orb | https://21st.dev/@isaiahbjork/components/voice-powered-orb |
| react-ai-orb | https://github.com/Steve0929/react-ai-orb |
| react-3d-ai-assistant | https://www.npmjs.com/package/@ibrahim-org/react-3d-ai-assistant |
| voiceorb | https://github.com/aguscruiz/voiceorb |
| Voice Reactive Orb in React | https://medium.com/@therealmilesjackson/building-a-voice-reactive-orb-in-react-audio-visualization-for-voice-assistants-2bee12797b93 |
| Orb shader with Skia | https://www.animatereactnative.com/post/orb-shader-animation-with-react-native-skia |

---

## 8. Gap analysis against AI Elements

AI Elements ships 46 components across four families. Ours map onto it like this.

### Chatbot — 8 of 18

| Theirs | Ours |
|---|---|
| Conversation | `ai-conversation` |
| Prompt Input | `ai-prompt-input` |
| Message | `ai-message` |
| Reasoning / Chain of Thought | `ai-reasoning` |
| Tool | `ai-tool-call` |
| Sources | `ai-sources` |
| Inline Citation | `ai-citation` |
| Suggestion | `ai-suggestions` |
| Shimmer | partly `ai-loader` |
| Task | `ai-task-list` |
| Confirmation | `ai-approval` |
| **Attachments** | missing — we only have chips inside the composer |
| **Checkpoint** | missing |
| **Context** | missing — retrieved chunks with their sources |
| **Model Selector** | missing — we leave a toolbar slot instead |
| **Plan** | missing |
| **Queue** | missing |

### Code — 2 of 15

We have `ai-artifact` and `ai-diff`. Missing: **Agent, Code Block, Commit,
Environment Variables, File Tree, JSX Preview, Package Info, Sandbox, Schema
Display, Snippet, Stack Trace, Terminal, Test Results, Web Preview**.

### Voice — 0 of 6

Nothing. Missing: **Audio Player, Mic Selector, Persona, Speech Input,
Transcription, Voice Selector**. We do own `useAudioAmplitude`, which is the hard
part of several of these.

### Workflow — 0 of 7

Nothing. Missing: **Canvas, Connection, Controls, Edge, Node, Panel, Toolbar**.

### Not in AI Elements, ours alone

`siri-orb`, `ai-orb-face`, `ai-core` (the shared `AIState` contract), `ai-branch`,
`agent-avatar`, `ai-context-meter`.

**Verdict**: the chat surface is close to complete. Code is barely started, and
Voice and Workflow are untouched — those two are where the catalogue is thinnest
against the references.

---

## 9. Open decisions

1. Scope of first slice — Phase A only, or A + orbs in parallel?
2. Orb tech mix — how many WebGL variants (heavier, more wow) vs CSS/Canvas (cheap, universal)?
3. Do the fancy orbs (C5 liquid) belong in OSS or in SmoothUI Pro?
4. `ai-input` rename: breaking change now, or ship `ai-prompt-input` alongside and deprecate later?
