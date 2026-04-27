# Violin Practice

A minimal web app for practicing violin — built with [abcjs](https://www.abcjs.net), React, and Vite.

**[hello-violin.vercel.app](https://hello-violin.vercel.app)**

---

## Tuning

```
(A3) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ← thickest
(D4) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
(A4) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
(D5) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ← thinnest
```

## Sargam Mapping

```
String 1:  A3 ─── Pa.
           │
String 2:  D4 ─── Sa
           E4 ─── Re
           F4 ─── Ga
           G4 ─── Ma
           │
String 3:  A4 ─── Pa
           B4 ─── Dha
           C5 ─── Ni
           │
String 4:  D5 ─── Sa.
```

## Running Locally

```sh
npm install
npm run dev
```

Exercises and songs live in `exercises/` and `songs/` as `.abc` files. Run `npm run build:data` to regenerate `src/data.json` after editing them.
