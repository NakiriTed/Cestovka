import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export function KoreaGuidePage() {
  const { currentLang } = useLanguage();
  const isEn = currentLang === 'en';
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = isEn ? [
    { q: 'Do I need a K-ETA or visa for South Korea?', a: 'EU, CZ, and SK citizens do not need a tourist visa for stays up to 90 days. K-ETA is currently temporarily waived for Czech citizens; a valid passport is enough.' },
    { q: 'What is the official currency and how to pay?', a: 'The official currency is the South Korean Won (KRW). Credit and debit cards are accepted almost everywhere, and a T-money card is ideal for subways and buses.' },
    { q: 'How is safety and internet speed?', a: 'South Korea has some of the fastest 5G internet in the world and a very high level of public safety even at night.' },
    { q: 'Can I get around without speaking Korean?', a: 'Yes! Signs and announcements in Seoul and Busan are in English, and apps like Naver Map and our AI Tutor help everywhere.' },
    { q: 'What Korean dishes should I try?', a: 'Korean BBQ (Samgyeopsal), Korean fried chicken (Chimaek), tteokbokki, bibimbap, and fermented Kimchi.' }
  ] : [
    { q: 'Potřebuji pro cestu do Jižní Koreje K-ETA nebo vízum?', a: 'Pro cestující z ČR a SR do 90 dnů není vyžadováno klasické turistické vízum. Aktuálně je pro občany ČR dočasně pozastavena povinnost K-ETA, stačí mít platný pas.' },
    { q: 'Jaká je oficiální měna a jak platit?', a: 'Oficiální měnou je korejský won (KRW). V Koreji lze téměř všude platit bezhotovostně kreditními a debetními kartami, pro cestování MHD je ideální kartička T-money.' },
    { q: 'Jak je to s bezpečností a rychlostí internetu?', a: 'Jižní Korea disponuje nejrychlejším internetem na světě (5G je všude) a extrémně vysokou úrovní bezpečnosti i v nočních hodinách.' },
    { q: 'Jak se domluvím bez znalosti korejštiny?', a: 'V Soulu a Pusanu jsou nápisy a hlášení v angličtině. Korejci jsou velmi ochotní a aplikace Naver Map či Google Translate vám pomohou všude.' },
    { q: 'Jaké jídlo určitě vyzkoušet?', a: 'Korejské BBQ (Samgyeopsal), korejské smažené kuře (Chimaek), tteokbokki, bibimbap a kvašenou zeleninu Kimchi.' }
  ];

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 2rem 3rem' }}>
      
      {/* Title & Banner */}
      <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '3rem' }}>🇰🇷</span>
          <div>
            <h1 style={{ fontSize: '2.8rem', margin: 0 }}>{isEn ? 'South Korea (Daehan Minguk)' : 'Jižní Korea (Daehan Minguk)'}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0 }}>{isEn ? 'Republic of Korea • Home of K-pop, Technology & Royal Traditions' : 'Korejská republika • Kolébka K-popu, technologií a tradic'}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* Main Content Article Column */}
        <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px' }}>
          
          {/* Table of contents (Obsah) */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem 1.8rem', borderRadius: '16px', border: '1px solid var(--glass-border)', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', color: 'var(--accent-color)' }}><i className="fa-solid fa-list-ul"></i> {isEn ? 'Table of Contents' : 'Obsah článku'}</h2>
            <ol style={{ marginLeft: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '0.95rem' }}>
              <li><a href="#prehled" style={{ color: 'inherit', textDecoration: 'none' }}>{isEn ? '1. Overview & History' : 'Základní přehled & Historie'}</a></li>
              <li><a href="#geografie" style={{ color: 'inherit', textDecoration: 'none' }}>{isEn ? '2. Geography, Cities & Jeju Island' : 'Geografie, Města & Ostrov Jeju'}</a></li>
              <li><a href="#jazyk-kultura" style={{ color: 'inherit', textDecoration: 'none' }}>{isEn ? '3. Hangul Alphabet & Korean Wave (Hallyu)' : 'Písmo Hangeul, K-Pop & Tradice'}</a></li>
              <li><a href="#gastronomie" style={{ color: 'inherit', textDecoration: 'none' }}>{isEn ? '4. Korean Gastronomy & Street Food' : 'Korejská gastronomie & Street Food'}</a></li>
              <li><a href="#faq" style={{ color: 'inherit', textDecoration: 'none' }}>{isEn ? '5. Frequently Asked Questions (FAQ)' : 'Často kladené otázky (FAQ)'}</a></li>
            </ol>
          </div>

          {/* Section 1 */}
          <section id="prehled" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-color)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
              {isEn ? '1. Overview & History' : '1. Základní přehled & Historie'}
            </h2>
            <p style={{ marginTop: '1rem', lineHeight: '1.8' }}>
              {isEn
                ? <><strong>South Korea (Republic of Korea)</strong> occupies the southern half of the Korean Peninsula. In just a few decades it transformed into a global technological powerhouse (the Miracle on the Han River) and a leader in pop-culture, fashion, and cosmetics.</>
                : <><strong>Jižní Korea (Korejská republika)</strong> leží na jižní polovině Korejského poloostrova. Z původně válkou zničené země se během několika desetiletí stal globální technologický gigant (zázrak na řece Han) a lídr v pop-kultuře, módě a kosmetice.</>}
            </p>
            <p style={{ marginTop: '0.8rem', lineHeight: '1.8' }}>
              {isEn
                ? <>Korea’s history spans thousands of years through the Goryeo and Joseon dynasties, leaving behind magnificent royal palaces (such as Gyeongbokgung) and mountain Buddhist temples.</>
                : <>Historie země sahá tisíce let do minulosti přes slavné dynastie Goryeo a Joseon, které po sobě zanechaly nádherné královské paláce (např. Gyeongbokgung) a buddhistické chrámy.</>}
            </p>
          </section>

          {/* Section 2 */}
          <section id="geografie" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-color)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
              {isEn ? '2. Geography, Cities & Nature' : '2. Geografie, Města & Příroda'}
            </h2>
            <p style={{ marginTop: '1rem', lineHeight: '1.8' }}>
              {isEn
                ? <>South Korea combines futuristic skyscrapers with granite mountain national parks and the volcanic island of Jeju in the south.</>
                : <>Jižní Korea kombinuje mrakodrapy s národními parky plnými žulových hor a sopečným ostrovem Jeju na jihu.</>}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1.2rem' }}>
              <div className="glass" style={{ padding: '1rem', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#ff66b2', margin: '0 0 0.4rem' }}>🏙️ {isEn ? 'Seoul' : 'Soul (Seoul)'}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{isEn ? 'Capital city of 10M people blending Joseon royal palaces with modern Gangnam and Hongdae.' : 'Hlavní město s 10 mil. obyvatel, spojením paláců Joseon a ultra-moderních čtvrtí Gangnam a Hongdae.'}</p>
              </div>
              <div className="glass" style={{ padding: '1rem', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#3498db', margin: '0 0 0.4rem' }}>🌊 {isEn ? 'Busan' : 'Pusan (Busan)'}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{isEn ? 'Coastal metropolis famous for Haeundae Beach, Jagalchi Fish Market, and Gamcheon Village.' : 'Přístavní metropole s vyhlášenou pláží Haeundae, rybím trhem Jagalchi a vesnicí Gamcheon.'}</p>
              </div>
              <div className="glass" style={{ padding: '1rem', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#2ecc71', margin: '0 0 0.4rem' }}>🌋 {isEn ? 'Jeju Island' : 'Ostrov Čedžu (Jeju)'}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{isEn ? 'UNESCO volcanic paradise with Mt. Hallasan (1,947 m), waterfalls, and lava tubes.' : 'Sopečný ráj zapsaný na seznamu UNESCO s nejvyšší horou Hallasan (1 947 m) a lávovými jeskyněmi.'}</p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="jazyk-kultura" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-color)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
              {isEn ? '3. Hangul Alphabet & Korean Wave (Hallyu)' : '3. Písmo Hangeul & Korejská vlna (Hallyu)'}
            </h2>
            <p style={{ marginTop: '1rem', lineHeight: '1.8' }}>
              {isEn
                ? <>The official language is <strong>Korean (Hangug-eo)</strong>. Its unique alphabet, <strong>Hangul (한글)</strong>, was created in the 15th century by King Sejong the Great and is renowned as one of the most logical writing systems in the world.</>
                : <>Oficiálním jazykem je <strong>korejština (Hangug-eo)</strong>. Zcela unikátní je abeceda <strong>Hangeul (한글)</strong>, vytvořená v 15. století králem Sejongem Velikým, považovaná za nejvědečtější a nejsnadněji naučitelné písmo světa.</>}
            </p>
            <p style={{ marginTop: '0.8rem', lineHeight: '1.8' }}>
              {isEn
                ? <>The <strong>Hallyu (Korean Wave)</strong> phenomenon conquered the world through K-pop, K-dramas, and K-beauty.</>
                : <>Fenomén <strong>Hallyu (Korejská vlna)</strong> dobyl svět prostřednictvím K-popu (BTS, Blackpink), korejských seriálů (K-dramas) a kosmetiky K-beauty.</>}
            </p>

            <div style={{ marginTop: '1rem' }}>
              <Link to="/korejsky" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                <i className="fa-solid fa-graduation-cap"></i> {isEn ? 'Practice Korean Phrases & AI Tutor' : 'Procvičit si korejská slovíčka a výslovnost'}
              </Link>
            </div>
          </section>

          {/* Section 4 */}
          <section id="gastronomie" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-color)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
              {isEn ? '4. Korean Gastronomy & Street Food' : '4. Korejská gastronomie & Street Food'}
            </h2>
            <p style={{ marginTop: '1rem', lineHeight: '1.8' }}>
              {isEn
                ? <>Korean cuisine is bold, flavorful, and healthy thanks to fermentation. Every meal comes with <i>Banchan</i> side dishes and traditional fermented <strong>Kimchi</strong>, while night markets offer unforgettable street food.</>
                : <>Korejská kuchyně je výrazná, kořeněná a neobyčejně zdravá díky fermentovaným potravinám. Neodmyslitelnou součástí každého jídla jsou misky příloh <i>Banchan</i> a tradiční fermentované zelí <strong>Kimchi</strong>. Neuvěřitelný zážitek nabízí noční trhy se street foodem.</>}
            </p>
          </section>

          {/* Section 5: FAQ */}
          <section id="faq">
            <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-color)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
              {isEn ? '5. Frequently Asked Questions (FAQ)' : '5. Často kladené otázky o Jižní Koreji (FAQ)'}
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
          <h2 style={{ fontSize: '1.3rem', textAlign: 'center', marginBottom: '1rem', color: 'var(--accent-color)' }}>
            🇰🇷 {isEn ? 'South Korea' : 'Jižní Korea'}
          </h2>
          
          <div style={{ height: '160px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem', border: '1px solid var(--glass-border)' }}>
            <img src="https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=800&q=80" alt="Soul Gyeongbokgung" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', lineHeight: '1.6' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}><strong>{isEn ? 'Capital:' : 'Hlavní město:'}</strong></td>
                <td style={{ textAlign: 'right' }}>{isEn ? 'Seoul' : 'Soul (Seoul)'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}><strong>{isEn ? 'Population:' : 'Obyvatelstvo:'}</strong></td>
                <td style={{ textAlign: 'right' }}>{isEn ? '51.7 million' : '51,7 milionu'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}><strong>{isEn ? 'Area:' : 'Rozloha:'}</strong></td>
                <td style={{ textAlign: 'right' }}>100 210 km²</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}><strong>{isEn ? 'Official language:' : 'Úřední jazyk:'}</strong></td>
                <td style={{ textAlign: 'right' }}>{isEn ? 'Korean (Hangul)' : 'Korejština (Hangeul)'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}><strong>{isEn ? 'Currency:' : 'Měna:'}</strong></td>
                <td style={{ textAlign: 'right' }}>{isEn ? 'South Korean Won (KRW, ₩)' : 'Korejský won (KRW, ₩)'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}><strong>{isEn ? 'Religion:' : 'Náboženství:'}</strong></td>
                <td style={{ textAlign: 'right' }}>{isEn ? 'Christianity, Buddhism' : 'Křesťanství, buddhismus'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}><strong>{isEn ? 'Government:' : 'Státní zřízení:'}</strong></td>
                <td style={{ textAlign: 'right' }}>{isEn ? 'Presidential Republic' : 'Prezidentská republika'}</td>
              </tr>
              <tr>
                <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}><strong>{isEn ? 'Calling code:' : 'Předvolba:'}</strong></td>
                <td style={{ textAlign: 'right' }}>+82</td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: '1.5rem' }}>
            <Link to="/planner" className="btn btn-primary" style={{ width: '100%', textDecoration: 'none', textAlign: 'center', padding: '0.7rem' }}>
              <i className="fa-solid fa-plane-departure"></i> {isEn ? 'View Trips to South Korea' : 'Zobrazit zájezdy do Koreje'}
            </Link>
          </div>
        </aside>

      </div>
    </main>
  );
}
