// ==============================================================
//  src/components/Dashboard/Dashboard.jsx
//
//  Akıllı Sınıf Yönetici Paneli — Ana Sayfa
//  Üst satır: 4 durum kartı (Firebase Realtime Data)
//  Alt kısım: AnalizGrafigi (Recharts) + Etkinlik Günlüğü
// ==============================================================

import { useState } from "react";
import { useSinifVerisi } from "../../hooks/useSinifVerisi";
import { useGecmisVeri } from "../../hooks/useGecmisVeri"; // Yeni eklenen geçmiş veri hook'u
import { School, Wifi, WifiOff, RefreshCw, ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

import DolulukKarti from "./cards/DolulukKarti";
import SicaklikKarti from "./cards/SicaklikKarti";
import IsikKarti from "./cards/IsikKarti";
import AktifSistemlerKarti from "./cards/AktifSistemlerKarti";
import AnalizGrafigi from "./charts/AnalizGrafigi";
import EtkinlikGunlugu from "./EtkinlikGunlugu";

// ---------------------------------------------------------------
//  Mevcut sınıf seçenekleri — ileride Firebase'den dinamik çekilebilir
// ---------------------------------------------------------------
const SINIFLAR = ["A101", "A102", "B201", "B202", "C301"];

export default function Dashboard() {
  const [seciliSinif, setSeciliSinif] = useState("A101");

  // Canlı (anlık) verileri çeken mevcut hook
  const { veri, yukleniyor, hata, sonGuncelleme } = useSinifVerisi(seciliSinif);

  // Firebase /loglar düğümünden biriken tüm geçmişi dizi (array) olarak çeken yeni hook
  const gercekGecmisVeriler = useGecmisVeri(seciliSinif);

  return (
    <div className="min-h-screen bg-[#060d1f] text-slate-100">
      <div className="dashboard-container px-4 py-6 sm:px-6 lg:px-8">

        {/* ======================================================
            HEADER: Logo + Başlık + Bağlantı Durumu
        ====================================================== */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Sol: Logo + Başlık */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/20 ring-1 ring-blue-500/40">
              <School className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Akıllı Sınıf</h1>
              <p className="text-xs text-slate-500">Otomasyon & Analiz Sistemi</p>
            </div>
          </div>

          {/* Sağ: Bağlantı durumu + Son güncelleme */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Bağlantı indikatörü */}
            <div
              className={cn(
                "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm",
                hata
                  ? "border-red-500/30 bg-red-500/10 text-red-400"
                  : yukleniyor
                    ? "border-slate-600/40 bg-slate-800/50 text-slate-400"
                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              )}
            >
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

            {/* Son güncelleme */}
            {sonGuncelleme && !yukleniyor && (
              <span className="text-xs text-slate-500">
                Son: {sonGuncelleme.toLocaleTimeString("tr-TR")}
              </span>
            )}
          </div>
        </header>

        {/* ======================================================
            SINIF SEÇİCİ + ZAMAN DAMGASİ
        ====================================================== */}
        <section className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Sınıf seçici */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="sinif-secici"
              className="text-sm font-medium text-slate-400"
            >
              Sınıf:
            </label>
            <div className="relative">
              <select
                id="sinif-secici"
                value={seciliSinif}
                onChange={(e) => setSeciliSinif(e.target.value)}
                className={cn(
                  "appearance-none cursor-pointer rounded-xl border px-4 py-2 pr-9",
                  "bg-[#112244] border-[#1e3a6e] text-white text-sm font-semibold",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                  "transition-colors hover:bg-[#152a52]"
                )}
              >
                {SINIFLAR.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Zaman damgası */}
          {veri?.zaman_damgasi && !yukleniyor && (
            <p className="text-xs text-slate-500">
              ESP32 son veri:{" "}
              <span className="text-slate-400">
                {new Date(veri.zaman_damgasi).toLocaleString("tr-TR")}
              </span>
            </p>
          )}
        </section>

        {/* ======================================================
            HATA MESAJI
        ====================================================== */}
        {hata && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <WifiOff className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
            <div>
              <p className="text-sm font-medium text-red-300">Firebase bağlantı hatası</p>
              <p className="mt-0.5 text-xs text-red-400/70">{hata.message}</p>
              <p className="mt-1 text-xs text-slate-500">
                .env dosyasındaki yapılandırmayı ve Firebase Realtime Database kurallarını kontrol edin.
              </p>
            </div>
          </div>
        )}

        {/* ======================================================
            4 DURUM KARTI — Responsive grid
        ====================================================== */}
        <section
          aria-label="Anlık Durum Kartları"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <DolulukKarti veri={veri} yukleniyor={yukleniyor} />
          <SicaklikKarti veri={veri} yukleniyor={yukleniyor} />
          <IsikKarti veri={veri} yukleniyor={yukleniyor} />
          <AktifSistemlerKarti veri={veri} yukleniyor={yukleniyor} />
        </section>

        {/* ======================================================
            ANALİTİK BÖLÜM: Grafik + Etkinlik Günlüğü
        ====================================================== */}
        <section className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
          {/* Geniş grafik — 2/3 genişlik. Gerçek log dizisi prop olarak gönderildi */}
          <div className="xl:col-span-2">
            <AnalizGrafigi sinifId={seciliSinif} grafikVerisi={gercekGecmisVeriler} />
          </div>

          {/* Etkinlik günlüğü — 1/3 genişlik. Gerçek log dizisi prop olarak gönderildi */}
          <div className="xl:col-span-1">
            <EtkinlikGunlugu aktifLoglar={gercekGecmisVeriler} />
          </div>
        </section>

        {/* ======================================================
            FOOTER
        ====================================================== */}
        <footer className="mt-8 border-t border-[#1e3a6e] pt-4">
          <p className="text-center text-xs text-slate-600">
            Akıllı Sınıf Otomasyon Sistemi • ESP32 + Firebase Realtime Database
          </p>
        </footer>

      </div>
    </div>
  );
}