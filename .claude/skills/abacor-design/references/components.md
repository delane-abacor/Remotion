# Components

Measured specs. All heights, paddings and radii are real values from the files.

---

## Buttons

All buttons are **36px** tall, radius **8**, label **14px Kraftig**, gap **6**.

### Primary
```css
height:36px; padding:0 12px; border-radius:var(--r-8);
background:var(--abacor-orange); color:var(--white);
box-shadow:var(--shadow-primary);
```
Disabled: same button at `opacity:.4`. Never a grey fill.

### Secondary
```css
background:var(--white); border:1px solid var(--hairline-strong);
box-shadow:var(--shadow-control); color:var(--ink);
```
Back, Cancel, Manage, Deselect all. Sits 8px left of the primary. The pair sits
20px from any helper text.

### Quiet, for tinted strips
```css
height:22px; padding:4px 10px; border-radius:var(--r-6);
background:var(--white); border:1px solid var(--hairline-strong);
box-shadow:var(--shadow-control); font-size:var(--t-12);
```
A status strip never contains a filled primary.

---

## Inputs

### Text / search
```css
height:36px; padding:0 10px; border-radius:var(--r-8); gap:6px;
background:var(--white); border:1px solid var(--hairline);
box-shadow:var(--shadow-control);
font:400 var(--t-14) var(--font);
```
Placeholder `var(--ink-45)`. Leading 14px glyph at `var(--ink-45)`.
The lighter border (8% vs 12%) is the *only* thing separating an input from a
button. Do not add a grey fill to differentiate them.

### Dropdown
```css
height:36px; padding:0 10px 0 12px; border-radius:var(--r-8); gap:4px;
background:var(--white); border:1px solid var(--hairline-strong);
box-shadow:var(--shadow-control); font-weight:500;
```
Trailing chevron 14px `var(--ink-60)`, 4px from the label so it reads as
belonging to it.

**Applied state:** keep the button neutral, add a count pill
(`padding:2px 5px; radius:4px; background:var(--ink-08); font:500 10px`).
Do not tint the button.

### Checkbox
```
18px · radius 4
checked   background:var(--abacor-orange) + white tick
unchecked background:#EBEBEB
indeterminate: orange with a white horizontal bar (use for select-all partial)
```

### Toggle
```
36 x 20 · radius 9999 · on:var(--abacor-orange) · off:var(--ink-12)
knob 16px white, shadow var(--shadow-control)
```

---

## Menu panel

```css
width:240px; padding:6px; border-radius:var(--r-12); gap:2px;
background:var(--white); border:1px solid var(--ink-08);
box-shadow:var(--shadow-menu);
```
Section label: 11px Buch, `var(--ink-45)`, UPPERCASE, 4% tracking, 8px inset.
Option row: 8px padding, radius 8, active `background:var(--ink-04)`.
Multi-select rows carry a checkbox; single-select rows carry a trailing orange
tick and no checkbox. Sort options align with the section label, not the
checkbox column.

Right-align the panel to its trigger and clamp it 16px inside the container.

---

## Modal

```
header  64px · background:rgba(0,0,0,.12) · backdrop-filter:blur(12px)
        18px glyph in a rounded square · 14px Kraftig white label · close right
body    var(--white) · radius 16 · 16px padding
footer  60px · background:var(--white-70) · 12px padding
        helper 12px Buch var(--ink-55) left · buttons right
```

Widths **560** to read, confirm or wait. **760** to scan a list.
Height never exceeds **640** at 1440x900. If content is taller, the list
scrolls, the modal does not grow.

Scrim `var(--scrim)` appears on the same frame as the modal, never before.

---

## Cards

### Matte inset
See `foundations.md`. Outer `--ink-03` + `--ink-08` outside border + 4px
padding; inner white panel radius 8.

### Stat row
Inside the matte card. Columns divided by a 1px left hairline on all but the
first.
```
tile padding:16px; gap:4px
label 11px Buch var(--ink-45) UPPERCASE 4% tracking
value 26px Kraftig var(--ink) -2% tracking
```
The figure must dominate. Equal weight makes the card read as dead.

---

## List row

```
padding:12px 0; gap:12px; border-bottom:1px solid var(--ink-08)
checkbox  18px
avatar    28px rounded square — for records that already exist
icon      28px rounded square, var(--ink-05), 18px glyph — for new records
name      14px Kraftig var(--ink)
sub       12px Buch var(--ink-55)   role · company · address
right     count 12px Kraftig, recency 12px Buch var(--ink-45), right aligned
```

Avatar-versus-glyph is meaningful: a photo means the record exists, a glyph
means it is about to be created. Do not use avatars for both.

---

## Tags and status

### Tag
```
padding:2px 6px; radius:4px; font:500 10px
neutral   background:var(--ink-06); color:var(--ink-60)
attention background:var(--abacor-orange-10); color:var(--abacor-orange)
```

### Status pill
```
neutral      background:var(--ink-04); color:var(--ink); radius:6px; 12px
in progress  background:var(--abacor-orange-14); color:var(--abacor-orange-deep); radius:pill
success      background:var(--success-08); color:var(--success)
```

---

## Meter

```
track 2px, var(--meter-track), full column width
fill  2px, background:var(--meter-orange), box-shadow:var(--meter-glow-orange)
      switch to --meter-red / --meter-glow-red at capacity
count "18 of 30" — 14px Kraftig then 12px Buch var(--ink-45) on one line
label 12px Buch var(--ink-55) below
```
All meters in a group share one track width. Different track lengths make the
fills incomparable.

---

## Toast

```
padding:14px 16px; radius:12px; background:var(--white);
border:1px solid var(--ink-08); box-shadow:var(--shadow-menu);
24px from the bottom-right of the content area
orange circular tick 24px · title 13px Kraftig · sub 12px Buch var(--ink-55)
```

---

## Status strip

An inline band inside a card, carrying state plus one quiet action.
```
padding:4px; border-radius:var(--r-8)
background: var(--abacor-orange-07) in progress
            var(--success-08) done
dot 8px · text 12px Kraftig · quiet outlined button right, 4px inset
```

---

## Empty state

Centred, 72px above and below, one line only.
```
14px Buch var(--ink-45) — "No matches found"
```
No illustration, no suggestion, no recovery copy. Filtering to nothing is a
normal outcome, not an error.

---

## Table

```
header  12px Kraftig var(--ink-60), 12px padding, bottom hairline
row     12px padding, bottom hairline var(--ink-08)
hover   background:var(--ink-03)
cell    14px Buch; numeric cells right-aligned, tabular figures
```
Toolbar above: scope dropdown left, then search, filter and sort right, 8px gaps.
