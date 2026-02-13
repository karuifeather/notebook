# FeatherPad

A browser-based notebook app: notes live in documents made of blocks (rich text, code, callouts, tables, tasks, images, embeds). Code cells run in an iframe via a client-side bundler. All data is stored locally in your browser.

## What it does today

- **Notebooks and notes** — Create notebooks, add notes inside them, edit titles and descriptions. Reorder notes by drag-and-drop.
- **Blocks** — Each note is a list of blocks. Types: markdown, code, rich text, callout, image, table, tasks (checklist), embed (link preview). Add, delete, reorder by drag-and-drop.
- **Code cells** — Write JavaScript/JSX; code is bundled with esbuild (WASM) and runs in an iframe. React is available by default (no import needed). Preview and console log views.
- **Per-note dependencies** — Use bare imports in code (e.g. `import _ from 'lodash'`). On run, versions are resolved and pinned per note. You can update or copy the lock from the note’s dependency section.
- **Persistence** — Notebooks, notes, and cells are persisted with Redux and `redux-persist` to `localStorage`. No backend; data stays in your browser.
- **Playground** — A “Try now” route loads a pre-seeded note so you can try the app without creating a notebook. Returning visitors are redirected to the app (recent notebook if any).
- **UI** — Dark mode, focus mode (shortcut to hide sidebar/chrome), collapsible note details and sidebar state stored in `localStorage`. Notebook cover image can be set (URL or upload).

## How it works

You create notebooks, then notes inside each notebook. Each note is a vertical list of blocks. Code blocks are bundled on edit (debounced); the bundler resolves NPM packages via unpkg and caches fetched files (e.g. with localForage). The preview iframe receives the built bundle and mounts your React default export. Notebook/note/cell state is in Redux and persisted to `localStorage`.

## Tech stack

- **Frontend:** React 19, TypeScript, Vite
- **State:** Redux, redux-persist (localStorage), reselect
- **Editor:** TipTap (rich text), Monaco (code)
- **Bundler:** esbuild-wasm, custom unpkg/fetch plugins, localForage for cache
- **UI:** Tailwind CSS, SCSS, Font Awesome, AOS (scroll animations)
- **Drag-and-drop:** @dnd-kit (cells and notes)

## Getting started

**Yarn (Corepack)** — This project uses [Yarn 4](https://yarnpkg.com/) and the `packageManager` field in `package.json`. [Corepack](https://nodejs.org/api/corepack.html) (shipped with Node 18+) selects the correct Yarn version. Enable it once (may require admin on Windows):

```bash
corepack enable
```

Then install and run:

```bash
yarn install
yarn start
```

Open the app in the browser; use “Try now” for the playground or “Create note” to go to the app and create a notebook. No env vars required for local run.
