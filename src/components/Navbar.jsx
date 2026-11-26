import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { currentLang, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { currentUser, userProfile, openLoginModal, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav>
      <div className="nav-container">
        <Link to="/" className="logo" onClick={closeMobileMenu}>
          <i className="fa-solid fa-torii-gate"></i>{' '}
          <span style={{ color: '#ff66b2' }}>{currentLang === 'en' ? "Ted's" : 'Tedův'}</span>{' '}
          <span style={{ color: 'var(--text-main)' }}>{currentLang === 'en' ? 'Eastern' : 'východní'}</span>{' '}
          <span style={{ color: '#ff3333' }}>{currentLang === 'en' ? 'World' : 'svět'}</span>
        </Link>

        <ul className={`nav-links ${mobileMenuOpen ? 'nav-active' : ''}`}>
          <li>
            <NavLink 
              to="/planner" 
              className={({ isActive }) => (isActive ? 'active' : '')} 
              onClick={() => { closeMobileMenu(); window.dispatchEvent(new Event('resetPlanner')); }}
            >
              {t('nav.planner', 'Plánovač')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/map" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMobileMenu}>
              {t('nav.map', 'Mapa')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/gallery" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMobileMenu}>
              {t('nav.gallery', 'Galerie')}
            </NavLink>
          </li>

          <li className="nav-dropdown">
            <a href="#destinations" role="button" aria-haspopup="true" style={{ cursor: 'pointer' }} onClick={(e) => e.preventDefault()}>
              {t('nav.destinations', 'Destinace')}{' '}
              <i className="fa-solid fa-chevron-down" style={{ fontSize: '0.8rem' }}></i>
            </a>
            <div className="nav-dropdown-content">
              <Link to="/japan" onClick={closeMobileMenu}>{t('nav.japanese', 'Japonsko')}</Link>
              <Link to="/korea" onClick={closeMobileMenu}>{t('nav.korea', 'Jižní Korea')}</Link>
            </div>
          </li>

          <li className="nav-dropdown">
            <a href="#languages" role="button" aria-haspopup="true" style={{ cursor: 'pointer' }} onClick={(e) => e.preventDefault()}>
              {t('nav.languages', 'Jazyky')}{' '}
              <i className="fa-solid fa-chevron-down" style={{ fontSize: '0.8rem' }}></i>
            </a>
            <div className="nav-dropdown-content">
              <Link to="/japonsky" onClick={closeMobileMenu}>🇯🇵 {t('nav.japanese_lang', 'Japonština')}</Link>
              <Link to="/korejsky" onClick={closeMobileMenu}>🇰🇷 {t('nav.korean_lang', 'Korejština')}</Link>
            </div>
          </li>

          <li>
            <NavLink to="/about" style={{ whiteSpace: 'nowrap' }} className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMobileMenu}>
              {t('nav.about', 'O mně')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/forum" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMobileMenu}>
              {t('nav.forum', 'Fórum')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMobileMenu}>
              {t('nav.contact', 'Kontakt')}
            </NavLink>
          </li>

          {mobileMenuOpen && !currentUser && (
            <li className="mobile-nav-login-li">
              <button onClick={() => { closeMobileMenu(); openLoginModal(); }}>
                <i className="fa-solid fa-right-to-bracket"></i> {t('nav.login', 'Přihlásit se')}
              </button>
            </li>
          )}
        </ul>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
          <div id="nav-auth-container" style={{ display: 'flex', alignItems: 'center', gap: '5px', marginRight: '5px' }}>
            {currentUser ? (
              <>
                <Link to="/profile" style={{ color: 'var(--accent-color)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', marginRight: '2px' }}>
                  {userProfile?.avatarUrl ? (
                    <img src={userProfile.avatarUrl} alt="Avatar" style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <i className="fa-solid fa-circle-user" style={{ fontSize: '1.5rem' }}></i>
                  )}
                  <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-main)' }} className="hide-mobile">
                    {t('nav.profile', 'Profil')}
                  </span>
                </Link>
                <button onClick={logout} className="btn btn-icon" style={{ background: 'transparent', color: 'var(--text-muted)', fontSize: '1.1rem', cursor: 'pointer', border: 'none', padding: '4px' }} title="Odhlásit se">
                  <i className="fa-solid fa-right-from-bracket"></i>
                </button>
              </>
            ) : (
              <button 
                onClick={openLoginModal} 
                title="Přihlásit se" 
                className="nav-login-btn" 
                style={{
                  background: 'var(--accent-color)', border: 'none', cursor: 'pointer', color: 'white',
                  borderRadius: '20px', padding: '6px 14px', fontSize: '0.85rem', fontWeight: 700,
                  fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap',
                  transition: 'opacity 0.2s'
                }}
              >
                <i className="fa-solid fa-right-to-bracket"></i> {t('nav.login', 'Přihlásit se')}
              </button>
            )}
          </div>

          <Link to="/admin" className="theme-toggle" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%' }} title="Admin Login">
            <i className="fa-solid fa-user-lock"></i>
          </Link>

          <div className="lang-switcher" id="lang-switcher" role="group" aria-label="Volba jazyka">
            <button className={`lang-btn ${currentLang === 'cs' ? 'active' : ''}`} aria-pressed={currentLang === 'cs'} onClick={() => setLanguage('cs')} title="Čeština">CZ</button>
            <button className={`lang-btn ${currentLang === 'en' ? 'active' : ''}`} aria-pressed={currentLang === 'en'} onClick={() => setLanguage('en')} title="English">EN</button>
          </div>

          <button id="theme-toggle" className="theme-toggle" onClick={toggleTheme} aria-label="Přepnout motiv">
            <i className={theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon'}></i>
          </button>

          <button className="mobile-menu-btn" onClick={toggleMobileMenu} aria-label="Otevřít menu" aria-expanded={mobileMenuOpen}>
            <i className={mobileMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'}></i>
          </button>
        </div>
      </div>
    </nav>
  );
}
