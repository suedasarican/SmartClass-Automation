# SmartClass Automation System

Bu proje, sınıf ortamındaki enerji tüketimini optimize etmeyi amaçlayan, uçtan buluta (Edge-to-Cloud) tam teşekküllü bir **Nesnelerin İnterneti (IoT)**, **Akıllı Bina Otomasyonu** ve **Yapay Zeka (AIoT)** sistemidir.

Fiziksel donanım katmanında sensörlerden alınan veriler **ESP32** mikrodenetleyicisi ile işlenerek **Google Firebase** bulut mimarisine aktarılır. **Python tabanlı LSTM modeli** bu verileri analiz ederek proaktif enerji kararları üretir ve sonuçları gerçek zamanlı olarak **React.js** dashboard'unda görselleştirir.

---

## Sistem Mimarisi

```
[ESP32 + Sensörler]
       │  (Wi-Fi / Firebase Realtime DB)
       ▼
[Firebase Realtime Database]  ◄──────────────────────┐
       │                                              │
       ├──► [React Dashboard]          [Python Bulut Beyni]
       │     (Canlı izleme)             cloud_ai_brain.py
       │                                      │
       │                               [LSTM Modeli]
       │                               smart_class_model.h5
       │                                      │
       └──────────────────────────────────────┘
              (ai_klima_tahmini yazılır)
```

---

## Kullanılan Teknolojiler

### 🖥️ Frontend (Kullanıcı Arayüzü)
| Teknoloji | Amaç |
|---|---|
| **React 19 + Vite** | Hızlı SPA mimarisi |
| **Tailwind CSS v4** | Glassmorphism (buzlu cam) efektli light-theme UI |
| **Recharts** | Sensör verilerinin anlık zaman serisi grafikleri |
| **Lucide-React** | Vektörel arayüz ikonları |
| **Firebase SDK v12** | Gerçek zamanlı veritabanı dinleme (WebSocket) |

### ☁️ Bulut & Backend
| Teknoloji | Amaç |
|---|---|
| **Firebase Realtime Database** | Milisaniye hassasiyetinde veri senkronizasyonu |
| **Firebase Admin SDK (Python)** | Sunucu tarafı okuma/yazma (Bulut Beyni) |

### 🤖 Yapay Zeka (AIoT — YENİ)
| Teknoloji | Amaç |
|---|---|
| **TensorFlow / Keras** | LSTM modeli eğitimi ve inference |
| **Pandas + NumPy** | Sentetik veri üretimi ve ön işleme |
| **Scikit-learn** | MinMaxScaler normalizasyonu |
| **Joblib** | Scaler serileştirme |

### ⚙️ Donanım & Uç Bilişim (Edge Computing)
| Bileşen | Açıklama |
|---|---|
| **ESP32** | Dahili Wi-Fi modüllü ana IoT işlemcisi |
| **DHT22** | Sıcaklık / Nem sensörü |
| **PIR** | Hareket sensörü |
| **LDR** | Işık sensörü |
| **Röle Modülleri** | Klima ve aydınlatma kontrolü (optokuplör izolasyonlu) |

---

## Sistemin Temel Özellikleri

### Reaktif Katman (ESP32 → Firebase → Dashboard)
1. **Otonom Karar Mekanizması:** İnternet bağlantısı kopsa bile ESP32 içerisindeki algoritma sınıfın sıcaklık ve ışık durumuna göre röleleri kontrol eder.
2. **Gerçek Zamanlı Veri Akışı:** Firebase üzerinden anlık durum güncellenir, geçmiş etkinlik logları `/loglar` düğümünde birikir.
3. **Zaman Damgası:** Olaylar Google sunucu saatiyle kaydedilir.

### Proaktif (Öngörücü) AIoT Katmanı — YENİ
4. **LSTM Tahmin Modeli:** Son 30 dakikalık sensör trendini analiz ederek **15 dakika sonrasının sıcaklığını** ve **klima açılma kararını** öngörür.
5. **Bulut Beyni Servisi:** Python servisi (`cloud_ai_brain.py`) Firebase'i sürekli dinler; her yeni ESP32 verisi geldiğinde LSTM'i çalıştırır ve sonucu Firebase'e yazar.
6. **Enerji Tasarruf Skoru:** Proaktif klima kararı ile reaktif sisteme kıyasla simüle edilen enerji tasarruf yüzdesi hesaplanır.

---

## Firebase Veritabanı Yapısı

```
/siniflar
  /A101
    hareket_durumu:          1
    sicaklik:                24.8
    isik_lux:                320
    klima_durumu:            "ACIK"
    aydinlatma_durumu:       "KAPALI"
    zaman_damgasi:           "2026-06-15T19:29:00Z"
    ──── AI Alanları (cloud_ai_brain.py tarafından yazılır) ────
    ai_klima_tahmini:        "KAPALI"
    ai_enerji_tasarruf_skoru: "%13"
    ai_tahmini_sicaklik_15dk: 24.2
    ai_guven_skoru:          0.87
    ai_guncelleme_zamani:    "2026-06-15T19:29:03Z"
    ai_model_surumu:         "lstm_v1"

/loglar
  /A101
    /-OxxxxID
        sicaklik: 24.8
        hareket_durumu: 1
        ...
```

---

## Proje Dosya Yapısı

```
SmartClass-Automation/
│
├── src/                              # React uygulaması
│   ├── components/
│   │   └── Dashboard/
│   │       ├── Dashboard.jsx         # Ana sayfa (light-theme)
│   │       ├── StatusCard.jsx        # Glassmorphism kart sarmalayıcı
│   │       ├── EtkinlikGunlugu.jsx   # Canlı etkinlik günlüğü
│   │       ├── cards/
│   │       │   ├── DolulukKarti.jsx
│   │       │   ├── SicaklikKarti.jsx
│   │       │   ├── IsikKarti.jsx
│   │       │   ├── AktifSistemlerKarti.jsx
│   │       │   └── AIEnerjiKarti.jsx ← YENİ (AI tahmin kartı)
│   │       └── charts/
│   │           └── AnalizGrafigi.jsx
│   ├── hooks/
│   │   ├── useSinifVerisi.js         # Anlık veri hook'u
│   │   └── useGecmisVeri.js          # Geçmiş log hook'u
│   └── firebase/
│       └── firebase.js               # Firebase bağlantısı
│
├── ai_model_trainer.py               ← YENİ (LSTM eğitim scripti)
├── cloud_ai_brain.py                 ← YENİ (Firebase Bulut Beyni servisi)
├── requirements_ai.txt               ← YENİ (Python bağımlılıkları)
├── smart_class_model.h5              ← YENİ (Eğitilmiş LSTM modeli)
├── smart_class_model.keras           ← YENİ (Keras 3 native format)
├── model_scaler.pkl                  ← YENİ (Normalizasyon scaler)
├── serviceAccountKey.json            ← (Firebase Admin kimlik doğrulama — GIT'E EKLEMEYİN)
├── diagram.json                      (Wokwi devre şeması)
├── .env                              (Firebase ortam değişkenleri — GIT'E EKLEMEYİN)
└── package.json
```

---

## Kurulum ve Çalıştırma

### 1. React Dashboard

```bash
# Projeyi klonlayın
git clone https://github.com/suedasarican/SmartClass-Automation.git
cd SmartClass-Automation

# Bağımlılıkları yükleyin
npm install

# .env dosyasını oluşturun
VITE_FIREBASE_API_KEY=kendi_api_anahtariniz
VITE_FIREBASE_AUTH_DOMAIN=kendi_domaininiz
VITE_FIREBASE_DATABASE_URL=kendi_veritabani_urlniz
VITE_FIREBASE_PROJECT_ID=kendi_proje_id
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# Geliştirme sunucusunu başlatın
npm run dev
```

### 2. AI Model Eğitimi (İlk Kurulum)

```bash
# Python bağımlılıklarını yükleyin
pip install -r requirements_ai.txt

# 6 aylık sentetik veri üret ve LSTM modelini eğit (~10-15 dk)
python ai_model_trainer.py

# Çıktılar:
#   smart_class_model.keras  → Ana model (Keras 3 native)
#   smart_class_model.h5     → Yedek model (legacy)
#   model_scaler.pkl         → Normalizasyon scaler
#   smart_class_dataset.csv  → Eğitim verisi
```

### 3. Bulut Beyni Servisi

```bash
# Firebase servis hesabı anahtarını indirin:
# Firebase Console → Project Settings → Service Accounts → Generate New Private Key
# → serviceAccountKey.json olarak kaydedin (proje kök dizinine)

# Servisi başlatın
python cloud_ai_brain.py

# Opsiyonel parametreler:
python cloud_ai_brain.py --sinif A102 --aralik 30
```

> **Not:** `serviceAccountKey.json` ve `.env` dosyaları gizli bilgi içerir. `.gitignore`'a eklenmiştir, asla commit etmeyin.

---

## Donanım ve Devre Mimarisi

Bu projenin fiziksel katmanı Wokwi simülatörü üzerinde tasarlanmıştır.

- **Algılama Katmanı:** DHT22 (Sıcaklık/Nem), PIR (Hareket), LDR (Işık)
- **Kontrol Katmanı:** Optokuplör izolasyonlu röle modülleri (220V AC simülasyonu)
- **Simülasyon:** `diagram.json` dosyası ile Wokwi üzerinde doğrulanmıştır

---

## Geliştirici Ekibi ve İş Bölümü

Bu proje, Çok Disiplinli Takım Projesi kapsamında Elektrik-Elektronik Mühendisliği ve Bilgisayar Mühendisliği öğrencilerinin ortak çalışmasıyla geliştirilmiştir.

| Rol | Kişi(ler) |
|---|---|
| **Donanım & Gömülü Sistemler** | Salih Karabulak, Şevin Kaya, Hikmet Yavuz Sel, Belmanur Tuana Erdinç |
| **Bulut Mimarisi, React Dashboard & AIoT** | Süeda Nur Sarıcan |
| **Sistem Performans Analizi** | Hürrem Çetin |
