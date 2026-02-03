import { MapPin, User, Phone, Mail } from 'lucide-react';

interface Chapel {
  id: string;
  name: string;
  neighborhood: string;
  coordinator: string;
  phone: string;
  email: string;
  position: { x: number; y: number };
}

export function Map() {
  const chapels: Chapel[] = [
    {
      id: '1',
      name: 'Igreja Matriz Santo André',
      neighborhood: 'Centro',
      coordinator: 'Maria José da Silva',
      phone: '(14) 3234-5678',
      email: 'matriz@paroquiasantoandre.org.br',
      position: { x: 50, y: 45 },
    },
    {
      id: '2',
      name: 'Capela São Pedro',
      neighborhood: 'Jardim Paraíso',
      coordinator: 'João Batista Santos',
      phone: '(14) 3234-5680',
      email: 'saopedro@paroquiasantoandre.org.br',
      position: { x: 30, y: 30 },
    },
    {
      id: '3',
      name: 'Capela Santa Rita',
      neighborhood: 'Vila Nova',
      coordinator: 'Ana Paula Oliveira',
      phone: '(14) 3234-5681',
      email: 'santarita@paroquiasantoandre.org.br',
      position: { x: 70, y: 35 },
    },
    {
      id: '4',
      name: 'Capela Nossa Senhora',
      neighborhood: 'Bairro Alto',
      coordinator: 'Carlos Eduardo Lima',
      phone: '(14) 3234-5682',
      email: 'nossasenhora@paroquiasantoandre.org.br',
      position: { x: 40, y: 65 },
    },
    {
      id: '5',
      name: 'Capela São José',
      neighborhood: 'Jardim das Flores',
      coordinator: 'Mariana Costa Pereira',
      phone: '(14) 3234-5683',
      email: 'saojose@paroquiasantoandre.org.br',
      position: { x: 65, y: 60 },
    },
  ];

  return (
    <section id="mapa" className="py-24 bg-gradient-to-b from-amber-50/30 to-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-200/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="text-amber-600 font-semibold text-sm tracking-widest uppercase">Localização</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-amber-900 mb-6 tracking-tight">
            Nossas Capelas
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mb-8" />
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Localização das capelas da Paróquia Santo André em Tarumã
          </p>
        </div>

        {/* Map Visualization */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 mb-16 border border-amber-100">
          <h3 className="text-3xl font-bold text-amber-900 mb-8 text-center">
            Mapa de Tarumã
          </h3>
          <div className="relative w-full aspect-video bg-gradient-to-br from-green-100 via-green-50 to-amber-50 rounded-2xl border-4 border-amber-200 overflow-hidden shadow-inner">
            {/* City Name */}
            <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-xl shadow-lg border border-amber-200">
              <p className="font-bold text-amber-900 text-lg">Tarumã - SP</p>
            </div>

            {/* Chapel Markers */}
            {chapels.map((chapel) => (
              <div
                key={chapel.id}
                className="absolute group cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${chapel.position.x}%`, top: `${chapel.position.y}%` }}
              >
                <div className="relative">
                  <div className={`w-8 h-8 rounded-full ${
                    chapel.id === '1' 
                      ? 'bg-amber-700 ring-4 ring-amber-300 shadow-xl' 
                      : 'bg-amber-500 ring-4 ring-amber-200 shadow-lg'
                  } transition-all group-hover:scale-150 duration-300`}>
                    {chapel.id === '1' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full shadow-inner" />
                      </div>
                    )}
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10 transform group-hover:-translate-y-1">
                    <div className="bg-amber-900 text-white px-5 py-3 rounded-xl shadow-2xl whitespace-nowrap border-2 border-amber-700">
                      <p className="font-bold text-sm">{chapel.name}</p>
                      <p className="text-amber-200 text-xs mt-1">{chapel.neighborhood}</p>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                        <div className="border-8 border-transparent border-t-amber-900" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Legend */}
            <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-amber-200">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-5 h-5 bg-amber-700 rounded-full ring-3 ring-amber-300 shadow-md" />
                <span className="text-sm font-semibold text-gray-700">Igreja Matriz</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-amber-500 rounded-full ring-3 ring-amber-200 shadow-md" />
                <span className="text-sm font-semibold text-gray-700">Capelas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Coordinators Information */}
        <div>
          <h3 className="text-3xl font-bold text-amber-900 mb-12 text-center">
            Coordenadores das Capelas
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapels.map((chapel) => (
              <div
                key={chapel.id}
                className="group bg-white rounded-2xl shadow-lg p-8 border-l-4 border-amber-600 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-md">
                    <MapPin className="w-6 h-6 text-amber-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-900 text-lg mb-1 group-hover:text-amber-700 transition-colors">
                      {chapel.name}
                    </h4>
                    <p className="text-gray-600 text-sm font-medium">{chapel.neighborhood}</p>
                  </div>
                </div>
                
                <div className="space-y-3 pt-4 border-t-2 border-gray-100">
                  <div className="flex items-center space-x-3 text-sm">
                    <User className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <span className="text-gray-700 font-semibold">{chapel.coordinator}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm">
                    <Phone className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <a 
                      href={`tel:${chapel.phone.replace(/\D/g, '')}`}
                      className="text-gray-700 hover:text-amber-700 transition-colors font-medium"
                    >
                      {chapel.phone}
                    </a>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm">
                    <Mail className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <a 
                      href={`mailto:${chapel.email}`}
                      className="text-gray-700 hover:text-amber-700 transition-colors truncate font-medium"
                    >
                      {chapel.email}
                    </a>
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