# Patterns

Whole-screen layouts. Pick the one that matches the job.

---

## App shell

Every product screen sits inside this.

**The rail is not a separate element.** The outer frame is `#1A1A1A` at radius
16, and a white container sits on top at x=60, leaving a 60px dark strip. Build
it as a separate dark panel and the corner radii will be wrong.

```
frame      1440 x 900 · radius 16 · background #1A1A1A
container  1372 x 884 at (60, 8) · radius 12 · background #FFF
```

### Rail contents, top to bottom
```
y 12    Abacor mark, 44x48
y 68    orange "+" 36x36 radius 8
        search · home · calendar · tasks · contacts · chat · list  (36x36)
bottom  onboarding ring · notifications · help · settings
y 840   avatar 44x44 container, inner 28x28 radius 8, fill var(--avatar-purple)
```
Glyphs white at 20%, 100% when active. Active row gets `var(--white-08)`.

---

## Settings page

```
breadcrumb   x 294, y 24   "Overview" or "Overview / Integrations / Import email"
page title   x 322, y 75   gear glyph + 24px Kraftig + 14px Buch sub
hairline     full width, y 150
nav          221px at (24, 178)
content      1010px at (322, 178)
```

### Settings nav
Groups labelled 11px Buch UPPERCASE `var(--ink-45)`, 4% tracking.
```
GENERAL        Account · Integrations · Usage · Writing · Notifications
ASSISTANTS     Meeting Configuration · Email Configuration · Service Catalog
ADMINISTRATOR  Billing · Team · Workspace
```
Row 32px, 14px Buch, 16px glyph, 8px gap, radius 6.
Active: `background:var(--ink-06)`, label switches to Kraftig.

### Inner settings page
For a sub-destination like Manage plan or Import email: keep the nav, extend the
breadcrumb, swap the content. **Never a full-screen takeover.** Nothing in
Settings earns removing the nav.

---

## Dashboard

```
title row     24px Kraftig + a right-aligned action
segmented     Personal / Firm-wide tabs, radius 40 track
stat row      2–4 matte cards, label 11px UPPERCASE + 24px Kraftig figure
chart card    title 14px Kraftig with an inline count, legend right,
              period dropdown far right
table card    toolbar then rows
footer note   12px Buch var(--ink-45), centred, e.g. an AI accuracy disclaimer
```

---

## List with filters

The workhorse. Used for contacts, opportunities, senders, team members.

```
┌ toolbar ────────────────────────────────────────────┐
│ [scope ▾]        [search........] [Filter ▾]        │   8px gaps, 36px tall
├ select-all row ─────────────────────────────────────┤
│ ☑ Select all   5 of 184 selected      [Deselect all]│
├ hairline ───────────────────────────────────────────┤
│ rows, scrollable, 14px right gutter for the bar     │
└ footer ─────────────────────────────────────────────┘
  16 people, 1,284 emails.            [Back] [Primary]
```

Rules learned the hard way:

- Search must have an **explicit width**. Set to fill, it swallows the gap and
  the controls touch.
- The list scrolls, the container does not grow.
- The scrollbar needs its own 14px gutter or it draws through the content.
- Select-all applies to what is **showing**, so the count reads "16 of 16" when
  filtered, not "16 of 184".
- Every filter option carries a count.

---

## Wizard in a modal

For multi-step tasks: connect, scan, choose, review, confirm.

- Step position in the **header**: `Import email · Step 4 of 6`. No stepper rail
  inside the modal; the header already carries it.
- 560 for read/confirm/wait steps, 760 for the selection step.
- Review steps are **read-only**. No checkboxes, no search, no remove. The
  choosing happened at the previous step.
- Closing must not cancel the work. The row that launched the flow becomes its
  status, and the button on it is the way back in.

---

## Background task, resumable

When a job outlives the modal:

1. Modal says so plainly: "This keeps running if you close it."
2. The originating row becomes the status: state, progress, and a quiet action
   to return.
3. Completion confirms **on the destination**, via a toast, not only in a modal
   the user may never reopen.

---

## Billing

```
plan card    matte inset · plan mark + name + cycle badge + Manage
banner       inline upsell or state, one line + one action
facts row    Renews · Billing · Next invoice (+ Seats on team plans)
payment      card on file + Manage payment (links out to Stripe)
invoices     table
```
The banner CTA is one slot with several states: Upgrade, View request,
View plans, Update card. Never two CTAs competing in the card.

---

## Onboarding

Same shell, no settings nav. Progress lives in the rail as a ring, not a bar.
One decision per screen. Never more than three steps before the user sees value.

---

## Empty and error states

- **Filtered to nothing:** one line, centred. Nothing else.
- **Nothing yet:** one line explaining what will appear, plus the single action
  that creates the first item.
- **Failure:** state what failed, when, and the one action that fixes it. Put it
  in a banner on the page, not a modal, so the user keeps their context.
