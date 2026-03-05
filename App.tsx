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
import { DailyLiturgyCard } from './componenst/DailyLiturgy';
import { fetchDailyLiturgy, getThemeFromLiturgicalColor, type DailyLiturgy, type LiturgicalTheme } from './src/services/liturgy';

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
  const [dailyLiturgy, setDailyLiturgy] = useState<DailyLiturgy | null>(null);
  const [liturgyLoading, setLiturgyLoading] = useState(true);
  const [liturgyError, setLiturgyError] = useState<string | null>(null);
  const [liturgicalTheme, setLiturgicalTheme] = useState<LiturgicalTheme>(getThemeFromLiturgicalColor('verde'));

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

  useEffect(() => {
    let mounted = true;
    let midnightTimer: number | undefined;
    let periodicTimer: number | undefined;

    const loadDailyLiturgy = async (showLoading = false) => {
      try {
        if (showLoading) setLiturgyLoading(true);
        const data = await fetchDailyLiturgy();
        if (!mounted) return;
        setDailyLiturgy(data);
        setLiturgicalTheme(getThemeFromLiturgicalColor(data.liturgicalColor));
        setLiturgyError(null);
      } catch (error) {
        if (!mounted) return;
        console.error('Erro ao carregar liturgia diaria:', error);
        setLiturgyError('Nao foi possivel carregar a liturgia diaria agora.');
      } finally {
        if (mounted && showLoading) setLiturgyLoading(false);
      }
    };

    const getMsUntilNextMidnight = () => {
      const now = new Date();
      const next = new Date(now);
      next.setHours(24, 0, 5, 0);
      return Math.max(60_000, next.getTime() - now.getTime());
    };

    const scheduleMidnightRefresh = () => {
      if (midnightTimer) window.clearTimeout(midnightTimer);
      midnightTimer = window.setTimeout(async () => {
        await loadDailyLiturgy(false);
        scheduleMidnightRefresh();
      }, getMsUntilNextMidnight());
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadDailyLiturgy(false);
      }
    };

    loadDailyLiturgy(true);
    scheduleMidnightRefresh();
    periodicTimer = window.setInterval(() => loadDailyLiturgy(false), 60 * 60 * 1000);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      mounted = false;
      if (midnightTimer) window.clearTimeout(midnightTimer);
      if (periodicTimer) window.clearInterval(periodicTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const body = document.body;
    body.classList.add('liturgical-theme-active');
    body.style.setProperty('--liturgical-main', liturgicalTheme.main);
    body.style.setProperty('--liturgical-soft', liturgicalTheme.soft);

    return () => {
      body.classList.remove('liturgical-theme-active');
      body.style.removeProperty('--liturgical-main');
      body.style.removeProperty('--liturgical-soft');
    };
  }, [liturgicalTheme]);

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
        <DailyLiturgyCard
          liturgy={dailyLiturgy}
          isLoading={liturgyLoading}
          error={liturgyError}
          theme={liturgicalTheme}
        />
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