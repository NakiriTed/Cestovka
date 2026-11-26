import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export function ContactPage() {
  const { currentLang } = useLanguage();
  const isEn = currentLang === 'en';
  const [sent, setSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await fetch("https://formsubmit.co/ajax/sykoratadeas2001@gmail.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            Jméno: name,
            Email: email,
            Zpráva: message,
            _subject: "Nový dotaz z webu Cestovky!"
        })
      });
      
      if (response.ok) {
        setSent(true);
      } else {
        alert("Něco se pokazilo při odesílání.");
      }
    } catch (error) {
      console.error(error);
      alert("Chyba připojení, zkuste to prosím později.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main style={{ maxWidth: '950px', margin: '0 auto', padding: '6rem 2rem 3rem' }}>
      <div className="glass" style={{ padding: '3rem', borderRadius: '24px' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>
          <i className="fa-solid fa-address-card" style={{ color: 'var(--accent-color)' }}></i> {isEn ? 'Contact Us' : 'Kontaktujte nás'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
          {isEn
            ? 'Have a question about our trips, custom itineraries, or anything else? Send us an e-mail or reach out on social media!'
            : 'Máte dotaz k zájezdům, vytvoření itineráře na míru nebo se chcete na cokoliv zeptat? Napište nám e-mail nebo přímo na sociálních sítích!'}
        </p>

        {/* Social Media Contact Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem', marginBottom: '3rem' }}>
          {/* Email */}
          <a 
            href="mailto:sykoratadeas2001@gmail.com" 
            target="_blank" 
            rel="noreferrer"
            className="glass" 
            style={{ padding: '1.5rem', borderRadius: '16px', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'transform 0.3s' }}
          >
            <i className="fa-solid fa-envelope fa-2x" style={{ color: '#ef233c', marginBottom: '0.8rem' }}></i>
            <strong style={{ fontSize: '1.1rem' }}>E-mail</strong>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.3rem' }}>sykoratadeas2001@gmail.com</span>
          </a>

          {/* Facebook */}
          <a 
            href="https://www.facebook.com/LeesinWrizz" 
            target="_blank" 
            rel="noreferrer"
            className="glass" 
            style={{ padding: '1.5rem', borderRadius: '16px', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'transform 0.3s' }}
          >
            <i className="fa-brands fa-facebook fa-2x" style={{ color: '#1877f2', marginBottom: '0.8rem' }}></i>
            <strong style={{ fontSize: '1.1rem' }}>Facebook</strong>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.3rem' }}>@LeesinWrizz</span>
          </a>

          {/* Instagram */}
          <a 
            href="https://www.instagram.com/rikejmited/" 
            target="_blank" 
            rel="noreferrer"
            className="glass" 
            style={{ padding: '1.5rem', borderRadius: '16px', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'transform 0.3s' }}
          >
            <i className="fa-brands fa-instagram fa-2x" style={{ color: '#e1306c', marginBottom: '0.8rem' }}></i>
            <strong style={{ fontSize: '1.1rem' }}>Instagram</strong>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.3rem' }}>@rikejmited</span>
          </a>

          {/* TikTok */}
          <a 
            href="https://www.tiktok.com/@nakirieriina?lang=cs-CZ" 
            target="_blank" 
            rel="noreferrer"
            className="glass" 
            style={{ padding: '1.5rem', borderRadius: '16px', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'transform 0.3s' }}
          >
            <i className="fa-brands fa-tiktok fa-2x" style={{ color: '#00f2fe', marginBottom: '0.8rem' }}></i>
            <strong style={{ fontSize: '1.1rem' }}>TikTok</strong>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.3rem' }}>@nakirieriina</span>
          </a>
        </div>

        {/* Contact Form */}
        <h2 style={{ fontSize: '1.6rem', marginBottom: '1.5rem' }}>
          <i className="fa-solid fa-paper-plane" style={{ color: 'var(--accent-color)' }}></i> {isEn ? 'Or send us a message via the form' : 'Nebo nám pošlete zprávu formulářem'}
        </h2>

        {sent ? (
          <div style={{ color: '#2ecc71', textAlign: 'center', padding: '3rem', background: 'rgba(46, 204, 113, 0.1)', borderRadius: '16px', border: '1px solid rgba(46, 204, 113, 0.3)' }}>
            <i className="fa-solid fa-circle-check fa-4x" style={{ marginBottom: '1rem' }}></i>
            <h2>{isEn ? 'Thank you for your message!' : 'Děkujeme za zprávu!'}</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>{isEn ? 'We have received your message and will reply within 24 hours.' : 'Zprávu jsme přijali a ozveme se vám do 24 hodin.'}</p>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label htmlFor="contact-name">{isEn ? 'Full Name' : 'Jméno a příjmení'}</label>
                <input id="contact-name" autoComplete="name" type="text" required placeholder="Jan Novák" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }} />
              </div>
              <div className="form-group">
                <label htmlFor="contact-email">{isEn ? 'E-mail' : 'E-mail'}</label>
                <input id="contact-email" autoComplete="email" type="email" required placeholder="jan@email.cz" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="contact-message">{isEn ? 'Message' : 'Text zprávy'}</label>
              <textarea id="contact-message" rows="5" required placeholder={isEn ? 'Write your question...' : 'Napište nám, co vás zajímá...'} value={message} onChange={(e) => setMessage(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }}></textarea>
            </div>

            <button type="submit" className="btn btn-primary" disabled={isSending} style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              {isSending ? (
                <><i className="fa-solid fa-spinner fa-spin"></i> {isEn ? 'Sending...' : 'Odesílám...'}</>
              ) : (
                <><i className="fa-solid fa-paper-plane"></i> {isEn ? 'Send Message' : 'Odeslat zprávu'}</>
              )}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
