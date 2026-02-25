import type { Trophy } from "@/types";

interface TrophyDisplayProps {
  trophies: Trophy[];
}

const TROPHY_ICONS: Record<string, string> = {
  "Premier League": "🏆",
  "First Division": "🏆",
  "Champions League": "⭐",
  "FA Cup": "🏅",
  "League Cup": "🏅",
  "Europa League": "🌟",
  "Cup Winners Cup": "🌟",
  "UEFA Cup": "🌟",
  "Community Shield": "🛡️",
};

export function TrophyDisplay({ trophies }: TrophyDisplayProps) {
  if (trophies.length === 0) {
    return (
      <p className="text-sm text-surface-500 dark:text-surface-400 italic">
        No trophies won at Arsenal
      </p>
    );
  }

  const grouped = trophies.reduce(
    (acc, t) => {
      if (!acc[t.name]) acc[t.name] = [];
      acc[t.name].push(t.season);
      return acc;
    },
    {} as Record<string, string[]>
  );

  return (
    <div className="space-y-3">
      {Object.entries(grouped).map(([name, seasons]) => (
        <div
          key={name}
          className="flex items-start gap-3 p-3 rounded-lg bg-surface-50 dark:bg-surface-900"
        >
          <span className="text-xl flex-shrink-0">
            {TROPHY_ICONS[name] || "🏆"}
          </span>
          <div className="min-w-0">
            <div className="font-semibold text-sm text-surface-900 dark:text-surface-100">
              {name}{" "}
              <span className="text-arsenal-red font-bold">
                x{seasons.length}
              </span>
            </div>
            <div className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
              {seasons.join(", ")}
            </div>
          </div>
        </div>
      ))}
      <div className="text-xs text-surface-400 dark:text-surface-500 pt-1">
        Total: {trophies.length} honour{trophies.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
