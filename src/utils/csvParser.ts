export interface RadioStation {
  id: string;
  stationName: string;
  url: string;
  logo: string;
  category: string;
}

export const parseCSV = (csvContent: string): RadioStation[] => {
  const lines = csvContent.trim().split('\n');

  if (lines.length < 2) {
    return [];
  }

  // const headers = lines[0].split(',').map(h => h.trim());
  const stations: RadioStation[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());

    if (values.length >= 3 && values[0] && values[1]) {
      stations.push({
        id: `${Date.now()}-${i}`,
        stationName: values[0],
        url: values[1],
        logo: values[2] || '',
        category: values[3] || 'Other'
      });
    }
  }

  return stations;
};

export const generateCSV = (stations: RadioStation[]): string => {
  const header = 'StationName,Url,Logo,Category\n';
  const rows = stations.map(station =>
    `${station.stationName},${station.url},${station.logo},${station.category}`
  ).join('\n');

  return header + rows;
};

export const downloadCSV = (csvContent: string, filename: string = 'stations.csv') => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

export const getLogoPath = (logoFilename: string): string => {
  if (!logoFilename) return '/images/logos/default-logo.svg';
  if (logoFilename.startsWith('http')) return logoFilename;
  return `/images/logos/${logoFilename}`;
};
