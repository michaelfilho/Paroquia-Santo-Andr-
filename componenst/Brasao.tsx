import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ImageIcon } from 'lucide-react';
import { ImageWithFallback } from './figma/image';
import { contentAPI } from '../src/services/api';
import { resolveAssetUrl } from '../src/services/assetUrl';

interface ContentText {
    id: string;
    key: string;
    title: string;
    content: string;
    imageUrl?: string;
}

interface Props {
    onNavigate: (page: string) => void;
    currentPage: string;
    onAdminClick: () => void;
}

export function Brasao({ onNavigate, currentPage, onAdminClick }: Props) {
    const [brasaoData, setBrasaoData] = useState<ContentText | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBrasao = async () => {
            try {
                const brasaoItem = await contentAPI.getByKey('brasao');
                setBrasaoData(brasaoItem || null);
            } catch (error) {
                console.error('Erro ao buscar brasão:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBrasao();
    }, []);

    const getImageUrl = (url?: string) => {
        return resolveAssetUrl(url);
    };

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-amber-200 flex flex-col">
            <Header onNavigate={onNavigate} currentPage={currentPage} />

            <main className="pt-32 pb-24 flex-1">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 animate-fade-in-up">
                        <span className="text-amber-600 font-bold tracking-widest uppercase text-sm">Símbolo Paroquial</span>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-amber-900 mt-4 mb-6 tracking-tight">
                            {brasaoData?.title || 'Nosso Brasão'}
                        </h1>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-amber-500 to-amber-700 mx-auto rounded-full mb-8" />
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                        </div>
                    ) : (
                        <div className="bg-gradient-to-br from-amber-50/50 to-white rounded-3xl shadow-2xl overflow-hidden border border-amber-100 flex flex-col md:flex-row gap-0">

                            {/* Metade: Imagem */}
                            <div className="w-full md:w-1/2 min-h-[300px] md:min-h-[500px] relative bg-amber-50 flex items-center justify-center p-8">
                                {brasaoData?.imageUrl ? (
                                    <ImageWithFallback
                                        src={getImageUrl(brasaoData.imageUrl)}
                                        alt={brasaoData.title || 'Brasão da Paróquia'}
                                        className="w-full h-full max-h-[500px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-amber-200">
                                        <ImageIcon className="w-32 h-32 mb-4 drop-shadow-md" />
                                        <p className="text-amber-600/50 font-semibold tracking-widest uppercase text-sm">Sem Imagem</p>
                                    </div>
                                )}
                            </div>

                            {/* Metade: Descrição */}
                            <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
                                <h3 className="text-3xl font-bold text-amber-900 mb-6 font-serif">
                                    Significado e História
                                </h3>

                                {brasaoData?.content ? (
                                    <div className="prose prose-amber max-w-none text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                                        {brasaoData.content}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">
                                        As informações do brasão ainda não foram cadastradas no painel.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer onAdminClick={onAdminClick} />
        </div>
    );
}
