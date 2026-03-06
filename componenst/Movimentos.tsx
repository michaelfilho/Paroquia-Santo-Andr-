import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Users, BookOpen, Heart, Music, Flame, HandHeart, ImageIcon, MessageCircle } from 'lucide-react';
import { movementsAPI } from '../src/services/api';
import { resolveAssetUrl } from '../src/services/assetUrl';

interface PastoralMovement {
    id: string;
    name: string;
    description: string;
    iconUrl: string;
    meetings: string;
    coordinator?: string;
}

interface Props {
    onNavigate: (page: string) => void;
    currentPage: string;
    onAdminClick: () => void;
}

export function Movimentos({ onNavigate, currentPage, onAdminClick }: Props) {
    const [movimentos, setMovimentos] = useState<PastoralMovement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await movementsAPI.getAll();
                setMovimentos(data);
            } catch (error) {
                console.error('Erro ao buscar movimentos:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Helper to render icon based on text or fallback
    const renderIcon = (mov: PastoralMovement) => {
        if (mov.iconUrl) {
            const src = resolveAssetUrl(mov.iconUrl);
            return <img src={src} alt={mov.name} className="w-12 h-12 object-contain" />;
        }
        // Fallbacks for known names if no icon provided
        const lowerName = mov.name.toLowerCase();
        if (lowerName.includes('catequese')) return <BookOpen className="w-8 h-8 text-amber-600" />;
        if (lowerName.includes('música') || lowerName.includes('musica')) return <Music className="w-8 h-8 text-amber-700" />;
        if (lowerName.includes('jovem') || lowerName.includes('jusc')) return <Flame className="w-8 h-8 text-orange-500" />;
        if (lowerName.includes('social')) return <HandHeart className="w-8 h-8 text-rose-500" />;
        if (lowerName.includes('coração') || lowerName.includes('oração')) return <Heart className="w-8 h-8 text-red-600" />;
        if (lowerName.includes('eucaristia')) return <Users className="w-8 h-8 text-amber-800" />;

        return <Users className="w-8 h-8 text-amber-600" />;
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-amber-200">
            <Header onNavigate={onNavigate} currentPage={currentPage} />

            <main className="pt-28 pb-20 overflow-hidden relative">
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Header Section */}
                    <div className="text-center mb-16 animate-fade-in-up">
                        <span className="text-amber-600 font-bold tracking-widest uppercase text-sm">Comunidade Viva</span>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-amber-900 mt-4 mb-6 tracking-tight">
                            Movimentos e Pastorais
                        </h1>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-amber-500 to-amber-700 mx-auto rounded-full mb-8 shadow-sm" />
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            A Paróquia Santo André é construída por muitas mãos. Conheça as forças vivas de nossa comunidade e encontre seu lugar para servir a Deus e aos irmãos.
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                        </div>
                    ) : movimentos.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            <p>Nenhum movimento ou pastoral cadastrado no momento.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {movimentos.map((mov) => (
                                <div
                                    key={mov.id}
                                    className="group bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:shadow-amber-100/50 transition-all duration-300 border border-amber-50 hover:-translate-y-2 flex flex-col h-full relative overflow-hidden"
                                >
                                    <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:-rotate-6 transform overflow-hidden">
                                        {renderIcon(mov)}
                                    </div>

                                    <h3 className="relative z-10 text-2xl font-bold text-gray-900 mb-4 group-hover:text-amber-800 transition-colors">{mov.name}</h3>
                                    <p className="relative z-10 text-gray-600 leading-relaxed mb-8 flex-grow">
                                        {mov.description}
                                    </p>

                                    {mov.coordinator && (
                                        <div className="relative z-10 mb-5 rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3">
                                            <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">Coordenador</p>
                                            <p className="text-sm font-semibold text-amber-900">{mov.coordinator}</p>
                                        </div>
                                    )}

                                    <div className="relative z-10 pt-5 border-t border-gray-100 mt-auto bg-gray-50/50 -mx-8 -mb-8 p-8 flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <div>
                                            <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">Encontros</p>
                                            <p className="text-gray-800 font-medium text-sm">{mov.meetings}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Call to Action */}
                    <div className="mt-24 bg-gradient-to-br from-amber-800 to-amber-950 rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-amber-700 mix-blend-screen opacity-20 blur-3xl group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-600 mix-blend-screen opacity-20 blur-3xl group-hover:scale-110 transition-transform duration-700" />

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Deseja participar?</h2>
                            <p className="text-amber-100/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                                Nossas portas estão sempre abertas. Entre em contato com a secretaria paroquial para mais informações sobre como integrar um de nossos grupos e ajudar na evangelização.
                            </p>
                            <button
                                onClick={() => window.open('https://api.whatsapp.com/send?phone=+5514999999999&text=Gostaria%20de%20saber%20mais%20sobre%20as%20pastorais', '_blank')}
                                className="bg-white text-amber-950 px-10 py-5 rounded-full font-bold text-lg hover:bg-amber-50 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl inline-flex items-center space-x-3"
                            >
                                <MessageCircle className="w-6 h-6" />
                                <span>Falar com a Secretaria</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer onAdminClick={onAdminClick} />
        </div>
    );
}
