import { useState, useEffect } from "react";
import { ref, onValue, off } from "firebase/database";
import { db } from "../firebase/firebase";

export function useGecmisVeri(sinifId) {
    const [gecmisVeriler, setGecmisVeriler] = useState([]);

    useEffect(() => {
        // /loglar/A101 yolunu dinliyoruz
        const logRef = ref(db, `loglar/${sinifId}`);

        const abonelikIptal = onValue(logRef, (snapshot) => {
            if (snapshot.exists()) {
                const hamVeri = snapshot.val();

                // Firebase objesini diziye (array) çevir
                // Object.values, rastgele üretilen Firebase ID'lerini atıp sadece verileri alır
                const veriDizisi = Object.values(hamVeri);

                setGecmisVeriler(veriDizisi);
            } else {
                setGecmisVeriler([]);
            }
        });

        return () => {
            off(logRef);
            abonelikIptal();
        };
    }, [sinifId]);

    return gecmisVeriler;
}