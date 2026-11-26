import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export function HomePage() {
  const { t, currentLang } = useLanguage();
  const isEn = currentLang === 'en';

  useEffect(() => {
    // Falling leaves effect for Home Page
    const interval = setInterval(createLeaf, 700);
    return () => clearInterval(interval);
  }, []);

  function createLeaf() {
    const leaf = document.createElement('i');
    leaf.classList.add('fa-solid', 'fa-leaf', 'falling-leaf');

    leaf.style.left = Math.random() * 100 + 'vw';
    const duration = Math.random() * 5 + 6;
    leaf.style.animationDuration = duration + 's';
    const size = Math.random() * 12 + 10;
    leaf.style.fontSize = size + 'px';
    const drift = (Math.random() - 0.5) * 200;
    leaf.style.setProperty('--drift', drift + 'px');

    document.body.appendChild(leaf);

    setTimeout(() => {
      if (document.body.contains(leaf)) {
        leaf.remove();
      }
    }, duration * 1000);
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="hero" style={{ padding: '5rem 2rem 2rem', textAlign: 'center', position: 'relative' }}>
        <div 
          className="glass hero-card" 
          style={{ 
            maxWidth: '920px', 
            margin: '0 auto', 
            padding: '3.5rem 2.5rem', 
            borderRadius: '24px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Curved Arch Title "TEDOVA ASIE" */}
            <div style={{ width: '100%', maxWidth: '650px', margin: '0 auto -10px', textAlign: 'center' }}>
              <svg viewBox="0 0 500 110" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                <path id="curve" d="M 30,105 A 240,110 0 0,1 470,105" fill="none" />
                <text style={{ fontSize: '46px', fontWeight: 900, fill: 'var(--accent-color)', letterSpacing: '6px', fontFamily: "'Dela Gothic One', sans-serif", filter: 'drop-shadow(0 4px 15px rgba(239,35,60,0.4))' }}>
                  <textPath href="#curve" startOffset="50%" textAnchor="middle">
                    {isEn ? "TED'S ASIA" : 'TEDOVA ASIE'}
                  </textPath>
                </text>
              </svg>
            </div>
            
            <h1 style={{ fontSize: '1.9rem', fontWeight: 700, color: 'var(--accent-color)', marginBottom: '1.2rem', textShadow: '0 2px 10px rgba(239,35,60,0.3)' }}>
              {isEn ? 'Discover the Soul & Flavors of East Asia' : 'Pojďme společně objevovat chutě Asie'}
            </h1>

            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '750px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
              {t('home.hero.desc', 'Od stínů hory Fuji a odkazů samurajů až po křehkou krásu kvetoucích sakur. Zažijte cestu, na kterou nikdy nezapomenete.')}
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <Link to="/planner" className="btn btn-primary" style={{ textDecoration: 'none', padding: '0.8rem 1.8rem', fontSize: '1.05rem' }}>
                <i className="fa-solid fa-route"></i> {t('home.hero.cta', 'Začít plánovat cestu')}
              </Link>
              <Link to="/japan" className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-main)', textDecoration: 'none', border: '1px solid var(--glass-border)', padding: '0.8rem 1.5rem' }}>
                🇯🇵 {isEn ? 'Japan' : 'Japonsko'}
              </Link>
              <Link to="/korea" className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-main)', textDecoration: 'none', border: '1px solid var(--glass-border)', padding: '0.8rem 1.5rem' }}>
                🇰🇷 {isEn ? 'South Korea' : 'Jižní Korea'}
              </Link>
            </div>

            {/* YouTube Video Player Embed */}
            <div className="video-container-wrapper" style={{ marginTop: '1.5rem' }}>
              <div 
                style={{ 
                  position: 'relative', 
                  paddingBottom: '56.25%', 
                  height: 0, 
                  overflow: 'hidden', 
                  borderRadius: '16px',
                  border: '1px solid var(--glass-border)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                }}
              >
                <iframe 
                  src="https://www.youtube.com/embed/EDXnc--w5gU?autoplay=1&mute=1&enablejsapi=1&rel=0&controls=1" 
                  title="Tedův Východní Svět - Video" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                ></iframe>
              </div>

              <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <i className="fa-solid fa-volume-high" style={{ color: 'var(--accent-color)', marginRight: '6px' }}></i>
                {isEn ? 'YouTube video player — you can toggle sound directly inside the player.' : 'Video s přehrávačem YouTube — zvuk si můžete zapnout i vypnout přímo v přehrávači.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section style={{ maxWidth: '1200px', margin: '3rem auto 4rem', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="glass" style={{ padding: '2rem', borderRadius: '20px' }}>
            <i className="fa-solid fa-utensils" style={{ fontSize: '2.5rem', color: 'var(--accent-color)', marginBottom: '1rem' }}></i>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{isEn ? 'Authentic Asian Flavors' : 'Autentické chutě Asie'}</h2>
            <p style={{ color: 'var(--text-muted)' }}>{isEn ? 'Taste fresh sushi at Tsukiji market, famous Tokyo ramen, or sizzling Korean BBQ in Seoul.' : 'Ochutnejte pravé suši na rybím trhu Tsukiji, vyhlášený tokijský ramen nebo pikantní korejské BBQ v Soulu.'}</p>
          </div>
          <div className="glass" style={{ padding: '2rem', borderRadius: '20px' }}>
            <i className="fa-solid fa-map-location-dot" style={{ fontSize: '2.5rem', color: '#3498db', marginBottom: '1rem' }}></i>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{isEn ? 'Small Travel Groups' : 'Malé cestovatelské skupiny'}</h2>
            <p style={{ color: 'var(--text-muted)' }}>{isEn ? 'We travel in intimate groups of 8–12 people. No giant buses—just a personal approach and friendly atmosphere.' : 'Cestujeme v komorní skupině 8–12 osob. Žádné obří autobusy, ale osobní přístup a rodinná atmosféra.'}</p>
          </div>
          <div className="glass" style={{ padding: '2rem', borderRadius: '20px' }}>
            <i className="fa-solid fa-language" style={{ fontSize: '2.5rem', color: '#6c5ce7', marginBottom: '1rem' }}></i>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{isEn ? 'Language Preparation' : 'Jazyková průprava'}</h2>
            <p style={{ color: 'var(--text-muted)' }}>{isEn ? 'Learn essential Japanese and Korean phrases with our interactive 3D flashcards and free AI tutor.' : 'Naučte se základní fráze v japonštině i korejštině s našimi 3D výukovými kartičkami a AI asistentem zdarma.'}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
