import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

const CLUB_ID = "8044401";
const API_BASE = "https://api.ourproclub.app/api";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  club: router({
    matchHistory: publicProcedure.query(async () => {
      try {
        const response = await fetch(`${API_BASE}/match/history?clubId=${CLUB_ID}`);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Erro ao buscar histórico de partidas:", error);
        return [];
      }
    }),

    stats: publicProcedure.query(async () => {
      try {
        const response = await fetch(`${API_BASE}/match/history?clubId=${CLUB_ID}`);
        const matches = await response.json();

        const stats = {
          totalMatches: matches.length,
          wins: 0,
          draws: 0,
          losses: 0,
          totalGoals: 0,
          totalConceded: 0,
          players: {} as Record<string, any>,
        };

        matches.forEach((match: any) => {
          const ourGoals = parseInt(match.match_data.clubs[CLUB_ID].goals);
          const opponentGoals = Object.values(match.match_data.clubs)
            .filter((club: any) => club.clubName !== "Jovem Nuggs FC")
            .reduce((sum: number, club: any) => sum + parseInt(club.goals), 0);

          stats.totalGoals += ourGoals;
          stats.totalConceded += opponentGoals;

          if (ourGoals > opponentGoals) stats.wins++;
          else if (ourGoals < opponentGoals) stats.losses++;
          else stats.draws++;

          Object.entries(match.player_data).forEach(([playerName, playerStats]: any) => {
            if (!stats.players[playerName]) {
              stats.players[playerName] = {
                name: playerName,
                goals: 0,
                assists: 0,
                matches: 0,
                totalRating: 0,
                position: playerStats.pos,
              };
            }
            stats.players[playerName].goals += parseInt(playerStats.goals);
            stats.players[playerName].assists += parseInt(playerStats.assists);
            stats.players[playerName].matches += 1;
            stats.players[playerName].totalRating += parseFloat(playerStats.rating);
          });
        });

        Object.values(stats.players).forEach((player: any) => {
          player.averageRating = (player.totalRating / player.matches).toFixed(2);
        });

        return stats;
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
        return null;
      }
    }),

    topPlayers: publicProcedure.query(async () => {
      try {
        const response = await fetch(`${API_BASE}/match/history?clubId=${CLUB_ID}`);
        const matches = await response.json();

        const players: Record<string, any> = {};

        matches.forEach((match: any) => {
          Object.entries(match.player_data).forEach(([playerName, playerStats]: any) => {
            if (!players[playerName]) {
              players[playerName] = {
                name: playerName,
                goals: 0,
                assists: 0,
                matches: 0,
                totalRating: 0,
                position: playerStats.pos,
              };
            }
            players[playerName].goals += parseInt(playerStats.goals);
            players[playerName].assists += parseInt(playerStats.assists);
            players[playerName].matches += 1;
            players[playerName].totalRating += parseFloat(playerStats.rating);
          });
        });

        Object.values(players).forEach((player: any) => {
          player.averageRating = (player.totalRating / player.matches).toFixed(2);
        });

        const topByGoals = Object.values(players)
          .sort((a: any, b: any) => b.goals - a.goals)
          .slice(0, 5);

        const topByAssists = Object.values(players)
          .sort((a: any, b: any) => b.assists - a.assists)
          .slice(0, 5);

        const topByRating = Object.values(players)
          .sort((a: any, b: any) => parseFloat(b.averageRating) - parseFloat(a.averageRating))
          .slice(0, 5);

        return { topByGoals, topByAssists, topByRating };
      } catch (error) {
        console.error("Erro ao buscar top jogadores:", error);
        return null;
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;
