import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { uploadImageToFirestore } from '../firebase';

export function AdminPage() {
  const { currentUser, loginWithEmail, logout } = useAuth();
  const [adminEmail, setAdminEmail] = useState('sykoratadeas2001@gmail.com');
  const [pass, setPass] = useState('');
  const [adminTab, setAdminTab] = useState('itineraries'); // 'itineraries' | 'gallery' | 'forum'

  const {
    itineraries, addItinerary, updateItinerary, deleteItinerary,
    galleryItems, addGalleryItem, updateGalleryItem, deleteGalleryItem,
    threads, updateThread, deleteThread, registerMediaItem
  } = useData();

  // Toast Banner Notification
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  // Itinerary Edit Modal state
  const [editingItinerary, setEditingItinerary] = useState(null);
  const [itinTitle, setItinTitle] = useState('');
  const [itinCountry, setItinCountry] = useState('Japonsko 🇯🇵');
  const [itinTag, setItinTag] = useState('pro nováčky');
  const [itinDuration, setItinDuration] = useState('14 dní');
  const [itinPrice, setItinPrice] = useState(64900);
  const [itinImg, setItinImg] = useState('https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80');
  const [itinPhotos, setItinPhotos] = useState([]);
  const [newPhotoInput, setNewPhotoInput] = useState('');
  const [itinDesc, setItinDesc] = useState('');
  const [itinDates, setItinDates] = useState('');
  const [itinCities, setItinCities] = useState('Tokyo, Kyoto, Osaka');
  const [pickerStartDate, setPickerStartDate] = useState('');

  // Accommodation state
  const [itinAccomHotels, setItinAccomHotels] = useState([{ city: '', name: '', pricePerNight: 2500 }]);
  const [itinAccomIncluded, setItinAccomIncluded] = useState('');
  const [itinAccomNotIncluded, setItinAccomNotIncluded] = useState('');

  // Gallery Edit Modal state
  const [editingGallery, setEditingGallery] = useState(null);
  const [galType, setGalType] = useState('photo'); // 'photo' | 'video'
  const [galTitle, setGalTitle] = useState('');
  const [galCountry, setGalCountry] = useState('Japonsko');
  const [galCity, setGalCity] = useState('Tokyo');
  const [galPlace, setGalPlace] = useState('');
  const [galSrc, setGalSrc] = useState('');

  // Forum Edit Modal state
  const [editingThread, setEditingThread] = useState(null); 
  const [editingReply, setEditingReply] = useState(null); 

  const handleSaveThread = async (e) => {
    e.preventDefault();
    if (!editingThread) return;
    try {
      await updateThread(editingThread.id, {
        title: editingThread.title,
        content: editingThread.content,
        category: editingThread.category
      });
      triggerToast('✅ Téma úspěšně upraveno');
      setEditingThread(null);
    } catch (err) {
      console.error(err);
      triggerToast('❌ Chyba při úpravě tématu');
    }
  };

  const handleSaveReply = async (e) => {
    e.preventDefault();
    if (!editingReply) return;
    try {
      const thread = threads.find(t => t.id === editingReply.threadId);
      if (thread) {
        const updatedReplies = thread.replies.map(r => r.id === editingReply.id ? { ...r, text: editingReply.text } : r);
        await updateThread(thread.id, { replies: updatedReplies });
        triggerToast('✅ Odpověď úspěšně upravena');
        setEditingReply(null);
      }
    } catch (err) {
      console.error(err);
      triggerToast('❌ Chyba při úpravě odpovědi');
    }
  };

  const handleAdminLogin = async (e) => {
    try {
      await loginWithEmail(adminEmail, pass);
      triggerToast('👋 Vítejte v administraci CMS!');
    } catch (err) {
      alert('Nesprávné přihlašovací údaje k Firebase!');
    }
  };

  // Automated Date Picker Calculator (Duration + Start Date -> End Date)
  const handleAddDateFromPicker = (startDateVal) => {
    if (!startDateVal) return;
    setPickerStartDate(startDateVal);

    const startDate = new Date(startDateVal);
    if (isNaN(startDate.getTime())) return;

    // Extract days count from itinDuration (e.g. "14 dní" -> 14)
    const match = itinDuration.match(/\d+/);
    const durationDays = match ? parseInt(match[0], 10) : 14;

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (durationDays - 1));

    const startStr = `${startDate.getDate()}. ${startDate.getMonth() + 1}.`;
    const endStr = `${endDate.getDate()}. ${endDate.getMonth() + 1}. ${endDate.getFullYear()}`;
    const formattedTerm = `${startStr} - ${endStr}`;

    const existingArr = itinDates.split(',').map(s => s.trim()).filter(Boolean);
    if (!existingArr.includes(formattedTerm)) {
      const newDatesStr = existingArr.length > 0 ? `${itinDates}, ${formattedTerm}` : formattedTerm;
      setItinDates(newDatesStr);
      triggerToast(`📅 Přidán nový termín: ${formattedTerm}`);
    }
  };

  // Local PC File Upload for Itinerary Photos to Firestore
  const handleItinFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      triggerToast('⏳ Nahrávám obrázek do databáze...');
      const dataUrl = await uploadImageToFirestore(file);
      registerMediaItem(`${Date.now()}_${file.name}`, file.name, dataUrl);
      setItinPhotos(prev => [...prev, dataUrl]);
      if (!itinImg) setItinImg(dataUrl);
      triggerToast('📷 Fotka byla úspěšně uložena do Firestore!');
    } catch (err) {
      console.error(err);
      triggerToast('❌ Chyba při nahrávání obrázku.');
    }
  };

  // Local PC File Upload for Main Gallery Items to Firestore
  const handleGalleryFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    setGalType(isVideo ? 'video' : 'photo');

    try {
      triggerToast('⏳ Nahrávám soubor do databáze...');
      const url = await uploadImageToFirestore(file);
      registerMediaItem(`${Date.now()}_${file.name}`, file.name, url);
      setGalSrc(url);
      triggerToast('📁 Soubor úspěšně uložen do Firestore!');
    } catch (err) {
      console.error(err);
      triggerToast('❌ Chyba při nahrávání souboru.');
    }
  };

  const openItineraryModal = (item = null) => {
    if (item) {
      setEditingItinerary(item);
      setItinTitle(item.title);
      setItinCountry(item.country);
      setItinTag(item.tag);
      setItinDuration(item.duration);
      setItinPrice(item.price);
      setItinImg(item.image || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80');
      setItinPhotos(item.photos && item.photos.length > 0 ? item.photos : [item.image || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80']);
      setItinDesc(item.desc || '');
      setItinDates((item.dates || []).join(', '));
      setItinCities((item.cities || []).join(', '));
      const ac = item.accommodation || {};
      setItinAccomHotels(ac.hotels && ac.hotels.length > 0 ? ac.hotels : [{ city: '', name: '', pricePerNight: 2500 }]);
      setItinAccomIncluded((ac.included || []).join('\n'));
      setItinAccomNotIncluded((ac.notIncluded || []).join('\n'));
    } else {
      setEditingItinerary({ isNew: true });
      setItinTitle('');
      setItinCountry('Japonsko 🇯🇵');
      setItinTag('pro nováčky');
      setItinDuration('14 dní');
      setItinPrice(49900);
      setItinImg('https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80');
      setItinPhotos(['https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1200&q=80']);
      setItinDesc('');
      setItinDates('');
      setItinCities('Tokyo, Kyoto');
      setItinAccomHotels([{ city: '', name: '', pricePerNight: 2500 }]);
      setItinAccomIncluded('');
      setItinAccomNotIncluded('');
    }
    setNewPhotoInput('');
    setPickerStartDate('');
  };

  const handleAddPhoto = () => {
    if (!newPhotoInput.trim()) return;
    const url = newPhotoInput.trim();
    setItinPhotos(prev => [...prev, url]);
    if (!itinImg) setItinImg(url);
    setNewPhotoInput('');
    triggerToast('🖼️ Fotka vložena z URL!');
  };

  const handleRemovePhoto = (indexToRemove) => {
    setItinPhotos(prev => {
      const targetUrl = prev[indexToRemove];
      const next = prev.filter((_, idx) => idx !== indexToRemove);
      if (itinImg === targetUrl) {
        setItinImg(next[0] || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80');
      }
      return next;
    });
  };

  const handleSaveItinerary = (e) => {
    e.preventDefault();
    const datesArr = itinDates.split(',').map(s => s.trim()).filter(Boolean);
    const citiesArr = itinCities.split(',').map(s => s.trim()).filter(Boolean);

    const photosList = itinPhotos.length > 0 ? itinPhotos : [itinImg || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80'];

    const payload = {
      title: itinTitle,
      country: itinCountry,
      tag: itinTag,
      duration: itinDuration,
      price: Number(itinPrice),
      image: itinImg || photosList[0],
      desc: itinDesc,
      dates: datesArr,
      cities: citiesArr,
      photos: photosList,
      accommodation: {
        hotels: itinAccomHotels.filter(h => h.name.trim()),
        included: itinAccomIncluded.split('\n').map(s => s.trim()).filter(Boolean),
        notIncluded: itinAccomNotIncluded.split('\n').map(s => s.trim()).filter(Boolean),
      },
      days: editingItinerary?.days || [
        { day: 'Den 1', title: 'Odlet & Příjezd', desc: 'Zahájení zájezdu a přivítání na místě.' },
        { day: 'Den 2-5', title: 'Hlavní program', desc: 'Návštěva památek a kulinářské zážitky.' }
      ]
    };

    if (editingItinerary.isNew) {
      addItinerary(payload);
    } else {
      updateItinerary(editingItinerary.id, payload);
    }
    setEditingItinerary(null);
    triggerToast('✅ Uloženo! Změny zájezdu byly úspěšně uloženy.');
  };

  const openGalleryModal = (item = null) => {
    if (item) {
      setEditingGallery(item);
      setGalType(item.type || 'photo');
      setGalTitle(item.title || '');
      setGalCountry(item.country || 'Japonsko');
      setGalCity(item.city || 'Tokyo');
      setGalPlace(item.place || '');
      setGalSrc(item.src || '');
    } else {
      setEditingGallery({ isNew: true });
      setGalType('photo');
      setGalTitle('');
      setGalCountry('Japonsko');
      setGalCity('Tokyo');
      setGalPlace('');
      setGalSrc('');
    }
  };

  const handleSaveGallery = (e) => {
    e.preventDefault();
    const payload = {
      type: galType,
      title: galTitle,
      country: galCountry,
      city: galCity,
      place: galPlace || `${galCity}, ${galCountry}`,
      src: galSrc
    };

    if (editingGallery.isNew) {
      addGalleryItem(payload);
    } else {
      updateGalleryItem(editingGallery.id, payload);
    }
    setEditingGallery(null);
    triggerToast('✅ Uloženo! Položka byla uložena do galerie.');
  };

  if (!currentUser || currentUser.email !== 'sykoratadeas2001@gmail.com') {
    return (
      <main style={{ maxWidth: '450px', margin: '6rem auto', padding: '2rem' }}>
        {toastMessage && <div className="toast-banner"><i className="fa-solid fa-bell"></i> {toastMessage}</div>}
        <div className="glass admin-box" style={{ padding: '3rem', borderRadius: '20px', textAlign: 'center' }}>
          <h2><i className="fa-solid fa-user-lock" style={{ color: 'var(--accent-color)' }}></i> Admin Přihlášení</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0 1.5rem' }}>Zadejte svůj Firebase administrátorský e-mail a heslo</p>
          <form onSubmit={handleAdminLogin}>
            <input 
              type="email" 
              placeholder="Admin E-mail" 
              value={adminEmail} 
              onChange={e => setAdminEmail(e.target.value)} 
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', marginBottom: '1rem' }}
            />
            <input 
              type="password" 
              placeholder="Heslo (ověřeno přes Firebase)" 
              value={pass} 
              onChange={e => setPass(e.target.value)} 
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', marginBottom: '1rem' }}
            />
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <i className="fa-solid fa-right-to-bracket"></i> Vstoupit do administrace
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 2rem 3rem' }}>
      {toastMessage && <div className="toast-banner"><i className="fa-solid fa-bell"></i> {toastMessage}</div>}
      <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1><i className="fa-solid fa-gauge" style={{ color: 'var(--accent-color)' }}></i> Administrační Panel (CMS)</h1>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Plná správa zájezdů, termínů, fotek, videí a fóra</p>
          </div>

          <button className="btn" onClick={() => logout()} style={{ background: '#e74c3c', color: '#fff' }}>
            <i className="fa-solid fa-right-from-bracket"></i> Odhlásit admina
          </button>
        </div>

        {/* Admin Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '2rem', flexWrap: 'wrap' }}>
          <button 
            className={`mode-tab-btn ${adminTab === 'itineraries' ? 'active' : ''}`}
            onClick={() => setAdminTab('itineraries')}
          >
            <i className="fa-solid fa-route"></i> Správa Zájezdů ({itineraries.length})
          </button>
          <button 
            className={`mode-tab-btn ${adminTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setAdminTab('gallery')}
          >
            <i className="fa-solid fa-images"></i> Fotky & Videa ({galleryItems.length})
          </button>
          <button 
            className={`mode-tab-btn ${adminTab === 'forum' ? 'active' : ''}`}
            onClick={() => setAdminTab('forum')}
          >
            <i className="fa-solid fa-comments"></i> Fórum ({threads?.length || 0})
          </button>
        </div>
      </div>

      {/* ITINERARIES CMS */}
      {adminTab === 'itineraries' && (
        <div className="glass" style={{ padding: '2rem', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>Seznam aktivních zájezdů</h2>
            <button className="btn btn-primary" onClick={() => openItineraryModal()}>
              <i className="fa-solid fa-plus"></i> Přidat nový zájezd
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {itineraries.map((item) => (
              <div key={item.id} className="glass" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span className="phrase-category-tag" style={{ position: 'static' }}>{item.country} &bull; {item.tag}</span>
                  <h3 style={{ margin: '0.4rem 0 0.2rem', fontSize: '1.3rem' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                    <strong>Cena:</strong> {item.price.toLocaleString('cs-CZ')} Kč &bull; <strong>Délka:</strong> {item.duration} &bull; <strong>Termíny:</strong> {(item.dates || []).join(', ') || 'Žádné'}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn" style={{ background: '#3498db', color: '#fff', padding: '0.5rem 1rem', fontSize: '0.9rem' }} onClick={() => openItineraryModal(item)}>
                    <i className="fa-solid fa-pen"></i> Upravit
                  </button>
                  <button className="btn" style={{ background: '#e74c3c', color: '#fff', padding: '0.5rem 1rem', fontSize: '0.9rem' }} onClick={() => deleteItinerary(item.id)}>
                    <i className="fa-solid fa-trash"></i> Smazat
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GALLERY CMS */}
      {adminTab === 'gallery' && (
        <div className="glass" style={{ padding: '2rem', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>Správa Fotografií a Videí v Galerii</h2>
            <button className="btn btn-primary" onClick={() => openGalleryModal()}>
              <i className="fa-solid fa-plus"></i> Přidat fotku / video
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {galleryItems.map((item) => (
              <div key={item.id} className="glass" style={{ padding: '1.2rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span className="phrase-category-tag" style={{ position: 'static' }}>{item.type === 'video' ? '🎬 Video' : '📷 Fotka'}</span>
                  <h3 style={{ fontSize: '1.1rem', margin: '0.4rem 0 0.2rem' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.place}</p>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
                  <button className="btn" style={{ flex: 1, background: '#3498db', color: '#fff', fontSize: '0.85rem', padding: '0.4rem' }} onClick={() => openGalleryModal(item)}>
                    <i className="fa-solid fa-pen"></i> Upravit
                  </button>
                  <button className="btn" style={{ flex: 1, background: '#e74c3c', color: '#fff', fontSize: '0.85rem', padding: '0.4rem' }} onClick={() => deleteGalleryItem(item.id)}>
                    <i className="fa-solid fa-trash"></i> Smazat
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FORUM CMS */}
      {adminTab === 'forum' && (
        <div className="glass" style={{ padding: '2rem', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>Správa Diskusního fóra</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {threads && threads.map((thread) => (
              <div key={thread.id} className="glass" style={{ padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid var(--accent-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <span className="phrase-category-tag" style={{ position: 'static' }}>{thread.category}</span>
                    <h3 style={{ margin: '0.4rem 0 0.2rem', fontSize: '1.2rem' }}>{thread.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                      <i className="fa-solid fa-user"></i> {thread.author} &bull; {thread.date}
                    </p>
                    <p style={{ marginTop: '0.8rem', fontSize: '0.95rem' }}>{thread.content}</p>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn" style={{ background: '#3498db', color: '#fff', padding: '0.5rem 1rem', fontSize: '0.9rem' }} onClick={() => setEditingThread(thread)}>
                      <i className="fa-solid fa-pen"></i> Upravit Téma
                    </button>
                    <button className="btn" style={{ background: '#e74c3c', color: '#fff', padding: '0.5rem 1rem', fontSize: '0.9rem' }} onClick={() => {
                      if (window.confirm('Opravdu smazat celé téma a všechny jeho odpovědi?')) {
                        deleteThread(thread.id);
                        triggerToast('🗑️ Téma smazáno');
                      }
                    }}>
                      <i className="fa-solid fa-trash"></i> Smazat Téma
                    </button>
                  </div>
                </div>

                {/* Replies manager */}
                {thread.replies && thread.replies.length > 0 && (
                  <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                    <h4 style={{ marginBottom: '1rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>Odpovědi v tomto tématu:</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      {thread.replies.map(reply => (
                        <div key={reply.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                          <div>
                            <strong style={{ fontSize: '0.85rem' }}>{reply.author}</strong> <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({reply.date})</span>
                            <p style={{ margin: '0.2rem 0 0', fontSize: '0.9rem' }}>{reply.text}</p>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn" style={{ background: 'transparent', border: '1px solid #3498db', color: '#3498db', padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => setEditingReply({ threadId: thread.id, ...reply })}>
                              <i className="fa-solid fa-pen"></i> Upravit
                            </button>
                            <button className="btn" style={{ background: 'transparent', border: '1px solid #e74c3c', color: '#e74c3c', padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => {
                              if (window.confirm('Smazat tuto odpověď?')) {
                                const updatedReplies = thread.replies.filter(r => r.id !== reply.id);
                                updateThread(thread.id, { replies: updatedReplies });
                                triggerToast('🗑️ Odpověď smazána');
                              }
                            }}>
                              <i className="fa-solid fa-trash"></i> Smazat
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {(!threads || threads.length === 0) && (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Ve fóru zatím nejsou žádná témata.</p>
            )}
          </div>
        </div>
      )}

      {/* ITINERARY EDIT MODAL */}
      {editingItinerary && (
        <div className="cms-modal active" onClick={() => setEditingItinerary(null)}>
          <div className="cms-modal-content" style={{ maxWidth: '650px' }} onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setEditingItinerary(null)}><i className="fa-solid fa-xmark"></i></button>
            <h2>{editingItinerary.isNew ? 'Přidat nový zájezd' : 'Upravit zájezd'}</h2>

            <form onSubmit={handleSaveItinerary} style={{ marginTop: '1.5rem' }}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Název zájezdu</label>
                <input type="text" required value={itinTitle} onChange={e => setItinTitle(e.target.value)} placeholder="Zlatý okruh Japonskem" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Země</label>
                  <input type="text" required value={itinCountry} onChange={e => setItinCountry(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }} />
                </div>
                <div className="form-group">
                  <label>Štítek / Tag</label>
                  <input type="text" required value={itinTag} onChange={e => setItinTag(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <div className="form-group">
                  <label>Cena (Kč)</label>
                  <input type="number" required value={itinPrice} onChange={e => setItinPrice(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }} />
                </div>
                <div className="form-group">
                  <label>Délka trvání</label>
                  <input type="text" required value={itinDuration} onChange={e => setItinDuration(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }} />
                </div>
              </div>

              {/* Cover Image URL */}
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Hlavní úvodní obrázek zájezdu (URL)</label>
                <input type="text" required value={itinImg} onChange={e => setItinImg(e.target.value)} placeholder="https://..." style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }} />
              </div>

              {/* Photo Gallery Manager for this Itinerary */}
              <div className="form-group" style={{ marginTop: '1.2rem', background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '14px', border: '1px solid var(--glass-border)' }}>
                <label style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-color)', display: 'block', marginBottom: '0.8rem' }}>
                  <i className="fa-solid fa-images"></i> Fotogalerie k tomuto zájezdu (Místa, kam se podíváte)
                </label>
                
                {/* Thumbnails list */}
                {itinPhotos.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.8rem', marginBottom: '1rem' }}>
                    {itinPhotos.map((url, idx) => (
                      <div key={idx} style={{ position: 'relative', height: '85px', borderRadius: '10px', overflow: 'hidden', border: itinImg === url ? '2px solid var(--accent-color)' : '1px solid rgba(255,255,255,0.2)' }}>
                        <img src={url} alt={`Fotka ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        
                        {itinImg === url && (
                          <span style={{ position: 'absolute', top: 3, left: 3, background: 'var(--accent-color)', color: '#fff', fontSize: '0.65rem', padding: '2px 5px', borderRadius: '4px', fontWeight: 'bold' }}>
                            Hlavní
                          </span>
                        )}

                        <button 
                          type="button" 
                          onClick={() => handleRemovePhoto(idx)}
                          style={{ position: 'absolute', top: 3, right: 3, background: 'rgba(231,76,60,0.9)', color: '#fff', border: 'none', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.75rem' }}
                          title="Odstranit fotku"
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>

                        {itinImg !== url && (
                          <button
                            type="button"
                            onClick={() => setItinImg(url)}
                            style={{ position: 'absolute', bottom: 3, left: 3, background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.65rem', padding: '2px 5px', cursor: 'pointer' }}
                          >
                            Hl. fotka
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>Zatím nejsou přidány žádné doplňující fotky.</p>
                )}

                {/* Add Photo via URL or PC File */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <input 
                    type="text" 
                    value={newPhotoInput} 
                    onChange={e => setNewPhotoInput(e.target.value)} 
                    placeholder="Vložte URL nového obrázku..."
                    style={{ flex: 1, minWidth: '200px', padding: '0.66rem 0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', fontSize: '0.9rem' }}
                  />
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    style={{ padding: '0.66rem 1rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                    onClick={handleAddPhoto}
                  >
                    <i className="fa-solid fa-link"></i> Přidat z URL
                  </button>

                  <input 
                    type="file" 
                    accept="image/*" 
                    id="pc-photo-upload-input" 
                    style={{ display: 'none' }} 
                    onChange={handleItinFileUpload} 
                  />
                  <label 
                    htmlFor="pc-photo-upload-input" 
                    className="btn" 
                    style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', padding: '0.66rem 1rem', fontSize: '0.85rem', cursor: 'pointer', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <i className="fa-solid fa-file-arrow-up" style={{ color: 'var(--accent-color)' }}></i> Nahrát z PC
                  </label>
                </div>
              </div>

              {/* Automated Calendar Date Picker Widget */}
              <div className="form-group" style={{ marginTop: '1.2rem', background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '14px', border: '1px solid var(--glass-border)' }}>
                <label style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-color)', display: 'block', marginBottom: '0.4rem' }}>
                  <i className="fa-regular fa-calendar-plus"></i> Kalendář pro výběr termínu (vypočítá k 1. dni i ten 14. den)
                </label>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.8rem' }}>
                  Klikněte na datum odletu v kalendáři. Systém k němu automaticky přičte 14 dní (délku <strong>{itinDuration}</strong>) a vygeneruje kompletní termín:
                </p>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input 
                    type="date" 
                    value={pickerStartDate} 
                    onChange={(e) => handleAddDateFromPicker(e.target.value)} 
                    style={{ flex: 1, padding: '0.7rem 0.9rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(15,15,25,0.9)', color: 'var(--text-main)', fontSize: '0.95rem' }} 
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Termíny zájezdu</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                  {itinDates.split(',').map(s => s.trim()).filter(Boolean).map((dateStr, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', background: 'rgba(239,35,60,0.15)', border: '1px solid var(--accent-color)', borderRadius: '20px', padding: '4px 10px', fontSize: '0.85rem' }}>
                      <span style={{ marginRight: '6px' }}>{dateStr}</span>
                      <button type="button" onClick={() => setItinDates(itinDates.split(',').map(s => s.trim()).filter(Boolean).filter((_, i) => i !== idx).join(', '))} style={{ background: 'transparent', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: '0', display: 'flex' }} title="Odstranit termín"><i className="fa-solid fa-xmark"></i></button>
                    </div>
                  ))}
                  {itinDates.split(',').filter(Boolean).length === 0 && <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Žádné termíny nejsou přidány.</span>}
                </div>
                <input type="text" value={itinDates} onChange={e => setItinDates(e.target.value)} placeholder="Ruční vložení (např. 14. 5. - 28. 5. 2026)" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }} />
              </div>

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Navštívená města na mapě (oddělená čárkou)</label>
                <input type="text" value={itinCities} onChange={e => setItinCities(e.target.value)} placeholder="Tokyo, Kyoto, Osaka" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }} />
              </div>

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Popis zájezdu</label>
                <textarea rows="3" value={itinDesc} onChange={e => setItinDesc(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }}></textarea>
              </div>

              {/* Accommodation Section */}
              <div style={{ marginTop: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '14px', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <label style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-color)', margin: 0 }}>
                    <i className="fa-solid fa-bed"></i> Ubytování po městech
                  </label>
                  <button
                    type="button"
                    className="btn"
                    style={{ background: 'rgba(239,35,60,0.15)', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}
                    onClick={() => setItinAccomHotels(prev => [...prev, { city: '', name: '', pricePerNight: 2500 }])}
                  >
                    <i className="fa-solid fa-plus"></i> Přidat hotel
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', marginBottom: '1.2rem' }}>
                  {itinAccomHotels.map((hotel, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 100px 36px', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={hotel.city}
                        onChange={e => setItinAccomHotels(prev => prev.map((h, i) => i === idx ? { ...h, city: e.target.value } : h))}
                        placeholder="Město (např. Tokio)"
                        style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', fontSize: '0.9rem' }}
                      />
                      <input
                        type="text"
                        value={hotel.name}
                        onChange={e => setItinAccomHotels(prev => prev.map((h, i) => i === idx ? { ...h, name: e.target.value } : h))}
                        placeholder="Název hotelu"
                        style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', fontSize: '0.9rem' }}
                      />
                      <input
                        type="number"
                        value={hotel.pricePerNight}
                        onChange={e => setItinAccomHotels(prev => prev.map((h, i) => i === idx ? { ...h, pricePerNight: Number(e.target.value) } : h))}
                        placeholder="Kč/noc"
                        style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', fontSize: '0.9rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => setItinAccomHotels(prev => prev.filter((_, i) => i !== idx))}
                        disabled={itinAccomHotels.length === 1}
                        style={{ background: 'rgba(231,76,60,0.8)', border: 'none', color: '#fff', borderRadius: '8px', height: '36px', cursor: 'pointer', opacity: itinAccomHotels.length === 1 ? 0.4 : 1 }}
                        title="Odebrat"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label style={{ color: '#2ecc71' }}><i className="fa-solid fa-check"></i> Co je v ceně (každá položka na nový řádek)</label>
                    <textarea rows="5" value={itinAccomIncluded} onChange={e => setItinAccomIncluded(e.target.value)} placeholder={'Letenky\nUbytování\nSnídaně'} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', resize: 'vertical' }}></textarea>
                  </div>
                  <div className="form-group">
                    <label style={{ color: '#e74c3c' }}><i className="fa-solid fa-xmark"></i> Co není v ceně</label>
                    <textarea rows="5" value={itinAccomNotIncluded} onChange={e => setItinAccomNotIncluded(e.target.value)} placeholder={'Obědy\nOsobní výdaje'} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', resize: 'vertical' }}></textarea>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
                <i className="fa-solid fa-floppy-disk"></i> Uložit změny
              </button>
            </form>
          </div>
        </div>
      )}

      {/* GALLERY EDIT MODAL */}
      {editingGallery && (
        <div className="cms-modal active" onClick={() => setEditingGallery(null)}>
          <div className="cms-modal-content" style={{ maxWidth: '550px' }} onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setEditingGallery(null)}><i className="fa-solid fa-xmark"></i></button>
            <h2>{editingGallery.isNew ? 'Přidat položku do galerie' : 'Upravit položku galerie'}</h2>

            <form onSubmit={handleSaveGallery} style={{ marginTop: '1.5rem' }}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Typ</label>
                <select value={galType} onChange={e => setGalType(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(15,15,25,0.9)', color: 'var(--text-main)' }}>
                  <option value="photo">Fotografie</option>
                  <option value="video">YouTube Video</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Název</label>
                <input type="text" required value={galTitle} onChange={e => setGalTitle(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }} />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Místo</label>
                <input type="text" value={galPlace} onChange={e => setGalPlace(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }} />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>URL (Obrázku nebo YouTube embed) nebo Nahrát z PC</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" required value={galSrc} onChange={e => setGalSrc(e.target.value)} placeholder="https://..." style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }} />
                  <input type="file" accept="image/*,video/*" id="gal-file-upload-input" style={{ display: 'none' }} onChange={handleGalleryFileUpload} />
                  <label htmlFor="gal-file-upload-input" className="btn" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', cursor: 'pointer', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.8rem 1rem' }}>
                    <i className="fa-solid fa-file-arrow-up" style={{ color: 'var(--accent-color)' }}></i> Z PC
                  </label>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <i className="fa-solid fa-floppy-disk"></i> Uložit položku
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FORUM THREAD EDIT MODAL */}
      {editingThread && (
        <div className="cms-modal active" onClick={() => setEditingThread(null)}>
          <div className="cms-modal-content" style={{ maxWidth: '650px' }} onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setEditingThread(null)}><i className="fa-solid fa-xmark"></i></button>
            <h2>Upravit Téma</h2>

            <form onSubmit={handleSaveThread} style={{ marginTop: '1.5rem' }}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Kategorie</label>
                <select required value={editingThread.category} onChange={e => setEditingThread({ ...editingThread, category: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }}>
                  <option value="Všechna témata">Všechna témata</option>
                  <option value="Dotazy před cestou">Dotazy před cestou</option>
                  <option value="Cestopisy & Tipy">Cestopisy & Tipy</option>
                  <option value="Hledám parťáka">Hledám parťáka</option>
                  <option value="Pokec o všem">Pokec o všem</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Název tématu</label>
                <input type="text" required value={editingThread.title} onChange={e => setEditingThread({ ...editingThread, title: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }} />
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label>Obsah</label>
                <textarea required rows={6} value={editingThread.content} onChange={e => setEditingThread({ ...editingThread, content: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', resize: 'vertical' }}></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <i className="fa-solid fa-floppy-disk"></i> Uložit téma
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FORUM REPLY EDIT MODAL */}
      {editingReply && (
        <div className="cms-modal active" onClick={() => setEditingReply(null)}>
          <div className="cms-modal-content" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setEditingReply(null)}><i className="fa-solid fa-xmark"></i></button>
            <h2>Upravit odpověď</h2>

            <form onSubmit={handleSaveReply} style={{ marginTop: '1.5rem' }}>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label>Text odpovědi</label>
                <textarea required rows={4} value={editingReply.text} onChange={e => setEditingReply({ ...editingReply, text: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', resize: 'vertical' }}></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <i className="fa-solid fa-floppy-disk"></i> Uložit odpověď
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
