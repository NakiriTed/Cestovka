import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  db, auth, isConfigured, doc, getDoc, setDoc, onAuthStateChanged, signOut,
  signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, 
  createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail
} from '../../firebase-config.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  useEffect(() => {
    if (!isConfigured || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const uSnap = await getDoc(doc(db, "users", user.uid));
          if (uSnap.exists()) {
            setUserProfile(uSnap.data());
          } else {
            setUserProfile(null);
          }
        } catch (e) {
          console.error("Error fetching user profile:", e);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email, password) => {
    if (!isConfigured) {
      alert("MOCK Login.");
      setIsAuthModalOpen(false);
      return;
    }
    await signInWithEmailAndPassword(auth, email, password);
    setIsAuthModalOpen(false);
  };

  const registerWithEmail = async (name, email, password) => {
    if (!isConfigured) {
      alert("MOCK Registration.");
      setIsAuthModalOpen(false);
      return;
    }
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    const profileData = {
      displayName: name,
      email: email,
      createdAt: new Date().toISOString(),
      avatarUrl: "",
      gender: "",
      birthDate: "",
      realName: "",
      city: "",
      trips: ""
    };
    await setDoc(doc(db, "users", cred.user.uid), profileData);
    setUserProfile(profileData);
    setIsAuthModalOpen(false);
  };

  const socialLogin = async (providerName) => {
    if (!isConfigured) {
      alert("MOCK Social Login.");
      setIsAuthModalOpen(false);
      return;
    }
    let provider;
    if (providerName === 'google') provider = new GoogleAuthProvider();
    if (providerName === 'facebook') provider = new FacebookAuthProvider();

    const cred = await signInWithPopup(auth, provider);
    const uRef = doc(db, "users", cred.user.uid);
    const uSnap = await getDoc(uRef);
    if (!uSnap.exists()) {
      const profileData = {
        displayName: cred.user.displayName || "Cestovatel(ka)",
        email: cred.user.email || "",
        createdAt: new Date().toISOString(),
        avatarUrl: cred.user.photoURL || "",
        gender: "",
        birthDate: "",
        realName: "",
        city: "",
        trips: ""
      };
      await setDoc(uRef, profileData);
      setUserProfile(profileData);
    }
    setIsAuthModalOpen(false);
  };

  const resetPassword = async (email) => {
    if (!email) {
      alert("Vyplňte prosím nejdříve váš E-mail.");
      return;
    }
    if (isConfigured) {
      await sendPasswordResetEmail(auth, email);
      alert("E-mail s odkazem na obnovu hesla byl odeslán.");
    } else {
      alert("MOCK: Odeslán resetovací e-mail.");
    }
  };

  const logout = async () => {
    if (auth) {
      await signOut(auth);
    }
    setCurrentUser(null);
    setUserProfile(null);
  };

  const openLoginModal = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthMode('register');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const updateUserProfile = async (updates) => {
    if (!currentUser || !isConfigured) return;
    const uRef = doc(db, "users", currentUser.uid);
    await setDoc(uRef, updates, { merge: true });
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      userProfile,
      loading,
      isAuthModalOpen,
      authMode,
      setAuthMode,
      openLoginModal,
      openRegisterModal,
      closeAuthModal,
      loginWithEmail,
      registerWithEmail,
      socialLogin,
      resetPassword,
      logout,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
