# 07 — User Research

Haven doesn't exist yet, so this document does two things honestly: it separates what we're grounding our assumptions in from what we still need to go verify, and it sets the research plan for the next phase. Nothing in this file is a fabricated user quote or a study we haven't actually run — where we cite outside evidence it's general, well-documented trends; where it's our own belief, it's marked as a hypothesis to be tested.

## What we're grounding our assumptions in (secondary evidence)

- **Loneliness and disconnection are widely documented as a growing public health concern**, independent of any AI product — the U.S. Surgeon General issued a specific advisory on loneliness and isolation in 2023. This supports the premise that "not having someone to talk to" is a real, large, non-niche condition, not a fringe problem we're inventing a solution for.
- **People already use general-purpose AI chatbots informally for emotional venting and talking things through**, despite those products not being designed or marketed for it. This is widely reported across surveys of chatbot usage since 2023. It tells us the behavior exists at scale already — we are not trying to create a new behavior, we're trying to serve an existing one properly.
- **Existing AI companion apps (Replika, Character.AI) have real, large, engaged user bases**, which proves demand for ongoing AI relationships exists — but both have also drawn sustained criticism (including regulatory and legal scrutiny) over dependency, romantic/roleplay framing with minors, and engagement-optimized design. This tells us the *demand* is validated but the *current execution* is something a meaningful segment of people would want an alternative to.
- **Cost and access remain real barriers to therapy** — waitlists and per-session pricing have not meaningfully improved even as stigma around seeking help has decreased. This is the gap Haven sits in, not a replacement for the therapy system but a companion to it.

## What's still a hypothesis, not evidence

We're being explicit about this so the product bible doesn't quietly launder assumptions into facts:

1. That people will trust an AI enough with genuinely vulnerable material *without* romantic/roleplay framing to hook them — Replika's growth suggests the roleplay framing works commercially; we're betting a non-romantic, memory-first framing can also work, which is unproven.
2. That "better memory" is actually the differentiator people care about, versus just wanting a more emotionally intelligent single conversation.
3. That a subscription model (no ads, no engagement-optimization) is commercially viable in a category whose most successful players monetize via engagement.
4. That people will actually follow through on off-ramps to real humans/therapists when Haven surfaces them, rather than Haven inadvertently becoming a substitute despite our intentions.

## Research plan (pre-MVP and ongoing)

**Phase 1 — Problem validation (20–30 interviews, before writing product code beyond prototypes)**
Screen for: adults who have, in the last month, had a feeling or event they wanted to talk about but didn't tell anyone. Ask about what they did instead (nothing / journaled / texted a friend / used ChatGPT), why, and how it felt afterward. We are listening for the *specific moment of friction* — not "would you use an AI companion," which is a leading and unreliable question.

**Phase 2 — Concept reaction (10–15 sessions, after Phase 1 synthesis)**
Show the magic-moment concept (long uninterrupted listen → accurate reflection, not advice) without mentioning "AI companion" as a category. Watch specifically for the trust/uncanny reaction — does an accurate reflection feel moving or unsettling? This is the single biggest product risk and needs to be tested before it's built, not after.

**Phase 3 — Prototype testing (dogfood + 20-person closed beta, tied to MVP in [19-mvp.md](19-mvp.md))**
Track, per session: did the person feel understood (self-reported, asked once, gently, never turned into a rating mechanic); did they come back voluntarily within 7 days without a push notification prompting them; did anything in the conversation trip the crisis-detection layer, and if so, did the handoff feel respectful or clinical.

## Standing rule

Any claim in this product bible that starts sounding like a market-research fact (percentages, market size, adoption curves) and isn't sourced to something we actually verified should be flagged and corrected, not left to imply false confidence. We would rather say "we believe" than dress up a guess as data.
