import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { compressImageToDataUrl, db, collection, query, where, getDocs } from '../firebase';

export function ProfilePage() {
  const { currentUser, userProfile, logout, updateUserProfile, openLoginModal } = useAuth();
  const { itineraries, deleteItinerary } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [realName, setRealName] = useState(userProfile?.realName || '');
  const [birthDate, setBirthDate] = useState(userProfile?.birthDate || '');
  const [city, setCity] = useState(userProfile?.city || '');
  const [gender, setGender] = useState(userProfile?.gender || '');
  const [trips, setTrips] = useState(userProfile?.trips || '');
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatarUrl || '');

  // Reservations State
  const [reservations, setReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const fetchReservations = async () => {
        try {
          const q = query(collection(db, 'reservations'), where('userId', '==', currentUser.uid));
          const snap = await getDocs(q);
          const resData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          // Sort descending by date
          resData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setReservations(resData);
        } catch (err) {
          console.error("Error fetching reservations:", err);
        } finally {
          setLoadingReservations(false);
        }
      };
      fetchReservations();
    }
  }, [currentUser]);

  // Handle Image Upload (compressed directly for Firestore user document)
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentUser) return;

    try {
      setIsSaving(true);
      const url = await compressImageToDataUrl(file, 400, 0.85);
      setAvatarUrl(url);
    } catch (err) {
      console.error('Upload avatar error:', err);
      alert('Chyba při nahrávání profilové fotky.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUserProfile({
        displayName,
        realName,
        birthDate,
        city,
        gender,
        trips,
        avatarUrl
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Save profile error:', err);
      alert('Chyba při ukládání profilu.');
    }
    setIsSaving(false);
  };

  if (!currentUser) {
    return (
      <main style={{ maxWidth: '600px', margin: '6rem auto', padding: '2rem', textAlign: 'center' }}>
        <div className="glass" style={{ padding: '3rem', borderRadius: '20px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>Uživatel není přihlášen</h1>
          <p style={{ color: 'var(--text-muted)', margin: '1rem 0 1.5rem' }}>Pro zobrazení profilu, uložených itinerářů a rezervací se prosím přihlaste.</p>
          <button type="button" className="btn btn-primary" onClick={openLoginModal}>
            <i className="fa-solid fa-right-to-bracket"></i> Přihlásit se
          </button>
        </div>
      </main>
    );
  }

  let savedFavoriteIds = [];
  try {
    savedFavoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]');
  } catch {}
  const favoritePlans = itineraries.filter(it => savedFavoriteIds.includes(it.id));
  const myCustomPlans = itineraries.filter(it => it.isCustom && (!it.ownerId || it.ownerId === currentUser.uid));

  return (
    <main style={{ maxWidth: '850px', margin: '0 auto', padding: '6rem 2rem 3rem' }}>
      
      {/* Profile Header */}
      <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            {avatarUrl || userProfile?.avatarUrl ? (
              <img src={avatarUrl || userProfile.avatarUrl} alt="Avatar" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-color)' }} />
            ) : (
              <i className="fa-solid fa-circle-user" style={{ fontSize: '100px', color: 'var(--accent-color)' }}></i>
            )}
            
            {isEditing && (
              <label htmlFor="avatar-upload" style={{ position: 'absolute', bottom: 0, right: 0, background: '#3498db', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>
                <i className="fa-solid fa-camera"></i>
                <input type="file" id="avatar-upload" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
              </label>
            )}
          </div>
          <div>
            <h1 style={{ margin: '0 0 0.2rem', fontSize: '2rem' }}>{displayName || currentUser.displayName || 'Cestovatel'}</h1>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}><i className="fa-solid fa-envelope"></i> {currentUser.email}</p>
            {userProfile?.city && <p style={{ color: 'var(--text-muted)', margin: '0.3rem 0 0', fontSize: '0.9rem' }}><i className="fa-solid fa-location-dot"></i> {userProfile.city}</p>}
          </div>
        </div>
        
        <div>
          {!isEditing ? (
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              <i className="fa-solid fa-pen"></i> Upravit profil
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }} onClick={() => setIsEditing(false)}>
                Zrušit
              </button>
              <button className="btn btn-primary" onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? <i className="fa-solid fa-spinner fa-spin"></i> : <><i className="fa-solid fa-floppy-disk"></i> Uložit</>}
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Social / Info Section */}
        <div className="glass" style={{ padding: '2rem', borderRadius: '20px' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-color)' }}><i className="fa-solid fa-address-card"></i> O mně (Pro parťáky)</h2>
          
          {isEditing ? (
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div className="form-group">
                <label>Přezdívka (Zobrazí se ve fóru)</label>
                <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Skutečné jméno</label>
                  <input type="text" value={realName} onChange={e => setRealName(e.target.value)} placeholder="Jan Novák" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }} />
                </div>
                <div className="form-group">
                  <label>Město</label>
                  <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="Praha" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Datum narození</label>
                  <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }} />
                </div>
                <div className="form-group">
                  <label>Pohlaví</label>
                  <select value={gender} onChange={e => setGender(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(15,15,25,0.9)', color: 'var(--text-main)' }}>
                    <option value="">Nevybráno</option>
                    <option value="Muž">Muž</option>
                    <option value="Žena">Žena</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Moje cestovatelské sny a bio</label>
                <textarea rows="4" value={trips} onChange={e => setTrips(e.target.value)} placeholder="Napište něco o sobě, ať vás ostatní lépe poznají..." style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }} />
              </div>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', color: 'var(--text-main)' }}>
              <div><strong style={{ color: 'var(--text-muted)' }}>Skutečné jméno:</strong> {userProfile?.realName || '-'}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Pohlaví:</strong> {userProfile?.gender || '-'}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Datum narození:</strong> {userProfile?.birthDate ? new Date(userProfile.birthDate).toLocaleDateString('cs-CZ') : '-'}</div>
              <div style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <strong style={{ color: 'var(--text-muted)' }}>Bio & Cestovatelské sny:</strong>
                <p style={{ marginTop: '0.5rem', fontStyle: userProfile?.trips ? 'normal' : 'italic', color: userProfile?.trips ? 'inherit' : 'rgba(255,255,255,0.4)' }}>
                  {userProfile?.trips || 'Tento cestovatel o sobě zatím nic nenapsal.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Trips / Reservations Section */}
        <div className="glass" style={{ padding: '2rem', borderRadius: '20px', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-color)' }}><i className="fa-solid fa-plane-departure"></i> Moje rezervované zájezdy</h2>
          
          {loadingReservations ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-spinner fa-spin fa-2x" style={{ color: 'var(--accent-color)' }}></i>
            </div>
          ) : reservations.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              {reservations.map(res => (
                <div key={res.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong style={{ fontSize: '1.1rem' }}>{res.planTitle}</strong>
                    <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>{res.price.toLocaleString('cs-CZ')} Kč</span>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    <i className="fa-regular fa-calendar"></i> Termín: {res.date}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                    <span style={{ color: res.status === 'pending' ? '#f39c12' : '#2ecc71' }}>
                      {res.status === 'pending' ? '⏳ Čeká na platbu/potvrzení' : '✅ Potvrzeno'}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.3)' }}>
                      Vytvořeno: {new Date(res.createdAt).toLocaleDateString('cs-CZ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', color: 'rgba(255,255,255,0.3)' }}>
              <i className="fa-solid fa-suitcase-rolling fa-4x"></i>
              <p>Zatím nemáte žádné aktivní rezervace.</p>
            </div>
          )}

          <button className="btn" style={{ marginTop: '2rem', background: '#d90429', color: '#fff', width: '100%' }} onClick={logout}>
            <i className="fa-solid fa-right-from-bracket"></i> Odhlásit se
          </button>
        </div>

      </div>

      {/* Personalization: User's Custom Itineraries & Favorite Plans */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
        <div className="glass" style={{ padding: '2rem', borderRadius: '20px' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', color: 'var(--accent-color)' }}>
            <i className="fa-solid fa-wand-magic-sparkles"></i> Moje vlastní itineráře ({myCustomPlans.length})
          </h2>
          {myCustomPlans.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Zatím jste si nesestavili vlastní itinerář. Můžete si ho vytvořit v sekci <Link to="/planner" style={{ color: 'var(--accent-color)' }}>Plánovač</Link>.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {myCustomPlans.map(plan => (
                <div key={plan.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.9rem 1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                  <div>
                    <Link to={`/planner?plan=${encodeURIComponent(plan.id)}`} style={{ color: 'var(--text-main)', fontWeight: 700, textDecoration: 'none' }}>
                      {plan.title}
                    </Link>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{plan.country} • {plan.duration}</div>
                  </div>
                  <button
                    type="button"
                    aria-label="Smazat vlastní itinerář"
                    onClick={() => deleteItinerary(plan.id)}
                    style={{ background: 'rgba(231,76,60,0.2)', border: '1px solid #e74c3c', color: '#ff8a80', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer' }}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass" style={{ padding: '2rem', borderRadius: '20px' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', color: 'var(--accent-color)' }}>
            <i className="fa-solid fa-heart"></i> Oblíbené zájezdy ({favoritePlans.length})
          </h2>
          {favoritePlans.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Zatím nemáte uložené žádné oblíbené zájezdy. Označte je srdíčkem v <Link to="/planner" style={{ color: 'var(--accent-color)' }}>Plánovači</Link>.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {favoritePlans.map(plan => (
                <Link
                  key={plan.id}
                  to={`/planner?plan=${encodeURIComponent(plan.id)}`}
                  style={{ background: 'rgba(255,255,255,0.05)', padding: '0.9rem 1rem', borderRadius: '12px', textDecoration: 'none', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{plan.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{plan.country} • {plan.duration}</div>
                  </div>
                  <span style={{ color: 'var(--accent-color)', fontWeight: 700 }}>{plan.price.toLocaleString('cs-CZ')} Kč</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
