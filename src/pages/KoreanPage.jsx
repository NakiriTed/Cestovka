import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export function KoreanPage() {
  const { currentLang } = useLanguage();
  const [mainTab, setMainTab] = useState('phrases'); // 'phrases' | 'hangul' | 'ai'
  const [activeCat, setActiveCat] = useState('all');
  const [flippedCards, setFlippedCards] = useState({});
  const [hangulSub, setHangulSub] = useState('consonants');

  // AI Tutor & Quiz State
  const [aiInput, setAiInput] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);
  const [quizSelected, setQuizSelected] = useState(null);
  const [aiHint, setAiHint] = useState('');
  const [aiHintLoading, setAiHintLoading] = useState(false);

  const phrases = [
    { jp: "안녕하세요", romaji: "Annyeonghaseyo", cs: "Dobrý den / Ahoj", en: "Hello", cat: "greetings" },
    { jp: "안녕히 가세요", romaji: "Annyeonghi gaseyo", cs: "Nashledanou (když někdo odchází)", en: "Goodbye (to someone leaving)", cat: "greetings" },
    { jp: "안녕히 계세요", romaji: "Annyeonghi gyeseyo", cs: "Nashledanou (když vy odcházíte)", en: "Goodbye (if you are leaving)", cat: "greetings" },
    { jp: "감사합니다", romaji: "Gamsahamnida", cs: "Děkuji", en: "Thank you", cat: "greetings" },
    { jp: "죄송합니다", romaji: "Joesonghamnida", cs: "Omlouvám se", en: "I'm sorry", cat: "greetings" },
    { jp: "네 / 아니요", romaji: "Ne / Aniyo", cs: "Ano / Ne", en: "Yes / No", cat: "greetings" },

    { jp: "제 이름은 ___입니다", romaji: "Je ireumeun ___imnida", cs: "Jmenuji se ___", en: "My name is ___", cat: "introduce" },
    { jp: "체코에서 왔어요", romaji: "Chekoeseo wasseoyo", cs: "Jsem z Česka", en: "I'm from Czech Republic", cat: "introduce" },
    { jp: "만나서 반갑습니다", romaji: "Mannaseo bangapseumnida", cs: "Rád vás poznávám", en: "Nice to meet you", cat: "introduce" },
    { jp: "한국어를 조금 할 수 있어요", romaji: "Hangugeoreul jogeum hal su isseoyo", cs: "Mluvím trochu korejsky", en: "I speak a little Korean", cat: "introduce" },

    { jp: "맥주 주세요", romaji: "Maekju juseyo", cs: "Pivo, prosím", en: "A beer, please", cat: "food" },
    { jp: "물 주세요", romaji: "Mul juseyo", cs: "Vodu, prosím", en: "Water, please", cat: "food" },
    { jp: "이거 주세요", romaji: "Igeo juseyo", cs: "Tohle, prosím", en: "This one, please", cat: "food" },
    { jp: "추천해 주시겠어요?", romaji: "Chucheonhae jusigesseoyo?", cs: "Co doporučujete?", en: "What do you recommend?", cat: "food" },
    { jp: "계산해 주세요", romaji: "Gyesanhae juseyo", cs: "Účet, prosím", en: "Check, please", cat: "food" },
    { jp: "잘 먹겠습니다", romaji: "Jal meokgesseumnida", cs: "Dobrou chuť (před jídlem)", en: "Bon appétit", cat: "food" },

    { jp: "역이 어디에 있어요?", romaji: "Yeogi eodie isseoyo?", cs: "Kde je nádraží?", en: "Where is the station?", cat: "transport" },
    { jp: "___에 가고 싶어요", romaji: "___e gago sipeoyo", cs: "Chci jet do ___", en: "I want to go to ___", cat: "transport" },
    { jp: "표를 주세요", romaji: "Pyoreul juseyo", cs: "Lístek, prosím", en: "A ticket, please", cat: "transport" },
    { jp: "택시를 불러 주세요", romaji: "Taeksireul bulleo juseyo", cs: "Zavolejte mi taxi", en: "Please call a taxi", cat: "transport" },

    { jp: "일 이 삼 사 오", romaji: "Il, i, sam, sa, o", cs: "1, 2, 3, 4, 5", en: "1, 2, 3, 4, 5", cat: "numbers" },
    { jp: "육 칠 팔 구 십", romaji: "Yuk, chil, pal, gu, sip", cs: "6, 7, 8, 9, 10", en: "6, 7, 8, 9, 10", cat: "numbers" },
    { jp: "백 / 천 / 만", romaji: "Baek / Cheon / Man", cs: "100 / 1000 / 10 000", en: "100 / 1,000 / 10,000", cat: "numbers" },
    { jp: "얼마예요?", romaji: "Eolmayeyo?", cs: "Kolik to stojí?", en: "How much is it?", cat: "numbers" },

    { jp: "도와주세요!", romaji: "Dowajuseyo!", cs: "Pomozte mi, prosím!", en: "Please help me!", cat: "emergency" },
    { jp: "경찰을 불러주세요", romaji: "Gyeongchareul bulleojuseyo", cs: "Zavolejte policii", en: "Please call the police", cat: "emergency" },
    { jp: "병원이 어디에 있어요?", romaji: "Byeongwoni eodie isseoyo?", cs: "Kde je nemocnice?", en: "Where is the hospital?", cat: "emergency" },
    { jp: "영어를 할 수 있어요?", romaji: "Yeongeoreul hal su isseoyo?", cs: "Mluvíte anglicky?", en: "Do you speak English?", cat: "emergency" }
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

  const hangulConsonants = [
    { char: "ㄱ", romaji: "g / k" }, { char: "ㄴ", romaji: "n" }, { char: "ㄷ", romaji: "d / t" }, { char: "ㄹ", romaji: "r / l" },
    { char: "ㅁ", romaji: "m" }, { char: "ㅂ", romaji: "b / p" }, { char: "ㅅ", romaji: "s" }, { char: "ㅇ", romaji: "ng / quiet" },
    { char: "ㅈ", romaji: "j" }, { char: "ㅊ", romaji: "ch" }, { char: "ㅋ", romaji: "k" }, { char: "ㅌ", romaji: "t" },
    { char: "ㅍ", romaji: "p" }, { char: "ㅎ", romaji: "h" }
  ];

  const hangulVowels = [
    { char: "ㅏ", romaji: "a" }, { char: "ㅑ", romaji: "ya" }, { char: "ㅓ", romaji: "eo" }, { char: "ㅕ", romaji: "yeo" },
    { char: "ㅗ", romaji: "o" }, { char: "ㅛ", romaji: "yo" }, { char: "ㅜ", romaji: "u" }, { char: "ㅠ", romaji: "yu" },
    { char: "ㅡ", romaji: "eu" }, { char: "ㅣ", romaji: "i" }
  ];

  const hangulDouble = [
    { char: "ㄲ", romaji: "kk" }, { char: "ㄸ", romaji: "tt" }, { char: "ㅃ", romaji: "pp" }, { char: "ㅆ", romaji: "ss" }, { char: "ㅉ", romaji: "jj" },
    { char: "ㅐ", romaji: "ae" }, { char: "ㅒ", romaji: "yae" }, { char: "ㅔ", romaji: "e" }, { char: "ㅖ", romaji: "ye" },
    { char: "ㅘ", romaji: "wa" }, { char: "ㅙ", romaji: "wae" }, { char: "ㅚ", romaji: "oe" }, { char: "ㅝ", romaji: "wo" },
    { char: "ㅞ", romaji: "we" }, { char: "ㅟ", romaji: "wi" }, { char: "ㅢ", romaji: "ui" }
  ];

  const toggleCardFlip = (idx) => {
    setFlippedCards(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const speak = (text, e) => {
    if (e) e.stopPropagation();
    const cleanText = text.split('/')[0].replace(/[_/?!.,！？。、]/g, ' ').trim();
    
    // Použijeme stabilní ResponsiveVoice API, které funguje jako proxy pro Google TTS a nevyžaduje tokeny.
    const url = `https://code.responsivevoice.org/getvoice.php?t=${encodeURIComponent(cleanText)}&tl=ko-KR&sv=g1&vn=&pitch=0.5&rate=0.5&vol=1`;
    const audio = new Audio(url);
    
    audio.play().catch(() => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'ko-KR';
        utterance.rate = 0.8;
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
    setAiError('');

    if (!GEMINI_API_KEY) {
      setAiError(currentLang === 'en' ? 'AI service is currently unavailable (missing API key on server).' : 'Služba AI překladače momentálně není dostupná (chybí API klíč v prostředí).');
      setAiLoading(false);
      return;
    }

    try {
      const prompt = `Přelož tuto větu do přirozené korejštiny (zdvořilý styl -yo/-nida) pro cestovatele: "${aiInput.trim()}".
Vrať POUZE čistý JSON objekt bez markdownu v tomto formátu:
{"kr": "korejský zápis v hangulu", "romaji": "přepis výslovnosti v latince", "explanation": "stručné vysvětlení slovíček a gramatiky v jazyce ${currentLang === 'en' ? 'angličtina' : 'čeština'}"}`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        setAiResult(JSON.parse(jsonMatch[0]));
      } else {
        setAiError(currentLang === 'en' ? 'Could not parse AI response. Please try again.' : 'Odpověď AI se nepodařilo zpracovat. Zkuste to prosím znovu.');
      }
    } catch {
      setAiError(currentLang === 'en' ? 'AI service is temporarily unavailable. Please check your connection or API key.' : 'AI překladač je momentálně nedostupný. Zkontrolujte připojení nebo API klíč.');
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
      const prompt = `Vymysli krátkou, vtipnou a zapamatovatelnou mnemotechnickou pomůcku (max 2 věty v jazyce ${currentLang === 'en' ? 'English' : 'čeština'}), jak si zapamatovat korejskou frázi "${currentQuizItem.jp}" (${currentQuizItem.romaji}), která znamená "${currentLang === 'en' ? currentQuizItem.en : currentQuizItem.cs}".`;
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] })
      });
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      setAiHint(text || `Rozděl si výslovnost „${currentQuizItem.romaji}“ na slabiky a spoj si ji se situací v Koreji.`);
    } catch {
      setAiHint(`Tip: Rozděl si výslovnost „${currentQuizItem.romaji}“ na jednotlivé slabiky a přečti si ji nahlas.`);
    } finally {
      setAiHintLoading(false);
    }
  };

  return (
    <main className="ko-main-wrapper" style={{ maxWidth: '1100px', margin: '0 auto', padding: '6rem 2rem 3rem' }}>
      <Link to="/korea" className="back-cta">
        <i className="fa-solid fa-arrow-left"></i> {currentLang === 'en' ? 'Back to South Korea' : 'Zpět na Jižní Koreu'}
      </Link>

      <div className="glass ko-hero" style={{ position: 'relative', overflow: 'hidden' }}>
        <span className="kanji-deco">한국어</span>
        <h1>🇰🇷 {currentLang === 'en' ? 'Learn Korean' : 'Naučte se korejsky'}</h1>
        <p>{currentLang === 'en' ? 'Essential phrases, Hangul alphabet, and AI language tutor for traveling in South Korea.' : 'Základní fráze pro cestování po Koreji. Klikněte na kartu pro otočení 3D překladu nebo vyzkoušejte AI lektora.'}</p>
      </div>

      <div className="main-mode-toggle">
        <button className={`mode-tab-btn ${mainTab === 'phrases' ? 'active' : ''}`} onClick={() => setMainTab('phrases')}>
          <i className="fa-solid fa-comments"></i> <span>{currentLang === 'en' ? 'Travel Phrases' : 'Fráze pro cestovatele'}</span>
        </button>
        <button className={`mode-tab-btn ${mainTab === 'hangul' ? 'active' : ''}`} onClick={() => setMainTab('hangul')}>
          <span style={{ fontFamily: 'serif', fontSize: '1.1rem' }}>한</span> Hangul (한글)
        </button>
        <button className={`mode-tab-btn ${mainTab === 'ai' ? 'active' : ''}`} onClick={() => setMainTab('ai')}>
          <i className="fa-solid fa-wand-magic-sparkles"></i> <span>{currentLang === 'en' ? 'AI Tutor & Quiz' : 'AI Lektor & Kvíz'}</span>
        </button>
      </div>

      {mainTab === 'phrases' && (
        <div id="section-phrases">
          <div className="ko-filters">
            {categories.map(c => (
              <button 
                key={c.id}
                className={`ko-filter-btn ${c.id === activeCat ? 'active' : ''}`}
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
                role="button"
                tabIndex={0}
                aria-pressed={!!flippedCards[idx]}
                className={`phrase-card ${flippedCards[idx] ? 'flipped' : ''}`}
                onClick={() => toggleCardFlip(idx)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCardFlip(idx); } }}
              >
                <div className="phrase-card-inner">
                  <div className="phrase-front glass">
                    <span className="phrase-category-tag">
                      {categories.find(c => c.id === p.cat)?.[currentLang === 'en' ? 'en' : 'cs']}
                    </span>
                    <div className="phrase-ko">{p.jp}</div>
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

      {mainTab === 'hangul' && (
        <div id="section-hangul">
          <div className="ko-filters" style={{ marginBottom: '1.5rem' }}>
            <button className={`ko-filter-btn ${hangulSub === 'consonants' ? 'active' : ''}`} onClick={() => setHangulSub('consonants')}>Souhlásky (14)</button>
            <button className={`ko-filter-btn ${hangulSub === 'vowels' ? 'active' : ''}`} onClick={() => setHangulSub('vowels')}>Samohlásky (10)</button>
            <button className={`ko-filter-btn ${hangulSub === 'double' ? 'active' : ''}`} onClick={() => setHangulSub('double')}>Zdvojené (16)</button>
          </div>
          <div className="alphabet-grid">
            {(hangulSub === 'consonants' ? hangulConsonants : hangulSub === 'vowels' ? hangulVowels : hangulDouble).map((item, idx) => (
              <div key={idx} className="hangul-card" onClick={() => speak(item.char)}>
                <div className="hangul-char">{item.char}</div>
                <div className="hangul-romaji">{item.romaji}</div>
                <div className="hangul-sound-icon"><i className="fa-solid fa-volume-high"></i></div>
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
                ? 'Type any sentence you want to say in Korea and Gemini AI will translate it into Hangul, show pronunciation, and explain the grammar.'
                : 'Napište libovolnou větu, kterou chcete v Koreji říct, a umělá inteligence Gemini ji přeloží do Hangulu, vypíše výslovnost a vysvětlí gramatiku.'}
            </p>
            <form onSubmit={handleAiTranslate} style={{ display: 'flex', gap: '10px', marginBottom: '1.2rem' }}>
              <input
                type="text"
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                placeholder={currentLang === 'en' ? 'e.g. Is this dish very spicy?' : 'Např. Je tohle jídlo hodně pálivé?'}
                style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.06)', color: 'var(--text-main)' }}
              />
              <button type="submit" className="btn btn-primary" disabled={aiLoading}>
                {aiLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
              </button>
            </form>

            {aiError && (
              <div role="alert" style={{ background: 'rgba(231, 76, 60, 0.14)', border: '1px solid #e74c3c', color: '#ff8a80', borderRadius: '14px', padding: '1rem', fontSize: '0.9rem' }}>
                <i className="fa-solid fa-triangle-exclamation"></i> {aiError}
              </div>
            )}

            {aiResult && (
              <div style={{ background: 'rgba(239,35,60,0.08)', border: '1px solid rgba(239,35,60,0.3)', borderRadius: '16px', padding: '1.2rem' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.3rem' }}>{aiResult.kr}</div>
                <div style={{ color: 'var(--accent-color)', fontWeight: 600, marginBottom: '0.8rem' }}>{aiResult.romaji}</div>
                <button className="listen-btn" onClick={(e) => speak(aiResult.kr, e)} style={{ marginBottom: '0.8rem' }}>
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
              ? 'Koreans truly appreciate when foreigners try to speak Korean. Even simple words like "감사합니다" (thank you) will open many doors.'
              : 'Korejci si velmi váží, když se cizinci pokouší mluvit korejsky. I jednoduchá slova jako "감사합니다" (děkuji) vám otevřou mnoho dveří.'}
          </p>
        </div>
      </div>
    </main>
  );
}
