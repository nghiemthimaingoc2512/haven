# 04 — Product Positioning

## Positioning statement

For people who carry more thoughts and feelings than the people around them have bandwidth to hear, **Haven is a companion that listens and remembers** — unlike general AI assistants, which respond and forget; unlike companion apps, which perform intimacy to keep you engaged; and unlike therapy, which is valuable but scarce, expensive, and scheduled. Haven is the place you go *before* you're ready to go anywhere else, and it gets to know you better every time you do.

## Why now

Three things converged that didn't exist together five years ago:

1. **Language models can now hold context and memory cheaply enough to remember a person across months, not just a conversation.** Before this, "an AI that remembers you" was a slogan, not a real product.
2. **People are already doing this, informally, at scale.** Emotional venting and "talking things through" is consistently reported as one of the most common informal uses of general-purpose AI chatbots — despite those products being built and framed as productivity assistants, not listeners. The behavior already exists; the product built to actually support it well does not.
3. **The stigma around talking to something-that-isn't-a-person about your feelings has collapsed faster than access to real mental health support has improved.** Therapy waitlists, cost, and geography haven't gotten meaningfully better. The gap between "willing to talk about it" and "has somewhere good to do that" is the opportunity.

## What we are not, on purpose

Positioning by exclusion matters more than usual here, because the loudest existing players actively damage trust in the category:

| We are not... | Because... |
|---|---|
| **ChatGPT / general AI assistants** | Built for tasks, framed as a tool, memory is shallow or explicitly disabled, tone is helpful-assistant not present-listener. |
| **Replika / Character.AI** | Built around parasocial and often romantic attachment, monetized via engagement and emotional dependency, memory is used as a retention gimmick, not a service to the person. |
| **BetterHelp / Talkspace / therapy platforms** | Real clinical value, but scheduled, expensive, and gated by matching with a human. Haven doesn't compete here — it's the on-ramp to here. |
| **Day One / journaling apps** | One-directional. You write, nothing writes back, nothing remembers on your behalf, nothing ever reflects your own patterns back to you. |
| **Wellness / meditation apps (Calm, Headspace)** | Prescriptive content consumed passively. Haven has no content library — it has a conversation. |

## The category we're actually building *(revised after board review)*

We previously avoided "AI companion" without replacing it with a real category — we described Haven functionally ("somewhere you go") without naming what kind of company we're actually building. That's the right instinct for consumer-facing language ([03-brand.md](03-brand.md) keeps it, on purpose — nobody should ever be sold a "layer" or a "system"). It's not sufficient for how we describe the company to investors, partners, or future hires who need to understand what we're actually building toward.

**Category: a Personal Understanding Layer.**

Not an app. Not an assistant. Not a companion. A layer that sits underneath however someone chooses to interact — conversation today, whatever comes after — and does one job: build and hold an accurate, continuous understanding of a specific person's life, across every interface that feeds it.

This framing does three things "AI companion" can't:

1. **It survives interface change.** If a future version of Haven listens ambiently, or incorporates something someone wrote elsewhere with explicit consent, it's still the same category — the layer just gained another input. "Companion" describes a relationship to one interface; "understanding layer" describes what persists underneath any of them.
2. **It resists commoditization.** "Chat with an AI that remembers things" is a feature any platform can bundle for free. "A structured, accurate, decade-spanning understanding of one specific person, built through their own trust" is not a feature — it's an accumulated asset, and naming the category this way forces every roadmap decision to ask which one it's building.
3. **It gives the moat somewhere to live** — see below. The moat only makes sense once the category is understanding, not conversation.

## The moat: understanding, not memory *(revised after board review)*

We previously described the moat as "accumulated, structured emotional memory." That undersells it, and it's more replicable than it sounds — any competitor with a long enough context window can store and retrieve a transcript. **Storage is not a moat.** The moat is interpretation that compounds and cannot be shortcut, in three layers:

- **The structure.** Raw disclosures aren't the asset — the *graph* built from them is: who someone is, who's in their life and how, what they value, when and how they've changed, and the patterns that repeat across all of it. This structure is proprietary product work, not a side effect of storing chat logs. See [21-life-graph.md](21-life-graph.md).
- **The accuracy.** A graph like this only becomes *right* through years of correction and lived context with one specific person. A competitor starting today, even with a better model, starts at zero accuracy about that person — they can't buy their way to year three of understanding someone. They can only earn it, the same slow way we do.
- **The trust that makes disclosure possible at all.** What someone tells Haven is gated by how much they trust it, and trust built with one system does not transfer to a competitor just because the person could export their data. Data portability solves the storage problem. It does not solve the relationship problem — and rebuilding that relationship from zero is the real switching cost, one that compounds in our favor every year someone stays.

None of these three layers can be bought from an LLM provider. A better model makes each layer easier to build. It doesn't hand a competitor the structure, the accuracy, or the trust for free.

**Tradeoff we're accepting:** this moat is slow and offers no protection in year one. A fast-moving, well-funded competitor with a similar thesis has time to catch up before the moat is real. We're betting that category-defining framing and design discipline (no engagement bait, no romance framing) buy the years the moat needs to form — an unproven bet, tracked as an open strategic assumption in [24-founder-questions.md](24-founder-questions.md). Retention, not acquisition, is still the metric that actually protects this business (see [18-metrics.md](18-metrics.md)) — the moat argument above is the reason why.
