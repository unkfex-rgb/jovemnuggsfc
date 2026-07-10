import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../../server/routers";
import superjson from "superjson";
import type { Match, Member, ClubInfo, OverallStats } from "@/types/api";

const CLUB_ID = "8044401";

const trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: typeof window !== "undefined" ? `${window.location.origin}/api/trpc` : "/api/trpc",
    }),
  ],
});

export const proClubAPI = {
  async getAllData(): Promise<{ matches: Match[]; players: Member[]; stats: { clubInfo: ClubInfo; overallStats: OverallStats } }> {
    try {
      const data = await trpc.club.getData.query();
      
      const { clubInfo, overallStats, memberStats, matches: rawMatches } = data;

      // 1. Processar Partidas
      const matches: Match[] = (rawMatches || [])
        .sort((a: any, b: any) => b.timestamp - a.timestamp)
        .map((m: any) => {
          return {
            matchId: m.matchId,
            timestamp: m.timestamp,
            homeClubName: m.homeClubName,
            awayClubName: m.awayClubName,
            homeGoals: m.homeGoals,
            awayGoals: m.awayGoals,
            result: m.result,
          };
        });

      // 2. Processar Jogadores
      const players: Member[] = (memberStats || []).map((member: any) => {
        return {
          name: member.name,
          games: member.games,
          goals: member.goals,
          assists: member.assists,
          rating: member.rating,
        };
      }).sort((a: any, b: any) => b.rating - a.rating);

      // 3. Processar Estatísticas do Clube
      const stats = {
        clubInfo: clubInfo as ClubInfo,
        overallStats: overallStats as OverallStats,
      };

      return { matches, players, stats };
    } catch (error) {
      console.error("Erro ao agregar dados do clube:", error);
      throw error;
    }
  }
};
