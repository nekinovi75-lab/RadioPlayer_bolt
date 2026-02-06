import React, { useState, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useViewMode } from '../contexts/ViewModeContext';
import { useStations } from '../contexts/StationsContext';
import { useSearch } from '../contexts/SearchContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { Sun, Moon, Grid3x3, List, Plus, Download, Upload, Search, X, Heart, Menu, Palette } from 'lucide-react';
import { AddStationModal } from './AddStationModal';
import { ThemeSelector } from './ThemeSelector';
import { themes } from '../config/themes';

export const Header: React.FC = () => {
  const { colorMode, designSystem, setColorMode, setDesignSystem } = useTheme();
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
      await importStations(file);
    } catch (error) {
      alert('Failed to import stations. Please check the file format.');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-theme-card border-b border-theme-border shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-md">
                <span className="text-white text-xl font-bold">R</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-theme-text hidden sm:block">
                Radio Player
              </h1>
            </div>

            <div className="flex-1 flex gap-2 sm:gap-4">
              <div className="relative flex-1 max-w-full sm:max-w-2xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-theme-text opacity-40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Escape' && setSearchQuery('')}
                  placeholder="Search..."
                  className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2 text-sm sm:text-base border border-theme-border rounded-lg bg-theme-card text-theme-text placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-text opacity-40 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="hidden sm:block px-3 py-2 text-sm sm:text-base border border-theme-border rounded-lg bg-theme-card text-theme-text focus:ring-2 focus:ring-primary focus:border-transparent transition-colors cursor-pointer"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <button
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`p-2 rounded-lg transition-colors ${
                  showOnlyFavorites
                    ? 'bg-pink-500 text-white hover:bg-pink-600'
                    : 'text-theme-text opacity-60 hover:text-gray-900 dark:hover:text-white hover:bg-theme-bg'
                }`}
                title={showOnlyFavorites ? 'Show all stations' : 'Show only favorites'}
              >
                <Heart className={`w-5 h-5 ${showOnlyFavorites ? 'fill-white' : ''}`} />
              </button>

              <button
                onClick={toggleViewMode}
                className="p-2 text-theme-text opacity-60 hover:text-gray-900 dark:hover:text-white hover:bg-theme-bg rounded-lg transition-colors"
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
                className="hidden sm:flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors shadow-md font-medium text-sm sm:text-base"
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
                className="hidden sm:flex p-2 text-theme-text opacity-60 hover:text-gray-900 dark:hover:text-white hover:bg-theme-bg rounded-lg transition-colors"
                title="Import CSV"
              >
                <Upload className="w-5 h-5" />
              </button>

              <button
                onClick={exportStations}
                className="hidden sm:flex p-2 text-theme-text opacity-60 hover:text-gray-900 dark:hover:text-white hover:bg-theme-bg rounded-lg transition-colors"
                title="Export CSV"
              >
                <Download className="w-5 h-5" />
              </button>

              <ThemeSelector />

              <div className="relative sm:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-theme-text opacity-60 hover:text-gray-900 dark:hover:text-white hover:bg-theme-bg rounded-lg transition-colors"
                  title="Menu"
                >
                  <Menu className="w-5 h-5" />
                </button>

                {isMobileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-theme-card border border-theme-border rounded-lg shadow-lg z-50">
                    <button
                      onClick={() => {
                        setIsModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-theme-text hover:bg-theme-bg text-left transition-colors border-b border-theme-border"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Add Station</span>
                    </button>

                    <button
                      onClick={() => {
                        fileInputRef.current?.click();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-theme-text hover:bg-theme-bg text-left transition-colors border-b border-theme-border"
                    >
                      <Upload className="w-5 h-5" />
                      <span>Import CSV</span>
                    </button>

                    <button
                      onClick={() => {
                        exportStations();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-theme-text hover:bg-theme-bg text-left transition-colors border-b border-theme-border"
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
                      className="w-full px-4 py-3 text-theme-text bg-theme-card text-left transition-colors border-b border-theme-border"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>

                    <div className="border-t border-theme-border pt-2">
                      <p className="text-xs font-semibold text-theme-text opacity-60 px-4 py-2 uppercase">Design System</p>
                      <div className="space-y-1 px-2 pb-2">
                        {themes.map(theme => (
                          <button
                            key={theme.id}
                            onClick={() => {
                              setDesignSystem(theme.id);
                              setIsMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${
                              designSystem === theme.id
                                ? 'bg-primary/20 text-primary-dark'
                                : 'text-theme-text hover:bg-theme-bg'
                            }`}
                          >
                            <div
                              className="w-3 h-3 rounded flex-shrink-0"
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
                      className="w-full flex items-center gap-2 px-4 py-3 text-theme-text hover:bg-theme-bg text-left transition-colors"
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
