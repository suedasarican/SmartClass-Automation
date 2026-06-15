// ==============================================================
//  src/components/Dashboard/StatusCard.jsx
//
//  Tek bir durum kartı — icon, başlık, değer ve alt bilgiyi
//  standart bir arayüzle gösterir. Tüm 4 kart bu bileşeni
//  kullanır, sadece prop'lar değişir.
// ==============================================================

import { cn } from "../../utils/cn";

/**
 * @param {Object}    props
 * @param {ReactNode} props.icon        - lucide-react ikon bileşeni
 * @param {string}    props.iconBg      - İkon arka plan renk sınıfı (Tailwind)
 * @param {string}    props.iconColor   - İkon renk sınıfı (Tailwind)
 * @param {string}    props.title       - Kart başlığı
 * @param {ReactNode} props.children    - Kart ana içeriği
 * @param {string}    [props.badge]     - Sağ üst köşe rozeti metni
 * @param {string}    [props.badgeColor]- Rozet renk sınıfı
 * @param {boolean}   [props.live]      - Canlı gösterge noktası
 * @param {string}    [props.className] - Ek sınıflar
 */
export default function StatusCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  children,
  badge,
  badgeColor = "bg-slate-700 text-slate-300",
  live = false,
  className,
}) {
  return (
    <div
      className={cn(
        // Temel kart stili
        "relative flex flex-col gap-4 rounded-2xl border p-5",
        "bg-[#112244] border-[#1e3a6e]",
        // Hover efekti
        "transition-all duration-300 ease-out",
        "hover:bg-[#152a52] hover:border-[#2a4a80] hover:shadow-lg hover:shadow-blue-950/50",
        // Hover'da hafif yukarı kaymа
        "hover:-translate-y-0.5",
        className
      )}
    >
      {/* Üst satır: İkon + Rozet */}
      <div className="flex items-start justify-between">
        {/* İkon Kutusu */}
        <div className={cn("flex items-center justify-center rounded-xl p-3", iconBg)}>
          <Icon className={cn("h-5 w-5", iconColor)} strokeWidth={2} />
        </div>

        {/* Sağ üst rozet + canlı gösterge */}
        <div className="flex items-center gap-2">
          {live && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
              <span className="animate-live h-2 w-2 rounded-full bg-emerald-400" />
              CANLI
            </span>
          )}
          {badge && (
            <span className={cn("rounded-lg px-2.5 py-1 text-xs font-semibold", badgeColor)}>
              {badge}
            </span>
          )}
        </div>
      </div>

      {/* Başlık */}
      <p className="text-sm font-medium text-slate-400 tracking-wide uppercase">
        {title}
      </p>

      {/* Ana İçerik */}
      <div className="-mt-2">{children}</div>
    </div>
  );
}
