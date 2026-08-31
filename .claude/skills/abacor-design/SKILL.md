---
name: abacor-design
description: Abacor's production design system, extracted from the real Figma files. Use for ANY Abacor design or build work — product screens, settings, billing, onboarding, dashboards, tables, modals, empty states, marketing pages, decks, prototypes, HTML or React artifacts, and motion graphics. Contains measured colour, typography, spacing, radius, elevation, component and copy rules. Never substitute Tailwind defaults, shadcn, or generic SaaS styling.
---

# Abacor design

Everything here is measured from the production Figma files, not invented.
Sources: `AjmRPZrbKCFmurjDLH2AGy` (Settings, Billing, Email) and
`SnA0v79gLG3VSISdCvRO7l` (Opportunities, Usage).

## The one rule

**No value that is not in `references/tokens.css` belongs in Abacor work.**
No Tailwind palette, no shadcn defaults, no `#f8fafc`, no `slate-500`, no
`shadow-lg`, no Inter. If you need something the tokens do not cover, that is a
design system gap worth raising, not a licence to improvise.

## Read before building

| File | When |
|---|---|
| `references/tokens.css` | Always. Import it once, reference `var(--*)` everywhere. |
| `references/foundations.md` | Always. Type, colour, spacing and elevation logic. |
| `references/components.md` | Building any UI element. |
| `references/patterns.md` | Building a whole screen, page or flow. |
| `references/voice.md` | Writing any user-facing copy. |
| `references/motion.md` | Animation, transitions, or a Remotion video. |

## What Abacor looks like, in four sentences

It is a dense, quiet, information-first product for accountants. One ink colour
at varying alpha does all the greys, so the interface reads as paper rather than
chrome. Orange appears once per view, on the thing you are meant to do next.
Nothing is decorative: every card, tag and meter is carrying a fact someone needs.

## The five mistakes that break it

1. **A second grey.** There is one ink, `#1A1A1A`, at varying alpha. Introducing
   a cool grey or a warm grey makes it look like a different product instantly.
2. **Orange everywhere.** One orange element per view. Two and neither reads.
3. **Kraftig rendered as bold.** Sohne Kraftig is a *medium*, weight 500. At 700
   every label looks shouty and wrong.
4. **Off-grid spacing.** Multiples of 4 only. A 10px or 15px gap is a bug.
5. **Filled buttons inside tinted strips.** A status strip gets a quiet outlined
   control, never a solid primary. Two fills fighting looks muddy.

## Quality gate

Before calling any Abacor design done:

- [ ] Every colour traces to a token, no hex literals in component code
- [ ] Only Sohne Buch (400) and Sohne Kraftig (500) appear
- [ ] All padding, gaps and margins are multiples of 4
- [ ] Exactly one orange element competes for attention per view
- [ ] No text wraps leaving a one or two word orphan
- [ ] Interactive elements are 36px tall; tags and inline pills are 22 or less
- [ ] Cards use the matte inset (3% shell, 4px gap, white panel) not a flat fill
- [ ] Copy follows `voice.md`: plain, short, no em dashes, no marketing verbs
