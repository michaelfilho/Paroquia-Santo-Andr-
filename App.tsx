import { useState, useEffect } from 'react';
import { Header } from './componenst/Header';
import { Hero } from './componenst/Hero';
import { About } from './componenst/About';
import { Clergy } from './componenst/Clergy';
import { Guides } from './componenst/Guides';
import { Map } from './componenst/Map';
import { PastEvents } from './componenst/PastEvents';
import { FutureEvents } from './componenst/FutureEvents';
import { Footer } from './componenst/Footer';
import { EventGallery } from './componenst/EventGallery';
import { Inscricoes } from './componenst/Inscrições';
import { AdminLogin } from './componenst/adminLogin';
import { AdminDashboard } from './componenst/AdminDashboard';
import { Movimentos } from './componenst/Movimentos';
import { Brasao } from './componenst/Brasao';
import { HistoriaCompleta } from './componenst/HistoriaCompleta';
import { AntigosPadres } from './componenst/AntigosPadres';
import { PedidosOracao } from './componenst/PedidosOracao';
import { Dizimo } from './componenst/Dizimo';
import { Noticias } from './componenst/Noticias';
import { Contato } from './componenst/Contato';
import { candlesAPI, siteVisitsAPI } from './src/services/api';

export type PageType = 'home' | 'inscricoes' | 'guias' | 'admin-login' | 'admin-dashboard' | 'movimentos' | 'brasao' | 'historia-completa' | 'antigos-padres' | 'pedidos-oracao' | 'dizimo' | 'noticias' | 'contato';

const normalizePath = (pathname: string) => {
  let decodedPath = pathname;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    decodedPath = pathname;
  }

  const withoutTrailingSlash = decodedPath.replace(/\/+$/, '') || '/';
  const lowerPath = withoutTrailingSlash.toLowerCase();

  if (lowerPath === '/paroquia') return '/inicio';
  if (lowerPath.startsWith('/paroquia/')) {
    return lowerPath.slice('/paroquia'.length);
  }

  return lowerPath;
};

const getPageFromPath = (pathname: string): PageType | null => {
  const path = normalizePath(pathname);

  switch (path) {
    case '/':
    case '/inicio':
      return 'home';
    case '/inscricoes':
      return 'inscricoes';
    case '/guias':
      return 'guias';
    case '/admin':
      return 'admin-login';
    case '/admin/dashboard':
      return 'admin-dashboard';
    case '/movimentos':
      return 'movimentos';
    case '/brasao':
    case '/brasão':
      return 'brasao';
    case '/historia-completa':
    case '/historia completa':
      return 'historia-completa';
    case '/antigos-padres':
      return 'antigos-padres';
    case '/pedidos-oracao':
      return 'pedidos-oracao';
    case '/dizimo':
      return 'dizimo';
    case '/noticias':
      return 'noticias';
    case '/contato':
      return 'contato';
    default:
      return null;
  }
};

const getPathFromPage = (page: PageType) => {
  switch (page) {
    case 'home':
      return '/inicio';
    case 'inscricoes':
      return '/inscricoes';
    case 'guias':
      return '/guias';
    case 'admin-login':
      return '/admin';
    case 'admin-dashboard':
      return '/admin/dashboard';
    case 'movimentos':
      return '/movimentos';
    case 'brasao':
      return '/brasao';
    case 'historia-completa':
      return '/historia-completa';
    case 'antigos-padres':
      return '/antigos-padres';
    case 'pedidos-oracao':
      return '/pedidos-oracao';
    case 'dizimo':
      return '/dizimo';
    case 'noticias':
      return '/noticias';
    case 'contato':
      return '/contato';
    default:
      return '/inicio';
  }
};

export default function App() {
  const [selectedEvent, setSelectedEvent] = useState<string | number | null>(null);
  const [currentPage, setCurrentPage] = useState<PageType>(() => getPageFromPath(window.location.pathname) ?? 'home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [litCandlesCount, setLitCandlesCount] = useState(0);

  useEffect(() => {
    const initialPage = getPageFromPath(window.location.pathname);
    if (!initialPage) {
      window.history.replaceState({}, '', getPathFromPage('home'));
    }

    const handlePopState = () => {
      const page = getPageFromPath(window.location.pathname) ?? 'home';
      setCurrentPage(page);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const targetPath = getPathFromPage(currentPage);
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  }, [currentPage]);

  useEffect(() => {
    const loadCandles = async () => {
      try {
        const response = await candlesAPI.getCount();
        setLitCandlesCount(Number(response?.count || 0));
      } catch (error) {
        console.error('Erro ao carregar contador de velas:', error);
      }
    };

    loadCandles();
  }, []);

  useEffect(() => {
    const registerVisit = async () => {
      try {
        const initialPage = getPageFromPath(window.location.pathname) ?? 'home';
        if (initialPage !== 'home') return;

        const key = 'site_visit_registered_tab';
        if (sessionStorage.getItem(key)) return;

        await siteVisitsAPI.increment();
        sessionStorage.setItem(key, '1');
      } catch (error) {
        console.error('Erro ao registrar acesso ao site:', error);
      }
    };

    registerVisit();
  }, []);

  const handleCandleLit = () => {
    setLitCandlesCount(prev => prev + 1);
    candlesAPI.increment().catch((error) => {
      console.error('Erro ao persistir vela acesa:', error);
    });
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as PageType);
  };

  const handleAdminClick = () => {
    setCurrentPage('admin-login');
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('admin-dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('home');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  // Render Admin Login
  if (currentPage === 'admin-login') {
    return <AdminLogin onLogin={handleLogin} onBack={handleBackToHome} />;
  }

  // Render Admin Dashboard
  if (currentPage === 'admin-dashboard' && isAuthenticated) {
    return (
      <AdminDashboard onLogout={handleLogout} />
    );
  }

  // Render New Pages
  if (currentPage === 'movimentos') return <Movimentos onNavigate={handleNavigate} currentPage={currentPage} onAdminClick={handleAdminClick} />;
  if (currentPage === 'brasao') return <Brasao onNavigate={handleNavigate} currentPage={currentPage} onAdminClick={handleAdminClick} />;
  if (currentPage === 'historia-completa') return <HistoriaCompleta onNavigate={handleNavigate} currentPage={currentPage} onAdminClick={handleAdminClick} />;
  if (currentPage === 'antigos-padres') return <AntigosPadres onNavigate={handleNavigate} currentPage={currentPage} onAdminClick={handleAdminClick} />;
  if (currentPage === 'pedidos-oracao') return <PedidosOracao onNavigate={handleNavigate} currentPage={currentPage} onAdminClick={handleAdminClick} onCandleLit={handleCandleLit} />;
  if (currentPage === 'dizimo') return <Dizimo onNavigate={handleNavigate} currentPage={currentPage} onAdminClick={handleAdminClick} />;
  if (currentPage === 'noticias') return <Noticias onNavigate={handleNavigate} currentPage={currentPage} onAdminClick={handleAdminClick} />;
  if (currentPage === 'contato') return <Contato onNavigate={handleNavigate} currentPage={currentPage} onAdminClick={handleAdminClick} />;

  // Render Guias Page
  if (currentPage === 'guias') {
    return (
      <div className="min-h-screen bg-white">
        <Header onNavigate={handleNavigate} currentPage={currentPage} />
        <div style={{ paddingTop: '80px' }}>
          <Guides />
        </div>
        <Footer onAdminClick={handleAdminClick} />
      </div>
    );
  }

  // Render Inscricoes Page
  if (currentPage === 'inscricoes') {
    return (
      <div className="min-h-screen bg-white">
        <Header onNavigate={handleNavigate} currentPage={currentPage} />
        <Inscricoes />
        <Footer onAdminClick={handleAdminClick} />
      </div>
    );
  }

  // Render Home Page (default)
  return (
    <div className="min-h-screen bg-white">
      <Header onNavigate={handleNavigate} currentPage={currentPage} />
      <main>
        <Hero />
        <About litCandlesCount={litCandlesCount} />
        <Clergy />
        <FutureEvents />
        <PastEvents onViewPhotos={setSelectedEvent} />
        <Map />
      </main>
      <Footer onAdminClick={handleAdminClick} />

      {selectedEvent !== null && (
        <EventGallery
          eventId={String(selectedEvent)}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}