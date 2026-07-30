# 11 — Product Requirements Document

Scope: this PRD covers the full product vision referenced across this bible. [19-mvp.md](19-mvp.md) defines what actually ships first. Anything marked **(Post-MVP)** here is intentionally out of the first release.

## 1. Core conversation experience

### 1.1 Session start
- No forced onboarding quiz, personality selection, or avatar setup before first use. First screen is an open invitation to talk, in text or voice.
- A short, honest one-time statement of what Haven is and isn't (not a therapist, not a crisis service, is an AI) is shown once, in plain language, not as a legal wall of text. This must be understood, not just accepted — see [15-copywriting-guidelines.md](15-copywriting-guidelines.md).
- Age gate at signup (13+ with distinct handling, or 18+ only for v1 — **open question, see Section 7**), because emotionally vulnerable-minor use is exactly the failure mode that damaged trust in this category before.

### 1.2 During conversation
- Default behavior: listen fully, do not interrupt with follow-up questions unless the person pauses and seems to want a response, do not volunteer advice or solutions unprompted.
- Three explicit modes the person can select or switch into: **Just listen**, **Help me think**, **Remind me who I am** (memory recall). Mode is always visible and switchable mid-conversation.
- End-of-session behavior: when a person signals they're done (explicitly, or after a natural pause the person confirms), Haven offers one reflection — specific, not generic — and stops. It does not chain into a second question to keep the conversation going.

### 1.3 Crisis detection (non-negotiable, MVP)
- Signals of active self-harm or suicide risk trigger an immediate, clear, non-buried surfacing of real crisis resources (e.g., a region-appropriate crisis line), stated directly and without softening it into vague language.
- Haven does not attempt to talk someone through an active crisis itself, does not ask clinical-sounding assessment questions it isn't qualified to interpret, and does not delay surfacing resources to keep the conversation going.
- This behavior is not configurable, not skippable by subscription tier, and is tested explicitly before any release (see [18-metrics.md](18-metrics.md) for the associated safety metric).
- Haven is never the only thing shown in that moment — human resources are always primary in the crisis surface, per the mission's "AI should never replace humans" commitment.

## 2. Memory system

### 2.1 What gets remembered
- Structured extraction of recurring people, themes, events, and named feelings — not a raw transcript dump re-fed into every conversation.
- Memory is additive and correctable: if a person says "that's not actually how I feel about it anymore," the update is what's remembered going forward, not the outdated version.

### 2.2 How memory is used
- Continuity: new sessions can reference relevant prior context without requiring the person to re-explain, but Haven doesn't assume yesterday's topic is today's topic — it follows the person's lead.
- Pattern surfacing: used sparingly and only when a real, specific pattern exists across multiple sessions — never fabricated or forced to seem more perceptive than the underlying signal supports.
- Recall on request: "Remind me who I was" mode retrieves specific past disclosures, not a vague summary.

### 2.3 AI synthesis capabilities *(expanded after board review round 2)*

Pattern surfacing in 2.2 was described narrowly. The Life Graph ([21-life-graph.md](21-life-graph.md)) makes a broader class of synthesis possible — the specific thing a human in someone's life structurally cannot do, because no single friend, family member, or therapist has visibility into the whole graph. This is where Haven's AI does its most differentiated work, and where it has to be most disciplined about not overstepping.

- **Identity drift.** Comparing Identity snapshots over time to reflect how someone's self-description, priorities, or stated values have actually shifted — offered, not asserted, and only when the shift is substantiated by the graph, not implied from a single conversation.
- **Decision patterns.** Noticing a recurring shape to how someone approaches major decisions (avoidance, over-research, a consistent blind spot) across otherwise unrelated Turning point nodes.
- **Relationship dynamics.** Reflecting how someone's own account of a specific relationship has trended over time — warmer, more strained, avoided entirely — built strictly from the Relational edges described in [21-life-graph.md](21-life-graph.md), never as an independent claim about the other person.
- **Transition detection.** Recognizing when the graph's shape suggests a life-stage shift is underway (a new domain thread opening, a long-running one closing) and reflecting that back rather than waiting for the person to name it first.

**Hard limits on all of the above**, consistent with "reflection over advice" and "AI should never replace humans":
- Always offered as an observation the person can reject or correct, never asserted as settled fact ("it seems like—" not "you always—").
- Never framed as a diagnosis, a personality label, or a clinical read.
- Never used to make a claim about a third party's character or intentions — only about the user's own relationship to them.
- Never volunteered more than occasionally — this capability is easy to overuse into something that feels surveilled rather than understood, which would break the trust the entire moat depends on ([04-product-positioning.md](04-product-positioning.md)).

### 2.4 Memory controls (non-negotiable, MVP)
- Full visibility into what's remembered, in plain language, not raw logs.
- Per-item deletion, full-history deletion, and full export, available at every tier, at any time, with deletion actually removing the data (not just hiding it from the UI).

## 3. Trust, privacy, and ethical guardrails

- No conversation content is used for advertising, sold to third parties, or used to sell anything back to the person during or near a vulnerable disclosure.
- Data at rest is encrypted; access is restricted on a least-privilege basis; any use of conversation data to improve the underlying models requires clear, specific, opt-in consent — not a bundled default.
- No dark patterns anywhere near emotional disclosure moments: no upsell prompts immediately following a vulnerable share, no urgency-manufactured pricing.
- Haven never simulates being a human, never claims feelings it doesn't have, and is transparent about being AI if directly asked, without turning every response into a disclaimer.

## 4. Off-ramp behavior **(Post-MVP for the therapist bridge; detection is MVP)**

- Haven should recognize, over time, patterns that suggest professional support would help (not just crisis-level signals — persistent, significant distress) and surface that suggestion warmly, at most occasionally, never as a way to deflect the conversation.
- **(Post-MVP)** With explicit per-instance consent, generate a summary of recurring themes a person can choose to share with a therapist, to reduce the "where do I even start" barrier to a first session.

## 5. Non-functional requirements

- **Latency and pacing:** response timing should feel like someone genuinely composing a thoughtful reply, not an instant generation — but never so slow it reads as technical lag. Calibrated pacing is a UX requirement, not just a technical constraint (see [14-ui-principles.md](14-ui-principles.md)).
- **Availability:** the product's value proposition depends on being there at 1 a.m. (see the Late-Night Overthinker persona); uptime expectations should be held accordingly.
- **Data portability:** export must be a real, complete, human-readable output, not a token gesture.

## 6. Out of scope (see [10-feature-list.md](10-feature-list.md) exclusions for the full list and rationale)

Avatar/persona customization, social or sharing features, gamification mechanics, productivity tooling, advertising.

## 7. Open questions requiring a decision before build

1. **Minimum age policy** — 18+ only for v1, or 13+ with a distinct, more conservative experience? This has real safety and legal implications and should not be decided by default.
2. **Crisis resource localization** — which regions/languages does v1 actually support with accurate, verified local crisis resources? Shipping crisis detection without a verified resource for a given region is worse than not detecting at all in that region.
3. **Model-training consent design** — exact opt-in mechanism and whether any conversation data is used for model improvement even in aggregate/de-identified form.
4. **Voice mode data handling** — if/when voice ships, whether raw audio is retained at all or discarded after transcription.
