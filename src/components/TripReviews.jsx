import React, { useState, useEffect } from 'react';
import { db, collection, query, where, getDocs, addDoc } from '../firebase';
import { useAuth } from '../context/AuthContext';

export function TripReviews({ planId }) {
  const { currentUser, userProfile } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New review state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(collection(db, 'reviews'), where('planId', '==', planId));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Sort newest first
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReviews(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [planId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setIsSubmitting(true);
    try {
      const newReview = {
        planId,
        userId: currentUser.uid,
        userName: userProfile?.displayName || currentUser.displayName || 'Cestovatel',
        userAvatar: userProfile?.avatarUrl || '',
        rating,
        comment,
        createdAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(db, 'reviews'), newReview);
      setReviews(prev => [{ id: docRef.id, ...newReview }, ...prev]);
      setComment('');
      setRating(5);
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Něco se pokazilo při odesílání recenze.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (count) => {
    return Array(5).fill(0).map((_, i) => (
      <i key={i} className={`fa-solid fa-star ${i < count ? '' : 'fa-regular'}`} style={{ color: i < count ? '#f1c40f' : 'rgba(255,255,255,0.2)' }}></i>
    ));
  };

  return (
    <div style={{ marginTop: '3rem' }}>
      <h2><i className="fa-solid fa-star" style={{ color: 'var(--accent-color)' }}></i> Recenze a zkušenosti</h2>
      
      {/* New Review Form */}
      {currentUser ? (
        <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem' }}>
          <h4 style={{ marginBottom: '1rem' }}>Přidat vlastní hodnocení</h4>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Hodnocení (1-5)</label>
              <select value={rating} onChange={e => setRating(Number(e.target.value))} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)', color: '#fff', width: '100px' }}>
                <option value="5">5 hvězdiček</option>
                <option value="4">4 hvězdičky</option>
                <option value="3">3 hvězdičky</option>
                <option value="2">2 hvězdičky</option>
                <option value="1">1 hvězdička</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Komentář</label>
              <textarea 
                required
                rows="3" 
                value={comment} 
                onChange={e => setComment(e.target.value)} 
                placeholder="Jak se vám zájezd líbil? Napište ostatním vaše zkušenosti..."
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ alignSelf: 'flex-start' }}>
              {isSubmitting ? 'Odesílám...' : 'Odeslat recenzi'}
            </button>
          </form>
        </div>
      ) : (
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Pro napsání recenze se musíte nejprve přihlásit.
        </div>
      )}

      {/* Review List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}><i className="fa-solid fa-spinner fa-spin fa-2x" style={{ color: 'var(--accent-color)' }}></i></div>
      ) : reviews.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.map(rev => (
            <div key={rev.id} className="glass" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
              {rev.userAvatar ? (
                <img src={rev.userAvatar} alt={rev.userName} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <i className="fa-solid fa-circle-user fa-3x" style={{ color: 'var(--accent-color)' }}></i>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.3rem' }}>
                  <strong style={{ fontSize: '1.1rem' }}>{rev.userName}</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(rev.createdAt).toLocaleDateString('cs-CZ')}</span>
                </div>
                <div style={{ marginBottom: '0.8rem', fontSize: '0.9rem' }}>
                  {renderStars(rev.rating)}
                </div>
                <p style={{ margin: 0, lineHeight: 1.5 }}>{rev.comment}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
          Zatím tu nejsou žádné recenze. Buďte první!
        </div>
      )}
    </div>
  );
}
