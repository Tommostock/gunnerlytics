import { cn, getRatingColor, getRatingBgColor, getRatingLabel } from "@/lib/utils";

interface RatingBadgeProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function RatingBadge({ rating, size = "md", showLabel = false }: RatingBadgeProps) {
  const colorClass = getRatingColor(rating);
  const bgClass = getRatingBgColor(rating);
  const label = getRatingLabel(rating);

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex items-center justify-center rounded-lg border font-bold",
          bgClass,
          colorClass,
          size === "sm" && "w-8 h-8 text-sm",
          size === "md" && "w-11 h-11 text-lg",
          size === "lg" && "w-16 h-16 text-2xl"
        )}
      >
        {rating}
      </div>
      {showLabel && (
        <span className={cn("text-xs font-medium", colorClass)}>{label}</span>
      )}
    </div>
  );
}
