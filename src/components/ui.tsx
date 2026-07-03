import type { ReactNode } from "react";
import { cn } from "../utils/cn";
import { clamp } from "../lib/utils";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur-sm shadow-lg shadow-black/20",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  icon: Icon,
  title,
  subtitle,
  accent = "text-emerald-300",
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  accent?: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      {Icon && (
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10",
            accent
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      )}
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-white">{title}</h2>
        {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
      </div>
    </div>
  );
}

export function ProgressBar({
  value,
  className,
  barClassName,
}: {
  value: number;
  className?: string;
  barClassName?: string;
}) {
  return (
    <div className={cn("h-2.5 w-full overflow-hidden rounded-full bg-white/10", className)}>
      <div
        className={cn(
          "h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500",
          barClassName
        )}
        style={{ width: `${clamp(value, 0, 100)}%` }}
      />
    </div>
  );
}

export function ProgressRing({
  value,
  size = 120,
  stroke = 10,
  color = "#34d399",
  track = "rgba(255,255,255,0.08)",
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (clamp(value, 0, 100) / 100) * c;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent = "from-emerald-400/20 to-emerald-400/5",
  iconColor = "text-emerald-300",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  accent?: string;
  iconColor?: string;
}) {
  return (
    <Card className="relative overflow-hidden p-4">
      <div
        className={cn(
          "pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br blur-2xl",
          accent
        )}
      />
      <div className="relative flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium uppercase tracking-wide text-slate-400">
            {label}
          </p>
          <p className="mt-1 text-2xl font-bold text-white">{value}</p>
          {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
        </div>
        <Icon className={cn("h-6 w-6 shrink-0", iconColor)} />
      </div>
    </Card>
  );
}

export function Checkbox({
  checked,
  onClick,
}: {
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={checked}
      className={cn(
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-200",
        checked
          ? "border-emerald-400 bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30"
          : "border-white/20 bg-white/5 text-transparent hover:border-emerald-400/60 hover:bg-white/10"
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <path
          d="M5 13l4 4L19 7"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export function Pill({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        className
      )}
    >
      {children}
    </span>
  );
}
