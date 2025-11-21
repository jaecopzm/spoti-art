'use client';

import { useState } from 'react';
import { Music2, AlertCircle } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import AlbumCard from '../components/AlbumCard';
import TrackCard from '../components/TrackCard';
import PlaylistCard from '../components/PlaylistCard';
import SearchFilters, { SearchFilters as SearchFiltersType } from '../components/SearchFilters';
import ImagePreview from '../components/ImagePreview';
import RecentSearches from '../components/RecentSearches';
import { SpotifySearchResponse, SpotifyAlbum } from '../types/spotify';

export default function Home() {
  const [searchResults, setSearchResults] = useState<SpotifySearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFiltersType>({ type: 'album', limit: 20 });
  const [previewAlbum, setPreviewAlbum] = useState<SpotifyAlbum | null>(null);
  const [lastQuery, setLastQuery] = useState<string>('');

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    setLastQuery(query);
    
    // Add to recent searches
    if (typeof window !== 'undefined' && (window as any).addRecentSearch) {
      (window as any).addRecentSearch(query);
    }
    
    try {
      let searchUrl = `/api/spotify/search?q=${encodeURIComponent(query)}&type=${filters.type}&limit=${filters.limit}`;
      if (filters.market) {
        searchUrl += `&market=${filters.market}`;
      }
      
      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Search failed');
      }
      
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: SearchFiltersType) => {
    setFilters(newFilters);
    // Re-search with new filters if we have a previous query
    if (lastQuery) {
      handleSearch(lastQuery);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music2 className="w-10 h-10 text-green-500" />
            <h1 className="text-4xl font-bold text-gray-900">
              Spotify Album Art Downloader
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search for your favorite albums and download high-quality album artwork instantly
          </p>
        </div>

        {/* Search Bar and Filters */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <SearchBar onSearch={handleSearch} loading={loading} />
          <SearchFilters onFilterChange={handleFilterChange} />
          {!searchResults && !loading && (
            <RecentSearches onSearchSelect={handleSearch} />
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-medium">Search Error</p>
                <p className="text-red-600 text-sm">{error}</p>
                {error.includes('credentials') && (
                  <p className="text-red-600 text-sm mt-1">
                    Please make sure SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET are configured in your environment variables.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            <span className="ml-3 text-lg text-gray-600">Searching Spotify...</span>
          </div>
        )}

        {/* Search Results */}
        {searchResults && (
          <>
            {filters.type === 'album' && searchResults.albums?.items && searchResults.albums.items.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Found {searchResults.albums.items.length} albums
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {searchResults.albums.items.map((album) => (
                    <AlbumCard 
                      key={album.id} 
                      album={album} 
                      onPreview={setPreviewAlbum}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {filters.type === 'artist' && searchResults.artists?.items && searchResults.artists.items.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Found {searchResults.artists.items.length} artists
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {searchResults.artists.items.map((artist) => (
                    <div key={artist.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <div className="aspect-square bg-gray-100">
                        {artist.images[0] && (
                          <img
                            src={artist.images[0].url}
                            alt={artist.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg">{artist.name}</h3>
                        <p className="text-gray-600">{artist.followers?.total.toLocaleString()} followers</p>
                        <a
                          href={artist.external_urls.spotify}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 block bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-center transition-colors"
                        >
                          Open in Spotify
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filters.type === 'track' && searchResults.tracks?.items && searchResults.tracks.items.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Found {searchResults.tracks.items.length} tracks
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {searchResults.tracks.items.map((track) => (
                    <TrackCard 
                      key={track.id} 
                      track={track} 
                      onPreview={setPreviewAlbum}
                    />
                  ))}
                </div>
              </div>
            )}

            {filters.type === 'playlist' && searchResults.playlists?.items && searchResults.playlists.items.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Found {searchResults.playlists.items.length} playlists
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {searchResults.playlists.items.map((playlist) => (
                    <PlaylistCard 
                      key={playlist.id} 
                      playlist={playlist} 
                      onPreview={setPreviewAlbum}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {searchResults && (
          (filters.type === 'album' && (!searchResults.albums?.items || searchResults.albums.items.length === 0)) ||
          (filters.type === 'artist' && (!searchResults.artists?.items || searchResults.artists.items.length === 0)) ||
          (filters.type === 'track' && (!searchResults.tracks?.items || searchResults.tracks.items.length === 0)) ||
          (filters.type === 'playlist' && (!searchResults.playlists?.items || searchResults.playlists.items.length === 0))
        ) && (
          <div className="text-center py-12">
            <Music2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No {filters.type}s found</h3>
            <p className="text-gray-500">Try searching with different keywords or adjust your filters</p>
          </div>
        )}

        {/* Initial State */}
        {!searchResults && !loading && !error && (
          <div className="text-center py-12">
            <Music2 className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">Ready to search</h3>
            <p className="text-gray-500">Enter an album, artist, or song name to get started</p>
          </div>
        )}

        {/* Image Preview Modal */}
        {previewAlbum && (
          <ImagePreview
            album={previewAlbum}
            isOpen={!!previewAlbum}
            onClose={() => setPreviewAlbum(null)}
          />
        )}
      </div>
    </div>
  );
}
