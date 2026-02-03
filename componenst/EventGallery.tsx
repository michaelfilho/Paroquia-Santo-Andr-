import { X } from 'lucide-react';
import { useEffect } from 'react';
import { ImageWithFallback } from './figma/image';

interface EventGalleryProps {
  eventId: string;
  onClose: () => void;
}

export function EventGallery({ eventId, onClose }: EventGalleryProps) {
  // Mock photos for different events
  const eventPhotos: Record<string, string[]> = {
    '1': [
      'https://images.unsplash.com/photo-1765947382522-ca6d359af08c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjBldmVudCUyMGdhdGhlcmluZyUyMHBlb3BsZXxlbnwxfHx8fDE3Njk5NjQwMTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1769230361430-c16dd21fc1c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWxpZ2lvdXMlMjBjZXJlbW9ueSUyMGNlbGVicmF0aW9ufGVufDF8fHx8MTc2OTk2NDAxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1768776179834-93e6cafc6d97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBldmVudCUyMG91dGRvb3J8ZW58MXx8fHwxNzY5OTY0MDExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1621610212492-210f948fa466?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRob2xpYyUyMGNodXJjaCUyMGJ1aWxkaW5nJTIwZXh0ZXJpb3J8ZW58MXx8fHwxNzY5OTY0MDEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1765947382522-ca6d359af08c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjBldmVudCUyMGdhdGhlcmluZyUyMHBlb3BsZXxlbnwxfHx8fDE3Njk5NjQwMTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1769230361430-c16dd21fc1c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWxpZ2lvdXMlMjBjZXJlbW9ueSUyMGNlbGVicmF0aW9ufGVufDF8fHx8MTc2OTk2NDAxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    ],
    '2': [
      'https://images.unsplash.com/photo-1768776179834-93e6cafc6d97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBldmVudCUyMG91dGRvb3J8ZW58MXx8fHwxNzY5OTY0MDExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1765947382522-ca6d359af08c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjBldmVudCUyMGdhdGhlcmluZyUyMHBlb3BsZXxlbnwxfHx8fDE3Njk5NjQwMTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1769230361430-c16dd21fc1c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWxpZ2lvdXMlMjBjZXJlbW9ueSUyMGNlbGVicmF0aW9ufGVufDF8fHx8MTc2OTk2NDAxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1768776179834-93e6cafc6d97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBldmVudCUyMG91dGRvb3J8ZW58MXx8fHwxNzY5OTY0MDExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    ],
  };

  const photos = eventPhotos[eventId] || eventPhotos['1'];

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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="group aspect-square rounded-2xl overflow-hidden bg-gray-800 hover:scale-105 transition-all duration-500 cursor-pointer shadow-xl hover:shadow-2xl border border-white/10"
            >
              <ImageWithFallback
                src={photo}
                alt={`Foto ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}
        </div>

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