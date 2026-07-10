import { trpc } from "@/lib/trpc";
import type { Match, Player, ClubStats } from "@/types/api";

/**
 * Service para processar dados vindos do tRPC e converter para o formato do frontend
 */
export const proClubService = {
  processData(data: any): { matches: Match[]; players: Player[]; stats: ClubStats } {
    if (!data) return { matches: [], players: [], stats: this.getEmptyStats() };

    const { overallStats, memberStats, matches: rawMatches } = data;

    // 1. Processar Partidas
    const matches: Match[] = (rawMatches || []).map((m: any) => ({
      id: m.matchId,
      timestamp: m.timestamp,
      date: m.date || "Recente",
      opponent: m.opponent || "Oponente",
      teamGoals: m.teamGoals || 0,
      oppGoals: m.oppGoals || 0,
      result: m.result as "W" | "L" | "D",
      playerStats: m.playerStats || {}
    }));

    // 2. Processar Jogadores
    const players: Player[] = (memberStats || []).map((p: any) => ({
      name: p.name,
      position: p.position || "N/A",
      goals: p.goals || 0,
      assists: p.assists || 0,
      matches: p.games || 0,
      avgRating: p.rating || 0,
      cleanSheets: 0, // Tracker não fornece isso diretamente por jogador
      shots: 0,
      passes: 0,
      tackles: 0
    })).sort((a: any, b: any) => b.avgRating - a.avgRating);

    // 3. Processar Estatísticas do Clube
    // BUG FIX: currentStreak agora vem como objeto {type, count} do backend
    const currentStreakData = overallStats?.currentStreak;
    const stats: ClubStats = {
      total: overallStats?.gamesPlayed || 0,
      wins: overallStats?.wins || 0,
      losses: overallStats?.losses || 0,
      draws: overallStats?.draws || 0,
      gf: overallStats?.goals || 0,
      ga: overallStats?.conceded || 0,
      saldo: overallStats?.goalDiff || 0,
      aproveitamento: Math.round((overallStats?.winRate || 0) * 10) / 10,
      cleanSheets: overallStats?.cleanSheets || 0,
      mediaGols: Math.round((overallStats?.goalsPerGame || 0) * 100) / 100,
      currentStreak: typeof currentStreakData === 'object' && currentStreakData !== null
        ? { type: currentStreakData.type || null, count: currentStreakData.count || 0 }
        : { type: this.parseStreakType(currentStreakData), count: this.parseStreakCount(currentStreakData) },
      bestStreak: overallStats?.bestStreak || 0
    };

    return { matches, players, stats };
  },

  parseStreakType(streak: string): "W" | "L" | "D" | null {
    if (!streak) return null;
    if (typeof streak !== 'string') return null;
    if (streak.includes("W")) return "W";
    if (streak.includes("L")) return "L";
    if (streak.includes("D")) return "D";
    return null;
  },

  parseStreakCount(streak: string): number {
    if (!streak) return 0;
    if (typeof streak !== 'string') return 0;
    const match = streak.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  },

  getEmptyStats(): ClubStats {
    return {
      total: 0, wins: 0, losses: 0, draws: 0, gf: 0, ga: 0, saldo: 0,
      aproveitamento: 0, cleanSheets: 0, mediaGols: 0,
      currentStreak: { type: null, count: 0 },
      bestStreak: 0
    };
  }
};
