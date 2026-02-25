import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllSlugs, getPlayerBySlug } from "@/lib/data";
import {
  formatDate,
  calculateAge,
  formatNumber,
  getYearsAtClub,
  getPositionColor,
  getEraColor,
  cn,
} from "@/lib/utils";
import { PlayerImage } from "@/components/player/PlayerImage";
import { RatingBadge } from "@/components/player/RatingBadge";
import { Badge } from "@/components/ui/Badge";
import { StatBox } from "@/components/ui/StatBox";
import { ExpandableSection } from "@/components/ui/ExpandableSection";
import { CompetitionStatsTable } from "@/components/player/CompetitionStats";
import { TrophyDisplay } from "@/components/player/TrophyDisplay";
import { TransferHistory } from "@/components/player/TransferHistory";
import { ManagerHistory } from "@/components/player/ManagerHistory";
import { RatingBreakdown } from "@/components/player/RatingBreakdown";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const player = getPlayerBySlug(slug);
  if (!player) return { title: "Player Not Found" };
  return {
    title: `${player.shortName} — Gunnerlytics`,
    description: `${player.shortName} Arsenal career stats: ${player.stats.totalAppearances} appearances, ${player.stats.totalGoals} goals, ${player.stats.totalAssists} assists.`,
  };
}

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const player = getPlayerBySlug(slug);
  if (!player) notFound();

  const age = calculateAge(player.dateOfBirth);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-surface-500 hover:text-arsenal-red transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All Players
      </Link>

      {/* Hero section */}
      <div className="flex items-start gap-4 sm:gap-6">
        <PlayerImage src={player.imageUrl} alt={player.shortName} size="lg" />
        <div className="flex-1 min-w-0 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-surface-100 leading-tight">
            {player.shortName}
          </h1>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            {player.fullName}
          </p>
          <div className="flex flex-wrap gap-1.5">
            <Badge className={cn(getPositionColor(player.primaryPosition), "text-white")}>
              {player.primaryPosition}
            </Badge>
            {player.secondaryPositions.map((pos) => (
              <Badge key={pos} variant="outline">
                {pos}
              </Badge>
            ))}
            <Badge className={cn(getEraColor(player.meta.era), "text-white")}>
              {player.meta.era}
            </Badge>
            {player.arsenalCareer.captain && (
              <Badge className="bg-arsenal-gold text-surface-900">
                Captain
              </Badge>
            )}
          </div>
          <div className="pt-1">
            {player.meta.arsenalRating && (
              <RatingBadge
                rating={player.meta.arsenalRating}
                size="md"
                showLabel
              />
            )}
          </div>
        </div>
      </div>

      {/* Quick info */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="p-3 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800">
          <div className="text-xs text-surface-500 uppercase">Nationality</div>
          <div className="font-semibold text-sm mt-1">{player.nationality}</div>
        </div>
        <div className="p-3 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800">
          <div className="text-xs text-surface-500 uppercase">Born</div>
          <div className="font-semibold text-sm mt-1">
            {formatDate(player.dateOfBirth)} ({age})
          </div>
        </div>
        <div className="p-3 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800">
          <div className="text-xs text-surface-500 uppercase">Height</div>
          <div className="font-semibold text-sm mt-1">{player.height} cm</div>
        </div>
        <div className="p-3 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800">
          <div className="text-xs text-surface-500 uppercase">At Arsenal</div>
          <div className="font-semibold text-sm mt-1">
            {getYearsAtClub(player)}
          </div>
        </div>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatBox
          label="Appearances"
          value={formatNumber(player.stats.totalAppearances)}
          highlight
        />
        <StatBox
          label="Goals"
          value={formatNumber(player.stats.totalGoals)}
          sub={`${player.stats.goalsPer90.toFixed(2)} per 90`}
        />
        <StatBox
          label="Assists"
          value={formatNumber(player.stats.totalAssists)}
          sub={`${player.stats.assistsPer90.toFixed(2)} per 90`}
        />
        <StatBox
          label="Minutes"
          value={formatNumber(player.stats.totalMinutesPlayed)}
        />
      </div>

      {/* Detailed stats by competition */}
      <ExpandableSection title="Stats by Competition" defaultOpen>
        <CompetitionStatsTable stats={player.stats.byCompetition} />
      </ExpandableSection>

      {/* Discipline */}
      <ExpandableSection title="Discipline">
        <div className="grid grid-cols-2 gap-3">
          <StatBox
            label="Yellow Cards"
            value={player.stats.yellowCards}
          />
          <StatBox
            label="Red Cards"
            value={player.stats.redCards}
          />
        </div>
      </ExpandableSection>

      {/* Trophies */}
      <ExpandableSection title={`Trophies (${player.trophies.length})`} defaultOpen>
        <TrophyDisplay trophies={player.trophies} />
      </ExpandableSection>

      {/* Transfer history */}
      <ExpandableSection title="Transfer History">
        <TransferHistory player={player} />
      </ExpandableSection>

      {/* Manager history */}
      <ExpandableSection title="Managers & Captaincy">
        <ManagerHistory
          managers={player.arsenalCareer.managersPlayedUnder}
          captain={player.arsenalCareer.captain}
          captainYears={player.arsenalCareer.captainYears}
        />
      </ExpandableSection>

      {/* Rating breakdown */}
      <ExpandableSection title="Arsenal Rating Breakdown">
        <RatingBreakdown player={player} />
      </ExpandableSection>

      {/* Compare CTA */}
      <div className="text-center py-4">
        <Link
          href={`/compare?players=${player.id}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-arsenal-red text-white font-semibold text-sm hover:bg-arsenal-dark transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Compare {player.shortName}
        </Link>
      </div>

      {/* Meta */}
      <div className="text-xs text-surface-400 text-center">
        Last updated: {player.meta.lastUpdated} &middot; Source:{" "}
        {player.meta.dataSource}
      </div>
    </div>
  );
}
