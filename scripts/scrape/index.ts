import { scrapeArsenalSquad } from "./fbref";
import { mergePlayerData } from "./merge";
import { loadExistingData, saveData, hasChanges } from "./storage";
import { detectTransfers, logTransfers } from "./transfers";

const DRY_RUN = process.argv.includes("--dry-run");
const VERBOSE = process.argv.includes("--verbose");

async function main() {
  console.log("=== Gunnerlytics Scraper ===");
  console.log(`Mode: ${DRY_RUN ? "DRY RUN" : "LIVE"}`);
  console.log(`Time: ${new Date().toISOString()}\n`);

  try {
    // Load existing data
    const existing = loadExistingData();
    console.log(`📊 Loaded ${existing.length} existing players\n`);

    // Scrape FBref
    console.log("🔍 Scraping FBref Arsenal squad data...");
    const scraped = await scrapeArsenalSquad();
    console.log(`✓ Scraped ${scraped.length} players from FBref\n`);

    if (scraped.length === 0) {
      console.log("⚠️  No data scraped. Exiting without changes.");
      process.exit(0);
    }

    // Merge
    const merged = mergePlayerData(existing, scraped);
    console.log(`✓ Merged result: ${merged.length} players\n`);

    // Detect transfers
    const transfers = detectTransfers(existing, merged);
    if (transfers.length > 0) {
      logTransfers(transfers);
    }

    // Check for changes
    if (!hasChanges(existing, merged)) {
      console.log("✓ No changes detected. Data is up to date.");
      process.exit(0);
    }

    console.log("\n⚡ Changes detected!");

    if (DRY_RUN) {
      console.log("[DRY RUN] Would write updated data. Skipping.");
      console.log("\n📝 New/updated players:");
      for (const p of merged) {
        const existingPlayer = existing.find((e) => e.id === p.id);
        if (!existingPlayer) {
          console.log(`  + ${p.shortName} (new)`);
        } else if (
          existingPlayer.stats.totalAppearances !== p.stats.totalAppearances ||
          existingPlayer.stats.totalGoals !== p.stats.totalGoals
        ) {
          console.log(
            `  ~ ${p.shortName} (apps: ${existingPlayer.stats.totalAppearances} → ${p.stats.totalAppearances}, goals: ${existingPlayer.stats.totalGoals} → ${p.stats.totalGoals})`
          );
        }
      }
    } else {
      saveData(merged);
      console.log("✓ Data saved successfully to data/players.json");
    }

    if (VERBOSE) {
      console.log("\n📋 Summary:");
      console.log(`  Total players: ${merged.length}`);
      console.log(`  Transfers: ${transfers.length}`);
      console.log(`  New/updated: ${merged.length - existing.length}`);
    }

    console.log("\n✅ Done!");
  } catch (error) {
    console.error("❌ Scraper failed:", error);
    process.exit(1);
  }
}

main();
