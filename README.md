# ∑ SeeTheMath

**See the math. Get the math.**

Interactive visual walkthroughs for the math concepts that trip up middle schoolers,
organized by the **Ontario curriculum strands**. Built for students, parents, and teachers.

This is a **universal app**: one React Native (Expo) codebase that runs as a **native
Android app** and exports a **static website** (via `react-native-web`). Add a topic
once — it appears on both.

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

## Topics

Organized by Ontario math strands (Number · Algebra · Data · Spatial Reasoning · Financial Literacy):

| Topic | Strand | Grades | Visual model |
|---|---|---|---|
| **Multiplying Fractions** | Number | 6–7 | Area model + number line |
| **Decimals & Percents** (+ Ontario tax brackets) | Number / Financial | 6–7 | Hundreds grid + bar model + bracket bars |
| **Ratios & Proportions** | Number | 6–7 | Tape diagrams + double number line |
| **Dilations** | Spatial Reasoning | 7–8 | Coordinate grid with rays |

Every topic has a step-by-step guided reveal and a free-form *Try It Yourself* mode.

## Tech stack

- **Expo SDK 56** (React Native 0.85, React 19) + **Expo Router** (file-based routing)
- **react-native-web** — the same components render the website
- **react-native-svg** — all visualizations (no charting libraries)
- Bundled Google Fonts (Libre Baskerville + Source Sans 3) → works fully offline
- Zero backend, zero database, zero tracking — runs entirely on-device

## Project structure

```
app/                 # Expo Router routes (the screens)
  _layout.jsx        #   root layout + font loading
  index.jsx          #   home — topics grouped by strand
  topic/[id].jsx     #   a topic screen (pre-rendered per topic)
  privacy.jsx        #   privacy policy (/privacy)
src/
  tokens.js          # design tokens + strand definitions + font helpers
  math.js            # pure helpers (gcd, formatFrac, tax brackets…)
  ui.jsx             # shared components (Card, Chip, StepWalkthrough, Canvas…)
  topics/            # one file per topic = { meta, Module }; index.js is the registry
assets/              # app icon, splash, favicon (generated from assets/icon.svg)
```

### Adding a new topic

1. Create `src/topics/<name>.jsx` exporting `meta` (`{ id, title, desc, strand, grade, color, icon, tag }`) and a `Module` component.
2. Add it to the array in `src/topics/index.js`.

That's it — the home page and routing pick it up automatically (no central switch to edit).

## Run locally

```bash
npm install
npm run web        # website at http://localhost:8081
npm start          # then press 'a' for Android (emulator or Expo Go)
```

## Build & deploy

- **Web → Vercel:** `npm run build:web` produces a static `dist/`. `vercel.json` wires
  the build command and routing, so connecting the repo to Vercel deploys it.
- **Android → Google Play:** see [`PLAYSTORE.md`](./PLAYSTORE.md) for the full first-time
  publishing guide (EAS build, store listing, kids-app compliance).

## Regenerating app icons

Icons are generated from `assets/icon.svg`:

```bash
npm run gen:icons
```

## License

MIT — use it however you want. Built by Islam Taha for learners everywhere.
