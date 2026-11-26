import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export function AuthModal() {
  const { 
    isAuthModalOpen, closeAuthModal, authMode, setAuthMode, 
    loginWithEmail, registerWithEmail, socialLogin, resetPassword 
  } = useAuth();
  const { currentLang } = useLanguage();
  const isEn = currentLang === 'en';

  const formatAuthError = (err) => {
    const code = err?.code || '';
    if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) {
      return isEn ? 'Incorrect e-mail or password.' : 'Nesprávný e-mail nebo heslo.';
    }
    if (code.includes('email-already-in-use')) {
      return isEn ? 'This e-mail is already registered. Please sign in.' : 'Tento e-mail je již zaregistrován. Přihlaste se prosím.';
    }
    if (code.includes('weak-password')) {
      return isEn ? 'Password must be at least 6 characters.' : 'Heslo musí mít alespoň 6 znaků.';
    }
    if (code.includes('unauthorized-domain')) {
      return isEn ? 'This domain is not authorized in Firebase Auth.' : 'Tato doména není autorizována ve Firebase Authentication.';
    }
    return err?.message || (isEn ? 'Authentication error.' : 'Chyba přihlášení.');
  };

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await loginWithEmail(loginEmail, loginPass);
    } catch (err) {
      setError(formatAuthError(err));
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await registerWithEmail(regName, regEmail, regPass);
    } catch (err) {
      setError(formatAuthError(err));
    }
  };

  const handleResetPass = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(loginEmail);
    } catch (err) {
      setError(formatAuthError(err));
    }
  };

  const handleSocial = async (provider) => {
    setError('');
    try {
      await socialLogin(provider);
    } catch (err) {
      setError(formatAuthError(err));
    }
  };

  return (
    <div className="cms-modal auth-modal-overlay active" role="dialog" aria-modal="true" aria-label={isEn ? 'Authentication' : 'Přihlášení'} onClick={closeAuthModal}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="auth-close-btn" onClick={closeAuthModal} aria-label={isEn ? 'Close' : 'Zavřít'}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        {error && (
          <div role="alert" style={{ color: '#ff8a80', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
            <i className="fa-solid fa-circle-exclamation"></i> {error}
          </div>
        )}

        {authMode === 'login' ? (
          <div id="auth-form-login" className="auth-form-step">
            <h2 className="auth-modal-title">{isEn ? 'Sign In' : 'Přihlášení do komunity'}</h2>
            <p className="auth-modal-subtitle">{isEn ? 'Access your saved itineraries, profile, and community forum' : 'Získejte přístup k vlastním itinerářům, profilu a diskusnímu fóru'}</p>

            <form onSubmit={handleLoginSubmit} className="auth-form-body">
              <div className="auth-field-group">
                <label htmlFor="login-email" className="auth-label">E-mail</label>
                <input 
                  type="email" 
                  id="login-email" 
                  autoComplete="email"
                  className="auth-input" 
                  placeholder="jan@email.cz" 
                  required 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>

              <div className="auth-field-group">
                <div className="auth-label-row">
                  <label htmlFor="login-pass" className="auth-label">{isEn ? 'Password' : 'Heslo'}</label>
                  <a href="#reset" onClick={handleResetPass} className="auth-forgot-link">{isEn ? 'Forgot password?' : 'Zapomenuté heslo?'}</a>
                </div>
                <input 
                  type="password" 
                  id="login-pass" 
                  autoComplete="current-password"
                  className="auth-input" 
                  placeholder="••••••••" 
                  required 
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                />
              </div>

              <button type="submit" className="auth-btn-primary">
                <i className="fa-solid fa-right-to-bracket"></i> {isEn ? 'Sign In' : 'Přihlásit se'}
              </button>

              <div className="auth-divider"><span>{isEn ? 'OR' : 'NEBO'}</span></div>

              <div className="auth-social-row">
                <button type="button" className="auth-btn-social google" onClick={() => handleSocial('google')}>
                  <i className="fa-brands fa-google"></i> Google
                </button>
                <button type="button" className="auth-btn-social facebook" onClick={() => handleSocial('facebook')}>
                  <i className="fa-brands fa-facebook-f"></i> Facebook
                </button>
              </div>

              <p className="auth-switch-text">
                {isEn ? "Don't have an account yet?" : 'Nemáte ještě účet?'}{' '}
                <a href="#register" onClick={(e) => { e.preventDefault(); setAuthMode('register'); }} className="auth-switch-link">{isEn ? 'Register' : 'Zaregistrujte se'}</a>
              </p>
            </form>
          </div>
        ) : (
          <div id="auth-form-register" className="auth-form-step">
            <h2 className="auth-modal-title">{isEn ? 'Create Account' : 'Registrace účtu'}</h2>
            <p className="auth-modal-subtitle">{isEn ? 'Join our Japan & Korea travel community' : 'Připojte se k naší japonsko-korejské komunitě'}</p>

            <form onSubmit={handleRegisterSubmit} className="auth-form-body">
              <div className="auth-field-group">
                <label htmlFor="reg-name" className="auth-label">{isEn ? 'Nickname' : 'Přezdívka'}</label>
                <input 
                  type="text" 
                  id="reg-name" 
                  autoComplete="nickname"
                  className="auth-input" 
                  placeholder={isEn ? 'Traveler' : 'Cestovatel'} 
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value.replace(/[0-9]/g, ''))}
                />
              </div>

              <div className="auth-field-group">
                <label htmlFor="reg-email" className="auth-label">E-mail</label>
                <input 
                  type="email" 
                  id="reg-email" 
                  autoComplete="email"
                  className="auth-input" 
                  placeholder="jan@email.cz" 
                  required 
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />
              </div>

              <div className="auth-field-group">
                <label htmlFor="reg-pass" className="auth-label">{isEn ? 'Password' : 'Heslo'}</label>
                <input 
                  type="password" 
                  id="reg-pass" 
                  autoComplete="new-password"
                  className="auth-input" 
                  placeholder={isEn ? 'At least 6 characters' : 'Alespoň 6 znaků'} 
                  required 
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                />
              </div>

              <button type="submit" className="auth-btn-primary success">
                <i className="fa-solid fa-user-plus"></i> {isEn ? 'Create Account' : 'Vytvořit účet'}
              </button>

              <p className="auth-switch-text">
                {isEn ? 'Already have an account?' : 'Již máte účet?'}{' '}
                <a href="#login" onClick={(e) => { e.preventDefault(); setAuthMode('login'); }} className="auth-switch-link">{isEn ? 'Sign In' : 'Přihlaste se'}</a>
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
