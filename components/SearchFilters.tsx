'use client';

import { Filter } from 'lucide-react';
import { useState } from 'react';

interface SearchFiltersProps {
  onFilterChange: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  type: 'album' | 'artist' | 'track' | 'playlist';
  market?: string;
  limit: number;
}

export default function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'album',
    limit: 20
  });

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Filter className="w-4 h-4" />
        Filters
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-64 z-10">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange({ type: e.target.value as 'album' | 'artist' | 'track' | 'playlist' })}
                className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="album">Albums</option>
                <option value="artist">Artists</option>
                <option value="track">Tracks</option>
                <option value="playlist">Playlists</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Results Limit
              </label>
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange({ limit: parseInt(e.target.value) })}
                className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value={10}>10 results</option>
                <option value={20}>20 results</option>
                <option value={30}>30 results</option>
                <option value={50}>50 results</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Market (Optional)
              </label>
              <select
                value={filters.market || ''}
                onChange={(e) => handleFilterChange({ market: e.target.value || undefined })}
                className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Markets</option>
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="JP">Japan</option>
                <option value="BR">Brazil</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}