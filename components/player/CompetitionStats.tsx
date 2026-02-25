import type { CompetitionStats as CompStats } from "@/types";
import { formatNumber } from "@/lib/utils";

interface CompetitionStatsProps {
  stats: CompStats[];
}

export function CompetitionStatsTable({ stats }: CompetitionStatsProps) {
  const sorted = [...stats].sort((a, b) => b.appearances - a.appearances);

  return (
    <div className="overflow-x-auto -mx-4 px-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-200 dark:border-surface-800">
            <th className="text-left py-2 pr-2 text-xs text-surface-500 uppercase font-medium">
              Competition
            </th>
            <th className="text-center py-2 px-1 text-xs text-surface-500 uppercase font-medium">
              Apps
            </th>
            <th className="text-center py-2 px-1 text-xs text-surface-500 uppercase font-medium">
              Goals
            </th>
            <th className="text-center py-2 px-1 text-xs text-surface-500 uppercase font-medium">
              Assists
            </th>
            <th className="text-center py-2 pl-1 text-xs text-surface-500 uppercase font-medium hidden sm:table-cell">
              Mins
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((s) => (
            <tr
              key={s.competition}
              className="border-b border-surface-100 dark:border-surface-900"
            >
              <td className="py-2 pr-2 text-surface-900 dark:text-surface-100 font-medium text-xs sm:text-sm">
                {s.competition}
              </td>
              <td className="py-2 px-1 text-center text-surface-700 dark:text-surface-300">
                {formatNumber(s.appearances)}
              </td>
              <td className="py-2 px-1 text-center text-surface-700 dark:text-surface-300">
                {formatNumber(s.goals)}
              </td>
              <td className="py-2 px-1 text-center text-surface-700 dark:text-surface-300">
                {formatNumber(s.assists)}
              </td>
              <td className="py-2 pl-1 text-center text-surface-700 dark:text-surface-300 hidden sm:table-cell">
                {formatNumber(s.minutesPlayed)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
