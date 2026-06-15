import { useState, useEffect } from "react";
import { ref, onValue, off } from "firebase/database";
import { db } from "../firebase/firebase";

const BOSLUK_VERI = {
  sinif_id: null,
  hareket_durumu: null,
  sicaklik: null,
  isik_lux: null,
  klima_durumu: null,
  aydinlatma_durumu: null,
  zaman_damgasi: null,
};

export function useSinifVerisi(sinifId, { gecmisTumu = false } = {}) {
  const [veri, setVeri]                   = useState(BOSLUK_VERI);
  const [yukleniyor, setYukleniyor]       = useState(true);
  const [hata, setHata]                   = useState(null);
  const [sonGuncelleme, setSonGuncelleme] = useState(null);

  useEffect(() => {
    if (!sinifId && !gecmisTumu) {
      setYukleniyor(false);
      return;
    }

    const dbYolu = gecmisTumu ? "siniflar" : `siniflar/${sinifId}`;
    const sinifRef = ref(db, dbYolu);

    const abonelikIptal = onValue(
      sinifRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const hamVeri = snapshot.val();
          setVeri(hamVeri);
          setSonGuncelleme(new Date());
          setHata(null);
        } else {
          setVeri(BOSLUK_VERI);
          setHata(new Error(`"${dbYolu}" yolunda veri bulunamadı.`));
        }
        setYukleniyor(false);
      },
      (firebaseHatasi) => {
        console.error("[useSinifVerisi] Firebase hatası:", firebaseHatasi);
        setHata(firebaseHatasi);
        setYukleniyor(false);
      }
    );

    return () => {
      off(sinifRef);
      abonelikIptal();
    };
  }, [sinifId, gecmisTumu]);

  return { veri, yukleniyor, hata, sonGuncelleme };
}

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
