import { useState, useEffect } from 'react';
import { Cabecalho } from './Cabecalho';
import { Rodape } from './Rodape';
import { Church, Clock, CalendarHeart, Cross, Plus } from 'lucide-react';
import churchBg from '../Styles/img/igreja.jpeg';
import { ImageWithFallback } from './figma/image';
import { contentAPI } from '../src/services/api';

interface Props {
    onNavigate: (page: string) => void;
    currentPage: string;
    onAdminClick: () => void;
}

interface TimelineItem {
    year: string;
    title: string;
    description: string;
    icon?: string;
}

export function HistoriaCompleta({ onNavigate, currentPage, onAdminClick }: Props) {
    const [fullHistoryText, setFullHistoryText] = useState('');
    const [milestones, setMilestones] = useState<TimelineItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const [data, timelineData] = await Promise.all([
                    contentAPI.getByKey('full_history'),
                    contentAPI.getByKey('full_history_timeline')
                ]);

                if (data && data.content) {
                    setFullHistoryText(data.content);
                }

                if (timelineData?.content) {
                    try {
                        const parsed = JSON.parse(timelineData.content);
                        if (Array.isArray(parsed)) {
                            const sanitized = parsed
                                .filter((item) => item?.year && item?.title && item?.description)
                                .map((item) => ({
                                    year: String(item.year),
                                    title: String(item.title),
                                    description: String(item.description),
                                    icon: String(item.icon || 'church'),
                                }));

                            setMilestones(sanitized);
                        }
                    } catch {
                        setMilestones([]);
                    }
                }
            } catch (error) {
                console.error('Erro ao carregar história completa:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    const getTimelineIcon = (icon?: string) => {
        switch (icon) {
            case 'cross':
                return <Cross className="w-6 h-6 text-white" />;
            case 'calendar-heart':
                return <CalendarHeart className="w-6 h-6 text-white" />;
            case 'clock':
                return <Clock className="w-6 h-6 text-white" />;
            case 'plus':
                return <Plus className="w-6 h-6 text-white" />;
            case 'church':
            default:
                return <Church className="w-6 h-6 text-white" />;
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="animate-pulse flex flex-col gap-4">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mt-4"></div>
                </div>
            );
        }

        if (!fullHistoryText.trim()) return null;

        const paragraphs = fullHistoryText.split('\n').filter(p => p.trim() !== '');
        return paragraphs.map((paragraph, index) => {
            if (index === 0) {
                return (
                    <p key={index} className="text-justify first-letter:text-7xl first-letter:font-bold first-letter:text-amber-700 first-letter:mr-3 first-letter:float-left">
                        {paragraph}
                    </p>
                );
            }
            return <p key={index} className="text-justify">{paragraph}</p>;
        });
    };

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-amber-200">
            <Cabecalho onNavigate={onNavigate} currentPage={currentPage} />

            <main className="pt-20 pb-24">
                {/* Hero História */}
                <section className="relative h-[60vh] flex items-center justify-center overflow-hidden mb-20 shadow-xl">
                    <div className="absolute inset-0">
                        <ImageWithFallback
                            src={churchBg}
                            alt="Igreja Antiga"
                            className="w-full h-full object-cover object-[50%_40%] sepia-[.3] hue-rotate-15 contrast-125"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-amber-900/60 to-transparent mix-blend-multiply" />
                    </div>
                    <div className="relative z-10 text-center text-white px-4">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-xl">
                            História Completa
                        </h1>
                        <p className="text-lg md:text-2xl font-light max-w-2xl mx-auto drop-shadow-md pb-4 border-b border-amber-500/50 inline-block">
                            Uma trajetória de devoção e graça construída ao longo das décadas.
                        </p>
                    </div>
                </section>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-lg prose-amber prose-p:text-justify max-w-none mb-20 text-gray-700 leading-relaxed text-justify">
                        {renderContent()}
                    </div>

                    {milestones.length > 0 && (
                        <>
                            <h2 className="text-4xl font-bold text-amber-900 mb-12 text-center">A Linha do Tempo Paroquial</h2>

                            {/* Timeline Style */}
                            <div className="relative border-l-4 border-amber-200 ml-3 md:ml-6 space-y-16 py-10">
                                {milestones.map((m, idx) => (
                                    <div key={idx} className="relative pl-8 md:pl-12 group">
                                        <div className="absolute -left-[14px] md:-left-[20px] top-1 w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 shadow-md flex items-center justify-center p-1.5 ring-4 ring-white group-hover:scale-125 transition-transform duration-300">
                                            {getTimelineIcon(m.icon)}
                                        </div>

                                        <h3 className="text-2xl font-bold text-amber-900 flex flex-col md:flex-row md:items-center gap-1 md:gap-4 mb-3">
                                            <span className="text-amber-600 text-3xl font-extrabold">{m.year}</span>
                                            <span className="text-gray-900">{m.title}</span>
                                        </h3>

                                        <p className="text-gray-600 leading-relaxed p-6 bg-amber-50 rounded-2xl border border-amber-100/50 shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300">
                                            {m.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </main>

            <Rodape onAdminClick={onAdminClick} />
        </div>
    );
}
