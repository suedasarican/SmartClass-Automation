import { Sun, Moon, Sunrise } from "lucide-react";
import StatusCard from "../StatusCard";
import { cn } from "../../../utils/cn";

function isikBilgisi(lux) {
  if (lux === null || lux === undefined)
    return { renk: "text-gray-400", bg: "bg-gray-100", icon: Moon,    ikon: "text-gray-400", etiket: "Veri yok",  aciklama: "Sensör bekleniyor",     bar: "bg-gray-300" };
  if (lux < 50)
    return { renk: "text-indigo-600", bg: "bg-indigo-100", icon: Moon,    ikon: "text-indigo-500", etiket: "Karanlık", aciklama: "Aydınlatma gerekebilir", bar: "bg-indigo-400" };
  if (lux < 200)
    return { renk: "text-amber-600",  bg: "bg-amber-100",  icon: Sunrise, ikon: "text-amber-500",  etiket: "Loş",      aciklama: "Düşük aydınlatma",      bar: "bg-amber-400" };
  if (lux < 500)
    return { renk: "text-yellow-600", bg: "bg-yellow-100", icon: Sun,     ikon: "text-yellow-500", etiket: "Normal",   aciklama: "Yeterli aydınlatma",    bar: "bg-yellow-400" };
  return   { renk: "text-orange-600", bg: "bg-orange-100", icon: Sun,     ikon: "text-orange-500", etiket: "Parlak",   aciklama: "Yüksek aydınlatma",     bar: "bg-orange-400" };
}

function isikYuzdesi(lux) {
  if (!lux) return 0;
  return Math.min(100, (lux / 1000) * 100);
}

export default function IsikKarti({ veri, yukleniyor }) {
  const lux = veri?.isik_lux ?? null;
  const { renk, bg, icon: IsikIkon, ikon, etiket, aciklama, bar } = isikBilgisi(lux);
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
          ? "bg-gray-100 text-gray-400"
          : lux < 50
          ? "bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200"
          : lux < 200
          ? "bg-amber-100 text-amber-700 ring-1 ring-amber-200"
          : lux < 500
          ? "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200"
          : "bg-orange-100 text-orange-700 ring-1 ring-orange-200"
      }
    >
      {yukleniyor ? (
        <LoadingPulse />
      ) : (
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-1">
            <span className={cn("text-4xl font-bold tracking-tight", renk)}>
              {lux !== null ? lux.toLocaleString("tr-TR") : "—"}
            </span>
            <span className="text-lg font-medium text-gray-400">lüx</span>
          </div>
          <p className="text-xs text-gray-400">{aciklama}</p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={cn("h-full rounded-full transition-all duration-700", bar)}
              style={{ width: `${yuzde}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-gray-300">
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
      <div className="h-9 w-24 rounded-lg bg-rose-100/60" />
      <div className="h-3 w-36 rounded bg-rose-100/40" />
      <div className="mt-1 h-1.5 w-full rounded-full bg-rose-100/40" />
    </div>
  );
}
