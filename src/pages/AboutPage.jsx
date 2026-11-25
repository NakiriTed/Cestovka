import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export function AboutPage() {
  const { t } = useLanguage();

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '6rem 2rem 3rem' }}>
      <div className="glass" style={{ padding: '3rem', borderRadius: '20px' }}>
        <h1 style={{ marginBottom: '1.5rem' }}>{t('about.title', 'O mně — Tedův východní svět')}</h1>
        <p style={{ lineHeight: '1.8', fontSize: '1.05rem', color: 'var(--text-muted)' }}>
          {t('about.bio', 'Ahoj! Jmenuji se Tadeáš (Ted). Asijská kultura, gastronomie a cestování po Japonsku a Jižní Koreji mě naprosto pohltily.')}
        </p>
        <p style={{ lineHeight: '1.8', fontSize: '1.05rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
          {t('about.travelDesc', 'Založil jsem projekt Tedův východní svět, abych pomohl lidem objevovat tyto nádherné země bez obav z jazykové bariéry.')}
        </p>
      </div>
    </main>
  );
}
