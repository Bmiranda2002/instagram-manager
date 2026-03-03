# Instagram Manager (Lord Mord)

A dark-themed React + TypeScript web app to manage Instagram strategy with local persistence.

## Features

- **Notes** tab for doctrine/strategy logging
- **Profile Analytics** with manual snapshots + trendline
- **Accounts of Interest** tracker (manual competitor/account watch)
- **Ideas for Posts** quick capture list
- **Caption Ideas** stash
- **Best Times to Post** scoring + top windows
- All data persists in `localStorage`

## Tech

- Vite
- React + TypeScript
- CSS (custom dark UI)

## Run locally

```bash
npm install
npm run dev
```

Then open the localhost URL shown by Vite.

## Build

```bash
npm run build
npm run preview
```

## Deploy

### Vercel
1. Push this repo to GitHub.
2. Import project in Vercel.
3. Framework preset: **Vite**.
4. Build command: `npm run build`
5. Output directory: `dist`

### Netlify
1. New site from GitHub.
2. Build command: `npm run build`
3. Publish directory: `dist`

## Notes

- This version is intentionally manual-entry first (no direct Instagram API integration).
- Next step can be adding backend sync, team accounts, and automated import pipelines.
