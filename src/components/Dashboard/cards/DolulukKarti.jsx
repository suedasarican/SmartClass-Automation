// ==============================================================
//  src/components/Dashboard/cards/DolulukKarti.jsx
//  Kart 1: Sınıf Doluluk Durumu (hareket_durumu → Dolu / Boş)
// ==============================================================

import { Users, UserX } from "lucide-react";
import StatusCard from "../StatusCard";
import { cn } from "../../../utils/cn";

export default function DolulukKarti({ veri, yukleniyor }) {
  const dolu = veri?.hareket_durumu === 1;

  return (
    <StatusCard
      icon={dolu ? Users : UserX}
      iconBg={dolu ? "bg-emerald-500/15" : "bg-slate-600/20"}
      iconColor={dolu ? "text-emerald-400" : "text-slate-500"}
      title="Sınıf Doluluk Durumu"
      live={!yukleniyor}
      badge={dolu ? "Dolu" : "Boş"}
      badgeColor={
        yukleniyor
          ? "bg-slate-700 text-slate-400"
          : dolu
          ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40"
          : "bg-slate-600/30 text-slate-400 ring-1 ring-slate-500/30"
      }
    >
      {yukleniyor ? (
        <LoadingPulse />
      ) : (
        <div className="flex flex-col gap-1">
          {/* Ana durum göstergesi */}
          <div className="flex items-end gap-3">
            <span
              className={cn(
                "text-4xl font-bold tracking-tight",
                dolu ? "text-emerald-300" : "text-slate-500"
              )}
            >
              {dolu ? "Dolu" : "Boş"}
            </span>
          </div>

          {/* İkincil bilgi */}
          <p className="text-xs text-slate-500">
            {dolu
              ? "Sınıfta hareket algılandı"
              : "Sınıfta hareket algılanmıyor"}
          </p>

          {/* Görsel doluluk çubuğu */}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700",
                dolu ? "w-full bg-emerald-400" : "w-0"
              )}
            />
          </div>
        </div>
      )}
    </StatusCard>
  );
}

// ---------------------------------------------------------------
//  Yükleme iskelet animasyonu
// ---------------------------------------------------------------
function LoadingPulse() {
  return (
    <div className="flex flex-col gap-2 animate-pulse">
      <div className="h-9 w-24 rounded-lg bg-slate-700/60" />
      <div className="h-3 w-40 rounded bg-slate-700/40" />
      <div className="mt-1 h-1.5 w-full rounded-full bg-slate-700/40" />
    </div>
  );
}
