// ==============================================================
//  src/hooks/useSinifVerisi.js
//
//  Firebase Realtime Database'den ESP32'nin gönderdiği sınıf
//  verilerini gerçek zamanlı olarak dinleyen custom React hook'u.
//
//  KULLANIM ÖRNEĞİ:
//    const { veri, yukleniyor, hata } = useSinifVerisi("A101");
//
//  Firebase Realtime Database yapısı varsayımı:
//    /siniflar
//      /A101
//        hareket_durumu: 1
//        sicaklik: 22.5
//        isik_lux: 150
//        klima_durumu: "ACIK"
//        aydinlatma_durumu: "KAPALI"
//        zaman_damgasi: "2026-05-21T10:35:00Z"
//      /B202
//        ...
// ==============================================================

import { useState, useEffect, useCallback } from "react";
import { ref, onValue, off } from "firebase/database";
import { db } from "../firebase/firebase";

// ---------------------------------------------------------------
//  Veri modeli için başlangıç değerleri (null-safe erişim için)
// ---------------------------------------------------------------
const BOSLUK_VERI = {
  sinif_id: null,
  hareket_durumu: null,   // 0 = hareketsiz, 1 = hareket var
  sicaklik: null,         // Celsius
  isik_lux: null,         // Lüks cinsinden ışık şiddeti
  klima_durumu: null,     // "ACIK" | "KAPALI"
  aydinlatma_durumu: null,// "ACIK" | "KAPALI"
  zaman_damgasi: null,    // ISO 8601 string
};

// ---------------------------------------------------------------
//  useSinifVerisi Hook
//
//  @param {string} sinifId - Dinlenecek sınıfın ID'si (örn: "A101")
//  @param {Object} [seçenekler]
//  @param {boolean} [seçenekler.gecmisTumu=false]
//    true ise tüm siniflar node'unu dinler,
//    false ise sadece belirtilen sinifId'yi dinler.
//
//  @returns {{
//    veri: Object,          - Güncel sınıf verisi
//    yukleniyor: boolean,   - İlk veri henüz gelmedi mi?
//    hata: Error|null,      - Bağlantı/veri hatası
//    sonGuncelleme: Date|null - Verinin son güncellenme zamanı
//  }}
// ---------------------------------------------------------------
export function useSinifVerisi(sinifId, { gecmisTumu = false } = {}) {
  const [veri, setVeri]                   = useState(BOSLUK_VERI);
  const [yukleniyor, setYukleniyor]       = useState(true);
  const [hata, setHata]                   = useState(null);
  const [sonGuncelleme, setSonGuncelleme] = useState(null);

  useEffect(() => {
    // sinifId verilmediyse abonelik açma
    if (!sinifId && !gecmisTumu) {
      setYukleniyor(false);
      return;
    }

    // -------------------------------------------------------
    //  Firebase Realtime Database referansını oluştur
    //  Yol: /siniflar/A101  veya  /siniflar (tümü için)
    // -------------------------------------------------------
    const dbYolu = gecmisTumu ? "siniflar" : `siniflar/${sinifId}`;
    const sinifRef = ref(db, dbYolu);

    // -------------------------------------------------------
    //  onValue → veritabanındaki her değişiklikte tetiklenir
    //  (WebSocket üzerinden gerçek zamanlı dinleme)
    // -------------------------------------------------------
    const abonelikIptal = onValue(
      sinifRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const hamVeri = snapshot.val();

          // Firebase'den gelen veriyi state'e yaz
          setVeri(hamVeri);
          setSonGuncelleme(new Date());
          setHata(null);
        } else {
          // Node mevcut değil — belki ESP32 henüz veri göndermedi
          setVeri(BOSLUK_VERI);
          setHata(new Error(`"${dbYolu}" yolunda veri bulunamadı.`));
        }

        setYukleniyor(false);
      },
      (firebaseHatasi) => {
        // Ağ hatası, izin hatası vb.
        console.error("[useSinifVerisi] Firebase hatası:", firebaseHatasi);
        setHata(firebaseHatasi);
        setYukleniyor(false);
      }
    );

    // -------------------------------------------------------
    //  Temizlik fonksiyonu: bileşen unmount olduğunda veya
    //  sinifId değiştiğinde aboneliği iptal et
    //  (bellek sızıntısı ve gereksiz dinlemeyi önler)
    // -------------------------------------------------------
    return () => {
      off(sinifRef);        // onValue aboneliğini kapat
      abonelikIptal();      // onValue'nun döndürdüğü unsubscribe'ı çağır
    };
  }, [sinifId, gecmisTumu]);

  return { veri, yukleniyor, hata, sonGuncelleme };
}

// ---------------------------------------------------------------
//  useTumSiniflar — Tüm sınıfları tek seferde dinleyen kısayol
//
//  @returns {{
//    siniflar: Object,   - { A101: {...}, B202: {...} } şeklinde map
//    yukleniyor: boolean,
//    hata: Error|null
//  }}
// ---------------------------------------------------------------
export function useTumSiniflar() {
  const [siniflar, setSiniflar]     = useState({});
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata]             = useState(null);

  useEffect(() => {
    const tumSiniflarRef = ref(db, "siniflar");

    const abonelikIptal = onValue(
      tumSiniflarRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setSiniflar(snapshot.val());
        } else {
          setSiniflar({});
        }
        setYukleniyor(false);
        setHata(null);
      },
      (err) => {
        console.error("[useTumSiniflar] Firebase hatası:", err);
        setHata(err);
        setYukleniyor(false);
      }
    );

    return () => {
      off(tumSiniflarRef);
      abonelikIptal();
    };
  }, []);

  return { siniflar, yukleniyor, hata };
}
