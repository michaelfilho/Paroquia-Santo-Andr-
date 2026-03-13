import { useState, useEffect } from 'react';
import { Menu, X, Instagram, ChevronDown } from 'lucide-react';
import testeImg from '../Styles/img/brasao.png';

interface HeaderProps {
  onNavigate?: (page: string) => void;
  currentPage?: string;
}

export function Cabecalho({ onNavigate, currentPage = 'home' }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const HEADER_OFFSET = 80;
  const PENDING_SCROLL_KEY = 'pendingScrollTarget';

  const scrollToSectionById = (id: string, attempt = 0) => {
    const element = document.getElementById(id);

    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - HEADER_OFFSET;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      sessionStorage.removeItem(PENDING_SCROLL_KEY);
      return;
    }

    if (attempt < 30) {
      window.setTimeout(() => scrollToSectionById(id, attempt + 1), 80);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (currentPage !== 'home') return;

    const pendingId = sessionStorage.getItem(PENDING_SCROLL_KEY);
    if (pendingId) {
      scrollToSectionById(pendingId);
    }
  }, [currentPage]);

  const scrollToSection = (id: string) => {
    if (currentPage !== 'home' && onNavigate) {
      sessionStorage.setItem(PENDING_SCROLL_KEY, id);
      onNavigate('home');
    } else {
      scrollToSectionById(id);
    }
    setIsMenuOpen(false);
    setOpenDropdown(null);
  };

  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsMenuOpen(false);
    setOpenDropdown(null);
  };

  const handleAction = (item: any) => {
    if (item.type === 'scroll') {
      scrollToSection(item.id);
    } else {
      handleNavigate(item.id);
    }
  };

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const menuStructure = [
    { label: 'Início', id: 'inicio', type: 'scroll' },
    {
      label: 'Paróquia',
      isDropdown: true,
      children: [
        { label: 'Clero', id: 'clero', type: 'scroll' },
        { label: 'Guias', id: 'guias', type: 'page' },
        { label: 'Matriz e Capelas', id: 'matriz', type: 'scroll' },
        { label: 'Movimentos/Pastorais', id: 'movimentos', type: 'page' },
        { label: 'Inscrições', id: 'inscricoes', type: 'page' },
        { label: 'Brasão', id: 'brasao', type: 'page' },
        { label: 'Contato', id: 'contato', type: 'page' },
      ],
    },
    {
      label: 'História',
      isDropdown: true,
      children: [
        { label: 'Sobre nós', id: 'sobre', type: 'scroll' },
        { label: 'História Completa', id: 'historia-completa', type: 'page' },
        { label: 'Antigos Padres', id: 'antigos-padres', type: 'page' },
      ],
    },
    { label: 'Programação', id: 'eventos-futuros', type: 'scroll' },
    { label: 'Galeria', id: 'eventos-realizados', type: 'scroll' },
    { label: 'Pedidos de Oração', id: 'pedidos-oracao', type: 'page' },
    { label: 'Dízimo', id: 'dizimo', type: 'page' },
    { label: 'Notícias', id: 'noticias', type: 'page' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-amber-100'
        : 'bg-white/90 backdrop-blur-md'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => scrollToSection('inicio')}>
            <div className="w-16 h-16 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
              <img src={testeImg} alt="Detalhes Paróquia Santo André" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-bold text-amber-900 text-lg tracking-tight">Paróquia Santo André</h1>
              <p className="text-xs text-amber-700 font-medium">Tarumã - SP</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1">
            {menuStructure.map((item, idx) => {
              if (item.isDropdown) {
                return (
                  <div key={idx} className="relative group">
                    <button
                      className="flex items-center space-x-1 text-gray-700 hover:text-amber-700 transition-all duration-300 text-sm font-semibold px-3 py-2 rounded-lg hover:bg-amber-50"
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                    </button>
                    {/* Dropdown Menu */}
                    <div className="absolute left-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left scale-95 group-hover:scale-100">
                      <div className="bg-white rounded-xl shadow-xl border border-amber-100 overflow-hidden py-2">
                        {item.children?.map((child, cIdx) => (
                          <button
                            key={cIdx}
                            onClick={() => handleAction(child)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                          >
                            {child.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAction(item)}
                  className="relative text-gray-700 hover:text-amber-700 transition-all duration-300 text-sm font-semibold px-3 py-2 rounded-lg hover:bg-amber-50 group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-amber-700 group-hover:w-3/4 transition-all duration-300"></span>
                </button>
              );
            })}
            <a
              href="https://www.instagram.com/paroquiasantoandre.taruma/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white px-4 py-2 rounded-full hover:shadow-2xl transition-all duration-300 hover:scale-105 ml-4"
            >
              <Instagram className="w-4 h-4" />
              <span className="text-sm font-semibold">Instagram</span>
            </a>
          </nav>

          {/* Mobile Menu Button - shows on xl and below */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="xl:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="xl:hidden py-4 border-t border-gray-200 max-h-[80vh] overflow-y-auto">
            {menuStructure.map((item, idx) => {
              if (item.isDropdown) {
                return (
                  <div key={idx} className="border-b border-gray-100 last:border-0">
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-amber-700 transition-colors font-medium"
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === item.label && (
                      <div className="bg-gray-50 py-2">
                        {item.children?.map((child, cIdx) => (
                          <button
                            key={cIdx}
                            onClick={() => handleAction(child)}
                            className="block w-full text-left px-8 py-2 text-sm text-gray-600 hover:text-amber-700 transition-colors"
                          >
                            {child.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAction(item)}
                  className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-amber-700 transition-colors border-b border-gray-100 last:border-0 font-medium"
                >
                  {item.label}
                </button>
              );
            })}
            <a
              href="https://instagram.com/paroquiasantoandre"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 mx-4 mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all justify-center"
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