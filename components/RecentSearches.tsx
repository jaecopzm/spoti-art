'use client';

import { Clock, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface RecentSearchesProps {
  onSearchSelect: (query: string) => void;
}

export default function RecentSearches({ onSearchSelect }: RecentSearchesProps) {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('spotify-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const addRecentSearch = (query: string) => {
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('spotify-recent-searches', JSON.stringify(updated));
  };

  const removeRecentSearch = (query: string) => {
    const updated = recentSearches.filter(s => s !== query);
    setRecentSearches(updated);
    localStorage.setItem('spotify-recent-searches', JSON.stringify(updated));
  };

  const clearAll = () => {
    setRecentSearches([]);
    localStorage.removeItem('spotify-recent-searches');
  };

  // Expose addRecentSearch to parent component
  useEffect(() => {
    (window as any).addRecentSearch = addRecentSearch;
  }, [recentSearches]);

  if (recentSearches.length === 0) return null;

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Recent Searches</span>
        </div>
        <button
          onClick={clearAll}
          className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          Clear all
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {recentSearches.map((search, index) => (
          <button
            key={index}
            onClick={() => onSearchSelect(search)}
            className="group flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm transition-colors"
          >
            <span>{search}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeRecentSearch(search);
              }}
              className="opacity-0 group-hover:opacity-100 hover:bg-gray-300 rounded-full p-0.5 transition-all"
            >
              <X className="w-3 h-3" />
            </button>
          </button>
        ))}
      </div>
    </div>
  );
}