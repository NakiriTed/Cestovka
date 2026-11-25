import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, collection, getDocs, setDoc, doc, deleteDoc } from '../firebase';

const DataContext = createContext();

const DATA_VERSION = '5'; // bump this whenever INITIAL data changes

const INITIAL_ITINERARIES = [
  {
    id: 'jp-gold',
    title: 'Zlatý okruh Japonskem (14 dní)',
    tag: 'pro nováčky',
    country: 'Japonsko 🇯🇵',
    duration: '14 dní',
    price: 64900,
    image: 'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/tokyo-japan.jpg',
    desc: 'Tokio, Kjótó, Ósaka, Fudži a Nara. Nejpopulárnější trasa pro první návštěvu Japonska.',
    dates: ['14. 5. - 28. 5. 2026', '1. 9. - 15. 9. 2026'],
    cities: ['Tokyo', 'Fuji (Kawaguchiko)', 'Kyoto', 'Nara', 'Osaka', 'Hiroshima'],
    photos: [
      'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/tokyo-japan.jpg',
      'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/Asakusa.jpg',
      'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/Fuji.png',
      'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/Kyoto-Fushimi.jpg',
      'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/Kyoto-Arashiyama.jpg',
      'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/Kyoto-Kiyomizu.jpg',
      'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/Kyoto-Nara.jpg',
      'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/Osaka-dotonbori.jpg',
      'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/Himeji.jpg'
    ],
    accommodation: {
      hotels: [
        { city: 'Tokio', name: 'Hotel Shinjuku Granbell', pricePerNight: 3200 },
        { city: 'Kawaguchiko (Fudži)', name: 'Fuji Marriott Resort', pricePerNight: 4100 },
        { city: 'Kjóto', name: 'Ryokan Arashiyama Benkei', pricePerNight: 2900 },
        { city: 'Ósaka', name: 'Dormy Inn Namba', pricePerNight: 2200 },
        { city: 'Hirošima', name: 'Sheraton Grand Hiroshima', pricePerNight: 2500 }
      ],
      included: [
        'Letenky Praha – Tokio – Praha (economy)',
        'Ubytování ve 3–4* hotelech (13 nocí)',
        'Snídaně každý den',
        'Průvodce po celou dobu zájezdu',
        'Bullet train (Šinkansen) Tokio – Kjóto',
        'Vstupné na Fudži, Hrad Himeji a Chrám Senso-ji'
      ],
      notIncluded: [
        'Obědy a večeře',
        'Osobní výdaje a suvenýry',
        'Cestovní pojištění',
        'Víza (Japonsko – bezvisový styk pro ČR)'
      ]
    },
    days: [
      { day: 'Den 1', title: 'Odlet z Prahy/Vídně', desc: 'Sraz na letišti, odbavení a let do Tokia.' },
      { day: 'Den 2', title: 'Přílet do Tokia & Shibuya', desc: 'Ubytování v hotelu, slavná křižovatka Shibuya.' },
      { day: 'Den 3', title: 'Historické & Moderní Tokio', desc: 'Chrám Senso-ji, Akihabara a výhled z Tokyo Tower.' },
      { day: 'Den 4', title: 'Výlet k hoře Fudži (Kawaguchiko)', desc: 'Jezero Kawaguchiko a pagoda Chureito.' },
      { day: 'Den 5-8', title: 'Kjótó & Chrámy', desc: 'Šinkansenem do Kjótó. Zlatý pavilon a Fushimi Inari.' },
      { day: 'Den 9-11', title: 'Nara & Kulinářská Ósaka', desc: 'Jelínci v Naru a gurmánská čtvrť Dotonbori v Ósace.' },
      { day: 'Den 12-13', title: 'Hirošima & Ostrov Mijadžima', desc: 'Památník míru a plovoucí brána Torii.' },
      { day: 'Den 14', title: 'Návrat do ČR', desc: 'Poslední nákupy suvenýrů a odlet domů.' }
    ]
  },
  {
    id: 'kr-seoul',
    title: 'Korejská metropole & Historie (10 dní)',
    tag: 'poznávací',
    country: 'Jižní Korea 🇰🇷',
    duration: '10 dní',
    price: 49900,
    image: 'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/Seoul.jpg',
    desc: 'Soul, Pusan, historické Gyeongju a ostrov Jeju. Spojení historie s K-popem a gastronomií.',
    dates: ['1. 6. - 10. 6. 2026', '10. 10. - 20. 10. 2026'],
    cities: ['Soul (Seoul)', 'Pusan (Busan)'],
    photos: [
      'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/Seoul.jpg'
    ],
    accommodation: {
      hotels: [
        { city: 'Soul', name: 'Hotel Lotte City Mapo', pricePerNight: 2300 },
        { city: 'Pusan', name: 'Hotel Haeundae', pricePerNight: 1900 }
      ],
      included: [
        'Letenky Praha – Soul – Praha (economy)',
        'Ubytování ve 3–4* hotelech (9 nocí)',
        'Snídaně každý den',
        'Průvodce po celou dobu zájezdu',
        'Vysokorychlostní vlak KTX Soul – Pusan',
        'Vstup do paláce Gyeongbokgung'
      ],
      notIncluded: [
        'Obědy a večeře',
        'Osobní výdaje a suvenýry',
        'Cestovní pojištění',
        'Hanbok oblečení na pronájem'
      ]
    },
    days: [
      { day: 'Den 1', title: 'Odlet z Prahy', desc: 'Příprava a let do Soulu.' },
      { day: 'Den 2', title: 'Přílet do Soulu & Myeongdong', desc: 'Procházka nákupní a gurmánskou čtvrtí Myeongdong.' },
      { day: 'Den 3', title: 'Královský palác Gyeongbokgung', desc: 'Návštěva paláce v tradičním oděvu Hanbok.' },
      { day: 'Den 4-6', title: 'Rychlovlakem KTX do Pusanu', desc: 'Pláž Haeundae a barevná vesnice Gamcheon.' },
      { day: 'Den 7-9', title: 'Ostrov Čedžu (Jeju)', desc: 'Přelet na sopečný ostrov Jeju.' },
      { day: 'Den 10', title: 'Návrat do ČR', desc: 'Odlet ze Soulu zpět do Prahy.' }
    ]
  },
  {
    id: 'jp-anime',
    title: 'Akihabara & Pop-Kultura (12 dní)',
    tag: 'zábava',
    country: 'Japonsko 🇯🇵',
    duration: '12 dní',
    price: 58900,
    image: 'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/Akihabara.jpg',
    desc: 'Anime, pokémoni, herny v Akihabaře a zábavní park Universal Studios v Ósace.',
    dates: [], // Obsazeno pro ukázku plně obsazeného termínu
    cities: ['Tokyo', 'Kyoto', 'Osaka'],
    photos: [
      'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/Akihabara.jpg',
      'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/SubwayTokyo.png',
      'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/Tokyo_Asakusa_Kannon.jpg',
      'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/Osaka-castle.jpg',
      'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/Osaka-shinsekai.jpg'
    ],
    accommodation: {
      hotels: [
        { city: 'Tokio', name: 'APA Hotel Shinjuku Kabukicho Tower', pricePerNight: 2600 },
        { city: 'Kjóto', name: 'Super Hotel Kyoto', pricePerNight: 1800 },
        { city: 'Ósaka', name: 'Dormy Inn Premium Namba', pricePerNight: 2200 }
      ],
      included: [
        'Letenky Praha – Tokio – Praha (economy)',
        'Ubytování ve 3–4* hotelech (11 nocí)',
        'Snídaně každý den',
        'Průvodce po celou dobu zájezdu',
        'Vstup do Pokémon Center Tokyo',
        'Vstup do Universal Studios Japan Ósaka'
      ],
      notIncluded: [
        'Obědy a večeře',
        'Aktivity v herních hernách (mince)',
        'Osobní výdaje a suvenýry',
        'Cestovní pojištění'
      ]
    },
    days: [
      { day: 'Den 1-4', title: 'Tokijský pop-kulturní ráj', desc: 'Akihabara, Pokémon Center, Ghibli Museum, Harajuku.' },
      { day: 'Den 5-8', title: 'Kjótó & Nintendo world', desc: 'Kjótó a výlet do nového Super Nintendo World.' },
      { day: 'Den 9-11', title: 'Ósaka Universal Studios', desc: 'Zábava v Universal Studios Japan.' },
      { day: 'Den 12', title: 'Odlet zpět', desc: 'Návrat do ČR.' }
    ]
  }
];

const INITIAL_GALLERY = [
  { id: 1, type: 'photo', title: 'Svatyně Fushimi Inari', country: 'Japonsko', city: 'Kyoto', place: 'Kjótó, Japonsko', src: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=1200&q=80' },
  { id: 2, type: 'photo', title: 'Tokyo Tower v noci', country: 'Japonsko', city: 'Tokyo', place: 'Tokio, Japonsko', src: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1200&q=80' },
  { id: 3, type: 'photo', title: 'Tradiční palác Gyeongbokgung', country: 'Jižní Korea', city: 'Soul', place: 'Soul, Jižní Korea', src: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1200&q=80' },
  { id: 4, type: 'photo', title: 'Bambusový háj Arashiyama', country: 'Japonsko', city: 'Kyoto', place: 'Kjótó, Japonsko', src: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80' },
  { id: 5, type: 'photo', title: 'Gurmánská čtvrť Dotonbori', country: 'Japonsko', city: 'Osaka', place: 'Ósaka, Japonsko', src: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=1200&q=80' },
  { id: 6, type: 'photo', title: 'Hora Fudži a Pagoda Chureito', country: 'Japonsko', city: 'Fuji', place: 'Kawaguchiko, Japonsko', src: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=1200&q=80' },
  { id: 7, type: 'video', title: 'Tedův Východní Svět - Cestování po Asii', country: 'Japonsko', city: 'Tokyo', place: 'Japonsko & Korea', src: 'https://www.youtube.com/embed/EDXnc--w5gU' }
];

const INITIAL_THREADS = [
  {
    id: 1,
    title: 'Jaké jsou nejlepší ramen restaurace v Tokiu?',
    author: 'Tadeáš (Ted)',
    category: 'Cestopisy & Tipy',
    date: '24. 09. 2026',
    content: 'Pokud chystáte cestu do Tokia, určitě doporučuji navštívit Ichiran v Shibuyi nebo Afuri v Ebisu s osvěžující příchutí Yuzu. Máte vy nějaké své nejoblíbenější tajné místo?',
    replies: [
      { id: 101, author: 'Martin_P', date: '24. 09. 2026', text: 'Určitě doporučuji Fuunji v Shinjuku na Tsukemen (namáčecí nudle). Vždycky je tam fronta, ale stojí to za každou minutu!' },
      { id: 102, author: 'Tadeáš (Ted)', date: '24. 09. 2026', text: 'Díky za tip! Fuunji mám taky na seznamu pro další skupinu.' }
    ]
  },
  {
    id: 2,
    title: 'Hledám parťáka na červnový zájezd do Japonska & Koreje',
    author: 'Petr_K',
    category: 'Hledám parťáka',
    date: '22. 09. 2026',
    content: 'Ahoj všem! Chystám se na kombinovaný zájezd v termínu 1. 6. - 16. 6. 2026. Hledám k sobě parťáka/parťáčku na dvoulůžkový pokoj, abychom nemuseli připlácet za single pokoj. Napište mi sem nebo do zpráv!',
    replies: [
      { id: 201, author: 'Jana_M', date: '23. 09. 2026', text: 'Ahoj Petře, uvažuji o tomto termínu! Napíšu ti zprávu do profilu.' }
    ]
  }
];

export function DataProvider({ children }) {
  const [itineraries, setItineraries] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [threads, setThreads] = useState([]);
  const [mediaMap, setMediaMap] = useState({});
  const [reverseMediaMap, setReverseMediaMap] = useState({});
  const [loading, setLoading] = useState(true);

  const extractFileName = (url) => {
    if (typeof url !== 'string') return '';
    const storagePrefix = 'https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/';
    if (url.startsWith(storagePrefix)) return decodeURIComponent(url.slice(storagePrefix.length));
    if (url.startsWith('/img/')) return decodeURIComponent(url.slice(5));
    return url;
  };

  const resolveWithMap = (url, mMap) => {
    if (!url || typeof url !== 'string') return url;
    if (url.startsWith('data:')) return url;
    const fileName = extractFileName(url);
    return mMap[fileName] || mMap[url] || url;
  };

  const resolveItineraryImages = (item, mMap) => ({
    ...item,
    image: resolveWithMap(item.image, mMap),
    photos: Array.isArray(item.photos) ? item.photos.map(p => resolveWithMap(p, mMap)) : item.photos,
  });

  const resolveImage = (url) => resolveWithMap(url, mediaMap);
  const getMediaKey = (src) => reverseMediaMap[src] || src;

  // Fetch data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [itinsSnap, mediaSnap, galSnap, threadsSnap] = await Promise.all([
          getDocs(collection(db, 'itineraries')),
          getDocs(collection(db, 'itineraries', '_media', 'items')),
          getDocs(collection(db, 'gallery')),
          getDocs(collection(db, 'forum_threads')),
        ]);

        const mMap = {};
        const revMap = {};
        mediaSnap.docs.forEach(d => {
          const data = d.data();
          if (data.dataUrl) {
            const name = data.name || d.id;
            mMap[d.id] = data.dataUrl;
            mMap[name] = data.dataUrl;
            const fullUrl = `https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/${name}`;
            mMap[fullUrl] = data.dataUrl;
            revMap[data.dataUrl] = fullUrl;
          }
        });
        setMediaMap(mMap);
        setReverseMediaMap(revMap);

        const loadedItins = itinsSnap.docs
          .filter(d => d.id !== '_media')
          .map(d => resolveItineraryImages({ id: d.id, ...d.data() }, mMap));

        const loadedGal = galSnap.docs.map(d => {
          const item = { id: isNaN(d.id) ? d.id : Number(d.id), ...d.data() };
          return { ...item, src: resolveWithMap(item.src, mMap) };
        });

        const loadedThreads = threadsSnap.docs.map(d => ({ id: isNaN(d.id) ? d.id : Number(d.id), ...d.data() }));

        const fallbackItins = INITIAL_ITINERARIES.map(it => resolveItineraryImages(it, mMap));
        setItineraries(loadedItins.length ? loadedItins : fallbackItins);
        setGalleryItems(loadedGal.length ? loadedGal : INITIAL_GALLERY);
        setThreads(loadedThreads.length ? loadedThreads : INITIAL_THREADS);
      } catch (err) {
        console.error('Chyba při načítání dat z Firestore:', err);
        setItineraries(INITIAL_ITINERARIES);
        setGalleryItems(INITIAL_GALLERY);
        setThreads(INITIAL_THREADS);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const registerMediaItem = (docId, name, dataUrl) => {
    const fullUrl = `https://storage.googleapis.com/cestovka-55f10.firebasestorage.app/img/${docId}`;
    setMediaMap(prev => ({ ...prev, [docId]: dataUrl, [name]: dataUrl, [fullUrl]: dataUrl }));
    setReverseMediaMap(prev => ({ ...prev, [dataUrl]: fullUrl }));
    return dataUrl;
  };

  const dehydrateItinerary = (data) => ({
    ...data,
    image: reverseMediaMap[data.image] || data.image,
    photos: Array.isArray(data.photos) ? data.photos.map(p => reverseMediaMap[p] || p) : data.photos,
  });

  // Itineraries CRUD
  const addItinerary = async (newItem) => {
    const item = { ...newItem, id: newItem.id || `plan-${Date.now()}` };
    setItineraries(prev => [item, ...prev]);
    const { id, ...data } = item;
    await setDoc(doc(db, 'itineraries', id), dehydrateItinerary(data));
  };

  const updateItinerary = async (id, updatedItem) => {
    setItineraries(prev => prev.map(item => item.id === id ? { ...item, ...updatedItem } : item));
    const { id: _, ...data } = updatedItem;
    await setDoc(doc(db, 'itineraries', id), dehydrateItinerary(data), { merge: true });
  };

  const deleteItinerary = async (id) => {
    setItineraries(prev => prev.filter(item => item.id !== id));
    await deleteDoc(doc(db, 'itineraries', id));
  };

  // Gallery CRUD
  const addGalleryItem = async (newItem) => {
    const item = { ...newItem, id: Date.now() };
    setGalleryItems(prev => [item, ...prev]);
    const { id, ...data } = item;
    await setDoc(doc(db, 'gallery', String(id)), data);
  };

  const updateGalleryItem = async (id, updatedItem) => {
    setGalleryItems(prev => prev.map(item => item.id === id ? { ...item, ...updatedItem } : item));
    const { id: _, ...data } = updatedItem;
    await setDoc(doc(db, 'gallery', String(id)), data, { merge: true });
  };

  const deleteGalleryItem = async (id) => {
    setGalleryItems(prev => prev.filter(item => item.id !== id));
    await deleteDoc(doc(db, 'gallery', String(id)));
  };

  // Forum Threads CRUD
  const addThread = async (newItem) => {
    const item = { ...newItem, id: Date.now() };
    setThreads(prev => [item, ...prev]);
    const { id, ...data } = item;
    await setDoc(doc(db, 'forum_threads', String(id)), data);
  };

  const updateThread = async (id, updatedItem) => {
    setThreads(prev => prev.map(item => item.id === id ? { ...item, ...updatedItem } : item));
    const { id: _, ...data } = updatedItem;
    await setDoc(doc(db, 'forum_threads', String(id)), data, { merge: true });
  };

  const deleteThread = async (id) => {
    setThreads(prev => prev.filter(item => item.id !== id));
    await deleteDoc(doc(db, 'forum_threads', String(id)));
  };

  return (
    <DataContext.Provider value={{
      itineraries,
      addItinerary,
      updateItinerary,
      deleteItinerary,
      galleryItems,
      addGalleryItem,
      updateGalleryItem,
      deleteGalleryItem,
      threads,
      addThread,
      updateThread,
      deleteThread,
      resolveImage,
      getMediaKey,
      registerMediaItem,
      loading
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
