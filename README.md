# SmartClass Automation System

Bu proje, sınıf ortamındaki enerji tüketimini optimize etmeyi amaçlayan, uçtan buluta (Edge-to-Cloud) tam teşekküllü bir **Nesnelerin İnterneti (IoT)** ve **Akıllı Bina** otomasyonudur. 

Fiziksel donanım katmanında sensörlerden alınan veriler, **ESP32** mikrodenetleyicisi ile işlenerek otonom kararlar (aydınlatma ve iklimlendirme kontrolü) alınır. Bu veriler eşzamanlı olarak **Google Firebase** bulut mimarisine aktarılır ve **React.js** ile geliştirilmiş modern bir web arayüzünde (Dashboard) canlı olarak izlenir.

---

## Kullanılan Teknolojiler

**Frontend (Kullanıcı Arayüzü):**
* **React.js & Vite:** Hızlı ve yenilenmeyen (SPA) sayfa mimarisi.
* **Tailwind CSS:** "Glassmorphism" (buzlu cam) efektli, estetik ve modern UI/UX tasarımı.
* **Recharts:** Sensör verilerinin anlık zaman serisi (time-series) grafikleri.
* **Lucide-React:** Vektörel ve performanslı arayüz ikonları.

**Backend & Bulut (Cloud):**
* **Firebase Realtime Database:** NoSQL mimarisi ile milisaniye hassasiyetinde veri senkronizasyonu.

**Donanım & Uç Bilişim (Edge Computing):**
* **ESP32:** Dahili Wi-Fi modüllü ana IoT işlemcisi.
* **Sensörler:** PIR (Hareket), LDR (Işık), DHT22 (Sıcaklık/Nem).
* **Aktüatörler:** İklimlendirme (Klima) ve Aydınlatma Röleleri.

---

## Sistemin Temel Özellikleri

1. **Otonom Karar Mekanizması:** İnternet bağlantısı kopsa bile ESP32 içerisindeki algoritma sınıfın sıcaklık ve ışık durumuna göre röleleri kontrol etmeye devam eder.
2. **Gerçek Zamanlı Veri Akışı:** Firebase üzerinden `PUT` metoduyla anlık durum güncellenir, `POST` metoduyla geçmiş etkinlik logları tutulur.
3. **Zaman Damgası (Server Timestamp):** Olayların (Örn: "Oda boşaldı, ışıklar kapandı") işlemci saatiyle değil, doğrudan Google sunucu saatiyle eşleşerek kaydedilmesi.

---

## Donanım ve Devre Mimarisi

Bu projenin fiziksel katmanı, Wokwi simülatörü üzerinde çift işlemcili / ESP32 tabanlı bir IoT mimarisi olarak tasarlanmıştır.

* **Algılama Katmanı:** Ortamdaki fiziksel değişimleri okumak için DHT22 (Sıcaklık/Nem), PIR (Hareket) ve LDR (Işık) sensörleri kullanılmıştır.
* **Kontrol Katmanı:** 220V AC şebeke yüklerini (klima ve aydınlatma) simüle etmek adına optokuplör izolasyonlu röle modülleri kullanılarak güvenli anahtarlama sağlanmıştır.
* **Simülasyon:** Donanım testi ve JSON veri paketleme süreçleri Wokwi üzerinden `diagram.json` dosyası ile doğrulanmıştır. 

*(Not: Wokwi devre şemasına ait `diagram.json` dosyası projenin kök dizininde yer almaktadır.)*

---

## Kurulum ve Çalıştırma (Geliştiriciler İçin)

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyebilirsiniz:

**1. Projeyi Klonlayın:**
```bash
git clone [https://github.com/suedasarican/SmartClass-Automation.git](https://github.com/suedasarican/SmartClass-Automation.git)
cd SmartClass-Automation
```
**2. Bağımlılıkları Yükleyin:**
```bash
npm install
```
**3. Çevre Değişkenlerini (API Anahtarlarını) Ayarlayın:**
```bash
VITE_FIREBASE_API_KEY=kendi_api_anahtariniz
VITE_FIREBASE_AUTH_DOMAIN=kendi_domaininiz
VITE_FIREBASE_DATABASE_URL=kendi_veritabani_urlniz
VITE_FIREBASE_PROJECT_ID=kendi_proje_id
```
**4. Projeyi Başlatın:**
```bash
npm run dev
```
## Geliştirici Ekibi ve İş Bölümü
Bu proje, Çok Disiplinli Takım Projesi kapsamında Elektrik-Elektronik Mühendisliği ve Bilgisayar Mühendisliği öğrencilerinin ortak çalışmasıyla geliştirilmiştir.

Donanım ve Gömülü Sistemler: Salih Karabulak, Şevin Kaya, Hikmet Yavuz Sel, Belmanur Tuana Erdinç

Bulut Mimarisi & React Dashboard: Süeda Nur Sarıcan

Sistem Performans Analizi: Hürrem Çetin
