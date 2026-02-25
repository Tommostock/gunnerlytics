import type { Player, Position } from "@/types";

const POSITION_GOAL_WEIGHT: Record<Position, number> = {
  GK: 15.0,
  CB: 6.0,
  LB: 4.5,
  RB: 4.5,
  LWB: 3.5,
  RWB: 3.5,
  CDM: 4.0,
  CM: 3.0,
  CAM: 2.0,
  LM: 2.5,
  RM: 2.5,
  LW: 1.8,
  RW: 1.8,
  CF: 1.2,
  ST: 1.0,
};

const POSITION_ASSIST_WEIGHT: Record<Position, number> = {
  GK: 12.0,
  CB: 5.0,
  LB: 3.0,
  RB: 3.0,
  LWB: 2.5,
  RWB: 2.5,
  CDM: 3.0,
  CM: 2.0,
  CAM: 1.5,
  LM: 1.8,
  RM: 1.8,
  LW: 1.5,
  RW: 1.5,
  CF: 1.8,
  ST: 2.0,
};

const TROPHY_POINTS: Record<string, number> = {
  "Premier League": 15,
  "First Division": 15,
  "Champions League": 20,
  "FA Cup": 8,
  "League Cup": 5,
  "Europa League": 10,
  "Cup Winners Cup": 10,
  "UEFA Cup": 10,
  "Community Shield": 2,
};

function getGoalScore(player: Player): number {
  const weight = POSITION_GOAL_WEIGHT[player.primaryPosition] || 1;
  const goalsPer90 = player.stats.goalsPer90;
  return Math.min(goalsPer90 * weight * 30, 25);
}

function getAssistScore(player: Player): number {
  const weight = POSITION_ASSIST_WEIGHT[player.primaryPosition] || 1;
  const assistsPer90 = player.stats.assistsPer90;
  return Math.min(assistsPer90 * weight * 25, 15);
}

function getTrophyScore(player: Player): number {
  let score = 0;
  for (const trophy of player.trophies) {
    const points = TROPHY_POINTS[trophy.name] || 3;
    score += points;
  }
  return Math.min(score, 25);
}

function getLongevityScore(player: Player): number {
  const start = player.arsenalCareer.startYear;
  const end = player.arsenalCareer.endYear || new Date().getFullYear();
  const years = end - start;
  const appearances = player.stats.totalAppearances;

  const yearScore = Math.min(years * 1.5, 10);
  const appScore = Math.min(appearances / 50, 10);
  return Math.min(yearScore + appScore, 15);
}

function getCaptainBonus(player: Player): number {
  return player.arsenalCareer.captain ? 5 : 0;
}

function getMinutesNormalization(player: Player): number {
  const minutes = player.stats.totalMinutesPlayed;
  if (minutes < 1000) return 0.5;
  if (minutes < 5000) return 0.7;
  if (minutes < 10000) return 0.85;
  if (minutes < 20000) return 0.95;
  return 1.0;
}

function getCleanSheetBonus(player: Player): number {
  if (player.primaryPosition !== "GK" && player.primaryPosition !== "CB") {
    return 0;
  }
  const csRate =
    player.stats.cleanSheets / Math.max(player.stats.totalAppearances, 1);
  return Math.min(csRate * 30, 5);
}

function getDisciplineScore(player: Player): number {
  const apps = player.stats.totalAppearances;
  if (apps === 0) return 5;
  const cardsPer90 =
    ((player.stats.yellowCards + player.stats.redCards * 3) /
      Math.max(player.stats.totalMinutesPlayed, 1)) *
    90;
  const penalty = Math.min(cardsPer90 * 5, 5);
  return Math.max(5 - penalty, 0);
}

export function calculateArsenalRating(player: Player): number {
  const goalScore = getGoalScore(player);
  const assistScore = getAssistScore(player);
  const trophyScore = getTrophyScore(player);
  const longevityScore = getLongevityScore(player);
  const captainBonus = getCaptainBonus(player);
  const cleanSheetBonus = getCleanSheetBonus(player);
  const disciplineScore = getDisciplineScore(player);
  const minutesMultiplier = getMinutesNormalization(player);

  const rawScore =
    goalScore +
    assistScore +
    trophyScore +
    longevityScore +
    captainBonus +
    cleanSheetBonus +
    disciplineScore;

  const adjustedScore = rawScore * minutesMultiplier;

  return Math.round(Math.min(Math.max(adjustedScore, 1), 99));
}

export function getRatingBreakdown(player: Player) {
  return {
    goals: Math.round(getGoalScore(player) * 10) / 10,
    assists: Math.round(getAssistScore(player) * 10) / 10,
    trophies: Math.round(getTrophyScore(player) * 10) / 10,
    longevity: Math.round(getLongevityScore(player) * 10) / 10,
    captain: getCaptainBonus(player),
    cleanSheets: Math.round(getCleanSheetBonus(player) * 10) / 10,
    discipline: Math.round(getDisciplineScore(player) * 10) / 10,
    minutesMultiplier: getMinutesNormalization(player),
    total: calculateArsenalRating(player),
  };
}
