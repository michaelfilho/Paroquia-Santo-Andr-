import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, CheckCircle, XCircle, X } from 'lucide-react';
import { publicEventsAPI, inscriptionsAPI } from '../src/services/api';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
  availableSpots: number;
  totalSpots: number;
  status: 'open' | 'closed';
}

interface FormData {
  name: string;
  cpf: string;
  phone: string;
  observations: string;
}

export function Inscricoes() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [acceptedLGPD, setAcceptedLGPD] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    cpf: '',
    phone: '',
    observations: '',
  });

  // Load events from API on mount
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      // Usar endpoint específico para eventos de inscrição
      const data = await publicEventsAPI.getInscriptionEvents();
      
      // Format events for display
      const formattedEvents = data.map((event: any) => ({
        id: event.id,
        title: event.title,
        date: event.date ? new Date(event.date).toLocaleDateString('pt-BR', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }) : 'Data não definida',
        time: event.time || 'Horário não definido',
        location: event.location || 'Local não definido',
        description: event.description || 'Sem descrição',
        category: event.category || 'Evento',
        availableSpots: event.availableSpots !== null ? event.availableSpots : 0,
        totalSpots: event.maxParticipants || 0,
        status: event.status || 'closed',
      }));
      
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (!acceptedLGPD) {
        alert('Você deve aceitar os termos de proteção de dados (LGPD) para continuar');
        setLoading(false);
        return;
      }

      if (!selectedEvent) {
        alert('Nenhum evento selecionado');
        return;
      }

      // Enviar inscrição para API
      await inscriptionsAPI.create({
        eventId: selectedEvent.id,
        name: formData.name,
        phone: formData.phone.replace(/\D/g, ''), // Remove formatação e envia apenas números
      });

      setShowSuccess(true);
      setSelectedEvent(null);
      setAcceptedLGPD(false);
      setFormData({
        name: '',
        cpf: '',
        phone: '',
        observations: '',
      });
      
      // Recarregar eventos para atualizar vagas
      await loadEvents();
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error: any) {
      console.error('Erro ao enviar inscrição:', error);
      
      // Verificar se é erro de vagas esgotadas
      if (error.response?.data?.message?.includes('Vagas esgotadas') || 
          error.response?.data?.message?.includes('esgotadas')) {
        alert('Desculpe, as vagas para este evento já foram esgotadas!');
        await loadEvents(); // Atualizar lista
      } else {
        alert('Erro ao enviar inscrição. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'retiro':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'evento':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'catequese':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pastoral':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'celebração':
        return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'curso':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white via-amber-50/30 to-white relative overflow-hidden min-h-screen">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl -z-0" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-300/10 rounded-full blur-3xl -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="text-amber-600 font-semibold text-sm tracking-widest uppercase">
              Participe Conosco
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-amber-900 mb-6 tracking-tight">
            Inscrições
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mb-8" />
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Inscreva-se nos eventos e atividades da Paróquia Santo André
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="group bg-white rounded-2xl shadow-xl overflow-hidden border border-amber-100/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3"
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold border-2 ${getCategoryColor(event.category)} shadow-sm`}>
                    {event.category}
                  </div>
                  {event.status === 'open' ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>

                <h3 className="text-2xl font-bold text-amber-900 mb-3 group-hover:text-amber-700 transition-colors">
                  {event.title}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-6 min-h-[60px]">
                  {event.description}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-5 h-5 mr-3 text-amber-600" />
                    <span className="font-medium">{event.date}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-5 h-5 mr-3 text-amber-600" />
                    <span className="font-medium">{event.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-5 h-5 mr-3 text-amber-600" />
                    <span className="font-medium">{event.location}</span>
                  </div>
                </div>

                {/* Available Spots */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600 font-medium flex items-center">
                      <Users className="w-4 h-4 mr-2 text-amber-600" />
                      Vagas Disponíveis
                    </span>
                    <span className={`font-bold ${event.availableSpots > 10 ? 'text-green-600' : event.availableSpots > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                      {event.availableSpots}/{event.totalSpots}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        event.availableSpots > 10 ? 'bg-green-600' : event.availableSpots > 0 ? 'bg-amber-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${((event.totalSpots - event.availableSpots) / event.totalSpots) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Button */}
                {event.status === 'open' ? (
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Inscrever-se
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 px-6 py-4 rounded-xl font-semibold cursor-not-allowed"
                  >
                    Inscrições Encerradas
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Registration Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-br from-amber-700 via-amber-600 to-amber-700 text-white p-8 relative">
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-3xl font-bold mb-2">Formulário de Inscrição</h3>
              <p className="text-amber-100">{selectedEvent.title}</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-600 focus:outline-none transition-colors"
                  placeholder="Digite seu nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  CPF *
                </label>
                <input
                  type="text"
                  required
                  value={formData.cpf}
                  onChange={(e) => {
                    // Remove all non-numeric characters
                    let value = e.target.value.replace(/\D/g, '');
                    
                    // Limit to 11 digits
                    value = value.slice(0, 11);
                    
                    // Format as XXX.XXX.XXX-XX
                    if (value.length <= 3) {
                      value = value;
                    } else if (value.length <= 6) {
                      value = value.slice(0, 3) + '.' + value.slice(3);
                    } else if (value.length <= 9) {
                      value = value.slice(0, 3) + '.' + value.slice(3, 6) + '.' + value.slice(6);
                    } else {
                      value = value.slice(0, 3) + '.' + value.slice(3, 6) + '.' + value.slice(6, 9) + '-' + value.slice(9);
                    }
                    
                    setFormData({ ...formData, cpf: value });
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-600 focus:outline-none transition-colors"
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Telefone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => {
                    // Remove all non-numeric characters
                    let value = e.target.value.replace(/\D/g, '');
                    
                    // Limit to 11 digits (DDD + 9 digits)
                    value = value.slice(0, 11);
                    
                    // Format as (XX) XXXXX-XXXX or (XX) XXXX-XXXX
                    if (value.length <= 2) {
                      value = value;
                    } else if (value.length <= 7) {
                      value = '(' + value.slice(0, 2) + ') ' + value.slice(2);
                    } else if (value.length <= 10) {
                      value = '(' + value.slice(0, 2) + ') ' + value.slice(2, 6) + '-' + value.slice(6);
                    } else {
                      value = '(' + value.slice(0, 2) + ') ' + value.slice(2, 7) + '-' + value.slice(7);
                    }
                    
                    setFormData({ ...formData, phone: value });
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-600 focus:outline-none transition-colors"
                  placeholder="(14) 99999-9999"
                  maxLength={15}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Evento Selecionado
                </label>
                <input
                  type="text"
                  value={selectedEvent.title}
                  disabled
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Observações
                </label>
                <textarea
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-600 focus:outline-none transition-colors resize-none"
                  placeholder="Alguma informação adicional que deseja compartilhar..."
                />
              </div>

              {/* LGPD Compliance Checkbox */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="lgpd-consent"
                    checked={acceptedLGPD}
                    onChange={(e) => setAcceptedLGPD(e.target.checked)}
                    className="w-5 h-5 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="lgpd-consent" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                    <span className="font-semibold">Concordo com os termos de proteção de dados (LGPD)</span>
                    <p className="text-xs text-gray-600 mt-1">
                      Autorizo a coleta e processamento dos meus dados pessoais (nome, telefone e e-mail) exclusivamente para fins de contato relacionado ao evento em que me inscrevo, de acordo com a Lei Geral de Proteção de Dados (LGPD). Meus dados serão armazenados com segurança e não serão compartilhados com terceiros sem consentimento.
                    </p>
                  </label>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedEvent(null);
                    setAcceptedLGPD(false);
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-4 rounded-xl font-semibold transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!acceptedLGPD || loading}
                  className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all shadow-lg ${
                    acceptedLGPD && !loading
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {loading ? 'Enviando...' : 'Enviar Inscrição'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-24 right-4 z-50 bg-green-600 text-white px-8 py-4 rounded-xl shadow-2xl animate-in slide-in-from-right duration-300">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6" />
            <div>
              <p className="font-bold">Inscrição realizada com sucesso!</p>
              <p className="text-sm text-green-100">A paróquia entrará em contato se necessário.</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
