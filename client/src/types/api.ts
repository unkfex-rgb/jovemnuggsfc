/**
 * Tipos para a API do Pro Club
 */

export interface ClubInfo {
  clubName: string;
  division: string;
  skillRating: number;
  wins: number;
  draws: number;
  losses: number;
}

export interface OverallStats {
  gamesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  winRate: number;
  goals: number;
  conceded: number;
  goalDiff: number;
  goalsPerGame: number;
  concededPerGame: number;
  cleanSheets: number;
  currentStreak: string;
  promotions: number;
  relegations: number;
}

export interface Member {
  name: string;
  games: number;
  goals: number;
  assists: number;
  rating: number;
  position: string; // Adicionado
}

export interface Match {
  matchId: string;
  timestamp: number;
  homeClubName: string;
  awayClubName: string;
  homeGoals: number;
  awayGoals: number;
  result: 'W' | 'L' | 'D'; // Ajustado para 'W', 'L', 'D'
  teamGoals: number; // Adicionado
  oppGoals: number; // Adicionado
  date: string; // Adicionado
  opponent: string; // Adicionado
}

export interface AggregatedClubData {
  clubInfo: ClubInfo;
  overallStats: OverallStats;
  memberStats: Member[];
  matches: Match[];
  timestamp: number;
}
