import React, { createContext, useContext, useEffect, useState } from 'react';
import { RadioStation, parseCSV, generateCSV, downloadCSV } from '../utils/csvParser';

interface StationsContextType {
  stations: RadioStation[];
  loading: boolean;
  error: string | null;
  addStation: (station: Omit<RadioStation, 'id'>) => void;
  editStation: (id: string, station: Omit<RadioStation, 'id'>) => void;
  deleteStation: (id: string) => void;
  exportStations: () => void;
  importStations: (file: File) => Promise<void>;
}

const StationsContext = createContext<StationsContextType | undefined>(undefined);

export const StationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStations();
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('radio-stations', JSON.stringify(stations));
    }
  }, [stations, loading]);

  const loadStations = async () => {
    try {
      const stored = localStorage.getItem('radio-stations');
      if (stored) {
        setStations(JSON.parse(stored));
        setLoading(false);
        return;
      }

      const response = await fetch('/stations.csv');

      if (!response.ok) {
        setLoading(false);
        return;
      }

      const csvContent = await response.text();
      const parsedStations = parseCSV(csvContent);
      setStations(parsedStations);
      setError(null);
    } catch (err) {
      setError('Failed to load stations');
    } finally {
      setLoading(false);
    }
  };

  const addStation = (station: Omit<RadioStation, 'id'>) => {
    const newStation: RadioStation = {
      ...station,
      id: `${Date.now()}-${Math.random()}`
    };
    setStations(prev => [...prev, newStation]);
  };

  const editStation = (id: string, station: Omit<RadioStation, 'id'>) => {
    setStations(prev => prev.map(s => s.id === id ? { ...station, id } : s));
  };

  const deleteStation = (id: string) => {
    setStations(prev => prev.filter(s => s.id !== id));
  };

  const exportStations = () => {
    const csv = generateCSV(stations);
    downloadCSV(csv);
  };

  const importStations = async (file: File): Promise<void> => {
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

          setStations(prev => [...prev, ...parsedStations]);
          setError(null);
          resolve();
        } catch (err) {
          reject(new Error('Failed to parse CSV file'));
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  return (
    <StationsContext.Provider value={{
      stations,
      loading,
      error,
      addStation,
      editStation,
      deleteStation,
      exportStations,
      importStations
    }}>
      {children}
    </StationsContext.Provider>
  );
};

export const useStations = () => {
  const context = useContext(StationsContext);
  if (!context) {
    throw new Error('useStations must be used within StationsProvider');
  }
  return context;
};
