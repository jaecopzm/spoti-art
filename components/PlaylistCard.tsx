'use client';

import { Download, ExternalLink, Users, Music, Eye, Copy } from 'lucide-react';
import { SpotifyPlaylist } from '../types/spotify';
import { useState } from 'react';

interface PlaylistCardProps {
  playlist: SpotifyPlaylist;
  onPreview?: (playlist: any) => void;
}

export default function PlaylistCard({ playlist, onPreview }: PlaylistCardProps) {
  const [downloading, setDownloading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  const largestImage = playlist.images?.reduce((largest, current) => 
    current.width > largest.width ? current : largest
  );

  const handleDownload = async () => {
    if (!largestImage?.url) return;
    
    setDownloading(true);
    try {
      const filename = `${playlist.owner.display_name} - ${playlist.name} (Playlist).jpg`
        .replace(/[^a-zA-Z0-9\s-_.()]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      const response = await fetch(`/api/download?url=${encodeURIComponent(largestImage.url)}&filename=${encodeURIComponent(filename)}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download image. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(playlist.external_urls.spotify);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
      alert('Failed to copy URL to clipboard');
    }
  };

  // Create a mock album object for preview
  const mockAlbum = {
    id: playlist.id,
    name: playlist.name,
    artists: [{ id: playlist.owner.id, name: playlist.owner.display_name, type: 'user', uri: '' }],
    images: playlist.images || [],
    release_date: '',
    total_tracks: playlist.tracks.total,
    type: 'playlist',
    uri: playlist.uri,
    external_urls: playlist.external_urls
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative aspect-square bg-gray-100">
        {largestImage ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            )}
            <img
              src={largestImage.url}
              alt={`${playlist.name} cover`}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400">
            <Music className="w-16 h-16 text-white/80" />
          </div>
        )}
        
        <div className="absolute top-3 right-3 flex gap-2">
          {largestImage && (
            <>
              <button
                onClick={() => onPreview?.(mockAlbum)}
                className="bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-colors"
                title="Preview playlist art"
              >
                <Eye className="w-5 h-5" />
              </button>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-colors disabled:opacity-50"
                title="Download playlist art"
              >
                {downloading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Download className="w-5 h-5" />
                )}
              </button>
            </>
          )}
        </div>
        
        {/* Playlist indicator */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-purple-600/80 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <Music className="w-3 h-3" />
            Playlist
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">
          {playlist.name}
        </h3>
        <p className="text-gray-600 mb-3 line-clamp-1">
          by {playlist.owner.display_name}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Music className="w-4 h-4" />
            <span>{playlist.tracks.total} tracks</span>
          </div>
          {playlist.followers && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{playlist.followers.total.toLocaleString()}</span>
            </div>
          )}
        </div>
        
        {playlist.description && (
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">
            {playlist.description}
          </p>
        )}
        
        <div className="space-y-2">
          {largestImage && (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onPreview?.(mockAlbum)}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 text-sm min-w-0"
              >
                <Eye className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline truncate">Preview</span>
              </button>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-2 px-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 text-sm min-w-0"
              >
                {downloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white flex-shrink-0"></div>
                    <span className="hidden sm:inline truncate">Downloading...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden sm:inline truncate">Download</span>
                  </>
                )}
              </button>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopyUrl}
              className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 text-sm min-w-0"
            >
              <Copy className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{copied ? 'Copied!' : 'Copy URL'}</span>
            </button>
            <a
              href={playlist.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium min-w-0"
              title="Open in Spotify"
            >
              <ExternalLink className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Open</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}