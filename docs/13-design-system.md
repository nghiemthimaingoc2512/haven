# 13 - Design System

Extends the visual direction in [03-brand.md](03-brand.md): warm, physical, low-light - not pastel-wellness, not sci-fi-assistant.

## Color

Base palette pulls from dusk and hearth tones rather than screen-native gradients. Deliberately restrained - a person in a vulnerable moment should not be visually stimulated.

| Token | Hex | Use |
|---|---|---|
| `haven-ink` | `#211D1A` | Primary text, dark surfaces |
| `haven-paper` | `#F7F2EA` | Primary background (light mode) - warm off-white, not clinical white |
| `haven-dusk` | `#2E3A3F` | Dark-mode background - warm charcoal-teal, not pure black or blue-black |
| `haven-ember` | `#C1723A` | Primary accent - warm clay/amber, used sparingly (mode indicator, active states) |
| `haven-harbor` | `#3E5C58` | Secondary accent - muted deep teal, used for Memory/reflection surfaces |
| `haven-mist` | `#DDD5C7` | Borders, dividers, inactive states - warm neutral, never cold gray |
| `haven-signal` | `#A23B33` | Reserved exclusively for crisis-resource surfacing - the one place the palette is allowed to feel urgent |

Rules:
- No gradients. Gradients read as either "generative AI" (sci-fi register) or "wellness app" (pastel register) - both are things we design against.
- `haven-signal` is used nowhere else in the product. Its rarity is what gives the crisis surface appropriate visual weight without the rest of the app feeling alarming.
- Dark mode is not an inverted light mode - `haven-dusk` is a distinct warm tone, not black, because true black paired with white text has a cold, device-lit quality that works against the brand.

## Typography

- A humanist serif or slab-serif for Haven's own reflections and any narrative surface (Timeline, Reflections archive) - text that's meant to feel *written*, not generated.
- A clean, warm-leaning sans-serif for UI chrome, input, and the person's own typed text - legible, quiet, gets out of the way.
- No monospace anywhere in the core experience - monospace reads as technical/developer-tool, working against "the technology should disappear."
- Generous line height (1.6+) and line length caps (~65ch) - conversation text should read like a page in a book, not a chat app's compressed bubbles.

## Layout and components

- **No chat bubbles.** Bubble UI is the single strongest visual signal of "messaging app," which pulls against the "somewhere to go," not "something you message" positioning ([04-product-positioning.md](04-product-positioning.md)). Instead: flowing, document-like text with subtle speaker distinction (indentation and color, not bubble containers).
- **Minimal iconography.** Icons are used only where a word would be slower to parse (mode switcher, settings). No decorative icons, no mascot, no illustrated character for Haven itself - Haven has a voice, not a face.
- **Generous whitespace and margin.** The interface should never feel dense or task-crowded. Density signals productivity software; Haven is not productivity software.
- **No badges, counters, or red dots**, anywhere, for any reason - this is a direct extension of the no-gamification, no-guilt-mechanics commitment in [02-mission.md](02-mission.md) and [11-product-prd.md](11-product-prd.md).

## Motion

- Transitions are slow relative to typical app conventions (think 300–500ms, eased, not snappy 150ms micro-interactions) - motion should feel unhurried, matching the brand word "Unhurried" from [03-brand.md](03-brand.md).
- Haven's response "thinking" state is a soft, ambient indicator (not a hard three-dot chat ellipsis, not a progress spinner) - it should read as someone composing a thoughtful reply, not a system processing a request.
- No celebratory motion (confetti, bounce, badge-unlock animations) anywhere - there is no achievement layer in this product.

## Accessibility

- Color contrast meets WCAG AA minimum across all text/background pairs in both light and dark mode, verified against the palette above specifically (warm off-whites and warm charcoals can quietly fail contrast if not checked).
- Full functionality available via text alone - voice mode is additive, never required to access any feature, since typing is often easier than speaking for exactly the kind of disclosure this product is for.
