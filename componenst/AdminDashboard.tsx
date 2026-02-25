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
  Save,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Upload,
  Globe,
  Settings,
  Newspaper
} from 'lucide-react';
import {
  eventsAPI,
  publicEventsAPI,
  chapelsAPI,
  clergyAPI,
  guidesAPI,
  inscriptionsAPI,
  contentAPI,
  eventPhotosAPI,
  adminsAPI,
  movementsAPI,
  formerPriestsAPI,
  newsAPI,
  carouselAPI,
  schedulesAPI,
  registrationLinksAPI,
  getAdminProfile,
  setAdminProfile
} from '../src/services/api';
import { ImageUpload } from './ImageUpload';

interface AdminDashboardProps {
  onLogout: () => void;
}

type ActionVariant = 'publish' | 'edit' | 'delete' | 'move' | 'photo' | 'list';

interface ActionIconButtonProps {
  title: string;
  onClick: () => void;
  variant: ActionVariant;
  active?: boolean;
  children: React.ReactNode;
  iconSizeClass?: string;
  paddingClass?: string;
  disabled?: boolean;
}

const ActionIconButton = ({
  title,
  onClick,
  variant,
  active = false,
  children,
  iconSizeClass = 'w-5 h-5',
  paddingClass = 'p-3',
  disabled = false,
}: ActionIconButtonProps) => {
  const classes = {
    publish: active
      ? 'bg-green-100 hover:bg-green-200 text-green-700'
      : 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    edit: 'bg-blue-100 hover:bg-blue-200 text-blue-700',
    delete: 'bg-red-100 hover:bg-red-200 text-red-700',
    move: 'bg-amber-100 hover:bg-amber-200 text-amber-700',
    photo: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700',
    list: 'bg-green-100 hover:bg-green-200 text-green-700',
  };

  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`${paddingClass} rounded-lg transition-all ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : classes[variant]}`}
    >
      <span className={iconSizeClass}>{children}</span>
    </button>
  );
};

type TabType = 'eventos' | 'programacoes' | 'inscricoes-links' | 'paroquia' | 'guias' | 'administradores' | 'movimentos' | 'padres' | 'noticias' | 'inicio' | 'brasao';

interface Event {
  id: string;
  title: string;
  date: string;
  dateEnd?: string;
  time: string;
  location: string;
  description: string;
  category: 'Missa' | 'Evento' | 'Retiro' | 'Festa' | 'Terço' | 'Adoração' | 'Confissão' | 'Celebração';
  acceptsRegistration: boolean;
  published?: boolean;
  isActive?: boolean;
  isProgram?: boolean;
  isInscriptionEvent?: boolean;
  maxParticipants?: number | null;
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
  address?: string;
  number?: string;
  coordinator: string;
  description?: string;
  photoUrl?: string;
  phone?: string;
  email?: string;
}

interface ClergyMember {
  id: string;
  name: string;
  role: string;
  startYear: string;
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
  imageUrl?: string;
}

interface AdminUser {
  id: string;
  username: string;
  role: 'admin' | 'super';
}

interface PastoralMovement {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  coordinator?: string;
  meetings: string;
}

interface FormerPriest {
  id: string;
  name: string;
  period: string;
  subtext?: string;
  description: string;
  imageUrl: string;
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  publishedAt: string;
}

interface CarouselItem {
  id: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  link?: string;
  buttonText?: string;
  titleColor?: string;
  titleColorEnd?: string;
  subtitleColor?: string;
  linkColor?: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
}

interface RegistrationLinkItem {
  id: string;
  title: string;
  date: string;
  description: string;
  formUrl: string;
  imageUrl?: string;
  isActive: boolean;
}

interface EventFormModalProps {
  editingId: string | null;
  eventForm: Event;
  onClose: () => void;
  onSave: () => void;
  onTitleChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

const EventFormModal = ({
  editingId,
  eventForm,
  onClose,
  onSave,
  onTitleChange,
  onDateChange,
  onTimeChange,
  onLocationChange,
  onCategoryChange,
  onDescriptionChange,
}: EventFormModalProps) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-amber-900">{editingId ? 'Editar' : 'Nova'} Programação</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Título do evento"
          value={eventForm.title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="date"
            value={eventForm.date}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
          />
          <input
            type="text"
            placeholder="Ex: 19:00 ou 19:00 às 20:00"
            value={eventForm.time}
            onChange={(e) => onTimeChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
          />
        </div>
        <input
          type="text"
          placeholder="Local"
          value={eventForm.location}
          onChange={(e) => onLocationChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
        />
        <select
          value={eventForm.category}
          onChange={(e) => onCategoryChange(e.target.value as any)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
        >
          <option value="evento">Evento</option>
          <option value="missa">Missa</option>
          <option value="retiro">Retiro</option>
          <option value="festa">Festa</option>
          <option value="terço">Terço</option>
          <option value="adoração">Adoração</option>
          <option value="confissão">Confissão</option>
          <option value="celebração">Celebração</option>
        </select>
        <textarea
          placeholder="Descrição do evento"
          value={eventForm.description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
        />
        <button
          onClick={onSave}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold transition-all"
        >
          <Save className="w-5 h-5" />
          <span>Salvar Programação</span>
        </button>
      </div>
    </div>
  </div>
);

interface InscriptionEventFormModalProps {
  editingId: string | null;
  eventForm: Event;
  onClose: () => void;
  onSave: () => void;
  onTitleChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onDateEndChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onMaxParticipantsChange: (value: number | null) => void;
}

const InscriptionEventFormModal = ({
  editingId,
  eventForm,
  onClose,
  onSave,
  onTitleChange,
  onDateChange,
  onDateEndChange,
  onTimeChange,
  onLocationChange,
  onDescriptionChange,
  onMaxParticipantsChange,
}: InscriptionEventFormModalProps) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-amber-900">{editingId ? 'Editar' : 'Novo'} Evento com Inscrição</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Título do evento"
          value={eventForm.title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Começa em</label>
            <input
              type="date"
              value={eventForm.date}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Termina em</label>
            <input
              type="date"
              value={eventForm.dateEnd || ''}
              onChange={(e) => onDateEndChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
            />
          </div>
        </div>
        <input
          type="text"
          placeholder="Ex: 19:00 ou 19:00 às 20:00"
          value={eventForm.time}
          onChange={(e) => onTimeChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
        />
        <input
          type="text"
          placeholder="Local"
          value={eventForm.location}
          onChange={(e) => onLocationChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
        />
        <textarea
          placeholder="Descrição do evento"
          value={eventForm.description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
        />
        <input
          type="number"
          placeholder="Quantidade máxima de participantes"
          value={eventForm.maxParticipants || ''}
          onChange={(e) => onMaxParticipantsChange(e.target.value ? parseInt(e.target.value) : null)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
          min="1"
          required
        />
        <button
          onClick={onSave}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold transition-all"
        >
          <Save className="w-5 h-5" />
          <span>Salvar Evento</span>
        </button>
      </div>
    </div>
  </div>
);

interface InscriptionsModalProps {
  event: Event | null;
  inscriptions: any[];
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const InscriptionsModal = ({ event, inscriptions, isOpen, onClose, onDelete }: InscriptionsModalProps) => {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-amber-900">Inscritos Confirmados</h3>
            <p className="text-gray-600 mt-1">{event.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-lg font-semibold text-amber-900">
            Total: <span className="text-amber-600">{inscriptions.length}</span> pessoas confirmadas
          </p>
        </div>

        {inscriptions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Nenhuma inscrição confirmada ainda</p>
          </div>
        ) : (
          <div className="space-y-3">
            {inscriptions.map((inscription) => (
              <div key={inscription.id} className="border border-gray-200 rounded-lg p-4 hover:border-amber-300 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{inscription.name}</h4>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p> {inscription.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      ✓ Confirmado
                    </span>
                    <button
                      onClick={() => {
                        if (window.confirm(`Deseja excluir a inscrição de ${inscription.name}?`)) {
                          onDelete(inscription.id);
                        }
                      }}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all"
                      title="Excluir inscrição"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface ChapelFormModalProps {
  editingId: string | null;
  chapelForm: Chapel;
  onClose: () => void;
  onSave: () => void;
  onNameChange: (value: string) => void;
  onNeighborhoodChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onNumberChange: (value: string) => void;
  onCoordinatorChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPhotoUrlChange: (value: string) => void;
}

const ChapelFormModal = ({
  editingId,
  chapelForm,
  onClose,
  onSave,
  onNameChange,
  onNeighborhoodChange,
  onAddressChange,
  onNumberChange,
  onCoordinatorChange,
  onPhoneChange,
  onEmailChange,
  onDescriptionChange,
  onPhotoUrlChange,
}: ChapelFormModalProps) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[88vh] overflow-y-auto p-5 sm:p-8">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-2xl font-bold text-amber-900">{editingId ? 'Editar' : 'Nova'} Capela</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Nome da capela"
          value={chapelForm.name || ''}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
        />
        <input
          type="text"
          placeholder="Bairro"
          value={chapelForm.neighborhood || ''}
          onChange={(e) => onNeighborhoodChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
        />
        <textarea
          placeholder="Descrição da Capela"
          value={chapelForm.description || ''}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
        />
        <div className="space-y-1">
          <label className="text-sm font-medium text-amber-900">Foto da Capela (Opcional mas recomendado)</label>
          <input
            type="text"
            placeholder="URL da foto (ou faça upload)"
            value={chapelForm.photoUrl || ''}
            onChange={(e) => onPhotoUrlChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none mb-2"
          />
          <ImageUpload onImageUrlChange={onPhotoUrlChange} currentImageUrl={chapelForm.photoUrl} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Rua"
            value={chapelForm.address || ''}
            onChange={(e) => onAddressChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
          />
          <input
            type="text"
            placeholder="Número"
            value={chapelForm.number || ''}
            onChange={(e) => onNumberChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
          />
        </div>

        {/* Seção de dados do coordenador */}
        <div className="border-t border-amber-200 pt-4 mt-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
            <p className="text-sm text-amber-800 font-medium">
              📝 Dados do Coordenador
            </p>
            <p className="text-xs text-amber-600 mt-1">
              Preencha as informações de contato do coordenador da capela
            </p>
          </div>

          <input
            type="text"
            placeholder="Nome do Coordenador"
            value={chapelForm.coordinator || ''}
            onChange={(e) => onCoordinatorChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none mb-3"
          />
          <input
            type="tel"
            placeholder="Telefone do Coordenador"
            value={chapelForm.phone || ''}
            onChange={(e) => onPhoneChange(e.target.value)}
            maxLength={15}
            autoComplete="tel"
            inputMode="tel"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none mb-3"
          />
          <input
            type="email"
            placeholder="E-mail do Coordenador"
            value={chapelForm.email || ''}
            onChange={(e) => onEmailChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
          />
        </div>

        <button
          onClick={onSave}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold transition-all"
        >
          <Save className="w-5 h-5" />
          <span>Salvar Capela</span>
        </button>
      </div>
    </div>
  </div>
);

interface ClergyFormModalProps {
  editingId: string | null;
  clergyForm: ClergyMember;
  clergyPeriodMode: 'atual' | 'numeros';
  clergyPeriodStart: string;
  clergyPeriodEnd: string;
  isClergyFormValid: boolean;
  onClose: () => void;
  onSave: () => void;
  onNameChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onPeriodModeChange: (mode: 'atual' | 'numeros') => void;
  onPeriodStartChange: (value: string) => void;
  onPeriodEndChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onBioChange: (value: string) => void;
  onImageChange: (value: string) => void;
  onCurrentChange: (value: boolean) => void;
  onPhoneChange: (value: string) => void;
}

const ClergyFormModal = ({
  editingId,
  clergyForm,
  clergyPeriodMode,
  clergyPeriodStart,
  clergyPeriodEnd,
  isClergyFormValid,
  onClose,
  onSave,
  onNameChange,
  onRoleChange,
  onPeriodModeChange,
  onPeriodStartChange,
  onPeriodEndChange,
  onEmailChange,
  onBioChange,
  onImageChange,
  onCurrentChange,
  onPhoneChange,
}: ClergyFormModalProps) => {
  const handleImageUpload = (url: string) => {
    onImageChange(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-amber-900">{editingId ? 'Editar' : 'Adicionar'} Membro do Clero</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
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
              onChange={(e) => onNameChange(e.target.value)}
              autoFocus
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="clergy-role" className="text-sm font-medium text-amber-900">Cargo</label>
            <select
              id="clergy-role"
              value={clergyForm.role}
              onChange={(e) => onRoleChange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
            >
              <option value="">Selecione</option>
              <option value="Pároco">Pároco</option>
              <option value="Vigário Paroquial">Vigário Paroquial</option>
              <option value="Administrador">Administrador</option>
              <option value="Frei">Frei</option>
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="clergy-period-start" className="text-sm font-medium text-amber-900">Ano de início na paróquia</label>
            <input
              id="clergy-period-start"
              type="number"
              inputMode="numeric"
              min={1900}
              max={2100}
              placeholder="Ex: 2020"
              value={clergyPeriodStart}
              onChange={(e) => onPeriodStartChange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="clergy-email" className="text-sm font-medium text-amber-900">E-mail (opcional)</label>
            <input
              id="clergy-email"
              type="email"
              placeholder="exemplo@paroquia.org"
              value={clergyForm.email}
              onChange={(e) => onEmailChange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="clergy-bio" className="text-sm font-medium text-amber-900">Biografia (opcional)</label>
            <textarea
              id="clergy-bio"
              placeholder="Breve biografia"
              value={clergyForm.bio || ''}
              onChange={(e) => onBioChange(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="clergy-image" className="text-sm font-medium text-amber-900">Imagem do Membro</label>
            <div className="flex gap-2 items-start">
              <div className="flex-1">
                <input
                  id="clergy-image"
                  type="text"
                  placeholder="https://... ou selecione uma imagem acima"
                  value={clergyForm.imageUrl || ''}
                  onChange={(e) => onImageChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
                />
              </div>
            </div>
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
          <ImageUpload
            onImageUrlChange={handleImageUpload}
            currentImageUrl={clergyForm.imageUrl}
            label="Ou faça upload de uma foto"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={Boolean(clergyForm.current)}
              onChange={(e) => onCurrentChange(e.target.checked)}
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
              onChange={(e) => onPhoneChange(e.target.value)}
              autoComplete="tel"
              inputMode="tel"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
            />
          </div>
          {!isClergyFormValid && (
            <p className="text-xs text-amber-700">Preencha nome, função e período para salvar.</p>
          )}
          <button
            onClick={onSave}
            disabled={!isClergyFormValid}
            className={`w-full flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${isClergyFormValid
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
};

interface GuideFormModalProps {
  editingId: string | null;
  guideForm: Guide;
  onClose: () => void;
  onSave: () => void;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onDetailsChange: (value: string) => void;
}

const GuideFormModal = ({
  editingId,
  guideForm,
  onClose,
  onSave,
  onTitleChange,
  onContentChange,
  onDetailsChange,
}: GuideFormModalProps) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-amber-900">{editingId ? 'Editar' : 'Novo'} Guia</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Título do guia"
          value={guideForm.title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
        />
        <div>
          <label className="block text-sm font-semibold text-amber-900 mb-2">
            Instruções Detalhadas
          </label>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-2 rounded-r-lg">
            <p className="text-xs text-blue-800 flex items-start">
              <span className="mr-2">💡</span>
              <span>Digite cada instrução em uma linha separada. Cada linha será exibida como um item de lista.</span>
            </p>
          </div>
          <textarea
            placeholder="Exemplo:&#10;Dirija-se à secretaria paroquial&#10;Apresente os documentos necessários&#10;Agende a data do sacramento&#10;Participe do curso de preparação"
            value={guideForm.details.join('\n')}
            onChange={(e) => onDetailsChange(e.target.value)}
            rows={7}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            {guideForm.details.length} {guideForm.details.length === 1 ? 'item' : 'itens'} cadastrado(s)
          </p>
        </div>
        <button
          onClick={onSave}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold transition-all"
        >
          <Save className="w-5 h-5" />
          <span>Salvar Guia</span>
        </button>
      </div>
    </div>
  </div>
);

interface PastoralMovementFormModalProps {
  editingId: string | null;
  movementForm: PastoralMovement;
  onClose: () => void;
  onSave: () => void;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCoordinatorChange: (value: string) => void;
  onIconUrlChange: (value: string) => void;
  onMeetingsChange: (value: string) => void;
}

const PastoralMovementFormModal = ({
  editingId,
  movementForm,
  onClose,
  onSave,
  onNameChange,
  onDescriptionChange,
  onCoordinatorChange,
  onIconUrlChange,
  onMeetingsChange,
}: PastoralMovementFormModalProps) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-amber-900">{editingId ? 'Editar' : 'Novo'} Movimento/Pastoral</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Nome (ex: Legião de Maria)"
          value={movementForm.name}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
        />
        <textarea
          placeholder="Descrição"
          value={movementForm.description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
        />
        <input
          type="text"
          placeholder="Coordenador"
          value={movementForm.coordinator || ''}
          onChange={(e) => onCoordinatorChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
        />
        <input
          type="text"
          placeholder="Horário/Local dos encontros (ex: Quartas às 19h)"
          value={movementForm.meetings || ''}
          onChange={(e) => onMeetingsChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
        />
        <div className="space-y-1">
          <label className="text-sm font-medium text-amber-900">Ícone ou Imagem representativa</label>
          <input
            type="text"
            placeholder="URL da imagem (ou faça upload)"
            value={movementForm.iconUrl || ''}
            onChange={(e) => onIconUrlChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none mb-2"
          />
          <ImageUpload onImageUrlChange={onIconUrlChange} currentImageUrl={movementForm.iconUrl} />
        </div>
        <button
          onClick={onSave}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold transition-all mt-4"
        >
          <Save className="w-5 h-5" />
          <span>Salvar Movimento</span>
        </button>
      </div>
    </div>
  </div>
);

interface FormerPriestFormModalProps {
  editingId: string | null;
  priestForm: FormerPriest;
  onClose: () => void;
  onSave: () => void;
  onNameChange: (value: string) => void;
  onPeriodChange: (value: string) => void;
  onSubtextChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onImageUrlChange: (value: string) => void;
}

const FormerPriestFormModal = ({
  editingId,
  priestForm,
  onClose,
  onSave,
  onNameChange,
  onPeriodChange,
  onSubtextChange,
  onDescriptionChange,
  onImageUrlChange,
}: FormerPriestFormModalProps) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-amber-900">{editingId ? 'Editar' : 'Novo'} Antigo Padre</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Nome do Padre"
          value={priestForm.name}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
        />
        <input
          type="text"
          placeholder="Período (ex: 2010 - 2015)"
          value={priestForm.period || ''}
          onChange={(e) => onPeriodChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
        />
        <select
          value={priestForm.subtext || ''}
          onChange={(e) => onSubtextChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
        >
          <option value="">Selecione o cargo (subtexto)</option>
          <option value="Pároco">Pároco</option>
          <option value="Seminarista">Seminarista</option>
          <option value="Frei">Frei</option>
          <option value="Vigário Paroquial">Vigário Paroquial</option>
          <option value="Administrador">Administrador</option>
        </select>
        <textarea
          placeholder="Breve descrição ou biografia"
          value={priestForm.description || ''}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
        />
        <div className="space-y-1">
          <label className="text-sm font-medium text-amber-900">Foto</label>
          <input
            type="text"
            placeholder="URL da foto"
            value={priestForm.imageUrl || ''}
            onChange={(e) => onImageUrlChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none mb-2"
          />
          <ImageUpload onImageUrlChange={onImageUrlChange} currentImageUrl={priestForm.imageUrl} />
        </div>
        <button
          onClick={onSave}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold transition-all mt-4"
        >
          <Save className="w-5 h-5" />
          <span>Salvar Padre</span>
        </button>
      </div>
    </div>
  </div>
);

interface NewsFormModalProps {
  editingId: string | null;
  newsForm: NewsItem;
  onClose: () => void;
  onSave: () => void;
  onTitleChange: (value: string) => void;
  onSummaryChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onImageUrlChange: (value: string) => void;
  onPublishedAtChange: (value: string) => void;
}

const NewsFormModal = ({
  editingId,
  newsForm,
  onClose,
  onSave,
  onTitleChange,
  onSummaryChange,
  onContentChange,
  onImageUrlChange,
  onPublishedAtChange,
}: NewsFormModalProps) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-amber-900">{editingId ? 'Editar' : 'Nova'} Notícia</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Título da Notícia"
          value={newsForm.title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none font-semibold text-lg"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Publicação</label>
            <input
              type="date"
              value={newsForm.publishedAt ? new Date(newsForm.publishedAt).toISOString().split('T')[0] : ''}
              onChange={(e) => onPublishedAtChange(e.target.value ? new Date(e.target.value).toISOString() : new Date().toISOString())}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
            />
          </div>
        </div>
        <textarea
          placeholder="Resumo curto (aparecerá nos cards)"
          value={newsForm.summary || ''}
          onChange={(e) => onSummaryChange(e.target.value)}
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
        />
        <textarea
          placeholder="Conteúdo completo da notícia (aceita texto formatado ou parágrafos longos)"
          value={newsForm.content || ''}
          onChange={(e) => onContentChange(e.target.value)}
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
        />
        <div className="space-y-1">
          <label className="text-sm font-medium text-amber-900">Imagem de Destaque</label>
          <input
            type="text"
            placeholder="URL da imagem (ou faça upload)"
            value={newsForm.imageUrl || ''}
            onChange={(e) => onImageUrlChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none mb-2"
          />
          <ImageUpload onImageUrlChange={onImageUrlChange} currentImageUrl={newsForm.imageUrl} />
        </div>
        <button
          onClick={onSave}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold transition-all mt-4"
        >
          <Save className="w-5 h-5" />
          <span>Salvar Notícia</span>
        </button>
      </div>
    </div>
  </div>
);

interface ContentFormModalProps {
  editingId: string | null;
  contentForm: ContentText;
  onClose: () => void;
  onSave: () => void;
  onKeyChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
}

const ContentFormModal = ({
  editingId,
  contentForm,
  onClose,
  onSave,
  onKeyChange,
  onTitleChange,
  onContentChange,
}: ContentFormModalProps) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-amber-900">{editingId ? 'Editar' : 'Novo'} Texto Institucional</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Chave única (ex: about, mission)"
          value={contentForm.key}
          onChange={(e) => onKeyChange(e.target.value)}
          disabled={!!editingId}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none disabled:bg-gray-100"
        />
        <input
          type="text"
          placeholder="Título"
          value={contentForm.title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
        />
        <textarea
          placeholder="Conteúdo"
          value={contentForm.content}
          onChange={(e) => onContentChange(e.target.value)}
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
        />
        <button
          onClick={onSave}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold transition-all"
        >
          <Save className="w-5 h-5" />
          <span>Salvar Texto</span>
        </button>
      </div>
    </div>
  </div>
);

interface CarouselFormModalProps {
  editingId: string | null;
  carouselForm: CarouselItem;
  onClose: () => void;
  onSave: () => void;
  onImageUrlChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onTitleHighlightChange: (value: string) => void;
  onSubtitleChange: (value: string) => void;
  onLinkChange: (value: string) => void;
  onButtonTextChange: (value: string) => void;
  onTitleColorChange: (value: string) => void;
  onTitleColorEndChange: (value: string) => void;
  onSubtitleColorChange: (value: string) => void;
  onLinkColorChange: (value: string) => void;
  onOrderIndexChange: (value: number) => void;
  onIsActiveChange: (value: boolean) => void;
}

const CarouselFormModal = ({
  editingId,
  carouselForm,
  onClose,
  onSave,
  onImageUrlChange,
  onTitleChange,
  onTitleHighlightChange,
  onSubtitleChange,
  onLinkChange,
  onButtonTextChange,
  onTitleColorChange,
  onTitleColorEndChange,
  onSubtitleColorChange,
  onLinkColorChange,
  onOrderIndexChange,
  onIsActiveChange,
}: CarouselFormModalProps) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-amber-900">{editingId ? 'Editar' : 'Novo'} Item do Carrossel</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-amber-900 block mb-1">Imagem do Carrossel (Obrigatória)</label>
          <input
            type="text"
            placeholder="URL da foto (ou faça upload)"
            value={carouselForm.imageUrl}
            onChange={(e) => onImageUrlChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none mb-2"
          />
          <ImageUpload onImageUrlChange={onImageUrlChange} currentImageUrl={carouselForm.imageUrl} />
        </div>
        <input
          type="text"
          placeholder="Título - Linha 1 (Opcional)"
          value={carouselForm.title || ''}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-600 outline-none text-xl font-extrabold tracking-tight text-gray-900 placeholder:text-gray-400 shadow-sm"
        />
        <input
          type="text"
          placeholder="Título Destaque - Linha 2 (Opcional)"
          value={carouselForm.titleHighlight || ''}
          onChange={(e) => onTitleHighlightChange(e.target.value)}
          className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-600 outline-none text-2xl font-extrabold tracking-tight text-yellow-600 placeholder:text-gray-400 shadow-sm"
        />
        <input
          type="text"
          placeholder="Subtítulo (Opcional)"
          value={carouselForm.subtitle || ''}
          onChange={(e) => onSubtitleChange(e.target.value)}
          className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-600 outline-none text-lg font-medium text-gray-700 placeholder:text-gray-400 shadow-sm"
        />
        <input
          type="text"
          placeholder="Link de Destino (Opcional)"
          value={carouselForm.link || ''}
          onChange={(e) => onLinkChange(e.target.value)}
          className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-600 outline-none text-base font-semibold text-blue-700 placeholder:text-gray-400 shadow-sm"
        />
        <input
          type="text"
          placeholder="Texto do Botão (Opcional)"
          value={carouselForm.buttonText || ''}
          onChange={(e) => onButtonTextChange(e.target.value)}
          className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-600 outline-none text-base font-semibold text-gray-800 placeholder:text-gray-400 shadow-sm"
        />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <label className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl bg-gray-50">
            <span className="text-sm font-medium text-gray-700">Cor título 1</span>
            <input
              type="color"
              value={carouselForm.titleColor || '#FFFFFF'}
              onChange={(e) => onTitleColorChange(e.target.value)}
              className="ml-auto h-8 w-10 cursor-pointer rounded border border-gray-300"
            />
          </label>
          <label className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl bg-gray-50">
            <span className="text-sm font-medium text-gray-700">Cor título 2</span>
            <input
              type="color"
              value={carouselForm.titleColorEnd || '#F59E0B'}
              onChange={(e) => onTitleColorEndChange(e.target.value)}
              className="ml-auto h-8 w-10 cursor-pointer rounded border border-gray-300"
            />
          </label>
          <label className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl bg-gray-50">
            <span className="text-sm font-medium text-gray-700">Cor subtítulo</span>
            <input
              type="color"
              value={carouselForm.subtitleColor || '#F3F4F6'}
              onChange={(e) => onSubtitleColorChange(e.target.value)}
              className="ml-auto h-8 w-10 cursor-pointer rounded border border-gray-300"
            />
          </label>
          <label className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl bg-gray-50">
            <span className="text-sm font-medium text-gray-700">Cor link</span>
            <input
              type="color"
              value={carouselForm.linkColor || '#FFFFFF'}
              onChange={(e) => onLinkColorChange(e.target.value)}
              className="ml-auto h-8 w-10 cursor-pointer rounded border border-gray-300"
            />
          </label>
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-amber-900">Ordem de Exibição (Ex: 1, 2, 3)</label>
          <input
            type="number"
            value={carouselForm.order !== undefined ? carouselForm.order : 0}
            onChange={(e) => onOrderIndexChange(Number(e.target.value))}
            className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none text-right"
          />
        </div>
        <label className="flex items-center space-x-2 bg-gray-50 p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-100 transition-all">
          <input
            type="checkbox"
            checked={carouselForm.isActive}
            onChange={(e) => onIsActiveChange(e.target.checked)}
            className="rounded border-gray-300 text-amber-600 focus:ring-amber-600 w-5 h-5"
          />
          <div>
            <span className="font-semibold text-gray-700 block">Exibir no site</span>
            <span className="text-sm text-gray-500">Aparecerá na página inicial da paróquia.</span>
          </div>
        </label>
        <button
          onClick={onSave}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold transition-all mt-4"
        >
          <Save className="w-5 h-5" />
          <span>Salvar Carrossel</span>
        </button>
      </div>
    </div>
  </div>
);

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  type ProgramSource = 'schedule' | 'event';
  const [activeTab, setActiveTab] = useState<TabType>('eventos');
  const [showEventForm, setShowEventForm] = useState(false);
  const [showInscriptionEventForm, setShowInscriptionEventForm] = useState(false);
  const [showChapelForm, setShowChapelForm] = useState(false);
  const [showCleryForm, setShowCleryForm] = useState(false);
  const [showGuideForm, setShowGuideForm] = useState(false);
  const [showContentForm, setShowContentForm] = useState(false);
  const [showMovementForm, setShowMovementForm] = useState(false);
  const [showFormerPriestForm, setShowFormerPriestForm] = useState(false);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [showRegistrationLinkForm, setShowRegistrationLinkForm] = useState(false);
  const [showInscriptionsModal, setShowInscriptionsModal] = useState(false);
  const [selectedEventForInscriptions, setSelectedEventForInscriptions] = useState<Event | null>(null);
  const [eventInscriptions, setEventInscriptions] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [_loading, setLoading] = useState(false);
  const [showPhotoUploadModal, setShowPhotoUploadModal] = useState(false);
  const [selectedEventForPhotos, setSelectedEventForPhotos] = useState<Event | null>(null);
  const [eventPhotos, setEventPhotos] = useState<any[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [editingProgramSource, setEditingProgramSource] = useState<ProgramSource | null>(null);

  // State from API
  const [events, setEvents] = useState<Event[]>([]);
  const [inscriptionEvents, setInscriptionEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [chapels, setChapels] = useState<Chapel[]>([]);
  const [clergy, setCLergy] = useState<ClergyMember[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [contentTexts, setContentTexts] = useState<ContentText[]>([]);
  const [movements, setMovements] = useState<PastoralMovement[]>([]);
  const [formerPriests, setFormerPriests] = useState<FormerPriest[]>([]);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => getAdminProfile());
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [registrationLinks, setRegistrationLinks] = useState<RegistrationLinkItem[]>([]);

  // Form state
  const [eventForm, setEventForm] = useState<Event>({
    id: '',
    title: '',
    date: '',
    time: '00:00 às 00:00',
    location: '',
    description: '',
    category: 'Evento',
    acceptsRegistration: true,
  });
  const [chapelForm, setChapelForm] = useState<Chapel>({ id: '', name: '', neighborhood: '', address: '', number: '', coordinator: '', phone: '', email: '', description: '', photoUrl: '' });
  const [clergyForm, setClergyForm] = useState<ClergyMember>({ id: '', name: '', role: '', startYear: '', bio: '', imageUrl: '', current: false, email: '', phone: '' });
  const [guideForm, setGuideForm] = useState<Guide>({ id: '', title: '', content: '', details: [] });
  const [contentForm, setContentForm] = useState<ContentText>({ id: '', key: '', title: '', content: '' });
  const [movementForm, setMovementForm] = useState<PastoralMovement>({ id: '', name: '', description: '', iconUrl: '', meetings: '' });
  const [brasaoForm, setBrasaoForm] = useState<ContentText>({ id: '', key: 'brasao', title: '', content: '', imageUrl: '' });
  const [formerPriestForm, setFormerPriestForm] = useState<FormerPriest>({ id: '', name: '', period: '', subtext: '', description: '', imageUrl: '' });
  const [newsForm, setNewsForm] = useState<NewsItem>({ id: '', title: '', summary: '', content: '', imageUrl: '', publishedAt: new Date().toISOString() });
  const [carouselForm, setCarouselForm] = useState<CarouselItem>({ id: '', imageUrl: '', title: '', titleHighlight: '', subtitle: '', link: '', buttonText: 'Saiba Mais', titleColor: '#FFFFFF', titleColorEnd: '#F59E0B', order: 0, isActive: true });
  const [showCarouselForm, setShowCarouselForm] = useState(false);
  const [clergyPeriodMode, setClergyPeriodMode] = useState<'atual' | 'numeros'>('atual');
  const [clergyPeriodStart, setClergyPeriodStart] = useState('');
  const [clergyPeriodEnd, setClergyPeriodEnd] = useState('');
  const [profileForm, setProfileForm] = useState({ username: '', password: '', confirmPassword: '' });
  const [adminForm, setAdminForm] = useState({ id: '', username: '', password: '', role: 'admin' as 'admin' | 'super' });
  const [adminFormMode, setAdminFormMode] = useState<'create' | 'edit'>('create');
  const [registrationLinkForm, setRegistrationLinkForm] = useState<RegistrationLinkItem>({
    id: '',
    title: '',
    date: '',
    description: '',
    formUrl: '',
    imageUrl: '',
    isActive: true,
  });

  const isClergyFormValid = Boolean(
    clergyForm.name.trim() &&
    clergyForm.role.trim() &&
    clergyForm.startYear.trim()
  );

  const isSuperAdmin = currentAdmin?.role === 'super';

  // Event form handlers
  const handleEventTitleChange = (value: string) => setEventForm(prev => ({ ...prev, title: value }));
  const handleEventDateChange = (value: string) => setEventForm(prev => ({ ...prev, date: value }));
  const handleEventDateEndChange = (value: string) => setEventForm(prev => ({ ...prev, dateEnd: value }));
  const handleEventLocationChange = (value: string) => setEventForm(prev => ({ ...prev, location: value }));
  const handleEventCategoryChange = (value: string) => setEventForm(prev => ({ ...prev, category: value as any }));
  const handleEventDescriptionChange = (value: string) => setEventForm(prev => ({ ...prev, description: value }));
  const handleEventMaxParticipantsChange = (value: number | null) => setEventForm(prev => ({ ...prev, maxParticipants: value }));

  const handleEventTimeChange = (value: string) => {
    setEventForm(prev => ({ ...prev, time: value }));
  };

  // Chapel form handlers
  const handleChapelNameChange = (value: string) => setChapelForm(prev => ({ ...prev, name: value }));
  const handleChapelNeighborhoodChange = (value: string) => setChapelForm(prev => ({ ...prev, neighborhood: value }));
  const handleChapelAddressChange = (value: string) => setChapelForm(prev => ({ ...prev, address: value }));
  const handleChapelNumberChange = (value: string) => setChapelForm(prev => ({ ...prev, number: value }));
  const handleChapelCoordinatorChange = (value: string) => setChapelForm(prev => ({ ...prev, coordinator: value }));
  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (!digits) return '';
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };
  const handleChapelPhoneChange = (value: string) => setChapelForm(prev => ({ ...prev, phone: formatPhoneNumber(value) }));
  const handleChapelEmailChange = (value: string) => setChapelForm(prev => ({ ...prev, email: value }));

  // Clergy form handlers
  const handleClergyNameChange = (value: string) => setClergyForm(prev => ({ ...prev, name: value }));
  const handleClergyRoleChange = (value: string) => setClergyForm(prev => ({ ...prev, role: value }));
  const handleClergyEmailChange = (value: string) => setClergyForm(prev => ({ ...prev, email: value }));
  const handleClergyBioChange = (value: string) => setClergyForm(prev => ({ ...prev, bio: value }));
  const handleClergyImageChange = (value: string) => setClergyForm(prev => ({ ...prev, imageUrl: value }));
  const handleClergyCurrentChange = (value: boolean) => setClergyForm(prev => ({ ...prev, current: value }));
  const handleClergyPhoneChange = (value: string) => setClergyForm(prev => ({ ...prev, phone: value }));

  // Guide form handlers
  const handleGuideTitleChange = (value: string) => setGuideForm(prev => ({ ...prev, title: value }));
  const handleGuideContentChange = (value: string) => setGuideForm(prev => ({ ...prev, content: value }));
  const handleGuideDetailsChange = (value: string) => setGuideForm(prev => ({ ...prev, details: value.split('\n') }));

  // Content form handlers
  const handleContentKeyChange = (value: string) => setContentForm(prev => ({ ...prev, key: value }));
  const handleContentTitleChange = (value: string) => setContentForm(prev => ({ ...prev, title: value }));
  const handleContentContentChange = (value: string) => setContentForm(prev => ({ ...prev, content: value }));

  // Movement form handlers
  const handleMovementNameChange = (value: string) => setMovementForm(prev => ({ ...prev, name: value }));
  const handleMovementDescriptionChange = (value: string) => setMovementForm(prev => ({ ...prev, description: value }));
  const handleMovementCoordinatorChange = (value: string) => setMovementForm(prev => ({ ...prev, coordinator: value }));
  const handleMovementIconUrlChange = (value: string) => setMovementForm(prev => ({ ...prev, iconUrl: value }));
  const handleMovementMeetingsChange = (value: string) => setMovementForm(prev => ({ ...prev, meetings: value }));

  // Former Priest form handlers
  const handleFormerPriestNameChange = (value: string) => setFormerPriestForm(prev => ({ ...prev, name: value }));
  const handleFormerPriestPeriodChange = (value: string) => setFormerPriestForm(prev => ({ ...prev, period: value }));
  const handleFormerPriestSubtextChange = (value: string) => setFormerPriestForm(prev => ({ ...prev, subtext: value }));
  const handleFormerPriestDescriptionChange = (value: string) => setFormerPriestForm(prev => ({ ...prev, description: value }));
  const handleFormerPriestImageUrlChange = (value: string) => setFormerPriestForm(prev => ({ ...prev, imageUrl: value }));

  // News form handlers
  const handleNewsTitleChange = (value: string) => setNewsForm(prev => ({ ...prev, title: value }));
  const handleNewsSummaryChange = (value: string) => setNewsForm(prev => ({ ...prev, summary: value }));
  const handleNewsContentChange = (value: string) => setNewsForm(prev => ({ ...prev, content: value }));
  const handleNewsImageUrlChange = (value: string) => setNewsForm(prev => ({ ...prev, imageUrl: value }));
  const handleNewsPublishedAtChange = (value: string) => setNewsForm(prev => ({ ...prev, publishedAt: value }));

  // Carousel form handlers
  const handleCarouselImageUrlChange = (value: string) => setCarouselForm(prev => ({ ...prev, imageUrl: value }));
  const handleCarouselTitleChange = (value: string) => setCarouselForm(prev => ({ ...prev, title: value }));
  const handleCarouselTitleHighlightChange = (value: string) => setCarouselForm(prev => ({ ...prev, titleHighlight: value }));
  const handleCarouselSubtitleChange = (value: string) => setCarouselForm(prev => ({ ...prev, subtitle: value }));
  const handleCarouselLinkChange = (value: string) => setCarouselForm(prev => ({ ...prev, link: value }));
  const handleCarouselButtonTextChange = (value: string) => setCarouselForm(prev => ({ ...prev, buttonText: value }));
  const handleCarouselTitleColorChange = (value: string) => setCarouselForm(prev => ({ ...prev, titleColor: value }));
  const handleCarouselTitleColorEndChange = (value: string) => setCarouselForm(prev => ({ ...prev, titleColorEnd: value }));
  const handleCarouselSubtitleColorChange = (value: string) => setCarouselForm(prev => ({ ...prev, subtitleColor: value }));
  const handleCarouselLinkColorChange = (value: string) => setCarouselForm(prev => ({ ...prev, linkColor: value }));
  const handleCarouselOrderIndexChange = (value: number) => setCarouselForm(prev => ({ ...prev, order: value }));
  const handleCarouselIsActiveChange = (value: boolean) => setCarouselForm(prev => ({ ...prev, isActive: value }));

  const toBool = (value: unknown) => value === true || value === 1 || value === '1';

  const groupEventsByMonth = (eventsList: Event[]) => {
    const grouped: { [key: string]: Event[] } = {};
    eventsList.forEach(event => {
      const date = new Date(`${event.date}T12:00:00`);
      if (Number.isNaN(date.getTime())) return;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(event);
    });
    return Object.keys(grouped).sort().reverse().reduce((acc, key) => {
      acc[key] = grouped[key].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      return acc;
    }, {} as { [key: string]: Event[] });
  };

  const formatMonthYearFromKey = (monthKey: string) => {
    const [yearRaw, monthRaw] = monthKey.split('-');
    const year = Number(yearRaw);
    const month = Number(monthRaw);
    if (!year || !month) return monthKey;
    const text = new Date(year, month - 1, 1).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' });
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const formatTime = (time: string | number | undefined): string => {
    if (!time) return 'Horário não informado';
    const raw = String(time).trim();
    if (!raw) return 'Horário não informado';
    const digitsOnly = raw.replace(/\D/g, '');
    if (digitsOnly.length >= 3 && digitsOnly.length <= 4 && digitsOnly === raw) {
      const timeStr = digitsOnly.padStart(4, '0');
      return `${timeStr.slice(0, 2)}:${timeStr.slice(2)}`;
    }
    return raw;
  };

  // Load data from API on mount
  useEffect(() => {
    loadAllData();
    loadAdminProfile();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [
        schedulesData, eventsData, allAdminEvents, chapelsData, clergyData,
        guidesData, inscriptionsData, contentData,
        movementsData, formerPriestsData, newsData, carouselData, registrationLinksData
      ] = await Promise.all([
        schedulesAPI.getAll(),
        eventsAPI.getAllAdmin(),
        eventsAPI.getAllAdmin(),
        chapelsAPI.getAll(),
        clergyAPI.getAll(),
        guidesAPI.getAll(),
        inscriptionsAPI.getAll(),
        contentAPI.getAll(),
        movementsAPI.getAll(),
        formerPriestsAPI.getAll(),
        newsAPI.getAll(),
        carouselAPI.getAll(),
        registrationLinksAPI.getAll()
      ]);

      setSchedules(schedulesData || []);
      setEvents(eventsData || []);
      setInscriptionEvents((allAdminEvents || []).filter((e: Event) => toBool(e.isInscriptionEvent)));
      setChapels(chapelsData || []);
      setCLergy(clergyData || []);
      setGuides(guidesData || []);
      setContentTexts(contentData || []);
      setMovements(movementsData || []);
      setFormerPriests(formerPriestsData || []);
      setNewsList(newsData || []);
      setCarouselItems(carouselData || []);
      setRegistrationLinks(registrationLinksData || []);

      const brasaoContent = (contentData || []).find((c: any) => c.key === 'brasao');
      if (brasaoContent) {
        setBrasaoForm(brasaoContent as ContentText);
      }

      if (inscriptionsData && Array.isArray(inscriptionsData)) {
        const formatted = inscriptionsData.map((reg: any) => ({
          id: reg.id,
          event: (eventsData || []).find((e: Event) => e.id === reg.eventId)?.title || 'Evento desconhecido',
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

  const loadAdminProfile = async () => {
    try {
      const me = await adminsAPI.getMe();
      setCurrentAdmin(me);
      setAdminProfile(me);
      setProfileForm((prev) => ({ ...prev, username: me.username }));

      if (me.role === 'super') {
        const adminList = await adminsAPI.getAll();
        setAdmins(adminList || []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do admin:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const username = profileForm.username.trim();
      if (!username) {
        alert('Usuário é obrigatório');
        return;
      }

      if (profileForm.password && profileForm.password !== profileForm.confirmPassword) {
        alert('As senhas não conferem');
        return;
      }

      const payload: { username: string; password?: string } = { username };
      if (profileForm.password) {
        payload.password = profileForm.password;
      }

      const response = await adminsAPI.updateMe(payload);
      if (response?.admin) {
        setCurrentAdmin(response.admin);
        setAdminProfile(response.admin);
      }

      setProfileForm((prev) => ({ ...prev, password: '', confirmPassword: '' }));
      alert('Dados atualizados com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      if (error instanceof Error && error.message) {
        alert(error.message);
      } else {
        alert('Erro ao atualizar dados');
      }
    }
  };

  const handleSaveAdmin = async () => {
    try {
      const username = adminForm.username.trim();
      if (!username) {
        alert('Usuário é obrigatório');
        return;
      }

      if (adminFormMode === 'create' && !adminForm.password) {
        alert('Senha é obrigatória para criar admin');
        return;
      }

      const payload: { username: string; password?: string; role?: 'admin' | 'super' } = {
        username,
        role: adminFormMode === 'edit' ? adminForm.role : 'admin',
      };

      if (adminForm.password) {
        payload.password = adminForm.password;
      }

      if (adminFormMode === 'create') {
        await adminsAPI.create(payload);
      } else {
        await adminsAPI.update(adminForm.id, payload);
      }

      const adminList = await adminsAPI.getAll();
      setAdmins(adminList || []);
      setAdminForm({ id: '', username: '', password: '', role: 'admin' });
      setAdminFormMode('create');
      alert('Administrador salvo com sucesso');
    } catch (error) {
      console.error('Erro ao salvar administrador:', error);
      if (error instanceof Error && error.message) {
        alert(error.message);
      } else {
        alert('Erro ao salvar administrador');
      }
    }
  };

  const handleEditAdmin = (admin: AdminUser) => {
    setAdminForm({ id: admin.id, username: admin.username, password: '', role: admin.role });
    setAdminFormMode('edit');
  };

  const handleCancelAdminEdit = () => {
    setAdminForm({ id: '', username: '', password: '', role: 'admin' });
    setAdminFormMode('create');
  };

  const handleSaveBrasao = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!brasaoForm.title.trim() || !brasaoForm.content.trim()) {
        alert('Título e texto são obrigatórios para o brasão.');
        setLoading(false);
        return;
      }

      if (brasaoForm.id) {
        await contentAPI.update(brasaoForm.id, brasaoForm);
      } else {
        await contentAPI.create({ ...brasaoForm, key: 'brasao' });
      }

      await loadAllData();
      const latestBrasao = await contentAPI.getByKey('brasao');
      if (latestBrasao) {
        setBrasaoForm(latestBrasao as ContentText);
      }
      alert('Brasão atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar brasão:', error);
      alert('Erro ao salvar brasão');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este administrador?')) return;

    try {
      await adminsAPI.delete(adminId);
      const adminList = await adminsAPI.getAll();
      setAdmins(adminList || []);
    } catch (error) {
      console.error('Erro ao excluir administrador:', error);
      alert('Erro ao excluir administrador');
    }
  };

  // Event handlers
  const handleSaveEvent = async () => {
    try {
      setLoading(true);

      // Validate required fields
      if (!eventForm.title.trim()) {
        alert('Título é obrigatório');
        setLoading(false);
        return;
      }
      if (!eventForm.date) {
        alert('Data é obrigatória');
        setLoading(false);
        return;
      }
      if (!eventForm.location.trim()) {
        alert('Local é obrigatório');
        setLoading(false);
        return;
      }
      if (!eventForm.time.trim()) {
        alert('Horário é obrigatório');
        setLoading(false);
        return;
      }

      // Validação específica para eventos de inscrição
      if (eventForm.isInscriptionEvent && (!eventForm.maxParticipants || eventForm.maxParticipants <= 0)) {
        alert('Eventos de inscrição precisam ter um limite de vagas definido (maior que zero)');
        setLoading(false);
        return;
      }

      if (editingId) {
        if (activeTab === 'programacoes') {
          if (editingProgramSource === 'event') {
            await eventsAPI.update(editingId, { ...eventForm, isProgram: true, isInscriptionEvent: false });
          } else {
            await schedulesAPI.update(editingId, eventForm);
          }
        } else {
          await eventsAPI.update(editingId, eventForm);
        }
      } else {
        if (activeTab === 'programacoes') {
          await schedulesAPI.create(eventForm);
        } else {
          await eventsAPI.create(eventForm);
        }
      }
      await loadAllData();
      setEventForm({ id: '', title: '', date: '', time: '00:00 às 00:00', location: '', description: '', category: 'Evento', acceptsRegistration: true, maxParticipants: null, isInscriptionEvent: false });
      setShowEventForm(false);
      setEditingId(null);
      setEditingProgramSource(null);
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      alert(error instanceof Error ? error.message : 'Erro ao salvar evento');
    } finally {
      setLoading(false);
    }
  };

  const resetRegistrationLinkForm = () => {
    setRegistrationLinkForm({
      id: '',
      title: '',
      date: '',
      description: '',
      formUrl: '',
      imageUrl: '',
      isActive: true,
    });
    setEditingId(null);
    setShowRegistrationLinkForm(false);
  };

  const handleSaveRegistrationLink = async () => {
    try {
      setLoading(true);

      if (!registrationLinkForm.title.trim()) {
        alert('Título é obrigatório');
        return;
      }
      if (!registrationLinkForm.date) {
        alert('Data é obrigatória');
        return;
      }
      if (!registrationLinkForm.description.trim()) {
        alert('Descrição é obrigatória');
        return;
      }
      if (!registrationLinkForm.formUrl.trim()) {
        alert('Link de inscrição é obrigatório');
        return;
      }

      const payload = {
        title: registrationLinkForm.title.trim(),
        date: registrationLinkForm.date,
        description: registrationLinkForm.description.trim(),
        formUrl: registrationLinkForm.formUrl.trim(),
        imageUrl: registrationLinkForm.imageUrl?.trim() || null,
        isActive: registrationLinkForm.isActive,
      };

      if (editingId) {
        await registrationLinksAPI.update(editingId, payload);
      } else {
        await registrationLinksAPI.create(payload);
      }

      await loadAllData();
      resetRegistrationLinkForm();
    } catch (error) {
      console.error('Erro ao salvar inscrição por link:', error);
      alert(error instanceof Error ? error.message : 'Erro ao salvar inscrição');
    } finally {
      setLoading(false);
    }
  };

  const handleEditRegistrationLink = (item: RegistrationLinkItem) => {
    setRegistrationLinkForm({ ...item, imageUrl: item.imageUrl || '' });
    setEditingId(item.id);
    setShowRegistrationLinkForm(true);
  };

  const handleDeleteRegistrationLink = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta inscrição?')) return;
    try {
      setLoading(true);
      await registrationLinksAPI.delete(id);
      await loadAllData();
    } catch (error) {
      console.error('Erro ao remover inscrição:', error);
      alert(error instanceof Error ? error.message : 'Erro ao remover inscrição');
    } finally {
      setLoading(false);
    }
  };

  const handleEditEvent = (event: Event, programSource: ProgramSource | null = null) => {
    setEventForm(event);
    setEditingId(event.id);
    setEditingProgramSource(activeTab === 'programacoes' ? (programSource || 'schedule') : null);
    // Abrir o modal correto dependendo se for evento de inscrição
    if (event.isInscriptionEvent) {
      setShowInscriptionEventForm(true);
    } else {
      setShowEventForm(true);
    }
  };

  const handleDeleteItem = async (id: string, source: ProgramSource | 'event' = 'event') => {
    const isSchedule = source === 'schedule';
    if (window.confirm(`Tem certeza que deseja deletar est${isSchedule ? 'a programação' : 'e evento'}?`)) {
      try {
        setLoading(true);
        if (isSchedule) {
          await schedulesAPI.delete(id);
        } else {
          await eventsAPI.delete(id);
        }
        await loadAllData();
      } catch (error) {
        console.error('Erro ao deletar:', error);
        alert(error instanceof Error ? error.message : 'Erro ao deletar');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTogglePublish = async (event: any, source: ProgramSource | 'event' = 'event') => {
    try {
      setLoading(true);
      const api = source === 'schedule' ? schedulesAPI : eventsAPI;
      if (event.published || event.isPublished) {
        await api.unpublish(event.id);
      } else {
        await api.publish(event.id);
      }
      await loadAllData();
    } catch (error) {
      console.error('Erro ao atualizar publicação:', error);
      alert(error instanceof Error ? error.message : 'Erro ao atualizar publicação');
    } finally {
      setLoading(false);
    }
  };

  const handleMoveToEvent = async (schedule: any, source: ProgramSource = 'schedule') => {
    try {
      setLoading(true);
      if (source === 'schedule') {
        await schedulesAPI.moveToEvent(schedule.id);
      } else {
        const { _sourceType, ...payload } = schedule || {};
        await eventsAPI.update(schedule.id, { ...payload, isProgram: false, isInscriptionEvent: false });
      }
      await loadAllData();
    } catch (error) {
      console.error('Erro ao mover programação para eventos:', error);
      alert(error instanceof Error ? error.message : 'Erro ao mover programação');
    } finally {
      setLoading(false);
    }
  };

  const handleMoveToProgram = async (event: any) => {
    try {
      setLoading(true);
      await eventsAPI.moveToProgram(event.id);
      await loadAllData();
    } catch (error) {
      console.error('Erro ao mover evento para programação:', error);
      alert('Erro ao mover evento para programação');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPhotosModal = async (event: Event) => {
    setSelectedEventForPhotos(event);
    setShowPhotoUploadModal(true);
    try {
      const photos = await eventPhotosAPI.getByEventId(event.id);
      setEventPhotos(photos);
    } catch (error) {
      console.error('Erro ao carregar fotos:', error);
    }
  };

  const handleUploadPhotos = async (files: FileList | null) => {
    if (!files || !selectedEventForPhotos) return;

    try {
      setUploadingPhotos(true);
      await eventPhotosAPI.upload(selectedEventForPhotos.id, files);
      const photos = await eventPhotosAPI.getByEventId(selectedEventForPhotos.id);
      setEventPhotos(photos);
      alert('Fotos enviadas com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload das fotos');
    } finally {
      setUploadingPhotos(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!window.confirm('Tem certeza que deseja deletar esta foto?')) return;

    try {
      await eventPhotosAPI.delete(photoId);
      setEventPhotos(eventPhotos.filter(p => p.id !== photoId));
      alert('Foto deletada com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar foto:', error);
      alert('Erro ao deletar foto');
    }
  };

  const handleOpenInscriptionsModal = async (event: Event) => {
    try {
      setSelectedEventForInscriptions(event);
      setShowInscriptionsModal(true);
      setLoading(true);
      const inscriptions = await inscriptionsAPI.getConfirmedByEvent(event.id);
      setEventInscriptions(inscriptions || []);
    } catch (error) {
      console.error('Erro ao carregar inscrições:', error);
      alert('Erro ao carregar inscrições confirmadas');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInscription = async (inscriptionId: string) => {
    try {
      setLoading(true);
      await inscriptionsAPI.delete(inscriptionId);
      // Recarregar lista de inscrições
      if (selectedEventForInscriptions) {
        const inscriptions = await inscriptionsAPI.getConfirmedByEvent(selectedEventForInscriptions.id);
        setEventInscriptions(inscriptions || []);
      }
      // Recarregar todos os dados para atualizar contadores
      await loadAllData();
    } catch (error) {
      console.error('Erro ao deletar inscrição:', error);
      alert('Erro ao deletar inscrição');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChapel = async () => {
    try {
      setLoading(true);
      const { number, ...rest } = chapelForm;
      const address = [chapelForm.address, number].filter(Boolean).join(', ');
      const chapelPayload = { ...rest, address };
      if (editingId) {
        await chapelsAPI.update(editingId, chapelPayload);
      } else {
        await chapelsAPI.create(chapelPayload);
      }
      await loadAllData();
      setChapelForm({ id: '', name: '', neighborhood: '', address: '', number: '', coordinator: '', phone: '', email: '', description: '', photoUrl: '' });
      setShowChapelForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Erro ao salvar capela:', error);
      alert('Erro preencha os campos obrigatórios e tente novamente');
    } finally {
      setLoading(false);
    }
  };

  const handleEditChapel = (chapel: Chapel) => {
    const [streetPart, numberPart] = (chapel.address || '').split(',');
    setChapelForm({
      ...chapel,
      address: streetPart?.trim() || '',
      number: numberPart?.trim() || '',
    });
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

  const handleSaveContent = async () => {
    try {
      setLoading(true);
      if (!contentForm.key || !contentForm.title || !contentForm.content) {
        alert('Preencha todos os campos do texto institucional');
        return;
      }
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
      alert('Erro ao salvar texto institucional');
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

  const updateClergyPeriod = (mode: 'atual' | 'numeros', start: string, end: string) => {
    const year = start || '';
    setClergyForm(prev => ({ ...prev, startYear: year }));
  };

  const handleClergyPeriodModeChange = (mode: 'atual' | 'numeros') => {
    setClergyPeriodMode(mode);
    updateClergyPeriod(mode, clergyPeriodStart, clergyPeriodEnd);
  };

  const handleClergyPeriodStartChange = (value: string) => {
    setClergyPeriodStart(value);
    updateClergyPeriod(clergyPeriodMode, value, clergyPeriodEnd);
  };

  const handleClergyPeriodEndChange = (value: string) => {
    setClergyPeriodEnd(value);
    updateClergyPeriod(clergyPeriodMode, clergyPeriodStart, value);
  };

  const parseClergyPeriod = (period: string) => {
    const normalized = (period || '').toLowerCase();
    const years = (period.match(/\d{4}/g) || []).filter(Boolean);
    const start = years[0] || period || '';

    if (normalized.includes('presente') || normalized.includes('atual')) {
      setClergyPeriodMode('atual');
    } else {
      setClergyPeriodMode('numeros');
    }

    setClergyPeriodStart(start);
    setClergyPeriodEnd('');
    updateClergyPeriod('numeros', start, '');
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
      setClergyForm({ id: '', name: '', role: '', startYear: '', bio: '', imageUrl: '', current: false, email: '', phone: '' });
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
    parseClergyPeriod(member.startYear);
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

  const handleMoveToFormerPriests = async (member: ClergyMember) => {
    if (window.confirm('Mover este membro para a lista de Antigos Padres? Ele será removido do clero atual.')) {
      try {
        setLoading(true);
        await formerPriestsAPI.create({
          name: member.name,
          period: member.startYear,
          description: member.bio || `${member.role} da paróquia.`,
          imageUrl: member.imageUrl || ''
        });
        await clergyAPI.delete(member.id);
        await loadAllData();
        alert('Membro movido com sucesso para Antigos Padres!');
      } catch (error) {
        console.error('Erro ao mover membro:', error);
        alert('Erro ao mover membro para Antigos Padres');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveGuide = async () => {
    try {
      setLoading(true);
      // Filtrar linhas vazias antes de salvar
      const guideToSave = {
        ...guideForm,
        details: guideForm.details.filter(d => d.trim())
      };
      if (editingId) {
        await guidesAPI.update(editingId, guideToSave);
      } else {
        await guidesAPI.create(guideToSave);
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


  // Movement handlers
  const handleSaveMovement = async () => {
    try {
      setLoading(true);
      if (editingId) {
        await movementsAPI.update(editingId, movementForm);
      } else {
        await movementsAPI.create(movementForm);
      }
      await loadAllData();
      setMovementForm({ id: '', name: '', description: '', iconUrl: '', meetings: '' });
      setShowMovementForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Erro ao salvar movimento:', error);
      alert('Erro ao salvar movimento/pastoral');
    } finally {
      setLoading(false);
    }
  };

  const handleEditMovement = (movement: PastoralMovement) => {
    setMovementForm(movement);
    setEditingId(movement.id);
    setShowMovementForm(true);
  };

  const handleDeleteMovement = async (movement: PastoralMovement) => {
    if (window.confirm('Tem certeza que deseja deletar este movimento?')) {
      try {
        setLoading(true);
        await movementsAPI.delete(movement.id, movement.name);
        await loadAllData();
      } catch (error) {
        console.error('Erro ao deletar movimento:', error);
        alert('Erro ao deletar movimento');
      } finally {
        setLoading(false);
      }
    }
  };

  // Carousel handlers
  const handleSaveCarouselItem = async () => {
    try {
      setLoading(true);
      if (!carouselForm.imageUrl) {
        alert('A imagem é obrigatória para o carrossel');
        setLoading(false);
        return;
      }
      if (editingId) {
        await carouselAPI.update(editingId, carouselForm);
      } else {
        await carouselAPI.create(carouselForm);
      }
      await loadAllData();
      setCarouselForm({ id: '', imageUrl: '', title: '', titleHighlight: '', subtitle: '', link: '', buttonText: 'Saiba Mais', titleColor: '#FFFFFF', titleColorEnd: '#F59E0B', subtitleColor: '#F3F4F6', linkColor: '#FFFFFF', order: 0, isActive: true });
      setShowCarouselForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Erro ao salvar item do carrossel:', error);
      alert('Erro ao salvar item do carrossel');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCarouselItem = (item: CarouselItem) => {
    setCarouselForm(item);
    setEditingId(item.id);
    setShowCarouselForm(true);
  };

  const handleDeleteCarouselItem = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este item do carrossel?')) {
      try {
        setLoading(true);
        await carouselAPI.delete(id);
        await loadAllData();
      } catch (error) {
        console.error('Erro ao deletar item do carrossel:', error);
        alert('Erro ao deletar item do carrossel');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleCarouselItemActive = async (item: CarouselItem) => {
    try {
      setLoading(true);
      await carouselAPI.update(item.id, { ...item, isActive: !item.isActive });
      await loadAllData();
    } catch (error) {
      console.error('Erro ao atualizar status do carrossel:', error);
      alert('Erro ao atualizar status');
    } finally {
      setLoading(false);
    }
  };

  // Former Priest handlers
  const handleSaveFormerPriest = async () => {
    try {
      setLoading(true);
      const payload = { ...formerPriestForm };
      if (!editingId) {
        delete (payload as any).id;
      }
      if (editingId) {
        await formerPriestsAPI.update(editingId, payload);
      } else {
        await formerPriestsAPI.create(payload);
      }
      await loadAllData();
      setFormerPriestForm({ id: '', name: '', period: '', subtext: '', description: '', imageUrl: '' });
      setShowFormerPriestForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Erro ao salvar antigo padre:', error);
      alert(error instanceof Error ? error.message : 'Erro ao salvar antigo padre');
    } finally {
      setLoading(false);
    }
  };

  const handleEditFormerPriest = (priest: FormerPriest) => {
    setFormerPriestForm(priest);
    setEditingId(priest.id);
    setShowFormerPriestForm(true);
  };

  const handleDeleteFormerPriest = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este padre?')) {
      try {
        setLoading(true);
        await formerPriestsAPI.delete(id);
        await loadAllData();
      } catch (error) {
        console.error('Erro ao deletar padre:', error);
        alert('Erro ao deletar padre');
      } finally {
        setLoading(false);
      }
    }
  };

  // News handlers
  const handleSaveNews = async () => {
    try {
      setLoading(true);
      if (editingId) {
        await newsAPI.update(editingId, newsForm);
      } else {
        await newsAPI.create(newsForm);
      }
      await loadAllData();
      setNewsForm({ id: '', title: '', summary: '', content: '', imageUrl: '', publishedAt: new Date().toISOString() });
      setShowNewsForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Erro ao salvar notícia:', error);
      alert('Erro ao salvar notícia');
    } finally {
      setLoading(false);
    }
  };

  const handleEditNews = (news: NewsItem) => {
    setNewsForm(news);
    setEditingId(news.id);
    setShowNewsForm(true);
  };

  const handleDeleteNews = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar esta notícia?')) {
      try {
        setLoading(true);
        await newsAPI.delete(id);
        await loadAllData();
      } catch (error) {
        console.error('Erro ao deletar notícia:', error);
        alert('Erro ao deletar notícia');
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
      alert('Erro vagas já preenchidas');
    } finally {
      setLoading(false);
    }
  };

  // Programações no modelo novo (tabela schedules) + legado (events com isProgram=true)
  const programacoesFiltradas = events.filter((event) => toBool(event.isProgram) && !toBool(event.isInscriptionEvent));
  const programacoesEditaveis = [
    ...(schedules || []).map((item: any) => ({ ...item, _sourceType: 'schedule' as ProgramSource })),
    ...programacoesFiltradas.map((item) => ({ ...item, _sourceType: 'event' as ProgramSource })),
  ];

  // Eventos: isProgram = false (eventos que foram movidos manualmente da programação)
  const eventosFiltrados = events.filter((event) => !toBool(event.isProgram) && !toBool(event.isInscriptionEvent));

  // Eventos com inscrição carregados diretamente (apenas os criados na aba de Inscrições)
  const eventosComInscricao = inscriptionEvents;
  const isPublishedItem = (item: any) => toBool(item?.published) || toBool(item?.isPublished);

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
              className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${activeTab === 'eventos'
                ? 'bg-amber-600 text-white'
                : 'bg-white text-gray-600 hover:bg-amber-50'
                }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Eventos</span>
            </button>
            <button
              onClick={() => setActiveTab('programacoes')}
              className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${activeTab === 'programacoes'
                ? 'bg-amber-600 text-white'
                : 'bg-white text-gray-600 hover:bg-amber-50'
                }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Programações</span>
            </button>
            <button
              onClick={() => setActiveTab('inscricoes-links')}
              className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${activeTab === 'inscricoes-links'
                ? 'bg-amber-600 text-white'
                : 'bg-white text-gray-600 hover:bg-amber-50'
                }`}
            >
              <Globe className="w-5 h-5" />
              <span>Inscrições</span>
            </button>
            <button
              onClick={() => setActiveTab('paroquia')}
              className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${activeTab === 'paroquia'
                ? 'bg-amber-600 text-white'
                : 'bg-white text-gray-600 hover:bg-amber-50'
                }`}
            >
              <Church className="w-5 h-5" />
              <span>Paróquia</span>
            </button>
            <button
              onClick={() => setActiveTab('movimentos')}
              className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${activeTab === 'movimentos'
                ? 'bg-amber-600 text-white'
                : 'bg-white text-gray-600 hover:bg-amber-50'
                }`}
            >
              <Users className="w-5 h-5" />
              <span>Movimentos</span>
            </button>
            <button
              onClick={() => setActiveTab('padres')}
              className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${activeTab === 'padres'
                ? 'bg-amber-600 text-white'
                : 'bg-white text-gray-600 hover:bg-amber-50'
                }`}
            >
              <Shield className="w-5 h-5" />
              <span>Padres Antigos</span>
            </button>
            <button
              onClick={() => setActiveTab('noticias')}
              className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${activeTab === 'noticias'
                ? 'bg-amber-600 text-white'
                : 'bg-white text-gray-600 hover:bg-amber-50'
                }`}
            >
              <FileText className="w-5 h-5" />
              <span>Notícias</span>
            </button>
            <button
              onClick={() => setActiveTab('inicio')}
              className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${activeTab === 'inicio'
                ? 'bg-amber-600 text-white'
                : 'bg-white text-gray-600 hover:bg-amber-50'
                }`}
            >
              <ImageIcon className="w-5 h-5" />
              <span>Início</span>
            </button>
            <button
              onClick={() => setActiveTab('brasao')}
              className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${activeTab === 'brasao'
                ? 'bg-amber-600 text-white'
                : 'bg-white text-gray-600 hover:bg-amber-50'
                }`}
            >
              <Shield className="w-5 h-5" />
              <span>Brasão</span>
            </button>
            <button
              onClick={() => setActiveTab('guias')}
              className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${activeTab === 'guias'
                ? 'bg-amber-600 text-white'
                : 'bg-white text-gray-600 hover:bg-amber-50'
                }`}
            >
              <FileText className="w-5 h-5" />
              <span>Guias</span>
            </button>
            {isSuperAdmin && (
              <button
                onClick={() => setActiveTab('administradores')}
                className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${activeTab === 'administradores'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-amber-50'
                  }`}
              >
                <Shield className="w-5 h-5" />
                <span>Administradores</span>
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Eventos Tab */}
            {activeTab === 'eventos' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-amber-900">Gestão de Eventos</h2>
                </div>

                <div className="space-y-8">
                  {Object.entries(groupEventsByMonth(eventosFiltrados)).map(([monthKey, monthEvents]) => {
                    const monthYear = formatMonthYearFromKey(monthKey);

                    return (
                      <div key={monthKey}>
                        <h3 className="text-xl font-bold text-amber-900 mb-4 pb-3 border-b-2 border-amber-200 capitalize">
                          {monthYear}
                        </h3>
                        <div className="space-y-4">
                          {monthEvents.map((event) => (
                            <div key={event.id} className={`bg-gradient-to-br from-white to-amber-50/30 border-2 ${isPublishedItem(event) ? 'border-green-200 bg-gradient-to-br from-white to-green-50/30' : 'border-amber-100'} rounded-xl p-6 hover:shadow-lg transition-all ${!event.isActive ? 'opacity-60' : ''}`}>
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-xl font-bold text-amber-900">{event.title}</h3>
                                    {isPublishedItem(event) && (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        <Eye className="w-3 h-3 mr-1" />
                                        Publicado
                                      </span>
                                    )}
                                    {!event.isActive && (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                        📁 Arquivado
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    <span className="flex items-center">
                                      <Calendar className="w-4 h-4 mr-2 text-amber-600" />
                                      {event.date}
                                    </span>
                                    <span className="flex items-center">
                                      <MapPin className="w-4 h-4 mr-2 text-amber-600" />
                                      {event.location}
                                    </span>
                                    <span className="flex items-center text-amber-700 font-medium">
                                      <Clock className="w-4 h-4 mr-2" />
                                      {formatTime(event.time)}
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
                                  <ActionIconButton
                                    onClick={() => handleTogglePublish(event)}
                                    title={isPublishedItem(event) ? 'Despublicar' : 'Publicar'}
                                    variant="publish"
                                    active={isPublishedItem(event)}
                                  >
                                    {isPublishedItem(event) ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                  </ActionIconButton>
                                  <ActionIconButton
                                    onClick={() => handleMoveToProgram(event)}
                                    title="Voltar para Programações"
                                    variant="move"
                                  >
                                    ⤴️
                                  </ActionIconButton>
                                  <ActionIconButton
                                    onClick={() => handleOpenPhotosModal(event)}
                                    title="Gerenciar Fotos"
                                    variant="photo"
                                  >
                                    <ImageIcon className="w-5 h-5" />
                                  </ActionIconButton>
                                  <ActionIconButton onClick={() => handleEditEvent(event)} title="Editar" variant="edit">
                                    <Edit className="w-5 h-5" />
                                  </ActionIconButton>
                                  <ActionIconButton onClick={() => handleDeleteItem(event.id, 'event')} title="Excluir" variant="delete">
                                    <Trash2 className="w-5 h-5" />
                                  </ActionIconButton>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Programações Tab */}
            {activeTab === 'programacoes' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-amber-900">Gestão de Programações</h2>
                  <button
                    onClick={() => { setEventForm({ id: '', title: '', date: '', time: '00:00 às 00:00', location: '', description: '', category: 'Missa', acceptsRegistration: false }); setEditingId(null); setEditingProgramSource(null); setShowEventForm(true); }}
                    className="flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Nova Programação</span>
                  </button>
                </div>

                <div className="space-y-8">
                  {Object.entries(groupEventsByMonth(programacoesEditaveis as Event[])).map(([monthKey, monthEvents]) => {
                    const monthYear = formatMonthYearFromKey(monthKey);

                    return (
                      <div key={monthKey}>
                        <h3 className="text-xl font-bold text-amber-900 mb-4 pb-3 border-b-2 border-amber-200 capitalize">
                          {monthYear}
                        </h3>
                        <div className="space-y-4">
                          {monthEvents.map((event) => (
                            <div key={event.id} className={`bg-gradient-to-br from-white to-amber-50/30 border-2 ${isPublishedItem(event) ? 'border-green-200 bg-gradient-to-br from-white to-green-50/30' : 'border-amber-100'} rounded-xl p-6 hover:shadow-lg transition-all ${!event.isActive ? 'opacity-60' : ''}`}>
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-xl font-bold text-amber-900">{event.title}</h3>
                                    {isPublishedItem(event) && (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        <Eye className="w-3 h-3 mr-1" />
                                        Publicado
                                      </span>
                                    )}
                                    {!event.isActive && (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                        📁 Arquivado
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    <span className="flex items-center">
                                      <Calendar className="w-4 h-4 mr-2 text-amber-600" />
                                      {event.date}
                                    </span>
                                    <span className="flex items-center">
                                      <MapPin className="w-4 h-4 mr-2 text-amber-600" />
                                      {event.location}
                                    </span>
                                    <span className="flex items-center text-amber-700 font-medium">
                                      <Clock className="w-4 h-4 mr-2" />
                                      {formatTime(event.time)}
                                    </span>
                                  </div>
                                  {event.description && (
                                    <p className="text-gray-600 mt-2">{event.description}</p>
                                  )}
                                </div>
                                <div className="flex space-x-2 ml-4">
                                  {(() => {
                                    const sourceType = (event as any)._sourceType === 'event' ? 'event' : 'schedule';
                                    return (
                                      <>
                                  <ActionIconButton
                                    onClick={() => handleMoveToEvent(event, sourceType)}
                                    title="Mover para Eventos"
                                    variant="move"
                                  >
                                    📁
                                  </ActionIconButton>
                                  <ActionIconButton
                                    onClick={() => handleTogglePublish(event, sourceType)}
                                    title={isPublishedItem(event) ? 'Despublicar' : 'Publicar'}
                                    variant="publish"
                                    active={isPublishedItem(event)}
                                  >
                                    {isPublishedItem(event) ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                  </ActionIconButton>
                                  <ActionIconButton onClick={() => handleEditEvent(event, sourceType)} title="Editar" variant="edit">
                                    <Edit className="w-5 h-5" />
                                  </ActionIconButton>
                                  <ActionIconButton onClick={() => handleDeleteItem(event.id, sourceType)} title="Excluir" variant="delete">
                                    <Trash2 className="w-5 h-5" />
                                  </ActionIconButton>
                                      </>
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'inscricoes-links' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-amber-900">Inscrições via Link</h2>
                    <p className="text-gray-600">Cadastre formulários de inscrição que aparecerão na aba pública Inscrições.</p>
                  </div>
                  <button
                    onClick={() => {
                      resetRegistrationLinkForm();
                      setShowRegistrationLinkForm(true);
                    }}
                    className="flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Nova Inscrição</span>
                  </button>
                </div>

                {showRegistrationLinkForm && (
                  <div className="bg-white border-2 border-amber-100 rounded-xl p-6 mb-8 space-y-4">
                    <h3 className="text-xl font-bold text-amber-900">{editingId ? 'Editar Inscrição' : 'Nova Inscrição'}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Título</label>
                        <input
                          type="text"
                          value={registrationLinkForm.title}
                          onChange={(e) => setRegistrationLinkForm(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
                          placeholder="Ex: Retiro de Jovens 2026"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Data</label>
                        <input
                          type="date"
                          value={registrationLinkForm.date}
                          onChange={(e) => setRegistrationLinkForm(prev => ({ ...prev, date: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Descrição</label>
                      <textarea
                        value={registrationLinkForm.description}
                        onChange={(e) => setRegistrationLinkForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
                        placeholder="Descreva rapidamente para quem é a inscrição e o objetivo do evento"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Link de inscrição</label>
                      <input
                        type="url"
                        value={registrationLinkForm.formUrl}
                        onChange={(e) => setRegistrationLinkForm(prev => ({ ...prev, formUrl: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
                        placeholder="https://..."
                      />
                    </div>

                    <ImageUpload
                      label="Imagem (opcional)"
                      currentImageUrl={registrationLinkForm.imageUrl || ''}
                      onImageUrlChange={(url) => setRegistrationLinkForm(prev => ({ ...prev, imageUrl: url }))}
                    />

                    <label className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                      <input
                        type="checkbox"
                        checked={registrationLinkForm.isActive}
                        onChange={(e) => setRegistrationLinkForm(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-600"
                      />
                      Exibir no site
                    </label>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={handleSaveRegistrationLink}
                        className="flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                      >
                        <Save className="w-5 h-5" />
                        <span>Salvar</span>
                      </button>
                      <button
                        onClick={resetRegistrationLinkForm}
                        className="px-6 py-3 rounded-xl font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  {registrationLinks.map((item) => (
                    <div key={item.id} className="bg-white border-2 border-amber-100 rounded-xl p-6 hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-amber-900 text-lg">{item.title}</h3>
                            {!item.isActive && (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">Oculto</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{new Date(`${item.date}T12:00:00`).toLocaleDateString('pt-BR')}</p>
                          <p className="text-sm text-gray-700 line-clamp-3">{item.description}</p>
                          <a href={item.formUrl} target="_blank" rel="noopener noreferrer" className="inline-flex mt-3 text-sm font-semibold text-blue-700 hover:text-blue-800">
                            Abrir formulário
                          </a>
                        </div>
                        <div className="flex space-x-2">
                          <ActionIconButton onClick={() => handleEditRegistrationLink(item)} title="Editar" variant="edit" iconSizeClass="w-4 h-4">
                            <Edit className="w-4 h-4" />
                          </ActionIconButton>
                          <ActionIconButton onClick={() => handleDeleteRegistrationLink(item.id)} title="Excluir" variant="delete" iconSizeClass="w-4 h-4">
                            <Trash2 className="w-4 h-4" />
                          </ActionIconButton>
                        </div>
                      </div>
                    </div>
                  ))}
                  {registrationLinks.length === 0 && (
                    <div className="col-span-full text-center py-10 text-gray-500 border-2 border-dashed border-amber-200 rounded-xl">
                      Nenhuma inscrição cadastrada ainda.
                    </div>
                  )}
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
                    <button onClick={() => { setChapelForm({ id: '', name: '', neighborhood: '', address: '', number: '', coordinator: '', phone: '', email: '', description: '', photoUrl: '' }); setEditingId(null); setShowChapelForm(true); }} className="flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 rounded-lg font-semibold transition-all hover:shadow-lg text-sm">
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
                            <ActionIconButton onClick={() => handleEditChapel(chapel)} title="Editar" variant="edit" iconSizeClass="w-4 h-4">
                              <Edit className="w-4 h-4" />
                            </ActionIconButton>
                            <ActionIconButton onClick={() => handleDeleteChapel(chapel.id)} title="Excluir" variant="delete" iconSizeClass="w-4 h-4">
                              <Trash2 className="w-4 h-4" />
                            </ActionIconButton>
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
                    <button onClick={() => { setClergyForm({ id: '', name: '', role: '', startYear: '', bio: '', imageUrl: '', current: false, email: '', phone: '' }); setEditingId(null); setShowCleryForm(true); }} className="flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 rounded-lg font-semibold transition-all hover:shadow-lg text-sm">
                      <Plus className="w-4 h-4" />
                      <span>Adicionar Membro</span>
                    </button>
                  </div>
                  <div className="space-y-6">
                    {/* Agrupar membros do clero por cargo */}
                    {(() => {
                      // Agrupar por role
                      const groupedClergy = clergy.reduce((acc, member) => {
                        const role = member.role || 'Outros';
                        if (!acc[role]) {
                          acc[role] = [];
                        }
                        acc[role].push(member);
                        return acc;
                      }, {} as Record<string, typeof clergy>);

                      // Definir ordem e cores dos cargos
                      const roleConfig: Record<string, { color: string, bgColor: string, borderColor: string }> = {
                        'Pároco': { color: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
                        'Vigário Paroquial': { color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
                        'Diácono': { color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
                        'Padre': { color: 'text-indigo-700', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200' },
                      };

                      return Object.entries(groupedClergy).map(([role, members]) => (
                        <div key={role} className="space-y-3">
                          {/* Cabeçalho do grupo */}
                          <div className="flex items-center space-x-3">
                            <div className={`px-4 py-2 rounded-lg font-bold text-sm ${roleConfig[role]?.bgColor || 'bg-gray-50'} ${roleConfig[role]?.color || 'text-gray-700'} border-2 ${roleConfig[role]?.borderColor || 'border-gray-200'}`}>
                              {role}
                            </div>
                            <div className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent"></div>
                          </div>

                          {/* Membros do grupo */}
                          <div className="space-y-2 pl-4">
                            {members.map((member) => (
                              <div key={member.id} className={`bg-white border-2 ${roleConfig[role]?.borderColor || 'border-amber-100'} rounded-xl p-4 hover:shadow-lg transition-all`}>
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <h3 className="font-bold text-amber-900">{member.name}</h3>
                                      {member.current && (
                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                          Atual
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-600">{member.startYear}</p>
                                    <div className="mt-2 space-y-1">
                                      {member.email && <p className="text-xs text-gray-500 flex items-center"><span className="mr-1">✉️</span>{member.email}</p>}
                                      {member.phone && <p className="text-xs text-gray-500 flex items-center"><span className="mr-1">📞</span>{member.phone}</p>}
                                    </div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <ActionIconButton onClick={() => handleMoveToFormerPriests(member)} title="Mover para Antigos Padres" variant="move" iconSizeClass="w-4 h-4">
                                      ⤴️
                                    </ActionIconButton>
                                    <ActionIconButton onClick={() => handleEditCLergy(member)} title="Editar" variant="edit" iconSizeClass="w-4 h-4">
                                      <Edit className="w-4 h-4" />
                                    </ActionIconButton>
                                    <ActionIconButton onClick={() => handleDeleteCLergy(member.id)} title="Excluir" variant="delete" iconSizeClass="w-4 h-4">
                                      <Trash2 className="w-4 h-4" />
                                    </ActionIconButton>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ));
                    })()}
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
                          <ActionIconButton onClick={() => handleEditGuide(guide)} title="Editar" variant="edit">
                            <Edit className="w-5 h-5" />
                          </ActionIconButton>
                          <ActionIconButton onClick={() => handleDeleteGuide(guide.id)} title="Excluir" variant="delete">
                            <Trash2 className="w-5 h-5" />
                          </ActionIconButton>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Movimentos Tab */}
            {activeTab === 'movimentos' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-amber-900">Movimentos e Pastorais</h2>
                    <p className="text-gray-600">Gerencie os grupos e pastorais sustentados pela paróquia.</p>
                  </div>
                  <button
                    onClick={() => { setMovementForm({ id: '', name: '', description: '', iconUrl: '', meetings: '' }); setEditingId(null); setShowMovementForm(true); }}
                    className="flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Adicionar Movimento</span>
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {movements.map((movement) => (
                    <div key={movement.id} className="bg-white border-2 border-amber-100 rounded-xl p-6 flex flex-col hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          {movement.iconUrl ? (
                            <img src={movement.iconUrl} alt={movement.name} className="w-12 h-12 rounded-full object-cover border border-amber-200" />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                              <Users className="w-6 h-6" />
                            </div>
                          )}
                          <h3 className="text-xl font-bold text-amber-900">{movement.name}</h3>
                        </div>
                        <div className="flex space-x-2">
                          <ActionIconButton onClick={() => handleEditMovement(movement)} title="Editar" variant="edit" iconSizeClass="w-4 h-4">
                            <Edit className="w-4 h-4" />
                          </ActionIconButton>
                          <ActionIconButton onClick={() => handleDeleteMovement(movement)} title="Excluir" variant="delete" iconSizeClass="w-4 h-4">
                            <Trash2 className="w-4 h-4" />
                          </ActionIconButton>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 flex-1">{movement.description}</p>
                      {movement.coordinator && (
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-semibold text-amber-700">Coordenador:</span> {movement.coordinator}
                        </p>
                      )}
                      {movement.meetings && (
                        <p className="text-sm font-medium text-amber-700 bg-amber-50 py-2 px-3 rounded-lg flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {movement.meetings}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Antigos Padres Tab */}
            {activeTab === 'padres' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-amber-900">Padres Antigos</h2>
                    <p className="text-gray-600">Histórico de reverendos que passaram pela paróquia.</p>
                  </div>
                  <button
                    onClick={() => { setFormerPriestForm({ id: '', name: '', period: '', subtext: '', description: '', imageUrl: '' }); setEditingId(null); setShowFormerPriestForm(true); }}
                    className="flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Novo Registro</span>
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {formerPriests.map((priest) => (
                    <div key={priest.id} className="bg-white border text-center border-amber-100 rounded-xl p-6 hover:shadow-lg transition-all group overflow-hidden relative">
                      <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <ActionIconButton onClick={() => handleEditFormerPriest(priest)} title="Editar" variant="edit" iconSizeClass="w-4 h-4">
                          <Edit className="w-4 h-4" />
                        </ActionIconButton>
                        <ActionIconButton onClick={() => handleDeleteFormerPriest(priest.id)} title="Excluir" variant="delete" iconSizeClass="w-4 h-4">
                          <Trash2 className="w-4 h-4" />
                        </ActionIconButton>
                      </div>
                      {priest.imageUrl ? (
                        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-amber-100 mb-4 shadow-sm">
                          <img src={priest.imageUrl} alt={priest.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-32 h-32 mx-auto rounded-full bg-amber-50 flex items-center justify-center border-4 border-amber-100 mb-4 shadow-sm">
                          <User className="w-12 h-12 text-amber-300" />
                        </div>
                      )}
                      <h3 className="text-lg font-bold text-amber-900">{priest.name}</h3>
                      {priest.subtext && (
                        <p className="text-sm font-medium text-amber-700">{priest.subtext}</p>
                      )}
                      <p className="text-sm font-semibold text-amber-600 mb-3">{priest.period}</p>
                      <p className="text-sm text-gray-500 line-clamp-3">{priest.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notícias Tab */}
            {activeTab === 'noticias' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-amber-900">Notícias</h2>
                    <p className="text-gray-600">Publique novidades, avisos e artigos da paróquia.</p>
                  </div>
                  <button
                    onClick={() => { setNewsForm({ id: '', title: '', summary: '', content: '', imageUrl: '', publishedAt: new Date().toISOString() }); setEditingId(null); setShowNewsForm(true); }}
                    className="flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Nova Notícia</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {newsList.map((news) => (
                    <div key={news.id} className="bg-white border-2 border-amber-100 rounded-xl p-6 flex flex-col md:flex-row gap-6 hover:shadow-lg transition-all">
                      {news.imageUrl && (
                        <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden shrink-0 hidden sm:block">
                          <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs font-semibold text-amber-600 mb-1 block">
                              {new Date(news.publishedAt).toLocaleDateString()}
                            </span>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{news.title}</h3>
                          </div>
                          <div className="flex space-x-2 ml-4 shrink-0">
                            <ActionIconButton onClick={() => handleEditNews(news)} title="Editar" variant="edit">
                              <Edit className="w-5 h-5" />
                            </ActionIconButton>
                            <ActionIconButton onClick={() => handleDeleteNews(news.id)} title="Excluir" variant="delete">
                              <Trash2 className="w-5 h-5" />
                            </ActionIconButton>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">{news.summary || news.content}</p>
                      </div>
                    </div>
                  ))}
                  {newsList.length === 0 && (
                    <div className="text-center py-10 bg-gray-50 rounded-xl">
                      <p className="text-gray-500">Nenhuma notícia publicada.</p>
                    </div>
                  )}
                </div>
              </div>
            )}



            {activeTab === 'administradores' && isSuperAdmin && (
              <div className="space-y-8">
                <div className="bg-white rounded-xl border-2 border-amber-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-amber-900">Meu Perfil</h2>
                      <p className="text-sm text-gray-500">Edite seu usuário e senha</p>
                    </div>
                    {currentAdmin && (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${currentAdmin.role === 'super'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-amber-100 text-amber-700'
                        }`}>
                        {currentAdmin.role === 'super' ? 'Administrador Principal' : 'Administrador'}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Usuário</label>
                      <input
                        type="text"
                        value={profileForm.username}
                        onChange={(e) => setProfileForm((prev) => ({ ...prev, username: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nova Senha</label>
                      <input
                        type="password"
                        value={profileForm.password}
                        onChange={(e) => setProfileForm((prev) => ({ ...prev, password: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmar Senha</label>
                      <input
                        type="password"
                        value={profileForm.confirmPassword}
                        onChange={(e) => setProfileForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={handleUpdateProfile}
                      className="flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                    >
                      <Save className="w-5 h-5" />
                      <span>Salvar Dados</span>
                    </button>
                  </div>
                </div>

                {isSuperAdmin && (
                  <div className="bg-white rounded-xl border-2 border-amber-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-amber-900">Administradores</h2>
                        <p className="text-sm text-gray-500">Somente o administrador principal pode criar, alterar ou excluir</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {adminFormMode === 'create' ? 'Novo Administrador' : 'Editar Administrador'}
                        </h3>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Usuário</label>
                          <input
                            type="text"
                            value={adminForm.username}
                            onChange={(e) => setAdminForm((prev) => ({ ...prev, username: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Senha {adminFormMode === 'edit' ? '(opcional)' : ''}</label>
                          <input
                            type="password"
                            value={adminForm.password}
                            onChange={(e) => setAdminForm((prev) => ({ ...prev, password: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Perfil</label>
                          {adminFormMode === 'create' ? (
                            <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                              Administrador
                            </div>
                          ) : (
                            <select
                              value={adminForm.role}
                              onChange={(e) => setAdminForm((prev) => ({ ...prev, role: e.target.value as 'admin' | 'super' }))}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
                            >
                              <option value="admin">Administrador</option>
                              <option value="super">Administrador Principal</option>
                            </select>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={handleSaveAdmin}
                            className="flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                          >
                            <Save className="w-5 h-5" />
                            <span>Salvar</span>
                          </button>
                          {adminFormMode === 'edit' && (
                            <button
                              onClick={handleCancelAdminEdit}
                              className="px-6 py-3 rounded-xl font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
                            >
                              Cancelar
                            </button>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Lista de Administradores</h3>
                        {admins.length === 0 ? (
                          <div className="text-sm text-gray-500">Nenhum administrador encontrado</div>
                        ) : (
                          <div className="space-y-3">
                            {admins.map((admin) => (
                              <div key={admin.id} className="flex items-center justify-between border border-amber-100 rounded-lg px-4 py-3">
                                <div>
                                  <p className="font-semibold text-gray-900">{admin.username}</p>
                                  <p className="text-xs text-gray-500">
                                    {admin.role === 'super' ? 'Administrador Principal' : 'Administrador'}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <ActionIconButton
                                    onClick={() => handleEditAdmin(admin)}
                                    title="Editar"
                                    variant="edit"
                                    iconSizeClass="w-4 h-4"
                                    paddingClass="p-2"
                                    disabled={currentAdmin?.id === admin.id}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </ActionIconButton>
                                  <ActionIconButton
                                    onClick={() => handleDeleteAdmin(admin.id)}
                                    title="Excluir"
                                    variant="delete"
                                    iconSizeClass="w-4 h-4"
                                    paddingClass="p-2"
                                    disabled={currentAdmin?.id === admin.id}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </ActionIconButton>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'inicio' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-amber-900">Configurações da Página Inicial</h2>
                  <button
                    onClick={() => {
                      setCarouselForm({ id: '', imageUrl: '', title: '', titleHighlight: '', subtitle: '', link: '', buttonText: 'Saiba Mais', titleColor: '#FFFFFF', titleColorEnd: '#F59E0B', subtitleColor: '#F3F4F6', linkColor: '#FFFFFF', order: 0, isActive: true });
                      setEditingId(null);
                      setShowCarouselForm(true);
                    }}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Novo Carrossel</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {carouselItems.sort((a, b) => a.order - b.order).map((item) => (
                    <div key={item.id} className={`bg-white rounded-xl shadow-lg border-2 ${item.isActive ? 'border-amber-200' : 'border-gray-200'} overflow-hidden group hover:border-amber-300 transition-all`}>
                      <div className="w-full h-48 overflow-hidden relative">
                        <img
                          src={item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:3000${item.imageUrl}`}
                          alt={item.title || 'Carrossel'}
                          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${!item.isActive ? 'grayscale opacity-70' : ''}`}
                        />
                        <div className="absolute top-2 right-2 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
                          Ordem: {item.order}
                        </div>
                      </div>
                      <div className="p-6 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-xl text-amber-900 mb-1">{item.title || <span className="text-gray-400 italic">Sem título</span>}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{item.subtitle}</p>
                          {item.link && (
                            <div className="mt-3 text-sm text-blue-600 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                              🔗 {item.link}
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-100">
                          <ActionIconButton
                            onClick={() => handleToggleCarouselItemActive(item)}
                            title={item.isActive ? 'Ocultar do site' : 'Exibir no site'}
                            variant="publish"
                            active={item.isActive}
                            iconSizeClass="w-4 h-4"
                            paddingClass="p-2"
                          >
                            {item.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </ActionIconButton>
                          <ActionIconButton
                            onClick={() => handleEditCarouselItem(item)}
                            title="Editar"
                            variant="edit"
                            iconSizeClass="w-4 h-4"
                            paddingClass="p-2"
                          >
                            <Edit className="w-4 h-4" />
                          </ActionIconButton>
                          <ActionIconButton
                            onClick={() => handleDeleteCarouselItem(item.id)}
                            title="Excluir"
                            variant="delete"
                            iconSizeClass="w-4 h-4"
                            paddingClass="p-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </ActionIconButton>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'brasao' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-amber-900">Brasão da Paróquia</h2>
                    <p className="text-gray-600">Configure a imagem e o texto explicativo do brasão oficial.</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border-2 border-amber-100 p-8 max-w-4xl mx-auto">
                  <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div className="flex flex-col space-y-4">
                      <div className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
                        {brasaoForm.imageUrl ? (
                          <>
                            <img src={brasaoForm.imageUrl.startsWith('http') ? brasaoForm.imageUrl : `http://localhost:3000${brasaoForm.imageUrl}`} alt="Brasão" className="w-full h-full object-contain p-4" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                              <label className="cursor-pointer bg-white text-amber-900 px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 hover:bg-amber-50 transition-colors">
                                <Upload className="w-4 h-4" />
                                <span>Trocar Imagem</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={async (e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      try {
                                        setUploadingPhotos(true);
                                        const formData = new FormData();
                                        formData.append('image', e.target.files[0]);
                                        const uploadRes = await fetch('http://localhost:3000/api/upload/geral', {
                                          method: 'POST',
                                          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
                                          body: formData,
                                        });
                                        if (!uploadRes.ok) throw new Error('Falha no upload');
                                        const uploadData = await uploadRes.json();
                                        setBrasaoForm({ ...brasaoForm, imageUrl: uploadData.url });
                                      } catch (error) {
                                        console.error('Erro no upload:', error);
                                        alert('Erro ao fazer upload da imagem');
                                      } finally {
                                        setUploadingPhotos(false);
                                      }
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </>
                        ) : (
                          <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full p-8 text-gray-500 hover:text-amber-600 transition-colors">
                            <Upload className="w-12 h-12 mb-4 text-gray-400" />
                            <span className="font-semibold mb-1">Upload da Imagem</span>
                            <span className="text-sm text-center">Clique para escolher o arquivo</span>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={async (e) => {
                                if (e.target.files && e.target.files[0]) {
                                  try {
                                    setUploadingPhotos(true);
                                    const formData = new FormData();
                                    formData.append('image', e.target.files[0]);
                                    const uploadRes = await fetch('http://localhost:3000/api/upload/geral', {
                                      method: 'POST',
                                      headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
                                      body: formData,
                                    });
                                    if (!uploadRes.ok) throw new Error('Falha no upload');
                                    const uploadData = await uploadRes.json();
                                    setBrasaoForm({ ...brasaoForm, imageUrl: uploadData.url });
                                  } catch (error) {
                                    console.error('Erro no upload:', error);
                                    alert('Erro ao fazer upload da imagem');
                                  } finally {
                                    setUploadingPhotos(false);
                                  }
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 text-center">Formato PNG com fundo transparente recomendado. Proporção 1:1.</p>
                    </div>

                    <div className="space-y-6 flex flex-col h-full">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Título Principal</label>
                        <input
                          type="text"
                          value={brasaoForm.title}
                          onChange={(e) => setBrasaoForm({ ...brasaoForm, title: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600 focus:bg-white transition-all outline-none"
                          placeholder="Ex: Brasão de Santo André"
                        />
                      </div>

                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Texto Explicativo</label>
                        <textarea
                          value={brasaoForm.content}
                          onChange={(e) => setBrasaoForm({ ...brasaoForm, content: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600 focus:bg-white transition-all outline-none h-48 resize-none"
                          placeholder="Explique o significado das cores, símbolos e elementos do brasão..."
                        />
                      </div>

                      <button
                        onClick={handleSaveBrasao}
                        disabled={uploadingPhotos}
                        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl mt-auto disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {uploadingPhotos ? (
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            <span>Salvar Configurações</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCarouselForm && (
        <CarouselFormModal
          editingId={editingId}
          carouselForm={carouselForm}
          onClose={() => { setShowCarouselForm(false); setEditingId(null); }}
          onSave={handleSaveCarouselItem}
          onImageUrlChange={handleCarouselImageUrlChange}
          onTitleChange={handleCarouselTitleChange}
          onTitleHighlightChange={handleCarouselTitleHighlightChange}
          onSubtitleChange={handleCarouselSubtitleChange}
          onLinkChange={handleCarouselLinkChange}
          onButtonTextChange={handleCarouselButtonTextChange}
          onTitleColorChange={handleCarouselTitleColorChange}
          onTitleColorEndChange={handleCarouselTitleColorEndChange}
          onSubtitleColorChange={handleCarouselSubtitleColorChange}
          onLinkColorChange={handleCarouselLinkColorChange}
          onOrderIndexChange={handleCarouselOrderIndexChange}
          onIsActiveChange={handleCarouselIsActiveChange}
        />
      )}
      {showEventForm && (
        <EventFormModal
          editingId={editingId}
          eventForm={eventForm}
          onClose={() => { setShowEventForm(false); setEditingId(null); setEditingProgramSource(null); }}
          onSave={handleSaveEvent}
          onTitleChange={handleEventTitleChange}
          onDateChange={handleEventDateChange}
          onTimeChange={handleEventTimeChange}
          onLocationChange={handleEventLocationChange}
          onCategoryChange={handleEventCategoryChange}
          onDescriptionChange={handleEventDescriptionChange}
        />
      )}
      {showInscriptionEventForm && (
        <InscriptionEventFormModal
          editingId={editingId}
          eventForm={eventForm}
          onClose={() => { setShowInscriptionEventForm(false); setEditingId(null); }}
          onSave={handleSaveEvent}
          onTitleChange={handleEventTitleChange}
          onDateChange={handleEventDateChange}
          onDateEndChange={handleEventDateEndChange}
          onTimeChange={handleEventTimeChange}
          onLocationChange={handleEventLocationChange}
          onDescriptionChange={handleEventDescriptionChange}
          onMaxParticipantsChange={handleEventMaxParticipantsChange}
        />
      )}
      {showChapelForm && (
        <ChapelFormModal
          editingId={editingId}
          chapelForm={chapelForm}
          onClose={() => { setShowChapelForm(false); setEditingId(null); }}
          onSave={handleSaveChapel}
          onNameChange={handleChapelNameChange}
          onNeighborhoodChange={handleChapelNeighborhoodChange}
          onAddressChange={handleChapelAddressChange}
          onNumberChange={handleChapelNumberChange}
          onCoordinatorChange={handleChapelCoordinatorChange}
          onPhoneChange={handleChapelPhoneChange}
          onEmailChange={handleChapelEmailChange}
          onDescriptionChange={(value) => setChapelForm(prev => ({ ...prev, description: value }))}
          onPhotoUrlChange={(value) => setChapelForm(prev => ({ ...prev, photoUrl: value }))}
        />
      )}
      {showCleryForm && (
        <ClergyFormModal
          editingId={editingId}
          clergyForm={clergyForm}
          clergyPeriodMode={clergyPeriodMode}
          clergyPeriodStart={clergyPeriodStart}
          clergyPeriodEnd={clergyPeriodEnd}
          isClergyFormValid={isClergyFormValid}
          onClose={() => { setShowCleryForm(false); setEditingId(null); }}
          onSave={handleSaveCLergy}
          onNameChange={handleClergyNameChange}
          onRoleChange={handleClergyRoleChange}
          onPeriodModeChange={handleClergyPeriodModeChange}
          onPeriodStartChange={handleClergyPeriodStartChange}
          onPeriodEndChange={handleClergyPeriodEndChange}
          onEmailChange={handleClergyEmailChange}
          onBioChange={handleClergyBioChange}
          onImageChange={handleClergyImageChange}
          onCurrentChange={handleClergyCurrentChange}
          onPhoneChange={handleClergyPhoneChange}
        />
      )}
      {showGuideForm && (
        <GuideFormModal
          editingId={editingId}
          guideForm={guideForm}
          onClose={() => { setShowGuideForm(false); setEditingId(null); }}
          onSave={handleSaveGuide}
          onTitleChange={handleGuideTitleChange}
          onContentChange={handleGuideContentChange}
          onDetailsChange={handleGuideDetailsChange}
        />
      )}
      {showContentForm && (
        <ContentFormModal
          editingId={editingId}
          contentForm={contentForm}
          onClose={() => { setShowContentForm(false); setEditingId(null); }}
          onSave={handleSaveContent}
          onKeyChange={handleContentKeyChange}
          onTitleChange={handleContentTitleChange}
          onContentChange={handleContentContentChange}
        />
      )}
      {showInscriptionsModal && (
        <InscriptionsModal
          event={selectedEventForInscriptions}
          inscriptions={eventInscriptions}
          isOpen={showInscriptionsModal}
          onClose={() => { setShowInscriptionsModal(false); setSelectedEventForInscriptions(null); setEventInscriptions([]); }}
          onDelete={handleDeleteInscription}
        />
      )}
      {showPhotoUploadModal && selectedEventForPhotos && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-amber-900">
                Gerenciar Fotos: {selectedEventForPhotos.title}
              </h3>
              <button
                onClick={() => { setShowPhotoUploadModal(false); setSelectedEventForPhotos(null); setEventPhotos([]); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Upload Section */}
            <div className="mb-8 p-6 bg-amber-50 rounded-xl border-2 border-dashed border-amber-300">
              <div className="flex flex-col items-center">
                <Upload className="w-12 h-12 text-amber-600 mb-4" />
                <h4 className="text-lg font-semibold text-amber-900 mb-2">Adicionar Fotos</h4>
                <p className="text-sm text-gray-600 mb-4">Selecione até 20 fotos (JPG, PNG, GIF, WEBP - máx 10MB cada)</p>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={(e) => handleUploadPhotos(e.target.files)}
                  disabled={uploadingPhotos}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className={`cursor-pointer inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${uploadingPhotos
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg hover:shadow-xl'
                    }`}
                >
                  <Upload className="w-5 h-5" />
                  <span>{uploadingPhotos ? 'Enviando...' : 'Selecionar Fotos'}</span>
                </label>
              </div>
            </div>

            {/* Photos Grid */}
            {eventPhotos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {eventPhotos.map((photo) => (
                  <div key={photo.id} className="group relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-amber-500 transition-all">
                    <img
                      src={`http://localhost:3000${photo.path}`}
                      alt="Foto do evento"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Nenhuma foto adicionada ainda</p>
              </div>
            )}
          </div>
        </div>
      )}
      {showMovementForm && (
        <PastoralMovementFormModal
          editingId={editingId}
          movementForm={movementForm}
          onClose={() => { setShowMovementForm(false); setEditingId(null); }}
          onSave={handleSaveMovement}
          onNameChange={handleMovementNameChange}
          onDescriptionChange={handleMovementDescriptionChange}
          onCoordinatorChange={handleMovementCoordinatorChange}
          onIconUrlChange={handleMovementIconUrlChange}
          onMeetingsChange={handleMovementMeetingsChange}
        />
      )}
      {showFormerPriestForm && (
        <FormerPriestFormModal
          editingId={editingId}
          priestForm={formerPriestForm}
          onClose={() => { setShowFormerPriestForm(false); setEditingId(null); }}
          onSave={handleSaveFormerPriest}
          onNameChange={handleFormerPriestNameChange}
          onPeriodChange={handleFormerPriestPeriodChange}
          onSubtextChange={handleFormerPriestSubtextChange}
          onDescriptionChange={handleFormerPriestDescriptionChange}
          onImageUrlChange={handleFormerPriestImageUrlChange}
        />
      )}
      {showNewsForm && (
        <NewsFormModal
          editingId={editingId}
          newsForm={newsForm}
          onClose={() => { setShowNewsForm(false); setEditingId(null); }}
          onSave={handleSaveNews}
          onTitleChange={handleNewsTitleChange}
          onSummaryChange={handleNewsSummaryChange}
          onContentChange={handleNewsContentChange}
          onImageUrlChange={handleNewsImageUrlChange}
          onPublishedAtChange={handleNewsPublishedAtChange}
        />
      )}
    </section>
  );
}