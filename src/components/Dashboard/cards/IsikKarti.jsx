// ==============================================================
//  src/components/Dashboard/cards/IsikKarti.jsx
//  Kart 3: Işık Şiddeti (Lüks)
// ==============================================================

import { Sun, Moon, Sunrise } from "lucide-react";
import StatusCard from "../StatusCard";
import { cn } from "../../../utils/cn";

// Lüks değerine göre ikon, renk ve açıklama
function isikBilgisi(lux) {
  if (lux === null || lux === undefined) return { renk: "text-slate-400", bg: "bg-slate-600/20", icon: Moon,    ikon: "text-slate-400", etiket: "Veri yok",    aciklama: "Sensör bekleniyor" };
  if (lux < 50)   return { renk: "text-indigo-300", bg: "bg-indigo-500/15", icon: Moon,    ikon: "text-indigo-400", etiket: "Karanlık",   aciklama: "Aydınlatma gerekebilir" };
  if (lux < 200)  return { renk: "text-amber-300",  bg: "bg-amber-500/15",  icon: Sunrise, ikon: "text-amber-400",  etiket: "Loş",        aciklama: "Düşük aydınlatma" };
  if (lux < 500)  return { renk: "text-yellow-300", bg: "bg-yellow-500/15", icon: Sun,     ikon: "text-yellow-400", etiket: "Normal",     aciklama: "Yeterli aydınlatma" };
  return           { renk: "text-orange-300", bg: "bg-orange-500/15", icon: Sun,     ikon: "text-orange-400", etiket: "Parlak",     aciklama: "Yüksek aydınlatma" };
}

// Lüks → çubuk yüzdesi: 0 → 0%, 1000 lüx → 100%
function isikYuzdesi(lux) {
  if (!lux) return 0;
  return Math.min(100, (lux / 1000) * 100);
}

export default function IsikKarti({ veri, yukleniyor }) {
  const lux = veri?.isik_lux ?? null;
  const { renk, bg, icon: IsikIkon, ikon, etiket, aciklama } = isikBilgisi(lux);
  const yuzde = isikYuzdesi(lux);

  return (
    <StatusCard
      icon={IsikIkon}
      iconBg={bg}
      iconColor={ikon}
      title="Işık Şiddeti"
      live={!yukleniyor}
      badge={yukleniyor ? "—" : etiket}
      badgeColor={
        yukleniyor
          ? "bg-slate-700 text-slate-400"
          : lux < 50
          ? "bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/40"
          : lux < 200
          ? "bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40"
          : lux < 500
          ? "bg-yellow-500/20 text-yellow-300 ring-1 ring-yellow-500/40"
          : "bg-orange-500/20 text-orange-300 ring-1 ring-orange-500/40"
      }
    >
      {yukleniyor ? (
        <LoadingPulse />
      ) : (
        <div className="flex flex-col gap-1">
          {/* Büyük değer */}
          <div className="flex items-baseline gap-1">
            <span className={cn("text-4xl font-bold tracking-tight", renk)}>
              {lux !== null ? lux.toLocaleString("tr-TR") : "—"}
            </span>
            <span className="text-lg font-medium text-slate-500">lüx</span>
          </div>

          <p className="text-xs text-slate-500">{aciklama}</p>

          {/* Işık seviyesi çubuğu */}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700",
                lux < 50
                  ? "bg-indigo-400"
                  : lux < 200
                  ? "bg-amber-400"
                  : lux < 500
                  ? "bg-yellow-400"
                  : "bg-orange-400"
              )}
              style={{ width: `${yuzde}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-600">
            <span>0 lüx</span>
            <span>1000 lüx</span>
          </div>
        </div>
      )}
    </StatusCard>
  );
}

function LoadingPulse() {
  return (
    <div className="flex flex-col gap-2 animate-pulse">
      <div className="h-9 w-24 rounded-lg bg-slate-700/60" />
      <div className="h-3 w-36 rounded bg-slate-700/40" />
      <div className="mt-1 h-1.5 w-full rounded-full bg-slate-700/40" />
    </div>
  );
}
