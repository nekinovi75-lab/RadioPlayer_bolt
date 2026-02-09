import React, { useState } from 'react';
import { useStations } from '../stores/useStationsStore';
import { X } from 'lucide-react';
import { toast } from 'sonner';

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

    const isDuplicate = useStations.getState().stations.some(
      s => s.url.toLowerCase() === url.trim().toLowerCase()
    );

    if (isDuplicate) {
      setErrors({ url: 'A station with this URL already exists' });
      toast.error('Duplicate station', {
        description: 'A station with this URL already exists in your list.'
      });
      return;
    }

    addStation({
      stationName: stationName.trim(),
      url: url.trim(),
      logo: logo.trim(),
      category: category
    });

    toast.success('Station added', {
      description: `"${stationName.trim()}" has been added to your stations.`
    });

    setStationName('');
    setUrl('');
    setLogo('');
    setCategory('Pop');
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[var(--overlay)] flex items-center justify-center z-50 p-4">
      <div className="bg-t-card rounded-xl shadow-2xl max-w-md w-full transform transition-all">
        <div className="flex items-center justify-between p-6 border-b border-t-border">
          <h2 className="text-2xl font-bold text-t-text">Add Radio Station</h2>
          <button
            onClick={onClose}
            className="text-t-text-secondary hover:text-t-text transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-t-text mb-2">
              Station Name *
            </label>
            <input
              type="text"
              value={stationName}
              onChange={(e) => setStationName(e.target.value)}
              className="w-full px-4 py-2 border border-t-border rounded-lg bg-t-bg text-t-text focus:ring-2 focus:ring-t-primary focus:border-transparent transition-colors"
              placeholder="BBC Radio 1"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-t-danger">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-t-text mb-2">
              Stream URL *
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-2 border border-t-border rounded-lg bg-t-bg text-t-text focus:ring-2 focus:ring-t-primary focus:border-transparent transition-colors"
              placeholder="https://stream.example.com/radio"
            />
            {errors.url && (
              <p className="mt-1 text-sm text-t-danger">{errors.url}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-t-text mb-2">
              Logo (optional)
            </label>
            <input
              type="text"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              className="w-full px-4 py-2 border border-t-border rounded-lg bg-t-bg text-t-text focus:ring-2 focus:ring-t-primary focus:border-transparent transition-colors"
              placeholder="bbc-radio1.svg or https://example.com/logo.png"
            />
            <p className="mt-1 text-xs text-t-text-secondary">
              Enter filename (from /images/logos/) or full URL
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-t-text mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-t-border rounded-lg bg-t-bg text-t-text focus:ring-2 focus:ring-t-primary focus:border-transparent transition-colors cursor-pointer"
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
              className="flex-1 px-4 py-2 border border-t-border text-t-text-secondary rounded-lg hover:bg-t-card-hover transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-t-primary hover:bg-t-primary-hover text-t-text-on-primary rounded-lg transition-colors shadow-md"
            >
              Add Station
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
