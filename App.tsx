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
import { candlesAPI } from './src/services/api';

export type PageType = 'home' | 'inscricoes' | 'guias' | 'admin-login' | 'admin-dashboard' | 'movimentos' | 'brasao' | 'historia-completa' | 'antigos-padres' | 'pedidos-oracao' | 'dizimo' | 'noticias' | 'contato';

export default function App() {
  const [selectedEvent, setSelectedEvent] = useState<string | number | null>(null);
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [litCandlesCount, setLitCandlesCount] = useState(0);

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
        <Map />
        <PastEvents onViewPhotos={setSelectedEvent} />
        <FutureEvents />
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