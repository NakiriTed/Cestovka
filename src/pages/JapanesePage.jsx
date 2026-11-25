import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export function JapanesePage() {
  const { currentLang } = useLanguage();
  const [mainTab, setMainTab] = useState('phrases'); // 'phrases' | 'hiragana' | 'katakana' | 'ai'
  const [activeCat, setActiveCat] = useState('all');
  const [flippedCards, setFlippedCards] = useState({});
  const [hiraganaSub, setHiraganaSub] = useState('basic');
  const [katakanaSub, setKatakanaSub] = useState('basic');

  // AI Tutor & Quiz State
  const [aiInput, setAiInput] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);
  const [quizSelected, setQuizSelected] = useState(null);
  const [aiHint, setAiHint] = useState('');
  const [aiHintLoading, setAiHintLoading] = useState(false);

  const phrases = [
    { jp: "こんにちは", romaji: "Konnichiwa", cs: "Dobrý den / Ahoj", en: "Hello / Good afternoon", cat: "greetings" },
    { jp: "おはようございます", romaji: "Ohayou gozaimasu", cs: "Dobré ráno", en: "Good morning", cat: "greetings" },
    { jp: "こんばんは", romaji: "Konbanwa", cs: "Dobrý večer", en: "Good evening", cat: "greetings" },
    { jp: "さようなら", romaji: "Sayounara", cs: "Nashledanou", en: "Goodbye", cat: "greetings" },
    { jp: "ありがとうございます", romaji: "Arigatou gozaimasu", cs: "Děkuji moc", en: "Thank you very much", cat: "greetings" },
    { jp: "すみません", romaji: "Sumimasen", cs: "Promiňte / S dovolením", en: "Excuse me / Sorry", cat: "greetings" },
    { jp: "はい / いいえ", romaji: "Hai / Iie", cs: "Ano / Ne", en: "Yes / No", cat: "greetings" },

    { jp: "私の名前は___です", romaji: "Watashi no namae wa ___ desu", cs: "Jmenuji se ___", en: "My name is ___", cat: "introduce" },
    { jp: "___歳です", romaji: "___ sai desu", cs: "Je mi ___ let", en: "I am ___ years old", cat: "introduce" },
    { jp: "チェコから来ました", romaji: "Cheko kara kimashita", cs: "Jsem z Česka", en: "I'm from Czech Republic", cat: "introduce" },
    { jp: "よろしくお願いします", romaji: "Yoroshiku onegaishimasu", cs: "Těší mě (formální)", en: "Nice to meet you (formal)", cat: "introduce" },
    { jp: "日本語を少し話します", romaji: "Nihongo wo sukoshi hanashimasu", cs: "Mluvím trochu japonsky", en: "I speak a little Japanese", cat: "introduce" },

    { jp: "ビールをください", romaji: "Biiru wo kudasai", cs: "Pivo, prosím", en: "A beer, please", cat: "food" },
    { jp: "水をください", romaji: "Mizu wo kudasai", cs: "Vodu, prosím", en: "Water, please", cat: "food" },
    { jp: "これをください", romaji: "Kore wo kudasai", cs: "Tohle, prosím", en: "This one, please", cat: "food" },
    { jp: "おすすめは何ですか？", romaji: "Osusume wa nan desu ka?", cs: "Co doporučujete?", en: "What do you recommend?", cat: "food" },
    { jp: "お会計お願いします", romaji: "Okaikei onegaishimasu", cs: "Účet, prosím", en: "Check, please", cat: "food" },
    { jp: "いただきます", romaji: "Itadakimasu", cs: "Dobrou chuť (před jídlem)", en: "Bon appétit (before eating)", cat: "food" },
    { jp: "ごちそうさまでした", romaji: "Gochisousama deshita", cs: "Děkuji za jídlo (po jídle)", en: "Thank you for the meal", cat: "food" },
    { jp: "メニューをください", romaji: "Menyuu wo kudasai", cs: "Menu, prosím", en: "Menu, please", cat: "food" },

    { jp: "駅はどこですか？", romaji: "Eki wa doko desu ka?", cs: "Kde je nádraží?", en: "Where is the station?", cat: "transport" },
    { jp: "___に行きたいです", romaji: "___ ni ikitai desu", cs: "Chci jet do ___", en: "I want to go to ___", cat: "transport" },
    { jp: "切符をください", romaji: "Kippu wo kudasai", cs: "Lístek, prosím", en: "A ticket, please", cat: "transport" },
    { jp: "この電車は___行きですか？", romaji: "Kono densha wa ___ iki desu ka?", cs: "Jede tento vlak do ___?", en: "Does this train go to ___?", cat: "transport" },
    { jp: "タクシーを呼んでください", romaji: "Takushii wo yonde kudasai", cs: "Zavolejte mi taxi", en: "Please call a taxi", cat: "transport" },

    { jp: "一 二 三 四 五", romaji: "Ichi, ni, san, yon, go", cs: "1, 2, 3, 4, 5", en: "1, 2, 3, 4, 5", cat: "numbers" },
    { jp: "六 七 八 九 十", romaji: "Roku, nana, hachi, kyuu, juu", cs: "6, 7, 8, 9, 10", en: "6, 7, 8, 9, 10", cat: "numbers" },
    { jp: "百 / 千 / 万", romaji: "Hyaku / Sen / Man", cs: "100 / 1000 / 10 000", en: "100 / 1,000 / 10,000", cat: "numbers" },
    { jp: "いくらですか？", romaji: "Ikura desu ka?", cs: "Kolik to stojí?", en: "How much is it?", cat: "numbers" },

    { jp: "助けてください", romaji: "Tasukete kudasai", cs: "Pomozte mi, prosím!", en: "Please help me!", cat: "emergency" },
    { jp: "警察を呼んでください", romaji: "Keisatsu wo yonde kudasai", cs: "Zavolejte policii", en: "Please call the police", cat: "emergency" },
    { jp: "病院はどこですか？", romaji: "Byouin wa doko desu ka?", cs: "Kde je nemocnice?", en: "Where is the hospital?", cat: "emergency" },
    { jp: "日本語がわかりません", romaji: "Nihongo ga wakarimasen", cs: "Nerozumím japonsky", en: "I don't understand Japanese", cat: "emergency" },
    { jp: "英語を話せますか？", romaji: "Eigo wo hanasemasu ka?", cs: "Mluvíte anglicky?", en: "Do you speak English?", cat: "emergency" }
  ];

  const categories = [
    { id: "all", cs: "Vše", en: "All", icon: "" },
    { id: "greetings", cs: "Pozdravy", en: "Greetings", icon: "fa-hand-peace" },
    { id: "introduce", cs: "Představení", en: "Introduction", icon: "fa-id-card" },
    { id: "food", cs: "Jídlo a pití", en: "Food & Drinks", icon: "fa-utensils" },
    { id: "transport", cs: "Doprava", en: "Transport", icon: "fa-train" },
    { id: "numbers", cs: "Číslovky", en: "Numbers", icon: "fa-hashtag" },
    { id: "emergency", cs: "Nouzové", en: "Emergency", icon: "fa-kit-medical" }
  ];

  const hiraganaBasic = [
    { char: "あ", romaji: "a" }, { char: "い", romaji: "i" }, { char: "う", romaji: "u" }, { char: "え", romaji: "e" }, { char: "お", romaji: "o" },
    { char: "か", romaji: "ka" }, { char: "き", romaji: "ki" }, { char: "く", romaji: "ku" }, { char: "け", romaji: "ke" }, { char: "こ", romaji: "ko" },
    { char: "さ", romaji: "sa" }, { char: "し", romaji: "shi" }, { char: "す", romaji: "su" }, { char: "せ", romaji: "se" }, { char: "そ", romaji: "so" },
    { char: "た", romaji: "ta" }, { char: "ち", romaji: "chi" }, { char: "つ", romaji: "tsu" }, { char: "て", romaji: "te" }, { char: "と", romaji: "to" },
    { char: "な", romaji: "na" }, { char: "に", romaji: "ni" }, { char: "ぬ", romaji: "nu" }, { char: "ね", romaji: "ne" }, { char: "の", romaji: "no" },
    { char: "は", romaji: "ha" }, { char: "ひ", romaji: "hi" }, { char: "ふ", romaji: "fu" }, { char: "へ", romaji: "he" }, { char: "ほ", romaji: "ho" },
    { char: "ま", romaji: "ma" }, { char: "み", romaji: "mi" }, { char: "む", romaji: "mu" }, { char: "め", romaji: "me" }, { char: "も", romaji: "mo" },
    { char: "や", romaji: "ya" }, { char: "ゆ", romaji: "yu" }, { char: "よ", romaji: "yo" },
    { char: "ら", romaji: "ra" }, { char: "り", romaji: "ri" }, { char: "る", romaji: "ru" }, { char: "れ", romaji: "re" }, { char: "ろ", romaji: "ro" },
    { char: "わ", romaji: "wa" }, { char: "を", romaji: "wo" }, { char: "ん", romaji: "n" }
  ];

  const hiraganaDakuon = [
    { char: "が", romaji: "ga" }, { char: "ぎ", romaji: "gi" }, { char: "ぐ", romaji: "gu" }, { char: "げ", romaji: "ge" }, { char: "ご", romaji: "go" },
    { char: "ざ", romaji: "za" }, { char: "じ", romaji: "ji" }, { char: "ず", romaji: "zu" }, { char: "ぜ", romaji: "ze" }, { char: "ぞ", romaji: "zo" },
    { char: "だ", romaji: "da" }, { char: "ぢ", romaji: "ji" }, { char: "づ", romaji: "zu" }, { char: "で", romaji: "de" }, { char: "ど", romaji: "do" },
    { char: "ば", romaji: "ba" }, { char: "び", romaji: "bi" }, { char: "ぶ", romaji: "bu" }, { char: "べ", romaji: "be" }, { char: "ぼ", romaji: "bo" },
    { char: "ぱ", romaji: "pa" }, { char: "ぴ", romaji: "pi" }, { char: "ぷ", romaji: "pu" }, { char: "ぺ", romaji: "pe" }, { char: "ぽ", romaji: "po" }
  ];

  const katakanaBasic = [
    { char: "ア", romaji: "a" }, { char: "イ", romaji: "i" }, { char: "ウ", romaji: "u" }, { char: "エ", romaji: "e" }, { char: "オ", romaji: "o" },
    { char: "カ", romaji: "ka" }, { char: "キ", romaji: "ki" }, { char: "ク", romaji: "ku" }, { char: "ケ", romaji: "ke" }, { char: "コ", romaji: "ko" },
    { char: "サ", romaji: "sa" }, { char: "シ", romaji: "shi" }, { char: "ス", romaji: "su" }, { char: "セ", romaji: "se" }, { char: "ソ", romaji: "so" },
    { char: "タ", romaji: "ta" }, { char: "チ", romaji: "chi" }, { char: "ツ", romaji: "tsu" }, { char: "テ", romaji: "te" }, { char: "ト", romaji: "to" },
    { char: "ナ", romaji: "na" }, { char: "ニ", romaji: "ni" }, { char: "ヌ", romaji: "nu" }, { char: "ネ", romaji: "ne" }, { char: "ノ", romaji: "no" },
    { char: "ハ", romaji: "ha" }, { char: "ヒ", romaji: "hi" }, { char: "フ", romaji: "fu" }, { char: "ヘ", romaji: "he" }, { char: "ホ", romaji: "ho" },
    { char: "マ", romaji: "ma" }, { char: "ミ", romaji: "mi" }, { char: "ム", romaji: "mu" }, { char: "メ", romaji: "me" }, { char: "モ", romaji: "mo" },
    { char: "ヤ", romaji: "ya" }, { char: "ユ", romaji: "yu" }, { char: "ヨ", romaji: "yo" },
    { char: "ラ", romaji: "ra" }, { char: "リ", romaji: "ri" }, { char: "ル", romaji: "ru" }, { char: "レ", romaji: "re" }, { char: "ロ", romaji: "ro" },
    { char: "ワ", romaji: "wa" }, { char: "ヲ", romaji: "wo" }, { char: "ン", romaji: "n" }
  ];

  const katakanaDakuon = [
    { char: "ガ", romaji: "ga" }, { char: "ギ", romaji: "gi" }, { char: "グ", romaji: "gu" }, { char: "ゲ", romaji: "ge" }, { char: "ゴ", romaji: "go" },
    { char: "ザ", romaji: "za" }, { char: "ジ", romaji: "ji" }, { char: "ズ", romaji: "zu" }, { char: "ゼ", romaji: "ze" }, { char: "ぞ", romaji: "zo" },
    { char: "ダ", romaji: "da" }, { char: "ヂ", romaji: "ji" }, { char: "ヅ", romaji: "zu" }, { char: "デ", romaji: "de" }, { char: "ド", romaji: "do" },
    { char: "バ", romaji: "ba" }, { char: "ビ", romaji: "bi" }, { char: "ブ", romaji: "bu" }, { char: "べ", romaji: "be" }, { char: "ボ", romaji: "bo" },
    { char: "パ", romaji: "pa" }, { char: "ピ", romaji: "pi" }, { char: "プ", romaji: "pu" }, { char: "ペ", romaji: "pe" }, { char: "ポ", romaji: "po" }
  ];

  const toggleCardFlip = (idx) => {
    setFlippedCards(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const speak = (text, e) => {
    if (e) e.stopPropagation();
    const cleanText = text.split('/')[0].replace(/[_/?!.,！？。、]/g, ' ').trim();
    
    // Použijeme stabilní ResponsiveVoice API
    const url = `https://code.responsivevoice.org/getvoice.php?t=${encodeURIComponent(cleanText)}&tl=ja-JP&sv=g1&vn=&pitch=0.5&rate=0.5&vol=1`;
    const audio = new Audio(url);
    
    audio.play().catch(() => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'ja-JP';
        utterance.rate = 0.85;
        window.speechSynthesis.speak(utterance);
      }
    });
  };

  const filteredPhrases = activeCat === 'all' ? phrases : phrases.filter(p => p.cat === activeCat);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

  const handleAiTranslate = async (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    setAiLoading(true);
    setAiResult(null);

    try {
      const prompt = `Přelož tuto větu do přirozené japonštiny pro cestovatele: "${aiInput.trim()}".
Vrať POUZE čistý JSON objekt bez markdownu v tomto formátu:
{"jp": "japonský zápis v kanji/kana", "romaji": "přepis výslovnosti v romaji", "explanation": "stručné vysvětlení slovíček a gramatiky v jazyce ${currentLang === 'en' ? 'angličtina' : 'čeština'}"}`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] })
      });
      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        setAiResult(JSON.parse(jsonMatch[0]));
      } else {
        setAiResult({ jp: 'すみません', romaji: 'Sumimasen', explanation: rawText || 'Nepodařilo se zpracovat odpověď.' });
      }
    } catch (err) {
      setAiResult({
        jp: 'おすすめは何ですか？',
        romaji: 'Osusume wa nan desu ka?',
        explanation: currentLang === 'en' ? 'Offline fallback: "What do you recommend?"' : 'Ukázkový překlad (offline režim): „Co doporučujete?“'
      });
    } finally {
      setAiLoading(false);
    }
  };

  const currentQuizItem = phrases[quizIndex % phrases.length];
  const quizOptions = React.useMemo(() => {
    const correct = currentLang === 'en' ? currentQuizItem.en : currentQuizItem.cs;
    const others = phrases
      .filter((_, i) => i !== (quizIndex % phrases.length))
      .map(p => (currentLang === 'en' ? p.en : p.cs));
    const shuffledOthers = [...others].sort((a, b) => (a.length * 7 + quizIndex) - (b.length * 3)).slice(0, 3);
    const all = [correct, ...shuffledOthers];
    return all.sort((a, b) => a.localeCompare(b));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizIndex, currentLang]);

  const handleSelectQuizOption = (opt) => {
    if (quizSelected !== null) return;
    setQuizSelected(opt);
    const correct = currentLang === 'en' ? currentQuizItem.en : currentQuizItem.cs;
    setQuizTotal(prev => prev + 1);
    if (opt === correct) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    setQuizSelected(null);
    setAiHint('');
    setQuizIndex(prev => (prev + 1) % phrases.length);
  };

  const handleGetAiMnemonic = async () => {
    setAiHintLoading(true);
    try {
      const prompt = `Vymysli krátkou, vtipnou a zapamatovatelnou mnemotechnickou pomůcku (max 2 věty v jazyce ${currentLang === 'en' ? 'English' : 'čeština'}), jak si zapamatovat japonskou frázi "${currentQuizItem.jp}" (${currentQuizItem.romaji}), která znamená "${currentLang === 'en' ? currentQuizItem.en : currentQuizItem.cs}".`;
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] })
      });
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      setAiHint(text || `Rozděl si výslovnost „${currentQuizItem.romaji}“ na slabiky a spoj si ji s konkrétní situací v Japonsku.`);
    } catch {
      setAiHint(`Tip: Rozděl si výslovnost „${currentQuizItem.romaji}“ na jednotlivé slabiky a přečti si ji nahlas.`);
    } finally {
      setAiHintLoading(false);
    }
  };

  return (
    <main className="jp-main-wrapper" style={{ maxWidth: '1100px', margin: '0 auto', padding: '6rem 2rem 3rem' }}>
      <Link to="/japan" className="back-cta">
        <i className="fa-solid fa-arrow-left"></i> {currentLang === 'en' ? 'Back to Japan' : 'Zpět na Japonsko'}
      </Link>

      <div className="glass jp-hero" style={{ position: 'relative', overflow: 'hidden' }}>
        <span className="kanji-deco">日本語</span>
        <h1>🇯🇵 {currentLang === 'en' ? 'Learn Japanese' : 'Naučte se japonsky'}</h1>
        <p>{currentLang === 'en' ? 'Essential phrases, writing systems, and AI language tutor for traveling in Japan.' : 'Základní fráze pro cestování po Japonsku. Klikněte na kartu pro otočení 3D překladu nebo vyzkoušejte AI lektora.'}</p>
      </div>

      <div className="main-mode-toggle">
        <button className={`mode-tab-btn ${mainTab === 'phrases' ? 'active' : ''}`} onClick={() => setMainTab('phrases')}>
          <i className="fa-solid fa-comments"></i> <span>{currentLang === 'en' ? 'Travel Phrases' : 'Fráze pro cestovatele'}</span>
        </button>
        <button className={`mode-tab-btn ${mainTab === 'hiragana' ? 'active' : ''}`} onClick={() => setMainTab('hiragana')}>
          <span style={{ fontFamily: 'serif', fontSize: '1.1rem' }}>あ</span> Hiragana
        </button>
        <button className={`mode-tab-btn ${mainTab === 'katakana' ? 'active' : ''}`} onClick={() => setMainTab('katakana')}>
          <span style={{ fontFamily: 'serif', fontSize: '1.1rem' }}>ア</span> Katakana
        </button>
        <button className={`mode-tab-btn ${mainTab === 'ai' ? 'active' : ''}`} onClick={() => setMainTab('ai')}>
          <i className="fa-solid fa-wand-magic-sparkles"></i> <span>{currentLang === 'en' ? 'AI Tutor & Quiz' : 'AI Lektor & Kvíz'}</span>
        </button>
      </div>

      {mainTab === 'phrases' && (
        <div id="section-phrases">
          <div className="jp-filters">
            {categories.map(c => (
              <button 
                key={c.id}
                className={`jp-filter-btn ${c.id === activeCat ? 'active' : ''}`}
                onClick={() => setActiveCat(c.id)}
              >
                {c.icon && <i className={`fa-solid ${c.icon}`}></i>} {currentLang === 'en' ? c.en : c.cs}
              </button>
            ))}
          </div>

          <div className="phrases-grid">
            {filteredPhrases.map((p, idx) => (
              <div 
                key={idx} 
                className={`phrase-card ${flippedCards[idx] ? 'flipped' : ''}`}
                onClick={() => toggleCardFlip(idx)}
              >
                <div className="phrase-card-inner">
                  <div className="phrase-front glass">
                    <span className="phrase-category-tag">
                      {categories.find(c => c.id === p.cat)?.[currentLang === 'en' ? 'en' : 'cs']}
                    </span>
                    <div className="phrase-jp">{p.jp}</div>
                    <div className="phrase-romaji">{p.romaji}</div>
                    <button className="listen-btn" onClick={(e) => speak(p.jp, e)}>
                      <i className="fa-solid fa-volume-high"></i> {currentLang === 'en' ? 'Listen' : 'Poslechnout'}
                    </button>
                    <span className="phrase-hint">
                      <i className="fa-solid fa-rotate"></i> {currentLang === 'en' ? 'Click to translate' : 'Klikni pro překlad'}
                    </span>
                  </div>

                  <div className="phrase-back glass">
                    <span className="phrase-category-tag">
                      {categories.find(c => c.id === p.cat)?.[currentLang === 'en' ? 'en' : 'cs']}
                    </span>
                    <div className="phrase-translation">{currentLang === 'en' ? p.en : p.cs}</div>
                    <div className="phrase-translation-sub">{p.romaji}</div>
                    <button className="listen-btn" onClick={(e) => speak(p.jp, e)}>
                      <i className="fa-solid fa-volume-high"></i> {currentLang === 'en' ? 'Listen' : 'Poslechnout'}
                    </button>
                    <span className="phrase-hint">
                      <i className="fa-solid fa-rotate"></i> {currentLang === 'en' ? 'Click to flip back' : 'Klikni zpět'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {mainTab === 'hiragana' && (
        <div id="section-hiragana">
          <div className="jp-filters" style={{ marginBottom: '1.5rem' }}>
            <button className={`jp-filter-btn ${hiraganaSub === 'basic' ? 'active' : ''}`} onClick={() => setHiraganaSub('basic')}>Základní (46)</button>
            <button className={`jp-filter-btn ${hiraganaSub === 'dakuon' ? 'active' : ''}`} onClick={() => setHiraganaSub('dakuon')}>Znělé / Dakuon (25)</button>
          </div>
          <div className="alphabet-grid">
            {(hiraganaSub === 'basic' ? hiraganaBasic : hiraganaDakuon).map((item, idx) => (
              <div key={idx} className="kana-card" onClick={() => speak(item.char)}>
                <div className="kana-char">{item.char}</div>
                <div className="kana-romaji">{item.romaji}</div>
                <div className="kana-sound-icon"><i className="fa-solid fa-volume-high"></i></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {mainTab === 'katakana' && (
        <div id="section-katakana">
          <div className="jp-filters" style={{ marginBottom: '1.5rem' }}>
            <button className={`jp-filter-btn ${katakanaSub === 'basic' ? 'active' : ''}`} onClick={() => setKatakanaSub('basic')}>Základní (46)</button>
            <button className={`jp-filter-btn ${katakanaSub === 'dakuon' ? 'active' : ''}`} onClick={() => setKatakanaSub('dakuon')}>Znělé / Dakuon (25)</button>
          </div>
          <div className="alphabet-grid">
            {(katakanaSub === 'basic' ? katakanaBasic : katakanaDakuon).map((item, idx) => (
              <div key={idx} className="kana-card" onClick={() => speak(item.char)}>
                <div className="kana-char">{item.char}</div>
                <div className="kana-romaji">{item.romaji}</div>
                <div className="kana-sound-icon"><i className="fa-solid fa-volume-high"></i></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {mainTab === 'ai' && (
        <div id="section-ai" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          {/* AI Translator & Grammar Tutor */}
          <div className="glass" style={{ padding: '2rem', borderRadius: '20px' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-solid fa-robot" style={{ color: 'var(--accent-color)' }}></i>
              {currentLang === 'en' ? 'AI Sentence Translator & Tutor' : 'AI Překladač & Jazykový Lektor'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.2rem' }}>
              {currentLang === 'en'
                ? 'Type any sentence you want to say in Japan and Gemini AI will translate it, show pronunciation, and explain the grammar.'
                : 'Napište libovolnou větu, kterou chcete v Japonsku říct, a umělá inteligence Gemini ji přeloží, vypíše výslovnost a vysvětlí gramatiku.'}
            </p>
            <form onSubmit={handleAiTranslate} style={{ display: 'flex', gap: '10px', marginBottom: '1.2rem' }}>
              <input
                type="text"
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                placeholder={currentLang === 'en' ? 'e.g. Where can I buy a Shinkansen ticket?' : 'Např. Kde si mohu koupit jízdenku na Šinkansen?'}
                style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.06)', color: 'var(--text-main)' }}
              />
              <button type="submit" className="btn btn-primary" disabled={aiLoading}>
                {aiLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
              </button>
            </form>

            {aiResult && (
              <div style={{ background: 'rgba(239,35,60,0.08)', border: '1px solid rgba(239,35,60,0.3)', borderRadius: '16px', padding: '1.2rem' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.3rem' }}>{aiResult.jp}</div>
                <div style={{ color: 'var(--accent-color)', fontWeight: 600, marginBottom: '0.8rem' }}>{aiResult.romaji}</div>
                <button className="listen-btn" onClick={(e) => speak(aiResult.jp, e)} style={{ marginBottom: '0.8rem' }}>
                  <i className="fa-solid fa-volume-high"></i> {currentLang === 'en' ? 'Listen to pronunciation' : 'Přehrát výslovnost'}
                </button>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                  <strong>{currentLang === 'en' ? 'AI Explanation: ' : 'Vysvětlení AI: '}</strong>
                  {aiResult.explanation}
                </p>
              </div>
            )}
          </div>

          {/* Interactive Quiz with AI Mnemonics */}
          <div className="glass" style={{ padding: '2rem', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.4rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa-solid fa-graduation-cap" style={{ color: 'var(--accent-color)' }}></i>
                {currentLang === 'en' ? 'Interactive Quiz' : 'Procvičovací kvíz'}
              </h2>
              <span className="phrase-category-tag">
                {currentLang === 'en' ? 'Score' : 'Skóre'}: {quizScore} / {quizTotal}
              </span>
            </div>

            <div style={{ textAlign: 'center', padding: '1.2rem', background: 'rgba(255,255,255,0.04)', borderRadius: '16px', marginBottom: '1.2rem' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>{currentQuizItem.jp}</div>
              <div style={{ color: 'var(--text-muted)', marginBottom: '0.6rem' }}>{currentQuizItem.romaji}</div>
              <button type="button" className="listen-btn" onClick={(e) => speak(currentQuizItem.jp, e)}>
                <i className="fa-solid fa-volume-high"></i> {currentLang === 'en' ? 'Listen' : 'Poslechnout'}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1rem' }}>
              {quizOptions.map((opt, i) => {
                const correctAns = currentLang === 'en' ? currentQuizItem.en : currentQuizItem.cs;
                const isSelected = quizSelected === opt;
                const isCorrect = opt === correctAns;
                let bg = 'rgba(255,255,255,0.06)';
                let border = '1px solid var(--glass-border)';
                if (quizSelected !== null) {
                  if (isCorrect) { bg = 'rgba(46, 204, 113, 0.25)'; border = '1px solid #2ecc71'; }
                  else if (isSelected) { bg = 'rgba(231, 76, 60, 0.25)'; border = '1px solid #e74c3c'; }
                }
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectQuizOption(opt)}
                    style={{
                      padding: '0.75rem 1rem', borderRadius: '12px', background: bg, border,
                      color: 'var(--text-main)', textAlign: 'left', cursor: quizSelected ? 'default' : 'pointer',
                      fontWeight: 500, transition: 'all 0.2s'
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
              <button type="button" className="btn" onClick={handleGetAiMnemonic} disabled={aiHintLoading} style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-main)' }}>
                {aiHintLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-lightbulb" style={{ color: '#f1c40f' }}></i>}{' '}
                {currentLang === 'en' ? 'AI Memory Tip' : 'AI pomůcka pro zapamatování'}
              </button>
              <button type="button" className="btn btn-primary" onClick={handleNextQuiz}>
                {currentLang === 'en' ? 'Next Question' : 'Další otázka'} <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>

            {aiHint && (
              <div style={{ marginTop: '1rem', padding: '0.9rem', borderRadius: '12px', background: 'rgba(241, 196, 15, 0.1)', border: '1px solid rgba(241, 196, 15, 0.3)', fontSize: '0.88rem' }}>
                💡 {aiHint}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="glass" style={{ padding: '1.5rem 2rem', borderRadius: '16px', marginTop: '1rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <i className="fa-solid fa-lightbulb" style={{ color: 'var(--accent-color)', fontSize: '1.4rem', flexShrink: 0, marginTop: '2px' }}></i>
        <div>
          <strong style={{ display: 'block', marginBottom: '0.4rem' }}>{currentLang === 'en' ? 'Traveler Tip' : 'Tip pro cestovatele'}</strong>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
            {currentLang === 'en'
              ? 'Japanese people truly appreciate when you try to speak Japanese — even a few words make a great impression. Don’t be afraid of mistakes!'
              : 'Japonci velmi ocení, když se pokusíte mluvit japonsky — i jen pár slov udělá velký dojem. Nebojte se chyb!'}
          </p>
        </div>
      </div>
    </main>
  );
}
