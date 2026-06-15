// ==============================================================
//  src/components/Dashboard/cards/SicaklikKarti.jsx
//  Kart 2: Anlık Sıcaklık
// ==============================================================

import { Thermometer } from "lucide-react";
import StatusCard from "../StatusCard";
import { cn } from "../../../utils/cn";

// Sıcaklık → renk & etiket eşlemeleri
function sicaklikRengi(derece) {
  if (derece === null || derece === undefined) return { renk: "text-slate-400", bg: "bg-slate-600/20", icon: "text-slate-400", etiket: "—" };
  if (derece < 18) return { renk: "text-blue-300",   bg: "bg-blue-500/15",   icon: "text-blue-400",   etiket: "Soğuk" };
  if (derece < 24) return { renk: "text-emerald-300", bg: "bg-emerald-500/15", icon: "text-emerald-400", etiket: "Konforlu" };
  if (derece < 28) return { renk: "text-amber-300",  bg: "bg-amber-500/15",  icon: "text-amber-400",  etiket: "Ilık" };
  return             { renk: "text-red-300",    bg: "bg-red-500/15",    icon: "text-red-400",    etiket: "Sıcak" };
}

// Sıcaklık çubuğu: 10°C → 0%, 40°C → 100%
function sicaklikYuzdesi(derece) {
  if (derece === null || derece === undefined) return 0;
  return Math.min(100, Math.max(0, ((derece - 10) / 30) * 100));
}

export default function SicaklikKarti({ veri, yukleniyor }) {
  const derece = veri?.sicaklik ?? null;
  const { renk, bg, icon, etiket } = sicaklikRengi(derece);
  const yuzde = sicaklikYuzdesi(derece);

  return (
    <StatusCard
      icon={Thermometer}
      iconBg={bg}
      iconColor={icon}
      title="Anlık Sıcaklık"
      live={!yukleniyor}
      badge={yukleniyor ? "—" : etiket}
      badgeColor={
        yukleniyor
          ? "bg-slate-700 text-slate-400"
          : derece < 18
          ? "bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/40"
          : derece < 24
          ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40"
          : derece < 28
          ? "bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40"
          : "bg-red-500/20 text-red-300 ring-1 ring-red-500/40"
      }
    >
      {yukleniyor ? (
        <LoadingPulse />
      ) : (
        <div className="flex flex-col gap-1">
          {/* Büyük değer */}
          <div className="flex items-baseline gap-1">
            <span className={cn("text-4xl font-bold tracking-tight", renk)}>
              {derece !== null ? derece.toFixed(1) : "—"}
            </span>
            <span className="text-lg font-medium text-slate-500">°C</span>
          </div>

          <p className="text-xs text-slate-500">Oda sıcaklığı</p>

          {/* Termometre çubuğu */}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700",
                derece < 18
                  ? "bg-blue-400"
                  : derece < 24
                  ? "bg-emerald-400"
                  : derece < 28
                  ? "bg-amber-400"
                  : "bg-red-400"
              )}
              style={{ width: `${yuzde}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-600">
            <span>10°C</span>
            <span>40°C</span>
          </div>
        </div>
      )}
    </StatusCard>
  );
}

function LoadingPulse() {
  return (
    <div className="flex flex-col gap-2 animate-pulse">
      <div className="h-9 w-28 rounded-lg bg-slate-700/60" />
      <div className="h-3 w-32 rounded bg-slate-700/40" />
      <div className="mt-1 h-1.5 w-full rounded-full bg-slate-700/40" />
    </div>
  );
}
