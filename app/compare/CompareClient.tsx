"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type { Player, PlayerIndex } from "@/types";
import { PlayerSelector } from "@/components/compare/PlayerSelector";
import { ComparisonTable } from "@/components/compare/ComparisonTable";
import { RadarChart } from "@/components/compare/RadarChart";

interface CompareClientProps {
  index: PlayerIndex[];
  allPlayers: Player[];
}

export function CompareClient({ index, allPlayers }: CompareClientProps) {
  const searchParams = useSearchParams();
  const initialPlayers = searchParams.get("players")?.split(",").filter(Boolean) || [];

  const [selectedIds, setSelectedIds] = useState<string[]>(initialPlayers);

  const selectedPlayers = useMemo(
    () => selectedIds.map((id) => allPlayers.find((p) => p.id === id)).filter(Boolean) as Player[],
    [selectedIds, allPlayers]
  );

  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedIds.length > 0) {
      url.searchParams.set("players", selectedIds.join(","));
    } else {
      url.searchParams.delete("players");
    }
    window.history.replaceState({}, "", url.toString());
  }, [selectedIds]);

  function handleSelect(id: string) {
    if (selectedIds.length < 3 && !selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
    }
  }

  function handleRemove(id: string) {
    setSelectedIds(selectedIds.filter((sid) => sid !== id));
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 py-4">
        <h1 className="text-3xl sm:text-4xl font-bold">
          <span className="text-arsenal-red">Compare</span> Players
        </h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 max-w-md mx-auto">
          Select 2-3 Arsenal players to compare side by side
        </p>
      </div>

      <PlayerSelector
        players={index}
        selectedIds={selectedIds}
        onSelect={handleSelect}
        onRemove={handleRemove}
        maxSelections={3}
      />

      {selectedPlayers.length >= 2 && (
        <div className="space-y-8 animate-fade-in">
          {/* Radar Chart */}
          <div className="rounded-xl border border-surface-200 dark:border-surface-800 p-4 sm:p-6">
            <h2 className="text-lg font-bold text-center mb-4 text-surface-900 dark:text-surface-100">
              Statistical Overview
            </h2>
            <RadarChart players={selectedPlayers} />
          </div>

          {/* Comparison Table */}
          <div className="rounded-xl border border-surface-200 dark:border-surface-800 p-4 sm:p-6">
            <h2 className="text-lg font-bold mb-4 text-surface-900 dark:text-surface-100">
              Detailed Comparison
            </h2>
            <ComparisonTable players={selectedPlayers} />
          </div>
        </div>
      )}

      {selectedPlayers.length < 2 && (
        <div className="text-center py-16 text-surface-400">
          <svg className="w-16 h-16 mx-auto mb-4 text-surface-300 dark:text-surface-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-lg font-medium">Select players to compare</p>
          <p className="text-sm mt-1">
            Search and select 2-3 players above
          </p>
        </div>
      )}
    </div>
  );
}
