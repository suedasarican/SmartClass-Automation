// ==============================================================
//  src/components/Dashboard/cards/AktifSistemlerKarti.jsx
//  Kart 4: Aktif Sistemler (Klima + Aydınlatma badge'leri)
// ==============================================================

import { Cpu, Wind, Lightbulb } from "lucide-react";
import StatusCard from "../StatusCard";
import { cn } from "../../../utils/cn";

// Sistem durumu badge bileşeni
function SistemBadge({ icon: Icon, label, durum, yukleniyor }) {
  const acik = durum === "ACIK";

  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center gap-2 rounded-xl border p-3",
        "transition-all duration-300",
        yukleniyor
          ? "border-slate-700/50 bg-slate-800/30"
          : acik
          ? "border-blue-500/30 bg-blue-500/10"
          : "border-slate-700/40 bg-slate-800/20"
      )}
    >
      {/* İkon */}
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg",
          yukleniyor
            ? "bg-slate-700/50"
            : acik
            ? "bg-blue-500/20"
            : "bg-slate-700/30"
        )}
      >
        {yukleniyor ? (
          <div className="h-4 w-4 rounded bg-slate-600 animate-pulse" />
        ) : (
          <Icon
            className={cn("h-4 w-4", acik ? "text-blue-400" : "text-slate-600")}
            strokeWidth={2}
          />
        )}
      </div>

      {/* Sistem adı */}
      <span className="text-xs font-medium text-slate-400">{label}</span>

      {/* Durum badge */}
      {yukleniyor ? (
        <div className="h-5 w-14 rounded-md bg-slate-700/60 animate-pulse" />
      ) : (
        <span
          className={cn(
            "rounded-md px-2.5 py-0.5 text-xs font-bold tracking-wider",
            acik
              ? "bg-blue-500/25 text-blue-300 ring-1 ring-blue-400/40"
              : "bg-slate-700/50 text-slate-500 ring-1 ring-slate-600/40"
          )}
        >
          {acik ? "AÇIK" : "KAPALI"}
        </span>
      )}

      {/* Aktif gösterge noktası */}
      {!yukleniyor && acik && (
        <span className="animate-live h-1.5 w-1.5 rounded-full bg-blue-400" />
      )}
    </div>
  );
}

export default function AktifSistemlerKarti({ veri, yukleniyor }) {
  const klimaAcik = veri?.klima_durumu === "ACIK";
  const aydinlatmaAcik = veri?.aydinlatma_durumu === "ACIK";

  // Kaç sistem aktif?
  const aktifSayi = [klimaAcik, aydinlatmaAcik].filter(Boolean).length;

  return (
    <StatusCard
      icon={Cpu}
      iconBg="bg-violet-500/15"
      iconColor="text-violet-400"
      title="Aktif Sistemler"
      live={!yukleniyor}
      badge={
        yukleniyor
          ? "—"
          : aktifSayi === 0
          ? "Tümü Kapalı"
          : `${aktifSayi} / 2 Aktif`
      }
      badgeColor={
        yukleniyor
          ? "bg-slate-700 text-slate-400"
          : aktifSayi === 0
          ? "bg-slate-700/50 text-slate-400 ring-1 ring-slate-600/40"
          : "bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/40"
      }
    >
      <div className="flex flex-col gap-3">
        {/* Alt başlık */}
        {!yukleniyor && (
          <p className="text-xs text-slate-500">
            {aktifSayi === 0
              ? "Hiçbir sistem çalışmıyor"
              : aktifSayi === 1
              ? "1 sistem çalışıyor"
              : "Tüm sistemler çalışıyor"}
          </p>
        )}

        {/* İkili badge grid'i */}
        <div className="flex gap-2">
          <SistemBadge
            icon={Wind}
            label="Klima"
            durum={veri?.klima_durumu}
            yukleniyor={yukleniyor}
          />
          <SistemBadge
            icon={Lightbulb}
            label="Aydınlatma"
            durum={veri?.aydinlatma_durumu}
            yukleniyor={yukleniyor}
          />
        </div>
      </div>
    </StatusCard>
  );
}
