import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  className,
}: MetricCardProps) {
  return (
    <div className={cn("metric-card group", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex size-11 items-center justify-center rounded-xl bg-violet-principal/10 text-violet-principal transition-colors group-hover:bg-violet-principal group-hover:text-white">
          <Icon className="size-5" />
        </div>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 rounded-badge px-2 py-1 text-xs font-bold transition-transform group-hover:scale-105",
              trend.isPositive
                ? "bg-[#E8F5EE] text-[#1E6B42]"
                : "bg-[#FDECEC] text-[#7A2020]"
            )}
          >
            {trend.isPositive ? (
              <TrendingUp className="size-3" />
            ) : (
              <TrendingDown className="size-3" />
            )}
            <span>{trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <div className="text-[32px] font-extrabold leading-tight text-text-primary">
          {value}
        </div>
        <div className="text-xs font-medium text-text-muted uppercase tracking-wider">
          {title}
        </div>
      </div>
    </div>
  );
}
