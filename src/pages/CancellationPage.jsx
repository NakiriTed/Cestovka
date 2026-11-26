import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export function CancellationPage() {
  const { currentLang } = useLanguage();
  const isEn = currentLang === 'en';

  return (
    <main style={{ maxWidth: '950px', margin: '0 auto', padding: '6rem 2rem 3rem' }}>
      <div className="glass" style={{ padding: '3rem', borderRadius: '24px' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>
          <i className="fa-solid fa-scale-balanced" style={{ color: 'var(--accent-color)' }}></i> {isEn ? 'Terms & Cancellation Policy' : 'Obchodní a storno podmínky'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '2rem' }}>
          {isEn
            ? <>Valid for tours and travel services organized under the <strong>Ted’s Eastern World</strong> project.</>
            : <>Platné pro zájezdy a cestovatelské služby pořádané v rámci projektu <strong>Tedův východní svět</strong>.</>}
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '2rem 0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-color)' }}>
              <i className="fa-solid fa-file-signature"></i> {isEn ? '1. General Provisions & Contractual Relationship' : '1. Základní ustanovení a smluvní vztah'}
            </h2>
            <p style={{ marginTop: '0.5rem' }}>
              {isEn
                ? <>These General Terms and Conditions govern the contractual relationship between the traveler and the organizer <strong>Ted’s Eastern World</strong>. The contract is established upon submitting a reservation and its confirmation by the organizer together with payment.</>
                : <>Tyto všeobecné obchodní podmínky (VOP) upravují smluvní vztahy mezi zákazníkem (cestujícím) a pořadatelem zájezdů <strong>Tedův východní svět</strong>. Smluvní vztah vzniká odesláním rezervace a jejím potvrzením ze strany pořadatele společně se zaplacením zálohy.</>}
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-color)' }}>
              <i className="fa-solid fa-credit-card"></i> {isEn ? '2. Payment Terms & Reservations' : '2. Platební podmínky a rezervace'}
            </h2>
            <ul style={{ marginLeft: '1.2rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>{isEn ? 'Deposit:' : 'Záloha:'}</strong> {isEn ? 'A 30% deposit is due within 5 business days of booking confirmation.' : 'Při rezervaci zájezdu je zákazník povinen uhradit zálohu ve výši 30 % z celkové ceny zájezdu do 5 pracovních dnů od potvrzení.'}</li>
              <li><strong>{isEn ? 'Final Balance:' : 'Doplatek:'}</strong> {isEn ? 'The remaining 70% is due no later than 30 days prior to departure.' : 'Zbývajících 70 % ceny zájezdu je splatných nejpozději 30 dnů před plánovaným termínem odletu.'}</li>
              <li><strong>{isEn ? 'Payment Methods:' : 'Platební metody:'}</strong> {isEn ? 'Payments can be made online by card (Stripe) or via bank transfer with QR code.' : 'Platby lze provést online kartou (Stripe) nebo bankovním převodem s okamžitým generováním QR kódu.'}</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-color)' }}>
              <i className="fa-solid fa-ban"></i> {isEn ? '3. Cancellation Policy & Fees' : '3. Storno podmínky a poplatky za odstoupení'}
            </h2>
            <p style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
              {isEn
                ? 'The traveler may cancel the reservation in writing (by e-mail) at any time prior to departure. The cancellation fee is calculated based on the number of days remaining before departure:'
                : 'Zákazník má právo kdykoliv před zahájením zájezdu odstoupit od smlouvy. Odstoupení musí být provedeno písemně (e-mailem). Storno poplatek se počítá z celkové ceny zájezdu podle počtu dnů zbývajících do odletu:'}
            </p>

            <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid var(--accent-color)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><strong>{isEn ? '60 or more days before departure:' : '60 a více dní před odletem:'}</strong></div>
                <div style={{ color: '#2ecc71', fontWeight: 'bold' }}>{isEn ? '0% fee (100% refund)' : 'Storno poplatek 0 % (vracíme 100 % zálohy)'}</div>

                <div><strong>{isEn ? '30 to 59 days before departure:' : '30 až 59 dní před odletem:'}</strong></div>
                <div style={{ color: '#f39c12', fontWeight: 'bold' }}>{isEn ? '30% of total price' : 'Storno poplatek 30 % z celkové ceny'}</div>

                <div><strong>{isEn ? '14 to 29 days before departure:' : '14 až 29 dní před odletem:'}</strong></div>
                <div style={{ color: '#e67e22', fontWeight: 'bold' }}>{isEn ? '60% of total price' : 'Storno poplatek 60 % z celkové ceny'}</div>

                <div><strong>{isEn ? 'Less than 14 days before departure:' : 'Méně než 14 dní před odletem:'}</strong></div>
                <div style={{ color: '#e74c3c', fontWeight: 'bold' }}>{isEn ? '90% of total price' : 'Storno poplatek 90 % z celkové ceny'}</div>
              </div>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-color)' }}>
              <i className="fa-solid fa-shield-halved"></i> {isEn ? '4. Consumer Rights & Claims' : '4. Práva spotřebitele a reklamační řád'}
            </h2>
            <p style={{ marginTop: '0.5rem' }}>
              {isEn
                ? 'If the trip does not proceed according to the contract, the traveler has the right to file a claim without undue delay. The organizer will process any claim within 30 calendar days.'
                : 'Pokud zájezd neprobíhá podle smluvních podmínek, má zákazník právo na reklamaci. Reklamace musí být uplatněna bez zbytečného odkladu. Pořadatel se zavazuje reklamaci vyřídit nejpozději do 30 kalendářních dnů.'}
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-color)' }}>
              <i className="fa-solid fa-user-shield"></i> {isEn ? '5. Personal Data Protection (GDPR)' : '5. Ochrana osobních údajů (GDPR)'}
            </h2>
            <p style={{ marginTop: '0.5rem' }}>
              {isEn
                ? 'Your personal data (name, e-mail, phone number) is processed in accordance with GDPR solely for the purpose of managing your reservation and travel services.'
                : 'Vaše osobní údaje (jméno, e-mail, telefon, informace o cestujících) jsou zpracovávány v souladu s nařízením GDPR výhradně pro účely realizace rezervace a zajištění cestovních služeb. Údaje nikdy nepředáváme třetím stranám k marketingovým účelům.'}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
