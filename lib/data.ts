import type { Player, PlayerIndex } from "@/types";
import { calculateArsenalRating } from "@/lib/rating";
import { playerToIndex } from "@/lib/utils";
import playersRaw from "@/data/players.json";

function hydratePlayer(raw: Player): Player {
  const player = raw as Player;
  player.meta.arsenalRating = calculateArsenalRating(player);
  return player;
}

const players: Player[] = (playersRaw as unknown as Player[]).map(hydratePlayer);

export function getAllPlayers(): Player[] {
  return players;
}

export function getAllPlayerIndex(): PlayerIndex[] {
  return players.map(playerToIndex);
}

export function getPlayerBySlug(slug: string): Player | undefined {
  return players.find((p) => p.slug === slug);
}

export function getPlayerById(id: string): Player | undefined {
  return players.find((p) => p.id === id);
}

export function getAllSlugs(): string[] {
  return players.map((p) => p.slug);
}

export function getPlayersByIds(ids: string[]): Player[] {
  return ids.map((id) => players.find((p) => p.id === id)).filter(Boolean) as Player[];
}

export function searchPlayers(query: string, index: PlayerIndex[]): PlayerIndex[] {
  const q = query.toLowerCase().trim();
  if (!q) return index;
  return index.filter(
    (p) =>
      p.shortName.toLowerCase().includes(q) ||
      p.fullName.toLowerCase().includes(q) ||
      p.nationality.toLowerCase().includes(q) ||
      p.primaryPosition.toLowerCase().includes(q)
  );
}
