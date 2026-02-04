import { useState, useEffect } from 'react';
import { Menu, X, Instagram, Church } from 'lucide-react';

interface HeaderProps {
  onNavigate?: (page: string) => void;
  currentPage?: string;
}

export function Header({ onNavigate, currentPage = 'home' }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (currentPage !== 'home' && onNavigate) {
      onNavigate('home');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { id: 'inicio', label: 'Início', type: 'scroll' },
    { id: 'sobre', label: 'Sobre Nós', type: 'scroll' },
    { id: 'clero', label: 'Clero', type: 'scroll' },
    { id: 'mapa', label: 'Mapa', type: 'scroll' },
    { id: 'eventos-realizados', label: 'Eventos Realizados', type: 'scroll' },
    { id: 'eventos-futuros', label: 'Programações', type: 'scroll' },
    { id: 'guias', label: 'Guias', type: 'page' },
    { id: 'inscricoes', label: 'Inscrições', type: 'page' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-amber-100' 
          : 'bg-white/90 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => scrollToSection('inicio')}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 overflow-hidden bg-gradient-to-br from-amber-600 to-amber-700">
              <Church className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-amber-900 text-lg tracking-tight">Paróquia Santo André</h1>
              <p className="text-xs text-amber-700 font-medium">Tarumã - SP</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => item.type === 'scroll' ? scrollToSection(item.id) : handleNavigate(item.id)}
                className="relative text-gray-700 hover:text-amber-700 transition-all duration-300 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-amber-50 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-amber-700 group-hover:w-3/4 transition-all duration-300"></span>
              </button>
            ))}
            <a
              href="https://instagram.com/paroquiasantoandre"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white px-5 py-2.5 rounded-full hover:shadow-2xl transition-all duration-300 hover:scale-105 ml-4"
            >
              <Instagram className="w-4 h-4" />
              <span className="text-sm font-semibold">Instagram</span>
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-gray-200">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => item.type === 'scroll' ? scrollToSection(item.id) : handleNavigate(item.id)}
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-amber-700 transition-colors"
              >
                {item.label}
              </button>
            ))}
            <a
              href="https://instagram.com/paroquiasantoandre"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 mx-4 mt-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all justify-center"
            >
              <Instagram className="w-5 h-5" />
              <span className="font-medium">Siga no Instagram</span>
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}