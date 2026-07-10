import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../../server/routers";
import superjson from "superjson";
import type { Match, Player, ClubStats } from "@/types/api";

const CLUB_ID = "8044401";

const trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: "/api/trpc",
    }),
  ],
});

export const proClubAPI = {
  async getAllData(): Promise<{ matches: Match[]; players: Player[]; stats: ClubStats }> {
    try {
      const data = await trpc.club.getData.query();
      
      const { clubInfo, overallStats, memberStats, matches: rawMatches, trackerData } = data;

      // 1. Processar Partidas
      const matches: Match[] = (rawMatches || [])
        .sort((a: any, b: any) => b.timestamp - a.timestamp)
        .map((m: any) => {
          const ourClub = m.clubs[CLUB_ID] || Object.values(m.clubs).find((c: any) => c.details?.name === "Jovem Nuggs FC");
          const opponentClub = Object.values(m.clubs).find((c: any) => c !== ourClub);
          
          const ourGoals = parseInt((ourClub as any)?.goals || "0");
          const oppGoals = parseInt((opponentClub as any)?.goals || "0");
          
          return {
            id: m.matchId,
            timestamp: m.timestamp,
            date: new Date(m.timestamp * 1000).toLocaleDateString('pt-BR'),
            opponent: (opponentClub as any)?.details?.name || "Desconhecido",
            teamGoals: ourGoals,
            oppGoals: oppGoals,
            result: ourGoals > oppGoals ? "W" : ourGoals < oppGoals ? "L" : "D",
            playerStats: {} 
          };
        });

      // 2. Processar Jogadores (Mesclando EA + Tracker se disponível)
      const players: Player[] = (memberStats?.members || []).map((member: any) => {
        // Tentar encontrar dados extras no Tracker
        const trackerMember = trackerData?.members?.find((tm: any) => tm.name === member.name);
        
        return {
          name: member.name,
          position: member.favoritePosition || trackerMember?.proPos || "Desconhecido",
          goals: parseInt(member.goals || "0"),
          assists: parseInt(member.assists || "0"),
          matches: parseInt(member.gamesPlayed || "0"),
          avgRating: parseFloat(member.ratingAve || trackerMember?.ratingAve || "0"),
          cleanSheets: (parseInt(member.cleanSheetsDef) || 0) + (parseInt(member.cleanSheetsGK) || 0),
          shots: parseInt(member.shots || "0"),
          passes: parseInt(member.passesMade || "0"),
          tackles: parseInt(member.tacklesMade || "0"),
          saves: parseInt(member.saves || "0")
        };
      }).sort((a: any, b: any) => b.avgRating - a.avgRating);

      // 3. Processar Estatísticas do Clube
      const stats: ClubStats = {
        total: matches.length,
        wins: parseInt(overallStats?.[0]?.wins || "0"),
        draws: parseInt(overallStats?.[0]?.draws || "0"),
        losses: parseInt(overallStats?.[0]?.losses || "0"),
        gf: parseInt(overallStats?.[0]?.goals || "0"),
        ga: parseInt(overallStats?.[0]?.goalsAgainst || "0"),
        saldo: 0,
        aproveitamento: 0,
        cleanSheets: matches.filter(m => m.oppGoals === 0).length,
        mediaGols: 0,
        currentStreak: { type: "", count: 0 },
        bestStreak: 0,
        division: parseInt(clubInfo?.[0]?.divisionTitle) || 0,
        skillRating: parseInt(clubInfo?.[0]?.skillRating) || 0,
      };

      stats.saldo = stats.gf - stats.ga;
      stats.aproveitamento = stats.total > 0 ? parseFloat(((stats.wins / stats.total) * 100).toFixed(2)) : 0;
      stats.mediaGols = stats.total > 0 ? stats.gf / stats.total : 0;

      // Calcular Streak
      if (matches.length > 0) {
        const lastResult = matches[0].result;
        let count = 0;
        for (const m of matches) {
          if (m.result === lastResult) count++;
          else break;
        }
        stats.currentStreak = { type: lastResult, count };
      }

      return { matches, players, stats };
    } catch (error) {
      console.error("Erro ao agregar dados do clube:", error);
      throw error;
    }
  }
};
