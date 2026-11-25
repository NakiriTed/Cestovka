import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AIChatbot } from './components/AIChatbot';
import { AuthModal } from './components/AuthModal';

import { HomePage } from './pages/HomePage';
import { PlannerPage } from './pages/PlannerPage';
import { JapanesePage } from './pages/JapanesePage';
import { KoreanPage } from './pages/KoreanPage';
import { JapanGuidePage } from './pages/JapanGuidePage';
import { KoreaGuidePage } from './pages/KoreaGuidePage';
import { ForumPage } from './pages/ForumPage';
import { GalleryPage } from './pages/GalleryPage';
import { MapPage } from './pages/MapPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CancellationPage } from './pages/CancellationPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';

import '../styles.css';

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <DataProvider>
            <Router>
              <ScrollToTop />
              <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <div style={{ flex: 1 }}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/planner" element={<PlannerPage />} />
                    <Route path="/japonsky" element={<JapanesePage />} />
                    <Route path="/korejsky" element={<KoreanPage />} />
                    <Route path="/japan" element={<JapanGuidePage />} />
                    <Route path="/korea" element={<KoreaGuidePage />} />
                    <Route path="/forum" element={<ForumPage />} />
                    <Route path="/gallery" element={<GalleryPage />} />
                    <Route path="/map" element={<MapPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/cancellation" element={<CancellationPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="*" element={<HomePage />} />
                  </Routes>
                </div>
                <Footer />
                <AIChatbot />
                <AuthModal />
              </div>
            </Router>
          </DataProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
