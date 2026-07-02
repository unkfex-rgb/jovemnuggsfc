import { initTRPC } from "@trpc/server";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import superjson from "superjson";

// Re-implementing necessary parts to avoid import issues in Vercel ESM environment
const t = initTRPC.create({
  transformer: superjson,
});

const router = t.router;
const publicProcedure = t.procedure;

const CLUB_ID = "8044401";
const API_BASE = "https://api.ourproclub.app/api";

async function fetchMatchHistory() {
  try {
    const response = await fetch(`${API_BASE}/match/history?clubId=${CLUB_ID}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar histórico de partidas:", error);
    return [];
  }
}

const appRouter = router({
  club: router({
    matchHistory: publicProcedure.query(async () => {
      return await fetchMatchHistory();
    }),
    stats: publicProcedure.query(async () => {
      const matches = await fetchMatchHistory();
      const stats = {
        totalMatches: matches.length,
        wins: 0,
        draws: 0,
        losses: 0,
        totalGoals: 0,
        totalConceded: 0,
        players: {} as Record<string, any>,
      };
      if (!Array.isArray(matches)) return stats;
      matches.forEach((match: any) => {
        if (!match.match_data?.clubs?.[CLUB_ID]) return;
        const ourGoals = parseInt(match.match_data.clubs[CLUB_ID].goals) || 0;
        const opponentGoals = Object.values(match.match_data.clubs)
          .filter((club: any) => club.clubName !== "Jovem Nuggs FC")
          .reduce((sum: number, club: any) => sum + (parseInt(club.goals) || 0), 0);
        stats.totalGoals += ourGoals;
        stats.totalConceded += opponentGoals;
        if (ourGoals > opponentGoals) stats.wins++;
        else if (ourGoals < opponentGoals) stats.losses++;
        else stats.draws++;
        if (match.player_data) {
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
            stats.players[playerName].goals += parseInt(playerStats.goals) || 0;
            stats.players[playerName].assists += parseInt(playerStats.assists) || 0;
            stats.players[playerName].matches += 1;
            stats.players[playerName].totalRating += parseFloat(playerStats.rating) || 0;
          });
        }
      });
      Object.values(stats.players).forEach((player: any) => {
        player.averageRating = (player.totalRating / player.matches).toFixed(2);
      });
      return stats;
    }),
    topPlayers: publicProcedure.query(async () => {
      const matches = await fetchMatchHistory();
      const players: Record<string, any> = {};
      if (!Array.isArray(matches)) return { topByGoals: [], topByAssists: [], topByRating: [] };
      matches.forEach((match: any) => {
        if (match.player_data) {
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
            players[playerName].goals += parseInt(playerStats.goals) || 0;
            players[playerName].assists += parseInt(playerStats.assists) || 0;
            players[playerName].matches += 1;
            players[playerName].totalRating += parseFloat(playerStats.rating) || 0;
          });
        }
      });
      Object.values(players).forEach((player: any) => {
        player.averageRating = (player.totalRating / player.matches).toFixed(2);
      });
      const topByGoals = Object.values(players).sort((a: any, b: any) => b.goals - a.goals).slice(0, 5);
      const topByAssists = Object.values(players).sort((a: any, b: any) => b.assists - a.assists).slice(0, 5);
      const topByRating = Object.values(players).sort((a: any, b: any) => parseFloat(b.averageRating) - parseFloat(a.averageRating)).slice(0, 5);
      return { topByGoals, topByAssists, topByRating };
    }),
  }),
});

const app = express();
app.use(express.json());
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: () => ({ req: {} as any, res: {} as any, user: null }),
  })
);

export default app;
