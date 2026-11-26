import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export function JapanGuidePage() {
  const { t, currentLang } = useLanguage();
  const isEn = currentLang === 'en';
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = isEn ? [
    { q: 'Do I need a visa to travel to Japan?', a: 'EU, CZ, and SK citizens do not need a visa for tourist stays up to 90 days. A valid passport is sufficient.' },
    { q: 'How do payments work in Japan? Are cards accepted?', a: 'The official currency is the Japanese Yen (JPY). Cards are accepted in most stores and hotels, though having cash from 7-Eleven ATMs is recommended for smaller shrines and ramen stalls.' },
    { q: 'Is Japan safe?', a: 'Japan is one of the safest countries in the world with minimal crime, even late at night.' },
    { q: 'How to get mobile internet while traveling?', a: 'The best option is buying an eSIM or renting a Pocket Wi-Fi router at Haneda or Narita airport.' },
    { q: 'What are the essential etiquette rules?', a: 'Do not talk on the phone on trains, never leave tips (it is considered rude), and take off your shoes when entering traditional accommodations.' }
  ] : [
    { q: 'Potřebuji pro cestu do Japonska vízum?', a: 'Občané ČR a SR nepotřebují pro turistický pobyt do 90 dnů žádné vízum. Stačí vám platný cestovní pas (platnost min. po dobu pobytu).' },
    { q: 'Jak se v Japonsku platí? Berou všude karty?', a: 'Oficiální měnou je japonský jen (JPY). Japonsko je stále poměrně hotovostní společnost, i když na větších místech karty berou. Doporučujeme mít u sebe vždy dostatek hotovosti (vybrat lze v 7-Eleven bankomatech).' },
    { q: 'Je v Japonsku bezpečno?', a: 'Japonsko patří mezi nejbezpečnější země světa s minimální kriminalitou. Můžete se bez obav pohybovat po nocích v jakékoliv čtvrti.' },
    { q: 'Jak je to s internetem na cestách?', a: 'Nejlepší volbou je zakoupení e-SIM karty nebo pronájem Pocket Wi-Fi routeru přímo na letišti (Haneda/Narita).' },
    { q: 'Jaká jsou základní pravidla etikety?', a: 'V MHD se netelefonuje a mluví potichu. Spropitné se nikde nedává (bude považováno za chybu nebo urážku). V hotelu či ryokanu se přezouvá do papučí.' }
  ];

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 2rem 3rem' }}>
      
      {/* Title & Banner */}
      <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '3rem' }}>🇯🇵</span>
          <div>
            <h1 style={{ fontSize: '2.8rem', margin: 0 }}>{t('japanGuide.title', 'Japonsko (Nippon / Nihon)')}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0 }}>{t('japanGuide.subtitle', 'Země vycházejícího slunce • Ostrovní stát ve Východní Asii')}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* Main Content Article Column */}
        <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px' }}>
          
          {/* Table of contents (Obsah) */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem 1.8rem', borderRadius: '16px', border: '1px solid var(--glass-border)', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', color: 'var(--accent-color)' }}><i className="fa-solid fa-list-ul"></i> {t('japanGuide.toc', 'Obsah článku')}</h3>
            <ol style={{ marginLeft: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '0.95rem' }}>
              <li><a href="#prehled" style={{ color: 'inherit', textDecoration: 'none' }}>{t('japanGuide.toc1', 'Základní přehled & Historie')}</a></li>
              <li><a href="#geografie" style={{ color: 'inherit', textDecoration: 'none' }}>{t('japanGuide.toc2', 'Geografie, Města & Příroda')}</a></li>
              <li><a href="#jazyk-nabozenstvi" style={{ color: 'inherit', textDecoration: 'none' }}>{t('japanGuide.toc3', 'Jazyk & Náboženství')}</a></li>
              <li><a href="#gastronomie" style={{ color: 'inherit', textDecoration: 'none' }}>{t('japanGuide.toc4', 'Japonská gastronomie')}</a></li>
              <li><a href="#faq" style={{ color: 'inherit', textDecoration: 'none' }}>{t('japanGuide.toc5', 'Často kladené otázky (FAQ)')}</a></li>
            </ol>
          </div>

          {/* Section 1 */}
          <section id="prehled" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-color)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
              {isEn ? '1. Overview & History' : '1. Základní přehled & Historie'}
            </h2>
            <p style={{ marginTop: '1rem', lineHeight: '1.8' }}>
              {isEn
                ? <><strong>Japan</strong> is a constitutional monarchy formed by four main islands (Honshu, Hokkaido, Kyushu, Shikoku) and thousands of smaller islands. It is a global leader in technology and pop-culture while carefully preserving centuries-old traditions.</>
                : <><strong>Japonsko</strong> je císařská konstituční monarchie tvořená řetězcem čtyř hlavních ostrovů (Honšú, Hokkaidó, Kjúšú, Šikoku) a tisíci menších ostrůvků. Je světovou velmocí v technologiích, automobilovém průmyslu a pop-kultuře, přičemž si úzkostlivě chrání své staleté tradice.</>}
            </p>
            <p style={{ marginTop: '0.8rem', lineHeight: '1.8' }}>
              {isEn
                ? <>Japanese history spans the famous era of samurai and shogunates, the <i>Sakoku</i> isolation period, and the Meiji modernization reforms, building one of the most advanced and cleanest nations on Earth.</>
                : <>Historie Japonska zahrnuje slavnou éru samurajů a šógunátů, období izolace <i>Sakoku</i>, meidžiovské modernizační reformy až po vybudování jednoho z nejvyspělejších a nejčistších států planety.</>}
            </p>
          </section>

          {/* Section 2 */}
          <section id="geografie" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-color)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
              {isEn ? '2. Geography, Cities & Nature' : '2. Geografie, Města & Příroda'}
            </h2>
            <p style={{ marginTop: '1rem', lineHeight: '1.8' }}>
              {isEn
                ? <>Over 70% of Japan is mountainous and forested. Its highest peak is the sacred volcano <strong>Mount Fuji (3,776 m)</strong>.</>
                : <>Povrch Japonska je ze 70 % hornatý a pokrytý lesy. Nejvyšším vrcholem je ikonická posvátná sopka <strong>hora Fudži (3 776 m n. m.)</strong>.</>}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1.2rem' }}>
              <div className="glass" style={{ padding: '1rem', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#ff66b2', margin: '0 0 0.4rem' }}>🗼 {isEn ? 'Tokyo' : 'Tokio'}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{isEn ? 'The world’s largest metropolitan area (37M people). Hub of technology and pop-culture.' : 'Nejlidnatější metropolitní oblast světa (37 mil. obyvatel). Centrum obchodu a pop-kultury.'}</p>
              </div>
              <div className="glass" style={{ padding: '1rem', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#ef233c', margin: '0 0 0.4rem' }}>⛩️ {isEn ? 'Kyoto' : 'Kjóto'}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{isEn ? 'Former imperial capital with 2,000 temples, Arashiyama bamboo grove, and Gion geisha district.' : 'Bývalé císařské hlavní město s 2 000 chrámy, Bambusovým hájem a čtvrtí gejš Gion.'}</p>
              </div>
              <div className="glass" style={{ padding: '1rem', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#3498db', margin: '0 0 0.4rem' }}>🍡 {isEn ? 'Osaka' : 'Ósaka'}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{isEn ? 'The culinary heart of Japan, Osaka Castle, and the vibrant neon streets of Dotonbori.' : 'Kulinářské srdce Japonska, hrad Ósaka a rušná světelná čtvrť Dotonbori.'}</p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="jazyk-nabozenstvi" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-color)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
              {isEn ? '3. Language & Religion' : '3. Jazyk & Náboženství'}
            </h2>
            <p style={{ marginTop: '1rem', lineHeight: '1.8' }}>
              {isEn
                ? <>The official language is <strong>Japanese (Nihongo)</strong>, which uses a combination of three writing systems: <i>Hiragana</i>, <i>Katakana</i>, and <i>Kanji</i> characters.</>
                : <>Oficiálním jazykem je <strong>japonština (Nihongo)</strong>, která využívá kombinaci tří písemných soustav: <i>Hiragana</i>, <i>Katakana</i> a čínských znaků <i>Kandži</i>.</>}
            </p>
            <p style={{ marginTop: '0.8rem', lineHeight: '1.8' }}>
              {isEn
                ? <>Japanese culture harmoniously blends <strong>Shinto</strong> (nature spirits Kami) and <strong>Buddhism</strong>.</>
                : <>Japonci nepatří k dogmaticky náboženským národům, ale zároveň praktikují <strong>šintoismus</strong> (přírodní kult animistických duchů Kami) a <strong>buddhismus</strong>.</>}
            </p>

            <div style={{ marginTop: '1rem' }}>
              <Link to="/japonsky" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                <i className="fa-solid fa-graduation-cap"></i> {isEn ? 'Practice Japanese Phrases & AI Tutor' : 'Vyzkoušet výuku slovíček v naší aplikaci'}
              </Link>
            </div>
          </section>

          {/* Section 4 */}
          <section id="gastronomie" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-color)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
              {isEn ? '4. Japanese Gastronomy (Washoku)' : '4. Japonská gastronomie (Washoku)'}
            </h2>
            <p style={{ marginTop: '1rem', lineHeight: '1.8' }}>
              {isEn
                ? <>Japanese cuisine (Washoku) is listed as UNESCO Intangible Cultural Heritage, built on fresh ingredients, presentation, and <i>Umami</i> flavor. Must-try dishes include <strong>Sushi, Ramen, Tempura, Takoyaki, and Matcha tea</strong>.</>
                : <>Japonská kuchyně (Washoku) je zapsána na seznamu nehmotného dědictví UNESCO. Je založena na absolutní čerstvosti surovin, estetické prezentaci a chuti <i>Umami</i>. Mezi nejznámější pokrmy patří <strong>suši, ramen, tempura, takoyaki a čaj matcha</strong>.</>}
            </p>
          </section>

          {/* Section 5: FAQ */}
          <section id="faq">
            <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-color)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
              {isEn ? '5. Frequently Asked Questions (FAQ)' : '5. Často kladené otázky o Japonsku (FAQ)'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {faqs.map((faq, idx) => (
                <div key={idx} className="glass" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                  <button 
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: '100%',
                      padding: '1rem 1.2rem',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-main)',
                      fontSize: '1.05rem',
                      fontWeight: 600,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span><i className="fa-solid fa-circle-question" style={{ color: 'var(--accent-color)', marginRight: '8px' }}></i> {faq.q}</span>
                    <i className={`fa-solid ${openFaq === idx ? 'fa-chevron-up' : 'fa-chevron-down'}`} style={{ color: 'var(--text-muted)' }}></i>
                  </button>

                  {openFaq === idx && (
                    <div style={{ padding: '0 1.2rem 1.2rem', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Wikipedia Infobox Sidebar */}
        <aside className="glass" style={{ padding: '1.5rem', borderRadius: '20px', borderTop: '4px solid var(--accent-color)' }}>
          <h3 style={{ fontSize: '1.3rem', textAlign: 'center', marginBottom: '1rem', color: 'var(--accent-color)' }}>
            🇯🇵 Japonsko
          </h3>
          
          <div style={{ height: '160px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem', border: '1px solid var(--glass-border)' }}>
            <img src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80" alt="Tokio Skyline" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', lineHeight: '1.6' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}><strong>{t('japanGuide.capitalLabel', 'Hlavní město:')}</strong></td>
                <td style={{ textAlign: 'right' }}>{t('japanGuide.capitalValue', 'Tokio (Tokyo)')}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}><strong>{t('japanGuide.populationLabel', 'Obyvatelstvo:')}</strong></td>
                <td style={{ textAlign: 'right' }}>{t('japanGuide.populationValue', '124,5 miliónů')}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}><strong>{t('japanGuide.areaLabel', 'Rozloha:')}</strong></td>
                <td style={{ textAlign: 'right' }}>{t('japanGuide.areaValue', '377 975 km²')}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}><strong>{t('japanGuide.langLabel', 'Úřední jazyk:')}</strong></td>
                <td style={{ textAlign: 'right' }}>{t('japanGuide.langValue', 'Japonština')}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}><strong>{t('japanGuide.currencyLabel', 'Měna:')}</strong></td>
                <td style={{ textAlign: 'right' }}>{t('japanGuide.currencyValue', 'Japonský jen (JPY, ¥)')}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}><strong>{t('japanGuide.religionLabel', 'Náboženství:')}</strong></td>
                <td style={{ textAlign: 'right' }}>{t('japanGuide.religionValue', 'Šintoismus, Buddhismus')}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}><strong>{t('japanGuide.govLabel', 'Státní zřízení:')}</strong></td>
                <td style={{ textAlign: 'right' }}>{t('japanGuide.govValue', 'Konstituční monarchie')}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}><strong>{t('japanGuide.headLabel', 'Hlava státu:')}</strong></td>
                <td style={{ textAlign: 'right' }}>{t('japanGuide.headValue', 'Císař Naruhito')}</td>
              </tr>
              <tr>
                <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}><strong>{t('japanGuide.codeLabel', 'Předvolba:')}</strong></td>
                <td style={{ textAlign: 'right' }}>{t('japanGuide.codeValue', '+81')}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: '1.5rem' }}>
            <Link to="/planner" className="btn btn-primary" style={{ width: '100%', textDecoration: 'none', textAlign: 'center', padding: '0.7rem' }}>
              <i className="fa-solid fa-plane-departure"></i> {t('japanGuide.btnTours', 'Zobrazit zájezdy do Japonska')}
            </Link>
          </div>
        </aside>

      </div>
    </main>
  );
}
