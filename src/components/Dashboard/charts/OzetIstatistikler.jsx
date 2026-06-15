// ==============================================================
//  src/components/Dashboard/charts/OzetIstatistikler.jsx
//
//  Grafiğin üst kısmında yer alan 3 istatistik rozetleri:
//    • Klima Çalışma Süresi (pembe/rose, extrabold)
//    • Ortalama Sıcaklık
//    • Doluluk Oranı
// ==============================================================

import { Timer, Thermometer, BarChart2 } from "lucide-react";

/**
 * Tek bir istatistik rozeti
 */
function StatBadge({ icon: Icon, iconColor, label, value, valueColor, bgColor, borderColor, sub }) {
  return (
    <div
      className={[
        "flex flex-col gap-1.5 rounded-2xl border px-5 py-4",
        "transition-transform duration-200 hover:-translate-y-0.5",
        bgColor, borderColor,
      ].join(" ")}
    >
      {/* İkon + etiket */}
      <div className="flex items-center gap-2">
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${bgColor}`}>
          <Icon className={`h-3.5 w-3.5 ${iconColor}`} strokeWidth={2.5} />
        </div>
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {label}
        </span>
      </div>

      {/* Büyük değer */}
      <p className={`text-2xl font-extrabold tracking-tight ${valueColor}`}>
        {value}
      </p>

      {/* Alt açıklama */}
      {sub && (
        <p className="text-[11px] text-slate-400">{sub}</p>
      )}
    </div>
  );
}

/**
 * @param {{ klimaSure: string, ortSicaklik: string, dolulukOrani: number }} props
 */
export default function OzetIstatistikler({ klimaSure, ortSicaklik, dolulukOrani }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {/* 1. Klima Çalışma Süresi */}
      <StatBadge
        icon={Timer}
        iconColor="text-rose-500"
        label="Klima Çalışma Süresi"
        value={klimaSure}
        valueColor="text-rose-500"
        bgColor="bg-rose-50"
        borderColor="border-rose-100"
        sub="Bugün toplam aktif süre"
      />

      {/* 2. Ort. Sıcaklık */}
      <StatBadge
        icon={Thermometer}
        iconColor="text-amber-500"
        label="Ort. Sıcaklık"
        value={`${ortSicaklik}°C`}
        valueColor="text-amber-500"
        bgColor="bg-amber-50"
        borderColor="border-amber-100"
        sub="Gün geneli ortalama"
      />

      {/* 3. Doluluk Oranı */}
      <StatBadge
        icon={BarChart2}
        iconColor="text-purple-500"
        label="Doluluk Oranı"
        value={`%${dolulukOrani}`}
        valueColor="text-purple-500"
        bgColor="bg-purple-50"
        borderColor="border-purple-100"
        sub="Sınıfın kullanım oranı"
      />
    </div>
  );
}
