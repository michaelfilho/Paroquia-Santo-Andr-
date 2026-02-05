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
  Upload
} from 'lucide-react';
import { eventsAPI, chapelsAPI, clergyAPI, guidesAPI, inscriptionsAPI, contentAPI, eventPhotosAPI } from '../src/services/api';
import { ImageUpload } from './ImageUpload';

interface AdminDashboardProps {
  onLogout: () => void;
}

type TabType = 'eventos' | 'programacoes' | 'inscricoes-eventos' | 'paroquia' | 'inscricoes' | 'guias' | 'textos';

interface Event {
  id: string;
  title: string;
  date: string;
  dateEnd?: string;
  time: string;
  location: string;
  description: string;
  category: 'missa' | 'evento' | 'retiro' | 'festa';
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
            placeholder="00:00 às 00:00"
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
          placeholder="00:00 às 00:00"
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
  onCoordinatorChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onEmailChange: (value: string) => void;
}

const ChapelFormModal = ({
  editingId,
  chapelForm,
  onClose,
  onSave,
  onNameChange,
  onNeighborhoodChange,
  onCoordinatorChange,
  onPhoneChange,
  onEmailChange,
}: ChapelFormModalProps) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-amber-900">{editingId ? 'Editar' : 'Nova'} Capela</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Nome da capela"
          value={chapelForm.name}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
        />
        <input
          type="text"
          placeholder="Bairro"
          value={chapelForm.neighborhood}
          onChange={(e) => onNeighborhoodChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
        />
        
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
            value={chapelForm.coordinator}
            onChange={(e) => onCoordinatorChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none mb-3"
          />
          <input
            type="tel"
            placeholder="Telefone do Coordenador"
            value={chapelForm.phone || ''}
            onChange={(e) => onPhoneChange(e.target.value)}
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
          <label htmlFor="clergy-role" className="text-sm font-medium text-amber-900">Função</label>
          <input
            id="clergy-role"
            type="text"
            list="clergy-roles"
            placeholder="Ex: Pároco, Vigário, Bispo, Papa"
            value={clergyForm.role}
            onChange={(e) => onRoleChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
          />
          <datalist id="clergy-roles">
            <option value="Pároco" />
            <option value="Administrador" />
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
              onChange={(e) => onPeriodModeChange(e.target.value as 'atual' | 'numeros')}
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
              onChange={(e) => onPeriodStartChange(e.target.value)}
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
                onChange={(e) => onPeriodEndChange(e.target.value)}
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
        <textarea
          placeholder="Resumo do guia (aparece no card)"
          value={guideForm.content}
          onChange={(e) => onContentChange(e.target.value)}
          rows={3}
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

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('eventos');
  const [showEventForm, setShowEventForm] = useState(false);
  const [showInscriptionEventForm, setShowInscriptionEventForm] = useState(false);
  const [showChapelForm, setShowChapelForm] = useState(false);
  const [showCleryForm, setShowCleryForm] = useState(false);
  const [showGuideForm, setShowGuideForm] = useState(false);
  const [showContentForm, setShowContentForm] = useState(false);
  const [showInscriptionsModal, setShowInscriptionsModal] = useState(false);
  const [selectedEventForInscriptions, setSelectedEventForInscriptions] = useState<Event | null>(null);
  const [eventInscriptions, setEventInscriptions] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [_loading, setLoading] = useState(false);
  const [showPhotoUploadModal, setShowPhotoUploadModal] = useState(false);
  const [selectedEventForPhotos, setSelectedEventForPhotos] = useState<Event | null>(null);
  const [eventPhotos, setEventPhotos] = useState<any[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

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
    time: '00:00 às 00:00',
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

  // Agrupar eventos por mês
    // Event form handlers
    const handleEventTitleChange = (value: string) => {
      setEventForm(prev => ({ ...prev, title: value }));
    };

    const handleEventDateChange = (value: string) => {
      setEventForm(prev => ({ ...prev, date: value }));
    };

    const handleEventDateEndChange = (value: string) => {
      setEventForm(prev => ({ ...prev, dateEnd: value }));
    };

    const validateTimeRange = (time: string): boolean => {
      const timeRegex = /^\d{2}:\d{2}\s+às\s+\d{2}:\d{2}$/;
      if (!timeRegex.test(time)) return false;
      const [start, end] = time.split(' às ');
      const [startH, startM] = start.split(':').map(Number);
      const [endH, endM] = end.split(':').map(Number);
      return startH < 24 && startM < 60 && endH < 24 && endM < 60;
    };

    const handleEventTimeChange = (value: string) => {
      let formatted = value;

      // Remove leading/trailing spaces
      formatted = formatted.trim();

      // Extract all digits
      const digitsOnly = formatted.replace(/\D/g, '');

      // If we have digits, format them as HH:MM às HH:MM
      if (digitsOnly.length > 0) {
        if (digitsOnly.length <= 2) {
          formatted = digitsOnly;
        } else if (digitsOnly.length <= 4) {
          formatted = `${digitsOnly.slice(0, 2)}:${digitsOnly.slice(2)}`;
        } else if (digitsOnly.length <= 6) {
          formatted = `${digitsOnly.slice(0, 2)}:${digitsOnly.slice(2, 4)} às ${digitsOnly.slice(4)}`;
        } else {
          formatted = `${digitsOnly.slice(0, 2)}:${digitsOnly.slice(2, 4)} às ${digitsOnly.slice(4, 6)}:${digitsOnly.slice(6, 8)}`;
        }
      }

      setEventForm(prev => ({ ...prev, time: formatted }));
    };

    const handleEventLocationChange = (value: string) => {
      setEventForm(prev => ({ ...prev, location: value }));
    };

    const handleEventCategoryChange = (value: string) => {
      setEventForm(prev => ({ ...prev, category: value as any }));
    };

    const handleEventDescriptionChange = (value: string) => {
      setEventForm(prev => ({ ...prev, description: value }));
    };

    const handleEventMaxParticipantsChange = (value: number | null) => {
      setEventForm(prev => ({ ...prev, maxParticipants: value }));
    };

    // Chapel form handlers
    const handleChapelNameChange = (value: string) => {
      setChapelForm(prev => ({ ...prev, name: value }));
    };

    const handleChapelNeighborhoodChange = (value: string) => {
      setChapelForm(prev => ({ ...prev, neighborhood: value }));
    };

    const handleChapelCoordinatorChange = (value: string) => {
      setChapelForm(prev => ({ ...prev, coordinator: value }));
    };

    const handleChapelPhoneChange = (value: string) => {
      setChapelForm(prev => ({ ...prev, phone: value }));
    };

    const handleChapelEmailChange = (value: string) => {
      setChapelForm(prev => ({ ...prev, email: value }));
    };

    // Clergy form handlers
    const handleClergyNameChange = (value: string) => {
      setClergyForm(prev => ({ ...prev, name: value }));
    };

    const handleClergyRoleChange = (value: string) => {
      setClergyForm(prev => ({ ...prev, role: value }));
    };

    const handleClergyEmailChange = (value: string) => {
      setClergyForm(prev => ({ ...prev, email: value }));
    };

    const handleClergyBioChange = (value: string) => {
      setClergyForm(prev => ({ ...prev, bio: value }));
    };

    const handleClergyImageChange = (value: string) => {
      setClergyForm(prev => ({ ...prev, imageUrl: value }));
    };

    const handleClergyCurrentChange = (value: boolean) => {
      setClergyForm(prev => ({ ...prev, current: value }));
    };

    const handleClergyPhoneChange = (value: string) => {
      setClergyForm(prev => ({ ...prev, phone: value }));
    };

    // Guide form handlers
    const handleGuideTitleChange = (value: string) => {
      setGuideForm(prev => ({ ...prev, title: value }));
    };

    const handleGuideContentChange = (value: string) => {
      setGuideForm(prev => ({ ...prev, content: value }));
    };

    const handleGuideDetailsChange = (value: string) => {
      setGuideForm(prev => ({ ...prev, details: value.split('\n') }));
    };

    // Content form handlers
    const handleContentKeyChange = (value: string) => {
      setContentForm(prev => ({ ...prev, key: value }));
    };

    const handleContentTitleChange = (value: string) => {
      setContentForm(prev => ({ ...prev, title: value }));
    };

    const handleContentContentChange = (value: string) => {
      setContentForm(prev => ({ ...prev, content: value }));
    };

  const groupEventsByMonth = (eventsList: Event[]) => {
    const grouped: { [key: string]: Event[] } = {};
    
    eventsList.forEach(event => {
      const date = new Date(event.date);
      const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;
      
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(event);
    });

    // Ordenar meses
    return Object.keys(grouped).sort().reverse().reduce((acc, key) => {
      acc[key] = grouped[key].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      return acc;
    }, {} as { [key: string]: Event[] });
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
        alert('Horário é obrigatório no formato HH:MM às HH:MM');
        setLoading(false);
        return;
      }
      if (!validateTimeRange(eventForm.time)) {
        alert('Horário inválido. Use o formato: HH:MM às HH:MM');
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
        await eventsAPI.update(editingId, eventForm);
      } else {
        await eventsAPI.create(eventForm);
      }
      await loadAllData();
      setEventForm({ id: '', title: '', date: '', time: '00:00 às 00:00', location: '', description: '', category: 'evento', acceptsRegistration: true });
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

  const handleTogglePublish = async (event: Event) => {
    try {
      setLoading(true);
      if (event.published) {
        await eventsAPI.unpublish(event.id);
      } else {
        await eventsAPI.publish(event.id);
      }
      await loadAllData();
    } catch (error) {
      console.error('Erro ao atualizar publicação do evento:', error);
      alert('Erro ao atualizar publicação do evento');
    } finally {
      setLoading(false);
    }
  };

  const handleMoveToEvent = async (event: Event) => {
    try {
      setLoading(true);
      await eventsAPI.moveToEvent(event.id);
      await loadAllData();
    } catch (error) {
      console.error('Erro ao mover evento:', error);
      alert('Erro ao mover evento');
    } finally {
      setLoading(false);
    }
  };

  const handleMoveToProgram = async (event: Event) => {
    try {
      setLoading(true);
      await eventsAPI.moveToProgram(event.id);
      await loadAllData();
    } catch (error) {
      console.error('Erro ao mover evento:', error);
      alert('Erro ao mover evento');
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

  // Programações: isProgram = true (tudo que foi adicionado e não foi movido para eventos)
  const programacoesFiltradas = events.filter((event) => event.isProgram === true && !event.isInscriptionEvent);

  // Eventos: isProgram = false (eventos que foram movidos manualmente da programação)
  const eventosFiltrados = events.filter((event) => event.isProgram === false && !event.isInscriptionEvent);

  const eventosComInscricao = events.filter((event) => event.isInscriptionEvent === true);

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
              onClick={() => setActiveTab('programacoes')}
              className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                activeTab === 'programacoes'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-amber-50'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Programações</span>
            </button>
            <button
              onClick={() => setActiveTab('inscricoes-eventos')}
              className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                activeTab === 'inscricoes-eventos'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-amber-50'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Inscrições de Eventos</span>
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
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-amber-900">Gestão de Eventos</h2>
                </div>

                <div className="space-y-8">
                  {Object.entries(groupEventsByMonth(eventosFiltrados)).map(([monthKey, monthEvents]) => {
                    const date = new Date(`${monthKey.substring(0, 4)}-${monthKey.substring(5, 7)}-01`);
                    const monthYear = date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' }).charAt(0).toUpperCase() + date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' }).slice(1);
                    
                    return (
                      <div key={monthKey}>
                        <h3 className="text-xl font-bold text-amber-900 mb-4 pb-3 border-b-2 border-amber-200 capitalize">
                          {monthYear}
                        </h3>
                        <div className="space-y-4">
                          {monthEvents.map((event) => (
                            <div key={event.id} className={`bg-gradient-to-br from-white to-amber-50/30 border-2 ${event.published ? 'border-green-200 bg-gradient-to-br from-white to-green-50/30' : 'border-amber-100'} rounded-xl p-6 hover:shadow-lg transition-all ${!event.isActive ? 'opacity-60' : ''}`}>
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-xl font-bold text-amber-900">{event.title}</h3>
                                    {event.published && (
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
                                  <button
                                    onClick={() => handleTogglePublish(event)}
                                    title={event.published ? 'Despublicar' : 'Publicar'}
                                    className={`p-3 rounded-lg transition-all ${event.published ? 'bg-green-100 hover:bg-green-200 text-green-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                                  >
                                    {event.published ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                  </button>
                                  <button
                                    onClick={() => handleMoveToProgram(event)}
                                    title="Voltar para Programações"
                                    className="p-3 rounded-lg transition-all bg-purple-100 hover:bg-purple-200 text-purple-700"
                                  >
                                    ⤴️
                                  </button>
                                  <button 
                                    onClick={() => handleOpenPhotosModal(event)} 
                                    title="Gerenciar Fotos"
                                    className="p-3 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-all"
                                  >
                                    <ImageIcon className="w-5 h-5" />
                                  </button>
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
                    onClick={() => { setEventForm({ id: '', title: '', date: '', time: '00:00 às 00:00', location: '', description: '', category: 'missa', acceptsRegistration: false }); setEditingId(null); setShowEventForm(true); }}
                    className="flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Nova Programação</span>
                  </button>
                </div>

                <div className="space-y-8">
                  {Object.entries(groupEventsByMonth(programacoesFiltradas)).map(([monthKey, monthEvents]) => {
                    const date = new Date(`${monthKey.substring(0, 4)}-${monthKey.substring(5, 7)}-01`);
                    const monthYear = date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' }).charAt(0).toUpperCase() + date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' }).slice(1);

                    return (
                      <div key={monthKey}>
                        <h3 className="text-xl font-bold text-amber-900 mb-4 pb-3 border-b-2 border-amber-200 capitalize">
                          {monthYear}
                        </h3>
                        <div className="space-y-4">
                          {monthEvents.map((event) => (
                            <div key={event.id} className={`bg-gradient-to-br from-white to-amber-50/30 border-2 ${event.published ? 'border-green-200 bg-gradient-to-br from-white to-green-50/30' : 'border-amber-100'} rounded-xl p-6 hover:shadow-lg transition-all ${!event.isActive ? 'opacity-60' : ''}`}>
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-xl font-bold text-amber-900">{event.title}</h3>
                                    {event.published && (
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
                                  <button
                                    onClick={() => handleMoveToEvent(event)}
                                    title="Mover para Eventos"
                                    className="p-3 rounded-lg transition-all bg-amber-100 hover:bg-amber-200 text-amber-700"
                                  >
                                    📁
                                  </button>
                                  <button
                                    onClick={() => handleTogglePublish(event)}
                                    title={event.published ? 'Despublicar' : 'Publicar'}
                                    className={`p-3 rounded-lg transition-all ${event.published ? 'bg-green-100 hover:bg-green-200 text-green-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                                  >
                                    {event.published ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                  </button>
                                  <button
                                    onClick={() => handleEditEvent(event)}
                                    className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-all"
                                  >
                                    <Edit className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteEvent(event.id)}
                                    className="p-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
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

            {/* Inscrições de Eventos Tab */}
            {activeTab === 'inscricoes-eventos' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-amber-900">Gestão de Inscrições de Eventos</h2>
                  <button
                    onClick={() => { setEventForm({ id: '', title: '', date: '', dateEnd: '', time: '00:00 às 00:00', location: '', description: '', category: 'evento', acceptsRegistration: true, maxParticipants: null, isInscriptionEvent: true, isProgram: false, published: false }); setEditingId(null); setShowInscriptionEventForm(true); }}
                    className="flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Novo Evento com Inscrição</span>
                  </button>
                </div>

                <div className="space-y-8">
                  {Object.entries(groupEventsByMonth(eventosComInscricao)).map(([monthKey, monthEvents]) => {
                    const date = new Date(`${monthKey.substring(0, 4)}-${monthKey.substring(5, 7)}-01`);
                    const monthYear = date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' }).charAt(0).toUpperCase() + date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' }).slice(1);

                    return (
                      <div key={monthKey}>
                        <h3 className="text-xl font-bold text-amber-900 mb-4 pb-3 border-b-2 border-amber-200 capitalize">
                          {monthYear}
                        </h3>
                        <div className="space-y-4">
                          {monthEvents.map((event) => (
                            <div key={event.id} className={`bg-gradient-to-br from-blue-50/50 to-blue-50/30 border-2 ${event.published ? 'border-green-200 bg-gradient-to-br from-white to-green-50/30' : 'border-blue-200'} rounded-xl p-6 hover:shadow-lg transition-all`}>
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-xl font-bold text-blue-900">{event.title}</h3>
                                    {event.published && (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        <Eye className="w-3 h-3 mr-1" />
                                        Publicado
                                      </span>
                                    )}
                                    {event.maxParticipants && (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        <Users className="w-3 h-3 mr-1" />
                                        Capacidade: {event.maxParticipants}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    <span className="flex items-center">
                                      <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                                      {event.date}
                                    </span>
                                    <span className="flex items-center">
                                      <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                                      {event.location}
                                    </span>
                                    <span className="flex items-center text-blue-700 font-medium">
                                      <Clock className="w-4 h-4 mr-2" />
                                      {formatTime(event.time)}
                                    </span>
                                  </div>
                                  {event.description && (
                                    <p className="text-gray-600 mt-2">{event.description}</p>
                                  )}
                                </div>
                                <div className="flex space-x-2 ml-4">
                                  <button
                                    onClick={() => handleOpenInscriptionsModal(event)}
                                    className="p-3 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-all"
                                    title="Ver inscritos confirmados"
                                  >
                                    <Users className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() => handleTogglePublish(event)}
                                    title={event.published ? 'Despublicar' : 'Publicar'}
                                    className={`p-3 rounded-lg transition-all ${event.published ? 'bg-green-100 hover:bg-green-200 text-green-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                                  >
                                    {event.published ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                  </button>
                                  <button
                                    onClick={() => handleEditEvent(event)}
                                    className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-all"
                                  >
                                    <Edit className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteEvent(event.id)}
                                    className="p-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {eventosComInscricao.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">Nenhum evento com inscrição cadastrado</p>
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
                                    <p className="text-sm text-gray-600">{member.period}</p>
                                    <div className="mt-2 space-y-1">
                                      {member.email && <p className="text-xs text-gray-500 flex items-center"><span className="mr-1">✉️</span>{member.email}</p>}
                                      {member.phone && <p className="text-xs text-gray-500 flex items-center"><span className="mr-1">📞</span>{member.phone}</p>}
                                    </div>
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
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 px-4 py-2 bg-amber-50 rounded-lg">
                      <span className="text-sm font-semibold text-amber-900">Total: {registrations.length}</span>
                      <span className="text-sm text-gray-500">|</span>
                      <span className="text-sm font-semibold text-green-700">
                        Confirmados: {registrations.filter(r => r.status === 'Confirmado').length}
                      </span>
                      <span className="text-sm text-gray-500">|</span>
                      <span className="text-sm font-semibold text-amber-700">
                        Pendentes: {registrations.filter(r => r.status === 'Pendente').length}
                      </span>
                    </div>
                    <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl">
                      <Download className="w-5 h-5" />
                      <span>Exportar Lista</span>
                    </button>
                  </div>
                </div>

                {registrations.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl border-2 border-amber-100">
                    <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">Nenhuma inscrição recebida ainda</p>
                  </div>
                ) : (
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
                            <th className="px-6 py-4 text-center text-sm font-bold text-amber-900">Ações</th>
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
                                <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold border-2 ${
                                  reg.status === 'Confirmado'
                                    ? 'bg-green-100 text-green-700 border-green-200'
                                    : reg.status === 'Cancelado'
                                    ? 'bg-red-100 text-red-700 border-red-200'
                                    : 'bg-amber-100 text-amber-700 border-amber-200'
                                }`}>
                                  {reg.status}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-center space-x-2">
                                  {reg.status === 'Pendente' && (
                                    <>
                                      <button
                                        onClick={() => handleStatusChange(reg.id, 'Confirmado')}
                                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-all flex items-center space-x-1"
                                        title="Confirmar inscrição"
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Confirmar</span>
                                      </button>
                                      <button
                                        onClick={() => handleStatusChange(reg.id, 'Cancelado')}
                                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-all flex items-center space-x-1"
                                        title="Recusar inscrição"
                                      >
                                        <X className="w-4 h-4" />
                                        <span>Recusar</span>
                                      </button>
                                    </>
                                  )}
                                  {reg.status === 'Confirmado' && (
                                    <button
                                      onClick={() => handleStatusChange(reg.id, 'Cancelado')}
                                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-all"
                                      title="Cancelar inscrição"
                                    >
                                      Cancelar
                                    </button>
                                  )}
                                  {reg.status === 'Cancelado' && (
                                    <button
                                      onClick={() => handleStatusChange(reg.id, 'Pendente')}
                                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-all"
                                      title="Reativar inscrição"
                                    >
                                      Reativar
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
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
      {showEventForm && (
        <EventFormModal
          editingId={editingId}
          eventForm={eventForm}
          onClose={() => { setShowEventForm(false); setEditingId(null); }}
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
          onCoordinatorChange={handleChapelCoordinatorChange}
          onPhoneChange={handleChapelPhoneChange}
          onEmailChange={handleChapelEmailChange}
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
                  className={`cursor-pointer inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    uploadingPhotos
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
    </section>
  );
}