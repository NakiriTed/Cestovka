import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function AuthModal() {
  const { 
    isAuthModalOpen, closeAuthModal, authMode, setAuthMode, 
    loginWithEmail, registerWithEmail, socialLogin, resetPassword 
  } = useAuth();

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
      setError(err.message || 'Chyba přihlášení.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await registerWithEmail(regName, regEmail, regPass);
    } catch (err) {
      setError(err.message || 'Chyba registrace.');
    }
  };

  const handleResetPass = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(loginEmail);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="cms-modal auth-modal-overlay active" onClick={closeAuthModal}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="auth-close-btn" onClick={closeAuthModal} aria-label="Zavřít">
          <i className="fa-solid fa-xmark"></i>
        </button>

        {error && (
          <div style={{ color: '#e74c3c', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
            <i className="fa-solid fa-circle-exclamation"></i> {error}
          </div>
        )}

        {authMode === 'login' ? (
          <div id="auth-form-login" className="auth-form-step">
            <h2 className="auth-modal-title">Přihlášení do komunity</h2>
            <p className="auth-modal-subtitle">Získejte přístup k plánovači a diskusnímu fóru</p>

            <form onSubmit={handleLoginSubmit} className="auth-form-body">
              <div className="auth-field-group">
                <label htmlFor="login-email" className="auth-label">E-mail</label>
                <input 
                  type="email" 
                  id="login-email" 
                  className="auth-input" 
                  placeholder="vase.jmeno@email.cz" 
                  required 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>

              <div className="auth-field-group">
                <div className="auth-label-row">
                  <label htmlFor="login-pass" className="auth-label">Heslo</label>
                  <a href="#" onClick={handleResetPass} className="auth-forgot-link">Zapomenuté heslo?</a>
                </div>
                <input 
                  type="password" 
                  id="login-pass" 
                  className="auth-input" 
                  placeholder="••••••••" 
                  required 
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                />
              </div>

              <button type="submit" className="auth-btn-primary">
                <i className="fa-solid fa-right-to-bracket"></i> Přihlásit se
              </button>

              <div className="auth-divider"><span>NEBO</span></div>

              <div className="auth-social-row">
                <button type="button" className="auth-btn-social google" onClick={() => socialLogin('google')}>
                  <i className="fa-brands fa-google"></i> Google
                </button>
                <button type="button" className="auth-btn-social facebook" onClick={() => socialLogin('facebook')}>
                  <i className="fa-brands fa-facebook-f"></i> Facebook
                </button>
              </div>

              <p className="auth-switch-text">
                Nemáte ještě účet? <a href="#" onClick={(e) => { e.preventDefault(); setAuthMode('register'); }} className="auth-switch-link">Zaregistrujte se</a>
              </p>
            </form>
          </div>
        ) : (
          <div id="auth-form-register" className="auth-form-step">
            <h2 className="auth-modal-title">Registrace účtu</h2>
            <p className="auth-modal-subtitle">Připojte se k naší japonsko-korejské komunitě</p>

            <form onSubmit={handleRegisterSubmit} className="auth-form-body">
              <div className="auth-field-group">
                <label htmlFor="reg-name" className="auth-label">Zobrazované jméno</label>
                <input 
                  type="text" 
                  id="reg-name" 
                  className="auth-input" 
                  placeholder="Cestovatel 123" 
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
                  className="auth-input" 
                  placeholder="vase.jmeno@email.cz" 
                  required 
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />
              </div>

              <div className="auth-field-group">
                <label htmlFor="reg-pass" className="auth-label">Heslo</label>
                <input 
                  type="password" 
                  id="reg-pass" 
                  className="auth-input" 
                  placeholder="Alespoň 6 znaků" 
                  required 
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                />
              </div>

              <button type="submit" className="auth-btn-primary success">
                <i className="fa-solid fa-user-plus"></i> Vytvořit účet
              </button>

              <p className="auth-switch-text">
                Již máte účet? <a href="#" onClick={(e) => { e.preventDefault(); setAuthMode('login'); }} className="auth-switch-link">Přihlaste se</a>
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
