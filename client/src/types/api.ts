/**
 * Tipos para a API do Pro Club
 */

export interface Match {
  id: string;
  date: string;
  opponent: string;
  teamGoals: number;
  oppGoals: number;
  result: "W" | "L" | "D";
}

export interface Player {
  id: string;
  name: string;
  position: string;
  goals: number;
  assists: number;
  matches: number;
  avgRating: number;
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
  clubId: number;
  clubName: string;
  matches: Match[];
  players: Player[];
}

