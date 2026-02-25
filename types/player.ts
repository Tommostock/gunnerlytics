export type Position =
  | "GK"
  | "CB"
  | "LB"
  | "RB"
  | "LWB"
  | "RWB"
  | "CDM"
  | "CM"
  | "CAM"
  | "LM"
  | "RM"
  | "LW"
  | "RW"
  | "CF"
  | "ST";

export type Foot = "Left" | "Right" | "Both";

export type Era =
  | "Pre-War"
  | "Post-War"
  | "1950s"
  | "1960s"
  | "1970s"
  | "1980s"
  | "George Graham"
  | "Arsene Wenger"
  | "Unai Emery"
  | "Mikel Arteta";

export type Competition =
  | "Premier League"
  | "First Division"
  | "FA Cup"
  | "League Cup"
  | "Champions League"
  | "Europa League"
  | "UEFA Cup"
  | "Cup Winners Cup"
  | "Community Shield"
  | "Other";

export interface CompetitionStats {
  competition: Competition;
  appearances: number;
  goals: number;
  assists: number;
  minutesPlayed: number;
  cleanSheets?: number;
}

export interface Trophy {
  name: string;
  season: string;
}

export interface Player {
  id: string;
  slug: string;
  fullName: string;
  shortName: string;
  dateOfBirth: string;
  nationality: string;
  secondNationality?: string;
  height: number;
  preferredFoot: Foot;
  primaryPosition: Position;
  secondaryPositions: Position[];
  shirtNumbers: number[];
  imageUrl?: string;

  arsenalCareer: {
    startYear: number;
    endYear: number | null;
    signedFrom: string;
    soldTo: string | null;
    transferFeeIn: string;
    transferFeeOut: string | null;
    captain: boolean;
    captainYears?: string;
    managersPlayedUnder: string[];
  };

  stats: {
    totalAppearances: number;
    totalGoals: number;
    totalAssists: number;
    totalMinutesPlayed: number;
    goalsPer90: number;
    assistsPer90: number;
    cleanSheets: number;
    yellowCards: number;
    redCards: number;
    byCompetition: CompetitionStats[];
  };

  trophies: Trophy[];

  meta: {
    arsenalRating?: number;
    era: Era;
    lastUpdated: string;
    dataSource: string;
  };
}

export interface PlayerIndex {
  id: string;
  slug: string;
  shortName: string;
  fullName: string;
  nationality: string;
  primaryPosition: Position;
  era: Era;
  totalAppearances: number;
  totalGoals: number;
  arsenalStartYear: number;
  arsenalEndYear: number | null;
  arsenalRating?: number;
  imageUrl?: string;
}

export interface CompareSelection {
  players: Player[];
}

export interface FilterState {
  search: string;
  position: Position | "All";
  era: Era | "All";
  nationality: string;
  minAppearances: number;
  trophyWinners: boolean;
  sortBy: "name" | "appearances" | "goals" | "rating" | "era";
  sortOrder: "asc" | "desc";
}
