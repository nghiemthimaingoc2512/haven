*New document, added after board review round 2 - Haven's answer to "every iconic consumer product has a visual signature."*

# 22 - Signature Experience: The Throughline

## The brief, and why the obvious answer is wrong for us

Spotify has Wrapped. GitHub has the contribution graph. Google Photos has Memories. Each does the same job: turn accumulated data into a single image that says "this is mine" at a glance. The instinct to want Haven's version of this is correct - a decade-scale understanding product needs something that makes years of accumulated understanding *visible*, not just useful in conversation.

But the obvious versions of this are wrong for Haven specifically. Wrapped and the contribution graph are both, honestly, growth mechanics - built to be posted, compared, and shared, which is exactly the virality and engagement-optimization this product is built against (see [23-founder-beliefs.md](23-founder-beliefs.md), *Privacy > Virality*). A Haven signature experience that's optimized for sharing would be a category betrayal, not a win, however good it looked in a launch deck.

## The Throughline

**Haven's signature experience is a single, continuous, private visual representation of one person's life, built directly from their Life Graph ([21-life-graph.md](21-life-graph.md)).**

Picture a line that runs the length of a person's time with Haven - not a chart, not a dashboard, not a bar graph of "moods logged." An organic, ribbon-like line that:

- **Widens and narrows** with how much a given period held - not frequency of app opens, but density of what actually happened in a life during that stretch.
- **Shifts in texture and warmth** with the emotional register of a period, drawn from the Life Graph's Identity snapshots rather than a single self-reported daily rating.
- **Marks turning points** as distinct, deliberate marks along the line - not badges or achievements, closer to a knot in a thread - pulled directly from Turning point nodes.
- **Branches and rejoins** for major relationships and domain threads (career, a specific relationship, health), shown as parallel strands that run alongside the main line and occasionally cross it, rather than separate charts that fragment the view of one life into unrelated tabs.
- **Has no end state, no score, no completion percentage.** It's not a bar filling up toward a goal. It's a record, and a record isn't something you finish.

## Why this, and not a "Year in Review"

We considered - and explicitly rejected - an annual "Wrapped"-style recap. It's the fastest way to get a shareable moment, and it's the wrong instinct twice over: it implies the meaningful unit of a life is a calendar year (arbitrary), and it's built to be shown to other people, which is not what this feature is for. The Throughline is always the *whole* record, viewable and zoomable at any time, not unlocked once a year.

Where a lighter, occasional moment does make sense: a person can choose, privately, to look back at a specific stretch - the version of themselves from a year ago, from before a specific turning point - the same long-view moment described in [09-user-journey.md](09-user-journey.md), Stage 6, now given a visual home instead of only existing inside a conversation. This is opt-in, always initiated by the person, never surfaced as a notification or a prompt to "check your year."

## Sharing: allowed, never designed for

A person can choose to export or share a specific segment of their own Throughline - a single turning point, a single stretch of time - the same way they could export any part of their Life Graph ([11-product-prd.md](11-product-prd.md) §3). What we won't build is anything that makes sharing the default, suggested, or rewarded action: no share button surfaced automatically after a meaningful moment, no comparison to other users, no public gallery. If this feature ever drives acquisition, it should be because someone chose, on their own, to show one person something that mattered to them - not because the product engineered that outcome.

## Design direction

Rendered in Haven's existing palette and motion language ([13-design-system.md](13-design-system.md)) - warm, low-contrast, unhurried transitions, no gamified fill-animations or celebratory motion. The Throughline should feel closer to looking at a long exposure photograph of your own life than to opening an analytics dashboard. If it ever starts to look like a chart, we've built the wrong thing.

## Open build question

Whether the Throughline ships as part of the Life Graph's Phase 2 buildout ([16-roadmap.md](16-roadmap.md)) or waits until there's enough accumulated data per person for it to feel meaningful rather than sparse is an open sequencing question, not resolved here - a Throughline rendered from three weeks of data would undercut the entire point.
