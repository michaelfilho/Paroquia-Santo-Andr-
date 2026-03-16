import { useState, useEffect } from 'react';
import { Church, Heart, Flame, BookOpen } from 'lucide-react';
import { contentAPI } from '../src/services/api';

interface AboutProps {
  litCandlesCount?: number;
}

export function Sobre({ litCandlesCount = 0 }: AboutProps) {
  const [historyText, setHistoryText] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    chapelsCount: '5+',
    pastoralGroups: '10+',
    yearsHistory: '50+',
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [aboutData, statsData] = await Promise.all([
          contentAPI.getByKey('about'),
          contentAPI.getByKey('about_stats'),
        ]);

        if (aboutData && aboutData.content) {
          setHistoryText(aboutData.content);
        }

        if (statsData?.content) {
          try {
            const parsed = JSON.parse(statsData.content);
            setStats({
              chapelsCount: String(parsed.chapelsCount ?? '5+'),
              pastoralGroups: String(parsed.pastoralGroups ?? '10+'),
              yearsHistory: String(parsed.yearsHistory ?? '72'),
            });
          } catch {
            // mantém padrão
          }
        }
      } catch (error) {
        console.error('Erro ao carregar texto sobre a história:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  // Split content by paragraphs or lines to render properly
  const renderContent = () => {
    if (loading) {
      return <div className="animate-pulse flex flex-col gap-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>;
    }

    if (!historyText.trim()) return null;

    return historyText.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
      <p key={index} className="text-gray-600 leading-relaxed text-lg text-justify mt-4">
        {paragraph}
      </p>
    ));
  };

  return (
    <section id="sobre" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="text-amber-600 font-semibold text-sm tracking-widest uppercase">
              Nossa História
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-amber-900 mb-6 tracking-tight">
            Sobre Nós
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mb-8" />
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed ">
            Nossa história de fé e serviço à comunidade
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Text Content */}
          <div className="space-y-6">
            <h3 className="text-4xl font-bold text-amber-900 mb-6">
              História da Paróquia Santo André
            </h3>

            <div className="space-y-4">
              {renderContent()}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="group bg-white rounded-2xl shadow-xl p-8 border-t-4 border-amber-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <Church className="w-14 h-14 text-amber-700 mb-5" />
              <h4 className="text-4xl font-bold text-amber-900 mb-3">5+</h4>
              <p className="text-gray-600 font-medium">Capelas na Região</p>
            </div>

            <div className="group bg-white rounded-2xl shadow-xl p-8 border-t-4 border-amber-600 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 tracking-tight">
              <Flame className="w-14 h-14 text-amber-500 mb-5 fill-amber-500/20" />
              <h4 className="text-4xl font-bold text-amber-900 mb-3">{litCandlesCount}</h4>
              <p className="text-gray-600 font-medium tracking-wide">Velas Acesas</p>
            </div>

            <div className="group bg-white rounded-2xl shadow-xl p-8 border-t-4 border-amber-800 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <Heart className="w-14 h-14 text-amber-800 mb-5" />
              <h4 className="text-4xl font-bold text-amber-900 mb-3">{stats.pastoralGroups}</h4>
              <p className="text-gray-600 font-medium">Grupos Pastorais</p>
            </div>

            <div className="group bg-white rounded-2xl shadow-xl p-8 border-t-4 border-amber-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <BookOpen className="w-14 h-14 text-amber-700 mb-5" />
              <h4 className="text-4xl font-bold text-amber-900 mb-3">50+</h4>
              <p className="text-gray-600 font-medium">Anos de História</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
