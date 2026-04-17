# Guardz Podz Pointz 🏆

Gamification sales competition dashboard for Guardz. Built with React + Vite, deployable to Netlify.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Build & Deploy

```bash
npm run build
```

This creates a `dist/` folder. Push to GitHub and connect to Netlify for auto-deploys.

### Netlify Setup
1. Connect your GitHub repo in Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. The `netlify.toml` handles SPA routing automatically

## Updating Data

All data lives in `src/data.js`. To update for a new quarter:

1. Add the quarter to `QUARTERS`:
```js
{ id: 'q3-2026', label: 'Q3 2026', year: 2026, quarter: 'Q3' },
```

2. Add pod stats to `POD_STATS_RAW`:
```js
'q3-2026': [
  { teamId: 'dream-team', bql: 35, sql: 9, activeTrial: 20, closedWon: 4 },
  // ...
],
```

3. Add SDR stats to `SDR_STATS_RAW`:
```js
'q3-2026': [
  { personId: 'rafaela', bql: 16, sql: 8, activeTrial: 30, closedWon: 3, connects: 80 },
  // ...
],
```

## Adding/Editing People or Teams

Edit `PEOPLE` and `TEAMS` in `src/data.js`.

## Admin Panel

- Click **⚙ Admin** in the nav
- Default password: `guardz2026`
- Upload photos for each SDR/AE — stored locally in the browser
- **For production**: Change `DEFAULT_ADMIN_HASH` in `src/data.js` and use a real auth system

## Point System

| Action       | Points |
|-------------|--------|
| BQL         | 1      |
| SQL         | 2      |
| Active Trial| 2      |
| Closed Won  | 5      |

Edit `POINT_WEIGHTS` in `src/data.js` to change the formula.

## Tech Stack

- React 18
- Vite
- Recharts (charts)
- Lucide React (icons)
- Google Fonts: Syne + DM Sans
