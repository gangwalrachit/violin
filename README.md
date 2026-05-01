# String Theory

A violin practice web app with structured exercises, songs, and real-time playback — built for students learning under [Madhav Sharma](https://instagram.com/madhavviolin).

**Live:** [violinstringtheory.vercel.app](https://violinstringtheory.vercel.app)

---

## Features

- **Sargam view** — notes as Sa Re Ga Ma Pa with real-time playback highlighting
- **Sheet music view** — standard notation rendered via abcjs
- **Global playback bar** — play/pause, loop (with tempo-aware gap), tempo control (40–200 BPM)
- **Dark mode** — warm Anthropic-inspired palette, persisted across sessions
- **Mobile-friendly** — responsive layout, collapsible sidebar, screen wake lock during playback
- **Safari iOS audio** — AudioContext properly unlocked within user gesture

## Content

10 exercises + songs in D major, as taught by **Madhav Sharma**:

- [@madhavviolin](https://instagram.com/madhavviolin) on Instagram
- [@MadhavViolinofficialchannel](https://youtube.com/@MadhavViolinofficialchannel) on YouTube
- [@ViolinWithMadhav](https://youtube.com/@ViolinWithMadhav) on YouTube

## Tech Stack

- [Vite](https://vitejs.dev) + [React](https://react.dev) + [React Router](https://reactrouter.com)
- [abcjs](https://abcjs.net) v6.6.3 — ABC notation rendering + Web Audio synthesis + timing callbacks
- CSS custom properties — no UI framework

## Tuning (D major context)

```
(A3) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ← thickest
(D4) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
(A4) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
(D5) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ← thinnest
```

## Sargam Mapping (D major)

```
D4 → Sa   E4 → Re   F4 → Ga   G4 → Ma
A4 → Pa   B4 → Dha  C5 → Ni   D5 → Sa'
```

## Running Locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. Content lives in `src/data.json` (embedded ABC notation) and `exercises/` / `songs/` (source `.abc` files).

## Docs

- [ARCHITECTURE.md](./ARCHITECTURE.md) — component map, data flow, audio pipeline, roadmap
- [DESIGN.md](./DESIGN.md) — full design system reference (Anthropic-inspired warm palette)
