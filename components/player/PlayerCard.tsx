import Link from "next/link";
import type { PlayerIndex } from "@/types";
import { cn, getPositionColor, getEraColor, formatNumber } from "@/lib/utils";
import { PlayerImage } from "./PlayerImage";
import { RatingBadge } from "./RatingBadge";
import { Badge } from "@/components/ui/Badge";

interface PlayerCardProps {
  player: PlayerIndex;
}

export function PlayerCard({ player }: PlayerCardProps) {
  return (
    <Link
      href={`/players/${player.slug}`}
      className="block rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-950 hover:border-arsenal-red/50 dark:hover:border-arsenal-red/50 transition-all duration-200 hover:shadow-lg hover:shadow-arsenal-red/5 group"
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          <PlayerImage src={player.imageUrl} alt={player.shortName} size="sm" />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-surface-900 dark:text-surface-100 truncate group-hover:text-arsenal-red transition-colors">
              {player.shortName}
            </h3>
            <p className="text-xs text-surface-500 dark:text-surface-400">
              {player.nationality} &middot; {player.arsenalStartYear}–
              {player.arsenalEndYear || "Present"}
            </p>
          </div>
          {player.arsenalRating && (
            <RatingBadge rating={player.arsenalRating} size="sm" />
          )}
        </div>

        <div className="flex gap-1.5 mt-3">
          <Badge className={cn(getPositionColor(player.primaryPosition), "text-white text-[10px]")}>
            {player.primaryPosition}
          </Badge>
          <Badge className={cn(getEraColor(player.era), "text-white text-[10px]")}>
            {player.era}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="text-center p-2 rounded-lg bg-surface-50 dark:bg-surface-900">
            <div className="text-lg font-bold text-surface-900 dark:text-surface-100">
              {formatNumber(player.totalAppearances)}
            </div>
            <div className="text-[10px] text-surface-500 uppercase">Apps</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-surface-50 dark:bg-surface-900">
            <div className="text-lg font-bold text-surface-900 dark:text-surface-100">
              {formatNumber(player.totalGoals)}
            </div>
            <div className="text-[10px] text-surface-500 uppercase">Goals</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-surface-50 dark:bg-surface-900">
            <div className="text-lg font-bold text-arsenal-red">
              {player.arsenalRating || "–"}
            </div>
            <div className="text-[10px] text-surface-500 uppercase">Rating</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
