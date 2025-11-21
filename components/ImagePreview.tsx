'use client';

import { X, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { useState } from 'react';
import { SpotifyAlbum } from '../types/spotify';

interface ImagePreviewProps {
  album: SpotifyAlbum;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImagePreview({ album, isOpen, onClose }: ImagePreviewProps) {
  const [downloading, setDownloading] = useState(false);
  const [zoom, setZoom] = useState(1);

  if (!isOpen) return null;

  const largestImage = album.images.reduce((largest, current) => 
    current.width > largest.width ? current : largest
  );

  const handleDownload = async (size: 'small' | 'medium' | 'large' = 'large') => {
    setDownloading(true);
    try {
      let imageUrl = largestImage?.url;
      
      if (size === 'medium' && album.images[1]) {
        imageUrl = album.images[1].url;
      } else if (size === 'small' && album.images[2]) {
        imageUrl = album.images[2].url;
      }

      if (!imageUrl) return;

      const filename = `${album.artists[0]?.name} - ${album.name} (${size}).jpg`
        .replace(/[^a-zA-Z0-9\s-_.()]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      const response = await fetch(`/api/download?url=${encodeURIComponent(imageUrl)}&filename=${encodeURIComponent(filename)}`);
      
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
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download image. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="font-bold text-lg">{album.name}</h3>
            <p className="text-gray-600">{album.artists.map(a => a.name).join(', ')}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image */}
        <div className="relative overflow-hidden bg-gray-50" style={{ height: '60vh' }}>
          {largestImage && (
            <img
              src={largestImage.url}
              alt={`${album.name} cover`}
              className="w-full h-full object-contain transition-transform duration-200"
              style={{ transform: `scale(${zoom})` }}
            />
          )}
          
          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
              className="bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(Math.min(3, zoom + 0.25))}
              className="bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Download Options */}
        <div className="p-4 border-t">
          <h4 className="font-medium mb-3">Download Options</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {album.images.map((image, index) => {
              const sizeLabel = index === 0 ? 'Large' : index === 1 ? 'Medium' : 'Small';
              const sizeKey = index === 0 ? 'large' : index === 1 ? 'medium' : 'small';
              
              return (
                <button
                  key={index}
                  onClick={() => handleDownload(sizeKey as 'small' | 'medium' | 'large')}
                  disabled={downloading}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <div className="text-left">
                    <div className="font-medium">{sizeLabel}</div>
                    <div className="text-sm text-gray-500">{image.width} × {image.height}</div>
                  </div>
                  <Download className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}