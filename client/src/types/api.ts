/**
 * Tipos para a API do Pro Club
 */

export interface RawMatchData {
  match_data: {
    matchId: string;
    timestamp: number;
    timeAgo: string;
    clubs: Record<string, {
      clubId: string;
      clubName: string;
      goals: string;
      wins: string;
      losses: string;
      ties: string;
      result: string;
    }>;
  };
  player_data: Record<string, RawPlayerStats>;
}

export interface RawPlayerStats {
  mom: string;
  pos: string;
  goals: string;
  saves: string;
  shots: string;
  rating: string;
  assists: string;
  dribbles: number;
  redcards: string;
  passesmade: string;
  archetypeid: string;
  tacklesmade: string;
  passattempts: string;
  cleansheetsgk: string;
  interceptions: number;
  secondAssists: number;
  secondsPlayed: string;
  cleansheetsdef: string;
  tackleattempts: string;
}

export interface Match {
  id: string;
  timestamp: number;
  date: string;
  opponent: string;
  teamGoals: number;
  oppGoals: number;
  result: "W" | "L" | "D";
  playerStats: Record<string, RawPlayerStats>;
}

export interface Player {
  name: string;
  position: string;
  goals: number;
  assists: number;
  matches: number;
  avgRating: number;
  cleanSheets: number;
  shots: number;
  passes: number;
  tackles: number;
  interceptions: number;
  saves: number;
}

export interface ClubStats {
  total: number;
  wins: number;
  losses: number;
  draws: number;
  gf: number;
  ga: number;
  saldo: number;
  aproveitamento: number;
  cleanSheets: number;
  mediaGols: number;
  currentStreak: {
    type: "W" | "L" | "D" | null;
    count: number;
  };
  bestStreak: number;
}

export interface ProClubResponse {
  matches: Match[];
  players: Player[];
  stats: ClubStats;
}
