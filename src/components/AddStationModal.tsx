import React, { useState } from 'react';
import { useStations } from '../contexts/StationsContext';
import { X } from 'lucide-react';

interface AddStationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddStationModal: React.FC<AddStationModalProps> = ({ isOpen, onClose }) => {
  const { addStation } = useStations();
  const [stationName, setStationName] = useState('');
  const [url, setUrl] = useState('');
  const [logo, setLogo] = useState('');
  const [category, setCategory] = useState('Pop');
  const [errors, setErrors] = useState<{ name?: string; url?: string }>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: { name?: string; url?: string } = {};

    if (!stationName.trim()) {
      newErrors.name = 'Station name is required';
    }

    if (!url.trim()) {
      newErrors.url = 'Stream URL is required';
    } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
      newErrors.url = 'URL must start with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    addStation({
      stationName: stationName.trim(),
      url: url.trim(),
      logo: logo.trim(),
      category: category
    });

    setStationName('');
    setUrl('');
    setLogo('');
    setCategory('Pop');
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-theme-card rounded-xl shadow-2xl max-w-md w-full transform transition-all">
        <div className="flex items-center justify-between p-6 border-b border-theme-border">
          <h2 className="text-2xl font-bold text-theme-text">Add Radio Station</h2>
          <button
            onClick={onClose}
            className="text-theme-text opacity-40 hover:opacity-70 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-theme-text opacity-80 mb-2">
              Station Name *
            </label>
            <input
              type="text"
              value={stationName}
              onChange={(e) => setStationName(e.target.value)}
              className="w-full px-4 py-2 border border-theme-border rounded-lg bg-theme-bg text-theme-text focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              placeholder="BBC Radio 1"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-theme-text opacity-80 mb-2">
              Stream URL *
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-2 border border-theme-border rounded-lg bg-theme-bg text-theme-text focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              placeholder="https://stream.example.com/radio"
            />
            {errors.url && (
              <p className="mt-1 text-sm text-red-500">{errors.url}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-theme-text opacity-80 mb-2">
              Logo (optional)
            </label>
            <input
              type="text"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              className="w-full px-4 py-2 border border-theme-border rounded-lg bg-theme-bg text-theme-text focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              placeholder="bbc-radio1.svg or https://example.com/logo.png"
            />
            <p className="mt-1 text-xs text-theme-text opacity-60">
              Enter filename (from /images/logos/) or full URL
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-theme-text opacity-80 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-theme-border rounded-lg bg-theme-bg text-theme-text focus:ring-2 focus:ring-primary focus:border-transparent transition-colors cursor-pointer"
            >
              <option value="Pop">Pop</option>
              <option value="Rock">Rock</option>
              <option value="Jazz">Jazz</option>
              <option value="Classical">Classical</option>
              <option value="Electronic">Electronic</option>
              <option value="Hip Hop">Hip Hop</option>
              <option value="Country">Country</option>
              <option value="R&B">R&B</option>
              <option value="Indie">Indie</option>
              <option value="Metal">Metal</option>
              <option value="Reggae">Reggae</option>
              <option value="Latin">Latin</option>
              <option value="Blues">Blues</option>
              <option value="Folk">Folk</option>
              <option value="Chill">Chill</option>
              <option value="Retro">Retro</option>
              <option value="Talk">Talk</option>
              <option value="News">News</option>
              <option value="Sports">Sports</option>
              <option value="Regional">Regional</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-theme-border text-theme-text opacity-80 rounded-lg hover:bg-theme-bg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors shadow-md"
            >
              Add Station
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
