import { ThemeProvider } from './contexts/ThemeContext';
import { StationsProvider } from './contexts/StationsContext';
import { PlayerProvider } from './contexts/PlayerContext';
import { SleepTimerProvider } from './contexts/SleepTimerContext';
import { ViewModeProvider } from './contexts/ViewModeContext';
import { SearchProvider } from './contexts/SearchContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { Header } from './components/Header';
import { StationsDisplay } from './components/StationsDisplay';
import { AudioPlayer } from './components/AudioPlayer';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function AppContent() {
  useKeyboardShortcuts();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors">
      <Header />

      <main className="flex-1 overflow-y-auto pb-24 sm:pb-32">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          <StationsDisplay />
        </div>
      </main>

      <AudioPlayer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <StationsProvider>
        <FavoritesProvider>
          <PlayerProvider>
            <SleepTimerProvider>
              <ViewModeProvider>
                <SearchProvider>
                  <AppContent />
                </SearchProvider>
              </ViewModeProvider>
            </SleepTimerProvider>
          </PlayerProvider>
        </FavoritesProvider>
      </StationsProvider>
    </ThemeProvider>
  );
}

export default App;
