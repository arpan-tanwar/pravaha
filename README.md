# SoundBoard

A browser-based soundboard with interactive visuals: play pre-recorded tunes, choose sounds and moods, record and loop your own sequences, and trigger notes from the keyboard or touch grid.

## Features

- **Try a tune** – Play short demo melodies (Stairway, Bounce, Sunset, Chime) and follow along with the keys.
- **Sound** – Switch kits: Bleeps, Drums, or Pads (each with plain-language descriptions).
- **Mood** – Switch scales: Pentatonic, Major, Minor, or Chromatic (described for non-musicians).
- **Record & Play** – Record key presses, play back, and optionally loop.
- **Visuals** – Full-screen canvas with reactive visuals tied to notes and mood.
- **Responsive** – Works on desktop (keyboard) and touch devices via the on-screen key grid.

## Tech stack

- **React 19** + **TypeScript**
- **Vite 7** – dev server and production build
- **React Router 7** – gallery (home) and soundboard routes
- **Web Audio API** – sound generation and playback
- **Canvas 2D** – real-time visuals

## Prerequisites

- **Node.js** 18+ (or **Bun**)
- npm, yarn, pnpm, or bun

## Setup and run

```bash
# Install dependencies
npm install

# Development (with HMR)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

Using Bun:

```bash
bun install
bun run dev
bun run build
bun run preview
```

## Scripts

| Script    | Description                    |
| --------- | ------------------------------ |
| `dev`     | Start Vite dev server (HMR)     |
| `build`   | TypeScript check + Vite build   |
| `preview` | Serve `dist` locally            |
| `lint`    | Run ESLint                     |

## Project structure

```
src/
├── App.tsx              # Root app (routes only)
├── App.css               # Global + Soundboard UI styles
├── main.tsx              # Entry point
├── index.css             # Resets, theme variables, body
├── audio/                # Web Audio context and trigger
├── components/           # e.g. TouchGrid
├── config/               # keyMap, kits, scales, tunes
├── hooks/                # e.g. useKeyTrigger
├── pages/                 # MainGalleryPage, SoundboardPage
├── routes/               # AppRoutes
└── visuals/              # Canvas, engine, easing, types
```

## GitHub

Before pushing to your own repo, set the correct `repository` URL in `package.json` (replace `your-username/soundboard` with your GitHub username and repo name). The CI workflow runs on `main` and `master`; adjust the branch names in [.github/workflows/ci.yml](.github/workflows/ci.yml) if needed.

## License

MIT – see [LICENSE](LICENSE).
