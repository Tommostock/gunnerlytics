import type { PlayerIndex, FilterState } from "@/types";

export const DEFAULT_FILTERS: FilterState = {
  search: "",
  position: "All",
  era: "All",
  nationality: "",
  minAppearances: 0,
  trophyWinners: false,
  sortBy: "rating",
  sortOrder: "desc",
};

export function applyFilters(
  players: PlayerIndex[],
  filters: FilterState
): PlayerIndex[] {
  let result = [...players];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.shortName.toLowerCase().includes(q) ||
        p.fullName.toLowerCase().includes(q) ||
        p.nationality.toLowerCase().includes(q)
    );
  }

  if (filters.position !== "All") {
    result = result.filter((p) => p.primaryPosition === filters.position);
  }

  if (filters.era !== "All") {
    result = result.filter((p) => p.era === filters.era);
  }

  if (filters.nationality) {
    result = result.filter(
      (p) => p.nationality.toLowerCase() === filters.nationality.toLowerCase()
    );
  }

  if (filters.minAppearances > 0) {
    result = result.filter((p) => p.totalAppearances >= filters.minAppearances);
  }

  result.sort((a, b) => {
    let cmp = 0;
    switch (filters.sortBy) {
      case "name":
        cmp = a.shortName.localeCompare(b.shortName);
        break;
      case "appearances":
        cmp = a.totalAppearances - b.totalAppearances;
        break;
      case "goals":
        cmp = a.totalGoals - b.totalGoals;
        break;
      case "rating":
        cmp = (a.arsenalRating || 0) - (b.arsenalRating || 0);
        break;
      case "era":
        cmp = a.arsenalStartYear - b.arsenalStartYear;
        break;
    }
    return filters.sortOrder === "desc" ? -cmp : cmp;
  });

  return result;
}
