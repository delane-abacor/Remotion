# public/audio

Generated placeholders so the audio examples run out of the box. Replace them
with real sound effects whenever you like - keep the filenames, or update the
`staticFile('audio/...')` call that references them.

| file | used by | notes |
|---|---|---|
| `keypress.wav` | `src/compositions/abacor/Intro.tsx` | 60ms soft key click, one per typed character |
| `whoosh.wav` | `src/compositions/TitleCard.tsx` | 0.55s, behind the `playSound` prop |

Both start at sample 0 with no leading silence, so a `<Sequence from={n}>`
fires them exactly on frame `n`. See the "trim leading silence" tip in the
root README before swapping in a downloaded effect.

Anything in `public/` is reachable from code via `staticFile('audio/<name>')`.
