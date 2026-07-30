*New document, added after board review round 2. These are not the PRD's spec-level open questions ([11-product-prd.md](11-product-prd.md) §7, still open) or the earlier design review's risk list — this is the founding team deliberately challenging its own assumptions before more of the company gets built on top of them. Nothing here has an answer yet. That's the point.*

# 24 — Founder Questions

## Strategic assumptions

1. **Is "Personal Understanding Layer" defensible if a platform owner decides to build it natively?** Apple, Google, or Meta could plausibly ship an on-device memory layer as a feature of the phone itself. We're betting trust and specificity beat platform distribution — that's unproven, and platform risk is existential in a way most of this bible doesn't currently address.
2. **Does understanding actually compound indefinitely, or does it plateau?** If a Life Graph becomes "complete enough" after a few years, the moat's core claim — that value keeps compounding — weakens exactly when a person has been retained long enough to matter most to the business.
3. **Is the moat a genuine structural advantage, or a multi-year head start that erodes once the category is proven?** A well-funded fast-follower could offer "import your ChatGPT history, we'll build your Life Graph instantly" and meaningfully shortcut the trust-building we're counting on as a barrier. We haven't stress-tested whether that shortcut actually works from the user's side.

## User assumptions

4. **Will people actually want an accurate mirror when it's unflattering, or will "Accuracy > Comfort" ([23-founder-beliefs.md](23-founder-beliefs.md)) just produce churn?** It's easy to say we value truth over comfort in a strategy document. We don't know yet whether real users forgive an uncomfortable reflection the way we're assuming they will.
5. **Will good-day usage actually happen without any of the mechanics that normally drive that behavior?** We removed streaks, reminders, and prompts on principle ([10-feature-list.md](10-feature-list.md)) and are betting people will use the living record anyway. That's a real behavioral bet, not a validated one.
6. **Are people comfortable with Haven modeling other people in their life who never consented?** The relationship-graph governance in [21-life-graph.md](21-life-graph.md) is our best current answer, not a tested one — it's plausible that even a strictly relational, user's-perspective-only model still feels invasive to someone once they understand what's being held about the people around them.

## AI assumptions

7. **Can current or near-future models sustain a coherent, non-hallucinated Life Graph across years without confidently-wrong "patterns" quietly accumulating and eroding trust?** This is an open technical question, not just a policy one — the hard limits in [11-product-prd.md](11-product-prd.md) §2.3 constrain how synthesis is *presented*, but don't guarantee the underlying synthesis stays accurate at multi-year timescales.
8. **Is long-term synthesis actually differentiated, or just differentiated in pitch decks?** A sufficiently good human listener, asking good questions over years, might produce comparably useful reflection without any of this architecture. We should be honest that we believe the AI does something structurally different — visibility across a whole graph no single human has — but we haven't proven that belief changes outcomes for the person, only that it's a more defensible technical story.

## Business assumptions

9. **Do the unit economics actually work?** The business model explicitly notes that memory-maintenance cost rises with retention success ([17-business-model.md](17-business-model.md)) — we have not modeled whether subscription pricing at $10–15/month covers that cost at the depth of graph we're describing in [21-life-graph.md](21-life-graph.md), especially once synthesis (2.3) runs continuously rather than on-demand.
10. **Is "retention and quiet referral, not paid acquisition" actually a fundable growth story?** It's the right call for the mission. It's also a harder pitch than a viral growth loop, and we haven't pressure-tested it against what a raise actually requires.

## Ethical assumptions

11. **Is it actually ethical to hold detailed, structured models of third parties who never agreed to it, even with the constraints in [21-life-graph.md](21-life-graph.md)?** "The user consented for themselves" doesn't fully resolve this — the third party is the one being modeled, and they have no visibility, no correction rights, and no say. We've written a policy. We have not resolved whether the policy is sufficient.
12. **Does careful language actually prevent an AI's reflection from being experienced as authoritative?** We've deliberately avoided therapy-speak and diagnostic framing throughout ([15-copywriting-guidelines.md](15-copywriting-guidelines.md)). Framing risk and psychological risk are not the same thing — a person in a vulnerable state may treat "it seems like—" as fact regardless of how carefully it's hedged, and we don't yet know how often that happens.

## What this document is for

Every one of these needs a real answer — through research, prototyping, or a founder decision — before the parts of the roadmap that depend on it get built at scale. This list should get shorter over time, with answers linked back into the relevant document, not longer. If it only grows, that's a sign we're building faster than we're actually learning.
