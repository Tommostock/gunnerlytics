import * as fs from "fs";
import * as path from "path";
import type { Player } from "../../types/player";

const DATA_PATH = path.resolve(__dirname, "../../data/players.json");

export function loadExistingData(): Player[] {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      console.log("  No existing data file found. Starting fresh.");
      return [];
    }
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(raw) as Player[];
  } catch (error) {
    console.error("  Error loading existing data:", error);
    return [];
  }
}

export function saveData(players: Player[]): void {
  // Sort by rating descending, then by appearances
  const sorted = [...players].sort((a, b) => {
    const ratingDiff = (b.meta.arsenalRating || 0) - (a.meta.arsenalRating || 0);
    if (ratingDiff !== 0) return ratingDiff;
    return b.stats.totalAppearances - a.stats.totalAppearances;
  });

  const json = JSON.stringify(sorted, null, 2);

  // Ensure directory exists
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write with backup
  if (fs.existsSync(DATA_PATH)) {
    const backupPath = DATA_PATH.replace(".json", ".backup.json");
    fs.copyFileSync(DATA_PATH, backupPath);
  }

  fs.writeFileSync(DATA_PATH, json, "utf-8");
}

export function hasChanges(existing: Player[], updated: Player[]): boolean {
  if (existing.length !== updated.length) return true;

  for (const up of updated) {
    const ex = existing.find((e) => e.id === up.id);
    if (!ex) return true;

    // Check key stat fields
    if (
      ex.stats.totalAppearances !== up.stats.totalAppearances ||
      ex.stats.totalGoals !== up.stats.totalGoals ||
      ex.stats.totalAssists !== up.stats.totalAssists ||
      ex.stats.totalMinutesPlayed !== up.stats.totalMinutesPlayed
    ) {
      return true;
    }
  }

  return false;
}
