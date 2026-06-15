import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings("ignore")


def sinif_doluluk_uret(saat, dakika, gun_haftasi):
    if gun_haftasi >= 5:
        if gun_haftasi == 5 and 10 <= saat < 12:
            return 1 if np.random.random() < 0.15 else 0
        return 0

    toplam_dk = saat * 60 + dakika

    if toplam_dk < 7 * 60:
        return 0

    if 7 * 60 <= toplam_dk < 8 * 60:
        return 1 if np.random.random() < 0.20 else 0

    if 8 * 60 <= toplam_dk < 17 * 60:
        dk_offset = (toplam_dk - 8 * 60) % 60
        if dk_offset < 50:
            if dk_offset < 5:
                return 1 if np.random.random() < 0.85 else 0
            elif dk_offset > 45:
                return 1 if np.random.random() < 0.80 else 0
            else:
                return 1 if np.random.random() < 0.95 else 0
        else:
            return 1 if np.random.random() < 0.10 else 0

    if 17 * 60 <= toplam_dk < 19 * 60:
        return 1 if np.random.random() < 0.15 else 0
    return 0


def isik_uret(saat, dakika, hareket, ay):
    mevsim_fark = np.sin((ay - 1) * np.pi / 6) * 60

    guneslanma  = 6 * 60 - mevsim_fark / 2
    gunesbatimi = 20 * 60 + mevsim_fark / 2

    toplam_dk = saat * 60 + dakika

    if guneslanma <= toplam_dk <= gunesbatimi:
        gun_suresi    = gunesbatimi - guneslanma
        gun_ilerlemesi = (toplam_dk - guneslanma) / gun_suresi
        dogal_isik    = 70 * np.sin(gun_ilerlemesi * np.pi)
    else:
        dogal_isik = 0

    yapay_isik = 25 if hareket == 1 else 0
    gurultu    = np.random.normal(0, 3)
    isik       = dogal_isik + yapay_isik + gurultu
    return float(np.clip(isik, 0, 100))


def sicaklik_uret_adim(onceki_sicaklik, hareket, klima_acik, saat, ay):
    dis_sicaklik  = 16.5 + 11.5 * np.sin((ay - 4) * np.pi / 6)
    gunluk_fark   = 5 * np.sin((saat - 14) * np.pi / 12)
    dis_sicaklik += gunluk_fark

    yalitim_etkisi = (dis_sicaklik - onceki_sicaklik) * 0.005
    insan_isisi    = 0.08 if hareket == 1 else 0.0
    klima_etkisi   = -0.20 if klima_acik else 0.0
    delta          = yalitim_etkisi + insan_isisi + klima_etkisi
    gurultu        = np.random.normal(0, 0.05)

    yeni_sicaklik = onceki_sicaklik + delta + gurultu
    return float(np.clip(yeni_sicaklik, 10, 40))


def klima_karari_uret(sicaklik, hareket, onceki_klima):
    if sicaklik > 26 and hareket == 1:
        return 1
    elif sicaklik < 23:
        return 0
    else:
        return onceki_klima


def sentetik_veri_uret(baslangic_tarihi="2025-01-01", ay_sayisi=6):
    print("=" * 60)
    print("  Sentetik Veri Üretimi Başlıyor...")
    print("=" * 60)

    baslangic   = datetime.strptime(baslangic_tarihi, "%Y-%m-%d")
    bitis       = baslangic + timedelta(days=30 * ay_sayisi)
    zaman_indeksi = pd.date_range(start=baslangic, end=bitis, freq="1min")
    toplam_adim = len(zaman_indeksi)
    print(f"  Toplam veri noktası: {toplam_adim:,} adet (~{toplam_adim/60/24:.0f} gün)")

    sicaklik = 20.0
    klima    = 0
    hareket  = 0
    kayitlar = []

    for i, zaman in enumerate(zaman_indeksi):
        saat       = zaman.hour
        dakika     = zaman.minute
        gun_haftasi = zaman.weekday()
        ay         = zaman.month

        hareket = sinif_doluluk_uret(saat, dakika, gun_haftasi)
        klima   = klima_karari_uret(sicaklik, hareket, klima)
        isik    = isik_uret(saat, dakika, hareket, ay)

        kayitlar.append({
            "zaman_damgasi":       zaman,
            "saat":                saat,
            "dakika":              dakika,
            "gun_haftasi":         gun_haftasi,
            "ay":                  ay,
            "hareket_durumu":      hareket,
            "sicaklik":            round(sicaklik, 2),
            "isik_yuzdesi":        round(isik, 1),
            "klima_durumu":        klima,
            "Klima_Acilma_Karari": klima,
        })

        sicaklik = sicaklik_uret_adim(sicaklik, hareket, klima, saat, ay)

        if (i + 1) % 50000 == 0:
            print(f"  İşlendi: {i + 1:,} / {toplam_adim:,} ({(i+1)/toplam_adim*100:.1f}%)")

    df = pd.DataFrame(kayitlar)
    df.set_index("zaman_damgasi", inplace=True)

    df["hedef_sicaklik_15dk"] = df["sicaklik"].shift(-15)
    df.dropna(inplace=True)

    print(f"\n  ✓ Veri üretildi: {len(df):,} satır")
    print(f"  ✓ Sıcaklık aralığı: {df['sicaklik'].min():.1f}°C – {df['sicaklik'].max():.1f}°C")
    print(f"  ✓ Klima açıklık oranı: {df['Klima_Acilma_Karari'].mean()*100:.1f}%")
    print(f"  ✓ Ortalama doluluk: {df['hareket_durumu'].mean()*100:.1f}%\n")

    return df


def pencere_olustur(veri_dizisi, pencere_boyutu=30):
    X, y_sicaklik, y_klima = [], [], []
    for i in range(pencere_boyutu, len(veri_dizisi[0])):
        X.append(veri_dizisi[0][i - pencere_boyutu:i])
        y_sicaklik.append(veri_dizisi[1][i])
        y_klima.append(veri_dizisi[2][i])
    return np.array(X), np.array(y_sicaklik), np.array(y_klima)


def model_egit(df):
    print("=" * 60)
    print("  Model Eğitimi Başlıyor...")
    print("=" * 60)

    try:
        import tensorflow as tf
        from tensorflow.keras.models import Model
        from tensorflow.keras.layers import Input, LSTM, Dense, Dropout, BatchNormalization
        from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
        from sklearn.preprocessing import MinMaxScaler
        import joblib
        print(f"  TensorFlow sürümü: {tf.__version__}")
    except ImportError as e:
        print(f"\n  HATA: Gerekli kütüphane bulunamadı: {e}")
        print("  Çözüm: pip install tensorflow scikit-learn joblib")
        return

    OZELLIKLER = ["sicaklik", "hareket_durumu", "isik_yuzdesi"]
    PENCERE    = 30

    scaler     = MinMaxScaler()
    olceklenmis = scaler.fit_transform(df[OZELLIKLER])

    hedef_sicaklik = df["hedef_sicaklik_15dk"].values
    hedef_klima    = df["Klima_Acilma_Karari"].values

    print(f"  Özellikler: {OZELLIKLER}")
    print(f"  Pencere boyutu: {PENCERE} dakika")

    print("  Pencereli diziler oluşturuluyor...")
    X, y_sicaklik, y_klima = pencere_olustur(
        (olceklenmis, hedef_sicaklik, hedef_klima),
        pencere_boyutu=PENCERE
    )
    print(f"  X şekli: {X.shape}  |  y_sıcaklık: {y_sicaklik.shape}  |  y_klima: {y_klima.shape}")

    bolunme   = int(len(X) * 0.80)
    X_train, X_val       = X[:bolunme], X[bolunme:]
    y_s_train, y_s_val   = y_sicaklik[:bolunme], y_sicaklik[bolunme:]
    y_k_train, y_k_val   = y_klima[:bolunme], y_klima[bolunme:]

    print(f"  Eğitim: {len(X_train):,}  |  Doğrulama: {len(X_val):,}")

    print("\n  Model mimarisi oluşturuluyor...")

    giris = Input(shape=(PENCERE, len(OZELLIKLER)), name="sensor_giris")
    x = LSTM(64, return_sequences=True, name="lstm_1")(giris)
    x = Dropout(0.2)(x)
    x = BatchNormalization()(x)
    x = LSTM(32, return_sequences=False, name="lstm_2")(x)
    x = Dropout(0.2)(x)
    x = Dense(16, activation="relu", name="ortak_dense")(x)

    sicaklik_cikis = Dense(1, activation="linear", name="sicaklik_cikisi")(x)
    klima_cikis    = Dense(1, activation="sigmoid", name="klima_cikisi")(x)

    model = Model(inputs=giris, outputs=[sicaklik_cikis, klima_cikis])

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss={
            "sicaklik_cikisi": "mse",
            "klima_cikisi":    "binary_crossentropy"
        },
        loss_weights={
            "sicaklik_cikisi": 1.0,
            "klima_cikisi":    2.0
        },
        metrics={
            "sicaklik_cikisi": ["mae"],
            "klima_cikisi":    ["accuracy"]
        }
    )

    model.summary()

    erken_durdur = EarlyStopping(
        monitor="val_loss",
        patience=5,
        restore_best_weights=True,
        verbose=1
    )

    lr_azalt = ReduceLROnPlateau(
        monitor="val_loss",
        factor=0.5,
        patience=3,
        min_lr=1e-6,
        verbose=1
    )

    print("\n  Eğitim başlıyor...")
    gecmis = model.fit(
        X_train,
        {"sicaklik_cikisi": y_s_train, "klima_cikisi": y_k_train},
        validation_data=(
            X_val,
            {"sicaklik_cikisi": y_s_val, "klima_cikisi": y_k_val}
        ),
        epochs=30,
        batch_size=256,
        callbacks=[erken_durdur, lr_azalt],
        verbose=1,
    )

    print("\n  Değerlendirme sonuçları:")
    sonuclar = model.evaluate(
        X_val,
        {"sicaklik_cikisi": y_s_val, "klima_cikisi": y_k_val},
        verbose=0
    )
    print(f"  Doğrulama kaybı (toplam): {sonuclar[0]:.4f}")
    print(f"  Sıcaklık MAE: {sonuclar[3]:.4f}°C")
    print(f"  Klima Doğruluğu: {sonuclar[4]*100:.1f}%")

    model.save("smart_class_model.keras")
    print("\n  ✓ Model kaydedildi: smart_class_model.keras")

    model.save("smart_class_model.h5")
    print("  ✓ Model kaydedildi: smart_class_model.h5 (legacy)")

    joblib.dump(scaler, "model_scaler.pkl")
    print("  ✓ Scaler kaydedildi: model_scaler.pkl")

    pd.DataFrame(gecmis.history).to_csv("egitim_gecmisi.csv", index=False)
    print("  ✓ Eğitim geçmişi kaydedildi: egitim_gecmisi.csv")

    return model, scaler


if __name__ == "__main__":
    import os

    np.random.seed(42)

    print()
    print("=" * 60)
    print("  Akilli Sinif AIoT -- LSTM Model Egitim Pipeline")
    print("=" * 60)
    print()

    CSV_DOSYASI = "smart_class_dataset.csv"

    if os.path.exists(CSV_DOSYASI):
        print(f"  Mevcut veri seti bulundu: {CSV_DOSYASI}")
        print("  Yeniden üretmek için dosyayı silin.")
        df = pd.read_csv(CSV_DOSYASI, index_col=0, parse_dates=True)
        print(f"  Yüklendi: {len(df):,} satır\n")
    else:
        df = sentetik_veri_uret(baslangic_tarihi="2025-01-01", ay_sayisi=6)
        df.to_csv(CSV_DOSYASI)
        print(f"  ✓ Veri seti kaydedildi: {CSV_DOSYASI}\n")

    print("  Veri önizlemesi (ilk 5 satır):")
    print(df.head())
    print(f"\n  Sütunlar: {list(df.columns)}")
    print(f"  İstatistikler:\n{df.describe().round(2)}\n")

    model, scaler = model_egit(df)

    print()
    print("=" * 60)
    print("  Pipeline Tamamlandi!")
    print("  Uretilen dosyalar:")
    print("    smart_class_dataset.csv  -> Sentetik egitim verisi")
    print("    smart_class_model.keras  -> Egitilmis LSTM modeli")
    print("    smart_class_model.h5     -> Legacy model")
    print("    model_scaler.pkl         -> Normalizasyon scaler")
    print("    egitim_gecmisi.csv       -> Epoch kayiplari")
    print("  Sonraki adim: python cloud_ai_brain.py")
    print("=" * 60)
    print()
