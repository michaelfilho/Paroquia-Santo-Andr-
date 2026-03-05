import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ImageWithFallback } from './figma/image';
import { resolveAssetUrl } from '../src/services/assetUrl';

interface EventGalleryProps {
  eventId: string;
  onClose: () => void;
}

interface Photo {
  id: string;
  filename: string;
  path: string;
}

export function EventGallery({ eventId, onClose }: EventGalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPhotos();
  }, [eventId]);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/public/event-photos/${eventId}`);
      if (response.ok) {
        const data = await response.json();
        setPhotos(data);
      }
    } catch (error) {
      console.error('Erro ao carregar fotos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 animate-in fade-in duration-300">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-10 hover:scale-110 backdrop-blur-sm border border-white/20"
        aria-label="Fechar galeria"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Gallery Content */}
      <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
        <h3 className="text-3xl font-bold text-white mb-8 text-center">
          Galeria de Fotos
        </h3>
        
        {loading ? (
          <div className="text-center text-white py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="mt-4">Carregando fotos...</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center text-white py-12">
            <p className="text-xl">Nenhuma foto disponível para este evento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="group aspect-square rounded-2xl overflow-hidden bg-gray-800 hover:scale-105 transition-all duration-500 cursor-pointer shadow-xl hover:shadow-2xl border border-white/10"
              >
                <ImageWithFallback
                  src={resolveAssetUrl(photo.path)}
                  alt={`Foto ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-10 py-4 rounded-full font-semibold transition-all inline-flex items-center space-x-2 shadow-xl hover:shadow-2xl hover:scale-105"
          >
            <span>Fechar Galeria</span>
          </button>
        </div>
      </div>
    </div>
  );
}