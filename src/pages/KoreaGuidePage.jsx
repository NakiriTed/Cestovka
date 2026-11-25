import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export function KoreaGuidePage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    { q: 'Potřebuji pro cestu do Jižní Koreje K-ETA nebo vízum?', a: 'Pro cestující z ČR a SR do 90 dnů není vyžadováno klasické turistické vízum. Aktuálně je pro občané ČR dočasně pozastavena povinnost K-ETA, stačí mít platný pas.' },
    { q: 'Jaká je oficiální měna a jak platit?', a: 'Oficiální měnou je Korejský won (KRW). V Koreji lze téměř všude platit bezhotovostně kreditními a debetními kartami, pro cestování MHD je ideální kartička T-money.' },
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
            <h1 style={{ fontSize: '2.8rem', margin: 0 }}>Jižní Korea (Daehan Minguk)</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0 }}>Korejská republika &bull; Kolébka K-popu, technologií a tradic</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* Main Content Article Column */}
        <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px' }}>
          
          {/* Table of contents (Obsah) */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem 1.8rem', borderRadius: '16px', border: '1px solid var(--glass-border)', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', color: 'var(--accent-color)' }}><i className="fa-solid fa-list-ul"></i> Obsah článku</h3>
            <ol style={{ marginLeft: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '0.95rem' }}>
              <li><a href="#prehled" style={{ color: 'inherit', textDecoration: 'none' }}>Základní přehled & Historie</a></li>
              <li><a href="#geografie" style={{ color: 'inherit', textDecoration: 'none' }}>Geografie, Města & Ostrov Jeju</a></li>
              <li><a href="#jazyk-kultura" style={{ color: 'inherit', textDecoration: 'none' }}>Písmo Hangeul, K-Pop & Tradice</a></li>
              <li><a href="#gastronomie" style={{ color: 'inherit', textDecoration: 'none' }}>Korejská gastronomie & Street Food</a></li>
              <li><a href="#faq" style={{ color: 'inherit', textDecoration: 'none' }}>Často kladené otázky (FAQ)</a></li>
            </ol>
          </div>

          {/* Section 1 */}
          <section id="prehled" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-color)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
              1. Základní přehled & Historie
            </h2>
            <p style={{ marginTop: '1rem', lineHeight: '1.8' }}>
              <strong>Jižní Korea (Korejská republika)</strong> leží na jižní polovině Korejského poloostrova. Z původně válkou zničené země se během několika desetiletí stal globální technologický gigant (zázrak na řece Han) a lídr v pop-kultuře, módě a kosmetice.
            </p>
            <p style={{ marginTop: '0.8rem', lineHeight: '1.8' }}>
              Historie země sahá tisíce let do minulosti přes slavné dynastie Goryeo a Joseon, které po sobě zanechaly nádherné královské paláce (např. Gyeongbokgung) a buddhistické chrámy.
            </p>
          </section>

          {/* Section 2 */}
          <section id="geografie" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-color)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
              2. Geografie, Města & Příroda
            </h2>
            <p style={{ marginTop: '1rem', lineHeight: '1.8' }}>
              Jižní Korea kombinuje mrakodrapy s národními parky plnými žulových hor a sopečným ostrovem Jeju na jihu.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1.2rem' }}>
              <div className="glass" style={{ padding: '1rem', borderRadius: '12px' }}>
                <h4 style={{ color: '#ff66b2', margin: '0 0 0.4rem' }}>🏙️ Soul (Seoul)</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Hlavní město s 10 mil. obyvatel, spojením paláců Joseon a ultra-moderních čtvrtí Gangnam a Hongdae.</p>
              </div>
              <div className="glass" style={{ padding: '1rem', borderRadius: '12px' }}>
                <h4 style={{ color: '#3498db', margin: '0 0 0.4rem' }}>🌊 Pusan (Busan)</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Přístavní metropole s vyhlášenou pláží Haeundae, rybím trhem Jagalchi a vesnicí Gamcheon.</p>
              </div>
              <div className="glass" style={{ padding: '1rem', borderRadius: '12px' }}>
                <h4 style={{ color: '#2ecc71', margin: '0 0 0.4rem' }}>🌋 Ostrov Čedžu (Jeju)</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Sopečný ráj zapapsaný v UNESCO s nejvyšší horou Hallasan (1 947 m) a lávovými jeskyněmi.</p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="jazyk-kultura" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-color)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
              3. Písmo Hangeul & Korejská vlna (Hallyu)
            </h2>
            <p style={{ marginTop: '1rem', lineHeight: '1.8' }}>
              Oficiálním jazykem je <strong>korejština (Hangug-eo)</strong>. Zcela unikátní je abeceda <strong>Hangeul (한글)</strong>, vytvořená v 15. století králem Sejongem Velikým, považovaná za nejvědečtější a nejsnadněji naučitelné písmo světa.
            </p>
            <p style={{ marginTop: '0.8rem', lineHeight: '1.8' }}>
              Fenomén <strong>Hallyu (Korejská vlna)</strong> dobyl svět prostřednictvím K-popu (BTS, Blackpink), korejských seriálů (K-dramas) a kosmetiky K-beauty.
            </p>

            <div style={{ marginTop: '1rem' }}>
              <Link to="/korejsky" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                <i className="fa-solid fa-graduation-cap"></i> Procvičit si korejská slovíčka a výslovnost
              </Link>
            </div>
          </section>

          {/* Section 4 */}
          <section id="gastronomie" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-color)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
              4. Korejská gastronomie & Street Food
            </h2>
            <p style={{ marginTop: '1rem', lineHeight: '1.8' }}>
              Korejská kuchyně je výrazná, kořeněná a neobyčejně zdravá díky fermentovaným potravinám. Neodmyslitelnou součástí každého jídla jsou misky příloh <i>Banchan</i> a tradiční fermentované zelí <strong>Kimchi</strong>. Neuvěřitelný zážitek nabízí noční trhy se street foodem.
            </p>
          </section>

          {/* Section 5: FAQ */}
          <section id="faq">
            <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-color)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
              5. Často kladené otázky o Jižní Koreji (FAQ)
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
            🇰🇷 Jižní Korea
          </h3>
          
          <div style={{ height: '160px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem', border: '1px solid var(--glass-border)' }}>
            <img src="https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=800&q=80" alt="Soul Gyeongbokgung" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', lineHeight: '1.6' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}><strong>Hlavní město:</strong></td>
                <td style={{ textAlign: 'right' }}>Soul (Seoul)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}><strong>Obyvatelstvo:</strong></td>
                <td style={{ textAlign: 'right' }}>51,7 miliónů</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}><strong>Rozloha:</strong></td>
                <td style={{ textAlign: 'right' }}>100 210 km²</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}><strong>Úřední jazyk:</strong></td>
                <td style={{ textAlign: 'right' }}>Korejština (Hangeul)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}><strong>Měna:</strong></td>
                <td style={{ textAlign: 'right' }}>Korejský won (KRW, ₩)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}><strong>Náboženství:</strong></td>
                <td style={{ textAlign: 'right' }}>Křesťanství, Buddhismus</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}><strong>Státní zřízení:</strong></td>
                <td style={{ textAlign: 'right' }}>Prezidentská republika</td>
              </tr>
              <tr>
                <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}><strong>Předvolba:</strong></td>
                <td style={{ textAlign: 'right' }}>+82</td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: '1.5rem' }}>
            <Link to="/planner" className="btn btn-primary" style={{ width: '100%', textDecoration: 'none', textAlign: 'center', padding: '0.7rem' }}>
              <i className="fa-solid fa-plane-departure"></i> Zobrazit zájezdy do Koreje
            </Link>
          </div>
        </aside>

      </div>
    </main>
  );
}
