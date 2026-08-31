# Foundations

Tokens tell you what the values are. This tells you when to use which.

---

## Colour

### One ink, many alphas

`#1A1A1A` is the only grey. Everything muted is that ink at reduced opacity.
This is why the product reads like paper rather than a dashboard.

| Alpha | Use |
|---|---|
| 100% | Primary text, values, active labels |
| 70% | Body text on tinted backgrounds |
| 60% | Secondary text, descriptions |
| 55% | Helper text, sublines |
| 45% | Section labels, timestamps, placeholder |
| 12% | Strong borders on interactive elements |
| 08% | Hairlines, card borders, dividers |
| 06% | Tag backgrounds, active nav rows |
| 04% | Hover fills, selected menu rows |
| 03% | The matte card shell |

Never `#666`, never `slate-400`, never a cool or warm grey.

### Orange is a budget, not a palette

One orange element per view. It marks **the single next action**, an **active
state**, or a **live meter**. Everything else stays neutral.

Things that are *not* orange even though they might seem to warrant it: applied
filter buttons, status strips, secondary actions, links inside body text,
section headers, icons that aren't in a primary button.

When something already tinted orange needs a control inside it, that control
goes **white and outlined**. Two oranges fighting looks muddy.

### Semantic colour

- **Green `#00AC47`** means synced, connected, done. Never decorative.
- **Red `#FF2E2E`** appears only on a meter at or near capacity, and on a
  failed-payment state. It is not a general error colour.
- **Purple `#7763DD`** is user avatars only.

---

## Typography

Sohne, two weights, no exceptions.

- **Buch (400)** for body, descriptions, placeholders, counts, most labels.
- **Kraftig (500)** for names, values, buttons, titles, tags, active states.

Kraftig is a **medium**. Setting it to 700 makes every label shout.

### Ramp in practice

| Size | Weight | Use |
|---|---|---|
| 26–28 | Kraftig | Stat figures. Tracking -2%. The figure must dominate its label. |
| 24 | Kraftig | Page title |
| 20 | Kraftig | Modal body title |
| 15–18 | Kraftig | Card and section headings |
| 14 | Buch / Kraftig | Everything. Body is Buch, names and buttons are Kraftig. |
| 13 | Buch | Secondary body inside dense panels |
| 12 | Buch / Kraftig | Meta, counts, footer helper, sublines |
| 11 | Buch | UPPERCASE section labels, 4% tracking, ink-45 |
| 10 | Kraftig | Tags and pills |

Line height 135% by default, 120% on large headings.

### Orphans

Never let a paragraph wrap leaving one or two words alone on the last line.
Either shorten the copy or break the line deliberately at the sentence boundary.
Centred text must always break where the meaning breaks, never on width.

---

## Spacing

**Multiples of 4 only.** 10px exists in one place, horizontal padding on inputs.
Everything else is 4, 8, 12, 16, 20, 24, 32.

### Vertical rhythm inside a panel

```
20px   after a header block
12px   between sibling cards
20px   before a footer bar
16px   panel padding on all sides
```

A header separates from content by more than content separates from itself.
That is what makes a stack read as structured rather than evenly spread.

### Control heights

Every button, input and dropdown is **36px**. Nav rows are **32px**. Tags and
inline pills are **22px or less**. Mixing heights in a toolbar is the fastest way
to make it look unfinished.

---

## Elevation

Two shadows do almost everything.

- `--shadow-control` on buttons, inputs, dropdowns, small surfaces.
- `--shadow-primary` on the orange primary only. Two orange layers.
- `--shadow-menu` on dropdown panels and toasts.
- `--shadow-modal` on modals.

Do not invent intermediate shadows. If something needs to feel lifted and none
of these fit, it probably should not be lifted.

**Clipping kills shadows.** Any auto-layout frame that hugs its children and has
`clipsContent` on will cut the shadow off. Turn clipping off on toolbars and
button groups.

---

## The matte inset card

The signature Abacor container, and the thing most likely to be missed.

```css
.card {
  background: var(--ink-03);
  border: 1px solid var(--ink-08);   /* sits OUTSIDE */
  border-radius: var(--r-12);
  padding: 4px;
}
.card > .panel {
  background: var(--white);
  border: 1px solid var(--ink-08);   /* sits INSIDE */
  border-radius: var(--r-8);
}
```

The 4px gap is doing the work. Small enough that the two layers read as one
object, large enough that the tint at the edge gives it depth. A single flat
card with a border is not the same thing and looks noticeably cheaper.

---

## Density

Abacor users are accountants scanning a lot of rows. Prefer:

- Facts over decoration. Every element should be carrying information.
- A metadata column over an expand-to-see-more.
- Tags that state a status over colour-coding that needs a legend.
- Counts next to every filter, so a choice can be made before clicking.
