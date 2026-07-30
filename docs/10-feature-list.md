# 10 — Feature List

Every feature below is traced to a job from [06-jobs-to-be-done.md](06-jobs-to-be-done.md) or a non-negotiable safety principle from [02-mission.md](02-mission.md). If a feature idea can't be traced to one of those, it doesn't belong on this list — see the exclusions at the end.

## Core — listening

- **Uninterrupted listening mode.** Text or voice. Haven does not interject, redirect, or summarize mid-conversation unless asked. The end-of-session reflection is a deliberate, designed beat, not a running commentary. *(Core job)*
- **Reflection over advice.** Haven's default closing move is an accurate, specific reflection of what was said — not a list of suggestions. Advice is available if explicitly asked for, never volunteered first. *(Core job, mirror job)*
- **Modes, chosen by the person, not guessed by the AI.** "Just let me talk," "help me think it through," and "remind me who I am" (memory retrieval) are distinct, explicit modes — because guessing wrong about what someone needs in a vulnerable moment is worse than asking. *(Core job)*

## Core — memory

- **Persistent emotional memory, not just chat history.** Haven extracts and structures recurring people, themes, and feelings across conversations, not just a searchable transcript. *(Re-explaining tax, pattern job)*
- **Continuity opening.** When someone returns, Haven can pick up context without demanding a full re-explanation, without assuming the topic hasn't moved on either. *(Re-explaining tax)*
- **Pattern surfacing.** Periodically (never more than gently), Haven can name a recurring theme across separate conversations the person likely hasn't consciously connected. *(Pattern job)*
- **"Remind me who I was" recall.** On request, Haven can retrieve and narrate specific past disclosures and how they've evolved. *(Proof-of-self job)*

## Core — the living record *(added after board review round 2)*

Haven was originally strongest on bad days — the magic moment in [09-user-journey.md](09-user-journey.md) is a hard night. That's not just a growth gap, it's a **data integrity problem**: if only hard moments get captured, the Life Graph ([21-life-graph.md](21-life-graph.md)) skews toward struggle, and features that depend on it — the proof-of-self job, pattern surfacing — start reflecting a distorted, crisis-heavy version of someone back to them. A person who's mostly been fine gets told, in effect, that they mostly haven't been. That's a correctness failure before it's an engagement one, which is why this is Core, not a growth feature bolted on separately.

- **Keep this.** A deliberate, lightweight gesture for marking a moment worth remembering — a win, a trip, a piece of gratitude, a spark of curiosity — that folds into the Life Graph the same way a hard disclosure does. Fast by design: this is capture, not a conversation someone has to have.
- **Curiosity callbacks.** Rare, opt-in surfacing of something someone mentioned wanting to explore ("you mentioned wanting to try pottery back in March") — a continuity nudge grounded in the person's own stated interest, not a generic "come back" prompt. Same restraint rules as pattern surfacing: infrequent, never framed as a reason to open the app, never guilt-adjacent.
- **No streak, no daily prompt, no "log your day" reminder.** The living record has to stay optional and low-pressure or it becomes exactly the gamified habit-loop the mission rejects ([02-mission.md](02-mission.md)). We're betting people will use this because an accurate self-understanding is worth contributing to, not because the product asked them to.

## Core — trust and safety (non-negotiable, ships with MVP)

- **Crisis detection and human handoff.** Signals of self-harm or acute crisis surface real, region-appropriate crisis resources immediately and clearly; Haven does not attempt to counsel through an active crisis itself. *(Mission commitment)*
- **Full memory control.** View, edit, delete individual memories, or delete everything, at any time, at any subscription tier, with no retention beyond what the person chooses. *(Mission commitment, trust)*
- **Always-available export.** A person's own history is never held hostage to justify a paid tier. *(Mission commitment)*
- **No impersonation of humanity.** Haven never claims or implies it is a person. *(Brand voice, mission)*
- **No push-notification guilt mechanics.** No streaks, no "we miss you," no unread-style pressure. *(Mission commitment)*

## Depth (post-MVP, see [16-roadmap.md](16-roadmap.md))

- **Voice mode**, for people for whom typing is a barrier to actually saying the thing.
- **Therapist bridge.** With explicit, per-instance consent, generate a shareable summary of recurring themes a person can bring to a real therapist — supports the off-ramp principle rather than competing with it.
- **Anniversary reflections.** Once a year (or at a milestone the person defines), Haven offers a long-view reflection like the Stage 6 moment in [09-user-journey.md](09-user-journey.md) — opt-in, never sprung on someone.
- **Life-transition modes.** Grief, breakup, career change — not separate products, but modes that shift Haven's pacing and question style to match, informed by research in [07-user-research.md](07-user-research.md).

## Explicitly excluded (and why)

- **Avatar/persona customization, romantic or roleplay framing** — the single biggest thing we're positioned against ([04-product-positioning.md](04-product-positioning.md)).
- **Social feed, sharing, or any multiplayer surface** — Haven is private by design; a feed would create performance pressure that is the opposite of the product's purpose.
- **Gamification (streaks, badges, levels)** — directly contradicts the mission's refusal of engagement-optimization mechanics.
- **Productivity features (task lists, habit trackers, calendars)** — a different job to be done; scope creep here dilutes the core listening experience.
- **Ads or any monetization of conversation content** — a hard mission commitment, not a phase-1 cost-saving measure to revisit later.
