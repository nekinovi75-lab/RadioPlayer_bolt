# History

## 2026-02-11 — Add Reset to Defaults Feature
**Description:** Added a reset button to restore default stations from `stations.csv`.
**Summary:** 
- Implemented `resetStations` in `useStationsStore.ts` to clear `localStorage` and re-fetch the default station list, with an optional `keepCustom` parameter.
- Added a "Reset to Defaults" button (using `RotateCcw` icon) to the Header in both desktop and mobile views.
- Enhanced `ConfirmDialog` to support an optional checkbox for user preferences.
- Integrated the "Keep custom stations" checkbox in the reset flow, dynamically adjusting the confirmation message and logic.
- Provided user feedback via `sonner` toast notifications tailored to the reset mode.

## 2026-02-08 — Migrate from React Context to Zustand
**Description:** Replaced all 7 React Context providers with Zustand global state stores.
**Summary:** Created 7 Zustand stores (`useSearchStore`, `useViewModeStore`, `useFavoritesStore`, `useThemeStore`, `usePlayerStore`, `useSleepTimerStore`, `useStationsStore`) in `src/stores/`. Rewired all 11 consumer files (App.tsx, 9 components, 1 hook) to import from stores instead of contexts. Removed the 7-deep provider nesting from App.tsx. Deleted all files in `src/contexts/`. Key improvements: no provider ordering dependency, cross-store communication via `getState()`, module-level `HTMLAudioElement` outside React render cycle, auto-loading stations at module level. TypeScript typecheck and production build pass clean.

## 2026-02-08 — README.md: Features overview & tech spec
**Description:** Analyzed the full codebase and wrote a comprehensive README.md.
**Summary:** Replaced the placeholder README with a features overview (audio playback, station management, favorites, search/filter, theming, view modes, sleep timer, keyboard shortcuts, responsive design) and a technical specification (stack, project structure, architecture, data flow, scripts, CSV format).

## 2026-02-08 — Visualizer Component & Integration
**Description:** Created a new animated bar visualizer component and integrated it into the AudioPlayer bar.
**Summary:** Implemented `Visualizer.tsx` and `Visualizer.css` featuring a 5-bar animated frequency display that responds to the `isPlaying` state. Integrated the component into `AudioPlayer.tsx` next to the station info, replacing the "Playing" text placeholder. Enhanced the UI with a pulse animation on the station logo when active.

## 2026-02-08 — Sonner Integration & Alert Replacement
**Description:** Replaced all browser native alerts and confirmation feedback with `sonner` toast notifications.
**Summary:** 
- Installed `sonner` and added `<Toaster />` to `App.tsx`.
- Replaced `alert()` in `Header.tsx` for CSV import success/error messages.
- Added success/info toasts for station addition, deletion, editing, favoriting, theme switching, and sleep timer settings.
- Improved UX by providing non-blocking, beautiful notifications for all user actions.
## 2026-02-08 — Duplicate Prevention & Import Summary
**Description:** Enhanced CSV import and manual station addition to prevent duplicate entries based on Stream URL.
**Summary:** 
- Modified `useStationsStore.ts` to check for existing URLs during import and return a summary of imported/skipped counts.
- Updated `Header.tsx` to display a detailed alert message after CSV imports (e.g., "Imported: 5, Skipped: 2").
- Added duplicate validation to `AddStationModal.tsx` to prevent adding existing URLs through the UI.
- Ensured case-insensitive URL comparison for robust detection.

## 2026-02-08 — Custom Native Confirm Dialog
**Description:** Replaced the browser native `confirm()` with a custom React component using the native HTML `<dialog>` element.
**Summary:** 
- Created `ConfirmDialog.tsx` as a reusable component using the `<dialog>` element for better accessibility and styling.
- Replaced native `confirm()` calls in `StationCard.tsx` and `StationListItem.tsx` with the new component.
- Added smooth scale and fade animations for the dialog backdrop and content.
- Integrated `sonner` notifications as follow-up feedback after confirmed deletions.



## 2026-02-08 — Fix: Export definitions and Typecheck Cleanup
**Description:** Resolved TypeScript module export errors and cleaned up unused code for a green build.
**Summary:** Fixed "no exported member 'VisualizerProps'" by adding the `export` keyword to the interface in `Visualizer.tsx`. Optimized `src/utils/csvParser.ts` by removing an unused `headers` variable that was causing lint errors. Verified project health with `npm run typecheck`.


