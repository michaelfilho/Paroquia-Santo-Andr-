import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { chapelsAPI } from '../src/services/api';

interface Chapel {
  id: string | number;
  name: string;
  neighborhood: string;
  address?: string;
  coordinator: string;
  phone: string;
  email: string;
  position: { x: number; y: number };
}

export function Map() {
  const [chapels, setChapels] = useState<Chapel[]>([]);

  useEffect(() => {
    loadChapels();
  }, []);

  const loadChapels = async () => {
    try {
      const data = await chapelsAPI.getAll();
      
      if (data && data.length > 0) {
        // Mapear dados da API e garantir que position seja objeto
        const chapelsWithPosition = data.map((chapel: any, index: number) => ({
          ...chapel,
          position: typeof chapel.position === 'string' 
            ? JSON.parse(chapel.position) 
            : chapel.position || getDefaultPosition(index)
        }));
        setChapels(chapelsWithPosition);
      } else {
        // Fallback para dados padrão se API falhar ou retornar vazio
        setChapels(getDefaultChapels());
      }
    } catch (error) {
      console.error('Erro ao carregar capelas:', error);
      setChapels(getDefaultChapels());
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

  return (
    <section id="mapa" className="py-12 md:py-24 bg-gradient-to-b from-amber-50/30 to-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-200/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-20">
          <div className="inline-block mb-4">
            <span className="text-amber-600 font-semibold text-sm tracking-widest uppercase">Localização</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-amber-900 mb-4 md:mb-6 tracking-tight">
            Nossas Capelas
          </h2>
          <div className="w-24 md:w-32 h-1.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mb-6 md:mb-8" />
          <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Localização das capelas da Paróquia Santo André em Tarumã
          </p>
        </div>

        {/* Map Visualization */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-10 mb-8 md:mb-16 border border-amber-100">
          <h3 className="text-2xl md:text-3xl font-bold text-amber-900 mb-4 md:mb-8 text-center">
            Mapa de Tarumã
          </h3>
          <div className="relative w-full aspect-video rounded-lg md:rounded-2xl border-2 md:border-4 border-amber-200 overflow-hidden shadow-inner">
            {/* Google Maps Embed com marcadores integrados */}
            <iframe
              src="https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=-22.745896,-50.577862&zoom=13&maptype=roadmap"
              className="absolute inset-0 w-full h-full"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* City Name */}
            <div className="absolute top-2 left-2 md:top-6 md:left-6 bg-white/95 backdrop-blur-sm px-3 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl shadow-lg border border-amber-200 z-10">
              <p className="font-bold text-amber-900 text-sm md:text-lg">Tarumã - SP</p>
            </div>
          </div>
        </div>

        {/* Capelas e bairros */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-amber-900 mb-8 text-center">
            Capelas e Bairros
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
            {chapels.map((chapel) => (
              <div
                key={chapel.id}
                className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-amber-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
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