import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export function ForumPage() {
  const { currentUser, userProfile, openLoginModal } = useAuth();
  const { threads, addThread, updateThread } = useData();
  
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

  const categories = ['Všechna témata', 'Dotazy před cestou', 'Cestopisy & Tipy', 'Hledám parťáka', 'Pokec o všem'];

  const safeThreads = threads || [];
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
            <i className="fa-solid fa-arrow-left"></i> Zpět na přehled fóra
          </button>

          <div style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
            <span className="phrase-category-tag" style={{ position: 'static', display: 'inline-block', marginBottom: '0.8rem' }}>
              {selectedThread.category}
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
            <i className="fa-solid fa-comments" style={{ color: 'var(--accent-color)' }}></i> Odpovědi ({(selectedThread.replies || []).length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2.5rem' }}>
            {!(selectedThread.replies && selectedThread.replies.length > 0) ? (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Zatím žádné odpovědi. Napište první odpoveď níže!</p>
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
            <h4 style={{ marginBottom: '1rem' }}><i className="fa-solid fa-reply" style={{ color: 'var(--accent-color)' }}></i> Napsat odpověď</h4>
            <form onSubmit={handleAddReply}>
              <textarea 
                rows="4" 
                required 
                placeholder="Napište vaši odpověď nebo radu..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                style={{
                  width: '100%', padding: '0.8rem', borderRadius: '10px',
                  border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)',
                  color: 'var(--text-main)', fontFamily: 'inherit', marginBottom: '1rem'
                }}
              />
              <button type="submit" className="btn btn-primary">
                <i className="fa-solid fa-paper-plane"></i> Odeslat odpověď
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
                  <i className="fa-solid fa-comments" style={{ color: 'var(--accent-color)' }}></i> Cestovatelské Fórum
                </h1>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Ptejte se, radte ostatním, najděte parťáka na cestu do Asie.</p>
              </div>

              <button 
                className="btn btn-primary"
                onClick={() => {
                  if (!currentUser) openLoginModal();
                  else setShowNewThreadModal(true);
                }}
              >
                <i className="fa-solid fa-plus"></i> Nové téma
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '2rem' }}>
              {categories.map((cat, idx) => (
                <button 
                  key={idx}
                  className={`filter-btn ${activeCategory === cat || (activeCategory === 'all' && idx === 0) ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat === 'Všechna témata' ? 'all' : cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* New Thread Modal */}
          {showNewThreadModal && (
            <div className="cms-modal active" onClick={() => setShowNewThreadModal(false)}>
              <div className="cms-modal-content" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
                <button className="close-modal" onClick={() => setShowNewThreadModal(false)}><i className="fa-solid fa-xmark"></i></button>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-color)' }}><i className="fa-solid fa-pen-to-square"></i> Vytvořit nové téma</h2>
                
                <form onSubmit={handleCreateThread}>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label>Nadpis tématu</label>
                    <input 
                      type="text" required placeholder="O čem chcete diskutovat?" 
                      value={newTitle} onChange={e => setNewTitle(e.target.value)}
                      style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label>Kategorie</label>
                    <select 
                      value={newCategory} onChange={e => setNewCategory(e.target.value)}
                      style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(15,15,25,0.9)', color: 'var(--text-main)' }}
                    >
                      <option value="Dotazy před cestou">Dotazy před cestou</option>
                      <option value="Cestopisy & Tipy">Cestopisy & Tipy</option>
                      <option value="Hledám parťáka">Hledám parťáka</option>
                      <option value="Pokec o všem">Pokec o všem</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label>Text zprávy</label>
                    <textarea 
                      rows="5" required placeholder="Napište vaše otázky nebo zkušenosti..."
                      value={newContent} onChange={e => setNewContent(e.target.value)}
                      style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    <i className="fa-solid fa-paper-plane"></i> Publikovat téma
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Thread List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {filteredThreads.map(thread => (
              <div 
                key={thread.id}
                className="glass" 
                style={{ 
                  padding: '1.8rem', borderRadius: '20px', cursor: 'pointer',
                  transition: 'transform 0.2s, border-color 0.2s', border: '1px solid var(--glass-border)'
                }}
                onClick={() => setSelectedThread(thread)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '0.6rem' }}>
                  <span className="phrase-category-tag" style={{ position: 'static' }}>{thread.category}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{thread.date}</span>
                </div>

                <h3 style={{ fontSize: '1.35rem', margin: '0.4rem 0 0.6rem', color: 'var(--text-main)' }}>{thread.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.2rem', lineClamp: 2 }}>{thread.content}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--accent-color)' }}>
                  <span><i className="fa-solid fa-user"></i> {thread.author}</span>
                  <span><i className="fa-solid fa-comments"></i> {(thread.replies || []).length} odpovědí &bull; <strong>Rozkliknout →</strong></span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
