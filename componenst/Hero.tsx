import { ImageWithFallback } from './figma/image';
import churchBg from '../Styles/img/igreja.jpeg';

export function Hero() {
  const churchImage = churchBg;

  return (
    <section id="inicio" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={churchImage}
          alt="Igreja Paróquia Santo André"
          className="w-full h-full object-cover object-[50%_80%] scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl animate-pulse-soft" />
        <div
          className="absolute bottom-20 right-10 w-40 h-40 bg-amber-600/10 rounded-full blur-3xl animate-pulse-soft"
          style={{ animationDelay: '1s' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          Bem-vindo à<br />
          <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
            Paróquia Santo André
          </span>
        </h1>

        <p
          className="text-xl md:text-2xl lg:text-3xl mb-10 text-gray-100 max-w-3xl mx-auto font-light leading-relaxed animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          Uma comunidade de fé, esperança e amor em Tarumã
        </p>

        <div
          className="flex flex-col sm:flex-row gap-5 justify-center animate-fade-in-up"
          style={{ animationDelay: '0.6s' }}
        >
          <button
            onClick={() => {
              const element = document.getElementById('sobre');
              if (element) {
                const offset = 80;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
              }
            }}
            className="group relative bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-10 py-5 rounded-full font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-105 overflow-hidden"
          >
            <span className="relative z-10">Conheça Nossa História</span>
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
          </button>

          <button
            onClick={() => {
              const element = document.getElementById('eventos-futuros');
              if (element) {
                const offset = 80;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
              }
            }}
            className="group bg-white/15 backdrop-blur-md hover:bg-white/25 text-white px-10 py-5 rounded-full font-semibold transition-all duration-300 border-2 border-white/50 hover:border-white/70 hover:shadow-2xl hover:scale-105"
          >
            Próximos Eventos
          </button>
        </div>
      </div>
    </section>
  );
}
