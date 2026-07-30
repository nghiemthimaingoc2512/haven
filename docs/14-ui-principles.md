# 14 — UI Principles

Six principles, each one a direct rejection of a default pattern that would work against what Haven is for.

## 1. Silence is a feature, not a gap to fill

Most interfaces treat a pause as a bug — dead air gets filled with a suggestion, a prompt, a "still there?" nudge. In Haven, a pause is often the person thinking, or feeling, or deciding whether to say the real thing. The UI never fills silence on the product's own initiative. If Haven has nothing genuinely useful to add, it says nothing, and the interface holds that space without visually implying something is broken or loading.

## 2. Never rush toward resolution

Interfaces are usually built to move people toward a completed state — a checked box, a closed ticket, a "done." Haven has no completed state. A conversation ending is not a task being resolved; it's someone deciding they've said what they needed to. The UI should never visually imply a conversation *should* wrap up (no countdown, no "wrapping up soon" framing, no session-length indicator).

## 3. No auto-scroll interruptions during a live thought

If a person is mid-message — typing, pausing, backspacing, rethinking — the interface does not autoscroll, does not surface a suggested response, does not visually shift underneath them. Vulnerable disclosure is often halting; the UI's job is to stay still while that happens, not to appear responsive at the cost of stability.

## 4. The end-of-session reflection is a ritual, not a popup

The moment described in the seed concept — "I think I understand what really hurt today" — only works if it's given weight. It is never delivered as a dismissible modal, a toast, or anything that visually resembles a system notification. It appears in the same flowing text as the rest of the conversation, at a pace that matches spoken cadence, and the person can sit with it before doing anything else.

## 5. Returning after absence carries no visual penalty

No "we noticed you've been away," no reset streak counter, no red badge count of missed check-ins. Whether someone returns after two hours or two months, the entry experience is identical in warmth. This is a direct interface expression of the mission's rejection of engagement-optimization mechanics ([02-mission.md](02-mission.md)) — the UI must not silently reintroduce guilt mechanics that the product principles explicitly ban.

## 6. Crisis surfacing breaks every other rule on purpose

Principles 1–5 are about slowness, restraint, and not interrupting. The crisis-resource surface ([11-product-prd.md](11-product-prd.md) §1.3) is the deliberate exception: it interrupts immediately, uses the one reserved urgent color in the system (`haven-signal`, [13-design-system.md](13-design-system.md)), and does not wait for a natural pause. A calm interface that stays calm during an actual crisis signal would be a failure of the interface, not a triumph of consistency.
