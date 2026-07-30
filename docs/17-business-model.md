# 17 — Business Model

## The constraint we start from

Most consumer AI companion businesses monetize through engagement — more time in app, more messages sent, more dependency, more ad impressions. We ruled that out in the mission ([02-mission.md](02-mission.md)) because it structurally rewards the exact behavior (manufactured dependency) we're positioned against. That constraint shapes everything below — it's not a values statement bolted onto a normal business model, it's the reason the model has to look different.

## Revenue: subscription only

- **Free tier:** full access to the core listening experience and the end-of-session reflection, with a limited weekly conversation allowance and a short memory window (recent context only, no long-term pattern surfacing). Free tier exists to let trust build before asking for payment — this product only earns trust through use, not through a landing page.
- **Haven Plus (paid):** unlimited conversations, full persistent long-term memory, pattern surfacing, "remind me who I was" recall, and (once shipped) voice mode. Priced in the $10–15/month range — positioned well under therapy's per-session cost, and in line with what people already pay for other daily-use subscriptions, not priced like a healthcare service.
- **No ads. No data sale. No usage of conversation content to sell anything back to the person.** This isn't a phase-1 cost-saving compromise to revisit later — it's a permanent constraint from the mission.

## Why the paywall sits where it does

The free tier deliberately includes the actual magic moment (a full, good listening session with reflection) — we do not gate the thing that builds trust. What's gated is **accumulation**: long-term memory, pattern surfacing, and the "remind me who I was" feature only get valuable with time, which is exactly the differentiator described in [04-product-positioning.md](04-product-positioning.md). We are, in effect, charging for the moat, not for access to being heard. Charging for the latter would contradict the mission outright.

## Cost structure and why it's different from a typical chat product

The dominant cost driver isn't a single conversation's inference cost — it's **maintaining and retrieving structured long-term memory** across potentially years of history per person, which is a heavier and more persistent cost profile than a stateless chatbot. We manage this by summarizing and compressing older memory into structured themes rather than replaying full historical transcripts into every session (see [11-product-prd.md](11-product-prd.md) §2) — both a cost control and, not coincidentally, a better experience, since a person doesn't want their whole history re-read to them either.

## Growth: retention and referral, not paid acquisition

Paid acquisition (ads, influencer marketing) sits awkwardly against a brand built on discretion — advertising "I talked to an AI about my mother's death" is not a message people forward. Growth has to come from **retention that's real enough to be worth quietly recommending to one specific person**, not from broad-reach marketing. This means the business's early growth curve will look slower and more organic than an ad-driven competitor's, and that's an accepted tradeoff, not a gap to fix by turning on ads later.

## A channel we considered and are not pursuing, and why

Employer-sponsored/EAP-style B2B2C distribution (the model Wellthy and Cariloop use) is a plausible larger-revenue channel eventually, but we're not building toward it in the first two years. The reason: even with strict guarantees that an employer never sees individual data, people are demonstrably more guarded about emotional disclosure when a tool is provided *by* their employer — the exact opposite of what this product needs to work. If we ever pursue this channel, it has to be architected so the employer relationship is invisible to the person using the product, with no exceptions, which is a harder trust bar than most EAP vendors clear today.

## A revenue idea we rejected on conflict-of-interest grounds

We considered referral fees from therapy platforms when Haven's off-ramp feature ([02-mission.md](02-mission.md), [11-product-prd.md](11-product-prd.md) §4) points someone toward professional help. We're not doing this. Any fee tied to referral outcomes creates a financial incentive that could bend a feature that's supposed to exist purely for the person's benefit — either toward over-referring (churning a subscriber for a kickback) or under-referring (protecting subscription revenue over the person's actual need). The off-ramp only stays trustworthy if it has no revenue attached to it in either direction.
