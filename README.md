# RadioPlayer_bolt

Internet Radio Player — a browser-based web app for streaming internet radio stations, built with React, TypeScript, and Tailwind CSS.

---

## Features Overview

### 🎵 Audio Playback
- Stream internet radio stations via HTML5 Audio API
- Play / pause toggle with loading and error states
- Volume control slider (persisted to localStorage)
- Fixed bottom audio player bar with station info and album art

### 📻 Station Management
- Load default stations from a bundled CSV file (`public/stations.csv`)
- Add new stations via modal form (name, stream URL, logo, category)
- Edit existing stations inline
- Delete stations
- CSV import / export for backup and bulk management

### ❤️ Favorites
- Mark stations as favorites (heart toggle)
- Filter view to show only favorites
- Favorites persisted to localStorage

### 🔍 Search & Filter
- Real-time text search across station names
- Category dropdown filter (auto-populated from station data)

### 🎨 Theming
- **5 design themes**: Blueprint, Ember, Forest, Nightfall, Mint
- Light / dark color mode toggle for each theme
- Theme and color mode persisted to localStorage
- CSS custom properties power all theme tokens

### 🖥️ View Modes
- Grid view (card layout) and List view toggle
- View mode persisted to localStorage

### ⏰ Sleep Timer
- Preset durations: 15, 30, 45, 60 minutes
- Custom duration input (1–480 min)
- Countdown display in the player bar
- Auto-pauses playback when timer expires

### ⌨️ Keyboard Shortcuts
- `Space` — Play / Pause
- `↑` / `↓` — Volume up / down
- `←` / `→` — Previous / Next station
- Shortcuts modal accessible from the player bar

### 📱 Responsive Design
- Mobile-first layout with collapsible hamburger menu
- Touch-friendly controls and adaptive sizing

---

## Tech Spec

### Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (functional components, hooks) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + CSS custom properties |
| Icons | Lucide React |
| Build tool | Vite 5 |
| Linting | ESLint 9 + typescript-eslint |
| Package manager | npm |

### Project Structure

```
├── public/
│   ├── images/            # Station logos
│   └── stations.csv       # Default station list
├── src/
│   ├── components/        # UI components
│   │   ├── AddStationModal.tsx
│   │   ├── AudioPlayer.tsx
│   │   ├── EditStationModal.tsx
│   │   ├── Header.tsx
│   │   ├── KeyboardShortcutsModal.tsx
│   │   ├── SleepTimerModal.tsx
│   │   ├── StationCard.tsx
│   │   ├── StationListItem.tsx
│   │   ├── StationsDisplay.tsx
│   │   └── ThemeSelector.tsx
│   ├── config/
│   │   └── themes.ts      # Theme definitions
│   ├── contexts/          # React Context providers
│   │   ├── FavoritesContext.tsx
│   │   ├── PlayerContext.tsx
│   │   ├── SearchContext.tsx
│   │   ├── SleepTimerContext.tsx
│   │   ├── StationsContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── ViewModeContext.tsx
│   ├── hooks/
│   │   └── useKeyboardShortcuts.ts
│   ├── utils/
│   │   └── csvParser.ts   # CSV parse / generate / download
│   ├── App.tsx            # Root component with provider tree
│   ├── main.tsx           # Entry point
│   └── index.css          # Theme CSS variables + base styles
├── supabase/
│   └── migrations/        # Supabase DB migrations (legacy)
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

### Architecture

- **State management** — 7 React Context providers composed in `App.tsx`, no external state library.
- **Data model** — `RadioStation { id, stationName, url, logo, category }` defined in `csvParser.ts`.
- **Persistence** — All user data (stations, favorites, volume, theme, view mode) stored in `localStorage`.
- **Theming** — CSS custom properties (`--primary`, `--bg`, `--card`, etc.) defined per theme × color mode in `index.css`; consumed via Tailwind utility classes mapped in `tailwind.config.js` (`t-*` prefix).
- **Audio** — Single `HTMLAudioElement` instance managed by `PlayerContext`; event listeners track `playing`, `pause`, `waiting`, `error` states.

### Data Flow

```
stations.csv → fetch → parseCSV() → StationsContext (state)
                                          ↓
                                    localStorage (persist)
                                          ↓
                        StationsDisplay → StationCard / StationListItem
                                          ↓
                                    PlayerContext → AudioPlayer (HTML5 Audio)
```

### Scripts

```bash
npm run dev        # Start Vite dev server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run typecheck  # TypeScript type checking
```

### CSV Format

```csv
StationName,Url,Logo,Category
Smooth FM,https://media-ssl.musicradio.com/SmoothUK,smooth-fm.svg,Jazz
```

- **StationName** — Display name
- **Url** — Audio stream URL (HTTP/HTTPS)
- **Logo** — Filename in `public/images/logos/` or full URL
- **Category** — Genre tag used for filtering
