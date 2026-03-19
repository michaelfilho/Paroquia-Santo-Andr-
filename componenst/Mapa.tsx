import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { ImageWithFallback } from './figma/image';
import { chapelsAPI, contentAPI } from '../src/services/api';
import { resolveAssetUrl } from '../src/services/assetUrl';

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '/api' : 'https://admin.paroquiataruma.com/api');
const backendOrigin = rawApiBaseUrl.replace(/\/+$/, '').replace(/\/api$/, '');

interface Chapel {
  id: string | number;
  name: string;
  neighborhood: string;
  address?: string;
  photoUrl?: string;
  imageUrl?: string;
  coordinator: string;
  phone: string;
  email: string;
  position: { x: number; y: number };
}

const MAP_MAIN_CARD_KEY = 'map_main_card';

const defaultMainCard = {
  imageUrl: '',
  title: 'Paróquia Santo André',
  badge: 'Centro',
  address: 'R. das Violetas, 126, Tarumã - SP',
  googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Paróquia+Santo+André,+R.+das+Violetas,+126,+Tarumã+-+SP,+19820-000',
  routeLabel: 'Ver rota no Google Maps',
};

export function Mapa() {
  const [chapels, setChapels] = useState<Chapel[]>([]);
  const [mainCard, setMainCard] = useState(defaultMainCard);

  useEffect(() => {
    loadChapels();
    loadMainCardContent();
  }, []);

  const loadMainCardContent = async () => {
    try {
      const content = await contentAPI.getByKey(MAP_MAIN_CARD_KEY);
      if (!content?.content) return;

      const parsed = JSON.parse(content.content);
      setMainCard((prev) => ({
        ...prev,
        ...parsed,
      }));
    } catch (error) {
      console.error('Erro ao carregar card principal do mapa:', error);
    }
  };

  const loadChapels = async () => {
    try {
      const data = await chapelsAPI.getAll();

      const chapelsWithPosition = (Array.isArray(data) ? data : []).map((chapel: any, index: number) => ({
        ...chapel,
        position: typeof chapel.position === 'string'
          ? JSON.parse(chapel.position)
          : chapel.position || getDefaultPosition(index)
      }));
      setChapels(chapelsWithPosition);
    } catch (error) {
      console.error('Erro ao carregar capelas:', error);
      setChapels([]);
    }
  };

  const getDefaultPosition = (index: number) => {
    const positions = [
      { x: 50, y: 45 },  // Matriz - Centro
      { x: 35, y: 60 },  // São José Operário - Vila dos Lagos
      { x: 65, y: 35 },  // Santa Terezinha - Árvores
      { x: 70, y: 65 },  // Nossa Senhora das Graças - Vila Dourados
      { x: 30, y: 30 },  // Santa Paulina - Vila Brasil
      { x: 55, y: 70 }   // Sagrada Família - Vila Cristal
    ];
    return positions[index % positions.length];
  };

  const getImageUrl = (url?: string) => {
    return resolveAssetUrl(url);
  };

  const getDefaultChapels = (): Chapel[] => [
    {
      id: '1',
      name: 'Igreja Matriz Santo André',
      neighborhood: 'Centro',
      coordinator: 'Padre João Carlos Silva',
      phone: '(14) 3234-5678',
      email: 'matriz@paroquiasantoandre.org.br',
      position: { x: 50, y: 45 },
    },
    {
      id: '2',
      name: 'Capela São José Operário',
      neighborhood: 'Vila dos Lagos',
      coordinator: 'Maria Aparecida Santos',
      phone: '(14) 3234-5680',
      email: 'saojoseoperario@paroquiasantoandre.org.br',
      position: { x: 35, y: 60 },
    },
    {
      id: '3',
      name: 'Capela Santa Terezinha',
      neighborhood: 'Árvores',
      coordinator: 'José Fernando Lima',
      phone: '(14) 3234-5681',
      email: 'santaterezinha@paroquiasantoandre.org.br',
      position: { x: 65, y: 35 },
    },
    {
      id: '4',
      name: 'Capela Nossa Senhora das Graças',
      neighborhood: 'Vila Dourados',
      coordinator: 'Ana Paula Rodrigues',
      phone: '(14) 3234-5682',
      email: 'nossasenhoragracas@paroquiasantoandre.org.br',
      position: { x: 70, y: 65 },
    },
    {
      id: '5',
      name: 'Capela Santa Paulina',
      neighborhood: 'Vila Brasil',
      coordinator: 'Carlos Eduardo Ferreira',
      phone: '(14) 3234-5683',
      email: 'santapaulina@paroquiasantoandre.org.br',
      position: { x: 30, y: 30 },
    },
    {
      id: '6',
      name: 'Capela Sagrada Família',
      neighborhood: 'Vila Cristal',
      coordinator: 'Mariana Costa Oliveira',
      phone: '(14) 3234-5684',
      email: 'sagradafamilia@paroquiasantoandre.org.br',
      position: { x: 55, y: 70 },
    },
  ];

  const buildDestination = (chapel: Chapel) => {
    const parts = [chapel.name, chapel.address, chapel.neighborhood].filter(Boolean);
    return parts.join(', ');
  };

  const openDirections = (chapel: Chapel) => {
    const destination = buildDestination(chapel);
    if (!destination) {
      return;
    }
    const url = `https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${encodeURIComponent(destination)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openMainCardDirections = () => {
    const url = (mainCard.googleMapsUrl || '').trim();
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (chapels.length === 0) {
    return (
      <section id="matriz" className="py-12 md:py-24 bg-gradient-to-b from-amber-50/30 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-amber-900 mb-6 tracking-tight">Matriz e Capelas</h2>
          <p className="text-gray-500">Nenhuma capela cadastrada no momento.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="matriz" className="py-12 md:py-24 bg-gradient-to-b from-amber-50/30 to-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-200/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-20">
          <div className="inline-block mb-4">
            <span className="text-amber-600 font-semibold text-sm tracking-widest uppercase">Localização</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-amber-900 mb-4 md:mb-6 tracking-tight">
            Matriz

          </h2>
          <div className="w-24 md:w-32 h-1.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mb-6 md:mb-8" />
          <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Localização das capelas da Paróquia Santo André em Tarumã
          </p>
        </div>

        {/* Card da Igreja Matriz */}
        <div className="mb-16 flex justify-center">
          <div
            role="button"
            tabIndex={0}
            onClick={openMainCardDirections}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openMainCardDirections();
              }
            }}
            className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-amber-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer w-full max-w-md focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            {mainCard.imageUrl && (
              <div className="mb-4 overflow-hidden rounded-xl border border-amber-100 bg-slate-100">
                <ImageWithFallback
                  src={getImageUrl(mainCard.imageUrl)}
                  alt={mainCard.title}
                  className="w-full h-44 object-cover object-[60%_78%] group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-md">
                <MapPin className="w-5 h-5 text-amber-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-bold text-amber-900 text-lg leading-snug group-hover:text-amber-700 transition-colors">
                    {mainCard.title}
                  </h4>
                  <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full whitespace-nowrap">
                    {mainCard.badge}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mt-2">
                  {mainCard.address}
                </p>

                <div className="mt-4 pt-3 border-t border-amber-100 space-y-1.5 text-sm text-gray-700">
                  <p className="text-amber-700 font-semibold">{mainCard.routeLabel}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Capelas e bairros */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-amber-900 mb-8 text-center">
            Capelas e Comunidades Rurais
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
            {chapels.map((chapel) => (
              <div
                key={chapel.id}
                role="button"
                tabIndex={0}
                onClick={() => openDirections(chapel)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openDirections(chapel);
                  }
                }}
                className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-amber-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {(chapel.photoUrl || chapel.imageUrl) && (
                  <div className="mb-4 overflow-hidden rounded-xl border border-amber-100 bg-slate-100">
                    <ImageWithFallback
                      src={getImageUrl(chapel.photoUrl || chapel.imageUrl)}
                      alt={chapel.name}
                      className="w-full h-40 object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-md">
                    <MapPin className="w-5 h-5 text-amber-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-bold text-amber-900 text-lg leading-snug group-hover:text-amber-700 transition-colors">
                        {chapel.name}
                      </h4>
                      <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full whitespace-nowrap">
                        {chapel.neighborhood}
                      </span>
                    </div>

                    {chapel.address && (
                      <p className="text-gray-600 text-sm mt-2">
                        {chapel.address}
                      </p>
                    )}

                    <div className="mt-4 pt-3 border-t border-amber-100 space-y-1.5 text-sm text-gray-700">
                      {chapel.coordinator && (
                        <p>
                          <span className="font-semibold text-amber-900">Coordenador:</span> {chapel.coordinator}
                        </p>
                      )}
                      {chapel.phone && (
                        <p>
                          <span className="font-semibold text-amber-900">Telefone:</span> {chapel.phone}
                        </p>
                      )}
                      <p className="text-amber-700 font-semibold">Ver rota no Google Maps</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}