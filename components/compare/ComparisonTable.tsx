import type { Player } from "@/types";
import { cn, formatNumber, getYearsAtClub } from "@/lib/utils";
import { PlayerImage } from "@/components/player/PlayerImage";
import { RatingBadge } from "@/components/player/RatingBadge";

interface ComparisonTableProps {
  players: Player[];
}

interface StatRow {
  label: string;
  getValue: (p: Player) => string | number;
  getNumeric?: (p: Player) => number;
  higherIsBetter?: boolean;
}

const STAT_ROWS: StatRow[] = [
  {
    label: "Appearances",
    getValue: (p) => formatNumber(p.stats.totalAppearances),
    getNumeric: (p) => p.stats.totalAppearances,
    higherIsBetter: true,
  },
  {
    label: "Goals",
    getValue: (p) => formatNumber(p.stats.totalGoals),
    getNumeric: (p) => p.stats.totalGoals,
    higherIsBetter: true,
  },
  {
    label: "Assists",
    getValue: (p) => formatNumber(p.stats.totalAssists),
    getNumeric: (p) => p.stats.totalAssists,
    higherIsBetter: true,
  },
  {
    label: "Goals/90",
    getValue: (p) => p.stats.goalsPer90.toFixed(2),
    getNumeric: (p) => p.stats.goalsPer90,
    higherIsBetter: true,
  },
  {
    label: "Assists/90",
    getValue: (p) => p.stats.assistsPer90.toFixed(2),
    getNumeric: (p) => p.stats.assistsPer90,
    higherIsBetter: true,
  },
  {
    label: "Minutes",
    getValue: (p) => formatNumber(p.stats.totalMinutesPlayed),
    getNumeric: (p) => p.stats.totalMinutesPlayed,
    higherIsBetter: true,
  },
  {
    label: "Trophies",
    getValue: (p) => p.trophies.length.toString(),
    getNumeric: (p) => p.trophies.length,
    higherIsBetter: true,
  },
  {
    label: "Yellow Cards",
    getValue: (p) => p.stats.yellowCards.toString(),
    getNumeric: (p) => p.stats.yellowCards,
    higherIsBetter: false,
  },
  {
    label: "Red Cards",
    getValue: (p) => p.stats.redCards.toString(),
    getNumeric: (p) => p.stats.redCards,
    higherIsBetter: false,
  },
  {
    label: "Years at Club",
    getValue: (p) => getYearsAtClub(p),
  },
  {
    label: "Position",
    getValue: (p) => p.primaryPosition,
  },
  {
    label: "Captain",
    getValue: (p) => (p.arsenalCareer.captain ? "Yes" : "No"),
  },
];

export function ComparisonTable({ players }: ComparisonTableProps) {
  function isHighest(row: StatRow, player: Player): boolean {
    if (!row.getNumeric || players.length < 2) return false;
    const val = row.getNumeric(player);
    const max = Math.max(...players.map((p) => row.getNumeric!(p)));
    const isUnique = players.filter((p) => row.getNumeric!(p) === max).length === 1;
    if (!isUnique) return false;
    if (row.higherIsBetter) return val === max;
    const min = Math.min(...players.map((p) => row.getNumeric!(p)));
    return val === min;
  }

  return (
    <div className="overflow-x-auto -mx-4 px-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-surface-200 dark:border-surface-800">
            <th className="py-3 pr-2 text-left text-xs text-surface-500 uppercase font-medium w-24">
              Stat
            </th>
            {players.map((p) => (
              <th key={p.id} className="py-3 px-2 text-center">
                <div className="flex flex-col items-center gap-2">
                  <PlayerImage src={p.imageUrl} alt={p.shortName} size="sm" />
                  <span className="text-xs font-bold text-surface-900 dark:text-surface-100">
                    {p.shortName}
                  </span>
                  {p.meta.arsenalRating && (
                    <RatingBadge rating={p.meta.arsenalRating} size="sm" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {STAT_ROWS.map((row) => (
            <tr
              key={row.label}
              className="border-b border-surface-100 dark:border-surface-900"
            >
              <td className="py-2.5 pr-2 text-xs text-surface-500 font-medium">
                {row.label}
              </td>
              {players.map((p) => (
                <td
                  key={p.id}
                  className={cn(
                    "py-2.5 px-2 text-center font-medium",
                    isHighest(row, p)
                      ? "text-arsenal-red font-bold"
                      : "text-surface-700 dark:text-surface-300"
                  )}
                >
                  {row.getValue(p)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
