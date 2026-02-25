import type { Player, PlayerIndex, Era } from "@/types";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatNumber(num: number): string {
  return num.toLocaleString("en-GB");
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export function getEraFromYears(startYear: number, endYear: number | null): Era {
  const primaryYear = startYear;
  if (primaryYear < 1945) return "Pre-War";
  if (primaryYear < 1950) return "Post-War";
  if (primaryYear < 1960) return "1950s";
  if (primaryYear < 1970) return "1960s";
  if (primaryYear < 1980) return "1970s";
  if (primaryYear < 1986) return "1980s";
  if (primaryYear < 1996) return "George Graham";
  if (primaryYear < 2018) return "Arsene Wenger";
  if (primaryYear < 2020) return "Unai Emery";
  return "Mikel Arteta";
}

export function getYearsAtClub(player: Player): string {
  const end = player.arsenalCareer.endYear || "Present";
  return `${player.arsenalCareer.startYear}–${end}`;
}

export function playerToIndex(player: Player): PlayerIndex {
  return {
    id: player.id,
    slug: player.slug,
    shortName: player.shortName,
    fullName: player.fullName,
    nationality: player.nationality,
    primaryPosition: player.primaryPosition,
    era: player.meta.era,
    totalAppearances: player.stats.totalAppearances,
    totalGoals: player.stats.totalGoals,
    arsenalStartYear: player.arsenalCareer.startYear,
    arsenalEndYear: player.arsenalCareer.endYear,
    arsenalRating: player.meta.arsenalRating,
    imageUrl: player.imageUrl,
  };
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getPositionColor(position: string): string {
  const colors: Record<string, string> = {
    GK: "bg-amber-500",
    CB: "bg-blue-600",
    LB: "bg-blue-500",
    RB: "bg-blue-500",
    LWB: "bg-blue-400",
    RWB: "bg-blue-400",
    CDM: "bg-green-700",
    CM: "bg-green-600",
    CAM: "bg-green-500",
    LM: "bg-green-400",
    RM: "bg-green-400",
    LW: "bg-red-500",
    RW: "bg-red-500",
    CF: "bg-red-600",
    ST: "bg-red-700",
  };
  return colors[position] || "bg-gray-500";
}

export function getEraColor(era: Era): string {
  const colors: Record<Era, string> = {
    "Pre-War": "bg-stone-600",
    "Post-War": "bg-stone-500",
    "1950s": "bg-amber-700",
    "1960s": "bg-amber-600",
    "1970s": "bg-orange-600",
    "1980s": "bg-orange-500",
    "George Graham": "bg-blue-700",
    "Arsene Wenger": "bg-arsenal-red",
    "Unai Emery": "bg-purple-600",
    "Mikel Arteta": "bg-arsenal-red",
  };
  return colors[era] || "bg-gray-500";
}

export function getRatingColor(rating: number): string {
  if (rating >= 85) return "text-arsenal-gold";
  if (rating >= 70) return "text-green-400";
  if (rating >= 55) return "text-blue-400";
  if (rating >= 40) return "text-gray-300";
  return "text-gray-500";
}

export function getRatingBgColor(rating: number): string {
  if (rating >= 85) return "bg-arsenal-gold/20 border-arsenal-gold";
  if (rating >= 70) return "bg-green-500/20 border-green-500";
  if (rating >= 55) return "bg-blue-500/20 border-blue-500";
  if (rating >= 40) return "bg-gray-500/20 border-gray-500";
  return "bg-gray-700/20 border-gray-700";
}

export function getRatingLabel(rating: number): string {
  if (rating >= 85) return "Legend";
  if (rating >= 70) return "World Class";
  if (rating >= 55) return "Key Player";
  if (rating >= 40) return "Squad Player";
  return "Fringe";
}

export function getUniqueNationalities(players: PlayerIndex[]): string[] {
  return [...new Set(players.map((p) => p.nationality))].sort();
}
