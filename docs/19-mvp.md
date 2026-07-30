# 19 — MVP

## What "minimum" means here

Minimum does not mean minimum-safe. The trust and safety requirements in this MVP are the same ones specified for full product ([11-product-prd.md](11-product-prd.md)) — crisis detection, memory controls, and no-guilt-mechanics are not phased in later. What's minimal is scope of *capability*, not scope of *care*.

## In scope for MVP (Phase 1, [16-roadmap.md](16-roadmap.md))

**Conversation**
- Text-based conversation only (voice is Phase 3).
- Two modes at launch: **Just listen** and **Help me think**. "Remind me who I am" is deferred — it needs real long-term memory to be worth shipping, which is Phase 2.
- End-of-session reflection ritual, per [14-ui-principles.md](14-ui-principles.md) §4.

**Memory**
- Recent-window memory only: Haven remembers within and across sessions for a limited recent period (weeks, not the full long-term architecture from [11-product-prd.md](11-product-prd.md) §2), sufficient to solve the re-explaining tax without yet delivering multi-month pattern surfacing.
- No pattern surfacing at MVP — surfacing a "pattern" from a shallow memory window risks being wrong or premature, which would break trust exactly at the moment we're trying to build it.

**Safety and trust (full scope, not reduced)**
- Crisis detection and handoff, tested and reviewed before any user has access.
- Full memory view, edit, delete (item-level and total), and export.
- The plain-language "what Haven is / isn't" statement at first use.
- No push notifications of any kind that reference absence or streaks.

**Access model**
- Small, invitation-based closed beta — not a public launch. Small enough that the team can review a meaningful sample of conversations by hand for safety failures, tone drift, and moments where reflection felt off, rather than relying solely on aggregate metrics that wouldn't yet have enough volume to be reliable.
- No monetization during MVP. Introducing payment before the long-term memory differentiator exists (Phase 2) would mean charging for something close to a slower, quieter chatbot — undermining the exact positioning this product depends on ([17-business-model.md](17-business-model.md)).

## Explicitly out of scope for MVP

Voice mode, pattern surfacing, "remind me who I am" recall, therapist bridge, anniversary reflections, public launch, any monetization. All are sequenced in [16-roadmap.md](16-roadmap.md) and depend on things the MVP is specifically designed to learn first.

## Exit criteria — what has to be true before Phase 2

1. The magic moment (reflection landing as genuine understanding, not generic or uncanny) holds up across a real beta population, not just the Phase 0 prototype testers.
2. Zero unreviewed crisis-detection failures — every triggered case and every plausible missed case has been manually reviewed.
3. Meaningful Return Rate ([18-metrics.md](18-metrics.md)) among beta users is trending in a direction that suggests people are coming back because they want to, not because the beta is small and socially reinforced by knowing they were hand-picked.
4. At least a working directional read on Felt Understood Rate across enough sessions to trust it as a signal, not a fluke.

If (1) or (2) isn't true, Phase 2 does not start on schedule — the roadmap is explicitly gated on these, not on a calendar date.
