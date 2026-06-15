import { useState } from "react";
import { useSinifVerisi }  from "../../hooks/useSinifVerisi";
import { useGecmisVeri }   from "../../hooks/useGecmisVeri";
import { School, Wifi, WifiOff, RefreshCw, ChevronDown, Sparkles } from "lucide-react";
import { cn } from "../../utils/cn";

import DolulukKarti        from "./cards/DolulukKarti";
import SicaklikKarti       from "./cards/SicaklikKarti";
import IsikKarti           from "./cards/IsikKarti";
import AktifSistemlerKarti from "./cards/AktifSistemlerKarti";
import AIEnerjiKarti       from "./cards/AIEnerjiKarti";
import AnalizGrafigi       from "./charts/AnalizGrafigi";
import EtkinlikGunlugu     from "./EtkinlikGunlugu";

const SINIFLAR = ["A101", "A102", "B201", "B202", "C301"];

export default function Dashboard() {
  const [seciliSinif, setSeciliSinif] = useState("A101");

  const { veri, yukleniyor, hata, sonGuncelleme } = useSinifVerisi(seciliSinif);
  const gercekGecmisVeriler = useGecmisVeri(seciliSinif);

  return (
    <div className="min-h-screen" style={{
      background: "linear-gradient(135deg, #fdf2f4 0%, #fff5f7 35%, #f5f3ff 100%)",
      backgroundAttachment: "fixed"
    }}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-rose-200/25 blur-3xl" />
        <div className="absolute top-1/3 -left-32 h-80 w-80 rounded-full bg-violet-200/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-pink-200/20 blur-3xl" />
      </div>

      <div className="dashboard-container relative px-4 py-6 sm:px-6 lg:px-8">

        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl",
              "bg-gradient-to-br from-rose-400 to-pink-500",
              "shadow-md shadow-rose-200"
            )}>
              <School className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Akıllı Sınıf</h1>
              <p className="text-xs text-gray-400">Otomasyon &amp; Analiz Sistemi</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className={cn(
              "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm backdrop-blur-sm",
              hata
                ? "border-red-200 bg-red-50 text-red-500"
                : yukleniyor
                ? "border-gray-200 bg-gray-50 text-gray-500"
                : "border-emerald-200 bg-emerald-50 text-emerald-600"
            )}>
              {hata ? (
                <WifiOff className="h-4 w-4" />
              ) : yukleniyor ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Wifi className="h-4 w-4" />
              )}
              <span className="font-medium">
                {hata ? "Bağlantı Hatası" : yukleniyor ? "Bağlanıyor…" : "Canlı Bağlı"}
              </span>
            </div>

            {sonGuncelleme && !yukleniyor && (
              <span className="text-xs text-gray-400">
                Son: {sonGuncelleme.toLocaleTimeString("tr-TR")}
              </span>
            )}
          </div>
        </header>

        <section className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <label htmlFor="sinif-secici" className="text-sm font-medium text-gray-500">
              Sınıf:
            </label>
            <div className="relative">
              <select
                id="sinif-secici"
                value={seciliSinif}
                onChange={(e) => setSeciliSinif(e.target.value)}
                className={cn(
                  "appearance-none cursor-pointer rounded-xl border px-4 py-2 pr-9",
                  "bg-white/80 border-rose-200/60 text-gray-700 text-sm font-semibold backdrop-blur-sm",
                  "focus:outline-none focus:ring-2 focus:ring-rose-300/50 focus:border-rose-300",
                  "transition-colors hover:bg-white/95"
                )}
              >
                {SINIFLAR.map((id) => (
                  <option key={id} value={id}>{id}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {veri?.zaman_damgasi && !yukleniyor && (
            <p className="text-xs text-gray-400">
              ESP32 son veri:{" "}
              <span className="text-gray-600 font-medium">
                {new Date(veri.zaman_damgasi).toLocaleString("tr-TR")}
              </span>
            </p>
          )}
        </section>

        {hata && (
          <div className={cn(
            "mb-6 flex items-start gap-3 rounded-xl border p-4",
            "border-red-200 bg-red-50/80 backdrop-blur-sm"
          )}>
            <WifiOff className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
            <div>
              <p className="text-sm font-medium text-red-600">Firebase bağlantı hatası</p>
              <p className="mt-0.5 text-xs text-red-400">{hata.message}</p>
              <p className="mt-1 text-xs text-gray-400">
                .env dosyasındaki yapılandırmayı ve Firebase Realtime Database kurallarını kontrol edin.
              </p>
            </div>
          </div>
        )}

        <section
          aria-label="Anlık Durum Kartları"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <DolulukKarti        veri={veri} yukleniyor={yukleniyor} />
          <SicaklikKarti       veri={veri} yukleniyor={yukleniyor} />
          <IsikKarti           veri={veri} yukleniyor={yukleniyor} />
          <AktifSistemlerKarti veri={veri} yukleniyor={yukleniyor} />
        </section>

        <section className="mt-5" aria-label="Yapay Zeka Enerji Optimizasyonu">
          <div className="mb-3 flex items-center gap-2">
            <div className={cn(
              "flex h-7 w-7 items-center justify-center rounded-lg",
              "bg-gradient-to-br from-violet-500 to-fuchsia-500"
            )}>
              <Sparkles className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-sm font-bold text-gray-700">
              Yapay Zeka Enerji Optimizasyonu
            </h2>
            <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[10px] font-bold text-violet-600 ring-1 ring-violet-200">
              BETA
            </span>
          </div>
          <AIEnerjiKarti veri={veri} yukleniyor={yukleniyor} />
        </section>

        <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <AnalizGrafigi sinifId={seciliSinif} grafikVerisi={gercekGecmisVeriler} />
          </div>
          <div className="xl:col-span-1">
            <EtkinlikGunlugu aktifLoglar={gercekGecmisVeriler} />
          </div>
        </section>

        <footer className="mt-8 border-t border-rose-100/60 pt-4">
          <p className="text-center text-xs text-gray-400">
            Akıllı Sınıf Otomasyon Sistemi • ESP32 + Firebase Realtime Database + LSTM AI
          </p>
        </footer>

      </div>
    </div>
  );
}