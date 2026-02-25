import type { Player } from "../../types/player";

interface TransferEvent {
  playerId: string;
  playerName: string;
  transferType: "in" | "out";
  club: string;
  season: string;
  fee?: string;
  date: string;
}

/**
 * Detect transfers by comparing old and new player records
 */
export function detectTransfers(
  oldPlayers: Player[],
  newPlayers: Player[]
): TransferEvent[] {
  const transfers: TransferEvent[] = [];
  const currentDate = new Date().toISOString().split("T")[0];

  for (const newPlayer of newPlayers) {
    const oldPlayer = oldPlayers.find((p) => p.id === newPlayer.id);

    if (!oldPlayer) {
      // New player (potentially a transfer in)
      transfers.push({
        playerId: newPlayer.id,
        playerName: newPlayer.shortName,
        transferType: "in",
        club: newPlayer.arsenalCareer.signedFrom,
        season: getCurrentSeason(),
        fee: newPlayer.arsenalCareer.transferFeeIn,
        date: currentDate,
      });
      continue;
    }

    // Check if player was sold/left
    if (
      !oldPlayer.arsenalCareer.endYear &&
      newPlayer.arsenalCareer.endYear
    ) {
      transfers.push({
        playerId: newPlayer.id,
        playerName: newPlayer.shortName,
        transferType: "out",
        club: newPlayer.arsenalCareer.soldTo || "Unknown",
        season: getCurrentSeason(),
        fee: newPlayer.arsenalCareer.transferFeeOut,
        date: currentDate,
      });
    }
  }

  return transfers;
}

function getCurrentSeason(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // Premier League season runs Aug-May
  if (month >= 7) {
    return `${year}-${year + 1}`;
  } else {
    return `${year - 1}-${year}`;
  }
}

/**
 * Log transfers in a human-readable format
 */
export function logTransfers(transfers: TransferEvent[]): void {
  if (transfers.length === 0) {
    console.log("  No transfers detected.");
    return;
  }

  console.log("\n=== Transfer Activity ===");
  const inbound = transfers.filter((t) => t.transferType === "in");
  const outbound = transfers.filter((t) => t.transferType === "out");

  if (inbound.length > 0) {
    console.log("\n📥 Inbound Transfers:");
    for (const t of inbound) {
      console.log(
        `  ${t.playerName}: ${t.club} → Arsenal (${t.fee || "Unknown fee"})`
      );
    }
  }

  if (outbound.length > 0) {
    console.log("\n📤 Outbound Transfers:");
    for (const t of outbound) {
      console.log(
        `  ${t.playerName}: Arsenal → ${t.club} (${t.fee || "Unknown fee"})`
      );
    }
  }
}
