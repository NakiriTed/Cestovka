import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';

export function ForumPage() {
  const { currentUser, userProfile, openLoginModal } = useAuth();
  const { threads, addThread, updateThread } = useData();
  const { currentLang } = useLanguage();
  const isEn = currentLang === 'en';
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedThread, setSelectedThread] = useState(null);

  // New Thread Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Dotazy před cestou');
  const [newContent, setNewContent] = useState('');
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);

  // New Reply Form state
  const [replyText, setReplyText] = useState('');

  const handleCreateThread = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const authorName = userProfile?.displayName || currentUser?.displayName || 'Cestovatel';
    const newThreadObj = {
      id: Date.now(),
      title: newTitle,
      author: authorName,
      authorUid: currentUser?.uid || null,
      category: newCategory,
      date: new Date().toLocaleDateString('cs-CZ'),
      content: newContent,
      replies: []
    };

    addThread(newThreadObj);
    setNewTitle('');
    setNewContent('');
    setShowNewThreadModal(false);
  };

  const handleAddReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedThread) return;

    const authorName = userProfile?.displayName || currentUser?.displayName || 'Cestovatel';
    const newReply = {
      id: Date.now(),
      author: authorName,
      date: new Date().toLocaleDateString('cs-CZ'),
      text: replyText
    };

    const safeOldReplies = selectedThread.replies || [];
    const updatedReplies = [...safeOldReplies, newReply];
    
    updateThread(selectedThread.id, { replies: updatedReplies });

    setSelectedThread(prev => ({
      ...prev,
      replies: updatedReplies
    }));
    setReplyText('');
  };

  const categories = [
    { key: 'Všechna témata', en: 'All Topics' },
    { key: 'Dotazy před cestou', en: 'Pre-trip Questions' },
    { key: 'Cestopisy & Tipy', en: 'Travel Stories & Tips' },
    { key: 'Hledám parťáka', en: 'Looking for a Travel Buddy' },
    { key: 'Pokec o všem', en: 'General Chat' }
  ];

  const translateCategory = (cat) => {
    const found = categories.find(c => c.key === cat);
    return isEn && found ? found.en : cat;
  };

  const EN_THREADS = {
    'Jak funguje JR Pass v roce 2026?': {
      title: 'How does the JR Pass work in 2026?',
      content: 'Hi everyone, is the nationwide JR Pass still worth it for a 14-day trip (Tokyo – Kyoto – Osaka – Hiroshima), or is it better to buy individual Shinkansen tickets?',
      replies: [
        { text: 'Since the price increase, the 14-day JR Pass only pays off if you also go to Hiroshima and Kanazawa. For just the Golden Route, individual tickets via SmartEX are cheaper!' }
      ]
    },
    'K-ETA do Jižní Koreje – aktuální zkušenosti': {
      title: 'K-ETA for South Korea – current experience',
      content: 'Hey travelers! Do Czech citizens still have an exemption from K-ETA registration, or do we need to fill it out before flying to Seoul?',
      replies: [
        { text: 'Just got back from Seoul last week – with a Czech passport you just fill out the arrival card on the plane, no K-ETA needed!' }
      ]
    },
    'Co si sbalit do Japonska na jaro?': {
      title: 'What to pack for Japan in spring?',
      content: 'We are flying on the Golden Route in May. What shoes and clothes worked best for you when walking 15–20 km a day?'
    }
  };

  const localizeThread = (thread) => {
    if (!isEn || !thread) return thread;
    const tr = EN_THREADS[thread.title];
    if (!tr) return thread;
    return {
      ...thread,
      title: tr.title || thread.title,
      content: tr.content || thread.content,
      replies: (thread.replies || []).map((r, i) => ({
        ...r,
        text: tr.replies?.[i]?.text || r.text
      }))
    };
  };

  const safeThreads = (threads || []).map(localizeThread);
  const filteredThreads = activeCategory === 'Všechna témata' || activeCategory === 'all'
    ? safeThreads 
    : safeThreads.filter(t => t.category === activeCategory);

  return (
    <main style={{ maxWidth: '1050px', margin: '0 auto', padding: '6rem 2rem 3rem' }}>
      
      {/* Thread Detail View */}
      {selectedThread ? (
        <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px' }}>
          <button 
            className="btn" 
            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', marginBottom: '2rem' }}
            onClick={() => setSelectedThread(null)}
          >
            <i className="fa-solid fa-arrow-left"></i> {isEn ? 'Back to forum overview' : 'Zpět na přehled fóra'}
          </button>

          <div style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
            <span className="phrase-category-tag" style={{ position: 'static', display: 'inline-block', marginBottom: '0.8rem' }}>
              {translateCategory(selectedThread.category)}
            </span>
            <h1 style={{ fontSize: '2.2rem', margin: '0.3rem 0 1rem', lineHeight: 1.2 }}>{selectedThread.title}</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <i className="fa-solid fa-circle-user" style={{ fontSize: '1.4rem', color: 'var(--accent-color)' }}></i>
              <strong>{selectedThread.author}</strong> &bull; {selectedThread.date}
            </div>

            <p style={{ marginTop: '1.5rem', fontSize: '1.1rem', color: 'var(--text-main)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
              {selectedThread.content}
            </p>
          </div>

          {/* Replies Section */}
          <h3 style={{ marginBottom: '1.5rem' }}>
            <i className="fa-solid fa-comments" style={{ color: 'var(--accent-color)' }}></i> {isEn ? 'Replies' : 'Odpovědi'} ({(selectedThread.replies || []).length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2.5rem' }}>
            {!(selectedThread.replies && selectedThread.replies.length > 0) ? (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>{isEn ? 'No replies yet. Write the first reply below!' : 'Zatím žádné odpovědi. Napište první odpoveď níže!'}</p>
            ) : (
              selectedThread.replies.map(reply => (
                <div key={reply.id} className="glass" style={{ padding: '1.2rem 1.5rem', borderRadius: '16px', borderLeft: '3px solid var(--accent-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>
                      <i className="fa-solid fa-user" style={{ color: 'var(--accent-color)', marginRight: '6px' }}></i>
                      {reply.author}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>{reply.date}</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>{reply.text}</p>
                </div>
              ))
            )}
          </div>

          {/* Add Reply Form */}
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}><i className="fa-solid fa-reply" style={{ color: 'var(--accent-color)' }}></i> {isEn ? 'Write a reply' : 'Napsat odpověď'}</h2>
            <form onSubmit={handleAddReply}>
              <label htmlFor="forum-reply-text" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem' }}>{isEn ? 'Your reply' : 'Text odpovědi'}</label>
              <textarea 
                id="forum-reply-text"
                rows="4" 
                required 
                placeholder={isEn ? 'Write your reply or advice...' : 'Napište vaši odpověď nebo radu...'}
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                style={{
                  width: '100%', padding: '0.8rem', borderRadius: '10px',
                  border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)',
                  color: 'var(--text-main)', fontFamily: 'inherit', marginBottom: '1rem'
                }}
              />
              <button type="submit" className="btn btn-primary">
                <i className="fa-solid fa-paper-plane"></i> {isEn ? 'Post Reply' : 'Odeslat odpověď'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <>
          {/* Forum Main Overview */}
          <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                  <i className="fa-solid fa-comments" style={{ color: 'var(--accent-color)' }}></i> {isEn ? 'Travel Community Forum' : 'Cestovatelské fórum'}
                </h1>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>{isEn ? 'Ask questions, share tips, and find a travel buddy for East Asia.' : 'Ptejte se, raďte ostatním, najděte parťáka na cestu do Asie.'}</p>
              </div>

              <button 
                className="btn btn-primary"
                onClick={() => {
                  if (!currentUser) openLoginModal();
                  else setShowNewThreadModal(true);
                }}
              >
                <i className="fa-solid fa-plus"></i> {isEn ? 'New Topic' : 'Nové téma'}
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '2rem' }}>
              {categories.map((cat, idx) => (
                <button 
                  key={idx}
                  className={`filter-btn ${activeCategory === cat.key || (activeCategory === 'all' && idx === 0) ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.key === 'Všechna témata' ? 'all' : cat.key)}
                >
                  {isEn ? cat.en : cat.key}
                </button>
              ))}
            </div>
          </div>

          {/* New Thread Modal */}
          {showNewThreadModal && (
            <div className="cms-modal active" role="dialog" aria-modal="true" aria-label={isEn ? 'Create new topic' : 'Vytvořit nové téma'} onClick={() => setShowNewThreadModal(false)}>
              <div className="cms-modal-content" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
                <button type="button" aria-label={isEn ? 'Close' : 'Zavřít'} className="close-modal" onClick={() => setShowNewThreadModal(false)}><i className="fa-solid fa-xmark"></i></button>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-color)' }}><i className="fa-solid fa-pen-to-square"></i> {isEn ? 'Create New Topic' : 'Vytvořit nové téma'}</h2>
                
                <form onSubmit={handleCreateThread}>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label htmlFor="forum-new-title">{isEn ? 'Topic Title' : 'Nadpis tématu'}</label>
                    <input 
                      id="forum-new-title"
                      type="text" required placeholder={isEn ? 'What would you like to discuss?' : 'O čem chcete diskutovat?'} 
                      value={newTitle} onChange={e => setNewTitle(e.target.value)}
                      style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label htmlFor="forum-new-category">{isEn ? 'Category' : 'Kategorie'}</label>
                    <select 
                      id="forum-new-category"
                      value={newCategory} onChange={e => setNewCategory(e.target.value)}
                      style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(15,15,25,0.9)', color: 'var(--text-main)' }}
                    >
                      <option value="Dotazy před cestou">{isEn ? 'Pre-trip Questions' : 'Dotazy před cestou'}</option>
                      <option value="Cestopisy & Tipy">{isEn ? 'Travel Stories & Tips' : 'Cestopisy & Tipy'}</option>
                      <option value="Hledám parťáka">{isEn ? 'Looking for a Travel Buddy' : 'Hledám parťáka'}</option>
                      <option value="Pokec o všem">{isEn ? 'General Chat' : 'Pokec o všem'}</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label htmlFor="forum-new-content">{isEn ? 'Message' : 'Text zprávy'}</label>
                    <textarea 
                      id="forum-new-content"
                      rows="5" required placeholder={isEn ? 'Write your questions or travel experience...' : 'Napište vaše otázky nebo zkušenosti...'}
                      value={newContent} onChange={e => setNewContent(e.target.value)}
                      style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    <i className="fa-solid fa-paper-plane"></i> {isEn ? 'Publish Topic' : 'Publikovat téma'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Thread List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {filteredThreads.length === 0 ? (
              <div className="glass" style={{ padding: '2.5rem', textAlign: 'center', borderRadius: '20px', color: 'var(--text-muted)' }}>
                {isEn ? 'No topics in this category yet.' : 'V této kategorii zatím nejsou žádná témata.'}
              </div>
            ) : filteredThreads.map(thread => (
              <div 
                key={thread.id}
                role="button"
                tabIndex={0}
                className="glass" 
                style={{ 
                  padding: '1.8rem', borderRadius: '20px', cursor: 'pointer',
                  transition: 'transform 0.2s, border-color 0.2s', border: '1px solid var(--glass-border)'
                }}
                onClick={() => setSelectedThread(thread)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedThread(thread); } }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '0.6rem' }}>
                  <span className="phrase-category-tag" style={{ position: 'static' }}>{translateCategory(thread.category)}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{thread.date}</span>
                </div>

                <h2 style={{ fontSize: '1.35rem', margin: '0.4rem 0 0.6rem', color: 'var(--text-main)' }}>{thread.title}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.2rem', lineClamp: 2 }}>{thread.content}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--accent-color)' }}>
                  <span><i className="fa-solid fa-user"></i> {thread.author}</span>
                  <span><i className="fa-solid fa-comments"></i> {(thread.replies || []).length} {isEn ? 'replies' : 'odpovědí'} &bull; <strong>{isEn ? 'Open →' : 'Rozkliknout →'}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
