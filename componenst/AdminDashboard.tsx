import { useState } from 'react';
import { 
  Calendar, 
  Church, 
  Users, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Download,
  CheckCircle,
  Clock,
  Shield,
  FileText,
  MapPin,
  User,
  X,
  Save
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

type TabType = 'eventos' | 'paroquia' | 'inscricoes' | 'guias';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  acceptsRegistration: boolean;
}

interface Registration {
  id: string;
  event: string;
  name: string;
  email: string;
  phone: string;
  status: string;
}

interface Chapel {
  id: string;
  name: string;
  neighborhood: string;
  coordinator: string;
}

interface ClergyMember {
  id: string;
  name: string;
  role: string;
  period: string;
  email?: string;
  phone?: string;
}

interface Guide {
  id: string;
  title: string;
  details: string[];
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('eventos');
  const [showEventForm, setShowEventForm] = useState(false);
  const [showChapelForm, setShowChapelForm] = useState(false);
  const [showCleryForm, setShowCleryForm] = useState(false);
  const [showGuideForm, setShowGuideForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Mock data for events
  const [events, setEvents] = useState<Event[]>([
    { id: '1', title: 'Retiro de Quaresma', date: '28/02/2026', location: 'Casa de Retiros', acceptsRegistration: true },
    { id: '2', title: 'Encontro de Casais', date: '14/03/2026', location: 'Salão Paroquial', acceptsRegistration: true },
    { id: '3', title: 'Páscoa 2026', date: '05/04/2026', location: 'Igreja Matriz', acceptsRegistration: false },
  ]);

  // Form state
  const [eventForm, setEventForm] = useState<Event>({ id: '', title: '', date: '', location: '', acceptsRegistration: true });
  const [chapelForm, setChapelForm] = useState<Chapel>({ id: '', name: '', neighborhood: '', coordinator: '' });
  const [clergyForm, setClergyForm] = useState<ClergyMember>({ id: '', name: '', role: '', period: '', email: '', phone: '' });
  const [guideForm, setGuideForm] = useState<Guide>({ id: '', title: '', details: [] });

  // Mock data for registrations
  const [registrations, setRegistrations] = useState<Registration[]>([
    { id: '1', event: 'Retiro de Quaresma', name: 'Maria Oliveira', email: 'maria@email.com', phone: '(14) 99999-9999', status: 'Confirmado' },
    { id: '2', event: 'Retiro de Quaresma', name: 'Joaquin Neto', email: 'Neto@email.com', phone: '(14) 98888-8888', status: 'Pendente' },
    { id: '3', event: 'Encontro de Casais', name: 'Julia e Michael', email: 'michael@email.com', phone: '(14) 97777-7777', status: 'Confirmado' },
  ]);

  // Mock data for chapels
  const [chapels, setChapels] = useState<Chapel[]>([
    { id: '1', name: 'Igreja Matriz Santo André', neighborhood: 'Centro', coordinator: 'Maria José da Silva' },
    { id: '2', name: 'Capela São Pedro', neighborhood: 'Jardim Paraíso', coordinator: 'João Batista Santos' },
    { id: '3', name: 'Capela Santa Rita', neighborhood: 'Vila Nova', coordinator: 'Ana Paula Oliveira' },
  ]);

  // Mock data for clergy
  const [clergy, setCLergy] = useState<ClergyMember[]>([
    { id: '1', name: 'Pe. João Carlos Silva', role: 'Pároco', period: '2020 - Presente', email: 'pe.joao@email.com', phone: '(14) 3234-5678' },
    { id: '2', name: 'Pe. Lucas Fernandes', role: 'Vigário', period: '2022 - Presente', email: 'pe.lucas@email.com', phone: '(14) 3234-5679' },
  ]);

  // Mock data for guides
  const [guides, setGuides] = useState<Guide[]>([
    { id: '1', title: 'Guia de Casamento', details: ['Documentação necessária', 'Preparação pré-matrimonial'] },
    { id: '2', title: 'Guia de Batismo', details: ['Idade mínima recomendada', 'Escolha de padrinhos'] },
  ]);

  // Event handlers
  const handleSaveEvent = () => {
    if (editingId) {
      setEvents(events.map(e => e.id === editingId ? eventForm : e));
    } else {
      setEvents([...events, { ...eventForm, id: Date.now().toString() }]);
    }
    setEventForm({ id: '', title: '', date: '', location: '', acceptsRegistration: true });
    setShowEventForm(false);
    setEditingId(null);
  };

  const handleEditEvent = (event: Event) => {
    setEventForm(event);
    setEditingId(event.id);
    setShowEventForm(true);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const handleSaveChapel = () => {
    if (editingId) {
      setChapels(chapels.map(c => c.id === editingId ? chapelForm : c));
    } else {
      setChapels([...chapels, { ...chapelForm, id: Date.now().toString() }]);
    }
    setChapelForm({ id: '', name: '', neighborhood: '', coordinator: '' });
    setShowChapelForm(false);
    setEditingId(null);
  };

  const handleEditChapel = (chapel: Chapel) => {
    setChapelForm(chapel);
    setEditingId(chapel.id);
    setShowChapelForm(true);
  };

  const handleDeleteChapel = (id: string) => {
    setChapels(chapels.filter(c => c.id !== id));
  };

  const handleSaveCLergy = () => {
    if (editingId) {
      setCLergy(clergy.map(c => c.id === editingId ? clergyForm : c));
    } else {
      setCLergy([...clergy, { ...clergyForm, id: Date.now().toString() }]);
    }
    setClergyForm({ id: '', name: '', role: '', period: '', email: '', phone: '' });
    setShowCleryForm(false);
    setEditingId(null);
  };

  const handleEditCLergy = (member: ClergyMember) => {
    setClergyForm(member);
    setEditingId(member.id);
    setShowCleryForm(true);
  };

  const handleDeleteCLergy = (id: string) => {
    setCLergy(clergy.filter(c => c.id !== id));
  };

  const handleSaveGuide = () => {
    if (editingId) {
      setGuides(guides.map(g => g.id === editingId ? guideForm : g));
    } else {
      setGuides([...guides, { ...guideForm, id: Date.now().toString() }]);
    }
    setGuideForm({ id: '', title: '', details: [] });
    setShowGuideForm(false);
    setEditingId(null);
  };

  const handleEditGuide = (guide: Guide) => {
    setGuideForm(guide);
    setEditingId(guide.id);
    setShowGuideForm(true);
  };

  const handleDeleteGuide = (id: string) => {
    setGuides(guides.filter(g => g.id !== id));
  };

  const handleStatusChange = (registrationId: string, newStatus: string) => {
    setRegistrations(registrations.map(reg => 
      reg.id === registrationId ? { ...reg, status: newStatus } : reg
    ));
  };

  // Modal for Event Form
  const EventFormModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-amber-900">{editingId ? 'Editar' : 'Novo'} Evento</h3>
          <button onClick={() => { setShowEventForm(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Título do evento"
            value={eventForm.title}
            onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
          />
          <input
            type="text"
            placeholder="Data (DD/MM/YYYY)"
            value={eventForm.date}
            onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
          />
          <input
            type="text"
            placeholder="Local"
            value={eventForm.location}
            onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={eventForm.acceptsRegistration}
              onChange={(e) => setEventForm({ ...eventForm, acceptsRegistration: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-gray-700">Aceita Inscrições</span>
          </label>
          <button
            onClick={handleSaveEvent}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold transition-all"
          >
            <Save className="w-5 h-5" />
            <span>Salvar Evento</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Modal for Chapel Form
  const ChapelFormModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-amber-900">{editingId ? 'Editar' : 'Nova'} Capela</h3>
          <button onClick={() => { setShowChapelForm(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nome da capela"
            value={chapelForm.name}
            onChange={(e) => setChapelForm({ ...chapelForm, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
          />
          <input
            type="text"
            placeholder="Bairro"
            value={chapelForm.neighborhood}
            onChange={(e) => setChapelForm({ ...chapelForm, neighborhood: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
          />
          <input
            type="text"
            placeholder="Coordenador"
            value={chapelForm.coordinator}
            onChange={(e) => setChapelForm({ ...chapelForm, coordinator: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
          />
          <button
            onClick={handleSaveChapel}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold transition-all"
          >
            <Save className="w-5 h-5" />
            <span>Salvar Capela</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Modal for Clergy Form
  const ClergyFormModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-amber-900">{editingId ? 'Editar' : 'Adicionar'} Membro do Clero</h3>
          <button onClick={() => { setShowCleryForm(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nome"
            value={clergyForm.name}
            onChange={(e) => setClergyForm({ ...clergyForm, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
          />
          <input
            type="text"
            placeholder="Função (ex: Pároco, Vigário, Bispo, Papa)"
            value={clergyForm.role}
            onChange={(e) => setClergyForm({ ...clergyForm, role: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
          />
          <input
            type="text"
            placeholder="Período (ex: 2020 - Presente)"
            value={clergyForm.period}
            onChange={(e) => setClergyForm({ ...clergyForm, period: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
          />
          <input
            type="email"
            placeholder="E-mail (opcional)"
            value={clergyForm.email}
            onChange={(e) => setClergyForm({ ...clergyForm, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
          />
          <input
            type="tel"
            placeholder="Telefone (opcional)"
            value={clergyForm.phone}
            onChange={(e) => setClergyForm({ ...clergyForm, phone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
          />
          <button
            onClick={handleSaveCLergy}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold transition-all"
          >
            <Save className="w-5 h-5" />
            <span>Salvar Membro</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Modal for Guide Form
  const GuideFormModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-amber-900">{editingId ? 'Editar' : 'Novo'} Guia</h3>
          <button onClick={() => { setShowGuideForm(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Título do guia"
            value={guideForm.title}
            onChange={(e) => setGuideForm({ ...guideForm, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
          />
          <textarea
            placeholder="Detalhes (um por linha)"
            value={guideForm.details.join('\n')}
            onChange={(e) => setGuideForm({ ...guideForm, details: e.target.value.split('\n').filter(d => d.trim()) })}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
          />
          <button
            onClick={handleSaveGuide}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold transition-all"
          >
            <Save className="w-5 h-5" />
            <span>Salvar Guia</span>
          </button>
        </div>
      </div>
    </div>
  );
  
  return (
    <section className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Shield className="w-8 h-8 text-amber-700" />
                <h1 className="text-4xl font-bold text-amber-900">Painel Administrativo</h1>
              </div>
              <p className="text-gray-600">Área restrita - Gestão da Paróquia Santo André</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              <LogOut className="w-5 h-5" />
              <span>Sair</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl border border-amber-100 overflow-hidden mb-8">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('eventos')}
              className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                activeTab === 'eventos'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-amber-50'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Eventos</span>
            </button>
            <button
              onClick={() => setActiveTab('paroquia')}
              className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                activeTab === 'paroquia'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-amber-50'
              }`}
            >
              <Church className="w-5 h-5" />
              <span>Paróquia</span>
            </button>
            <button
              onClick={() => setActiveTab('guias')}
              className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                activeTab === 'guias'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-amber-50'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Guias</span>
            </button>
            <button
              onClick={() => setActiveTab('inscricoes')}
              className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                activeTab === 'inscricoes'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-amber-50'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Inscrições</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Eventos Tab */}
            {activeTab === 'eventos' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-amber-900">Gestão de Eventos</h2>
                  <button
                    onClick={() => { setEventForm({ id: '', title: '', date: '', location: '', acceptsRegistration: true }); setEditingId(null); setShowEventForm(true); }}
                    className="flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Novo Evento</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="bg-gradient-to-br from-white to-amber-50/30 border-2 border-amber-100 rounded-xl p-6 hover:shadow-lg transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-amber-900 mb-2">{event.title}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-amber-600" />
                              {event.date}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-amber-600" />
                              {event.location}
                            </span>
                            <span className={`flex items-center font-medium ${event.acceptsRegistration ? 'text-green-600' : 'text-gray-500'}`}>
                              {event.acceptsRegistration ? (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Aceita Inscrições
                                </>
                              ) : (
                                <>
                                  <Clock className="w-4 h-4 mr-2" />
                                  Sem Inscrições
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button onClick={() => handleEditEvent(event)} className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-all">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDeleteEvent(event.id)} className="p-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Paróquia Tab */}
            {activeTab === 'paroquia' && (
              <div className="space-y-8">
                {/* Capelas */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-amber-900">Capelas</h2>
                    <button onClick={() => { setChapelForm({ id: '', name: '', neighborhood: '', coordinator: '' }); setEditingId(null); setShowChapelForm(true); }} className="flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 rounded-lg font-semibold transition-all hover:shadow-lg text-sm">
                      <Plus className="w-4 h-4" />
                      <span>Nova Capela</span>
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {chapels.map((chapel) => (
                      <div key={chapel.id} className="bg-white border-2 border-amber-100 rounded-xl p-6 hover:shadow-lg transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-bold text-amber-900 mb-1">{chapel.name}</h3>
                            <p className="text-sm text-gray-600 mb-1">{chapel.neighborhood}</p>
                            <p className="text-sm text-gray-600 flex items-center">
                              <User className="w-4 h-4 mr-1 text-amber-600" />
                              {chapel.coordinator}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button onClick={() => handleEditChapel(chapel)} className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-all">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteChapel(chapel.id)} className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clero */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-amber-900">Clero</h2>
                    <button onClick={() => { setClergyForm({ id: '', name: '', role: '', period: '', email: '', phone: '' }); setEditingId(null); setShowCleryForm(true); }} className="flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 rounded-lg font-semibold transition-all hover:shadow-lg text-sm">
                      <Plus className="w-4 h-4" />
                      <span>Adicionar Membro</span>
                    </button>
                  </div>
                  <div className="space-y-3">
                    {clergy.map((member) => (
                      <div key={member.id} className="bg-white border-2 border-amber-100 rounded-xl p-4 hover:shadow-lg transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-bold text-amber-900">{member.name}</h3>
                            <p className="text-sm text-gray-600">{member.role} • {member.period}</p>
                            {member.email && <p className="text-xs text-gray-500">{member.email}</p>}
                          </div>
                          <div className="flex space-x-2">
                            <button onClick={() => handleEditCLergy(member)} className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-all">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteCLergy(member.id)} className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Guias Tab */}
            {activeTab === 'guias' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-amber-900">Gestão de Guias</h2>
                  <button onClick={() => { setGuideForm({ id: '', title: '', details: [] }); setEditingId(null); setShowGuideForm(true); }} className="flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl">
                    <Plus className="w-5 h-5" />
                    <span>Novo Guia</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {guides.map((guide) => (
                    <div key={guide.id} className="bg-gradient-to-br from-white to-amber-50/30 border-2 border-amber-100 rounded-xl p-6 hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-amber-900 mb-3">{guide.title}</h3>
                          <ul className="space-y-2">
                            {guide.details.map((detail, idx) => (
                              <li key={idx} className="text-sm text-gray-600 flex items-start">
                                <span className="mr-2">•</span>
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button onClick={() => handleEditGuide(guide)} className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-all">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDeleteGuide(guide.id)} className="p-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inscrições Tab */}
            {activeTab === 'inscricoes' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-amber-900">Gestão de Inscrições</h2>
                  <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl">
                    <Download className="w-5 h-5" />
                    <span>Exportar Lista</span>
                  </button>
                </div>

                <div className="bg-white rounded-xl border-2 border-amber-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-amber-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-bold text-amber-900">Evento</th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-amber-900">Nome</th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-amber-900">E-mail</th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-amber-900">Telefone</th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-amber-900">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {registrations.map((reg) => (
                          <tr key={reg.id} className="hover:bg-amber-50/50 transition-colors">
                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">{reg.event}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{reg.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{reg.email}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{reg.phone}</td>
                            <td className="px-6 py-4">
                              <select
                                value={reg.status}
                                onChange={(e) => handleStatusChange(reg.id, e.target.value)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-semibold border-2 ${
                                  reg.status === 'Confirmado'
                                    ? 'bg-green-100 text-green-700 border-green-200'
                                    : 'bg-amber-100 text-amber-700 border-amber-200'
                                }`}
                              >
                                <option value="Confirmado">Confirmado</option>
                                <option value="Pendente">Pendente</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEventForm && <EventFormModal />}
      {showChapelForm && <ChapelFormModal />}
      {showCleryForm && <ClergyFormModal />}
      {showGuideForm && <GuideFormModal />}
    </section>
  );
}