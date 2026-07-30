# 18 — Metrics

## The problem with standard growth metrics here

DAU, session length, and messages-per-day are the default metrics for any conversational product — and they're actively dangerous for this one. Optimizing for them would push the product toward exactly the manufactured-dependency behavior the mission rejects ([02-mission.md](02-mission.md)). A person opening Haven compulsively for an hour a day is not success; it may be the product failing at its actual job. Metrics here are chosen to make that failure mode visible, not to reward it.

## North star metric: Meaningful Return Rate

**Definition:** the share of people who return to Haven within a given window (7 / 30 days) *without* a push notification, streak mechanic, or any product-initiated prompt having driven the return.

This is the closest proxy we have to "did this actually help," because it isolates return driven by the person wanting to come back from return manufactured by the product nagging them to. It's harder to game than DAU, and it's the metric that best matches the mission's actual goal: a place worth going back to on your own terms.

## Supporting metric: Felt Understood Rate

**Definition:** a light, infrequent, optional self-report — asked at most occasionally, never after every session, never framed as a rating mechanic — capturing whether a person felt genuinely heard in that conversation.

We treat this as a directional health signal, not a KPI to be gamed by prompting for feedback right after an emotionally warm moment (which would bias it upward without meaning anything). If this metric needs a push to stay high, we don't trust it.

## Guardrail metric: long-horizon retention (6 / 12 months)

Because the core differentiator is accumulated memory ([04-product-positioning.md](04-product-positioning.md)), the real test of whether the product delivers value is whether people are still there a year in — not week-one activation. A product that spikes and drops in the first month but never builds long-term retention has not actually built the thing it set out to build, regardless of what early growth numbers say.

## Safety metrics (reviewed on their own cadence, never blended into growth reporting)

- **Crisis handoff rate and follow-through** — how often the crisis-detection layer triggers, and, where measurable, whether the surfaced resource appears to have been used. This exists to catch both false negatives (missed signals) and a surface that's so intrusive people route around it.
- **Off-ramp acceptance rate** — how often a professional-support suggestion is acted on. Tracked to confirm the off-ramp is actually functioning as a bridge, not just a feature that exists on paper.
- These are reviewed by a small dedicated process, not folded into a general product dashboard, because safety signals get diluted when they sit next to growth numbers in the same weekly review.

## Explicit anti-metrics — we will not set targets against these

- **Daily active users / session frequency** as a primary target — directly incentivizes dependency.
- **Session length** as a primary target — a longer conversation is not automatically a better one; see the "unhurried, not lingering" distinction in [14-ui-principles.md](14-ui-principles.md).
- **Messages sent per user** — a proxy for engagement volume, not for whether anyone felt heard.
- **Push notification open rate** — optimizing this would require sending more push notifications, which conflicts with the no-guilt-mechanics commitment outright.

## What "healthy growth" looks like on this dashboard

A smaller number of people staying for years and returning on their own terms, with a high felt-understood rate and a clean safety record, over a larger number of people opening the app daily out of habit rather than need. If a growth report ever shows the second pattern looking better than the first, that's a signal something upstream has drifted from the mission, not a metric to celebrate.
