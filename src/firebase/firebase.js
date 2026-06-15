// ==============================================================
//  src/firebase/firebase.js
//  Firebase uygulamasını başlatır ve Realtime Database örneğini
//  dışa aktarır. Tüm Firebase işlemleri bu dosya üzerinden gider.
// ==============================================================

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// ---------------------------------------------------------------
//  Yapılandırma değerleri .env dosyasından okunur.
//  Vite'da environment variable'lar VITE_ prefix'i ile tanımlanır
//  ve import.meta.env üzerinden erişilir.
// ---------------------------------------------------------------
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL:       import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// ---------------------------------------------------------------
//  Firebase uygulamasını başlat (singleton — tekrar çağrılsa bile
//  aynı instance döner)
// ---------------------------------------------------------------
const app = initializeApp(firebaseConfig);

// ---------------------------------------------------------------
//  Realtime Database referansını dışa aktar.
//  Proje genelinde tüm hook'lar bu db örneğini kullanacak.
// ---------------------------------------------------------------
export const db = getDatabase(app);

export default app;
