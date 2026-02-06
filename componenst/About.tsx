import { Church, Heart, Users, BookOpen } from 'lucide-react';

export function About() {
  return (
    <section id="sobre" className="py-24 bg-gradient-to-b from-white via-amber-50/30 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl -z-0" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-300/10 rounded-full blur-3xl -z-0" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
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

            <p className="text-gray-600 leading-relaxed text-lg text-justify">
              A Paróquia Santo André foi fundada em 1952, tornando-se um pilar fundamental da comunidade católica em Tarumã. Nossa história começa com um pequeno grupo de fiéis que se reuniam para celebrar a fé e construir uma comunidade baseada nos valores cristãos.
            </p>

            <p className="text-gray-600 leading-relaxed text-lg text-justify">
              Ao longo de mais de 70 anos, crescemos e evoluímos, sempre mantendo nosso compromisso com o serviço, a evangelização e o amor ao próximo. Nossa igreja matriz, construída em 1958, foi restaurada em 2010, preservando sua arquitetura histórica enquanto moderniza suas instalações para melhor servir nossa comunidade.
            </p>

            <p className="text-gray-600 leading-relaxed text-lg text-justify">
              Hoje, a Paróquia Santo André é composta por várias capelas distribuídas pela região de Tarumã, servindo milhares de fiéis. Oferecemos missas diárias, catequese, grupos de oração, atividades pastorais e ações sociais que impactam positivamente toda a comunidade.
            </p>

            <p className="text-gray-600 leading-relaxed text-lg text-justify">
              Nossa missão é continuar sendo uma casa acolhedora para todos que buscam fortalecer sua fé, encontrar comunidade e servir ao próximo, seguindo o exemplo de Santo André, nosso padroeiro, conhecido por seu zelo em levar outros a Cristo.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="group bg-white rounded-2xl shadow-xl p-8 border-t-4 border-amber-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <Church className="w-14 h-14 text-amber-700 mb-5" />
              <h4 className="text-4xl font-bold text-amber-900 mb-3">5</h4>
              <p className="text-gray-600 font-medium">Capelas na Região</p>
            </div>

            <div className="group bg-white rounded-2xl shadow-xl p-8 border-t-4 border-amber-600 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <Users className="w-14 h-14 text-amber-600 mb-5" />
              <h4 className="text-4xl font-bold text-amber-900 mb-3">9.000+</h4>
              <p className="text-gray-600 font-medium">Fiéis Ativos</p>
            </div>

            <div className="group bg-white rounded-2xl shadow-xl p-8 border-t-4 border-amber-800 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <Heart className="w-14 h-14 text-amber-800 mb-5" />
              <h4 className="text-4xl font-bold text-amber-900 mb-3">15+</h4>
              <p className="text-gray-600 font-medium">Grupos Pastorais</p>
            </div>

            <div className="group bg-white rounded-2xl shadow-xl p-8 border-t-4 border-amber-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <BookOpen className="w-14 h-14 text-amber-700 mb-5" />
              <h4 className="text-4xl font-bold text-amber-900 mb-3">72</h4>
              <p className="text-gray-600 font-medium">Anos de História</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
