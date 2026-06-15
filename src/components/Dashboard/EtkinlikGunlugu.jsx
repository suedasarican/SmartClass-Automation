import { useState, useMemo } from "react";
import {
  Users, UserX, Wind, Lightbulb, Thermometer,
  AlertTriangle, CheckCircle2, ChevronRight, Activity
} from "lucide-react";
import { cn } from "../../utils/cn";

const OLAY_TIPLERI = {
  giris:        { icon: Users,      color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100", label: "Hareket Algılandı" },
  cikis:        { icon: UserX,      color: "text-slate-500",   bg: "bg-slate-50",   border: "border-slate-200",  label: "Hareket Yok" },
  klima_acildi: { icon: Wind,       color: "text-blue-500",    bg: "bg-blue-50",    border: "border-blue-100",   label: "Klima Aktif" },
  klima_kapandi:{ icon: Wind,       color: "text-slate-400",   bg: "bg-slate-50",   border: "border-slate-200",  label: "Klima Pasif" },
  isik_acildi:  { icon: Lightbulb,  color: "text-amber-500",   bg: "bg-amber-50",   border: "border-amber-100",  label: "Aydınlatma Aktif" },
  isik_kapandi: { icon: Lightbulb,  color: "text-slate-400",   bg: "bg-slate-50",   border: "border-slate-200",  label: "Aydınlatma Pasif" },
  guncelleme:   { icon: Activity,   color: "text-blue-500",    bg: "bg-blue-50",    border: "border-blue-100",   label: "Sensör Güncellemesi" },
};

function OlaySatiri({ olay, son }) {
  const tip = OLAY_TIPLERI[olay.tip] ?? OLAY_TIPLERI.guncelleme;
  const Icon = tip.icon;

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={cn("flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border", tip.bg, tip.border)}>
          <Icon className={cn("h-3.5 w-3.5", tip.color)} strokeWidth={2.5} />
        </div>
        {!son && <div className="mt-1 h-full w-px bg-slate-100" />}
      </div>
      <div className={cn("pb-4 min-w-0", son && "pb-0")}>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className={cn("text-xs font-semibold", tip.color)}>{tip.label}</span>
          <span className="text-[10px] text-slate-400 font-mono">{olay.saat}</span>
        </div>
        <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{olay.detay}</p>
      </div>
    </div>
  );
}

export default function EtkinlikGunlugu({ aktifLoglar = [] }) {
  const [gosterHepsi, setGosterHepsi] = useState(false);

  const islenmisOlaylar = useMemo(() => {
    if (!aktifLoglar || aktifLoglar.length === 0) return [];

    const siraliLoglar = [...aktifLoglar].reverse();

    return siraliLoglar.map((log, index) => {
      const date = log.zaman_damgasi ? new Date(log.zaman_damgasi) : new Date();
      const saatFormat = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      let tip = "guncelleme";
      let detay = `T: ${log.sicaklik}°C | Işık: %${log.isik_lux}`;

      if (log.aydinlatma_durumu === "ACIK") { tip = "isik_acildi"; detay = "Işıklar açık durumda."; }
      if (log.hareket_durumu === 1)          { tip = "giris";       detay = "Odada hareket tespit edildi."; }

      return { id: index, tip, saat: saatFormat, detay };
    });
  }, [aktifLoglar]);

  const gosterilenOlaylar = gosterHepsi ? islenmisOlaylar : islenmisOlaylar.slice(0, 6);

  if (islenmisOlaylar.length === 0) {
    return (
      <div className="flex h-full min-h-[400px] flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white/90 shadow-xl shadow-rose-100/50 backdrop-blur-sm p-5 justify-center items-center">
        <p className="text-slate-400 font-medium text-sm">Etkinlik günlüğü bekleniyor...</p>
      </div>
    );
  }

  return (
    <div className={cn("flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white/90 shadow-xl shadow-rose-100/50 backdrop-blur-sm")}>
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-rose-400 to-pink-500">
              <CheckCircle2 className="h-3 w-3 text-white" strokeWidth={2.5} />
            </span>
            Canlı Etkinlik Günlüğü
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-400">ESP32 Sensör Güncellemeleri</p>
        </div>
        <span className="rounded-xl bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-400 ring-1 ring-rose-100">
          {islenmisOlaylar.length} olay
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-thin">
        <div>
          {gosterilenOlaylar.map((olay, idx) => (
            <OlaySatiri key={olay.id} olay={olay} son={idx === gosterilenOlaylar.length - 1} />
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100 px-5 py-3">
        <button
          onClick={() => setGosterHepsi((p) => !p)}
          className={cn(
            "flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold text-rose-400 transition-colors hover:bg-rose-50 active:bg-rose-100"
          )}
        >
          {gosterHepsi ? "Daha Az Göster" : `Tüm ${islenmisOlaylar.length} Olayı Göster`}
          <ChevronRight className={cn("h-3.5 w-3.5 transition-transform duration-200", gosterHepsi ? "rotate-90" : "")} />
        </button>
      </div>
    </div>
  );
}