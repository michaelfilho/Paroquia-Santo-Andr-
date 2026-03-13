import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import churchBg from '../Styles/img/igreja.jpeg';
import { carouselAPI, contentAPI } from '../src/services/api';
import { resolveAssetUrl } from '../src/services/assetUrl';

interface SlideData {
  id: string | number;
  image: string;
  mobileImage?: string;
  title: string;
  titleHighlight?: string;
  subtitle: string;
  titleColor?: string;
  titleColorEnd?: string;
  subtitleColor?: string;
  linkColor?: string;
  overlayColor?: string;
  primaryButton?: { text: string; action: () => void };
  secondaryButton?: { text: string; action: () => void };
}

const HERO_PRIMARY_SLIDE_KEY = 'hero_primary_slide';

const defaultPrimarySlideContent = {
  imageUrl: '',
  mobileImageUrl: '',
  title: 'Bem-vindo à',
  titleHighlight: 'Paróquia Santo André',
  subtitle: 'Uma comunidade de fé, esperança e amor em Tarumã',
  link: '#sobre',
  buttonText: 'Conheça Nossa História',
  titleColor: '#FFFFFF',
  titleColorEnd: '#F59E0B',
  subtitleColor: '#F3F4F6',
  linkColor: '#FFFFFF',
};

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobileViewport, setIsMobileViewport] = useState(() => window.innerWidth < 768);
  const [primarySlide, setPrimarySlide] = useState<SlideData>({
    id: 'default-1',
    image: defaultPrimarySlideContent.imageUrl || churchBg,
    mobileImage: defaultPrimarySlideContent.mobileImageUrl || '',
    title: defaultPrimarySlideContent.title,
    titleHighlight: defaultPrimarySlideContent.titleHighlight,
    subtitle: defaultPrimarySlideContent.subtitle,
    titleColor: defaultPrimarySlideContent.titleColor,
    titleColorEnd: defaultPrimarySlideContent.titleColorEnd,
    subtitleColor: defaultPrimarySlideContent.subtitleColor,
    linkColor: defaultPrimarySlideContent.linkColor,
    primaryButton: {
      text: defaultPrimarySlideContent.buttonText,
      action: () => scrollToSection('sobre')
    },
    secondaryButton: {
      text: 'Próximos Eventos',
      action: () => scrollToSection('eventos-futuros')
    }
  });
  const [dynamicSlides, setDynamicSlides] = useState<SlideData[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileViewport(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const buildButtonAction = (link?: string) => {
    if (!link) return () => scrollToSection('sobre');

    return () => {
      if (link.startsWith('http')) {
        window.open(link, '_blank');
      } else if (link.startsWith('#')) {
        scrollToSection(link.substring(1));
      } else {
        window.location.href = link;
      }
    };
  };

  useEffect(() => {
    const fetchCarousel = async () => {
      try {
        const [data, primarySlideData] = await Promise.all([
          carouselAPI.getAll(),
          contentAPI.getByKey(HERO_PRIMARY_SLIDE_KEY)
        ]);

        let primaryContent = defaultPrimarySlideContent;
        if (primarySlideData?.content) {
          try {
            const parsed = JSON.parse(primarySlideData.content);
            primaryContent = {
              ...defaultPrimarySlideContent,
              ...parsed,
            };
          } catch {
            primaryContent = defaultPrimarySlideContent;
          }
        }

        setPrimarySlide({
          id: 'default-1',
          image: primaryContent.imageUrl || churchBg,
          mobileImage: primaryContent.mobileImageUrl || '',
          title: primaryContent.title,
          titleHighlight: primaryContent.titleHighlight,
          subtitle: primaryContent.subtitle,
          titleColor: primaryContent.titleColor,
          titleColorEnd: primaryContent.titleColorEnd,
          subtitleColor: primaryContent.subtitleColor,
          linkColor: primaryContent.linkColor,
          primaryButton: {
            text: primaryContent.buttonText || 'Conheça Nossa História',
            action: buildButtonAction(primaryContent.link)
          },
          secondaryButton: {
            text: 'Próximos Eventos',
            action: () => scrollToSection('eventos-futuros')
          }
        });

        const carouselItems = Array.isArray(data) ? data : [];

        // Filtrar apenas ativos e ordenar por 'order'
        const activeItems = carouselItems
          .filter((item: any) => item.isActive)
          .sort((a: any, b: any) => a.order - b.order);

        const mappedSlides: SlideData[] = activeItems.map((item: any) => ({
          id: item.id,
          image: item.imageUrl,
          mobileImage: item.mobileImageUrl || '',
          title: item.title || '',
          titleHighlight: item.titleHighlight || '',
          subtitle: item.subtitle || '',
          titleColor: item.titleColor || '#FFFFFF',
          titleColorEnd: item.titleColorEnd || item.titleColor || '#F59E0B',
          subtitleColor: item.subtitleColor || '#F3F4F6',
          linkColor: item.linkColor || '#FFFFFF',
          primaryButton: item.link ? {
            text: item.buttonText || 'Saiba Mais',
            action: buildButtonAction(item.link)
          } : undefined
        }));

        setDynamicSlides(mappedSlides);
      } catch (error) {
        console.error('Erro ao buscar carrossel:', error);
      }
    };
    fetchCarousel();
  }, []);

  const slidesToRender = [primarySlide, ...dynamicSlides];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slidesToRender.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slidesToRender.length) % slidesToRender.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [slidesToRender.length]); // dependência atualizada para resetar timer se slides mudarem

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const getImageUrl = (url?: string) => {
    const normalized = (url || '').trim();
    if (!normalized) return churchBg;
    return resolveAssetUrl(normalized);
  };

  return (
    <section id="inicio" className="relative group h-screen flex items-center justify-center overflow-hidden bg-black">

      {/* Slides mapping */}
      {slidesToRender.map((slide, index) => {
        const isActive = index === currentSlide;
        const preferredImage = isMobileViewport && (slide.mobileImage || '').trim() ? slide.mobileImage : slide.image;
        const resolvedImage = getImageUrl(preferredImage || slide.image || churchBg);
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
          >
            {/* Background */}
            <div className="absolute inset-0">
              <ImageWithFallback
                src={resolvedImage}
                fallbackSrc={churchBg}
                alt="Slide Background"
                className="w-full h-full object-cover object-[50%_52%] scale-100"
              />
              {/* Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-b ${slide.overlayColor || 'from-black/70 via-black/50 to-black/70'}`} />

              {/* Decorative Elements */}
              {isActive && (
                <>
                  <div className="absolute top-20 left-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl animate-pulse-soft" />
                  <div
                    className="absolute bottom-20 right-10 w-40 h-40 bg-amber-600/10 rounded-full blur-3xl animate-pulse-soft"
                    style={{ animationDelay: '1s' }}
                  />
                </>
              )}
            </div>

            {/* Content */}
            <div className={`relative z-20 text-center text-white px-4 max-w-5xl mx-auto h-full flex flex-col justify-center transition-all duration-700 delay-100 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              <h1
                className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-7 leading-tight tracking-tight drop-shadow-[0_6px_22px_rgba(0,0,0,0.55)]"
              >
                <span style={{ color: slide.titleColor || '#FFFFFF' }}>{slide.title}</span>
                {slide.titleHighlight && (
                  <>
                    <br />
                    <span style={{ color: slide.titleColorEnd || '#F59E0B' }}>{slide.titleHighlight}</span>
                  </>
                )}
              </h1>

              <p
                className="text-lg md:text-2xl lg:text-3xl mb-11 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-[0_3px_12px_rgba(0,0,0,0.45)]"
                style={{ color: slide.subtitleColor || '#F3F4F6' }}
              >
                {slide.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                {slide.primaryButton && (
                  <button
                    onClick={slide.primaryButton.action}
                    className="group relative bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 px-7 py-4 sm:px-10 sm:py-5 md:px-12 md:py-5 rounded-full text-base md:text-lg font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-105 overflow-hidden ring-1 ring-white/30"
                    style={{ color: slide.linkColor || '#FFFFFF' }}
                  >
                    <span className="relative z-10">{slide.primaryButton.text}</span>
                    <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                  </button>
                )}

                {slide.secondaryButton && (
                  <button
                    onClick={slide.secondaryButton.action}
                    className="group bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-7 py-4 sm:px-10 sm:py-5 md:px-12 md:py-5 rounded-full text-base md:text-lg font-semibold transition-all duration-300 border border-white/30 hover:border-white/60 hover:shadow-xl hover:scale-105"
                  >
                    {slide.secondaryButton.text}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Controls */}
      {slidesToRender.length > 1 && (
        <>
          <div className="absolute z-30 inset-y-0 left-0 flex items-center px-2 md:px-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500">
            <button
              onClick={prevSlide}
              className="p-3 md:p-2 rounded-full bg-black/35 md:bg-transparent hover:bg-black/45 md:hover:bg-transparent text-white/90 md:text-white/50 hover:text-white transition-all active:scale-95 hover:scale-105 md:hover:scale-110"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-8 h-8 md:w-10 md:h-10 stroke-[2]" />
            </button>
          </div>

          <div className="absolute z-30 inset-y-0 right-0 flex items-center px-2 md:px-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500">
            <button
              onClick={nextSlide}
              className="p-3 md:p-2 rounded-full bg-black/35 md:bg-transparent hover:bg-black/45 md:hover:bg-transparent text-white/90 md:text-white/50 hover:text-white transition-all active:scale-95 hover:scale-105 md:hover:scale-110"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-8 h-8 md:w-10 md:h-10 stroke-[2]" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="absolute z-30 bottom-10 left-0 right-0 flex justify-center gap-3">
            {slidesToRender.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 rounded-full ${idx === currentSlide ? 'w-10 h-3 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]' : 'w-3 h-3 bg-white/50 hover:bg-white/80'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}

    </section>
  );
}
