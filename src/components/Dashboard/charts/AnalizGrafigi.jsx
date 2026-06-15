// ==============================================================
//  src/components/Dashboard/charts/AnalizGrafigi.jsx
// ==============================================================

import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

import GrafikTooltip from "./GrafikTooltip";
import OzetIstatistikler from "./OzetIstatistikler";

import { TrendingUp, Calendar, Layers } from "lucide-react";

// --- GERÇEK ZAMANLI İSTATİSTİK HESAPLAYICILAR ---
function ortSicaklikHesapla(veri) {
  if (!veri || veri.length === 0) return 0;
  const toplam = veri.reduce((acc, cur) => acc + (Number(cur.sicaklik) || 0), 0);
  return (toplam / veri.length).toFixed(1);
}

function dolulukOraniHesapla(veri) {
  if (!veri || veri.length === 0) return 0;
  const doluSayisi = veri.filter(v => v.hareket_durumu === 1 || String(v.hareket_durumu) === "1").length;
  return Math.round((doluSayisi / veri.length) * 100);
}

function klimaCalismaPeriyoduHesapla(veri) {
  if (!veri || veri.length === 0) return 0;
  return veri.filter(v => v.klima_durumu === "ACIK").length;
}

function periyoduSureye(periyotSayisi) {
  // Simülasyonda ESP32 her 3 saniyede 1 log atıyor
  const toplamSaniye = periyotSayisi * 3;
  if (toplamSaniye < 60) return { metin: `${toplamSaniye} sn` };
  const dk = Math.floor(toplamSaniye / 60);
  const sn = toplamSaniye % 60;
  return { metin: `${dk}dk ${sn}sn` };
}

const MODLAR = [
  { id: "her-ikisi", label: "Her İkisi", icon: Layers },
  { id: "sicaklik", label: "Sıcaklık", icon: TrendingUp },
  { id: "doluluk", label: "Doluluk", icon: Calendar },
];

function OzelLegend() {
  return (
    <div className="flex items-center justify-center gap-6 pb-1 pt-3">
      <div className="flex items-center gap-2">
        <span className="block h-0.5 w-5 rounded-full bg-rose-400" />
        <span className="text-xs text-slate-500 font-medium">Sıcaklık (°C)</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="block h-0.5 w-5 rounded-full bg-purple-400" />
        <span className="text-xs text-slate-500 font-medium">Işık (Lüks)</span>
      </div>
    </div>
  );
}

function SolEtiket({ viewBox, renk, metin }) {
  const { x, y, width, height } = viewBox;
  return (
    <text
      x={x - 12}
      y={y + height / 2}
      textAnchor="middle"
      fill={renk}
      fontSize={10}
      fontWeight={600}
      transform={`rotate(-90, ${x - 12}, ${y + height / 2})`}
      letterSpacing={1}
    >
      {metin}
    </text>
  );
}

// DİKKAT: Prop olarak 'grafikVerisi' eklendi!
export default function AnalizGrafigi({ sinifId, grafikVerisi = [] }) {
  const [mod, setMod] = useState("her-ikisi");

  // Eğer veri boşsa (ESP32 henüz log göndermediyse)
  if (!grafikVerisi || grafikVerisi.length === 0) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center rounded-2xl border border-slate-100 bg-white/90 shadow-xl shadow-rose-100/70">
        <p className="text-slate-400 font-medium text-sm">Grafik için geçmiş veri bekleniyor...</p>
      </div>
    );
  }

  // İstatistik hesaplamaları (Şimdilik mock fonksiyona gerçek veriyi gönderiyoruz)
  const klimaPeriyot = klimaCalismaPeriyoduHesapla(grafikVerisi);
  const klimaSure = periyoduSureye(klimaPeriyot).metin;
  const ortSicaklik = ortSicaklikHesapla(grafikVerisi);
  const dolulukOrani = dolulukOraniHesapla(grafikVerisi);

  const gostericaklik = mod === "her-ikisi" || mod === "sicaklik";
  const gosterDoluluk = mod === "her-ikisi" || mod === "doluluk";

  // Tarihi parse edip grafiğe uygun saat formatı çıkarma işlemi
  const islenmisVeri = grafikVerisi.map(v => {
    let saatGosterimi = "";
    if (v.zaman_damgasi) {
      const date = new Date(v.zaman_damgasi);
      // "10:35" formatında saat elde ediyoruz
      saatGosterimi = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    }
    return {
      ...v,
      saat: saatGosterimi,
      doluluk: v.hareket_durumu === 1 ? 100 : 0 // Hareket varsa 100%, yoksa 0% olarak çiz
    };
  });

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white/90 shadow-xl shadow-rose-100/70 backdrop-blur-sm">
      <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-rose-100/40 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-purple-100/30 blur-2xl" />

      <div className="relative flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-700">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-rose-400 to-pink-500 shadow-sm shadow-rose-200">
              <TrendingUp className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
            </span>
            Günlük Analiz ({sinifId})
          </h2>
          <p className="mt-0.5 text-xs text-slate-400">Gün içi sıcaklık değişimi ve hareket oranı</p>
        </div>

        <div className="flex items-center gap-1 rounded-xl bg-slate-100/80 p-1">
          {MODLAR.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setMod(id)}
              className={[
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                mod === id ? "bg-white text-rose-500 shadow-sm shadow-rose-100" : "text-slate-500 hover:text-slate-700",
              ].join(" ")}
            >
              <Icon className="h-3 w-3" strokeWidth={2.5} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative px-6 pt-5">
        <OzetIstatistikler
          klimaSure={klimaSure}
          ortSicaklik={ortSicaklik}
          dolulukOrani={dolulukOrani}
        />
      </div>

      <div className="relative px-2 pb-5 pt-6 sm:px-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={islenmisVeri}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="saat" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} interval="preserveStartEnd" minTickGap={20} />

            {gostericaklik && (
              <YAxis
                yAxisId="sicaklik"
                orientation="left"
                domain={['auto', 'auto']}
                tick={{ fontSize: 10, fill: "#f43f5e", fontWeight: 600 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${Number(v).toFixed(1)}°`}
                label={<SolEtiket renk="#f43f5e" metin="SICAKLIK (°C)" />}
              />
            )}

            {gosterDoluluk && (
              <YAxis
                yAxisId="doluluk"
                orientation="right"
                domain={[0, 120]} // 100'de kalsın diye
                tick={{ fontSize: 10, fill: "#a855f7", fontWeight: 600 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => v === 100 ? "Var" : (v === 0 ? "Yok" : "")}
              />
            )}

            <Tooltip content={<GrafikTooltip />} cursor={{ stroke: "#f43f5e22", strokeWidth: 2 }} />

            {gostericaklik && (
              <Line yAxisId="sicaklik" type="monotone" dataKey="sicaklik" name="Sıcaklık" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 3, fill: "#f43f5e" }} activeDot={{ r: 6, fill: "#f43f5e", stroke: "#fff", strokeWidth: 2 }} />
            )}

            {gosterDoluluk && (
              <Line yAxisId="doluluk" type="stepAfter" dataKey="doluluk" name="Hareket" stroke="#a855f7" strokeWidth={2.5} dot={false} />
            )}
          </LineChart>
        </ResponsiveContainer>

        {mod === "her-ikisi" && <OzelLegend />}
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3">
        <p className="text-[11px] text-slate-400">📍 Veri kaynağı: ESP32 Canlı Loglar</p>
        <span className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-500">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          Canlı
        </span>
      </div>
    </div>
  );
}