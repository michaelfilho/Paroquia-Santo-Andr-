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
  User
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

type TabType = 'eventos' | 'paroquia' | 'inscricoes';

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('eventos');
  const [showEventForm, setShowEventForm] = useState(false);

  // Mock data for events
  const [events, setEvents] = useState([
    { id: '1', title: 'Retiro de Quaresma', date: '28/02/2026', location: 'Casa de Retiros', acceptsRegistration: true },
    { id: '2', title: 'Encontro de Casais', date: '14/03/2026', location: 'Salão Paroquial', acceptsRegistration: true },
    { id: '3', title: 'Páscoa 2026', date: '05/04/2026', location: 'Igreja Matriz', acceptsRegistration: false },
  ]);

  // Mock data for registrations
  const [registrations, setRegistrations] = useState([
    { id: '1', event: 'Retiro de Quaresma', name: 'Maria Oliveira', email: 'maria@email.com', phone: '(14) 99999-9999', status: 'Confirmado' },
    { id: '2', event: 'Retiro de Quaresma', name: 'Joaquin Neto', email: 'Neto@email.com', phone: '(14) 98888-8888', status: 'Pendente' },
    { id: '3', event: 'Encontro de Casais', name: 'Julia e Michael', email: 'michael@email.com', phone: '(14) 97777-7777', status: 'Confirmado' },
  ]);

  // Mock data for chapels
  const [chapels, setChapels] = useState([
    { id: '1', name: 'Igreja Matriz Santo André', neighborhood: 'Centro', coordinator: 'Maria José da Silva' },
    { id: '2', name: 'Capela São Pedro', neighborhood: 'Jardim Paraíso', coordinator: 'João Batista Santos' },
    { id: '3', name: 'Capela Santa Rita', neighborhood: 'Vila Nova', coordinator: 'Ana Paula Oliveira' },
  ]);

  // Mock data for clergy
  const [clergy, setCLergy] = useState([
    { id: '1', name: 'Pe. João Carlos Silva', role: 'Pároco', period: '2020 - Presente' },
    { id: '2', name: 'Pe. Lucas Fernandes', role: 'Vigário', period: '2022 - Presente' },
  ]);

  const handleStatusChange = (registrationId: string, newStatus: string) => {
    setRegistrations(registrations.map(reg => 
      reg.id === registrationId ? { ...reg, status: newStatus } : reg
    ));
  };
  
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
              <span>Programações e Eventos</span>
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
              <span>Gestão da Paróquia</span>
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
                    onClick={() => setShowEventForm(true)}
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
                          <button className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-all">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button className="p-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all">
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
                    <button className="flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 rounded-lg font-semibold transition-all hover:shadow-lg text-sm">
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
                          <button className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-all">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clero */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-amber-900">Clero</h2>
                    <button className="flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 rounded-lg font-semibold transition-all hover:shadow-lg text-sm">
                      <Plus className="w-4 h-4" />
                      <span>Adicionar Membro</span>
                    </button>
                  </div>
                  <div className="space-y-3">
                    {clergy.map((member) => (
                      <div key={member.id} className="bg-white border-2 border-amber-100 rounded-xl p-4 hover:shadow-lg transition-all">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-amber-900">{member.name}</h3>
                            <p className="text-sm text-gray-600">{member.role} • {member.period}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-all">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Textos Institucionais */}
                <div>
                  <h2 className="text-2xl font-bold text-amber-900 mb-6">Textos Institucionais</h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    {['Sobre Nós', 'Missão', 'Visão', 'Valores'].map((item) => (
                      <button key={item} className="bg-white border-2 border-amber-100 rounded-xl p-6 hover:shadow-lg transition-all text-left group">
                        <FileText className="w-8 h-8 text-amber-600 mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="font-bold text-amber-900 mb-1">{item}</h3>
                        <p className="text-sm text-gray-600">Editar conteúdo</p>
                      </button>
                    ))}
                  </div>
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
                          <th className="px-6 py-4 text-left text-sm font-bold text-amber-900">Ações</th>
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
                            <td className="px-6 py-4">
                              <button className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-all">
                                <Edit className="w-4 h-4" />
                              </button>
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
    </section>
  );
}