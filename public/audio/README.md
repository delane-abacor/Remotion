# public/audio

`whoosh.wav` is a generated placeholder (0.55s, mono, no leading silence) so the
`<Audio>` example in `src/compositions/TitleCard.tsx` runs out of the box.
Replace it with a real sound effect whenever you like - keep the filename or
update the `staticFile('audio/whoosh.wav')` call.

Anything in `public/` is reachable from code via `staticFile('audio/<name>')`.
