import { cn } from "@/lib/utils";

interface StatBoxProps {
  label: string;
  value: string | number;
  sub?: string;
  highlight?: boolean;
  className?: string;
}

export function StatBox({ label, value, sub, highlight, className }: StatBoxProps) {
  return (
    <div
      className={cn(
        "rounded-xl p-3 text-center",
        "bg-surface-100 dark:bg-surface-900",
        "border border-surface-200 dark:border-surface-800",
        highlight && "border-arsenal-red dark:border-arsenal-red bg-arsenal-red/5",
        className
      )}
    >
      <div className="text-xs text-surface-500 dark:text-surface-400 uppercase tracking-wide">
        {label}
      </div>
      <div
        className={cn(
          "text-2xl font-bold mt-1",
          highlight
            ? "text-arsenal-red"
            : "text-surface-900 dark:text-surface-100"
        )}
      >
        {value}
      </div>
      {sub && (
        <div className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">
          {sub}
        </div>
      )}
    </div>
  );
}
