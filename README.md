# Tedův východní svět – Webová platforma pro cestování a poznávání východní Asie

Bakalářská práce zaměřená na návrh a implementaci moderní webové platformy propojující plánování cest do Japonska a Jižní Koreje s poznáváním místní kultury, jazykovou přípravou s prvky umělé inteligence a komunitním sdílením zkušeností.

---

## 1. Architektura a použité technologie

- **Frontend:** React 18 + React Router v6, sestavováno pomocí nástroje **Vite 5** (včetně PWA podpory přes `vite-plugin-pwa`).
- **Správa globálního stavu (Context API):**
  - `src/context/AuthContext.jsx` – autentizace uživatelů (e-mail/heslo, Google, Facebook) a správa uživatelského profilu ve Firestore.
  - `src/context/DataContext.jsx` – správa a synchronizace cestovních itinerářů, mediálních souborů z Firestore, komunitní fotogalerie a diskusního fóra.
  - `src/context/LanguageContext.jsx` – lokalizace uživatelského rozhraní (CZ / EN) s ukládáním preference do `localStorage` a nastavením atributu `document.documentElement.lang`.
  - `src/context/ThemeContext.jsx` – přepínání tmavého a světlého režimu (Dark / Light mode) s kontrastem splňujícím WCAG 2.2 AA.
- **Backend a databáze (Firebase):**
  - **Firebase Authentication** – správa účtů a přihlašování.
  - **Cloud Firestore (databáze `cestovka`)** – NoSQL dokumentová databáze pro itineráře, média, galerii, fórum, recenze, uživatelské profily a rezervace.
  - **Bezpečnostní pravidla** – `firestore.rules` a `storage.rules` zajišťující kontrolu vlastnictví záznamů (`ownerId`, `authorUid`, `userId`) a administrátorských oprávnění.
- **Umělá inteligence a mapy:**
  - **Google Gemini API (`gemini-2.5-flash`)** – AI jazykový lektor a překladač s vysvětlením gramatiky, generátor mnemotechnických pomůcek, AI generátor vlastních cestovních itinerářů a plovoucí AI průvodce.
  - **Leaflet.js + CARTO dlaždice** – interaktivní mapa destinací a vizualizace tras jednotlivých itinerářů.

---

## 2. Datový model (Cloud Firestore – databáze `cestovka`)

| Kolekce | Popis | Hlavní atributy dokumentu |
| :--- | :--- | :--- |
| `itineraries` | Katalog cestovních itinerářů a uživatelské itineráře na míru | `title`, `country`, `tag`, `duration`, `price`, `image`, `desc`, `dates[]`, `cities[]`, `photos[]`, `days[]`, `accommodation`, `isCustom`, `ownerId` |
| `itineraries/_media/items` | Databázové úložiště optimalizovaných fotografií zájezdů a map metra | `name`, `dataUrl`, `updatedAt` |
| `gallery` | Komunitní fotogalerie a videa z cest | `title`, `type` (`photo` \| `video`), `country`, `city`, `place`, `src`, `ownerId` |
| `forum_threads` | Vlákna diskusního fóra a komunitní poradny | `title`, `author`, `authorUid`, `category`, `date`, `content`, `replies[]` |
| `reviews` | Hodnocení a recenze jednotlivých itinerářů | `planId`, `userId`, `userName`, `rating`, `comment`, `createdAt` |
| `users` | Uživatelské profily a personalizace | `displayName`, `email`, `realName`, `city`, `birthDate`, `gender`, `trips`, `avatarUrl`, `createdAt` |
| `reservations` | Záznamy rezervací a poptávek itinerářů | `userId`, `planId`, `planTitle`, `date`, `price`, `name`, `email`, `phone`, `paymentMethod`, `status`, `createdAt` |

---

## 3. Instalace a lokální spuštění (Technická dokumentace)

### Požadavky
- **Node.js** (verze 18 nebo novější) a **npm**

### Postup spuštění
1. Naklonujte repozitář a přejděte do složky projektu:
   ```bash
   git clone https://github.com/NakiriTed/Cestovka.git
   cd Cestovka
   ```
2. Nainstalujte závislosti:
   ```bash
   npm install
   ```
3. Vytvořte soubor `.env` podle vzoru `.env.example` a doplňte klíče (zejména `VITE_GEMINI_API_KEY` pro živé AI funkce):
   ```bash
   cp .env.example .env
   ```
4. Spusťte vývojový server (aplikace poběží na `http://localhost:8080/`):
   ```bash
   npm run dev
   ```
5. Pro sestavení produkční verze do složky `dist/`:
   ```bash
   npm run build
   ```

### Nasazení bezpečnostních pravidel Firebase a testování
- Nasazení pravidel Firestore a Storage:
  ```bash
  npx firebase deploy --only firestore:rules,storage:rules
  ```
- Spuštění E2E testů v nástroji Cypress:
  ```bash
  npx cypress open
  ```

---

## 4. Uživatelská příručka (Přehled modulů)

1. **Plánovač a tvorba itinerářů (`/planner`)**
   - Filtrování itinerářů podle zaměření (*pro nováčky*, *poznávací*, *zábava*, *adrenalin*, *oblíbené*) a řazení podle ceny.
   - Porovnání více itinerářů vedle sebe (tlačítko s ikonou vah) a uložení do oblíbených (ikona srdce).
   - **Sestavit vlastní itinerář (AI Plánovač)**: výběr země, délky cesty, stylu a měst na trase s možností nechat si vygenerovat program den po dni pomocí AI (Gemini) a uložit si itinerář k vlastnímu profilu.
   - Detail itineráře zobrazuje fotogalerii míst s lightboxem, interaktivní mapu trasy, upozornění na lokální dopravu, rozpis programu den po dni a komunitní recenze.
2. **Interaktivní mapa (`/map`)**
   - Přehled klíčových destinací v Japonsku a Jižní Koreji s přímým proklikem na související itineráře.
3. **Průvodci destinacemi (`/japan`, `/korea`)**
   - Interaktivní přehled historie, geografie, regionů, gastronomie, etikety a praktických informací před cestou.
4. **Výukové moduly japonštiny a korejštiny s AI (`/japonsky`, `/korejsky`)**
   - 3D otočné kartičky cestovatelských frází rozdělené do kategorií s hlasovou syntézou výslovnosti (TTS), přehledy písem **Hiragana**, **Katakana** a **Hangul**.
   - Záložka **AI Lektor & Kvíz**: překlad libovolné věty pomocí AI s přepisem výslovnosti a vysvětlením gramatiky + interaktivní kvíz s AI mnemotechnickou pomůckou.
5. **Komunitní fórum (`/forum`) a Fotogalerie (`/gallery`)**
   - Diskuse podle kategorií (*Cestopisy a tipy*, *Hledám parťáka*, *Dotazy před cestou*) a sdílení fotografií či videí z cest s filtrováním podle země a města.
6. **Uživatelský profil (`/profile`)**
   - Správa přezdívky, profilové fotografie a cestovatelského bia, přehled vlastních sestavených itinerářů, oblíbených zájezdů a rezervací.
