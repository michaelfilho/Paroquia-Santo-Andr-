import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Info, ChevronDown } from 'lucide-react';
import { publicEventsAPI } from '../src/services/api';

interface FutureEvent {
  id: string | number;
  title: string;
  date: string;
  month: string;
  time: string;
  location: string;
  description: string;
  category: 'missa' | 'evento' | 'retiro' | 'festa';
  acceptsRegistration?: boolean;
  maxParticipants?: number | null;
  confirmedInscriptions?: number;
}

export function FutureEvents() {
  const [openMonth, setOpenMonth] = useState<string | null>(null);
  const [events, setEvents] = useState<FutureEvent[]>([]);

  useEffect(() => {
    loadFutureEvents();
  }, []);

  const loadFutureEvents = async () => {
    try {
      const data = await publicEventsAPI.getAll();
      
      if (data && data.length > 0) {
        // Filtrar apenas eventos futuros
        const now = new Date();
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);
        const futureEvents = data
          .filter((event: any) => {
            const eventDate = new Date(`${event.date}T00:00:00`);
            return eventDate >= startOfToday;
          })
          .map((event: any) => {
            const eventDate = new Date(`${event.date}T00:00:00`);
            const monthYear = eventDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
            const formattedDate = eventDate.toLocaleDateString('pt-BR', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            });
            
            return {
              ...event,
              month: monthYear.charAt(0).toUpperCase() + monthYear.slice(1),
              date: formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1),
              category: event.category || 'evento',
              confirmedInscriptions: event.confirmedInscriptions || 0,
            };
          })
          .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        setEvents(futureEvents);
      } else {
        setEvents(getDefaultEvents());
      }
    } catch (error) {
      console.error('Erro ao carregar eventos futuros:', error);
      setEvents(getDefaultEvents());
    }
  };

  const getDefaultEvents = (): FutureEvent[] => [];

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
                    {event.acceptsRegistration && event.maxParticipants && (
                      <div className="mt-4 pt-4 border-t border-amber-200">
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-amber-900">
                            Inscritos: <span className="text-lg text-amber-700">{event.confirmedInscriptions || 0}/{event.maxParticipants}</span>
                          </p>
                          <div className="w-full bg-amber-100 rounded-full h-2">
                            <div 
                              className="bg-amber-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${Math.min(((event.confirmedInscriptions || 0) / event.maxParticipants) * 100, 100)}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-600">
                            <span className="font-semibold text-green-600">{event.maxParticipants - (event.confirmedInscriptions || 0)} vagas disponíveis</span>
                          </p>
                        </div>
                      </div>
                    )}
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
