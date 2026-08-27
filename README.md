# Motion Graphics (Remotion)

Programmatic animated graphics built with [Remotion](https://www.remotion.dev)
and TypeScript. Design in React, preview live in the browser, export as MP4,
transparent ProRes, or a PNG sequence and drop the result into any editor
(Premiere, Resolve, Final Cut, After Effects, CapCut...).

The four starter graphics are deliberately plain. They exist to show the
structure and the enter/exit timing pattern - the look is yours to replace.

```
src/
  index.ts              entry point (registerRoot)
  Root.tsx              registers every composition - add new graphics here
  video.ts              SHARED CANVAS SETTINGS: resolution + fps, one place
  theme.ts              neutral colour + type tokens
  fonts.ts              Google font loading
  lib/
    layout.ts           useScale() + title-safe area helpers
    animation.ts        enterExit() / springEnter() / exitProgress()
  compositions/         one file per graphic
    TitleCard.tsx
    LowerThird.tsx
    KineticText.tsx
    OverlayBadge.tsx
public/                 fonts, images, audio - reachable via staticFile()
out/                    renders (git-ignored)
```

---

## Preview

```bash
npm install
npm run studio
```

Opens the Remotion Studio at <http://localhost:3000>. Pick a composition in the
left sidebar, scrub the timeline, and edit any prop live in the right-hand
panel - the props panel is generated from each composition's zod schema, so
strings get text fields, colours get a colour picker, numbers get sliders and
enums get a dropdown.

Transparent compositions are drawn on a checkerboard. That checkerboard is not
rendered - it is the Studio's way of showing you alpha.

---

## The starter graphics

These four are the neutral scaffolding, separate from the Abacor promo below.

| id | Size | Length | Background | What it shows |
|---|---|---|---|---|
| `TitleCard` | 1920x1080 | 5s | opaque | Spring entrance, staggered elements, optional sound effect |
| `KineticText` | 1920x1080 | 6s | opaque | Per-word stagger derived from the text prop |
| `LowerThird` | 1920x1080 | 5s | **transparent** | clip-path wipe reveal, name + role |
| `OverlayBadge` | 1920x1080 | 4s | **transparent** | Corner badge, positionable via an enum prop |

Every one has a full enter **and** a full exit: frame 0 is empty and the final
rendered frame is empty, so nothing pops on and nothing gets cut off.

---

## The Abacor promo

`AbacorPromo` (1920x1080, ~30s) is the product film: an email thread is
scanned, then a meeting note, the detected opportunities populate a pipeline,
revenue growth follows, and it ends on the logo and URL. No people appear in
it - the story is told entirely through the product surface.

```
src/brand.ts                        colours, URL, font choices - edit here first
src/components/AbacorLogo.tsx       the mark + wordmark
src/components/ui.tsx               Card, ScanBeam, Highlight, DetectChip, Scene
src/compositions/AbacorPromo.tsx    scene order and lengths
src/compositions/abacor/            one file per scene
```

**Scene order and timing** live in one array in `AbacorPromo.tsx`:

```ts
export const SCENES = [
  {id: 'email', seconds: 7, component: EmailScan},
  {id: 'meeting', seconds: 7, component: MeetingScan},
  ...
];
```

Change a `seconds` value and everything after it shifts; the composition's
total length is derived from the same list. Scenes overlap by `OVERLAP` frames
so they cross-dissolve instead of blinking through an empty page.

**Copy** is inline in each scene file - the email messages in `EmailScan.tsx`,
the recap text in `MeetingScan.tsx`, the line items and amounts in
`Opportunities.tsx`, the bars and revenue figures in `RevenueGrowth.tsx`. The
`$41,500` pipeline total is computed from the line items, so editing an amount
keeps the header in sync automatically.

**The logo mark is a reconstruction**, drawn as SVG from the supplied image,
and the wordmark is set in Poppins rather than the real lettering. To use the
official asset, drop it into `public/images/` and follow the swap noted at the
top of `src/components/AbacorLogo.tsx`.

**Brand colours** were sampled by eye. If you have exact hex values, put them
in `src/brand.ts` - every scene reads from there.


---

## Canvas settings (resolution + fps)

Everything lives in `src/video.ts`. Change it there and the whole project
follows - all four compositions are registered with `{...CANVAS}` in
`src/Root.tsx`.

```ts
export const FPS = 30;                                    // -> 60 for 60fps
export const RESOLUTION = RESOLUTIONS.FHD_1080;           // -> RESOLUTIONS.UHD_4K
```

Presets available: `HD_720`, `FHD_1080`, `QHD_1440`, `UHD_4K`, `SQUARE_1080`,
`VERTICAL_1080`.

Two things make this safe to change:

- **Timings are authored in seconds.** `durationInFrames={seconds(5)}` stays
  five seconds whether you are at 30 or 60fps.
- **Sizes are authored against 1080p and scaled at runtime.** Components
  multiply their pixel values by `useScale()` (from `src/lib/layout.ts`), which
  is `canvasHeight / 1080`. Switching to 4K makes everything twice as big
  rather than half as large in frame.

Use the same `useScale()` pattern in any graphic you add, or your text will
shrink the moment you go to 4K.

---

## Adding a new graphic

**1. Create `src/compositions/MyGraphic.tsx`** exporting three things - the
component, a zod schema, and a matching defaults object:

```tsx
import {zColor} from '@remotion/zod-types';
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {z} from 'zod';
import {FONT_FAMILY} from '../fonts';
import {enterExit} from '../lib/animation';
import {useSafeArea, useScale} from '../lib/layout';
import {COLORS} from '../theme';

export const myGraphicSchema = z.object({
  headline: z.string(),
  textColor: zColor(),
});

export type MyGraphicProps = z.infer<typeof myGraphicSchema>;

export const myGraphicDefaultProps: MyGraphicProps = {
  headline: 'Hello',
  textColor: COLORS.text,
};

export const MyGraphic: React.FC<MyGraphicProps> = ({headline, textColor}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const scale = useScale();
  const safeArea = useSafeArea();

  const opacity = enterExit({
    frame,
    durationInFrames,
    enterFrames: 15,
    exitFrames: 15,
  });

  return (
    <AbsoluteFill
      style={{
        ...safeArea.padding,
        justifyContent: 'center',
        fontFamily: FONT_FAMILY,
        opacity,
      }}
    >
      <div style={{fontSize: 90 * scale, color: textColor}}>{headline}</div>
    </AbsoluteFill>
  );
};
```

**2. Register it in `src/Root.tsx`:**

```tsx
<Composition
  id="MyGraphic"                       // this is the id you pass to `render`
  component={MyGraphic}
  durationInFrames={seconds(4)}
  {...CANVAS}                          // shared width / height / fps
  schema={myGraphicSchema}             // drives the Studio props panel
  defaultProps={myGraphicDefaultProps} // must satisfy the schema
/>
```

The `id` must be unique - it is what the Studio sidebar shows and what the
render commands take. `schema` and `defaultProps` are type-checked against each
other, so a mismatch is a compile error rather than a runtime surprise.

Need a different size for one graphic? Override after the spread:
`{...CANVAS} width={1080} height={1920}`.

---

## Rendering

Run these from the project root. `<id>` is the composition id from `Root.tsx`.

**MP4 (H.264) - the general-purpose export:**

```bash
npx remotion render <id> out/<id>.mp4 --codec=h264 --crf=18
```

`--crf` is quality: lower is better and bigger. 18 is visually lossless-ish,
23 is the ffmpeg default, 28 is noticeably compressed.

**Transparent (ProRes 4444) - for overlays:**

```bash
npx remotion render <id> out/<id>.mov --codec=prores \
  --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png
```

All four flags are required and they work together:

- `--codec=prores` + `--prores-profile=4444` - a codec that *can* store alpha
  (H.264 cannot, at all)
- `--pixel-format=yuva444p10le` - the `a` is the alpha channel
- `--image-format=png` - Remotion screenshots each frame before encoding, and
  JPEG has no alpha to hand over. **Note the hyphen: `--image-format`, not
  `--imageformat`.** Remotion rejects the combination outright if you omit it.

**PNG sequence - maximum compatibility, largest on disk:**

```bash
npx remotion render <id> out/<id> --sequence --image-format=png
```

Two things to know: `--sequence` is required, and the output path is a
**directory**, not a `frame-%04d.png` pattern - Remotion errors if the path has
an extension. Frames are written as `element-000.png`, `element-001.png`, ...
Import the first file in your editor and it will pick up the whole sequence.
Frames from a transparent composition keep their alpha automatically.

**Handy extras:**

```bash
npx remotion compositions                          # list every id
npx remotion still <id> out/<id>.png --frame=45    # single frame
npx remotion render <id> out/<id>.mp4 --frames=0-59  # render a range only
npm run typecheck                                  # tsc --noEmit
```

---

## Transparency: the one rule

**Nothing in the tree may paint an opaque backdrop.** `LowerThird` and
`OverlayBadge` have no `backgroundColor` on their root `<AbsoluteFill>`, and
that single omission is what preserves the alpha channel.

Add a `backgroundColor` anywhere above your content and the export goes opaque
*silently* - the ProRes flags will still succeed, you will just get a black
background. If an overlay exports black, that is the first thing to check.

To verify an export really has alpha:

```bash
npx remotion ffprobe out/OverlayBadge.mov | grep Stream
# Video: prores (ap4h ...), yuva444p12le  <- the "a" is alpha
```

---

## Fonts

`src/fonts.ts` self-hosts Inter and Poppins from `public/fonts/` using
`@remotion/fonts`:

```ts
import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

loadFont({family: 'Inter', url: staticFile('fonts/Inter-400.woff2'), weight: '400', format: 'woff2'});
```

Self-hosting means renders are deterministic and need no network - useful on
CI, offline, or behind a restrictive proxy. Drop another `.woff2` into
`public/fonts/` and add a line to load it. Make the declared `weight` match the
file, or the browser synthesises a fake bold.

**Google Fonts instead**, if you would rather not manage files -
`@remotion/google-fonts` fetches at render time:

```ts
import {loadFont} from '@remotion/google-fonts/Inter';

const inter = loadFont('normal', {weights: ['400', '700'], subsets: ['latin']});
export const FONT_FAMILY = inter.fontFamily;
```

Swap the family by changing only the import subpath (`.../Roboto`,
`.../DMSans` - the font name with spaces removed). Request only the weights and
subsets you use; each is another file fetched on every render.

## Sound effects

`public/` is served statically - reach anything in it with `staticFile()`. Put
audio inside a `<Sequence>` so its `from` prop controls *when* it fires:

```tsx
import {Audio, Sequence, staticFile} from 'remotion';

<Sequence from={12} name="Whoosh SFX">
  <Audio src={staticFile('audio/whoosh.wav')} volume={0.6} />
</Sequence>
```

`from={12}` starts the sound at frame 12. There is a live example in
`src/compositions/TitleCard.tsx` behind the `playSound` prop - toggle it in the
Studio. `public/audio/whoosh.wav` is a generated placeholder; replace it.

You can also fade audio by passing a function to `volume`:
`volume={(f) => interpolate(f, [0, 10], [0, 1], {extrapolateRight: 'clamp'})}`.

---

## Tips

**Keep text in the title-safe area.** Broadcast convention is a 5% margin on
every edge; text outside it gets clipped by overscan, player chrome, or a
social-media UI overlay. `useSafeArea().padding` from `src/lib/layout.ts` does
this for you - spread it onto your outermost container. Every starter
composition already does.

**Always give an animation a full enter and exit.** A graphic that is still
visible on its last frame reads as a hard cut when the clip ends. The helpers
in `src/lib/animation.ts` handle the subtle part: a composition of N frames
renders frames `0 .. N-1`, so an exit animated to `durationInFrames` is still
partly on screen on the last frame that actually gets rendered. `enterExit()`
and `exitProgress()` land on `durationInFrames - 1` instead. If you hand-roll
an exit, do the same.

**Trim leading silence on sound effects.** Most downloaded SFX have 50-200ms of
silence at the head. If you do not trim it, `from={12}` does not actually make a
sound at frame 12 - it makes a sound somewhere after frame 12, and syncing by
ear against the visuals becomes guesswork. Trim the file so the transient is at
sample 0, then position it purely with `from`.

**Prefer springs for entrances, eased curves for exits.** `spring()` settles
naturally, which reads better than a linear slide. Exits generally want
`Easing.in(...)` so they accelerate away.

**Stagger anything that appears in a group.** A few frames of delay between
sibling elements (`springEnter({delay: index * 4})`) is most of what separates
motion graphics from a slideshow.

**Render a still first.** `npx remotion still <id> out/check.png --frame=45` is
much faster than a full render when you are iterating on layout.

---

## Troubleshooting

**"Failed to launch the browser process" / Chrome Headless Shell will not
download.** Remotion fetches its own Chromium on first render. Behind a
restrictive network you can point it at a local browser instead:

```bash
npx remotion render <id> out/<id>.mp4 --browser-executable=/path/to/headless_shell
```

Use a `headless_shell` / `chrome-headless-shell` binary - a regular Chrome
binary rejects Remotion's old-headless launch flags.

**An overlay exported with a black background.** A `backgroundColor` somewhere
in the tree, or a missing `--image-format=png`. See *Transparency* above.

**Text is tiny after switching to 4K.** That component is using raw pixel
values instead of multiplying by `useScale()`.
