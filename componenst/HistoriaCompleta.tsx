import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Church, Clock, CalendarHeart, Cross } from 'lucide-react';
import churchBg from '../Styles/img/igreja.jpeg';
import { ImageWithFallback } from './figma/image';
import { contentAPI } from '../src/services/api';

interface Props {
    onNavigate: (page: string) => void;
    currentPage: string;
    onAdminClick: () => void;
}

export function HistoriaCompleta({ onNavigate, currentPage, onAdminClick }: Props) {
    const [fullHistoryText, setFullHistoryText] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const data = await contentAPI.getByKey('full_history');
                if (data && data.content) {
                    setFullHistoryText(data.content);
                }
            } catch (error) {
                console.error('Erro ao carregar história completa:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    const milestones = [
        {
            year: '1952',
            title: 'A Fundação',
            description: 'Naquele ano, fiéis da recém-formada cidade de Tarumã começaram a se reunir em uma pequena capela de madeira. Com muito sacrifício, as primeiras liturgias dominicais passaram a ser rezadas no local, abençoado pelo bispado.',
            icon: <Church className="w-6 h-6 text-white" />
        },
        {
            year: '1958',
            title: 'A Nova Igreja Matriz',
            description: 'O lançamento da pedra fundamental da nova igreja matriz marcou um salto de esperança. Comerciantes, lavradores e a comunidade local engajaram-se em doações e quermesses para arrecadar fundos e tijolos.',
            icon: <Cross className="w-6 h-6 text-white" />
        },
        {
            year: '1985',
            title: 'Criação das Capelas',
            description: 'A expansão da malha urbana de Tarumã motivou o surgimento de comunidades e capelas nos bairros mais periféricos, estendendo o braço assistencial e evangelizador da Paróquia.',
            icon: <CalendarHeart className="w-6 h-6 text-white" />
        },
        {
            year: '2010',
            title: 'Grande Restauração',
            description: 'Uma reforma ambiciosa devolveu o esplendor ao santuário interno, inserindo vitrais artísticos e climatização, adequando o edifício para maior acolhimento litúrgico sem perder sua arquitetura original.',
            icon: <Clock className="w-6 h-6 text-white" />
        }
    ];

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

        if (!fullHistoryText) {
            return (
                <>
                    <p className="first-letter:text-7xl first-letter:font-bold first-letter:text-amber-700 first-letter:mr-3 first-letter:float-left">
                        A história da Paróquia Santo André se entrelaça intimamente com as raízes de Tarumã.
                        Nos idos de 1952, uma modesta porção de terras doada por famílias pioneiras serviu como solo fértil
                        para a primeira capelinha. Os corações dos antigos habitantes batiam em uníssono sob os repiques
                        do pequeno sino improvisado que conclamava à oração. Era uma época de estradas de terra roxa e
                        campos abertos, onde a fé era o alicerce principal diante do cansaço da lavoura.
                    </p>
                    <p>
                        Ao longo dos anos, o amor abnegado dos presbíteros e da comunidade leiga provou-se formidável.
                        As tradicionais quermesses ganharam fama, mobilizando jovens e adultos que preparavam de mãos dadas
                        os doces caseiros e os enfeites no pátio, revertendo todas as economias para as obras da Casa do Senhor.
                    </p>
                    <p>
                        Sob o patrocínio de Santo André Apóstolo, aprendemos a ser "pescadores", lançando as redes do
                        evangelho nas realidades difíceis. Desde a fundação do vicentos e a criação de corais que ainda
                        hoje ecoam sob a abóbada principal, cada tijolo desta igreja matriz tem incrustada a lágrima e
                        a prece sincera de nosso povo. Hoje, miramos um futuro cheio de sol, baseados na firme rocha
                        plantada por aqueles gigantes do passado.
                    </p>
                </>
            );
        }

        const paragraphs = fullHistoryText.split('\n').filter(p => p.trim() !== '');
        return paragraphs.map((paragraph, index) => {
            if (index === 0) {
                return (
                    <p key={index} className="first-letter:text-7xl first-letter:font-bold first-letter:text-amber-700 first-letter:mr-3 first-letter:float-left">
                        {paragraph}
                    </p>
                );
            }
            return <p key={index}>{paragraph}</p>;
        });
    };

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-amber-200">
            <Header onNavigate={onNavigate} currentPage={currentPage} />

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
                    <div className="prose prose-lg prose-amber max-w-none mb-20 text-gray-700 leading-relaxed text-justify">
                        {renderContent()}
                    </div>

                    <h2 className="text-4xl font-bold text-amber-900 mb-12 text-center">A Linha do Tempo Paroquial</h2>

                    {/* Timeline Style */}
                    <div className="relative border-l-4 border-amber-200 ml-3 md:ml-6 space-y-16 py-10">
                        {milestones.map((m, idx) => (
                            <div key={idx} className="relative pl-8 md:pl-12 group">
                                <div className="absolute -left-[14px] md:-left-[20px] top-1 w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 shadow-md flex items-center justify-center p-1.5 ring-4 ring-white group-hover:scale-125 transition-transform duration-300">
                                    {m.icon}
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
                </div>
            </main>

            <Footer onAdminClick={onAdminClick} />
        </div>
    );
}
