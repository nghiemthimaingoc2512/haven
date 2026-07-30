# 12 — Information Architecture

## Guiding principle

Most apps optimize IA for discoverability — surface everything, minimize taps to any feature. Haven optimizes for the opposite: **minimize what's between the person and the conversation.** Every layer of navigation is a small tax on someone who's already spent effort just deciding to open the app. The IA below is deliberately shallow.

## Top-level structure

```
Haven
├── Talk (default landing screen)
├── Memory
│   ├── Themes & patterns
│   ├── Timeline
│   └── Manage & export (view / edit / delete / export)
├── Reflections (past end-of-session reflections, chronological)
└── Settings
    ├── Account
    ├── Privacy & data controls
    ├── Crisis resources (always accessible, never buried)
    └── About Haven (what it is / isn't, in plain language)
```

That's the entire primary structure. No tab bar sprawl, no nested feature menus.

## Talk (home)

- Opens directly into a conversation-ready state — no dashboard, no feed, no "today's summary" screen competing for attention before the person can start talking.
- Mode selector (**Just listen / Help me think / Remind me who I am**) is visible but unobtrusive — a single control, not a menu.
- Returning-session context (if relevant) is offered inline, in Haven's own voice, not as a UI card or notification-style banner — continuity is conversational, not administrative.

## Memory

- **Themes & patterns:** the structured, human-readable view of what Haven has noticed over time — not a raw data table. This is where the "pattern surfacing" feature ([10-feature-list.md](10-feature-list.md)) lives when someone wants to browse it deliberately rather than have it surfaced mid-conversation.
- **Timeline:** chronological view of major moments/disclosures, in plain narrative form — closer to a life story than a log.
- **Manage & export:** the non-negotiable control surface from [11-product-prd.md](11-product-prd.md) — view, correct, delete (item-level and full), export. This is never more than one tap from Memory's root, and never gated behind a support request or a "contact us to delete your data" pattern.

## Reflections

- A simple chronological archive of the end-of-session reflections Haven has offered. This is the closest thing to a "journal" surface in the product, but it's populated by Haven's listening, not the person's own writing effort — directly addressing the journaling pain point in [08-pain-points.md](08-pain-points.md).

## Settings

- **Crisis resources** get a permanent, always-visible location independent of whether detection has triggered — a person should be able to find real help without Haven having to notice something first.
- **Privacy & data controls** surface the same deletion/export controls as Memory, because control over one's own data shouldn't only exist in one place in the IA.
- **About Haven** restates, in full and in plain language, the boundaries from the first-use disclosure ([11-product-prd.md](11-product-prd.md) §1.1) — always available to revisit, not a one-time gate.

## What's deliberately absent

No feed, no explore/discover surface, no social graph, no notification center (see [14-ui-principles.md](14-ui-principles.md) for why notifications themselves are constrained), no settings sprawl for customization (no avatars, no themes-as-personalization beyond basic light/dark, no persona selection). Every absent surface here maps to an explicit exclusion in [10-feature-list.md](10-feature-list.md).
