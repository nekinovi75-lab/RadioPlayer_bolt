import { create } from 'zustand';
import { RadioStation, parseCSV, generateCSV, downloadCSV } from '../utils/csvParser';

const persistStations = (stations: RadioStation[]) => {
  localStorage.setItem('radio-stations', JSON.stringify(stations));
};

interface StationsState {
  stations: RadioStation[];
  loading: boolean;
  error: string | null;
  loadStations: () => Promise<void>;
  addStation: (station: Omit<RadioStation, 'id'>) => void;
  editStation: (id: string, station: Omit<RadioStation, 'id'>) => void;
  deleteStation: (id: string) => void;
  exportStations: () => void;
  importStations: (file: File) => Promise<void>;
}

export const useStations = create<StationsState>()((set, get) => ({
  stations: [],
  loading: true,
  error: null,

  loadStations: async () => {
    try {
      const stored = localStorage.getItem('radio-stations');
      if (stored) {
        set({ stations: JSON.parse(stored), loading: false });
        return;
      }

      const response = await fetch('/stations.csv');

      if (!response.ok) {
        set({ loading: false });
        return;
      }

      const csvContent = await response.text();
      const parsedStations = parseCSV(csvContent);
      set({ stations: parsedStations, error: null, loading: false });
      persistStations(parsedStations);
    } catch {
      set({ error: 'Failed to load stations', loading: false });
    }
  },

  addStation: (station) => {
    const newStation: RadioStation = {
      ...station,
      id: `${Date.now()}-${Math.random()}`,
    };
    const updated = [...get().stations, newStation];
    set({ stations: updated });
    persistStations(updated);
  },

  editStation: (id, station) => {
    const updated = get().stations.map((s) => (s.id === id ? { ...station, id } : s));
    set({ stations: updated });
    persistStations(updated);
  },

  deleteStation: (id) => {
    const updated = get().stations.filter((s) => s.id !== id);
    set({ stations: updated });
    persistStations(updated);
  },

  exportStations: () => {
    const csv = generateCSV(get().stations);
    downloadCSV(csv);
  },

  importStations: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsedStations = parseCSV(content);

          if (parsedStations.length === 0) {
            reject(new Error('No valid stations found in file'));
            return;
          }

          const updated = [...get().stations, ...parsedStations];
          set({ stations: updated, error: null });
          persistStations(updated);
          resolve();
        } catch {
          reject(new Error('Failed to parse CSV file'));
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  },
}));

// Auto-load stations when the store is first created
useStations.getState().loadStations();

