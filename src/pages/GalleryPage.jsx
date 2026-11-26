import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { compressImageToDataUrl } from '../firebase';

export function GalleryPage() {
  const { t, currentLang } = useLanguage();
  const isEn = currentLang === 'en';
  const { currentUser } = useAuth();
  const { galleryItems, addGalleryItem } = useData();

  const EN_GALLERY_TITLES = {
    'Svatyně Fushimi Inari': 'Fushimi Inari Shrine',
    'Tokyo Tower v noci': 'Tokyo Tower at Night',
    'Tradiční palác Gyeongbokgung': 'Gyeongbokgung Royal Palace',
    'Bambusový háj Arashiyama': 'Arashiyama Bamboo Grove',
    'Gurmánská čtvrť Dotonbori': 'Dotonbori Food District',
    'Hora Fudži a Pagoda Chureito': 'Mt. Fuji & Chureito Pagoda',
    'Tedův Východní Svět - Cestování po Asii': "Ted's Eastern World - Traveling Across Asia"
  };

  const localizePlace = (place) => {
    if (!place || !isEn) return place;
    return place
      .replace('Kjótó, Japonsko', 'Kyoto, Japan')
      .replace('Tokio, Japonsko', 'Tokyo, Japan')
      .replace('Soul, Jižní Korea', 'Seoul, South Korea')
      .replace('Ósaka, Japonsko', 'Osaka, Japan')
      .replace('Kawaguchiko, Japonsko', 'Kawaguchiko, Japan')
      .replace('Japonsko & Korea', 'Japan & South Korea')
      .replace('Japonsko', 'Japan')
      .replace('Jižní Korea', 'South Korea');
  };

  const [activeItem, setActiveItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Filters
  const [countryFilter, setCountryFilter] = useState('vše');
  const [cityFilter, setCityFilter] = useState('vše');

  // Form State
  const [newType, setNewType] = useState('photo');
  const [newTitle, setNewTitle] = useState('');
  const [newCountry, setNewCountry] = useState('Japonsko');
  const [newCity, setNewCity] = useState('Tokyo');
  const [newPlace, setNewPlace] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [uploadMode, setUploadMode] = useState('file'); // 'file' | 'url'

  // Close lightbox on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveItem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    setNewType(isVideo ? 'video' : 'photo');

    if (!isVideo && file.type.startsWith('image/')) {
      try {
        const compressed = await compressImageToDataUrl(file, 1400, 0.8);
        setNewUrl(compressed);
        return;
      } catch (err) {
        console.error('Image compression error:', err);
      }
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setNewUrl(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const sanitizeVideoEmbedUrl = (rawUrl) => {
    if (!rawUrl || typeof rawUrl !== 'string') return '';
    if (rawUrl.startsWith('data:video/')) return rawUrl;
    try {
      const parsed = new URL(rawUrl);
      if (parsed.protocol !== 'https:') return '';
      if (parsed.hostname === 'www.youtube.com' || parsed.hostname === 'youtube.com') {
        if (parsed.pathname.startsWith('/embed/')) return parsed.toString();
        const v = parsed.searchParams.get('v');
        if (v) return `https://www.youtube.com/embed/${encodeURIComponent(v)}`;
      }
      if (parsed.hostname === 'youtu.be') {
        const id = parsed.pathname.slice(1);
        if (id) return `https://www.youtube.com/embed/${encodeURIComponent(id)}`;
      }
      if (parsed.hostname === 'player.vimeo.com' && parsed.pathname.startsWith('/video/')) {
        return parsed.toString();
      }
      return '';
    } catch {
      return '';
    }
  };

  const handleAddPhoto = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    let safeSrc = newUrl.trim();
    if (newType === 'video') {
      safeSrc = sanitizeVideoEmbedUrl(safeSrc);
      if (!safeSrc) {
        alert('Pro video prosím zadejte platný HTTPS odkaz na YouTube nebo Vimeo (případně MP4 soubor).');
        return;
      }
    }

    await addGalleryItem({
      type: newType,
      title: newTitle,
      country: newCountry,
      city: newCity,
      place: newPlace || `${newCity}, ${newCountry}`,
      src: safeSrc,
      ownerId: currentUser?.uid || null
    });

    setNewTitle('');
    setNewPlace('');
    setNewUrl('');
    setShowAddForm(false);
  };

  // Unique cities list from gallery items
  const availableCities = ['vše', ...Array.from(new Set(galleryItems.map(i => i.city).filter(Boolean)))];

  const filteredItems = galleryItems.filter(item => {
    const matchesCountry = countryFilter === 'vše' || (item.country && item.country.toLowerCase().includes(countryFilter.toLowerCase())) || (item.place && item.place.toLowerCase().includes(countryFilter.toLowerCase()));
    const matchesCity = cityFilter === 'vše' || (item.city && item.city.toLowerCase() === cityFilter.toLowerCase()) || (item.place && item.place.toLowerCase().includes(cityFilter.toLowerCase()));
    return matchesCountry && matchesCity;
  });

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 2rem 3rem' }}>
      <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px', textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1><i className="fa-solid fa-images" style={{ color: 'var(--accent-color)' }}></i> {t('gallery.title', 'Fotogalerie & Videa z našich cest')}</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', maxWidth: '700px', margin: '0.5rem auto 1.5rem' }}>
          {t('gallery.desc', 'Prohlédněte si autentické fotografie a videa z našich zájezdů po Východní Asii. Filtrujte podle země či konkrétních měst.')}
        </p>

        {/* Filter Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
          {/* Country Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}><i className="fa-solid fa-globe"></i> {isEn ? 'Country:' : 'Země:'}</span>
            {[
              { id: 'vše', label: isEn ? 'All Countries' : 'Všechny země' },
              { id: 'Japonsko', label: isEn ? '🇯🇵 Japan' : '🇯🇵 Japonsko' },
              { id: 'Korea', label: isEn ? '🇰🇷 South Korea' : '🇰🇷 Jižní Korea' }
            ].map(c => (
              <button 
                key={c.id} 
                className={`filter-btn ${countryFilter === c.id ? 'active' : ''}`}
                onClick={() => setCountryFilter(c.id)}
                style={{ padding: '6px 16px', fontSize: '0.85rem' }}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* City Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}><i className="fa-solid fa-city"></i> {isEn ? 'City:' : 'Město:'}</span>
            {availableCities.map(city => (
              <button 
                key={city} 
                className={`filter-btn ${cityFilter === city ? 'active' : ''}`}
                onClick={() => setCityFilter(city)}
                style={{ padding: '4px 12px', fontSize: '0.8rem', textTransform: 'capitalize' }}
              >
                {city === 'vše' ? (isEn ? 'All Cities' : 'Všechna města') : city}
              </button>
            ))}
          </div>
        </div>

        {currentUser && (
          <div style={{ marginTop: '1.5rem' }}>
            <button 
              className="btn btn-primary" 
              onClick={() => setShowAddForm(prev => !prev)}
            >
              <i className="fa-solid fa-plus"></i> {showAddForm ? (isEn ? 'Close Form' : 'Zavřít formulář') : (isEn ? 'Add Photo / Video (from PC or URL)' : 'Přidat fotku / video (z počítače nebo URL)')}
            </button>
          </div>
        )}
      </div>

      {showAddForm && currentUser && (
        <div className="glass" style={{ padding: '2rem', borderRadius: '20px', marginBottom: '2.5rem' }}>
          <h3><i className="fa-solid fa-upload" style={{ color: 'var(--accent-color)' }}></i> {isEn ? 'Upload New Photo / Video' : 'Nahrát novou fotku / video'}</h3>
          
          <div style={{ display: 'flex', gap: '10px', margin: '1rem 0' }}>
            <button 
              type="button"
              className={`mode-tab-btn ${uploadMode === 'file' ? 'active' : ''}`} 
              onClick={() => setUploadMode('file')}
            >
              <i className="fa-solid fa-laptop"></i> {isEn ? 'Upload from Computer' : 'Nahrát z počítače'}
            </button>
            <button 
              type="button"
              className={`mode-tab-btn ${uploadMode === 'url' ? 'active' : ''}`} 
              onClick={() => setUploadMode('url')}
            >
              <i className="fa-solid fa-link"></i> {isEn ? 'Paste URL' : 'Vložit URL adresu'}
            </button>
          </div>

          <form onSubmit={handleAddPhoto}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label htmlFor="gal-type">{isEn ? 'Type' : 'Typ'}</label>
                <select id="gal-type" value={newType} onChange={e => setNewType(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(15,15,25,0.9)', color: 'var(--text-main)' }}>
                  <option value="photo">{isEn ? 'Photo' : 'Fotografie'}</option>
                  <option value="video">{isEn ? 'Video (YouTube / MP4)' : 'Video (YouTube / MP4)'}</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="gal-country">{isEn ? 'Country' : 'Země'}</label>
                <select id="gal-country" value={newCountry} onChange={e => setNewCountry(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(15,15,25,0.9)', color: 'var(--text-main)' }}>
                  <option value="Japonsko">{isEn ? 'Japan 🇯🇵' : 'Japonsko 🇯🇵'}</option>
                  <option value="Jižní Korea">{isEn ? 'South Korea 🇰🇷' : 'Jižní Korea 🇰🇷'}</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="gal-city">{isEn ? 'City' : 'Město'}</label>
                <input id="gal-city" type="text" placeholder="Tokyo, Kyoto, Osaka, Soul..." value={newCity} onChange={e => setNewCity(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label htmlFor="gal-title">{isEn ? 'Photo / Video Title' : 'Název fotky/videa'}</label>
              <input id="gal-title" type="text" required placeholder={isEn ? 'e.g. Evening in Shinjuku' : 'Např. Večerní Šindžuku'} value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }} />
            </div>

            {uploadMode === 'file' ? (
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="gal-file">{isEn ? 'Select file from computer (Image or Video)' : 'Vyberte soubor z počítače (Obrázek nebo Video)'}</label>
                <input 
                  id="gal-file"
                  type="file" 
                  accept="image/*,video/*"
                  onChange={handleFileUpload} 
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }} 
                />
                {newUrl && newUrl.startsWith('data:') && (
                  <p style={{ color: '#2ecc71', fontSize: '0.85rem', marginTop: '0.4rem' }}>
                    <i className="fa-solid fa-circle-check"></i> {isEn ? 'File loaded and ready to save!' : 'Soubor byl načten a připraven k uložení!'}
                  </p>
                )}
              </div>
            ) : (
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="gal-url">{isEn ? 'URL address (image or YouTube embed)' : 'URL adresa (obrázku nebo YouTube embed)'}</label>
                <input id="gal-url" type="url" required placeholder="https://..." value={newUrl} onChange={e => setNewUrl(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }} />
              </div>
            )}

            <button type="submit" className="btn btn-primary"><i className="fa-solid fa-cloud-arrow-up"></i> {isEn ? 'Save to Gallery' : 'Uložit do galerie'}</button>
          </form>
        </div>
      )}

      {/* Gallery Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center', borderRadius: '20px' }}>
          <i className="fa-solid fa-images fa-3x" style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}></i>
          <h3>{isEn ? 'No photos match the selected filter' : 'Žádné fotky neodpovídají zadanému filtru'}</h3>
          <p style={{ color: 'var(--text-muted)' }}>{isEn ? 'Try changing the country or city filter.' : 'Zkuste změnit výběr země nebo města.'}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {filteredItems.map((p) => {
            const displayTitle = (isEn && EN_GALLERY_TITLES[p.title]) ? EN_GALLERY_TITLES[p.title] : p.title;
            const displayPlace = localizePlace(p.place || p.city);
            return (
            <div 
              key={p.id} 
              className="glass" 
              style={{ borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.3s' }}
              onClick={() => setActiveItem({ ...p, title: displayTitle, place: displayPlace })}
            >
              <div style={{ height: '230px', background: '#111', overflow: 'hidden', position: 'relative' }}>
                {p.type === 'video' ? (
                  p.src.startsWith('data:video') ? (
                    <video src={p.src} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }}></video>
                  ) : (
                    <iframe 
                      src={sanitizeVideoEmbedUrl(p.src)} 
                      title={displayTitle}
                      sandbox="allow-scripts allow-same-origin allow-presentation"
                      style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
                    ></iframe>
                  )
                ) : (
                  <img 
                    src={p.src} 
                    alt={displayTitle}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
                <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', color: '#fff' }}>
                  {p.type === 'video' ? (isEn ? '🎬 Video' : '🎬 Video') : (isEn ? '📷 Photo' : '📷 Fotka')}
                </div>
              </div>
              <div style={{ padding: '1.2rem' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>{displayTitle}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}><i className="fa-solid fa-location-dot"></i> {displayPlace}</p>
              </div>
            </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Enlarged View Modal */}
      {activeItem && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.92)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
          onClick={() => setActiveItem(null)}
        >
          <div 
            style={{ position: 'relative', width: '90vw', maxWidth: '900px', textAlign: 'center' }}
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setActiveItem(null)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: '#fff',
                fontSize: '1.5rem',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                cursor: 'pointer'
              }}
              title="Zavřít (Esc)"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            {activeItem.type === 'video' ? (
              activeItem.src.startsWith('data:video') ? (
                <video src={activeItem.src} controls autoPlay style={{ maxWidth: '100%', maxHeight: '75vh', borderRadius: '16px' }}></video>
              ) : (
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: '16px', overflow: 'hidden' }}>
                  <iframe 
                    src={`${sanitizeVideoEmbedUrl(activeItem.src)}?autoplay=1`} 
                    title={activeItem.title} 
                    sandbox="allow-scripts allow-same-origin allow-presentation"
                    allow="autoplay; encrypted-media" 
                    allowFullScreen
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  ></iframe>
                </div>
              )
            ) : (
              <img 
                src={activeItem.src} 
                alt={activeItem.title}
                style={{ maxWidth: '100%', maxHeight: '75vh', borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}
              />
            )}

            <div style={{ marginTop: '1rem', color: '#fff' }}>
              <h2 style={{ fontSize: '1.6rem', margin: '0 0 0.3rem' }}>{activeItem.title}</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0 }}><i className="fa-solid fa-location-dot"></i> {activeItem.place || activeItem.city}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
