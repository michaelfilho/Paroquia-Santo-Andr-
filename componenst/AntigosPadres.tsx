import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { BookOpen, ImageIcon } from 'lucide-react';
import { ImageWithFallback } from './figma/image';
import { formerPriestsAPI } from '../src/services/api';

interface FormerPriest {
    id: string;
    name: string;
    period: string;
    subtext?: string;
    description: string;
    imageUrl: string;
}

interface Props {
    onNavigate: (page: string) => void;
    currentPage: string;
    onAdminClick: () => void;
}

export function AntigosPadres({ onNavigate, currentPage, onAdminClick }: Props) {
    const [pastPriests, setPastPriests] = useState<FormerPriest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await formerPriestsAPI.getAll();
                setPastPriests(data);
            } catch (error) {
                console.error('Erro ao buscar padres:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getImageUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `http://localhost:3000${url}`;
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-amber-200">
            <Header onNavigate={onNavigate} currentPage={currentPage} />

            <main className="pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="text-center mb-16 animate-fade-in-up">
                        <span className="text-amber-600 font-bold tracking-widest uppercase text-sm">Nossos Pastores</span>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-amber-900 mt-4 mb-6 tracking-tight">
                            Antigos Padres
                        </h1>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-amber-500 to-amber-700 mx-auto rounded-full mb-8 shadow-sm" />
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Memória e gratidão àqueles que dedicaram suas vidas para guiar nossa comunidade
                            nos caminhos do Senhor ao longo das décadas.
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                        </div>
                    ) : pastPriests.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            <p>Nenhum antigo padre cadastrado no momento.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-10 lg:gap-14">
                            {pastPriests.map((priest, idx) => (
                                <div
                                    key={priest.id}
                                    className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group flex flex-col md:flex-row border border-amber-50"
                                    style={{ animationDelay: `${idx * 0.15}s` }}
                                >
                                    <div className="md:w-2/5 h-64 md:h-auto overflow-hidden relative">
                                        {priest.imageUrl ? (
                                            <img
                                                src={getImageUrl(priest.imageUrl)}
                                                alt={priest.name}
                                                className="w-full h-full object-cover object-[50%_18%] md:object-center group-hover:scale-110 transition-transform duration-700 ease-in-out filter sepia-[.2]"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-amber-50 flex items-center justify-center">
                                                <ImageIcon className="w-16 h-16 text-amber-200" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                                        <div className="absolute bottom-4 left-4 text-white font-bold text-xl md:hidden">
                                            {priest.period}
                                        </div>
                                    </div>

                                    <div className="p-8 md:w-3/5 flex flex-col justify-center relative">
                                        <BookOpen className="absolute top-6 right-6 w-8 h-8 text-amber-100/50" />
                                        <span className="hidden md:inline-block text-amber-700 font-bold tracking-wider mb-2 font-serif text-sm">
                                            {priest.period}
                                        </span>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-amber-800 transition-colors">
                                            {priest.name}
                                        </h3>
                                        {priest.subtext && (
                                            <p className="text-sm font-semibold text-amber-700 mb-3 uppercase tracking-wide">
                                                {priest.subtext}
                                            </p>
                                        )}
                                        <p className="text-gray-600 leading-relaxed italic border-l-4 border-amber-200 pl-4 py-1">
                                            "{priest.description}"
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </main>

            <Footer onAdminClick={onAdminClick} />
        </div>
    );
}
