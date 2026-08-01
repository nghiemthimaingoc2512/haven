*New document, added after board review round 2 - answers "what actually compounds" behind [04-product-positioning.md](04-product-positioning.md)'s moat section and grounds the AI capabilities in [11-product-prd.md](11-product-prd.md).*

# 21 - The Life Graph

## What this is, and isn't

The Life Graph is the underlying model Haven builds of a person's life - not a transcript archive, not a CRM, not a set of tags a person fills in. It's the structure that turns "things someone said" into "an understanding of who they are." Conversation is the current input method (see [01-vision.md](01-vision.md) - that will not always be true); the Life Graph is what survives underneath, regardless of input method.

Two things this is explicitly not, because both are easy default shapes to slide into:

- **Not a CRM.** A CRM stores facts about a person as if they're objectively true and complete. The Life Graph stores *this person's own account* of their life - interpretive and evolving, not a database of verified facts.
- **Not a form.** Nothing here is built by a person filling in fields ("add a value," "tag a relationship"). Every node and edge is inferred from what someone actually says over time, the same way a good listener builds a mental model of someone without ever handing them a questionnaire. A Life Graph built from a form would just be a more elaborate profile page - the opposite of the point.

## Structure

**Node types**

| Node | What it holds |
|---|---|
| **Identity snapshot** | How someone has described themselves at a given point in time - not a fixed profile, a dated one, so drift is visible rather than overwritten. |
| **Person** | Someone in the user's life - held strictly as *the user's account of that relationship*, never as an independent model of who that other person "really" is (see Governance below). |
| **Value / belief** | Something someone has expressed matters to them, with the specific moments that revealed it. |
| **Turning point** | An event marked by a before/after shift - a loss, a decision, a change - linked to what came before and what changed after. |
| **Pattern** | Derived, not stated directly - a recurring theme, loop, or behavior surfaced across multiple otherwise-unconnected moments. Patterns are always computed views, never manually declared, so they stay falsifiable rather than becoming assumed fact. |
| **Domain thread** | Ongoing areas of a life with their own continuity - career, health (self-reported only), a specific relationship, a place - each with its own timeline inside the larger one. |

**Edge types**

- **Temporal** - before/after, establishing the timeline a Throughline (see [22-signature-experience.md](22-signature-experience.md)) is rendered from.
- **Narrative** - "contributed to," linking a turning point to what it changed.
- **Relational** - connects Person nodes to the user with role, history, and valence over time, not a static label like "friend" or "partner."
- **Alignment** - connects a decision or turning point to a stated value, marking consistency or tension, never a verdict.
- **Thematic** - the edges that let a Pattern node exist at all, linking moments across time and domain that share an underlying shape.

## How it's built

Every node and edge originates from something the person actually said or did - never inferred from outside data, never purchased, never scraped. Extraction happens quietly, after the fact, from the same conversations the person is already having for their own reasons - it is not a separate task Haven asks someone to do. The graph gets more accurate with time and correction, not with more data volume for its own sake; a year of accurate, corrected structure is worth more than five years of raw, uncorrected transcript.

## Governance

- **Correction beats deletion as the primary control.** "That's not who I am anymore" should update the graph going forward while preserving the historical snapshot that made the change visible - deleting it would erase the exact evidence of growth the product exists to show back to someone (see [09-user-journey.md](09-user-journey.md), Stage 6). Full deletion remains available and absolute when someone wants it - see [11-product-prd.md](11-product-prd.md) §3.
- **Node-level control, not just account-level.** A person can view, correct, or delete individual nodes - a specific memory, a specific person, a specific pattern - not only their entire history at once.
- **Third-party nodes are the sharpest governance question here, and we don't have a fully settled answer.** A Person node about someone's partner, parent, or friend is built from the user's account alone, is never treated as an independent, objective model of that third party, and is never exposed to anyone but the user. But the underlying tension is real: Haven ends up holding a structured, evolving model of people who never consented to being modeled at all. Our current stance is to keep these nodes strictly relational (how the user experiences this person, not who this person "is") and minimal (no attempt to build out a third party's own identity, values, or turning points independent of the user's relationship to them). Whether that stance is sufficient is tracked as an open ethical question in [24-founder-questions.md](24-founder-questions.md), not resolved by this document.

## Why this is the moat, not a feature

The Life Graph is what [04-product-positioning.md](04-product-positioning.md) means by "understanding, not memory." A transcript is portable - exportable in an afternoon. A Life Graph's *structure and accuracy* are not shortcuts a competitor can buy, because they only exist as a byproduct of years of a specific, trusted relationship. This document is the specification a competitor would need to actually replicate - and the reason, laid out plainly, that doing so takes years, not an engineering sprint.
