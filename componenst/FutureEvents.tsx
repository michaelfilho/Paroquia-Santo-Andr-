import { useState } from 'react';
import { Calendar, MapPin, Clock, Info, ChevronDown } from 'lucide-react';

interface FutureEvent {
  id: string;
  title: string;
  date: string;
  month: string;
  time: string;
  location: string;
  description: string;
  category: 'missa' | 'evento' | 'retiro' | 'festa';
}

export function FutureEvents() {
  const [openMonth, setOpenMonth] = useState<string | null>(null);

  const events: FutureEvent[] = [
    {
      id: '1',
      title: 'Missa Dominical',
      date: '2 de Fevereiro de 2026',
      month: 'Fevereiro 2026',
      time: '19:00',
      location: 'Igreja Matriz Santo André',
      description: 'Missa de domingo com celebração eucarística e cânticos.',
      category: 'missa',
    },
    {
      id: '2',
      title: 'Grupo de Oração',
      date: '5 de Fevereiro de 2026',
      month: 'Fevereiro 2026',
      time: '20:00',
      location: 'Salão Paroquial',
      description: 'Encontro semanal do grupo de oração com louvor, palavra e partilha.',
      category: 'evento',
    },
    {
      id: '3',
      title: 'Catequese Infantil',
      date: '7 de Fevereiro de 2026',
      month: 'Fevereiro 2026',
      time: '14:00',
      location: 'Salas de Catequese',
      description: 'Aulas de catequese para crianças de 7 a 10 anos.',
      category: 'evento',
    },
    {
      id: '4',
      title: 'Retiro de Quaresma',
      date: '28 de Fevereiro a 2 de Março de 2026',
      month: 'Fevereiro 2026',
      time: '18:00 (Sexta)',
      location: 'Casa de Retiros São Francisco',
      description: 'Retiro espiritual de preparação para a Quaresma.',
      category: 'retiro',
    },
    {
      id: '5',
      title: 'Quarta-feira de Cinzas',
      date: '4 de Março de 2026',
      month: 'Março 2026',
      time: '07:00, 12:00 e 19:00',
      location: 'Igreja Matriz',
      description: 'Celebrações com imposição das cinzas.',
      category: 'missa',
    },
    {
      id: '6',
      title: 'Encontro de Casais',
      date: '14 e 15 de Março de 2026',
      month: 'Março 2026',
      time: '19:00 (Sábado)',
      location: 'Salão Paroquial',
      description: 'Encontro para casais com palestras e espiritualidade.',
      category: 'evento',
    },
    {
      id: '7',
      title: 'Via Sacra',
      date: 'Todas as sextas-feiras da Quaresma',
      month: 'Março 2026',
      time: '19:30',
      location: 'Igreja Matriz',
      description: 'Celebração semanal da Via Sacra.',
      category: 'missa',
    },
    {
      id: '8',
      title: 'Páscoa 2026',
      date: '5 de Abril de 2026',
      month: 'Abril 2026',
      time: '06:00 (Vigília)',
      location: 'Igreja Matriz',
      description: 'Vigília Pascal e Missa da Ressurreição.',
      category: 'festa',
    },
  ];

  const groupedEvents = events.reduce((acc, event) => {
    acc[event.month] = acc[event.month] || [];
    acc[event.month].push(event);
    return acc;
  }, {} as Record<string, FutureEvent[]>);

  const toggleMonth = (month: string) => {
    setOpenMonth(openMonth === month ? null : month);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'missa':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'evento':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'retiro':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'festa':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'missa':
        return 'Missa';
      case 'evento':
        return 'Evento';
      case 'retiro':
        return 'Retiro';
      case 'festa':
        return 'Celebração';
      default:
        return 'Outro';
    }
  };

  return (
    <section
      id="eventos-futuros"
      className="py-24 bg-gradient-to-b from-amber-50/30 to-white"
    >
      <div className="max-w-5xl mx-auto px-4 space-y-16">

        {/* Header */}
        <div className="text-center">
          <span className="text-amber-600 font-semibold text-sm tracking-widest uppercase">
            Agenda
          </span>
          <h2 className="text-5xl md:text-6xl font-bold text-amber-900 my-6">
            Programações
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto" />
        </div>

        {/* Accordion */}
        {Object.entries(groupedEvents).map(([month, monthEvents]) => (
          <div key={month} className="bg-white rounded-2xl shadow-md border border-amber-200">
            {/* Month Header */}
            <button
              onClick={() => toggleMonth(month)}
              className="w-full flex justify-between items-center px-6 py-5 text-left"
            >
              <h3 className="text-2xl font-bold text-amber-900">
                {month}
              </h3>
              <ChevronDown
                className={`w-6 h-6 text-amber-700 transition-transform duration-300 ${
                  openMonth === month ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Events */}
            {openMonth === month && (
              <div className="px-6 pb-6 space-y-6 animate-fade-in-up">
                {monthEvents.map(event => (
                  <div
                    key={event.id}
                    className="bg-amber-50 rounded-xl p-6 border-l-4 border-amber-600"
                  >
                    <h4 className="text-xl font-bold text-amber-900 mb-2">
                      {event.title}
                    </h4>

                    <span
                      className={`inline-block mb-3 px-3 py-1 text-xs font-semibold rounded-full border ${getCategoryColor(
                        event.category
                      )}`}
                    >
                      {getCategoryLabel(event.category)}
                    </span>

                    <p className="text-gray-700 mb-4">
                      {event.description}
                    </p>

                    <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-amber-600" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-amber-600" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-amber-600" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Info */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-8 shadow-md flex gap-4">
          <Info className="w-8 h-8 text-amber-700 mt-1" />
          <div>
            <h4 className="font-bold text-amber-900 mb-2">
              Informações Importantes
            </h4>
            <p className="text-gray-700">
              Para mais informações, procure a secretaria paroquial ou nosso Instagram oficial.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
