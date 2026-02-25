import type { Player } from "../../types/player";
import type { ScrapedPlayer } from "./fbref";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function positionToFull(pos: string): string {
  return pos as string;
}

function createNewPlayer(scraped: ScrapedPlayer): Player {
  const slug = slugify(scraped.name);
  const currentYear = new Date().getFullYear();

  return {
    id: slug,
    slug,
    fullName: scraped.name,
    shortName: scraped.name,
    dateOfBirth: scraped.dateOfBirth || "1990-01-01",
    nationality: scraped.nationality,
    height: 180,
    preferredFoot: "Right" as const,
    primaryPosition: positionToFull(scraped.position) as Player["primaryPosition"],
    secondaryPositions: [],
    shirtNumbers: [],
    arsenalCareer: {
      startYear: currentYear,
      endYear: null,
      signedFrom: "Unknown",
      soldTo: null,
      transferFeeIn: "Unknown",
      transferFeeOut: null,
      captain: false,
      managersPlayedUnder: ["Mikel Arteta"],
    },
    stats: {
      totalAppearances: scraped.appearances,
      totalGoals: scraped.goals,
      totalAssists: scraped.assists,
      totalMinutesPlayed: scraped.minutesPlayed,
      goalsPer90: scraped.minutesPlayed > 0
        ? Math.round((scraped.goals / scraped.minutesPlayed) * 90 * 100) / 100
        : 0,
      assistsPer90: scraped.minutesPlayed > 0
        ? Math.round((scraped.assists / scraped.minutesPlayed) * 90 * 100) / 100
        : 0,
      cleanSheets: 0,
      yellowCards: scraped.yellowCards,
      redCards: scraped.redCards,
      byCompetition: [
        {
          competition: "Premier League" as const,
          appearances: scraped.appearances,
          goals: scraped.goals,
          assists: scraped.assists,
          minutesPlayed: scraped.minutesPlayed,
        },
      ],
    },
    trophies: [],
    meta: {
      era: "Mikel Arteta" as const,
      lastUpdated: new Date().toISOString().split("T")[0],
      dataSource: "fbref",
    },
  };
}

function updateExistingPlayer(
  existing: Player,
  scraped: ScrapedPlayer
): Player {
  // Only update stats that come from scraping — preserve hand-curated data
  const updated = { ...existing };

  // Update basic stats if scraped data is newer/larger
  if (scraped.appearances > existing.stats.totalAppearances) {
    updated.stats = {
      ...existing.stats,
      totalAppearances: scraped.appearances,
      totalGoals: scraped.goals,
      totalAssists: scraped.assists,
      totalMinutesPlayed: scraped.minutesPlayed,
      goalsPer90: scraped.minutesPlayed > 0
        ? Math.round((scraped.goals / scraped.minutesPlayed) * 90 * 100) / 100
        : existing.stats.goalsPer90,
      assistsPer90: scraped.minutesPlayed > 0
        ? Math.round((scraped.assists / scraped.minutesPlayed) * 90 * 100) / 100
        : existing.stats.assistsPer90,
      yellowCards: scraped.yellowCards || existing.stats.yellowCards,
      redCards: scraped.redCards || existing.stats.redCards,
    };
  }

  updated.meta = {
    ...existing.meta,
    lastUpdated: new Date().toISOString().split("T")[0],
  };

  return updated;
}

function normalizeNameForMatch(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z ]/g, "")
    .trim();
}

function findMatch(
  scraped: ScrapedPlayer,
  existing: Player[]
): Player | undefined {
  const scrapedNorm = normalizeNameForMatch(scraped.name);

  // Exact slug match
  const slug = slugify(scraped.name);
  const slugMatch = existing.find((p) => p.slug === slug || p.id === slug);
  if (slugMatch) return slugMatch;

  // Normalized name match
  return existing.find((p) => {
    const fullNorm = normalizeNameForMatch(p.fullName);
    const shortNorm = normalizeNameForMatch(p.shortName);
    return (
      fullNorm === scrapedNorm ||
      shortNorm === scrapedNorm ||
      fullNorm.includes(scrapedNorm) ||
      scrapedNorm.includes(shortNorm)
    );
  });
}

export function mergePlayerData(
  existing: Player[],
  scraped: ScrapedPlayer[]
): Player[] {
  const result = [...existing];
  const matchedIds = new Set<string>();

  for (const s of scraped) {
    const match = findMatch(s, existing);
    if (match) {
      // Update existing player
      const idx = result.findIndex((p) => p.id === match.id);
      if (idx !== -1) {
        result[idx] = updateExistingPlayer(match, s);
        matchedIds.add(match.id);
      }
    } else {
      // New player
      const newPlayer = createNewPlayer(s);
      console.log(`  New player: ${newPlayer.shortName}`);
      result.push(newPlayer);
    }
  }

  return result;
}
