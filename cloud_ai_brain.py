import os
import sys
import time
import argparse
import logging
from datetime import datetime, timezone
from collections import deque

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  [%(levelname)s]  %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler("cloud_ai_brain.log", encoding="utf-8"),
    ]
)
log = logging.getLogger("BulutBeyni")

PENCERE_BOYUTU     = 30
GUNCELLEME_ARALIGI = 60
MODEL_DOSYASI      = "smart_class_model.h5"
SCALER_DOSYASI     = "model_scaler.pkl"
SERVIS_HESABI      = "serviceAccountKey.json"
DATABASE_URL       = "https://akilli-sinif-otomasyon-default-rtdb.europe-west1.firebasedatabase.app"
ENERJI_TASARRUF_BAZ = 18.0


def bagimliliklari_yukle():
    eksik = []
    try:
        import firebase_admin
    except ImportError:
        eksik.append("firebase-admin")

    try:
        import tensorflow as tf
        log.info(f"TensorFlow sürümü: {tf.__version__}")
    except ImportError:
        eksik.append("tensorflow")

    try:
        import numpy as np
        import joblib
    except ImportError:
        eksik.append("numpy / joblib")

    if eksik:
        log.error(f"Eksik kütüphaneler: {', '.join(eksik)}")
        log.error("Çözüm: pip install -r requirements_ai.txt")
        sys.exit(1)


def firebase_baglanti_kur(servis_hesabi_yolu: str, database_url: str = None):
    import firebase_admin
    from firebase_admin import credentials, db

    if not os.path.exists(servis_hesabi_yolu):
        log.error(f"Servis hesabı dosyası bulunamadı: {servis_hesabi_yolu}")
        sys.exit(1)

    if firebase_admin._apps:
        firebase_admin.delete_app(firebase_admin.get_app())

    cred = credentials.Certificate(servis_hesabi_yolu)

    if not database_url:
        import json
        with open(servis_hesabi_yolu) as f:
            proje_bilgisi = json.load(f)
        proje_id = proje_bilgisi.get("project_id", "")
        database_url = f"https://{proje_id}-default-rtdb.firebaseio.com"
        log.info(f"Database URL otomatik belirlendi: {database_url}")

    firebase_admin.initialize_app(cred, {"databaseURL": database_url})
    log.info("✓ Firebase Admin SDK başlatıldı")
    return db


def model_yukle(model_yolu: str, scaler_yolu: str):
    import tensorflow as tf
    import joblib

    if not os.path.exists(model_yolu):
        log.error(f"Model dosyası bulunamadı: {model_yolu}")
        log.error("Önce ai_model_trainer.py çalıştırın.")
        sys.exit(1)

    if not os.path.exists(scaler_yolu):
        log.error(f"Scaler dosyası bulunamadı: {scaler_yolu}")
        log.error("Önce ai_model_trainer.py çalıştırın.")
        sys.exit(1)

    log.info(f"Model yükleniyor: {model_yolu}")
    model = tf.keras.models.load_model(model_yolu, compile=False)
    log.info("  Model yüklendi (compile=False — inference modu)")

    log.info(f"Scaler yükleniyor: {scaler_yolu}")
    scaler = joblib.load(scaler_yolu)

    log.info("✓ Model ve scaler başarıyla yüklendi")
    return model, scaler


class SensorBuffer:
    def __init__(self, pencere_boyutu: int = PENCERE_BOYUTU):
        self.pencere = deque(maxlen=pencere_boyutu)
        self.boyut = pencere_boyutu

    def ekle(self, sicaklik: float, hareket: int, isik: float):
        self.pencere.append([float(sicaklik), float(hareket), float(isik)])

    def hazir_mi(self) -> bool:
        return len(self.pencere) >= self.boyut

    def doldur(self, son_veri: list):
        while len(self.pencere) < self.boyut:
            self.pencere.appendleft(son_veri)

    def numpy_dizisi(self):
        import numpy as np
        return np.array(list(self.pencere)).reshape(1, self.boyut, 3)


def tahmin_uret(model, scaler, buffer: SensorBuffer):
    import numpy as np

    ham = buffer.numpy_dizisi()
    sekil = ham.shape
    olceklenmis = scaler.transform(ham.reshape(-1, 3)).reshape(sekil)

    tahmin = model.predict(olceklenmis, verbose=0)

    tahmini_sicaklik = float(tahmin[0][0][0])
    klima_olasiligi  = float(tahmin[1][0][0])
    klima_karari     = 1 if klima_olasiligi > 0.5 else 0

    guce_gore_tasarruf = ENERJI_TASARRUF_BAZ + (klima_olasiligi - 0.5) * 10
    enerji_tasarruf    = max(0, min(30, guce_gore_tasarruf))

    return {
        "klima_karari":          klima_karari,
        "tahmini_sicaklik":      round(tahmini_sicaklik, 1),
        "guven_skoru":           round(klima_olasiligi, 3),
        "enerji_tasarruf_skoru": round(enerji_tasarruf, 1),
    }


def firebase_guncelle(db, sinif_yolu: str, tahmin_sonucu: dict):
    klima_durum  = "ACIK" if tahmin_sonucu["klima_karari"] == 1 else "KAPALI"
    tasarruf_str = f"%{tahmin_sonucu['enerji_tasarruf_skoru']:.0f}"

    guncelleme = {
        "ai_klima_tahmini":         klima_durum,
        "ai_enerji_tasarruf_skoru": tasarruf_str,
        "ai_tahmini_sicaklik_15dk": tahmin_sonucu["tahmini_sicaklik"],
        "ai_guven_skoru":           tahmin_sonucu["guven_skoru"],
        "ai_guncelleme_zamani":     datetime.now(timezone.utc).isoformat(),
        "ai_model_surumu":          "lstm_v1",
    }

    sinif_ref = db.reference(sinif_yolu)
    sinif_ref.update(guncelleme)

    log.info(
        f"Firebase güncellendi → "
        f"Klima: {klima_durum} | "
        f"15dk Sıcaklık: {tahmin_sonucu['tahmini_sicaklik']}°C | "
        f"Tasarruf: {tasarruf_str} | "
        f"Güven: {tahmin_sonucu['guven_skoru']:.1%}"
    )


def dinleme_baslat(db, model, scaler, sinif_id: str = "A101", polling_araligi: int = GUNCELLEME_ARALIGI):
    sinif_yolu = f"siniflar/{sinif_id}"
    buffer = SensorBuffer(PENCERE_BOYUTU)
    son_zaman_damgasi = None

    log.info("=" * 60)
    log.info(f"  Bulut Beyni Servisi Başlatılıyor")
    log.info(f"  Dinlenen sınıf: /{sinif_yolu}")
    log.info(f"  Polling aralığı: {polling_araligi} saniye")
    log.info(f"  Model: {MODEL_DOSYASI}")
    log.info("=" * 60)

    while True:
        try:
            sinif_ref = db.reference(sinif_yolu)
            veri = sinif_ref.get()

            if veri is None:
                log.warning(f"/{sinif_yolu} düğümünde veri yok. ESP32 bağlı mı?")
                time.sleep(polling_araligi)
                continue

            gerekli_alanlar = ["sicaklik", "hareket_durumu"]
            eksik = [a for a in gerekli_alanlar if a not in veri]
            if eksik:
                log.warning(f"Eksik alanlar: {eksik}. Bekleniyor...")
                time.sleep(polling_araligi)
                continue

            mevcut_zaman = veri.get("zaman_damgasi", "")
            if mevcut_zaman == son_zaman_damgasi:
                log.debug("Yeni veri yok, bekleniyor...")
                time.sleep(polling_araligi)
                continue

            son_zaman_damgasi = mevcut_zaman

            sicaklik  = float(veri.get("sicaklik", 22.0))
            hareket   = int(veri.get("hareket_durumu", 0))
            isik      = float(veri.get("isik_lux", 50) or 50)
            isik_yuzde = min(100.0, (isik / 1000.0) * 100.0)

            log.info(
                f"Yeni sensör verisi: "
                f"T={sicaklik}°C | Hareket={hareket} | Işık={isik_yuzde:.0f}%"
            )

            buffer.ekle(sicaklik, hareket, isik_yuzde)

            if not buffer.hazir_mi():
                buffer.doldur([sicaklik, hareket, isik_yuzde])
                log.info(f"Buffer dolduruldu (başlangıç modu): {PENCERE_BOYUTU} adım")

            tahmin = tahmin_uret(model, scaler, buffer)
            firebase_guncelle(db, sinif_yolu, tahmin)

        except KeyboardInterrupt:
            log.info("\n  Bulut Beyni servisi durduruldu (Ctrl+C).")
            break

        except Exception as e:
            log.error(f"Beklenmeyen hata: {e}", exc_info=True)
            log.info(f"  {polling_araligi} saniye sonra yeniden denenecek...")

        time.sleep(polling_araligi)


def argumanlari_ayristir():
    parser = argparse.ArgumentParser(
        description="Akıllı Sınıf AIoT — Firebase Bulut Beyni Servisi",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )
    parser.add_argument("--sinif",          default="A101",          help="Dinlenecek sınıfın Firebase ID'si")
    parser.add_argument("--model",          default=MODEL_DOSYASI,   help=".h5 model dosyasının yolu")
    parser.add_argument("--scaler",         default=SCALER_DOSYASI,  help=".pkl scaler dosyasının yolu")
    parser.add_argument("--servis-hesabi",  default=SERVIS_HESABI,   help="Firebase serviceAccountKey.json dosyasının yolu")
    parser.add_argument("--database-url",   default=None,            help="Firebase Realtime Database URL")
    parser.add_argument("--aralik",         type=int, default=GUNCELLEME_ARALIGI, help="Polling aralığı (saniye)")
    return parser.parse_args()


if __name__ == "__main__":
    args = argumanlari_ayristir()

    print()
    print("=" * 60)
    print("  Akilli Sinif AIoT -- Bulut Beyni Servisi")
    print("=" * 60)
    print()

    bagimliliklari_yukle()

    from firebase_admin import db
    firebase_baglanti_kur(args.servis_hesabi, args.database_url or DATABASE_URL)

    model, scaler = model_yukle(args.model, args.scaler)

    dinleme_baslat(
        db=db,
        model=model,
        scaler=scaler,
        sinif_id=args.sinif,
        polling_araligi=args.aralik,
    )
