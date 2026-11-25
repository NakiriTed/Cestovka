// Okamžitá aplikace tématu (před načtením DOM, aby se předešlo blikání)
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

    if (themeIcon) updateIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateIcon(newTheme);
        });
    }

    function updateIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fa-solid fa-sun'; // Show sun to toggle to light
        } else {
            themeIcon.className = 'fa-solid fa-moon'; // Show moon to toggle to dark
        }
    }

    // --- GLOBÁLNÍ AUTH ---
    // Dynamické vložení autentizačního prostoru do lišty (pro stránky, kde to chybí v HTML)
    const adminIcon = document.querySelector('a.theme-toggle[href="admin.html"]');
    if (adminIcon && !document.getElementById('nav-auth-container')) {
        const authContainer = document.createElement('div');
        authContainer.id = 'nav-auth-container';
        authContainer.style.display = 'flex';
        authContainer.style.alignItems = 'center';
        authContainer.style.gap = '5px';
        authContainer.style.marginRight = '5px';
        adminIcon.parentNode.insertBefore(authContainer, adminIcon);
    }

    // --- MOBILNÍ MENU (Hamburger) ---
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelector('.nav-links');
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (navContainer && navLinks && !document.querySelector('.mobile-menu-btn')) {
        const mobileBtn = document.createElement('button');
        mobileBtn.className = 'mobile-menu-btn';
        mobileBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';

        const authCont = document.getElementById('nav-auth-container');
        if (authCont) {
            authCont.parentNode.insertBefore(mobileBtn, authCont);
        } else if (themeToggleBtn) {
            themeToggleBtn.parentNode.insertBefore(mobileBtn, themeToggleBtn);
        } else {
            navContainer.appendChild(mobileBtn);
        }

        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            const isOpen = navLinks.classList.contains('nav-active');

            mobileBtn.innerHTML = isOpen
                ? '<i class="fa-solid fa-xmark"></i>'
                : '<i class="fa-solid fa-bars"></i>';

            // Přidat / odebrat přihlašovací tlačítko v mobilním menu
            const existingMobileLogin = navLinks.querySelector('.mobile-nav-login-li');
            if (isOpen && !existingMobileLogin) {
                const li = document.createElement('li');
                li.className = 'mobile-nav-login-li';

                const btn = document.createElement('button');
                btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Přihlásit se';
                btn.onclick = () => {
                    navLinks.classList.remove('nav-active');
                    mobileBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
                    const existingLi = navLinks.querySelector('.mobile-nav-login-li');
                    if (existingLi) existingLi.remove();
                    if (typeof globalOpenLoginModal === 'function') globalOpenLoginModal();
                };

                li.appendChild(btn);
                navLinks.appendChild(li);
            } else if (!isOpen && existingMobileLogin) {
                existingMobileLogin.remove();
            }
        });
    }
});

// Carousel Logic
window.moveCarousel = function (carouselId, direction) {
    const carouselContainer = document.getElementById(carouselId);
    if (!carouselContainer) return;

    const images = carouselContainer.querySelectorAll('.carousel-inner img');
    if (images.length === 0) return;

    let currentIndex = Array.from(images).findIndex(img => img.classList.contains('active'));

    if (currentIndex !== -1) {
        images[currentIndex].classList.remove('active');
    } else {
        currentIndex = 0;
    }

    let newIndex = currentIndex + direction;
    if (newIndex >= images.length) newIndex = 0;
    if (newIndex < 0) newIndex = images.length - 1;

    images[newIndex].classList.add('active');
};

// Falling leaves effect for Home Page
if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('Moje%20webovka/')) {
    setInterval(createLeaf, 700);
}

function createLeaf() {
    const leaf = document.createElement('i');
    leaf.classList.add('fa-solid', 'fa-leaf', 'falling-leaf');

    leaf.style.left = Math.random() * 100 + 'vw';
    const duration = Math.random() * 5 + 6;
    leaf.style.animationDuration = duration + 's';
    const size = Math.random() * 12 + 10;
    leaf.style.fontSize = size + 'px';
    const drift = (Math.random() - 0.5) * 200;
    leaf.style.setProperty('--drift', drift + 'px');

    document.body.appendChild(leaf);

    setTimeout(() => {
        leaf.remove();
    }, duration * 1000);
}


// --- AI CHATBOT A COOKIE BANNER INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // --- COOKIE BANNER ---
    if (!localStorage.getItem('cookieConsent')) {
        const cookieBanner = document.createElement('div');
        cookieBanner.id = 'cookie-banner';
        cookieBanner.className = 'glass';
        cookieBanner.innerHTML = `
            <div class="cookie-content">
                <i class="fa-solid fa-cookie-bite" style="color: var(--accent-color); font-size: 1.5rem;"></i>
                <p>Tento web používá soubory cookies (vč. služeb třetích stran jako Google Firebase a YouTube) pro zajištění správného chodu a analýzu. Pokračováním v prohlížení s tímto souhlasíte.</p>
            </div>
            <div class="cookie-buttons">
                <button id="accept-cookies" class="btn btn-primary" style="padding: 0.6rem 1.2rem; font-size: 0.85rem; border: none; cursor: pointer;">Rozumím a přijímám</button>
            </div>
        `;
        document.body.appendChild(cookieBanner);

        document.getElementById('accept-cookies').addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.style.opacity = '0';
            setTimeout(() => cookieBanner.remove(), 300);
        });
    }

    // Only inject Chatbot on frontend pages, not admin
    if (window.location.pathname.includes('admin.html')) return;

    const chatbotHTML = `
        <button id="chatbot-toggle-btn" aria-label="Open AI Chat">
            <span style="font-size: 1.5rem;">🌸</span>
        </button>
        
        <div id="chatbot-container">
            <div class="chatbot-header">
                <div class="chatbot-title">
                    <span>🌸</span>
                    Tedův AI Asistent
                </div>
                <button class="chatbot-close"><i class="fa-solid fa-xmark"></i></button>
            </div>
            
            <div class="chatbot-messages" id="chatbot-messages">
                <div class="chat-bubble bot">
                    Ahoj! Jsem Tedův AI asistent. Zeptej se mě na cokoliv ohledně cesty do Japonska! 🌸
                </div>
                <!-- Typing indicator -->
                <div class="typing-indicator" id="chatbot-typing">
                    <span></span><span></span><span></span>
                </div>
            </div>
            
            <div class="chatbot-input-area">
                <input type="text" id="chatbot-input" placeholder="Napiš zprávu..." autocomplete="off">
                <button id="chatbot-send"><i class="fa-solid fa-paper-plane"></i></button>
            </div>
        </div>
    `;

    // Inject into body
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);

    const toggleBtn = document.getElementById('chatbot-toggle-btn');
    const chatContainer = document.getElementById('chatbot-container');
    const closeBtn = document.querySelector('.chatbot-close');
    const sendBtn = document.getElementById('chatbot-send');
    const inputField = document.getElementById('chatbot-input');
    const messagesContainer = document.getElementById('chatbot-messages');
    const typingIndicator = document.getElementById('chatbot-typing');

    // Toggle Chat
    function toggleChat() {
        chatContainer.classList.toggle('active');
        if (chatContainer.classList.contains('active')) {
            inputField.focus();
        }
    }

    toggleBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    async function sendMessage() {
        const text = inputField.value.trim();
        if (!text) return;

        appendMessage(text, 'user');
        inputField.value = '';

        messagesContainer.appendChild(typingIndicator);
        typingIndicator.style.display = 'flex';
        scrollToBottom();

        const response = await askAI(text);

        typingIndicator.style.display = 'none';
        appendMessage(response, 'bot');
    }

    sendBtn.addEventListener('click', sendMessage);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    function appendMessage(text, sender) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${sender}`;
        
        if (sender === 'bot') {
            // Jednoduchý převod Markdownu na HTML (tučné písmo)
            let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            // Zvýraznění odrážek (nepovinné, white-space: pre-wrap vyřeší řádky)
            formattedText = formattedText.replace(/(^|\n)\*\s/g, '$1• ');
            
            bubble.innerHTML = formattedText;
        } else {
            // Uživatelský vstup vkládáme jako čistý text kvůli bezpečnosti (XSS)
            bubble.textContent = text;
        }
        
        messagesContainer.appendChild(bubble);
        scrollToBottom();
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // --- REAL GEMINI AI FUNCTION (ZDARMA PRO LOCALHOST) ---
    // POZOR: Až budeš dávat web veřejně, tento klíč nesmí být v kódu!
    const GEMINI_API_KEY = "AIzaSyClT3PSEBSUtMDLJ_CCwTDjPsV1dRLso4M";

    // Udržujeme si historii, aby bot věděl, o čem se bavíte
    let chatHistory = [
        {
            "role": "user",
            "parts": [{ "text": "Jsi Tedův AI asistent pro web 'Tedův východní svět'. Odpovídej stručně, přátelsky a zaměřuj se na informace o Japonsku (itineráře, tipy na cesty, jídlo, ceny, doprava). Pokud nevíš odpověď nebo se uživatel ptá na úplně nesouvisející věci, řekni, že by se cestovatel měl obrátit přímo na Teda přes stránku Kontakt." }]
        },
        {
            "role": "model",
            "parts": [{ "text": "Rozumím. Budu odpovídat jako přátelský asistent na webu Tedův východní svět, pomáhat s dotazy ohledně Japonska a případně odkazovat na kontakt." }]
        }
    ];

    // Detekce modelu jednou při startu, pak cache
    let cachedModelName = null;
    async function getGeminiModel() {
        if (cachedModelName) return cachedModelName;
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || 'Chyba klíče');
        const models = data.models || [];
        const found = models.find(m => m.name.includes('gemini-1.5-flash') && m.supportedGenerationMethods?.includes('generateContent'))
            || models.find(m => m.name.includes('gemini-1.5-pro') && m.supportedGenerationMethods?.includes('generateContent'))
            || models.find(m => m.supportedGenerationMethods?.includes('generateContent'));
        if (!found) throw new Error('Žádný dostupný model');
        cachedModelName = found.name;
        console.log('Gemini model (cached):', cachedModelName);
        return cachedModelName;
    }

    async function askAI(userMessage) {
        if (GEMINI_API_KEY === 'ZDE_VLOZ_SVUJ_KLIC_Z_AI_STUDIO') {
            return 'Ahoj! Vypadá to, že jsi ještě nenastavil svůj API klíč. Běž na Google AI Studio, získej bezplatný klíč a vlož ho do souboru app.js!';
        }

        chatHistory.push({ role: 'user', parts: [{ text: userMessage }] });

        try {
            const selectedModel = await getGeminiModel();
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/${selectedModel}:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: chatHistory })
            });

            if (!response.ok) {
                console.error('API Error:', await response.text());
                return 'Jejda, vyskytla se chyba při komunikaci s AI.';
            }

            const data = await response.json();
            const botReply = data.candidates[0].content.parts[0].text;
            chatHistory.push({ role: 'model', parts: [{ text: botReply }] });
            return botReply;

        } catch (error) {
            console.error('Fetch error:', error);
            return 'Promiň, nepodařilo se mi spojit se serverem. Zkontroluj připojení k internetu.';
        }
    }
});

