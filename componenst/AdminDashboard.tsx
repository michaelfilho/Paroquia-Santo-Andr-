import { useState, useEffect } from 'react';
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
import { eventsAPI, chapelsAPI, clergyAPI, guidesAPI, inscriptionsAPI, contentAPI } from '../src/services/api';

interface AdminDashboardProps {
  onLogout: () => void;
}

type TabType = 'eventos' | 'paroquia' | 'inscricoes' | 'guias' | 'textos';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: 'missa' | 'evento' | 'retiro' | 'festa';
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
  phone?: string;
  email?: string;
}

interface ClergyMember {
  id: string;
  name: string;
  role: string;
  period: string;
  bio?: string;
  imageUrl?: string;
  current?: boolean;
  email?: string;
  phone?: string;
}

interface Guide {
  id: string;
  title: string;
  content: string;
  details: string[];
}

interface ContentText {
  id: string;
  key: string;
  title: string;
  content: string;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('eventos');
  const [showEventForm, setShowEventForm] = useState(false);
  const [showChapelForm, setShowChapelForm] = useState(false);
  const [showCleryForm, setShowCleryForm] = useState(false);
  const [showGuideForm, setShowGuideForm] = useState(false);
  const [showContentForm, setShowContentForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [_loading, setLoading] = useState(false);

  // State from API
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [chapels, setChapels] = useState<Chapel[]>([]);
  const [clergy, setCLergy] = useState<ClergyMember[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [contentTexts, setContentTexts] = useState<ContentText[]>([]);

  // Form state
  const [eventForm, setEventForm] = useState<Event>({
    id: '',
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: 'evento',
    acceptsRegistration: true,
  });
  const [chapelForm, setChapelForm] = useState<Chapel>({ id: '', name: '', neighborhood: '', coordinator: '', phone: '', email: '' });
  const [clergyForm, setClergyForm] = useState<ClergyMember>({ id: '', name: '', role: '', period: '', bio: '', imageUrl: '', current: false, email: '', phone: '' });
  const [guideForm, setGuideForm] = useState<Guide>({ id: '', title: '', content: '', details: [] });
  const [contentForm, setContentForm] = useState<ContentText>({ id: '', key: '', title: '', content: '' });
  const [clergyPeriodMode, setClergyPeriodMode] = useState<'atual' | 'numeros'>('atual');
  const [clergyPeriodStart, setClergyPeriodStart] = useState('');
  const [clergyPeriodEnd, setClergyPeriodEnd] = useState('');

  const isClergyFormValid = Boolean(
    clergyForm.name.trim() &&
    clergyForm.role.trim() &&
    clergyForm.period.trim()
  );

  // Load data from API on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [eventsData, chapelsData, clergyData, guidesData, inscriptionsData, contentData] = await Promise.all([
        eventsAPI.getAll(),
        chapelsAPI.getAll(),
        clergyAPI.getAll(),
        guidesAPI.getAll(),
        inscriptionsAPI.getAll(),
        contentAPI.getAll(),
      ]);
      
      setEvents(eventsData || []);
      setChapels(chapelsData || []);
      setCLergy(clergyData || []);
      setGuides(guidesData || []);
      setContentTexts(contentData || []);
      
      // Format inscriptions for the table
      if (inscriptionsData && Array.isArray(inscriptionsData)) {
        const formatted = inscriptionsData.map((reg: any) => ({
          id: reg.id,
          event: events.find(e => e.id === reg.eventId)?.title || 'Evento desconhecido',
          name: reg.name,
          email: reg.email,
          phone: reg.phone || '',
          status: reg.status || 'Pendente',
        }));
        setRegistrations(formatted);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Event handlers
  const handleSaveEvent = async () => {
    try {
      setLoading(true);
      if (editingId) {
        await eventsAPI.update(editingId, eventForm);
      } else {
        await eventsAPI.create(eventForm);
      }
      await loadAllData();
      setEventForm({ id: '', title: '', date: '', time: '', location: '', description: '', category: 'evento', acceptsRegistration: true });
      setShowEventForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      alert('Erro ao salvar evento');
    } finally {
      setLoading(false);
    }
  };

  const handleEditEvent = (event: Event) => {
    setEventForm(event);
    setEditingId(event.id);
    setShowEventForm(true);
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este evento?')) {
      try {
        setLoading(true);
        await eventsAPI.delete(id);
        await loadAllData();
      } catch (error) {
        console.error('Erro ao deletar evento:', error);
        alert('Erro ao deletar evento');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveChapel = async () => {
    try {
      setLoading(true);
      if (editingId) {
        await chapelsAPI.update(editingId, chapelForm);
      } else {
        await chapelsAPI.create(chapelForm);
      }
      await loadAllData();
      setChapelForm({ id: '', name: '', neighborhood: '', coordinator: '', phone: '', email: '' });
      setShowChapelForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Erro ao salvar capela:', error);
      alert('Erro ao salvar capela');
    } finally {
      setLoading(false);
    }
  };

  const handleEditChapel = (chapel: Chapel) => {
    setChapelForm(chapel);
    setEditingId(chapel.id);
    setShowChapelForm(true);
  };

  const handleDeleteChapel = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar esta capela?')) {
      try {
        setLoading(true);
        await chapelsAPI.delete(id);
        await loadAllData();
      } catch (error) {
        console.error('Erro ao deletar capela:', error);
        alert('Erro ao deletar capela');
      } finally {
        setLoading(false);
      }
    }
  };

  const updateClergyPeriod = (mode: 'atual' | 'numeros', start: string, end: string) => {
    let period = '';
    if (mode === 'atual') {
      period = start ? `${start} - Presente` : 'Presente';
    } else {
      if (start && end) {
        period = `${start} - ${end}`;
      } else if (start) {
        period = `${start} -`;
      }
    }

    setClergyForm(prev => ({ ...prev, period }));
  };

  const parseClergyPeriod = (period: string) => {
    const normalized = (period || '').toLowerCase();
    const years = (period.match(/\d{4}/g) || []).filter(Boolean);

    if (normalized.includes('presente') || normalized.includes('atual')) {
      const start = years[0] || '';
      setClergyPeriodMode('atual');
      setClergyPeriodStart(start);
      setClergyPeriodEnd('');
      updateClergyPeriod('atual', start, '');
      return;
    }

    const start = years[0] || '';
    const end = years[1] || '';
    setClergyPeriodMode('numeros');
    setClergyPeriodStart(start);
    setClergyPeriodEnd(end);
    updateClergyPeriod('numeros', start, end);
  };

  const handleSaveCLergy = async () => {
    try {
      setLoading(true);
      if (editingId) {
        await clergyAPI.update(editingId, clergyForm);
      } else {
        await clergyAPI.create(clergyForm);
      }
      await loadAllData();
      setClergyForm({ id: '', name: '', role: '', period: '', bio: '', imageUrl: '', current: false, email: '', phone: '' });
      setClergyPeriodMode('atual');
      setClergyPeriodStart('');
      setClergyPeriodEnd('');
      setShowCleryForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Erro ao salvar membro do clero:', error);
      alert('Erro ao salvar membro do clero');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCLergy = (member: ClergyMember) => {
    setClergyForm(member);
    parseClergyPeriod(member.period);
    setEditingId(member.id);
    setShowCleryForm(true);
  };

  const handleDeleteCLergy = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este membro?')) {
      try {
        setLoading(true);
        await clergyAPI.delete(id);
        await loadAllData();
      } catch (error) {
        console.error('Erro ao deletar membro:', error);
        alert('Erro ao deletar membro');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveGuide = async () => {
    try {
      setLoading(true);
      if (editingId) {
        await guidesAPI.update(editingId, guideForm);
      } else {
        await guidesAPI.create(guideForm);
      }
      await loadAllData();
      setGuideForm({ id: '', title: '', content: '', details: [] });
      setShowGuideForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Erro ao salvar guia:', error);
      alert('Erro ao salvar guia');
    } finally {
      setLoading(false);
    }
  };

  const handleEditGuide = (guide: Guide) => {
    setGuideForm(guide);
    setEditingId(guide.id);
    setShowGuideForm(true);
  };

  const handleDeleteGuide = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este guia?')) {
      try {
        setLoading(true);
        await guidesAPI.delete(id);
        await loadAllData();
      } catch (error) {
        console.error('Erro ao deletar guia:', error);
        alert('Erro ao deletar guia');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveContent = async () => {
    try {
      setLoading(true);
      if (editingId) {
        await contentAPI.update(editingId, contentForm);
      } else {
        await contentAPI.create(contentForm);
      }
      await loadAllData();
      setContentForm({ id: '', key: '', title: '', content: '' });
      setShowContentForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Erro ao salvar texto:', error);
      alert('Erro ao salvar texto');
    } finally {
      setLoading(false);
    }
  };

  const handleEditContent = (content: ContentText) => {
    setContentForm(content);
    setEditingId(content.id);
    setShowContentForm(true);
  };

  const handleDeleteContent = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este texto?')) {
      try {
        setLoading(true);
        await contentAPI.delete(id);
        await loadAllData();
      } catch (error) {
        console.error('Erro ao deletar texto:', error);
        alert('Erro ao deletar texto');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStatusChange = async (registrationId: string, newStatus: string) => {
    try {
      setLoading(true);
      await inscriptionsAPI.update(registrationId, { status: newStatus });
      await loadAllData();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status');
    } finally {
      setLoading(false);
    }
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="date"
              placeholder="Data"
              value={eventForm.date}
              onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
            />
            <input
              type="text"
              placeholder="Horário (ex: 19:00)"
              value={eventForm.time}
              onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
            />
          </div>
          <input
            type="text"
            placeholder="Local"
            value={eventForm.location}
            onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
          />
          <select
            value={eventForm.category}
            onChange={(e) => setEventForm({ ...eventForm, category: e.target.value as Event['category'] })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
          >
            <option value="missa">Missa</option>
            <option value="evento">Evento</option>
            <option value="retiro">Retiro</option>
            <option value="festa">Celebração</option>
          </select>
          <textarea
            placeholder="Descrição do evento"
            value={eventForm.description}
            onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
            rows={4}
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
          <input
            type="tel"
            placeholder="Telefone"
            value={chapelForm.phone || ''}
            onChange={(e) => setChapelForm({ ...chapelForm, phone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
          />
          <input
            type="email"
            placeholder="E-mail"
            value={chapelForm.email || ''}
            onChange={(e) => setChapelForm({ ...chapelForm, email: e.target.value })}
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-amber-900">{editingId ? 'Editar' : 'Adicionar'} Membro do Clero</h3>
          <button onClick={() => { setShowCleryForm(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <label htmlFor="clergy-name" className="text-sm font-medium text-amber-900">Nome completo</label>
            <input
              id="clergy-name"
              type="text"
              placeholder="Ex: Pe. João Silva"
              value={clergyForm.name}
              onChange={(e) => setClergyForm({ ...clergyForm, name: e.target.value })}
              autoComplete="name"
              autoFocus
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="clergy-role" className="text-sm font-medium text-amber-900">Função</label>
            <input
              id="clergy-role"
              type="text"
              list="clergy-roles"
              placeholder="Ex: Pároco, Vigário, Bispo, Papa"
              value={clergyForm.role}
              onChange={(e) => setClergyForm({ ...clergyForm, role: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
            />
            <datalist id="clergy-roles">
              <option value="Pároco" />
              <option value="Sacerdote" />
              <option value="Vigário Paroquial" />
              <option value="Bispo" />
              <option value="Papa" />
              <option value="Diácono" />
            </datalist>
            <p className="text-xs text-gray-500">Escolha um cargo sugerido ou digite um novo.</p>
          </div>
          <div className="space-y-1">
            <label htmlFor="clergy-period-mode" className="text-sm font-medium text-amber-900">Período</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <select
                id="clergy-period-mode"
                value={clergyPeriodMode}
                onChange={(e) => {
                  const mode = e.target.value as 'atual' | 'numeros';
                  setClergyPeriodMode(mode);
                  updateClergyPeriod(mode, clergyPeriodStart, clergyPeriodEnd);
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
              >
                <option value="atual">Atual</option>
                <option value="numeros">Somente números</option>
              </select>
              <input
                id="clergy-period-start"
                type="number"
                inputMode="numeric"
                min={1900}
                max={2100}
                placeholder="Início (ex: 2020)"
                value={clergyPeriodStart}
                onChange={(e) => {
                  const value = e.target.value;
                  setClergyPeriodStart(value);
                  updateClergyPeriod(clergyPeriodMode, value, clergyPeriodEnd);
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
              />
              {clergyPeriodMode === 'numeros' ? (
                <input
                  id="clergy-period-end"
                  type="number"
                  inputMode="numeric"
                  min={1900}
                  max={2100}
                  placeholder="Fim (ex: 2024)"
                  value={clergyPeriodEnd}
                  onChange={(e) => {
                    const value = e.target.value;
                    setClergyPeriodEnd(value);
                    updateClergyPeriod(clergyPeriodMode, clergyPeriodStart, value);
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
                />
              ) : (
                <input
                  type="text"
                  value="Presente"
                  disabled
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                />
              )}
            </div>
          </div>
          <div className="space-y-1">
            <label htmlFor="clergy-email" className="text-sm font-medium text-amber-900">E-mail (opcional)</label>
            <input
              id="clergy-email"
              type="email"
              placeholder="exemplo@paroquia.org"
              value={clergyForm.email}
              onChange={(e) => setClergyForm({ ...clergyForm, email: e.target.value })}
              autoComplete="email"
              inputMode="email"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="clergy-bio" className="text-sm font-medium text-amber-900">Biografia (opcional)</label>
            <textarea
              id="clergy-bio"
              placeholder="Breve biografia"
              value={clergyForm.bio || ''}
              onChange={(e) => setClergyForm({ ...clergyForm, bio: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="clergy-image" className="text-sm font-medium text-amber-900">Imagem (URL)</label>
            <input
              id="clergy-image"
              type="text"
              placeholder="https://..."
              value={clergyForm.imageUrl || ''}
              onChange={(e) => setClergyForm({ ...clergyForm, imageUrl: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
            />
            {clergyForm.imageUrl && (
              <div className="mt-2 rounded-lg border border-amber-100 bg-amber-50/40 p-2">
                <p className="text-xs text-amber-800 mb-2">Pré-visualização</p>
                <img
                  src={clergyForm.imageUrl}
                  alt="Pré-visualização"
                  className="h-24 w-full object-cover rounded-md"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.src = 'https://via.placeholder.com/640x360?text=Imagem+inv%C3%A1lida';
                  }}
                />
              </div>
            )}
          </div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={Boolean(clergyForm.current)}
              onChange={(e) => setClergyForm({ ...clergyForm, current: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-gray-700">Atual</span>
          </label>
          <div className="space-y-1">
            <label htmlFor="clergy-phone" className="text-sm font-medium text-amber-900">Telefone (opcional)</label>
            <input
              id="clergy-phone"
              type="tel"
              placeholder="(00) 00000-0000"
              value={clergyForm.phone}
              onChange={(e) => setClergyForm({ ...clergyForm, phone: e.target.value })}
              autoComplete="tel"
              inputMode="tel"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
            />
          </div>
          {!isClergyFormValid && (
            <p className="text-xs text-amber-700">Preencha nome, função e período para salvar.</p>
          )}
          <button
            onClick={handleSaveCLergy}
            disabled={!isClergyFormValid}
            className={`w-full flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${
              isClergyFormValid
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
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
            placeholder="Resumo do guia (aparece no card)"
            value={guideForm.content}
            onChange={(e) => setGuideForm({ ...guideForm, content: e.target.value })}
            rows={3}
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

  const ContentFormModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-amber-900">{editingId ? 'Editar' : 'Novo'} Texto Institucional</h3>
          <button onClick={() => { setShowContentForm(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Chave única (ex: about, mission)"
            value={contentForm.key}
            onChange={(e) => setContentForm({ ...contentForm, key: e.target.value })}
            disabled={!!editingId}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none disabled:bg-gray-100"
          />
          <input
            type="text"
            placeholder="Título"
            value={contentForm.title}
            onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
          />
          <textarea
            placeholder="Conteúdo"
            value={contentForm.content}
            onChange={(e) => setContentForm({ ...contentForm, content: e.target.value })}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
          />
          <button
            onClick={handleSaveContent}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold transition-all"
          >
            <Save className="w-5 h-5" />
            <span>Salvar Texto</span>
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
              onClick={() => setActiveTab('textos')}
              className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                activeTab === 'textos'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-amber-50'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Textos Institucionais</span>
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
                    onClick={() => { setEventForm({ id: '', title: '', date: '', time: '', location: '', description: '', category: 'evento', acceptsRegistration: true }); setEditingId(null); setShowEventForm(true); }}
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
                  <button onClick={() => { setGuideForm({ id: '', title: '', content: '', details: [] }); setEditingId(null); setShowGuideForm(true); }} className="flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl">
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

            {activeTab === 'textos' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-amber-900">Textos Institucionais</h2>
                  <button
                    onClick={() => {
                      setContentForm({ id: '', key: '', title: '', content: '' });
                      setEditingId(null);
                      setShowContentForm(true);
                    }}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Novo Texto</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {contentTexts.map((text) => (
                    <div key={text.id} className="bg-white rounded-xl border-2 border-amber-100 p-6 hover:border-amber-300 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-amber-900">{text.title}</h3>
                          <p className="text-sm text-gray-500">Chave: {text.key}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditContent(text)}
                            className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-all"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteContent(text.id)}
                            className="p-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm line-clamp-2">{text.content}</p>
                    </div>
                  ))}
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
      {showContentForm && <ContentFormModal />}
    </section>
  );
}