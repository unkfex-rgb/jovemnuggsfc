import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../../server/routers";
import superjson from "superjson";
import type { Match, Player, ClubStats, RawMatchData } from "@/types/api";

const CLUB_ID = "8044401";
const PLATFORM = "common-gen5";

// Cliente tRPC puro para uso em serviços
const trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: "/api/trpc",
    }),
  ],
});



interface TrackerMemberStats {
  name: string;
  proName: string;
  proPos: string;
  ratingAve: string;
  goals: string;
  assists: string;
  manOfTheMatch: string;
  favoritePosition: string;
  [key: string]: any;
}

export const proClubAPI = {
  async getMatchHistory(): Promise<{ matches: Match[]; players: Player[] }> {
    try {
      const [leagueMatches, playoffMatches, memberStats] = await Promise.all([
        trpc.club.leagueMatches.query(),
        trpc.club.playoffMatches.query(),
        trpc.club.memberStats.query()
      ]);

      const rawMatches = [...(leagueMatches || []), ...(playoffMatches || [])]
        .sort((a, b) => b.timestamp - a.timestamp);

      const matches: Match[] = rawMatches.map((m: any) => {
        const ourClubId = Object.keys(m.clubs).find(id => id === CLUB_ID);
        const oppClubId = Object.keys(m.clubs).find(id => id !== CLUB_ID);
        
        const ourClub = ourClubId ? m.clubs[ourClubId] : null;
        const opponentClub = oppClubId ? m.clubs[oppClubId] : null;
        
        const ourGoals = parseInt(ourClub?.goals || "0");
        const oppGoals = parseInt(opponentClub?.goals || "0");
        
        let result: "W" | "L" | "D" = "D";
        if (ourGoals > oppGoals) result = "W";
        else if (ourGoals < oppGoals) result = "L";

        // A API da EA não retorna playerStats detalhados por partida neste endpoint
        // Precisaremos adaptar o MatchStatsPopup ou buscar de outra forma se necessário
        return {
          id: m.matchId,
          timestamp: m.timestamp,
          date: new Date(m.timestamp * 1000).toLocaleDateString('pt-BR'),
          opponent: opponentClub?.details?.name || "Desconhecido",
          teamGoals: ourGoals,
          oppGoals: oppGoals,
          result,
          playerStats: {} // Temporariamente vazio, a API da EA não fornece isso facilmente por partida
        };
      });

      // Process Players from memberStats
      const players: Player[] = [];
      if (memberStats && memberStats.members) {
        memberStats.members.forEach((member: any) => {
          players.push({
            name: member.name,
            position: member.favoritePosition || "Desconhecido",
            goals: parseInt(member.goals || "0"),
            assists: parseInt(member.assists || "0"),
            matches: parseInt(member.gamesPlayed || "0"),
            avgRating: parseFloat(member.ratingAve || "0"),
            cleanSheets: parseInt(member.cleanSheetsDef || "0") + parseInt(member.cleanSheetsGK || "0"),
            shots: parseInt(member.shots || "0"),
            passes: parseInt(member.passesMade || "0"),
            tackles: parseInt(member.tacklesMade || "0"),
            saves: parseInt(member.saves || "0")
          });
        });
      }

      return { 
        matches, 
        players: players.sort((a, b) => b.avgRating - a.avgRating) 
      };
    } catch (error) {
      console.error("Erro ao buscar histórico de partidas da EA:", error);
      return { matches: [], players: [] };
    }
  },






  async getClubStats(): Promise<ClubStats> {
    const [clubInfo, overallStats, leagueMatches, playoffMatches] = await Promise.all([
      trpc.club.clubInfo.query(),
      trpc.club.overallStats.query(),
      trpc.club.leagueMatches.query(),
      trpc.club.playoffMatches.query(),
    ]);

    const stats: ClubStats = {
      total: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      gf: 0,
      ga: 0,
      saldo: 0,
      aproveitamento: 0,
      cleanSheets: 0,
      mediaGols: 0,
      currentStreak: { type: "", count: 0 },
      bestStreak: 0,
      division: parseInt(clubInfo?.[0]?.divisionTitle) || 0,
      skillRating: parseInt(clubInfo?.[0]?.skillRating) || 0,
    };

    const allMatches = [...leagueMatches, ...playoffMatches];
    stats.total = allMatches.length;

    if (!allMatches.length) return stats;

    stats.wins = parseInt(overallStats?.[0]?.wins) || 0;
    stats.draws = parseInt(overallStats?.[0]?.draws) || 0;
    stats.losses = parseInt(overallStats?.[0]?.losses) || 0;
    stats.gf = parseInt(overallStats?.[0]?.goals) || 0;
    stats.ga = parseInt(overallStats?.[0]?.goalsAgainst) || 0;
    stats.saldo = stats.gf - stats.ga;
    stats.aproveitamento = parseFloat(((stats.wins / stats.total) * 100).toFixed(2));
    stats.mediaGols = stats.gf / stats.total;

    // Clean Sheets (precisa ser calculado a partir dos matches)
    stats.cleanSheets = allMatches.filter(match => {
      const ourClub = match.clubs.find((c: any) => c.clubId === CLUB_ID);
      return ourClub && parseInt(ourClub.goalsAgainst) === 0;
    }).length;

    // Calcular sequências (ainda precisa ser feito a partir dos matches)
    let currentWinStreak = 0;
    let currentLossStreak = 0;
    let currentDrawStreak = 0;
    let bestStreak = 0;

    // Para calcular a streak, precisamos ordenar as partidas por data (mais recente primeiro)
    const sortedMatches = [...allMatches].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (sortedMatches.length > 0) {
      const lastMatchResult = sortedMatches[0].clubs.find((c: any) => c.clubId === CLUB_ID)?.result;
      
      for (const match of sortedMatches) {
        const ourClub = match.clubs.find((c: any) => c.clubId === CLUB_ID);
        if (!ourClub) continue;

        const result = ourClub.result;

        if (result === lastMatchResult) {
          if (result === "win") currentWinStreak++;
          else if (result === "draw") currentDrawStreak++;
          else if (result === "loss") currentLossStreak++;
        } else {
          break; // A sequência foi quebrada
        }
      }

      if (lastMatchResult === "win") stats.currentStreak = { type: "W", count: currentWinStreak };
      else if (lastMatchResult === "draw") stats.currentStreak = { type: "D", count: currentDrawStreak };
      else if (lastMatchResult === "loss") stats.currentStreak = { type: "L", count: currentLossStreak };
    }

    // Melhor sequência (precisa de uma lógica mais complexa, por enquanto deixamos 0)
    stats.bestStreak = 0; // Será implementado em uma próxima etapa

    return stats;
  },
};
