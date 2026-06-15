import { Sparkles, Zap, Thermometer, Wind, Clock, Brain } from "lucide-react";
import { cn } from "../../../utils/cn";

function guvenRengi(skor) {
  if (skor >= 0.85) return { renk: "text-emerald-600", bg: "bg-emerald-100", etiket: "Yüksek" };
  if (skor >= 0.60) return { renk: "text-amber-600",   bg: "bg-amber-100",   etiket: "Orta" };
  return               { renk: "text-rose-600",    bg: "bg-rose-100",    etiket: "Düşük" };
}

function zamanFormati(isoStr) {
  if (!isoStr) return "—";
  try {
    return new Date(isoStr).toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return "—";
  }
}

function BilgiSatiri({ icon: Icon, label, value, valueClass }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-violet-100/50 last:border-0">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Icon className="h-3.5 w-3.5 text-violet-400" strokeWidth={2} />
        {label}
      </div>
      <span className={cn("text-xs font-semibold", valueClass ?? "text-gray-700")}>
        {value}
      </span>
    </div>
  );
}

export default function AIEnerjiKarti({ veri, yukleniyor }) {
  const klimaTahmini    = veri?.ai_klima_tahmini ?? null;
  const tasarrufSkoru   = veri?.ai_enerji_tasarruf_skoru ?? null;
  const tahminiSicaklik = veri?.ai_tahmini_sicaklik_15dk ?? null;
  const guvenSkor       = veri?.ai_guven_skoru ?? null;
  const guncellemeZaman = veri?.ai_guncelleme_zamani ?? null;

  const klimaAcik  = klimaTahmini === "ACIK";
  const veriVar    = klimaTahmini !== null;
  const guvenBilgi = guvenSkor !== null ? guvenRengi(guvenSkor) : null;

  return (
    <div className="relative rounded-[1.35rem] p-[2px] ai-shimmer-border">
      <div
        className={cn(
          "relative flex flex-col gap-4 rounded-2xl p-5 h-full",
          "bg-white/90 backdrop-blur-md",
          "transition-all duration-300 ease-out",
          "hover:bg-white/96"
        )}
      >
        <div className="flex items-start justify-between">
          <div className="relative">
            <div className={cn(
              "flex items-center justify-center rounded-xl p-2.5",
              "bg-gradient-to-br from-violet-100 to-fuchsia-100",
              "ring-1 ring-violet-200/60"
            )}>
              <Sparkles className="h-5 w-5 text-violet-500 animate-sparkle" strokeWidth={2} />
            </div>
            <div className="absolute inset-0 rounded-xl bg-violet-300/20 blur-md -z-10" />
          </div>

          <div className="flex items-center gap-2">
            {veriVar && !yukleniyor && (
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-violet-600">
                <span className="animate-live h-2 w-2 rounded-full bg-violet-500" />
                AI AKTİF
              </span>
            )}
            {veriVar && !yukleniyor && (
              <span className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-semibold",
                klimaAcik
                  ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
                  : "bg-blue-100 text-blue-700 ring-1 ring-blue-200"
              )}>
                {klimaTahmini}
              </span>
            )}
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold text-gray-400 tracking-widest uppercase">
            Yapay Zeka Enerji Optimizasyonu
          </p>
        </div>

        {yukleniyor ? (
          <LoadingPulse />
        ) : !veriVar ? (
          <BekleniyorDurumu />
        ) : (
          <div className="flex flex-col gap-3 -mt-2">
            <div className={cn(
              "flex items-center justify-between rounded-xl px-4 py-3",
              klimaAcik
                ? "bg-gradient-to-r from-emerald-50 to-teal-50 ring-1 ring-emerald-200/60"
                : "bg-gradient-to-r from-blue-50 to-violet-50 ring-1 ring-blue-200/60"
            )}>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  klimaAcik ? "bg-emerald-100" : "bg-blue-100"
                )}>
                  <Zap className={cn(
                    "h-5 w-5 animate-float",
                    klimaAcik ? "text-emerald-600" : "text-blue-500"
                  )} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Enerji Tasarrufu
                  </p>
                  <p className={cn(
                    "text-2xl font-bold",
                    klimaAcik ? "text-emerald-600" : "text-blue-600"
                  )}>
                    {tasarrufSkoru ?? "—"}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  AI Kararı
                </p>
                <div className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1",
                  klimaAcik
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-blue-100 text-blue-700"
                )}>
                  <Wind className="h-3.5 w-3.5" strokeWidth={2} />
                  <span className="text-xs font-bold">
                    {klimaAcik ? "Klima AÇ" : "Klima KAPAT"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-gray-50/80 px-3 py-1">
              <BilgiSatiri
                icon={Thermometer}
                label="15 dk sonra tahmin"
                value={tahminiSicaklik !== null ? `${tahminiSicaklik}°C` : "—"}
                valueClass={
                  tahminiSicaklik !== null && tahminiSicaklik > 26
                    ? "text-rose-600 font-bold"
                    : "text-gray-700"
                }
              />
              <BilgiSatiri
                icon={Brain}
                label="Model güveni"
                value={
                  guvenSkor !== null
                    ? `${(guvenSkor * 100).toFixed(0)}% — ${guvenBilgi.etiket}`
                    : "—"
                }
                valueClass={guvenBilgi?.renk}
              />
              <BilgiSatiri
                icon={Clock}
                label="Son güncelleme"
                value={zamanFormati(guncellemeZaman)}
                valueClass="text-gray-500 font-mono"
              />
            </div>

            <p className="text-[10px] text-gray-400 leading-relaxed">
              LSTM modeli son 30 dakikalık sensör trendini analiz ederek
              proaktif klima kararı üretir.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingPulse() {
  return (
    <div className="flex flex-col gap-3 animate-pulse -mt-2">
      <div className="h-16 w-full rounded-xl bg-violet-100/50" />
      <div className="h-24 w-full rounded-xl bg-violet-100/30" />
      <div className="h-3 w-48 rounded bg-violet-100/30" />
    </div>
  );
}

function BekleniyorDurumu() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-4 -mt-2">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 ring-1 ring-violet-100">
        <Brain className="h-7 w-7 text-violet-300" strokeWidth={1.5} />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-500">AI Bekleniyor</p>
        <p className="mt-1 text-xs text-gray-400 leading-relaxed">
          Bulut Beyni servisi henüz bağlanmadı.
          <br />
          <code className="text-violet-500 text-[10px]">cloud_ai_brain.py</code> çalıştırın.
        </p>
      </div>
    </div>
  );
}
