import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const serviceAccountPath = join(__dirname, 'service-account.json');
let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
} catch {
  console.error('❌ Nenalezen service-account.json');
  process.exit(1);
}

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
db.settings({ databaseId: 'cestovka' }); // Nastavení ID databáze

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

async function seed() {
  console.log('🚀 Začínám ukládat data do Firestore...');
  const itinsRef = db.collection('itineraries');
  
  for (const it of INITIAL_ITINERARIES) {
    const { id, ...data } = it;
    await itinsRef.doc(id).set(data);
    console.log(`✅ Uloženo: ${id}`);
  }

  const galRef = db.collection('gallery');
  for (const g of INITIAL_GALLERY) {
    const { id, ...data } = g;
    await galRef.doc(String(id)).set(data);
    console.log(`✅ Uložena fotka galerie: ${id}`);
  }
  
  console.log('🎉 Vše hotovo!');
  process.exit(0);
}

seed().catch(console.error);
