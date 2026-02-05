import { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Image as ImageIcon,
  ChevronDown
} from 'lucide-react';
import { publicEventsAPI } from '../src/services/api';

interface Event {
  id: string | number;
  title: string;
  date: string;
  location: string;
  attendees: number;
  description: string;
  hasPhotos: boolean;
}

interface PastEventsProps {
  onViewPhotos: (eventId: string | number) => void;
}

export function PastEvents({ onViewPhotos }: PastEventsProps) {
  const [openYear, setOpenYear] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    loadPastEvents();
  }, []);

  const loadPastEvents = async () => {
    try {
      const data = await publicEventsAPI.getAll();
      
      if (data && data.length > 0) {
        // Filtrar apenas eventos passados
        const now = new Date();
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);
        const pastEvents = data
          .filter((event: any) => {
            const eventDate = new Date(`${event.date}T00:00:00`);
            return eventDate < startOfToday;
          })
          .map((event: any) => {
            const eventDate = new Date(`${event.date}T00:00:00`);
            const formattedDate = eventDate.toLocaleDateString('pt-BR', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            });
            
            return {
              ...event,
              date: formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1),
              attendees: event.attendees || 0,
              hasPhotos: event.hasPhotos || false
            };
          })
          .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setEvents(pastEvents);
      } else {
        setEvents(getDefaultEvents());
      }
    } catch (error) {
      console.error('Erro ao carregar eventos passados:', error);
      setEvents(getDefaultEvents());
    }
  };

  const getDefaultEvents = (): Event[] => [];

  // 🔹 Agrupar por ano
  const groupedByYear = events.reduce((acc, event) => {
    const year = event.date.match(/\d{4}/)?.[0] ?? 'Outros';
    acc[year] = acc[year] || [];
    acc[year].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  const toggleYear = (year: string) => {
    setOpenYear(openYear === year ? null : year);
  };

  return (
    <section
      id="eventos-realizados"
      className="py-24 bg-gradient-to-b from-white to-amber-50/30"
    >
      <div className="max-w-7xl mx-auto px-4 space-y-16">

        {/* Header */}
        <div className="text-center">
          <span className="text-amber-600 font-semibold text-sm tracking-widest uppercase">
            Memórias
          </span>
          <h2 className="text-5xl md:text-6xl font-bold text-amber-900 my-6">
            Eventos Realizados
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto" />
          <p className="text-xl text-gray-600 mt-6 max-w-3xl mx-auto">
            Reviva os momentos especiais que marcaram nossa comunidade
          </p>
        </div>

        {/* Accordion por Ano */}
        {Object.entries(groupedByYear)
          .sort((a, b) => Number(b[0]) - Number(a[0]))
          .map(([year, yearEvents]) => (
            <div
              key={year}
              className="bg-white rounded-2xl shadow-md border border-amber-200"
            >
              {/* Cabeçalho do ano */}
              <button
                onClick={() => toggleYear(year)}
                className="w-full flex justify-between items-center px-8 py-6 text-left"
              >
                <h3 className="text-3xl font-bold text-amber-900">
                  {year}
                </h3>
                <ChevronDown
                  className={`w-6 h-6 text-amber-700 transition-transform duration-300 ${
                    openYear === year ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Eventos */}
              {openYear === year && (
                <div className="px-6 pb-8 grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
                  {yearEvents.map((event) => (
                    <div
                      key={event.id}
                      className="group bg-white rounded-2xl shadow-xl overflow-hidden border border-amber-100 hover:shadow-2xl transition-all duration-300"
                    >
                      <div className="bg-gradient-to-br from-amber-700 via-amber-600 to-amber-700 text-white p-6">
                        <h4 className="text-lg font-bold mb-2">
                          {event.title}
                        </h4>
                        <div className="flex items-center text-amber-100 text-sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          {event.date}
                        </div>
                      </div>

                      <div className="p-6">
                        <p className="text-gray-600 mb-4">
                          {event.description}
                        </p>

                        <div className="space-y-2 mb-5 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-amber-600" />
                            {event.location}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2 text-amber-600" />
                            {event.attendees.toLocaleString('pt-BR')} participantes
                          </div>
                        </div>

                        {event.hasPhotos && (
                          <button
                            onClick={() => onViewPhotos(event.id)}
                            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
                          >
                            <ImageIcon className="w-5 h-5" />
                            Ver Fotos
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>
    </section>
  );
}
