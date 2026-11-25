import { 
    db, auth, isConfigured, doc, getDoc, setDoc, onAuthStateChanged, signOut,
    signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, 
    createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail
} from './firebase-config.js';

// --- GLOBÁLNÍ FUNKCE PRO AUTH MODAL ---
window.openAuthModal = () => {
    const modal = document.getElementById('forumAuthModal');
    if (modal) modal.classList.add('active');
};

window.closeAuthModal = () => {
    const modal = document.getElementById('forumAuthModal');
    if (modal) modal.classList.remove('active');
};

window.toggleAuthForms = (e, target) => {
    if (e) e.preventDefault();
    document.getElementById('auth-form-login').style.display = target === 'login' ? 'block' : 'none';
    document.getElementById('auth-form-register').style.display = target === 'register' ? 'block' : 'none';
};

window.forumSignOut = async () => {
    try {
        await signOut(auth);
        window.location.reload();
    } catch(err) {
        alert("Chyba odhlášení: " + err.message);
    }
};

window.globalOpenLoginModal = () => {
    window.openAuthModal();
};

window.forumResetPassword = async (e) => {
    if (e) e.preventDefault();
    const email = document.getElementById('login-email').value;
    if(!email) {
        alert("Vyplňte prosím nejdříve svůj E-mail v políčku výše, na který chcete zaslat odkaz pro obnovu hesla.");
        return;
    }
    if(isConfigured) {
        try {
            await sendPasswordResetEmail(auth, email);
            alert("E-mail s odkazem na obnovu hesla byl odeslán (pokud u nás účet pro tento e-mail existuje).");
        } catch(err) { alert('Chyba: ' + err.message); }
    } else {
        alert("MOCK: Odeslán e-mail pro obnovu hesla na " + email);
    }
};

window.forumSocialLogin = async (providerName) => {
    if(!isConfigured) { alert("MOCK: Social Login " + providerName); return; }
    try {
        let provider;
        if(providerName === 'google') provider = new GoogleAuthProvider();
        if(providerName === 'facebook') provider = new FacebookAuthProvider();
        
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;
        
        const uRef = doc(db, "users", user.uid);
        const uSnap = await getDoc(uRef);
        if(!uSnap.exists()) {
            await setDoc(uRef, {
                displayName: user.displayName || "Cestovatel(ka)",
                email: user.email || "",
                createdAt: new Date().toISOString(),
                avatarUrl: user.photoURL || "",
                gender: "",
                birthDate: "",
                realName: "",
                city: "",
                trips: ""
            });
        }
        window.closeAuthModal();
        window.location.reload();
    } catch(err) {
        alert('Chyba přihlášení přes ' + providerName + ': ' + err.message);
    }
};

// Injektáž modalu do stránky, pokud neexistuje
const injectAuthModal = () => {
    if (document.getElementById('forumAuthModal')) return;

    const modalHtml = `
    <div class="cms-modal auth-modal-overlay" id="forumAuthModal">
        <div class="auth-modal-card">
            <button type="button" class="auth-close-btn" onclick="closeAuthModal()" aria-label="Zavřít">
                <i class="fa-solid fa-xmark"></i>
            </button>
            
            <div id="auth-form-login" class="auth-form-step">
                <h2 class="auth-modal-title">Přihlášení do komunity</h2>
                <p class="auth-modal-subtitle">Získejte přístup k plánovači a diskusnímu fóru</p>
                
                <form id="forum-login-form" class="auth-form-body">
                    <div class="auth-field-group">
                        <label for="login-email" class="auth-label">E-mail</label>
                        <input type="email" id="login-email" class="auth-input" placeholder="vase.jmeno@email.cz" required autocomplete="email">
                    </div>
                    
                    <div class="auth-field-group">
                        <div class="auth-label-row">
                            <label for="login-pass" class="auth-label">Heslo</label>
                            <a href="#" onclick="forumResetPassword(event)" class="auth-forgot-link">Zapomenuté heslo?</a>
                        </div>
                        <input type="password" id="login-pass" class="auth-input" placeholder="••••••••" required autocomplete="current-password">
                    </div>
                    
                    <button type="submit" class="auth-btn-primary">
                        <i class="fa-solid fa-right-to-bracket"></i> Přihlásit se
                    </button>
                    
                    <div class="auth-divider"><span>NEBO</span></div>
                    
                    <div class="auth-social-row">
                        <button type="button" class="auth-btn-social google" onclick="forumSocialLogin('google')">
                            <i class="fa-brands fa-google"></i> Google
                        </button>
                        <button type="button" class="auth-btn-social facebook" onclick="forumSocialLogin('facebook')">
                            <i class="fa-brands fa-facebook-f"></i> Facebook
                        </button>
                    </div>
                    
                    <p class="auth-switch-text">
                        Nemáte ještě účet? <a href="#" onclick="toggleAuthForms(event, 'register')" class="auth-switch-link">Zaregistrujte se</a>
                    </p>
                </form>
            </div>

            <div id="auth-form-register" class="auth-form-step" style="display: none;">
                <h2 class="auth-modal-title">Registrace účtu</h2>
                <p class="auth-modal-subtitle">Připojte se k naší japonsko-korejské komunitě</p>

                <form id="forum-register-form" class="auth-form-body">
                    <div class="auth-field-group">
                        <label for="reg-name" class="auth-label">Zobrazované jméno</label>
                        <input type="text" id="reg-name" class="auth-input" placeholder="Cestovatel 123" required
                            pattern="^[a-zA-Zá-žÁ-Ž\\s.]+$" title="Jméno může obsahovat pouze písmena"
                            oninput="this.value = this.value.replace(/[0-9]/g, '')">
                    </div>

                    <div class="auth-field-group">
                        <label for="reg-email" class="auth-label">E-mail</label>
                        <input type="email" id="reg-email" class="auth-input" placeholder="vase.jmeno@email.cz" required autocomplete="email">
                    </div>
                    
                    <div class="auth-field-group">
                        <label for="reg-pass" class="auth-label">Heslo</label>
                        <input type="password" id="reg-pass" class="auth-input" placeholder="Alespoň 6 znaků" required autocomplete="new-password">
                    </div>
                    
                    <button type="submit" class="auth-btn-primary success">
                        <i class="fa-solid fa-user-plus"></i> Vytvořit účet
                    </button>

                    <p class="auth-switch-text">
                        Již máte účet? <a href="#" onclick="toggleAuthForms(event, 'login')" class="auth-switch-link">Přihlaste se</a>
                    </p>
                </form>
            </div>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Zavření modalu při kliknutí na pozadí (overlay)
    const authModal = document.getElementById('forumAuthModal');
    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) window.closeAuthModal();
        });
    }

    // Připojení handlerů
    document.getElementById('forum-login-form').onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-pass').value;
        if(isConfigured) {
            try {
                await signInWithEmailAndPassword(auth, email, pass);
                window.closeAuthModal();
            } catch(err) { alert('Chyba: ' + err.message); }
        } else {
            alert("MOCK Login."); window.closeAuthModal();
        }
    };

    document.getElementById('forum-register-form').onsubmit = async (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const pass = document.getElementById('reg-pass').value;
        if(isConfigured) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
                await updateProfile(userCredential.user, { displayName: name });
                await setDoc(doc(db, "users", userCredential.user.uid), {
                    displayName: name, email: email, createdAt: new Date().toISOString(),
                    avatarUrl: "", gender: "", birthDate: "", realName: "", city: "", trips: ""
                });
                window.closeAuthModal();
                window.location.reload(); 
            } catch(err) { alert('Chyba registrace: ' + err.message); }
        } else {
            alert("MOCK Registrace."); window.closeAuthModal();
        }
    };
};

injectAuthModal();

if (isConfigured) {
    onAuthStateChanged(auth, async (user) => {
        window.forumUser = user || null;
        const navAuthArea = document.getElementById('nav-auth-container');
        if(!navAuthArea) return;
        
        if (user) {
            let avatarUrl = "";
            try {
                const uDoc = await getDoc(doc(db, "users", user.uid));
                if(uDoc.exists()) avatarUrl = uDoc.data().avatarUrl;
            } catch(e) {}

            const avatarHtml = avatarUrl 
                ? `<img src="${avatarUrl}" style="width:35px; height:35px; border-radius:50%; object-fit:cover;">` 
                : `<i class="fa-solid fa-circle-user" style="font-size: 1.5rem;"></i>`;

            navAuthArea.innerHTML = `
                <a href="profile.html" style="color: var(--accent-color); text-decoration: none; display: flex; align-items: center; gap: 4px; margin-right: 2px;">
                    ${avatarHtml}
                    <span style="font-size: 0.9rem; font-weight: bold; color: var(--text-main); display: none;" class="hide-mobile">Profil</span>
                </a>
                <button onclick="forumSignOut()" class="btn btn-icon" style="background: transparent; color: var(--text-muted); font-size: 1.1rem; cursor:pointer; border:none; padding: 4px;" title="Odhlásit se"><i class="fa-solid fa-right-from-bracket"></i></button>
            `;
        } else {
            navAuthArea.innerHTML = `
                <button onclick="globalOpenLoginModal()" title="Přihlásit se" class="nav-login-btn" style="background: var(--accent-color); border: none; cursor: pointer; color: white; border-radius: 20px; padding: 6px 14px; font-size: 0.85rem; font-weight: 700; font-family: inherit; display: flex; align-items: center; gap: 6px; white-space: nowrap; transition: opacity 0.2s;" data-i18n="nav.login"><i class="fa-solid fa-right-to-bracket"></i> Přihlásit se</button>
            `;
        }
    });

    if (window.location.search.includes('login=true')) {
        setTimeout(() => {
            window.openAuthModal();
        }, 300);
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// --- SPA Plynulé Přechody Stránek ---
document.addEventListener("DOMContentLoaded", () => {
    // Oprava pro "Back button" (bfcache) - odstraní fade-out, když se uživatel vrátí zpět
    window.addEventListener('pageshow', (event) => {
        if (event.persisted || document.body.classList.contains('fade-out')) {
            document.body.classList.remove('fade-out');
        }
    });

    // Zachycení kliknutí na všechny odkazy
    document.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', e => {
            // Ignorujeme odkazy s target="_blank", externí weby, kotvy (#), prázdné odkazy nebo odkazy s js
            const isLocal = a.hostname === window.location.hostname;
            const isBlank = a.target === '_blank';
            const isHash = a.getAttribute('href') && a.getAttribute('href').startsWith('#');
            const isJs = a.getAttribute('href') && a.getAttribute('href').startsWith('javascript:');
            const isEmpty = !a.getAttribute('href') || a.getAttribute('href') === '#';
            const isDownload = a.hasAttribute('download');

            if (isLocal && !isBlank && !isHash && !isJs && !isEmpty && !isDownload) {
                e.preventDefault();
                const targetUrl = a.href;
                
                // Přidání fade-out třídy
                document.body.classList.add('fade-out');
                
                // Zpožděná navigace (odpovídá času CSS animace 0.4s)
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 400);
            }
        });
    });
});
