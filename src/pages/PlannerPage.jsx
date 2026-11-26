import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { db, collection, addDoc } from '../firebase';
import { TripReviews } from '../components/TripReviews';

export function PlannerPage() {
  const { t } = useLanguage();
  const { itineraries, addItinerary, deleteItinerary, resolveImage, getMediaKey } = useData();
  const location = useLocation();
  const { theme } = useTheme();
  const { currentUser } = useAuth();

  const [filter, setFilter] = useState('vše');
  const [sortBy, setSortBy] = useState('default');
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favorites') || '[]');
    } catch {
      return [];
    }
  });
  const [compareList, setCompareList] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [activeDetailPlan, setActiveDetailPlan] = useState(null);

  // Custom Itinerary Builder Modal State
  const [isCustomBuilderOpen, setIsCustomBuilderOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customCountry, setCustomCountry] = useState('Japonsko 🇯🇵');
  const [customDuration, setCustomDuration] = useState('10 dní');
  const [customTag, setCustomTag] = useState('poznávací');
  const [customCities, setCustomCities] = useState(['Tokyo', 'Kyoto', 'Osaka']);
  const [customDays, setCustomDays] = useState([
    { day: 'Den 1-3', title: 'Přílet a objevování metropole', desc: 'Aklimatizace, památky, místní gastronomie a večerní čtvrti.' },
    { day: 'Den 4-7', title: 'Historické chrámy a příroda', desc: 'Přesun rychlovlakem, návštěva tradičních chrámů a zahrad.' },
    { day: 'Den 8-10', title: 'Moderní čtvrti, nákupy a návrat', desc: 'Rozloučení s Asií, nákupy suvenýrů a odlet domů.' }
  ]);
  const [isGeneratingAiPlan, setIsGeneratingAiPlan] = useState(false);
  const [aiPlanError, setAiPlanError] = useState('');

  useEffect(() => {
    const handleReset = () => {
      setActiveDetailPlan(null);
    };
    window.addEventListener('resetPlanner', handleReset);
    return () => window.removeEventListener('resetPlanner', handleReset);
  }, []);

  // Lightbox
  const [lightboxPhoto, setLightboxPhoto] = useState(null); // { src, caption }

  // Caption labels for local /img/ photos
  const PHOTO_CAPTIONS = {
    'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/tokyo-japan.jpg': 'Tokio',
    'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/Asakusa.jpg': 'Asakusa, Tokio',
    'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/Fuji.png': 'Hora Fudži',
    'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/Hakone.jpg': 'Hakone',
    'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/Kyoto-Fushimi.jpg': 'Fushimi Inari, Kjóto',
    'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/Kyoto-Arashiyama.jpg': 'Arashiyama, Kjóto',
    'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/Kyoto-Kiyomizu.jpg': 'Chrám Kiyomizudera, Kjóto',
    'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/Kyoto-Nara.jpg': 'Nara',
    'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/Osaka-dotonbori.jpg': 'Dotonbori, Ósaka',
    'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/Osaka-castle.jpg': 'Ósaský hrad',
    'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/Osaka-shinsekai.jpg': 'Shinsekai, Ósaka',
    'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/osaka-station.jpg': 'Ósaké nádraží',
    'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/Himeji.jpg': 'Hrad Himeji',
    'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/Seoul.jpg': 'Soul (Seoul)',
    'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/Akihabara.jpg': 'Akihabara, Tokio',
    'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/SubwayTokyo.png': 'Metro v Tokiu',
    'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/Sumida park.jpg': 'Park Sumida, Tokio',
    'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/Tokyo_Asakusa_Kannon.jpg': 'Chrám Sensó-dži, Tokio',
    'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/tokyo-landscape.webp': 'Tokio',
    'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/fuji-landscape.jpg': 'Hora Fudži',
    'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/kyoto-landscape.jpg': 'Kjóto',
    'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/shikoku-landscape.jpg': 'Ostrov Šikoku',
    'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/tohoku-landscape.jpg': 'Tōhoku',
  };

  // Booking Wizard Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Close modals and lightbox on ESC
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setLightboxPhoto(null);
        setIsBookingOpen(false);
        setIsCustomBuilderOpen(false);
        setIsCompareModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);
  const [bookingStep, setBookingStep] = useState(1); // 1: Date/Plan, 2: Passenger, 3: Payment, 4: Success
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedPlanPrice, setSelectedPlanPrice] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableDatesForBooking, setAvailableDatesForBooking] = useState([]);

  // Form Fields
  const [bookName, setBookName] = useState('');
  const [bookAge, setBookAge] = useState('');
  const [bookEmail, setBookEmail] = useState('');
  const [bookPhone, setBookPhone] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('stripe'); // 'stripe' | 'qr'
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Leaflet map instance ref for tour route map
  const routeMapRef = useRef(null);
  const routeLeafletInstance = useRef(null);
  const routeTileLayerRef = useRef(null);

  // Handle deep-link from MapPage: ?plan=ID&date=TERM
  useEffect(() => {
    if (!itineraries.length) return;
    const params = new URLSearchParams(location.search);
    const planId = params.get('plan');
    const dateParam = params.get('date');
    if (!planId) return;

    const found = itineraries.find(i => i.id === planId);
    if (!found) return;

    setActiveDetailPlan(found);

    if (dateParam) {
      // Wait a tick so the detail view renders before opening booking
      setTimeout(() => {
        openBooking(found, dateParam);
      }, 150);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, itineraries]);

  const cityCoords = {
    'Tokyo': [35.6762, 139.6503],
    'Kyoto': [35.0116, 135.7681],
    'Osaka': [34.6937, 135.5023],
    'Hiroshima': [34.3853, 132.4553],
    'Soul (Seoul)': [37.5665, 126.9780],
    'Pusan (Busan)': [35.1796, 129.0756],
    'Fuji (Kawaguchiko)': [35.5031, 138.7679],
    'Kanazawa': [36.5944, 136.6256],
    'Nara': [34.6851, 135.8048]
  };

  // Render Leaflet route map inside plan detail view
  useEffect(() => {
    if (!activeDetailPlan || !routeMapRef.current) return;

    const initRouteMap = () => {
      if (!window.L) return;
      const L = window.L;

      if (routeLeafletInstance.current) {
        routeLeafletInstance.current.remove();
        routeLeafletInstance.current = null;
      }

      const map = L.map(routeMapRef.current, {
        center: [36.0, 137.0],
        zoom: 6,
        scrollWheelZoom: false
      });
      routeLeafletInstance.current = map;

      const theme = document.documentElement.getAttribute('data-theme') || 'dark';
      const cartoKey = 'cb1_3uzm_1_4767ad8acc9bf6ee2987ae8b';
      const tileUrl = theme === 'light'
        ? `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${cartoKey}`
        : `https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png?key=${cartoKey}`;

      routeTileLayerRef.current = L.tileLayer(tileUrl, {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(map);

      const cities = activeDetailPlan.cities || ['Tokyo', 'Kyoto', 'Osaka'];
      const latlngs = [];

      cities.forEach((cityName) => {
        const coords = cityCoords[cityName];
        if (coords) {
          latlngs.push(coords);
          const icon = L.divIcon({
            className: '',
            html: `<div style="width:16px; height:16px; background:#ef233c; border-radius:50%; border:2px solid white; box-shadow:0 0 10px rgba(239,35,60,0.8);"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          });
          L.marker(coords, { icon })
            .bindPopup(`<strong>📍 ${cityName}</strong>`)
            .addTo(map);
        }
      });

      const fitMap = () => {
        map.invalidateSize();
        if (latlngs.length > 1) {
          const poly = L.polyline(latlngs, {
            color: '#ef233c', weight: 4, dashArray: '8, 8', opacity: 0.85
          }).addTo(map);
          map.fitBounds(poly.getBounds(), { padding: [40, 40] });
        } else if (latlngs.length === 1) {
          map.setView(latlngs[0], 8);
        }
      };

      // ResizeObserver fires the moment the container gets real pixel dimensions
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
            ro.disconnect();
            fitMap();
          }
        }
      });
      ro.observe(routeMapRef.current);
      // Fallback in case observer fires too early
      setTimeout(fitMap, 300);
    };

    if (window.L) {
      initRouteMap();
    } else {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initRouteMap;
      document.head.appendChild(script);
    }
  }, [activeDetailPlan]);

  // Swap route map tile layer when theme changes
  useEffect(() => {
    if (!routeLeafletInstance.current || !routeTileLayerRef.current) return;
    const map = routeLeafletInstance.current;
    const cartoKey = 'cb1_3uzm_1_4767ad8acc9bf6ee2987ae8b';
    const newUrl = theme === 'light'
      ? `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${cartoKey}`
      : `https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png?key=${cartoKey}`;
    map.removeLayer(routeTileLayerRef.current);
    routeTileLayerRef.current = window.L.tileLayer(newUrl, {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);
  }, [theme]);

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      try { localStorage.setItem('favorites', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const toggleCompare = (id, e) => {
    e.stopPropagation();
    setCompareList(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleCustomCity = (city) => {
    setCustomCities(prev =>
      prev.includes(city) ? (prev.length > 1 ? prev.filter(c => c !== city) : prev) : [...prev, city]
    );
  };

  const handleGenerateAiDays = async () => {
    setIsGeneratingAiPlan(true);
    setAiPlanError('');
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    if (!apiKey) {
      setAiPlanError('AI plánovač momentálně není dostupný (chybí API klíč v prostředí). Můžete pokračovat s výchozím programem.');
      setIsGeneratingAiPlan(false);
      return;
    }
    try {
      const prompt = `Sestav cestovní itinerář den po dni pro zemi "${customCountry}", délku "${customDuration}", styl "${customTag}" a města: ${customCities.join(', ')}.
Vrať POUZE čisté JSON pole objektů (4 až 6 bloků dnů) v češtině bez markdownu ve formátu:
[{"day": "Den 1-2", "title": "Název bloku", "desc": "Stručný popis aktivit a památek"}]`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const arrMatch = raw.match(/\[[\s\S]*\]/);
      if (arrMatch) {
        const parsed = JSON.parse(arrMatch[0]);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCustomDays(parsed);
          return;
        }
      }
      setAiPlanError('Odpověď AI se nepodařilo zpracovat. Zkuste to prosím znovu.');
    } catch (err) {
      console.error('AI itinerary generation error:', err);
      setAiPlanError('AI služba je momentálně nedostupná. Zkontrolujte připojení nebo uložte výchozí program.');
    } finally {
      setIsGeneratingAiPlan(false);
    }
  };

  const handleSaveCustomItinerary = async (e) => {
    e.preventDefault();
    const daysNum = parseInt(customDuration, 10) || 10;
    const estimatedPrice = daysNum * 4500 + customCities.length * 1500;
    const defaultImgKey = customCountry.includes('Korea')
      ? 'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/Seoul.jpg'
      : 'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/tokyo-japan.jpg';
    const resolvedCover = resolveImage(defaultImgKey);

    const newPlan = {
      id: `custom-${Date.now()}`,
      title: customTitle.trim() || `Vlastní cesta: ${customCities.join(' & ')} (${customDuration})`,
      tag: customTag,
      country: customCountry,
      duration: customDuration,
      price: estimatedPrice,
      image: resolvedCover,
      desc: `Vlastní sestavený itinerář na míru (${customCities.join(' ➔ ')}).`,
      dates: ['Dle vlastního výběru (2026)'],
      cities: customCities,
      photos: [resolvedCover],
      days: customDays,
      isCustom: true,
      ownerId: currentUser?.uid || null,
      createdAt: new Date().toISOString()
    };

    try {
      await addItinerary(newPlan);
    } catch (err) {
      console.log('Custom itinerary saved in local state:', err);
    }

    setIsCustomBuilderOpen(false);
    setActiveDetailPlan(newPlan);
  };

  const openBooking = (plan, selectedDateStr = null, e) => {
    if (e) e.stopPropagation();
    const id = typeof plan === 'object' ? plan.id : (activeDetailPlan?.id || 'custom');
    const title = typeof plan === 'string' ? plan : plan.title;
    const price = typeof plan === 'object' ? plan.price : 49900;
    const dates = typeof plan === 'object' ? (plan.dates || []) : [];

    setSelectedPlanId(id);
    setSelectedPlan(title);
    setSelectedPlanPrice(price);
    setAvailableDatesForBooking(dates);
    setSelectedDate(selectedDateStr || dates[0] || 'Dle dohody');
    setBookingStep(1);
    setBookingSuccess(false);
    setIsBookingOpen(true);
  };

  const handleFinalizeBooking = async (e) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    const planIdToUse = selectedPlanId || activeDetailPlan?.id || 'custom';

    // Send Web3Forms API email notification to admin
    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '6705e9e6-2ced-4d72-9b02-95f2a0e1a1fc', // Web3Forms Access Key z požadavku
          subject: `Nová Rezervace: ${selectedPlan}`,
          from_name: 'Tedova Asie CMS',
          to_email: 'sykoratadeas2001@gmail.com',
          message: `Nová rezervace zájezdu!
---------------------------------
Zájezd: ${selectedPlan}
Termín: ${selectedDate}
Cena: ${selectedPlanPrice.toLocaleString('cs-CZ')} Kč
Jméno: ${bookName} (${bookAge} let)
E-mail: ${bookEmail}
Telefon: ${bookPhone}
Způsob platby: ${paymentMethod === 'stripe' ? 'Online karta (Stripe) - Zaplaceno' : 'Bankovní převod / QR kód'}
`
        })
      });
    } catch (err) {
      console.log('Web3Forms notification error:', err);
    }

    // Uložení do Firestore
    try {
      if (currentUser) {
        await addDoc(collection(db, 'reservations'), {
          userId: currentUser.uid,
          planId: planIdToUse,
          planTitle: selectedPlan,
          date: selectedDate,
          price: selectedPlanPrice,
          name: bookName,
          email: bookEmail,
          phone: bookPhone,
          paymentMethod: paymentMethod,
          status: 'pending',
          createdAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.log('Firestore save error:', err);
    }

    // STRIPE INTEGRACE
    if (paymentMethod === 'stripe') {
      try {
        const response = await fetch('/api/createStripeCheckout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planTitle: selectedPlan,
            price: selectedPlanPrice,
            email: bookEmail,
            planId: planIdToUse
          })
        });

        const data = await response.json();
        if (data.url) {
          window.location.href = data.url; // Přesměrování na Stripe platbu
          return;
        } else {
          alert(`Chyba při vytváření Stripe platby: ${data.error || 'Neznámá chyba'}`);
          setIsProcessingPayment(false);
          return;
        }
      } catch (err) {
        console.error('Stripe checkout error:', err);
        alert('Chyba při komunikaci se Stripe bránou.');
        setIsProcessingPayment(false);
        return;
      }
    }

    // Klasické dokončení pro "QR Platbu"
    setTimeout(() => {
      setIsProcessingPayment(false);
      setBookingSuccess(true);
      setBookingStep(4);
    }, 1200);
  };

  const filteredItineraries = itineraries.filter(item => {
    if (filter === 'vše') return true;
    if (filter === 'oblíbené') return favorites.includes(item.id);
    return item.tag === filter;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  return (
    <main className="planner-wrap" style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 2rem 3rem' }}>
      
      {/* Detailed Plan View with Route Map and Location Photos */}
      {activeDetailPlan ? (
        <div className="glass" style={{ padding: '3rem', borderRadius: '24px' }}>
          <button 
            className="btn" 
            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', marginBottom: '2rem' }}
            onClick={() => setActiveDetailPlan(null)}
          >
            <i className="fa-solid fa-arrow-left"></i> Zpět na přehled zájezdů
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <span className="phrase-category-tag" style={{ fontSize: '0.9rem', padding: '4px 12px', marginBottom: '0.5rem', display: 'inline-block' }}>
                {activeDetailPlan.country} &bull; {activeDetailPlan.tag}
              </span>
              <h1 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{activeDetailPlan.title}</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '700px' }}>{activeDetailPlan.desc}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-color)' }}>
                {activeDetailPlan.price.toLocaleString('cs-CZ')} Kč
              </div>
              <span style={{ color: 'var(--text-muted)' }}><i className="fa-regular fa-clock"></i> {activeDetailPlan.duration}</span>
              
              {/* Sold out vs dates switcher */}
              {(!activeDetailPlan.dates || activeDetailPlan.dates.length === 0) ? (
                <div style={{ marginTop: '1rem', background: 'rgba(231, 76, 60, 0.2)', color: '#e74c3c', border: '1px solid #e74c3c', padding: '8px 16px', borderRadius: '12px', fontWeight: 'bold' }}>
                  <i className="fa-solid fa-circle-exclamation"></i> Termíny jsou momentálně plně obsazeny
                </div>
              ) : (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Dostupné termíny:</div>
                  <select 
                    style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)', color: '#fff', marginBottom: '0.8rem' }}
                    onChange={(e) => openBooking(activeDetailPlan, e.target.value)}
                  >
                    {activeDetailPlan.dates.map((d, idx) => (
                      <option key={idx} value={d}>{d}</option>
                    ))}
                  </select>

                  <div>
                    <button className="btn btn-primary" onClick={(e) => openBooking(activeDetailPlan, activeDetailPlan.dates[0], e)}>
                      <i className="fa-solid fa-calendar-check"></i> Rezervovat tento zájezd
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '2.5rem 0' }} />

          {/* Location Photos Section */}
          <div style={{ marginBottom: '3rem' }}>
            <h2><i className="fa-solid fa-camera" style={{ color: 'var(--accent-color)' }}></i> Místa, kam se podíváte</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.2rem' }}>
              {(activeDetailPlan.photos || [activeDetailPlan.image]).map((p, idx) => {
                const caption = PHOTO_CAPTIONS[getMediaKey(p)] || PHOTO_CAPTIONS[p] || '';
                return (
                  <div
                    key={idx}
                    className="glass"
                    onClick={() => setLightboxPhoto({ src: p, caption })}
                    style={{
                      height: '200px', borderRadius: '16px', overflow: 'hidden',
                      position: 'relative', cursor: 'zoom-in',
                      transition: 'transform 0.25s, box-shadow 0.25s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(239,35,60,0.35)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = ''; }}
                  >
                    <img src={p} alt={caption || 'Místo zájezdu'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {caption && (
                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.75))',
                        color: '#fff', padding: '20px 12px 10px',
                        fontSize: '0.85rem', fontWeight: 600,
                        display: 'flex', alignItems: 'center', gap: '6px'
                      }}>
                        <i className="fa-solid fa-location-dot" style={{ color: 'var(--accent-color)', fontSize: '0.8rem' }}></i>
                        {caption}
                      </div>
                    )}
                    <div style={{
                      position: 'absolute', top: '10px', right: '10px',
                      background: 'rgba(0,0,0,0.45)', borderRadius: '50%',
                      width: '30px', height: '30px', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: '0.75rem'
                    }}>
                      <i className="fa-solid fa-expand"></i>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Accommodation Section */}
          {activeDetailPlan.accommodation && (
            <div style={{ marginBottom: '3rem' }}>
              <h2><i className="fa-solid fa-bed" style={{ color: 'var(--accent-color)' }}></i> Ubytování po trasách</h2>

              {/* Hotels grid */}
              {(activeDetailPlan.accommodation.hotels || []).length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.2rem', marginBottom: '1.5rem' }}>
                  {activeDetailPlan.accommodation.hotels.map((hotel, i) => (
                    <div key={i} className="glass" style={{ padding: '1.2rem', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
                      <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                        background: 'linear-gradient(90deg, var(--accent-color), #ff6b9d)'
                      }} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.5rem' }}>
                        <i className="fa-solid fa-location-dot" style={{ color: 'var(--accent-color)', fontSize: '0.8rem' }}></i>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{hotel.city}</span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.6rem', lineHeight: 1.3 }}>{hotel.name}</div>
                      {hotel.pricePerNight > 0 && (
                        <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '4px', background: 'rgba(239,35,60,0.12)', border: '1px solid rgba(239,35,60,0.3)', borderRadius: '8px', padding: '3px 10px' }}>
                          <span style={{ fontWeight: 800, color: 'var(--accent-color)', fontSize: '1rem' }}>{hotel.pricePerNight.toLocaleString('cs-CZ')}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Kč / noc</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Included / Not Included */}
              <div className="glass" style={{ padding: '1.5rem 2rem', borderRadius: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#2ecc71', marginBottom: '0.7rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="fa-solid fa-circle-check"></i> Co je v ceně
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {(activeDetailPlan.accommodation.included || []).map((item, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.9rem' }}>
                          <i className="fa-solid fa-check" style={{ color: '#2ecc71', marginTop: '3px', flexShrink: 0 }}></i>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#e74c3c', marginBottom: '0.7rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="fa-solid fa-circle-xmark"></i> Co není v ceně
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {(activeDetailPlan.accommodation.notIncluded || []).map((item, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.9rem' }}>
                          <i className="fa-solid fa-xmark" style={{ color: '#e74c3c', marginTop: '3px', flexShrink: 0 }}></i>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transport & Subway Warning Section */}
          {(activeDetailPlan.country.includes('Japonsko') || activeDetailPlan.country.includes('Korea')) && (
            <div style={{ marginBottom: '3rem', background: 'rgba(239, 35, 60, 0.08)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(239, 35, 60, 0.3)' }}>
              <h2 style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>
                <i className="fa-solid fa-train-subway"></i> Specifika lokální dopravy a metra
              </h2>
              <p style={{ color: '#fff', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Ať už jste v Tokiu, Ósace, nebo Soulu – <strong>orientace v místním metru opravdu není žádná sranda.</strong> Jedná se o jedny z nejrozsáhlejších dopravních sítí na světě. Různé linky často vlastní různé soukromé společnosti, přestupy pod zemí mohou trvat i 15 minut chůze a ve špičce vás čeká neuvěřitelné množství lidí. 
                <br /><br />
                Ale nebojte se – v ceně zájezdu je náš zkušený průvodce, který vás celým tímto "podzemním labyrintem" provede bez stresu a ukáže vám ty nejlepší triky, jak se vyhnout davům.
              </p>
              
              <div 
                className="glass" 
                style={{ borderRadius: '16px', overflow: 'hidden', cursor: 'zoom-in', position: 'relative', border: '2px solid rgba(255,255,255,0.1)' }}
                onClick={() => setLightboxPhoto({ 
                  src: resolveImage(activeDetailPlan.country.includes('Japonsko') 
                    ? 'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/SubwayTokyo.png' 
                    : 'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/seoul_subway_map.webp'), 
                  caption: `Mapa metra - ${activeDetailPlan.country}` 
                })}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '0.8rem', background: 'rgba(0,0,0,0.7)', textAlign: 'center', fontWeight: 'bold', zIndex: 2 }}>
                  <i className="fa-solid fa-magnifying-glass-plus"></i> Rozkliknout ukázku mapy metra ({activeDetailPlan.country.replace(/ .*/, '')})
                </div>
                <img 
                  src={resolveImage(activeDetailPlan.country.includes('Japonsko') 
                    ? 'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/SubwayTokyo.png' 
                    : 'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/seoul_subway_map.webp')} 
                  alt={`Mapa metra ${activeDetailPlan.country}`} 
                  style={{ width: '100%', height: '220px', objectFit: 'cover', opacity: 0.8, filter: 'brightness(0.9)', transition: 'transform 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} 
                />
              </div>
            </div>
          )}

          {/* Interactive Route Map Section */}
          <div style={{ marginBottom: '3rem' }}>
            <h2><i className="fa-solid fa-route" style={{ color: 'var(--accent-color)' }}></i> Interaktivní trasa zájezdu na mapě</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Zastávky na trase: {(activeDetailPlan.cities || ['Tokyo', 'Kyoto', 'Osaka']).join(' ➔ ')}
            </p>
            <div 
              ref={routeMapRef} 
              style={{ width: '100%', height: '400px', borderRadius: '20px', border: '1px solid var(--glass-border)', overflow: 'hidden' }}
            />
          </div>

          {/* Day-by-Day Program */}
          <h2><i className="fa-solid fa-list-check" style={{ color: 'var(--accent-color)' }}></i> Program zájezdu den po dni</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '1.5rem' }}>
            {(activeDetailPlan.days || []).map((d, idx) => (
              <div key={idx} className="glass" style={{ padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid var(--accent-color)' }}>
                <span style={{ color: 'var(--accent-color)', fontWeight: 'bold', fontSize: '0.9rem' }}>{d.day}</span>
                <h3 style={{ fontSize: '1.2rem', margin: '0.3rem 0' }}>{d.title}</h3>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>{d.desc}</p>
              </div>
            ))}
          </div>

          {(!activeDetailPlan.dates || activeDetailPlan.dates.length === 0) ? (
            <div style={{ marginTop: '3rem', textAlign: 'center', color: '#e74c3c' }}>
              <h3>Termíny pro tento zájezd jsou v tuto chvíli vyprodané</h3>
              <p style={{ color: 'var(--text-muted)' }}>Sledujte naše stránky, brzy vypíšeme nové termíny!</p>
            </div>
          ) : (
            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
              <button className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }} onClick={(e) => openBooking(activeDetailPlan, activeDetailPlan.dates[0], e)}>
                <i className="fa-solid fa-paper-plane"></i> Mám zájem o tento zájezd
              </button>
            </div>
          )}

          {/* Recenze k zájezdu */}
          <TripReviews planId={activeDetailPlan.id} />

        </div>
      ) : (
        <>
          <div className="glass planner-header" style={{ textAlign: 'center', padding: '2rem', borderRadius: '20px', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.4rem' }}>{t('planner.header.title', 'Vyberte si váš vysněný plán')}</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
              {t('planner.header.desc', 'Připravili jsme pro vás detailní itineráře. Klikněte na zájezd pro zobrazení fotek míst a trasy na mapě.')}
            </p>
            <button
              type="button"
              className="btn btn-primary"
              data-testid="custom-builder-open"
              onClick={() => setIsCustomBuilderOpen(true)}
              style={{ padding: '0.75rem 1.6rem', fontSize: '0.95rem' }}
            >
              <i className="fa-solid fa-wand-magic-sparkles"></i> Sestavit vlastní itinerář (AI Plánovač)
            </button>
          </div>

          <div className="itinerary-section">
            <div className="filter-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
              <div className="filter-group" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['vše', 'pro nováčky', 'zábava', 'poznávací', 'adrenalin', 'oblíbené'].map(f => (
                  <button 
                    key={f}
                    className={`filter-btn ${filter === f ? 'active' : ''}`}
                    onClick={() => setFilter(f)}
                  >
                    {f === 'oblíbené' ? <><i className="fa-solid fa-heart" style={{ color: '#e74c3c' }}></i> Oblíbené</> : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fa-solid fa-sort-amount-down" style={{ color: 'var(--accent-color)' }}></i>
                <select aria-label="Řazení zájezdů" className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="default">Doporučené</option>
                  <option value="price-asc">Nejlevnější</option>
                  <option value="price-desc">Nejdražší</option>
                </select>
              </div>
            </div>

            {/* Itinerary Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
              {filteredItineraries.map(item => {
                const isSoldOut = !item.dates || item.dates.length === 0;

                return (
                  <div 
                    key={item.id} 
                    role="button"
                    tabIndex={0}
                    className="glass" 
                    style={{ borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'transform 0.3s' }}
                    onClick={() => setActiveDetailPlan(item)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveDetailPlan(item); } }}
                  >
                    <div style={{ position: 'relative', height: '200px', background: '#222', overflow: 'hidden' }}>
                      <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span className="phrase-category-tag" style={{ position: 'absolute', top: 15, left: 15, zIndex: 2 }}>{item.tag}</span>
                      
                      {isSoldOut && (
                        <span style={{ position: 'absolute', bottom: 15, left: 15, background: 'rgba(231,76,60,0.95)', color: '#fff', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', zIndex: 2 }}>
                          <i className="fa-solid fa-circle-exclamation"></i> Plně obsazeno
                        </span>
                      )}

                      <button 
                        type="button"
                        aria-label={favorites.includes(item.id) ? 'Odebrat z oblíbených' : 'Přidat do oblíbených'}
                        aria-pressed={favorites.includes(item.id)}
                        onClick={(e) => toggleFavorite(item.id, e)} 
                        style={{ position: 'absolute', top: 15, right: 15, zIndex: 2, background: 'rgba(0,0,0,0.5)', border: 'none', color: favorites.includes(item.id) ? '#e74c3c' : '#fff', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer' }}
                      >
                        <i className="fa-solid fa-heart"></i>
                      </button>
                    </div>

                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{item.title}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{item.desc}</p>
                        
                        {/* Interactive Dates Pills / Sold Out Notice */}
                        {isSoldOut ? (
                          <div style={{ margin: '0.8rem 0', background: 'rgba(231,76,60,0.12)', padding: '0.6rem 0.8rem', borderRadius: '10px', border: '1px solid rgba(231,76,60,0.3)', color: '#ff6b6b', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <i className="fa-solid fa-circle-exclamation"></i> Termíny jsou momentálně plně obsazeny
                          </div>
                        ) : (
                          <div style={{ margin: '0.8rem 0' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                              <i className="fa-regular fa-calendar-check" style={{ color: 'var(--accent-color)' }}></i> Vyberte si termín:
                            </span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {item.dates.map((d, dIdx) => (
                                <button
                                  key={dIdx}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openBooking(item, d, e);
                                  }}
                                  style={{
                                    background: 'rgba(239,35,60,0.12)',
                                    border: '1px solid var(--accent-color)',
                                    color: 'var(--text-main)',
                                    padding: '4px 10px',
                                    borderRadius: '20px',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                  }}
                                  title="Klikněte pro rezervaci na tento termín"
                                >
                                  📅 {d}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0' }}>
                          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-color)' }}>{item.price.toLocaleString('cs-CZ')} Kč</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}><i className="fa-regular fa-clock"></i> {item.duration}</span>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                          {isSoldOut ? (
                            <button 
                              className="btn" 
                              disabled
                              style={{ flex: 1, background: 'rgba(255,255,255,0.1)', color: '#888', cursor: 'not-allowed' }}
                            >
                              Obsazeno
                            </button>
                          ) : (
                            <button 
                              className="btn btn-primary" 
                              style={{ flex: 1 }}
                              onClick={(e) => openBooking(item, item.dates[0], e)}
                            >
                              <i className="fa-solid fa-calendar-check"></i> Rezervovat
                            </button>
                          )}
                          <button 
                            className="btn" 
                            style={{ background: compareList.includes(item.id) ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid var(--glass-border)' }}
                            onClick={(e) => toggleCompare(item.id, e)}
                            title="Porovnat"
                          >
                            <i className="fa-solid fa-scale-balanced"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}


      {/* Booking & Payment Wizard Modal */}
      {isBookingOpen && (
        <div className="booking-modal active" role="dialog" aria-modal="true" aria-label="Rezervace a platba zájezdu" onClick={() => setIsBookingOpen(false)}>
          <div className="glass modal-content" style={{ maxWidth: '620px' }} onClick={e => e.stopPropagation()}>
            <button type="button" aria-label="Zavřít" className="close-modal" onClick={() => setIsBookingOpen(false)}><i className="fa-solid fa-xmark"></i></button>
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-color)' }}>Rezervace & Platba zájezdu</h3>

            <div className="step-indicator" style={{ marginBottom: '1.5rem' }}>
              <div className={`step-dot ${bookingStep >= 1 ? 'active' : ''}`}>
                <div className="step-dot-circle">1</div>
                <div className="step-dot-label">Termín</div>
              </div>
              <div className="step-line"></div>
              <div className={`step-dot ${bookingStep >= 2 ? 'active' : ''}`}>
                <div className="step-dot-circle">2</div>
                <div className="step-dot-label">Údaje</div>
              </div>
              <div className="step-line"></div>
              <div className={`step-dot ${bookingStep >= 3 ? 'active' : ''}`}>
                <div className="step-dot-circle">3</div>
                <div className="step-dot-label">Platba</div>
              </div>
            </div>

            {bookingStep === 4 || bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <i className="fa-solid fa-circle-check" style={{ fontSize: '3.5rem', color: '#2ecc71', marginBottom: '1rem' }}></i>
                <h2>Rezervace byla úspěšně přijata!</h2>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '1.05rem' }}>
                  Děkujeme! Potvrzení rezervace a pokyny byly odeslány na e-mail <strong>{bookEmail}</strong>.
                </p>

                {paymentMethod === 'qr' && (
                  <div className="glass" style={{ margin: '1.5rem 0', padding: '1.2rem', textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}>
                    <h4>Instrukce k platbě převodem:</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0.4rem 0' }}>Číslo účtu: <strong>2800123456/2010</strong> &bull; VS: <strong>2026001</strong></p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--accent-color)', fontWeight: 'bold' }}>Částka k úhradě: {selectedPlanPrice.toLocaleString('cs-CZ')} Kč</p>
                  </div>
                )}

                <button className="btn btn-primary" style={{ marginTop: '1rem', padding: '0.8rem 2rem' }} onClick={() => setIsBookingOpen(false)}>
                  Zavřít okno
                </button>
              </div>
            ) : (
              <form onSubmit={handleFinalizeBooking}>
                {/* Step 1: Select Date */}
                {bookingStep === 1 && (
                  <div className="step-content active">
                    <div className="booking-summary-box" style={{ background: 'rgba(255,255,255,0.04)', padding: '1.2rem', borderRadius: '14px', marginBottom: '1.5rem' }}>
                      <div className="booking-summary-row" style={{ marginBottom: '0.5rem' }}>
                        <span><i className="fa-solid fa-map-location-dot"></i> Zájezd</span>
                        <strong style={{ color: 'var(--accent-color)' }}>{selectedPlan}</strong>
                      </div>
                      <div className="booking-summary-row">
                        <span><i className="fa-solid fa-tag"></i> Cena</span>
                        <strong>{selectedPlanPrice.toLocaleString('cs-CZ')} Kč</strong>
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                      <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                        <i className="fa-regular fa-calendar-days"></i> Vyberte termín odletu:
                      </label>
                      {availableDatesForBooking.length > 0 ? (
                        <select 
                          value={selectedDate} 
                          onChange={e => setSelectedDate(e.target.value)}
                          style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(15,15,25,0.9)', color: '#fff' }}
                        >
                          {availableDatesForBooking.map((d, idx) => (
                            <option key={idx} value={d}>{d}</option>
                          ))}
                        </select>
                      ) : (
                        <input 
                          type="text" 
                          value={selectedDate} 
                          onChange={e => setSelectedDate(e.target.value)} 
                          style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: '#fff' }} 
                        />
                      )}
                    </div>

                    <div className="step-nav" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                      <button type="button" className="btn btn-primary" onClick={() => setBookingStep(2)}>
                        Pokračovat k údajům <i className="fa-solid fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Passenger Details */}
                {bookingStep === 2 && (
                  <div className="step-content active">
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '1rem' }}>
                      <div className="form-group">
                        <label>Jméno a Příjmení</label>
                        <input type="text" required value={bookName} onChange={e => setBookName(e.target.value)} placeholder="Jan Novák" style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: '#fff' }} />
                      </div>
                      <div className="form-group">
                        <label>Věk</label>
                        <input type="number" required value={bookAge} onChange={e => setBookAge(e.target.value)} placeholder="30" style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: '#fff' }} />
                      </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label>E-mail pro zaslání potvrzení</label>
                      <input type="email" required value={bookEmail} onChange={e => setBookEmail(e.target.value)} placeholder="jan@email.cz" style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: '#fff' }} />
                    </div>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                      <label>Telefonní číslo</label>
                      <input type="tel" required value={bookPhone} onChange={e => setBookPhone(e.target.value)} placeholder="+420 123 456 789" style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: '#fff' }} />
                    </div>

                    <div className="step-nav" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                      <button type="button" className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }} onClick={() => setBookingStep(1)}>
                        <i className="fa-solid fa-arrow-left"></i> Zpět
                      </button>
                      <button type="button" className="btn btn-primary" onClick={() => { if(bookName && bookEmail && bookPhone) setBookingStep(3); else alert('Vyplňte prosím všechna pole!'); }}>
                        K platbě <i className="fa-solid fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment Choice */}
                {bookingStep === 3 && (
                  <div className="step-content active">
                    <h4 style={{ marginBottom: '1rem' }}>Zvolte způsob platby</h4>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '1.2rem' }}>
                      <button 
                        type="button" 
                        className={`mode-tab-btn ${paymentMethod === 'stripe' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('stripe')}
                        style={{ flex: 1, padding: '0.7rem' }}
                      >
                        <i className="fa-brands fa-stripe fa-lg" style={{ color: '#6772e5' }}></i> Kartou Online (Stripe)
                      </button>
                      <button 
                        type="button" 
                        className={`mode-tab-btn ${paymentMethod === 'qr' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('qr')}
                        style={{ flex: 1, padding: '0.7rem' }}
                      >
                        <i className="fa-solid fa-qrcode"></i> QR Platba / Převod
                      </button>
                    </div>

                    {paymentMethod === 'stripe' ? (
                      <div className="glass" style={{ padding: '1.2rem', borderRadius: '14px', background: 'rgba(255,255,255,0.03)' }}>
                        <div className="form-group" style={{ marginBottom: '0.8rem' }}>
                          <label style={{ fontSize: '0.85rem' }}>Číslo karty</label>
                          <input type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.4)', color: '#fff' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <div className="form-group">
                            <label style={{ fontSize: '0.85rem' }}>Platnost</label>
                            <input type="text" value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.4)', color: '#fff' }} />
                          </div>
                          <div className="form-group">
                            <label style={{ fontSize: '0.85rem' }}>CVC / CVV</label>
                            <input type="password" value={cardCvc} onChange={e => setCardCvc(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.4)', color: '#fff' }} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="glass" style={{ padding: '1.2rem', borderRadius: '14px', textAlign: 'center', background: 'rgba(255,255,255,0.03)' }}>
                        <div style={{ background: '#fff', padding: '10px', display: 'inline-block', borderRadius: '12px', marginBottom: '0.8rem' }}>
                          {/* QR Code image simulation */}
                          <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SPD*1.0*ACC:CZ6808000000001234567890*AM:49900.00*CC:CZK*MSG:TedovaAsia" alt="QR Platba" style={{ width: '130px', height: '130px' }} />
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                          Naskenujte QR kód ve své bankovní aplikaci (Česká spořitelna, AirBank, ČSOB, KB atd.).
                        </p>
                      </div>
                    )}

                    <div className="step-nav" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                      <button type="button" className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }} onClick={() => setBookingStep(2)}>
                        <i className="fa-solid fa-arrow-left"></i> Zpět
                      </button>
                      <button type="submit" className="btn btn-primary" disabled={isProcessingPayment} style={{ padding: '0.8rem 1.8rem' }}>
                        {isProcessingPayment ? <><i className="fa-solid fa-spinner fa-spin"></i> Zpracovávám...</> : <><i className="fa-solid fa-lock"></i> Zaplatit {selectedPlanPrice.toLocaleString('cs-CZ')} Kč</>}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      )}
      {/* Photo Lightbox Modal */}
      {lightboxPhoto && (
        <div
          onClick={() => setLightboxPhoto(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '1.5rem',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <button
            onClick={() => setLightboxPhoto(null)}
            style={{
              position: 'fixed', top: '1.2rem', right: '1.4rem',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff', borderRadius: '50%',
              width: '44px', height: '44px',
              fontSize: '1.2rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,35,60,0.6)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            title="Zavřít (ESC)"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          <img
            src={lightboxPhoto.src}
            alt={lightboxPhoto.caption}
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '90vw', maxHeight: '82vh',
              objectFit: 'contain',
              borderRadius: '16px',
              boxShadow: '0 24px 80px rgba(0,0,0,0.8)'
            }}
          />

          {lightboxPhoto.caption && (
            <div
              onClick={e => e.stopPropagation()}
              style={{
                marginTop: '1rem',
                display: 'flex', alignItems: 'center', gap: '8px',
                color: '#fff', fontSize: '1rem', fontWeight: 600
              }}
            >
              <i className="fa-solid fa-location-dot" style={{ color: 'var(--accent-color)' }}></i>
              {lightboxPhoto.caption}
            </div>
          )}

          <div style={{ marginTop: '0.5rem', color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>
            Klikněte mimo obrázek nebo stiskněte <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '1px 6px', borderRadius: '4px' }}>ESC</kbd> pro zavření
          </div>
        </div>
      )}

      {/* Floating Compare Button */}
      {compareList.length > 0 && !activeDetailPlan && !isCompareModalOpen && (
        <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 900 }}>
          <button 
            className="btn btn-primary" 
            style={{ padding: '1rem 2rem', borderRadius: '30px', boxShadow: '0 10px 30px rgba(239,35,60,0.4)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}
            onClick={() => setIsCompareModalOpen(true)}
          >
            <i className="fa-solid fa-scale-balanced"></i> Porovnat vybrané ({compareList.length})
          </button>
        </div>
      )}

      {/* Compare Modal */}
      {isCompareModalOpen && (
        <div 
          className="cms-modal active" 
          onClick={() => setIsCompareModalOpen(false)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000 }}
        >
          <div 
            className="glass" 
            style={{ width: '100%', maxWidth: '1200px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', borderRadius: '24px', position: 'relative' }} 
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsCompareModalOpen(false)} 
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', fontSize: '1.2rem', cursor: 'pointer' }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <h2 style={{ marginBottom: '2rem', fontSize: '1.8rem' }}><i className="fa-solid fa-scale-balanced" style={{ color: 'var(--accent-color)' }}></i> Porovnání zájezdů</h2>
            
            {(() => {
              const allComparedCities = Array.from(new Set(
                compareList.flatMap(id => {
                  const p = itineraries.find(it => it.id === id);
                  return p ? (p.cities || []) : [];
                })
              )).sort();

              return (
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${compareList.length}, minmax(280px, 1fr))`, gap: '1.5rem' }}>
                  {compareList.map(id => {
                    const plan = itineraries.find(it => it.id === id);
                    if (!plan) return null;
                    return (
                      <div key={id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ height: '180px', position: 'relative' }}>
                          <img src={plan.image} alt={plan.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button 
                            onClick={() => setCompareList(prev => prev.filter(p => p !== id))} 
                            style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(231,76,60,0.9)', border: 'none', color: '#fff', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}
                            title="Odebrat z porovnání"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', minHeight: '60px' }}>{plan.title}</h3>
                          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-color)', marginBottom: '1.5rem' }}>
                            {plan.price.toLocaleString('cs-CZ')} Kč
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.95rem', flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                              <span style={{ color: 'var(--text-muted)' }}>Délka:</span>
                              <span style={{ fontWeight: 600 }}>{plan.duration}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                              <span style={{ color: 'var(--text-muted)' }}>Země:</span>
                              <span style={{ fontWeight: 600 }}>{plan.country}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                              <span style={{ color: 'var(--text-muted)' }}>Styl:</span>
                              <span style={{ fontWeight: 600 }}>{plan.tag}</span>
                            </div>
                            
                            <div style={{ marginTop: '0.8rem' }}>
                              <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.8rem', fontWeight: 'bold' }}>Města v programu:</span>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {allComparedCities.map(city => {
                                  const includesCity = (plan.cities || []).includes(city);
                                  return (
                                    <div key={city} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: includesCity ? '#fff' : 'rgba(255,255,255,0.3)' }}>
                                      {includesCity ? (
                                        <i className="fa-solid fa-check" style={{ color: '#2ecc71', width: '16px' }}></i>
                                      ) : (
                                        <i className="fa-solid fa-xmark" style={{ color: '#e74c3c', width: '16px' }}></i>
                                      )}
                                      <span style={{ textDecoration: includesCity ? 'none' : 'line-through' }}>{city}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                          
                          <button 
                            className="btn btn-primary" 
                            style={{ width: '100%', marginTop: '2rem' }}
                            onClick={() => {
                              setIsCompareModalOpen(false);
                              setActiveDetailPlan(plan);
                            }}
                          >
                            Detail zájezdu
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
            {compareList.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                Nebyly vybrány žádné zájezdy k porovnání.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Custom Itinerary Builder Modal */}
      {isCustomBuilderOpen && (
        <div className="booking-modal active" role="dialog" aria-modal="true" aria-label="Sestavit vlastní itinerář" onClick={() => setIsCustomBuilderOpen(false)}>
          <div className="glass modal-content" style={{ maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <button type="button" aria-label="Zavřít" className="close-modal" onClick={() => setIsCustomBuilderOpen(false)}><i className="fa-solid fa-xmark"></i></button>
            <h3 style={{ marginBottom: '0.4rem', color: 'var(--accent-color)' }}>
              <i className="fa-solid fa-wand-magic-sparkles"></i> Sestavit vlastní itinerář
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.2rem' }}>
              Nakombinujte si města, délku a styl cesty a nechte si vygenerovat program pomocí AI.
            </p>

            <form onSubmit={handleSaveCustomItinerary}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Název vašeho itineráře</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={e => setCustomTitle(e.target.value)}
                  placeholder="Např. Moje jarní cesta po Japonsku"
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label>Země</label>
                  <select value={customCountry} onChange={e => setCustomCountry(e.target.value)} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(15,15,25,0.9)', color: '#fff' }}>
                    <option value="Japonsko 🇯🇵">Japonsko 🇯🇵</option>
                    <option value="Jižní Korea 🇰🇷">Jižní Korea 🇰🇷</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Délka cesty</label>
                  <select value={customDuration} onChange={e => setCustomDuration(e.target.value)} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(15,15,25,0.9)', color: '#fff' }}>
                    <option value="7 dní">7 dní</option>
                    <option value="10 dní">10 dní</option>
                    <option value="12 dní">12 dní</option>
                    <option value="14 dní">14 dní</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Styl</label>
                  <select value={customTag} onChange={e => setCustomTag(e.target.value)} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(15,15,25,0.9)', color: '#fff' }}>
                    <option value="poznávací">Poznávací</option>
                    <option value="pro nováčky">Pro nováčky</option>
                    <option value="zábava">Zábava</option>
                    <option value="adrenalin">Adrenalin</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Zastávky na trase (vykreslí se na interaktivní mapě):</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {Object.keys(cityCoords).map(city => {
                    const active = customCities.includes(city);
                    return (
                      <button
                        key={city}
                        type="button"
                        onClick={() => toggleCustomCity(city)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          border: active ? '1px solid var(--accent-color)' : '1px solid var(--glass-border)',
                          background: active ? 'var(--accent-color)' : 'rgba(255,255,255,0.06)',
                          color: '#fff',
                          fontSize: '0.85rem',
                          cursor: 'pointer'
                        }}
                      >
                        {active ? '✓ ' : '+ '}{city}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <label style={{ fontWeight: 600 }}>Program den po dni:</label>
                <button
                  type="button"
                  className="btn"
                  onClick={handleGenerateAiDays}
                  disabled={isGeneratingAiPlan}
                  style={{ background: 'rgba(239,35,60,0.18)', border: '1px solid var(--accent-color)', color: '#fff', padding: '6px 14px', fontSize: '0.85rem' }}
                >
                  {isGeneratingAiPlan ? <><i className="fa-solid fa-spinner fa-spin"></i> Generuji přes Gemini AI...</> : <><i className="fa-solid fa-robot"></i> Vygenerovat program pomocí AI</>}
                </button>
              </div>

              {aiPlanError && (
                <div role="alert" style={{ marginBottom: '1rem', padding: '0.8rem', borderRadius: '10px', background: 'rgba(231, 76, 60, 0.14)', border: '1px solid #e74c3c', color: '#ff8a80', fontSize: '0.85rem' }}>
                  <i className="fa-solid fa-triangle-exclamation"></i> {aiPlanError}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
                {customDays.map((d, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.04)', padding: '0.8rem', borderRadius: '12px', borderLeft: '3px solid var(--accent-color)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--accent-color)', fontSize: '0.85rem' }}>{d.day} – {d.title}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>{d.desc}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }} onClick={() => setIsCustomBuilderOpen(false)}>
                  Zrušit
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="fa-solid fa-check"></i> Uložit a zobrazit itinerář
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
