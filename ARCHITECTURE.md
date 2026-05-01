# Architecture

## Project Structure

```
src/
├── main.jsx                  # App entry, router
├── data.json                 # All exercises + songs as embedded ABC strings
├── styles.css                # Global styles, design tokens, all component CSS
│
├── context/
│   └── PlayerContext.jsx     # Global player state (tempo, nav, current piece)
│
├── hooks/
│   └── usePlayer.js          # Audio engine: play/pause/stop/loop, wake lock
│
├── utils/
│   └── parseSargam.js        # ABC → sargam token list for SargamView
│
└── components/
    ├── Landing.jsx            # Home page with fingerboard, teacher credits
    ├── Practice.jsx           # Main practice layout, view routing
    ├── Notation.jsx           # abcjs sheet music renderer
    ├── SargamView.jsx         # Sargam notation with note highlighting
    ├── PlaybackBar.jsx        # Floating playback dock (play, loop, tempo)
    ├── Sidebar.jsx            # Collapsible exercise/song navigator
    └── ThemeToggle.jsx        # Dark/light mode toggle

exercises/                    # Source .abc files (canonical content)
songs/                        # Source .abc files
```

`src/data.json` is the runtime content store — it embeds the ABC strings directly so no file I/O is needed at runtime. Source `.abc` files in `exercises/` and `songs/` are the editable originals.

---

## Component Responsibilities

### `PlayerContext` + `usePlayer`
The audio engine lives entirely in `usePlayer.js` and is exposed globally via `PlayerContext`. Any component can access `player`, `tempo`, and navigation state without prop drilling.

`usePlayer` manages:
- `CreateSynth` + `TimingCallbacks` lifecycle (init → prime → start → stop)
- Real-time `currentNoteIndex` counter (increments on every `eventCallback` fire)
- Progress tracking via `beatCallback`
- Wake lock acquisition/release on play/stop
- Safari iOS AudioContext unlock (create + `await resume()` before first abcjs call)
- Tempo-aware loop gap (`millisecondsPerMeasure()` from the visual object)

### `Notation`
Renders ABC notation via `abcjs.renderAbc()` and calls `setVisualObj` to hand the rendered object back to `usePlayer`. It injects the current BPM into the ABC string before rendering so the visual object (and therefore abcjs's audio engine) reflects the user's tempo setting. **Always mounted** — even in Sargam mode — because unmounting it would destroy the visual object and break audio.

### `SargamView`
Receives the parsed token list from `parseSargam` and `currentNoteIndex` from the player. Highlights the active token by comparing `noteIndex` values. Does not manage any audio state.

### `parseSargam` (util)
Converts raw ABC notation into a structured list of line-grouped tokens for `SargamView`. Key invariant: `noteIndex` values in the token list map 1:1 to the event order that `TimingCallbacks.eventCallback` fires — both increment on notes and rests, never on barlines or headers.

---

## Data Flow

```
data.json
    │
    ▼
Practice.jsx
    ├── abc string ──► Notation.jsx ──► abcjs.renderAbc() ──► visualObj
    │                                                              │
    │                       usePlayer.js ◄────── setVisualObj ────┘
    │                           │
    │                     play() called
    │                           │
    │               CreateSynth.init(visualObj)
    │               CreateSynth.prime()
    │               CreateSynth.start()
    │               TimingCallbacks.start()
    │                           │
    │                    eventCallback fires
    │                           │
    │               currentNoteIndex increments
    │                           │
    ├── currentNoteIndex ──► SargamView (highlight active token)
    └── currentNoteIndex ──► Notation (highlight active note in SVG)
```

---

## Audio Pipeline (abcjs)

1. **Render** — `abcjs.renderAbc()` parses ABC notation into a `visualObj` (SVG + timing data)
2. **Init** — `CreateSynth.init({ visualObj, audioContext })` loads the soundfont and sets up audio buffers
3. **Prime** — `CreateSynth.prime()` renders all notes into an audio buffer
4. **Start** — `CreateSynth.start()` begins playback; `TimingCallbacks.start()` fires beat/event callbacks in sync

**Safari iOS note:** `AudioContext` must be created and `await`ed on `resume()` synchronously within the user gesture click handler, before any other `await`. This is the first async call in `play()`. The context is then passed explicitly to `CreateSynth.init()` via the `audioContext` option so abcjs uses the pre-unlocked instance.

**Tempo:** Injected into the ABC string by `Notation.jsx` before rendering (`Q:1/4={bpm}`). This means `visualObj.millisecondsPerMeasure()` always reflects the user's current tempo setting, which we use for the loop gap.

---

## Sargam Note Mapping (D major, hardcoded)

```
ABC note  →  Sargam  (middle octave)
D         →  Sa
E         →  Re
F         →  Ga
G         →  Ma
A         →  Pa
B         →  Dha
C         →  Ni
```

- Uppercase ABC = middle octave
- Lowercase abc = upper octave (dot above in UI)
- Trailing comma = lower octave (dot below in UI)

---

## Key Design Decisions

**Why `data.json` instead of loading `.abc` files at runtime?**
Simpler build — no asset loading or fetch logic. The source `.abc` files remain editable. If content grows significantly, consider a build script that regenerates `data.json` from the source files (a `build:data` script already existed in an earlier version).

**Why keep `Notation` mounted in Sargam mode?**
`usePlayer` holds a reference to the `visualObj` created by `Notation`. Unmounting `Notation` would call `setVisualObj(null)` (via the `stop()` side effect in `setVisualObj`), destroying the audio engine. We hide it with `height: 0; visibility: hidden` instead.

**Why a global player context instead of per-page state?**
Playback should survive navigation between exercises without interruption. The `PlaybackBar` always shows regardless of route, so its state must live above the router.

---

## Roadmap

### Seek control
Allow the user to jump to any position in a piece by dragging the progress bar or clicking a note in the sargam/sheet view. abcjs's `TimingCallbacks` supports a `start(position)` offset. The challenge is mapping a UI position (pixel or note click) to the correct beat offset, then re-priming the synth from that point.

### Auto-scroll (Sargam view)
Scroll the sargam view so the active note is always visible during playback. Two approaches tried so far:
1. `scrollIntoView` — unreliable when the scroll container isn't the document root
2. Manual `scrollTop` on a container ref — logic was correct but removed due to edge cases

Next attempt: use an `IntersectionObserver` on the active row element. This avoids manual offset arithmetic and fires reliably when the element leaves the viewport.

### Selective loop
Let the user mark a start and end note (or measure) and loop only that range. UI options to consider:
- Drag handles on the progress bar (simple, familiar from music apps)
- Click-to-set start/end on individual sargam tokens (more precise, keeps UI clean)
The abcjs `TimingCallbacks.start(offset)` + `stop()` at a specific beat would power this.

### Beat / rhythm track
Add a subtle tabla or click track alongside the melody. abcjs supports `%%MIDI channel 10` (GM percussion channel) directly in ABC notation — a rhythmic pattern can be embedded in the ABC string itself without any extra audio engine work. This keeps it consistent with the existing tempo/loop system.

### Content expansion
- More songs (bhajans, folk, classical pieces in D major)
- Multiple keys (G major, A major exercises)
- Difficulty tagging in `data.json`
