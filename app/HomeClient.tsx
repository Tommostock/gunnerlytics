"use client";

import { useState, useMemo, useCallback } from "react";
import type { PlayerIndex, FilterState, Position, Era } from "@/types";
import { applyFilters, DEFAULT_FILTERS } from "@/lib/filters";
import { cn, getUniqueNationalities } from "@/lib/utils";
import { PlayerCard } from "@/components/player/PlayerCard";

const POSITIONS: (Position | "All")[] = [
  "All", "GK", "CB", "LB", "RB", "CDM", "CM", "CAM", "LW", "RW", "ST", "CF",
];

const ERAS: (Era | "All")[] = [
  "All", "Pre-War", "Post-War", "1950s", "1960s", "1970s", "1980s",
  "George Graham", "Arsene Wenger", "Unai Emery", "Mikel Arteta",
];

const SORT_OPTIONS = [
  { value: "rating", label: "Rating" },
  { value: "appearances", label: "Appearances" },
  { value: "goals", label: "Goals" },
  { value: "name", label: "Name" },
  { value: "era", label: "Era" },
] as const;

interface HomeClientProps {
  players: PlayerIndex[];
}

export function HomeClient({ players }: HomeClientProps) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  const nationalities = useMemo(() => getUniqueNationalities(players), [players]);
  const filtered = useMemo(() => applyFilters(players, filters), [players, filters]);

  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const hasActiveFilters =
    filters.position !== "All" ||
    filters.era !== "All" ||
    filters.nationality !== "" ||
    filters.minAppearances > 0 ||
    filters.trophyWinners;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="text-center space-y-2 py-4">
        <h1 className="text-3xl sm:text-4xl font-bold">
          <span className="text-arsenal-red">Arsenal</span> Player Database
        </h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 max-w-md mx-auto">
          Every player who has made a competitive first-team appearance for
          Arsenal F.C.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          placeholder="Search by name, nationality..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 text-surface-900 dark:text-surface-100 text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-arsenal-red/50 focus:border-arsenal-red"
        />
      </div>

      {/* Filter toggle + Sort */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            showFilters || hasActiveFilters
              ? "bg-arsenal-red text-white"
              : "bg-surface-100 dark:bg-surface-900 text-surface-600 dark:text-surface-400"
          )}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-white" />
          )}
        </button>

        <div className="flex items-center gap-2">
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilter("sortBy", e.target.value as FilterState["sortBy"])}
            className="px-3 py-2 rounded-lg text-sm bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 text-surface-700 dark:text-surface-300 focus:outline-none focus:ring-2 focus:ring-arsenal-red/50"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            onClick={() =>
              updateFilter("sortOrder", filters.sortOrder === "desc" ? "asc" : "desc")
            }
            className="p-2 rounded-lg bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 text-surface-500"
          >
            <svg className={cn("w-4 h-4 transition-transform", filters.sortOrder === "asc" && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 space-y-4 animate-slide-up">
          {/* Position */}
          <div>
            <label className="text-xs font-medium text-surface-500 uppercase mb-2 block">
              Position
            </label>
            <div className="flex flex-wrap gap-1.5">
              {POSITIONS.map((pos) => (
                <button
                  key={pos}
                  onClick={() => updateFilter("position", pos)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-medium transition-colors",
                    filters.position === pos
                      ? "bg-arsenal-red text-white"
                      : "bg-surface-200 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-300 dark:hover:bg-surface-700"
                  )}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          {/* Era */}
          <div>
            <label className="text-xs font-medium text-surface-500 uppercase mb-2 block">
              Era
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ERAS.map((era) => (
                <button
                  key={era}
                  onClick={() => updateFilter("era", era)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-medium transition-colors",
                    filters.era === era
                      ? "bg-arsenal-red text-white"
                      : "bg-surface-200 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-300 dark:hover:bg-surface-700"
                  )}
                >
                  {era}
                </button>
              ))}
            </div>
          </div>

          {/* Nationality */}
          <div>
            <label className="text-xs font-medium text-surface-500 uppercase mb-2 block">
              Nationality
            </label>
            <select
              value={filters.nationality}
              onChange={(e) => updateFilter("nationality", e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-surface-950 border border-surface-200 dark:border-surface-800 text-surface-700 dark:text-surface-300 focus:outline-none focus:ring-2 focus:ring-arsenal-red/50"
            >
              <option value="">All Nationalities</option>
              {nationalities.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* Min appearances */}
          <div>
            <label className="text-xs font-medium text-surface-500 uppercase mb-2 block">
              Min Appearances: {filters.minAppearances}
            </label>
            <input
              type="range"
              min={0}
              max={500}
              step={10}
              value={filters.minAppearances}
              onChange={(e) => updateFilter("minAppearances", Number(e.target.value))}
              className="w-full accent-arsenal-red"
            />
          </div>

          {/* Reset */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-sm text-arsenal-red hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="text-sm text-surface-500">
        {filtered.length} player{filtered.length !== 1 ? "s" : ""} found
      </div>

      {/* Player grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-surface-400">
          <p className="text-lg font-medium">No players found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
