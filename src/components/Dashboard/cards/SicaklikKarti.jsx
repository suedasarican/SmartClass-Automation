import { Thermometer } from "lucide-react";
import StatusCard from "../StatusCard";
import { cn } from "../../../utils/cn";

function sicaklikRengi(derece) {
  if (derece === null || derece === undefined)
    return { renk: "text-gray-400", bg: "bg-gray-100", icon: "text-gray-400", etiket: "—", bar: "bg-gray-300" };
  if (derece < 18)
    return { renk: "text-blue-600",    bg: "bg-blue-100",    icon: "text-blue-500",    etiket: "Soğuk",    bar: "bg-blue-400" };
  if (derece < 24)
    return { renk: "text-emerald-600", bg: "bg-emerald-100", icon: "text-emerald-500", etiket: "Konforlu", bar: "bg-emerald-400" };
  if (derece < 28)
    return { renk: "text-amber-600",   bg: "bg-amber-100",   icon: "text-amber-500",   etiket: "Ilık",     bar: "bg-amber-400" };
  return   { renk: "text-rose-600",    bg: "bg-rose-100",    icon: "text-rose-500",    etiket: "Sıcak",    bar: "bg-rose-400" };
}

function sicaklikYuzdesi(derece) {
  if (derece === null || derece === undefined) return 0;
  return Math.min(100, Math.max(0, ((derece - 10) / 30) * 100));
}

export default function SicaklikKarti({ veri, yukleniyor }) {
  const derece = veri?.sicaklik ?? null;
  const { renk, bg, icon, etiket, bar } = sicaklikRengi(derece);
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
          ? "bg-gray-100 text-gray-400"
          : derece < 18
          ? "bg-blue-100 text-blue-700 ring-1 ring-blue-200"
          : derece < 24
          ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
          : derece < 28
          ? "bg-amber-100 text-amber-700 ring-1 ring-amber-200"
          : "bg-rose-100 text-rose-700 ring-1 ring-rose-200"
      }
    >
      {yukleniyor ? (
        <LoadingPulse />
      ) : (
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-1">
            <span className={cn("text-4xl font-bold tracking-tight", renk)}>
              {derece !== null ? derece.toFixed(1) : "—"}
            </span>
            <span className="text-lg font-medium text-gray-400">°C</span>
          </div>
          <p className="text-xs text-gray-400">Oda sıcaklığı</p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={cn("h-full rounded-full transition-all duration-700", bar)}
              style={{ width: `${yuzde}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-gray-300">
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
      <div className="h-9 w-28 rounded-lg bg-rose-100/60" />
      <div className="h-3 w-32 rounded bg-rose-100/40" />
      <div className="mt-1 h-1.5 w-full rounded-full bg-rose-100/40" />
    </div>
  );
}
