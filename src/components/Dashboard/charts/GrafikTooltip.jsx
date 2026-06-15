import { Thermometer, Users } from "lucide-react";

export default function GrafikTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const sicaklik = payload.find((p) => p.dataKey === "sicaklik");
  const doluluk  = payload.find((p) => p.dataKey === "doluluk");

  return (
    <div
      className={[
        "rounded-2xl border border-white/20 bg-white/90 backdrop-blur-md",
        "shadow-xl shadow-rose-100/60 px-4 py-3 min-w-[160px]",
      ].join(" ")}
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
        {label}
      </p>

      {sicaklik && (
        <div className="flex items-center gap-2 mb-1">
          <Thermometer className="h-3.5 w-3.5 text-rose-500" strokeWidth={2.5} />
          <span className="text-xs text-slate-500">Sıcaklık</span>
          <span className="ml-auto text-sm font-bold text-rose-500">
            {sicaklik.value.toFixed(1)}°C
          </span>
        </div>
      )}

      {doluluk && (
        <div className="flex items-center gap-2">
          <Users className="h-3.5 w-3.5 text-purple-500" strokeWidth={2.5} />
          <span className="text-xs text-slate-500">Doluluk</span>
          <span className="ml-auto text-sm font-bold text-purple-500">
            %{doluluk.value}
          </span>
        </div>
      )}

      <div className="mt-2.5 h-0.5 w-full overflow-hidden rounded-full bg-gradient-to-r from-rose-300 via-purple-300 to-transparent" />
    </div>
  );
}
