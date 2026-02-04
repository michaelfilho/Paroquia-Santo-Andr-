import { useState } from 'react';
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

type PageType = 'home' | 'inscricoes' | 'guias' | 'admin-login' | 'admin-dashboard';

export default function App() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleNavigate = (page: string) => {
    if (page === 'inscricoes') {
      setCurrentPage('inscricoes');
    } else if (page === 'guias') {
      setCurrentPage('guias');
    } else if (page === 'home') {
      setCurrentPage('home');
    }
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
      <>
        <Header onNavigate={handleNavigate} currentPage={currentPage} />
        <AdminDashboard onLogout={handleLogout} />
        <Footer />
      </>
    );
  }

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
        <About />
        <Clergy />
        <Map />
        <PastEvents onViewPhotos={setSelectedEvent} />
        <FutureEvents />
      </main>
      <Footer onAdminClick={handleAdminClick} />
      
      {selectedEvent && (
        <EventGallery 
          eventId={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}
    </div>
  );
}