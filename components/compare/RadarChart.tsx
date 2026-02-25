"use client";

import type { Player } from "@/types";
import { cn } from "@/lib/utils";

interface RadarChartProps {
  players: Player[];
  className?: string;
}

const STATS_CONFIG = [
  { key: "goals", label: "Goals", max: 250 },
  { key: "assists", label: "Assists", max: 120 },
  { key: "appearances", label: "Apps", max: 700 },
  { key: "goalsPer90", label: "G/90", max: 1.0 },
  { key: "trophies", label: "Trophies", max: 12 },
  { key: "longevity", label: "Years", max: 20 },
];

const COLORS = [
  { stroke: "#EF0107", fill: "rgba(239,1,7,0.15)" },
  { stroke: "#023474", fill: "rgba(2,52,116,0.15)" },
  { stroke: "#EDBB00", fill: "rgba(237,187,0,0.15)" },
];

function getStatValue(player: Player, key: string): number {
  switch (key) {
    case "goals":
      return player.stats.totalGoals;
    case "assists":
      return player.stats.totalAssists;
    case "appearances":
      return player.stats.totalAppearances;
    case "goalsPer90":
      return player.stats.goalsPer90;
    case "trophies":
      return player.trophies.length;
    case "longevity": {
      const end = player.arsenalCareer.endYear || new Date().getFullYear();
      return end - player.arsenalCareer.startYear;
    }
    default:
      return 0;
  }
}

export function RadarChart({ players, className }: RadarChartProps) {
  const cx = 150;
  const cy = 150;
  const r = 110;
  const levels = 5;
  const angleSlice = (Math.PI * 2) / STATS_CONFIG.length;

  function getPoint(index: number, value: number, max: number) {
    const normalizedValue = Math.min(value / max, 1);
    const angle = angleSlice * index - Math.PI / 2;
    return {
      x: cx + r * normalizedValue * Math.cos(angle),
      y: cy + r * normalizedValue * Math.sin(angle),
    };
  }

  return (
    <div className={cn("w-full max-w-[320px] mx-auto", className)}>
      <svg viewBox="0 0 300 300" className="w-full">
        {/* Grid circles */}
        {Array.from({ length: levels }, (_, i) => {
          const levelR = (r / levels) * (i + 1);
          const points = STATS_CONFIG.map((_, j) => {
            const angle = angleSlice * j - Math.PI / 2;
            return `${cx + levelR * Math.cos(angle)},${cy + levelR * Math.sin(angle)}`;
          }).join(" ");
          return (
            <polygon
              key={i}
              points={points}
              fill="none"
              stroke="currentColor"
              className="text-surface-200 dark:text-surface-800"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Axis lines */}
        {STATS_CONFIG.map((_, i) => {
          const angle = angleSlice * i - Math.PI / 2;
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={cx + r * Math.cos(angle)}
              y2={cy + r * Math.sin(angle)}
              stroke="currentColor"
              className="text-surface-200 dark:text-surface-800"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Labels */}
        {STATS_CONFIG.map((stat, i) => {
          const angle = angleSlice * i - Math.PI / 2;
          const labelR = r + 20;
          const x = cx + labelR * Math.cos(angle);
          const y = cy + labelR * Math.sin(angle);
          return (
            <text
              key={stat.key}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-surface-500 dark:fill-surface-400 text-[10px]"
            >
              {stat.label}
            </text>
          );
        })}

        {/* Player polygons */}
        {players.map((player, pi) => {
          const color = COLORS[pi % COLORS.length];
          const points = STATS_CONFIG.map((stat, i) => {
            const val = getStatValue(player, stat.key);
            const pt = getPoint(i, val, stat.max);
            return `${pt.x},${pt.y}`;
          }).join(" ");

          return (
            <polygon
              key={player.id}
              points={points}
              fill={color.fill}
              stroke={color.stroke}
              strokeWidth="2"
            />
          );
        })}

        {/* Data points */}
        {players.map((player, pi) => {
          const color = COLORS[pi % COLORS.length];
          return STATS_CONFIG.map((stat, i) => {
            const val = getStatValue(player, stat.key);
            const pt = getPoint(i, val, stat.max);
            return (
              <circle
                key={`${player.id}-${stat.key}`}
                cx={pt.x}
                cy={pt.y}
                r="3"
                fill={color.stroke}
              />
            );
          });
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-2">
        {players.map((player, i) => (
          <div key={player.id} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[i % COLORS.length].stroke }}
            />
            <span className="text-xs text-surface-600 dark:text-surface-400">
              {player.shortName}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
