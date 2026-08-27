# public/audio

Generated placeholders so the audio examples run out of the box. Replace them
with real sound effects whenever you like - keep the filenames, or update the
`staticFile('audio/...')` call that references them.

| file | used by | notes |
|---|---|---|
| `keypress.wav` | `Intro` | 60ms key click, one per typed character |
| `scan.wav` | `EmailScan`, `MeetingScan` | 1.25s low sweep under the scan beam |
| `ping.wav` | `EmailScan`, `MeetingScan` | 280ms blip as a phrase lights up |
| `tick.wav` | `Opportunities`, `RevenueGrowth` | 50ms tick as a row or bar lands |
| `detect.wav` | scans, pipeline total, growth badge | 420ms two-tone confirmation |
| `whoosh.wav` | `TitleCard` | 0.55s, behind the `playSound` prop |

Filenames and default levels are declared in `src/sfx.ts`, and scenes place
them with the `<Sfx>` helper in `src/components/ui.tsx`. To rebalance the mix,
edit `SFX_VOLUME` rather than individual scenes.

Both start at sample 0 with no leading silence, so a `<Sequence from={n}>`
fires them exactly on frame `n`. See the "trim leading silence" tip in the
root README before swapping in a downloaded effect.

Anything in `public/` is reachable from code via `staticFile('audio/<name>')`.
