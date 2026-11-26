import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer style={{ marginTop: '4rem' }}>
      <div className="footer-inner">
        <p>{t('footer.rights', '© 2026 Tedův východní svět — Všechna práva vyhrazena.')}</p>
        <div className="footer-social">
          <a href="https://www.instagram.com/rikejmited/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a href="https://www.facebook.com/LeesinWrizz/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <i className="fa-brands fa-facebook"></i>
          </a>
          <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <i className="fa-brands fa-tiktok"></i>
          </a>
          <a href="mailto:sykoratadeas2001@gmail.com" aria-label="E-mail">
            <i className="fa-solid fa-envelope"></i>
          </a>
          <Link to="/contact" aria-label="Kontakt">
            <i className="fa-solid fa-address-card"></i>
          </Link>
        </div>
        <Link to="/cancellation" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none', opacity: 0.7, transition: 'opacity 0.2s' }}>
          <i className="fa-solid fa-file-contract"></i> Storno podmínky
        </Link>
      </div>
    </footer>
  );
}
