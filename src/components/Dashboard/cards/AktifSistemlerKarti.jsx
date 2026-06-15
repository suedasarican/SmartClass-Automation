import { Cpu, Wind, Lightbulb } from "lucide-react";
import StatusCard from "../StatusCard";
import { cn } from "../../../utils/cn";

function SistemBadge({ icon: Icon, label, durum, yukleniyor }) {
  const acik = durum === "ACIK";

  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center gap-2 rounded-xl border p-3",
        "transition-all duration-300",
        yukleniyor
          ? "border-gray-100 bg-gray-50"
          : acik
          ? "border-blue-200 bg-blue-50"
          : "border-gray-100 bg-gray-50"
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg",
          yukleniyor ? "bg-gray-100" : acik ? "bg-blue-100" : "bg-gray-100"
        )}
      >
        {yukleniyor ? (
          <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
        ) : (
          <Icon
            className={cn("h-4 w-4", acik ? "text-blue-500" : "text-gray-300")}
            strokeWidth={2}
          />
        )}
      </div>

      <span className="text-xs font-medium text-gray-500">{label}</span>

      {yukleniyor ? (
        <div className="h-5 w-14 rounded-md bg-gray-100 animate-pulse" />
      ) : (
        <span
          className={cn(
            "rounded-md px-2.5 py-0.5 text-xs font-bold tracking-wider",
            acik
              ? "bg-blue-100 text-blue-700 ring-1 ring-blue-200"
              : "bg-gray-100 text-gray-400 ring-1 ring-gray-200"
          )}
        >
          {acik ? "AÇIK" : "KAPALI"}
        </span>
      )}

      {!yukleniyor && acik && (
        <span className="animate-live h-1.5 w-1.5 rounded-full bg-blue-400" />
      )}
    </div>
  );
}

export default function AktifSistemlerKarti({ veri, yukleniyor }) {
  const klimaAcik      = veri?.klima_durumu      === "ACIK";
  const aydinlatmaAcik = veri?.aydinlatma_durumu === "ACIK";
  const aktifSayi      = [klimaAcik, aydinlatmaAcik].filter(Boolean).length;

  return (
    <StatusCard
      icon={Cpu}
      iconBg="bg-violet-100"
      iconColor="text-violet-500"
      title="Aktif Sistemler"
      live={!yukleniyor}
      badge={
        yukleniyor ? "—" : aktifSayi === 0 ? "Tümü Kapalı" : `${aktifSayi} / 2 Aktif`
      }
      badgeColor={
        yukleniyor
          ? "bg-gray-100 text-gray-400"
          : aktifSayi === 0
          ? "bg-gray-100 text-gray-500 ring-1 ring-gray-200"
          : "bg-violet-100 text-violet-700 ring-1 ring-violet-200"
      }
    >
      <div className="flex flex-col gap-3">
        {!yukleniyor && (
          <p className="text-xs text-gray-400">
            {aktifSayi === 0
              ? "Hiçbir sistem çalışmıyor"
              : aktifSayi === 1
              ? "1 sistem çalışıyor"
              : "Tüm sistemler çalışıyor"}
          </p>
        )}
        <div className="flex gap-2">
          <SistemBadge icon={Wind}     label="Klima"       durum={veri?.klima_durumu}      yukleniyor={yukleniyor} />
          <SistemBadge icon={Lightbulb} label="Aydınlatma" durum={veri?.aydinlatma_durumu} yukleniyor={yukleniyor} />
        </div>
      </div>
    </StatusCard>
  );
}
