import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, query, where } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "cestovka"); // Using the custom database ID from seed script
const storage = getStorage(app);

/**
 * Zmenší a zkomprimuje obrázek v prohlížeči na Data URL (JPEG),
 * aby se vešel do limitu dokumentu ve Firestore (1 MiB).
 */
export function compressImageToDataUrl(file, maxWidth = 1400, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let w = img.width;
        let h = img.height;
        if (w > maxWidth) {
          h = Math.round(h * (maxWidth / w));
          w = maxWidth;
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Nahraje zkomprimovaný obrázek přímo do databáze Firestore (itineraries/_media/items/{id})
 * a vrátí jeho dataUrl.
 */
export async function uploadImageToFirestore(file, maxWidth = 1400, quality = 0.8) {
  const dataUrl = await compressImageToDataUrl(file, maxWidth, quality);
  const docId = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  await setDoc(doc(db, "itineraries", "_media", "items", docId), {
    name: file.name,
    dataUrl,
    updatedAt: new Date().toISOString(),
  });
  return dataUrl;
}

export { db, storage, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, ref, uploadBytes, getDownloadURL, query, where };
