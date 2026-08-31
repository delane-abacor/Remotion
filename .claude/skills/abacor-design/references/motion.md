# Motion

Covers both in-product transitions and Remotion video. The language is the same:
calm, short, no overshoot.

---

## Easing

```
--ease:     cubic-bezier(0.16, 1, 0.3, 1)   /* entrances, most things */
--ease-out: cubic-bezier(0.33, 1, 0.68, 1)  /* exits */
```

## Durations

| Token | ms | Frames @30 | Use |
|---|---|---|---|
| micro | 120 | 4 | Checkbox fill, tick, tag landing |
| fast | 180 | 6 | Hover, focus ring, tooltip |
| element | 240 | 7 | A row, a card, a button entering |
| surface | 320 | 10 | Modal, menu, toast |
| scene | 400 | 12 | Full crossfade between beats |

---

## In-product

**Surfaces** rise 8px and fade in over 320ms. No scale.

**Menus** fade and rise 4px over 180ms from the trigger edge.

**Rows** stagger 30ms, capped at 8 rows. Beyond that the tail arrives after the
user has already moved on.

**Meters** animate width with `--ease` over 400ms. Never spring a progress bar.

**The scrim** appears with the modal, on the same frame. Never before.

**Nothing bounces.** No overshoot anywhere in the product.

---

## Remotion

```
fps 30 · 1920x1080
```

Build the UI at **1440x900** and scale it into the frame at **1.24**, which
leaves a 67px margin either side. Never render UI at 1920 wide directly; the
type ends up too small relative to the frame.

### Springs

```ts
import {spring, interpolate, Easing} from 'remotion';
export const ABACOR_EASE = Easing.bezier(0.16, 1, 0.3, 1);

const p = spring({frame, fps, config:{damping:200, mass:0.6}});
const y = interpolate(p, [0,1], [12,0]);
const opacity = interpolate(p, [0,1], [0,1]);
```

`damping: 200` removes the overshoot entirely. A springy modal looks like a
different product.

### Holds

```
hold       45 frames   minimum for a headline
hold-long  75 frames   a paragraph or three list items
```

Never cut under 45 frames. Dense UI needs reading time, and cutting while the
eye is still travelling is the most common mistake.

### Numbers

Count up over 20 frames, land on the real value, format with `toLocaleString`
so thousands separators appear.

### Cursor

Move over 10 frames with `ABACOR_EASE`, hold 2 frames, then let the target
react. The pause before the reaction is what sells it as a click. Use the
`pointinghand` asset from the Figma file, never a system cursor.

### Never

- Parallax on UI. It is a product, not a landing page.
- Blur-in on text. Reads as a mistake at 30fps.
- Colour transitions on the orange. It either is the action or it is not.
- Easing on opacity-only fades. Linear is correct.
- Motion on the scrim.
