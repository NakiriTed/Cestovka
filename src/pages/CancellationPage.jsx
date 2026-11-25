import React from 'react';

export function CancellationPage() {
  return (
    <main style={{ maxWidth: '950px', margin: '0 auto', padding: '6rem 2rem 3rem' }}>
      <div className="glass" style={{ padding: '3rem', borderRadius: '24px' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>
          <i className="fa-solid fa-scale-balanced" style={{ color: 'var(--accent-color)' }}></i> Obchodní podmínky & Storno práva
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '2rem' }}>
          Platné pro zájezdy a cestovatelské služby pořádané v rámci projektu <strong>Tedův Východní Svět</strong>.
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '2rem 0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Section 1 */}
          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-color)' }}>
              <i className="fa-solid fa-file-signature"></i> 1. Základní ustanovení & Smluvní vztah
            </h2>
            <p style={{ marginTop: '0.5rem' }}>
              Tyto všeobecné obchodní podmínky (VOP) upravují smluvní vztahy mezi zákazníkem (cestujícím) a pořadatelem zájezdů <strong>Tedův Východní Svět</strong>. Smluvní vztah vzniká odesláním rezervace a jejím potvrzením ze strany pořadatele společně se zaplacením zálohy.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-color)' }}>
              <i className="fa-solid fa-credit-card"></i> 2. Platební podmínky & Rezervace
            </h2>
            <ul style={{ marginLeft: '1.2rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Záloha:</strong> Při rezervaci zájezdu je zákazník povinen uhradit zálohu ve výši 30 % z celkové ceny zájezdu do 5 pracovních dnů od potvrzení.</li>
              <li><strong>Doplatek:</strong> Zbývajících 70 % ceny zájezdu je splatných nejpozději 30 dnů před plánovaným termínem odletu.</li>
              <li><strong>Platební metody:</strong> Platby lze provést online kartou (Stripe) nebo bankovním převodem s okamžitým generováním QR kódu.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-color)' }}>
              <i className="fa-solid fa-ban"></i> 3. Storno podmínky & Poplatky za odstoupení
            </h2>
            <p style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
              Zákazník má právo kdykoliv před zahájením zájezdu odstoupit od smlouvy. Odstoupení musí být provedeno písemně (e-mailem). Storno poplatek se počítá z celkové ceny zájezdu podle počtu dnů zbývajících do odletu:
            </p>

            <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid var(--accent-color)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <strong>Více než 60 dní před odletem:</strong>
                </div>
                <div style={{ color: '#2ecc71', fontWeight: 'bold' }}>
                  Storno poplatek 0 % (vracíme 100 % zálohy)
                </div>

                <div>
                  <strong>30 až 59 dní před odletem:</strong>
                </div>
                <div style={{ color: '#f39c12', fontWeight: 'bold' }}>
                  Storno poplatek 30 % z celkové ceny
                </div>

                <div>
                  <strong>14 až 29 dní před odletem:</strong>
                </div>
                <div style={{ color: '#e67e22', fontWeight: 'bold' }}>
                  Storno poplatek 60 % z celkové ceny
                </div>

                <div>
                  <strong>Méně než 14 dní před odletem:</strong>
                </div>
                <div style={{ color: '#e74c3c', fontWeight: 'bold' }}>
                  Storno poplatek 90 % z celkové ceny
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-color)' }}>
              <i className="fa-solid fa-shield-halved"></i> 4. Práva spotřebitele & Reklamační řád
            </h2>
            <p style={{ marginTop: '0.5rem' }}>
              Pokud zájezd neprobíhá podle smluvních podmínek, má zákazník právo na reklamaci. Reklamace musí být uplatněna bez zbytečného odkladu, nejpozději však do 30 dnů od skončení zájezdu. Pořadatel se zavazuje reklamaci vyřídit nejpozději do 30 kalendářních dnů.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-color)' }}>
              <i className="fa-solid fa-user-shield"></i> 5. Ochrana osobních údajů (GDPR)
            </h2>
            <p style={{ marginTop: '0.5rem' }}>
              Vaše osobní údaje (jméno, e-mail, telefon, informace o cestujících) jsou zpracovávány v souladu s nařízením GDPR výhradně pro účely realizace rezervace a zajištění cestovních služeb. Údaje nikdy nepředáváme třetím stranám k marketingovým účelům.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
