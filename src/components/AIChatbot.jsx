import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export function AIChatbot() {
  const location = useLocation();
  const { currentLang } = useLanguage();
  const isEn = currentLang === 'en';
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Ahoj! Jsem Tedův AI asistent. Zeptej se mě na cokoliv ohledně cesty do Japonska nebo Koreje! 🌸' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Removed early return from here

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

  // Hide chatbot on admin page (must be after hooks)
  if (location.pathname.includes('/admin')) return null;

  // Smart Local Fallback Knowledge Base
  const getLocalResponse = (q) => {
    const query = q.toLowerCase();
    if (query.includes('víz') || query.includes('viz')) {
      return 'Do Japonska i Jižní Koreje cestují občané ČR i SR bez víz na dobu až 90 dnů zdarma! Stačí vám platný pas.';
    }
    if (query.includes('cen') || query.includes('kolik') || query.includes('stojí') || query.includes('platit')) {
      return 'Naše zájezdy začínají od 49 900 Kč (Korejská metropole) až po 64 900 Kč (Zlatý okruh Japonskem na 14 dní). Cena zahrnuje ubytování, dopravu šinkanseny i průvodce.';
    }
    if (query.includes('tokio') || query.includes('tokyo')) {
      return 'V Tokiu doporučujeme navštívit křižovatku Shibuya, čtvrť anime Akihabara, chrám Senso-ji v Asakuse a výhled z Tokyo Tower!';
    }
    if (query.includes('jídlo') || query.includes('jidlo') || query.includes('ramen') || query.includes('sushi') || query.includes('bbq')) {
      return 'Určitě vyzkoušejte pravý japonský Ramen, Suši na rybím trhu Tsukiji, takoyaki v Ósace a korejské BBQ (Samgyeopsal) s kvašeným Kimchi!';
    }
    if (query.includes('korea') || query.includes('soul') || query.includes('seoul')) {
      return 'V Koreji musíte vidět palác Gyeongbokgung v Soulu, pláže a barevnou vesničku Gamcheon v Pusanu a sopečný ostrov Jeju.';
    }
    if (query.includes('kdy') || query.includes('jako') || query.includes('jaro') || query.includes('sakur')) {
      return 'Nejlepší období pro návštěvu je jaro (březen–květen, kvetení sakur) nebo podzim (říjen–listopad, rudé javorové listy).';
    }
    return 'Japonsko i Korea nabízejí úžasné spojení tradic a budoucnosti! Podívejte se do našeho Plánovače na konkrétní itineráře, nebo mi napište konkrétnější dotaz.';
  };

  const handleSendQuery = async (queryText) => {
    const text = (queryText || input).trim();
    if (!text) return;

    setMessages(prev => [...prev, { sender: 'user', text }]);
    if (!queryText) setInput('');
    setIsTyping(true);

    try {
      if (GEMINI_API_KEY) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: `Jsi přátelský asistent pro cestovatelský web 'Tedův Východní Svět' (zájezdy a průvodce po Japonsku a Jižní Koreji). Odpověz stručně, přehledně a přátelsky na dotaz: ${text}` }] }
            ]
          })
        });

        if (response.ok) {
          const data = await response.json();
          const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (botReply) {
            setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
            setIsTyping(false);
            return;
          }
        }
      }

      // Fallback
      setTimeout(() => {
        const reply = getLocalResponse(text);
        setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
        setIsTyping(false);
      }, 600);

    } catch (err) {
      setTimeout(() => {
        const reply = getLocalResponse(text);
        setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
        setIsTyping(false);
      }, 600);
    }
  };

  const renderBotMessage = (text) => {
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formattedText = formattedText.replace(/(^|\n)\*\s/g, '$1• ');
    return <span dangerouslySetInnerHTML={{ __html: formattedText }} />;
  };

  const quickPrompts = isEn
    ? ['Do I need a visa?', 'What to see in Tokyo?', 'How much are the trips?', 'When to see cherry blossoms?']
    : ['Potřebuji vízum?', 'Co vidět v Tokiu?', 'Jaká je cena zájezdů?', 'Kdy vyrazit za sakurami?'];

  return (
    <>
      <button 
        id="chatbot-toggle-btn" 
        aria-label="Open AI Chat"
        onClick={() => setIsOpen(prev => !prev)}
        style={{
          position: 'fixed',
          bottom: '25px',
          right: '25px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--accent-color)',
          color: '#fff',
          border: 'none',
          boxShadow: '0 8px 24px rgba(239,35,60,0.5)',
          cursor: 'pointer',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.6rem',
          transition: 'transform 0.3s'
        }}
      >
        🌸
      </button>

      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            bottom: '95px',
            right: '25px',
            width: '380px',
            maxWidth: 'calc(100vw - 40px)',
            height: '520px',
            maxHeight: 'calc(100vh - 120px)',
            borderRadius: '20px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            background: 'var(--glass-bg, rgba(15, 15, 25, 0.95))',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--glass-border)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
          }}
        >
          {/* Header */}
          <div style={{ padding: '1rem 1.2rem', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
              <span>🌸</span>
              <span>{isEn ? "Ted's AI Assistant" : 'Tedův AI Asistent'}</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  padding: '0.7rem 1rem',
                  borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                  background: msg.sender === 'user' ? 'var(--accent-color)' : 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  fontSize: '0.9rem',
                  lineHeight: '1.5'
                }}
              >
                {msg.sender === 'bot' ? renderBotMessage(msg.text) : msg.text}
              </div>
            ))}

            {isTyping && (
              <div style={{ alignSelf: 'flex-start', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <i className="fa-solid fa-ellipsis fa-beat"></i> AI Asistent píše...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div style={{ padding: '0.5rem 0.8rem', display: 'flex', gap: '6px', overflowX: 'auto', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendQuery(qp)}
                style={{ whiteSpace: 'nowrap', fontSize: '0.75rem', padding: '4px 10px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div style={{ padding: '0.8rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              placeholder="Napiš zprávu..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendQuery()}
              style={{ flex: 1, padding: '0.6rem 0.8rem', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', fontSize: '0.9rem' }}
            />
            <button 
              onClick={() => handleSendQuery()}
              style={{ padding: '0.6rem 1rem', borderRadius: '10px', border: 'none', background: 'var(--accent-color)', color: '#fff', cursor: 'pointer' }}
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
