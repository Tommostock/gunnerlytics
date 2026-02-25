import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
}

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variant === "default" &&
          "bg-surface-200 text-surface-800 dark:bg-surface-800 dark:text-surface-200",
        variant === "outline" &&
          "border border-surface-300 dark:border-surface-700 text-surface-600 dark:text-surface-400",
        className
      )}
    >
      {children}
    </span>
  );
}
