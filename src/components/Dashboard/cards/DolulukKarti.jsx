import { Users, UserX } from "lucide-react";
import StatusCard from "../StatusCard";
import { cn } from "../../../utils/cn";

export default function DolulukKarti({ veri, yukleniyor }) {
  const dolu = veri?.hareket_durumu === 1;

  return (
    <StatusCard
      icon={dolu ? Users : UserX}
      iconBg={dolu ? "bg-emerald-100" : "bg-gray-100"}
      iconColor={dolu ? "text-emerald-600" : "text-gray-400"}
      title="Sınıf Doluluk Durumu"
      live={!yukleniyor}
      badge={yukleniyor ? "—" : dolu ? "Dolu" : "Boş"}
      badgeColor={
        yukleniyor
          ? "bg-gray-100 text-gray-400"
          : dolu
          ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
          : "bg-gray-100 text-gray-500 ring-1 ring-gray-200"
      }
    >
      {yukleniyor ? (
        <LoadingPulse />
      ) : (
        <div className="flex flex-col gap-1">
          <div className="flex items-end gap-3">
            <span
              className={cn(
                "text-4xl font-bold tracking-tight",
                dolu ? "text-emerald-600" : "text-gray-400"
              )}
            >
              {dolu ? "Dolu" : "Boş"}
            </span>
          </div>
          <p className="text-xs text-gray-400">
            {dolu ? "Sınıfta hareket algılandı" : "Sınıfta hareket algılanmıyor"}
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700",
                dolu ? "w-full bg-emerald-400" : "w-0"
              )}
            />
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
      <div className="h-3 w-40 rounded bg-rose-100/40" />
      <div className="mt-1 h-1.5 w-full rounded-full bg-rose-100/40" />
    </div>
  );
}
