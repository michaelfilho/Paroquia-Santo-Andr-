import { useState, useEffect } from 'react';
import { Cabecalho } from './Cabecalho';
import { Rodape } from './Rodape';
import { Calendar, ChevronRight, ImageIcon } from 'lucide-react';
import { ImageWithFallback } from './figma/image';
import { newsAPI } from '../src/services/api';
import { resolveAssetUrl } from '../src/services/assetUrl';

interface NewsItem {
    id: string;
    title: string;
    summary: string;
    content: string;
    imageUrl?: string;
    publishedAt?: string;
}

interface Props {
    onNavigate: (page: string) => void;
    currentPage: string;
    onAdminClick: () => void;
}

export function Noticias({ onNavigate, currentPage, onAdminClick }: Props) {
    const [newsList, setNewsList] = useState<NewsItem[]>([]);
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await newsAPI.getAll();
                setNewsList(data);
            } catch (error) {
                console.error('Erro ao buscar notícias:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getImageUrl = (url?: string) => {
        return resolveAssetUrl(url);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-amber-200">
            <Cabecalho onNavigate={onNavigate} currentPage={currentPage} />

            <main className="pt-32 pb-24">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                    {selectedNews ? (
                        <div className="animate-fade-in-up max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-amber-100">
                            <div className="relative w-full bg-slate-100 flex items-center justify-center p-2 md:p-4">
                                {selectedNews.imageUrl ? (
                                    <ImageWithFallback
                                        src={getImageUrl(selectedNews.imageUrl)}
                                        alt={selectedNews.title}
                                        className="w-full max-h-[75vh] object-contain"
                                    />
                                ) : (
                                    <div className="w-full h-64 md:h-96 bg-amber-50 flex items-center justify-center">
                                        <ImageIcon className="w-24 h-24 text-amber-200" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <button
                                        onClick={() => setSelectedNews(null)}
                                        className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-amber-900 shadow-lg flex items-center hover:bg-amber-50 transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5 mr-1 rotate-180" />
                                        Voltar para Notícias
                                    </button>
                                </div>
                            </div>

                            <div className="p-8 md:p-12">
                                <div className="flex items-center text-gray-500 text-sm mb-6">
                                    <Calendar className="w-5 h-5 mr-2 text-amber-600" />
                                    {formatDate(selectedNews.publishedAt)}
                                </div>

                                <h1 className="text-4xl md:text-5xl font-extrabold text-amber-900 mb-6 leading-tight">
                                    {selectedNews.title}
                                </h1>

                                <div className="w-20 h-1.5 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full mb-8 shadow-sm" />

                                <div className="prose prose-amber max-w-none text-gray-700 text-lg leading-relaxed whitespace-pre-wrap text-justify">
                                    {selectedNews.content}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-16 animate-fade-in-up">
                                <span className="text-amber-600 font-bold tracking-widest uppercase text-sm">Fique Atualizado</span>
                                <h1 className="text-5xl md:text-6xl font-extrabold text-amber-900 mt-4 mb-6 tracking-tight">
                                    Notícias
                                </h1>
                                <div className="w-24 h-1.5 bg-gradient-to-r from-amber-500 to-amber-700 mx-auto rounded-full mb-8 shadow-sm" />
                                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                    Acompanhe os últimos acontecimentos, comunicados e ações da nossa comunidade paroquial.
                                </p>
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center py-20">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                                </div>
                            ) : newsList.length === 0 ? (
                                <div className="text-center py-20 text-gray-500">
                                    <p>Nenhuma notícia publicada no momento.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {newsList.map((news, idx) => (
                                            <article
                                                key={news.id}
                                                className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group flex flex-col border border-amber-50 cursor-pointer"
                                                style={{ animationDelay: `${idx * 0.15}s` }}
                                                onClick={() => setSelectedNews(news)}
                                            >
                                                <div className="h-60 overflow-hidden relative">
                                                    {news.imageUrl ? (
                                                        <ImageWithFallback
                                                            src={getImageUrl(news.imageUrl)}
                                                            alt={news.title}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-amber-50 flex items-center justify-center">
                                                            <ImageIcon className="w-16 h-16 text-amber-200" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="p-8 flex flex-col flex-1">
                                                    <div className="flex items-center text-gray-500 text-sm mb-4">
                                                        <Calendar className="w-4 h-4 mr-2 text-amber-600" />
                                                        {formatDate(news.publishedAt)}
                                                    </div>

                                                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-amber-700 transition-colors line-clamp-2">
                                                        {news.title}
                                                    </h3>

                                                    <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3 flex-1">
                                                        {news.summary}
                                                    </p>

                                                    <button className="text-amber-700 font-bold uppercase text-sm tracking-wider flex items-center group-hover:text-amber-600 transition-colors mt-auto w-max">
                                                        Ler Completa
                                                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                                    </button>
                                                </div>
                                            </article>
                                        ))}
                                    </div>

                                    {newsList.length >= 6 && (
                                        <div className="mt-16 text-center">
                                            <button className="bg-white border-2 border-amber-200 text-amber-900 px-8 py-3 rounded-full font-bold hover:bg-amber-50 hover:border-amber-300 transition-colors shadow-sm">
                                                Carregar Mais Notícias
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}

                </div>
            </main>

            <Rodape onAdminClick={onAdminClick} />
        </div>
    );
}
