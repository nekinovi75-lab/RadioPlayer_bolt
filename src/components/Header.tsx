import React, { useState, useRef } from 'react';
import { useTheme } from '../stores/useThemeStore';
import { useViewMode } from '../stores/useViewModeStore';
import { useStations } from '../stores/useStationsStore';
import { useSearch } from '../stores/useSearchStore';
import { useFavorites } from '../stores/useFavoritesStore';
import { Sun, Moon, Grid3x3, List, Plus, Download, Upload, Search, X, Heart, Menu } from 'lucide-react';
import { toast } from 'sonner';
import { AddStationModal } from './AddStationModal';
import { ThemeSelector } from './ThemeSelector';
import { themes } from '../config/themes';

export const Header: React.FC = () => {
  const { colorMode, designSystem, setColorMode, toggleColorMode, setDesignSystem } = useTheme();
  const { viewMode, toggleViewMode } = useViewMode();
  const { stations, exportStations, importStations } = useStations();
  const { searchQuery, setSearchQuery, categoryFilter, setCategoryFilter } = useSearch();
  const { showOnlyFavorites, setShowOnlyFavorites } = useFavorites();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['All', ...Array.from(new Set(stations.map(s => s.category))).sort()];

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await importStations(file);
      if (result.imported > 0 || result.skipped > 0) {
        toast.success('Import complete!', {
          description: `Imported: ${result.imported} | Skipped: ${result.skipped}`
        });
      }
    } catch (error) {
      toast.error('Failed to import stations. Please check the file format.');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-t-header border-b border-t-border shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="w-10 h-10 rounded-lg bg-t-primary flex items-center justify-center shadow-md">
                <span className="text-t-text-on-primary text-xl font-bold">R</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-t-text hidden sm:block">
                Radio Player
              </h1>
            </div>

            <div className="flex-1 flex gap-2 sm:gap-4">
              <div className="relative flex-1 max-w-full sm:max-w-2xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-t-text-secondary" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Escape' && setSearchQuery('')}
                  placeholder="Search..."
                  className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2 text-sm sm:text-base border border-t-border rounded-lg bg-t-card text-t-text focus:ring-2 focus:ring-t-primary focus:border-transparent transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-t-text-secondary hover:text-t-text"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="hidden sm:block px-3 py-2 text-sm sm:text-base border border-t-border rounded-lg bg-t-card text-t-text focus:ring-2 focus:ring-t-primary focus:border-transparent transition-colors cursor-pointer"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <button
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`p-2 rounded-lg transition-colors ${showOnlyFavorites
                  ? 'bg-t-favorite text-t-text-on-primary hover:bg-t-favorite-hover'
                  : 'text-t-text-secondary hover:text-t-text hover:bg-t-card-hover'
                  }`}
                title={showOnlyFavorites ? 'Show all stations' : 'Show only favorites'}
              >
                <Heart className={`w-5 h-5 ${showOnlyFavorites ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={toggleViewMode}
                className="p-2 text-t-text-secondary hover:text-t-text hover:bg-t-card-hover rounded-lg transition-colors"
                title={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
              >
                {viewMode === 'grid' ? (
                  <List className="w-5 h-5" />
                ) : (
                  <Grid3x3 className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="hidden sm:flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-t-primary hover:bg-t-primary-hover text-t-text-on-primary rounded-lg transition-colors shadow-md font-medium text-sm sm:text-base"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden md:inline">Add</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleImport}
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="hidden sm:flex p-2 text-t-text-secondary hover:text-t-text hover:bg-t-card-hover rounded-lg transition-colors"
                title="Import CSV"
              >
                <Upload className="w-5 h-5" />
              </button>

              <button
                onClick={exportStations}
                className="hidden sm:flex p-2 text-t-text-secondary hover:text-t-text hover:bg-t-card-hover rounded-lg transition-colors"
                title="Export CSV"
              >
                <Download className="w-5 h-5" />
              </button>

              <ThemeSelector />

              <button
                onClick={toggleColorMode}
                className="hidden sm:flex p-2 text-t-text-secondary hover:text-t-text hover:bg-t-card-hover rounded-lg transition-colors"
                title={colorMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {colorMode === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              <div className="relative sm:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-t-text-secondary hover:text-t-text hover:bg-t-card-hover rounded-lg transition-colors"
                  title="Menu"
                >
                  <Menu className="w-5 h-5" />
                </button>

                {isMobileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-t-card border border-t-border rounded-lg shadow-lg z-50">
                    <button
                      onClick={() => {
                        setIsModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-t-text hover:bg-t-card-hover text-left transition-colors border-b border-t-border"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Add Station</span>
                    </button>

                    <button
                      onClick={() => {
                        fileInputRef.current?.click();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-t-text hover:bg-t-card-hover text-left transition-colors border-b border-t-border"
                    >
                      <Upload className="w-5 h-5" />
                      <span>Import CSV</span>
                    </button>

                    <button
                      onClick={() => {
                        exportStations();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-t-text hover:bg-t-card-hover text-left transition-colors border-b border-t-border"
                    >
                      <Download className="w-5 h-5" />
                      <span>Export CSV</span>
                    </button>

                    <select
                      value={categoryFilter}
                      onChange={(e) => {
                        setCategoryFilter(e.target.value);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 text-t-text bg-t-card text-left transition-colors border-b border-t-border"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>

                    <div className="border-t border-t-border pt-2">
                      <p className="text-xs font-semibold text-t-text-secondary px-4 py-2 uppercase tracking-wide">Theme</p>
                      <div className="space-y-1 px-2 pb-2">
                        {themes.map(theme => (
                          <button
                            key={theme.id}
                            onClick={() => {
                              setDesignSystem(theme.id);
                              setIsMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${designSystem === theme.id
                              ? 'bg-t-primary-subtle text-t-primary'
                              : 'text-t-text hover:bg-t-card-hover'
                              }`}
                          >
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: theme.accentColor }}
                            />
                            {theme.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setColorMode(colorMode === 'light' ? 'dark' : 'light');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-t-text hover:bg-t-card-hover text-left transition-colors border-t border-t-border"
                    >
                      {colorMode === 'light' ? (
                        <>
                          <Moon className="w-5 h-5" />
                          <span>Dark Mode</span>
                        </>
                      ) : (
                        <>
                          <Sun className="w-5 h-5" />
                          <span>Light Mode</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <AddStationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
