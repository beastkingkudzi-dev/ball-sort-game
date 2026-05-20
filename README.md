# Ball Sort Puzzle

A browser-based ball sorting puzzle game. Sort colored balls into tubes so each tube holds one color (or stays empty).

## Play locally

```bash
cd ball-sort-game
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
```

Output is in `dist/`. Preview the production build:

```bash
npm run preview
```

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. In the repo: **Settings → Pages → Build and deployment → Source**: choose **GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) builds and deploys `dist/` on every push to `main`.
4. Your game will be at `https://<username>.github.io/<repo-name>/`

`vite.config.ts` uses `base: './'` so assets work on project subpaths.

### Manual deploy (alternative)

```bash
npm run build
# Push dist/ contents to gh-pages branch, or use:
npx gh-pages -d dist
```

## Deploy to Netlify

1. Connect your GitHub repo at [netlify.com](https://www.netlify.com).
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy.

## Features

- 15 preset levels (easy → expert)
- Procedural random levels (guaranteed solvable via scramble-from-solved)
- Move counter and undo
- Local high scores (`localStorage`, per level)
- Responsive layout for mobile and desktop

## How to play

1. Click a tube to select the top ball.
2. Click another tube to move it there (same color on top, or empty tube; destination must have space).
3. Click the same tube again to deselect.
4. Win when every non-empty tube is full of one color.
