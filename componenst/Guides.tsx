import { useState, useEffect } from 'react';
import { ChevronDown, Book, Heart, Users, Flame, Zap, Crown } from 'lucide-react';
import { guidesAPI } from '../src/services/api';

interface Guide {
  id: string | number;
  title: string;
  icon: React.ReactNode;
  content: string;
  details: string[];
}

export function Guides() {
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);
  const [guides, setGuides] = useState<Guide[]>([]);

  useEffect(() => {
    loadGuides();
  }, []);

  const loadGuides = async () => {
    try {
      const data = await guidesAPI.getAll();

      const guidesWithIcons = (Array.isArray(data) ? data : []).map((guide: any) => ({
        ...guide,
        icon: getIconByTitle(guide.title),
        details: typeof guide.details === 'string' ? JSON.parse(guide.details) : guide.details || []
      }));
      setGuides(guidesWithIcons);
    } catch (error) {
      console.error('Erro ao carregar guias:', error);
      setGuides([]);
    }
  };

  const getIconByTitle = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('casamento')) return <Heart className="w-8 h-8" />;
    if (lowerTitle.includes('batismo')) return <Flame className="w-8 h-8" />;
    if (lowerTitle.includes('catequese')) return <Book className="w-8 h-8" />;
    if (lowerTitle.includes('eucaristia') || lowerTitle.includes('comunhão')) return <Users className="w-8 h-8" />;
    if (lowerTitle.includes('confirmação') || lowerTitle.includes('crisma')) return <Zap className="w-8 h-8" />;
    if (lowerTitle.includes('exéquias') || lowerTitle.includes('funeral')) return <Crown className="w-8 h-8" />;
    return <Book className="w-8 h-8" />;
  };

  const getDefaultGuides = (): Guide[] => [
    {
      id: 'casamento',
      title: 'Guia de Casamento',
      icon: <Heart className="w-8 h-8" />,
      content: 'Informações essenciais para celebração do sacramento do matrimônio',
      details: [
        'Documentação necessária (certidão de nascimento, batismo)',
        'Preparação pré-matrimonial (3 encontros obrigatórios)',
        'Entrevista com o pároco',
        'Período de noivado recomendado',
        'Data e horários disponíveis para cerimônia',
        'Orientações sobre a liturgia do matrimônio',
        'Normas sobre padrinhos e convidados',
        'Custos e taxas da paróquia'
      ]
    },
    {
      id: 'batismo',
      title: 'Guia de Batismo',
      icon: <Flame className="w-8 h-8" />,
      content: 'Tudo o que você precisa saber sobre o batismo e iniciação cristã',
      details: [
        'Documentação da criança (certidão de nascimento)',
        'Escolha de padrinhos qualificados',
        'Preparação espiritual dos pais',
        'Entrevista com o pároco ou catequista',
        'Escolha do nome do santo padroeiro',
        'Data e horários disponíveis para batismo',
        'Preparação da vela batismal',
        'Significado dos símbolos batismais'
      ]
    },
    {
      id: 'catequese',
      title: 'Guia de Catequese',
      icon: <Book className="w-8 h-8" />,
      content: 'Informações sobre os programas de catequese paroquial',
      details: [
        'Catequese infantil (6-12 anos)',
        'Catequese de adolescentes (12-17 anos)',
        'Catequese de adultos',
        'Preparação para Primeira Comunhão',
        'Preparação para Confirmação',
        'Cronograma e dias de encontro',
        'Catequistas responsáveis e horários',
        'Material didático disponível'
      ]
    },
    {
      id: 'coroinha',
      title: 'Guia de Coroinha',
      icon: <Crown className="w-8 h-8" />,
      content: 'Orientações para crianças que desejam servir no altar',
      details: [
        'Idade mínima recomendada',
        'Treinamento e preparação litúrgica',
        'Uniforme e indumentária',
        'Responsabilidades no altar',
        'Calendário de rodízios e missas',
        'Atividades sociais e confraternizações',
        'Formação espiritual contínua',
        'Requisitos de frequência'
      ]
    },
    {
      id: 'acolito',
      title: 'Guia de Acólito',
      icon: <Zap className="w-8 h-8" />,
      content: 'Informações sobre ministério de acólito e vida litúrgica',
      details: [
        'Formação teológica básica',
        'Preparação para os sacramentos',
        'Funções litúrgicas do acólito',
        'Compromisso com a paróquia',
        'Encontros de formação regular',
        'Participação em celebrações especiais',
        'Vida espiritual e oração',
        'Possibilidade de ordenação diaconal'
      ]
    },
    {
      id: 'ministro',
      title: 'Guia de Ministro',
      icon: <Users className="w-8 h-8" />,
      content: 'Guia para ministros leigos que servem na comunidade paroquial',
      details: [
        'Ministério da Eucaristia',
        'Ministério da Palavra',
        'Ministério de Acompanhamento',
        'Visita aos enfermos',
        'Formação continuada obrigatória',
        'Compromisso e frequência esperados',
        'Participação em retiros espirituais',
        'Suporte e comunhão entre ministros'
      ]
    }
  ];

  const toggleGuide = (id: string | number) => {
    const idStr = String(id);
    setExpandedGuide(expandedGuide === idStr ? null : idStr);
  };

  if (guides.length === 0) {
    return (
      <section id="guias" className="py-24 bg-gradient-to-b from-amber-50/30 to-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-amber-900 mb-6">Guias Paroquiais</h2>
          <p className="text-gray-500">Nenhum guia cadastrado no momento.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="guias" className="py-24 bg-gradient-to-b from-amber-50/30 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-amber-900 mb-6">
            Guias Paroquiais
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Informações essenciais sobre os principais sacramentos e ministérios da Igreja Católica
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map(guide => (
            <div
              key={guide.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-100/50 overflow-hidden"
            >
              <div
                onClick={() => toggleGuide(guide.id)}
                className="cursor-pointer p-6 hover:bg-amber-50/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-amber-600">
                    {guide.icon}
                  </div>
                  <ChevronDown
                    className={`w-6 h-6 text-amber-600 transition-transform duration-300 ${expandedGuide === String(guide.id) ? 'rotate-180' : ''
                      }`}
                  />
                </div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">
                  {guide.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {guide.content}
                </p>
              </div>

              {expandedGuide === String(guide.id) && (
                <div className="px-6 pb-6 border-t border-amber-100/50 bg-amber-50/20">
                  <ul className="space-y-3 mt-4">
                    {guide.details.map((detail, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-amber-600 text-white text-xs font-bold mr-3 flex-shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200">
          <h3 className="text-2xl font-bold text-amber-900 mb-4">
            Tem dúvidas?
          </h3>
          <p className="text-gray-700 mb-4">
            Entre em contato com a paróquia para obter mais informações sobre qualquer um dos nossos guias ou programas.
          </p>
          <a
            href="https://wa.me/5518997994927"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            Entre em Contato
          </a>
        </div>
      </div>
    </section>
  );
}
