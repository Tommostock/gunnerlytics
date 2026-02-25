"use client";

import { useState, useMemo } from "react";
import type { PlayerIndex } from "@/types";
import { cn } from "@/lib/utils";
import { PlayerImage } from "@/components/player/PlayerImage";

interface PlayerSelectorProps {
  players: PlayerIndex[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  maxSelections?: number;
}

export function PlayerSelector({
  players,
  selectedIds,
  onSelect,
  onRemove,
  maxSelections = 3,
}: PlayerSelectorProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return players
      .filter(
        (p) =>
          !selectedIds.includes(p.id) &&
          (p.shortName.toLowerCase().includes(q) ||
            p.fullName.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [query, players, selectedIds]);

  const selected = players.filter((p) => selectedIds.includes(p.id));

  return (
    <div className="space-y-3">
      {/* Selected players */}
      <div className="flex flex-wrap gap-2">
        {selected.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-arsenal-red/10 border border-arsenal-red/30"
          >
            <PlayerImage src={p.imageUrl} alt={p.shortName} size="sm" className="!w-6 !h-6" />
            <span className="text-sm font-medium text-surface-900 dark:text-surface-100">
              {p.shortName}
            </span>
            <button
              onClick={() => onRemove(p.id)}
              className="text-surface-400 hover:text-arsenal-red transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Search input */}
      {selectedIds.length < maxSelections && (
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder={`Search players to compare (${selectedIds.length}/${maxSelections})...`}
            className="w-full px-4 py-3 rounded-xl bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 text-surface-900 dark:text-surface-100 text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-arsenal-red/50 focus:border-arsenal-red"
          />

          {/* Dropdown */}
          {focused && filtered.length > 0 && (
            <div className="absolute z-50 w-full mt-1 rounded-xl bg-white dark:bg-surface-950 border border-surface-200 dark:border-surface-800 shadow-xl overflow-hidden">
              {filtered.map((p) => (
                <button
                  key={p.id}
                  onMouseDown={() => {
                    onSelect(p.id);
                    setQuery("");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface-50 dark:hover:bg-surface-900 transition-colors"
                >
                  <PlayerImage src={p.imageUrl} alt={p.shortName} size="sm" className="!w-8 !h-8" />
                  <div className="text-left">
                    <div className="text-sm font-medium text-surface-900 dark:text-surface-100">
                      {p.shortName}
                    </div>
                    <div className="text-xs text-surface-500">
                      {p.primaryPosition} &middot; {p.nationality}
                    </div>
                  </div>
                  {p.arsenalRating && (
                    <span className="ml-auto text-sm font-bold text-arsenal-red">
                      {p.arsenalRating}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedIds.length < 2 && (
        <p className="text-xs text-surface-400 text-center">
          Select at least 2 players to compare
        </p>
      )}
    </div>
  );
}
