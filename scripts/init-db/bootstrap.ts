/**
 * Bootstrap script to initialize the player database
 * Run once to populate the database with comprehensive Arsenal player history
 *
 * Usage: npx tsx scripts/init-db/bootstrap.ts
 */

import * as fs from "fs";
import * as path from "path";
import type { Player } from "../../types/player";
import { calculateArsenalRating } from "../../lib/rating";

// Import seeded data from data generators
// NOTE: These would be the comprehensive data sets
const SEEDED_PLAYERS: Omit<Player, "meta" | "arsenalRating">[] = [
  // The seeded data would be imported here from the expanded players file
  // For now, using inline sample - in production would import from files
];

function hydratePlayer(raw: Omit<Player, "meta" | "arsenalRating">): Player {
  const player = raw as any;
  const currentDate = new Date().toISOString().split("T")[0];

  // Determine era
  const startYear = player.arsenalCareer.startYear;
  let era: Player["meta"]["era"];

  if (startYear < 1945) {
    era = "Pre-War";
  } else if (startYear < 1950) {
    era = "Post-War";
  } else if (startYear < 1960) {
    era = "1950s";
  } else if (startYear < 1970) {
    era = "1960s";
  } else if (startYear < 1980) {
    era = "1970s";
  } else if (startYear < 1986) {
    era = "1980s";
  } else if (startYear < 1996) {
    era = "George Graham";
  } else if (startYear < 2018) {
    era = "Arsene Wenger";
  } else if (startYear < 2020) {
    era = "Unai Emery";
  } else {
    era = "Mikel Arteta";
  }

  return {
    ...player,
    meta: {
      era,
      lastUpdated: currentDate,
      dataSource: "seeded",
      arsenalRating: calculateArsenalRating(player as Player),
    },
  };
}

async function bootstrap() {
  console.log("=== Gunnerlytics Database Bootstrap ===\n");

  try {
    // Load existing data if it exists
    const dataPath = path.resolve(__dirname, "../../data/players.json");
    let existingPlayers: Player[] = [];

    if (fs.existsSync(dataPath)) {
      const raw = fs.readFileSync(dataPath, "utf-8");
      existingPlayers = JSON.parse(raw);
      console.log(`✓ Loaded ${existingPlayers.length} existing players\n`);
    } else {
      console.log("⚠️  No existing data found. Starting fresh.\n");
    }

    // For now, we'll use placeholder - in real scenario would combine multiple data sources
    console.log("📚 Loading seeded data...");

    // Combine all data sources
    let allPlayers: Omit<Player, "meta" | "arsenalRating">[] = SEEDED_PLAYERS;

    // Hydrate all players
    console.log("⚙️  Processing players...");
    const hydratedPlayers = allPlayers.map(hydratePlayer);

    // Sort by rating descending, then by appearances
    const sorted = hydratedPlayers.sort((a, b) => {
      const ratingDiff = (b.meta.arsenalRating || 0) - (a.meta.arsenalRating || 0);
      if (ratingDiff !== 0) return ratingDiff;
      return b.stats.totalAppearances - a.stats.totalAppearances;
    });

    console.log(`✓ Processed ${sorted.length} players\n`);

    // Save
    console.log("💾 Saving to data/players.json...");
    const json = JSON.stringify(sorted, null, 2);

    const dir = path.dirname(dataPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Create backup if file exists
    if (fs.existsSync(dataPath)) {
      const backupPath = dataPath.replace(".json", `.backup.${Date.now()}.json`);
      fs.copyFileSync(dataPath, backupPath);
      console.log(`✓ Backed up to ${backupPath}`);
    }

    fs.writeFileSync(dataPath, json, "utf-8");
    console.log("✓ Database initialized successfully!\n");

    // Summary
    console.log("📊 Summary:");
    console.log(`  Total players: ${sorted.length}`);
    console.log(
      `  Eras: ${new Set(sorted.map((p) => p.meta.era)).size} different eras`
    );
    console.log(
      `  Avg rating: ${Math.round((sorted.reduce((sum, p) => sum + (p.meta.arsenalRating || 0), 0) / sorted.length) * 10) / 10}`
    );

    const withTrophies = sorted.filter((p) => p.trophies.length > 0);
    console.log(`  Trophy winners: ${withTrophies.length}`);

    console.log("\n✅ Bootstrap complete!");
  } catch (error) {
    console.error("❌ Bootstrap failed:", error);
    process.exit(1);
  }
}

bootstrap();
