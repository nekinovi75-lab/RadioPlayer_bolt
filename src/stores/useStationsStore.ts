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
  importStations: (file: File) => Promise<{ imported: number; skipped: number }>;
  resetStations: (keepCustom?: boolean) => Promise<void>;
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

      const baseUrl = import.meta.env.BASE_URL || '/';
      const response = await fetch(`${baseUrl}stations.csv`.replace(/\/+/g, '/'));

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
    const { stations } = get();
    const isDuplicate = stations.some(s => s.url.toLowerCase() === station.url.toLowerCase());

    if (isDuplicate) {
      set({ error: 'A station with this URL already exists' });
      return;
    }

    const newStation: RadioStation = {
      ...station,
      id: `${Date.now()}-${Math.random()}`,
    };
    const updated = [...stations, newStation];
    set({ stations: updated, error: null });
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

          const currentStations = get().stations;
          const existingUrls = new Set(currentStations.map(s => s.url.toLowerCase()));

          const newStations: RadioStation[] = [];
          let skipped = 0;

          parsedStations.forEach(station => {
            if (existingUrls.has(station.url.toLowerCase())) {
              skipped++;
            } else {
              newStations.push(station);
              existingUrls.add(station.url.toLowerCase()); // Prevent duplicates within the import file itself
            }
          });

          if (newStations.length > 0) {
            const updated = [...currentStations, ...newStations];
            set({ stations: updated, error: null });
            persistStations(updated);
          }

          resolve({ imported: newStations.length, skipped });
        } catch {
          reject(new Error('Failed to parse CSV file'));
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  },

  resetStations: async (keepCustom?: boolean) => {
    try {
      set({ loading: true });
      const baseUrl = import.meta.env.BASE_URL || '/';
      const response = await fetch(`${baseUrl}stations.csv`.replace(/\/+/g, '/'));

      if (!response.ok) {
        set({ loading: false, error: 'Failed to fetch default stations' });
        return;
      }

      const csvContent = await response.text();
      const defaultStations = parseCSV(csvContent);

      if (defaultStations.length === 0) {
        set({ loading: false, error: 'No default stations found. The file might be missing or corrupted.' });
        return;
      }

      let finalStations: RadioStation[];

      if (keepCustom) {
        const defaultUrls = new Set(defaultStations.map(s => s.url.toLowerCase()));
        const customStations = get().stations.filter(s => !defaultUrls.has(s.url.toLowerCase()));
        finalStations = [...defaultStations, ...customStations];
      } else {
        finalStations = defaultStations;
      }

      set({ stations: finalStations, error: null, loading: false });
      persistStations(finalStations);
    } catch {
      set({ error: 'Failed to reset stations', loading: false });
    }
  },
}));

// Auto-load stations when the store is first created
useStations.getState().loadStations();

