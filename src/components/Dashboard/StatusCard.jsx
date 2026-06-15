import { cn } from "../../utils/cn";

export default function StatusCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  children,
  badge,
  badgeColor = "bg-gray-100 text-gray-500",
  live = false,
  className,
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-4 rounded-2xl p-5",
        "bg-white/72 backdrop-blur-md",
        "border border-rose-100/65",
        "shadow-[0_4px_6px_-1px_rgba(244,63,94,0.06),0_2px_4px_-2px_rgba(244,63,94,0.04)]",
        "transition-all duration-300 ease-out cursor-default",
        "hover:bg-white/90 hover:-translate-y-1",
        "hover:shadow-[0_10px_25px_-5px_rgba(244,63,94,0.12),0_4px_10px_-5px_rgba(244,63,94,0.08)]",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className={cn(
          "flex items-center justify-center rounded-xl p-2.5",
          "ring-1 ring-black/5",
          iconBg
        )}>
          <Icon className={cn("h-5 w-5", iconColor)} strokeWidth={2} />
        </div>

        <div className="flex items-center gap-2">
          {live && (
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
              <span className="animate-live h-2 w-2 rounded-full bg-emerald-500" />
              CANLI
            </span>
          )}
          {badge && (
            <span className={cn(
              "rounded-lg px-2.5 py-1 text-xs font-semibold",
              badgeColor
            )}>
              {badge}
            </span>
          )}
        </div>
      </div>

      <p className="text-[11px] font-semibold text-gray-400 tracking-widest uppercase">
        {title}
      </p>

      <div className="-mt-2">{children}</div>
    </div>
  );
}
