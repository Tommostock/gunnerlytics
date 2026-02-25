import type { Player } from "@/types";
import { getRatingBreakdown } from "@/lib/rating";

interface RatingBreakdownProps {
  player: Player;
}

export function RatingBreakdown({ player }: RatingBreakdownProps) {
  const breakdown = getRatingBreakdown(player);

  const items = [
    { label: "Goals", value: breakdown.goals, max: 25 },
    { label: "Assists", value: breakdown.assists, max: 15 },
    { label: "Trophies", value: breakdown.trophies, max: 25 },
    { label: "Longevity", value: breakdown.longevity, max: 15 },
    { label: "Captain", value: breakdown.captain, max: 5 },
    { label: "Clean Sheets", value: breakdown.cleanSheets, max: 5 },
    { label: "Discipline", value: breakdown.discipline, max: 5 },
  ];

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-surface-600 dark:text-surface-400">
              {item.label}
            </span>
            <span className="font-medium text-surface-900 dark:text-surface-100">
              {item.value}/{item.max}
            </span>
          </div>
          <div className="h-2 rounded-full bg-surface-200 dark:bg-surface-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-arsenal-red to-arsenal-dark transition-all duration-500"
              style={{ width: `${(item.value / item.max) * 100}%` }}
            />
          </div>
        </div>
      ))}
      <div className="pt-2 border-t border-surface-200 dark:border-surface-800 flex justify-between">
        <span className="text-xs text-surface-500">Minutes Multiplier</span>
        <span className="text-xs font-bold text-surface-900 dark:text-surface-100">
          x{breakdown.minutesMultiplier}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm font-bold text-surface-900 dark:text-surface-100">
          Final Rating
        </span>
        <span className="text-sm font-bold text-arsenal-red">
          {breakdown.total}
        </span>
      </div>
    </div>
  );
}
