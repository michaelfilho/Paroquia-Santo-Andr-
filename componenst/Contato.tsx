import { useState, useEffect } from 'react';
import { Cabecalho } from './Cabecalho';
import { Rodape } from './Rodape';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';

interface Props {
    onNavigate: (page: string) => void;
    currentPage: string;
    onAdminClick: () => void;
}

export function Contato({ onNavigate, currentPage, onAdminClick }: Props) {
    const [loading, setLoading] = useState(false);

    const paroquiaInfo = {
        nome: 'Paróquia Santo André',
        endereco: 'Rua das Violetas, 126',
        cidade: 'Tarumã - SP',
        cep: 'CEP: 19820035',
        telefone: '(18) 99799-4927',
        email: 'parsant@hotmail.com',
        whatsapp: '+5518997994927',
        horarioFuncionamento: [
            'Segunda a Sexta: 08h às 11h30, 13h às 17h ',
            'Sábado: 08h às 11h30',
        ],
        coordenadas: {
            lat: -22.7451872,
            lng: -50.5770975
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50/30 font-sans selection:bg-amber-200 flex flex-col">
            <Cabecalho onNavigate={onNavigate} currentPage={currentPage} />

            <main className="pt-32 pb-24 flex-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="text-center mb-16 animate-fade-in-up">
                        <span className="text-amber-600 font-bold tracking-widest uppercase text-sm">Fale Conosco</span>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-amber-900 mt-4 mb-6 tracking-tight">
                            Entre em Contato
                        </h1>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-amber-500 to-amber-700 mx-auto rounded-full mb-8" />
                        <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
                            Estamos à disposição para atendê-lo. Entre em contato conosco através dos canais abaixo ou visite nossa paróquia pessoalmente.
                        </p>
                    </div>

                    {/* Contact Info Cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-amber-100 hover:shadow-xl transition-all hover:scale-105">
                            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                <MapPin className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="font-bold text-amber-900 text-lg mb-2">Endereço</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {paroquiaInfo.endereco}<br />
                                {paroquiaInfo.cidade}<br />
                                {paroquiaInfo.cep}
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-amber-100 hover:shadow-xl transition-all hover:scale-105">
                            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                <Phone className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="font-bold text-amber-900 text-lg mb-2">Telefone</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {paroquiaInfo.telefone}
                            </p>

                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-amber-100 hover:shadow-xl transition-all hover:scale-105">
                            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                <Mail className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="font-bold text-amber-900 text-lg mb-2">E-mail</h3>
                            <p className="text-gray-600 text-sm leading-relaxed break-words">
                                {paroquiaInfo.email}
                            </p>
                            <a 
                                href={`mailto:${paroquiaInfo.email}`}
                                className="text-amber-600 hover:text-amber-700 font-semibold text-sm mt-2 inline-block transition-colors"
                            >
                                Enviar e-mail →
                            </a>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-amber-100 hover:shadow-xl transition-all hover:scale-105">
                            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                <Clock className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="font-bold text-amber-900 text-lg mb-2">Horário</h3>
                            <div className="text-gray-600 text-sm leading-relaxed space-y-1">
                                {paroquiaInfo.horarioFuncionamento.map((horario, idx) => (
                                    <p key={idx}>{horario}</p>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* WhatsApp CTA Banner */}
                    <div className="mb-16 bg-gradient-to-br from-green-600 to-green-800 rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-green-500 mix-blend-screen opacity-20 blur-3xl group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-green-400 mix-blend-screen opacity-20 blur-3xl group-hover:scale-110 transition-transform duration-700" />
                        
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Fale Conosco pelo WhatsApp</h2>
                            <p className="text-green-100/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                                Tire suas dúvidas, peça informações ou agende uma visita. Nossa secretaria está pronta para atendê-lo!
                            </p>
                            <button
                                onClick={() => window.open(`https://api.whatsapp.com/send?phone=${paroquiaInfo.whatsapp}&text=Olá!%20Gostaria%20de%20mais%20informações.`, '_blank')}
                                className="bg-white text-green-800 px-10 py-5 rounded-full font-bold text-lg hover:bg-green-50 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl inline-flex items-center space-x-3"
                            >
                                <MessageCircle className="w-6 h-6" />
                                <span>Iniciar Conversa no WhatsApp</span>
                            </button>
                        </div>
                    </div>

                    {/* Map Section */}
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-amber-100">
                        <div className="p-8 md:p-12 bg-gradient-to-r from-amber-50 to-white border-b-2 border-amber-100">
                            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">Como Chegar</h2>
                            <p className="text-gray-600 text-lg">
                                Confira nossa localização no mapa abaixo e venha nos visitar pessoalmente.
                            </p>
                        </div>
                        
                        <div className="aspect-video md:aspect-[21/9] w-full bg-gray-100 relative">
                            <iframe
                                src="https://www.google.com/maps?q=Paróquia+Santo+André,+R.+das+Violetas,+126,+Tarumã+-+SP,+19820-000&hl=pt-BR&z=17&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Localização da Paróquia Santo André - R. das Violetas, 126, Tarumã - SP"
                                className="absolute inset-0"
                            />
                        </div>
                    </div>
                </div>
            </main>

            <Rodape onAdminClick={onAdminClick} />
        </div>
    );
}
