import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp, deleteDoc, doc, updateDoc, setDoc, getDoc, increment, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// Firebase Konfigurace
const firebaseConfig = {
  apiKey: "AIzaSyDxJ3Ew2mLKs15nVFdQUV9PQZw_qL2avTY",
  authDomain: "cestovka-55f10.firebaseapp.com",
  projectId: "cestovka-55f10",
  storageBucket: "cestovka-55f10.firebasestorage.app",
  messagingSenderId: "660762572264",
  appId: "1:660762572264:web:671edd553bc734d82ce05d"
};

let app, db, auth, storage;
const isConfigured = true;

if (isConfigured) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app, "cestovka");
  auth = getAuth(app);
  storage = getStorage(app);
  console.log("Firebase připojeno úspěšně!");
} else {
  console.warn("UPOZORNĚNÍ: Běží testovací/lokální mód (Firebase klíče nevloženy). Data se neuloží reálně na server.");
}

export {
  db, auth, storage, isConfigured,
  collection, addDoc, getDocs, query, orderBy, serverTimestamp,
  signInWithEmailAndPassword, onAuthStateChanged, signOut,
  signInWithPopup, GoogleAuthProvider, FacebookAuthProvider,
  createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail,
  deleteDoc, doc, updateDoc, setDoc, getDoc, increment, where,
  ref, uploadBytes, getDownloadURL, deleteObject
};
