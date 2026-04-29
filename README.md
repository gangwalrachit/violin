# String Theory

A violin practice web app with structured exercises, songs, and real-time playback — built for students learning under [Madhav Sharma](https://instagram.com/madhavviolin).

**Live:** [violinstringtheory.vercel.app](https://violinstringtheory.vercel.app)

---

## Features

- **Sargam view** — notes displayed as Sa Re Ga Ma Pa with real-time playback highlighting
- **Sheet music view** — standard notation rendered via abcjs
- **Global playback bar** — play/pause, loop, and tempo control (50–150% speed)
- **10 exercises + songs** — D-major scale patterns and pieces
- **Dark mode** — warm Anthropic-inspired palette
- **Mobile-friendly** — responsive layout with collapsible sidebar

## Tech Stack

- [Vite](https://vitejs.dev) + [React](https://react.dev)
- [abcjs](https://abcjs.net) — ABC notation rendering and audio synthesis
- [React Router](https://reactrouter.com) — client-side routing
- CSS custom properties — no UI framework

## Tuning

This app is built around D-major violin exercises (ADAD tuning context):

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

Opens at `http://localhost:5173`. Exercises and songs are in `src/data.json` as [ABC notation](https://abcnotation.com).

## Content

Taught by **Madhav Sharma**:

- [@madhavviolin](https://instagram.com/madhavviolin) on Instagram
- [@MadhavViolinofficialchannel](https://youtube.com/@MadhavViolinofficialchannel) on YouTube
- [@ViolinWithMadhav](https://youtube.com/@ViolinWithMadhav) on YouTube
