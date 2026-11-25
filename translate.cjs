const fs = require('fs');

const csFile = 'public/lang/cs.json';
const enFile = 'public/lang/en.json';

const cs = JSON.parse(fs.readFileSync(csFile, 'utf8'));
const en = JSON.parse(fs.readFileSync(enFile, 'utf8'));

// About translations
cs.about = {
  title: 'O mně — Tedův východní svět',
  bio: 'Ahoj! Jmenuji se Tadeáš (Ted). Asijská kultura, gastronomie a cestování po Japonsku a Jižní Koreji mě naprosto pohltily.',
  travelDesc: 'Založil jsem projekt Tedův východní svět, abych pomohl lidem objevovat tyto nádherné země bez obav z jazykové bariéry.'
};
en.about = {
  title: 'About Me — Ted\'s Eastern World',
  bio: 'Hi! My name is Tadeáš (Ted). I am completely captivated by Asian culture, gastronomy, and traveling across Japan and South Korea.',
  travelDesc: 'I founded the project Ted\'s Eastern World to help people discover these beautiful countries without worrying about the language barrier.'
};

// Gallery translations
cs.gallery = {
  title: 'Fotogalerie & Videa z našich cest',
  desc: 'Prohlédněte si autentické fotografie a videa z našich zájezdů po Východní Asii. Filtrujte podle země či konkrétních měst.'
};
en.gallery = {
  title: 'Photo Gallery & Videos from Our Trips',
  desc: 'View authentic photos and videos from our tours across East Asia. Filter by country or specific cities.'
};

// Japan Guide translations
cs.japanGuide = {
  title: 'Japonsko (Nippon / Nihon)',
  subtitle: 'Země vycházejícího slunce • Ostrovní stát ve Východní Asii',
  toc: 'Obsah článku',
  toc1: 'Základní přehled & Historie',
  toc2: 'Geografie, Města & Příroda',
  toc3: 'Jazyk & Náboženství',
  toc4: 'Japonská gastronomie',
  toc5: 'Často kladené otázky (FAQ)',
  capitalLabel: 'Hlavní město:',
  capitalValue: 'Tokio (Tokyo)',
  populationLabel: 'Obyvatelstvo:',
  populationValue: '124,5 miliónů',
  areaLabel: 'Rozloha:',
  areaValue: '377 975 km²',
  langLabel: 'Úřední jazyk:',
  langValue: 'Japonština',
  currencyLabel: 'Měna:',
  currencyValue: 'Japonský jen (JPY, ¥)',
  religionLabel: 'Náboženství:',
  religionValue: 'Šintoismus, Buddhismus',
  govLabel: 'Státní zřízení:',
  govValue: 'Konstituční monarchie',
  headLabel: 'Hlava státu:',
  headValue: 'Císař Naruhito',
  codeLabel: 'Předvolba:',
  codeValue: '+81',
  btnTours: 'Zobrazit zájezdy do Japonska',
  btnApp: 'Vyzkoušet výuku slovíček v naší aplikaci'
};

en.japanGuide = {
  title: 'Japan (Nippon / Nihon)',
  subtitle: 'Land of the Rising Sun • Island nation in East Asia',
  toc: 'Table of Contents',
  toc1: 'Overview & History',
  toc2: 'Geography, Cities & Nature',
  toc3: 'Language & Religion',
  toc4: 'Japanese Gastronomy',
  toc5: 'Frequently Asked Questions (FAQ)',
  capitalLabel: 'Capital:',
  capitalValue: 'Tokyo',
  populationLabel: 'Population:',
  populationValue: '124.5 million',
  areaLabel: 'Area:',
  areaValue: '377,975 km²',
  langLabel: 'Official Language:',
  langValue: 'Japanese',
  currencyLabel: 'Currency:',
  currencyValue: 'Japanese Yen (JPY, ¥)',
  religionLabel: 'Religion:',
  religionValue: 'Shinto, Buddhism',
  govLabel: 'Government:',
  govValue: 'Constitutional Monarchy',
  headLabel: 'Head of State:',
  headValue: 'Emperor Naruhito',
  codeLabel: 'Calling Code:',
  codeValue: '+81',
  btnTours: 'View Tours to Japan',
  btnApp: 'Try vocabulary learning in our app'
};

fs.writeFileSync(csFile, JSON.stringify(cs, null, 2), 'utf8');
fs.writeFileSync(enFile, JSON.stringify(en, null, 2), 'utf8');
console.log('Translations updated!');
