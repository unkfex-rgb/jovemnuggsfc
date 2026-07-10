import { initTRPC } from "@trpc/server";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import superjson from "superjson";
import axios from "axios";
import * as cheerio from "cheerio";

const CLUB_ID = "8044401";
const CACHE_TTL = 5 * 60 * 1000;
const cache = new Map<string, { data: any; timestamp: number }>();

async function fetchData(url: string, options: any = {}, fallback: any = null) {
  const cacheKey = url + JSON.stringify(options);
  const cached = cache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) return cached.data;

  try {
    const response = await axios.get(url, {
      ...options,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        ...(options.headers || {})
      },
      timeout: 15000
    });
    const data = response.data;
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error(`Erro ao buscar ${url}:`, error instanceof Error ? error.message : error);
    return cached ? cached.data : fallback;
  }
}

const t = initTRPC.create({ transformer: superjson });
const router = t.router;
const publicProcedure = t.procedure;

export const appRouter = router({
  club: router({
    getData: publicProcedure.query(async () => {
      const proClubsTrackerUrl = `https://proclubstracker.com/club/${CLUB_ID}?platform=common-gen5&div=5`;
      const ourProClubMatchHistoryUrl = `https://api.ourproclub.app/api/match/history?clubId=${CLUB_ID}`;

      let clubInfo: any = { clubName: "Jovem Nuggs FC", division: "5", skillRating: 0, wins: 0, draws: 0, losses: 0 };
      let overallStats: any = { gamesPlayed: 0, wins: 0, draws: 0, losses: 0, winRate: 0, goals: 0, conceded: 0, goalDiff: 0, goalsPerGame: 0, concededPerGame: 0, cleanSheets: 0, currentStreak: "", promotions: 0, relegations: 0 };
      let memberStats: any[] = [];
      let matches: any[] = [];

      // 1. Buscar histórico de partidas da OurProClub API (Fonte Primária para Partidas)
      try {
        const ourProMatches = await fetchData(ourProClubMatchHistoryUrl, {}, []);
        if (Array.isArray(ourProMatches)) {
          matches = ourProMatches.map((match: any) => {
            const ourClub = match.match_data?.clubs?.[CLUB_ID];
            const opponentClub = Object.values(match.match_data?.clubs || {}).find((c: any) => c.clubId !== CLUB_ID) as any;
            return {
              matchId: match.match_data?.matchId || match.id?.toString() || Math.random().toString(36),
              timestamp: match.match_data?.timestamp || match.match_date || Date.now() / 1000,
              date: (match.match_data?.timestamp || match.match_date) ? new Date((match.match_data?.timestamp || match.match_date) * 1000).toISOString().split('T')[0] : 'Recent',
              homeClubName: ourClub?.clubName || "Jovem Nuggs FC",
              awayClubName: opponentClub?.clubName || "Oponente",
              homeGoals: parseInt(ourClub?.goals) || 0,
              awayGoals: parseInt(opponentClub?.goals) || 0,
              result: ourClub?.result === "win" ? "W" : (ourClub?.result === "loss" ? "L" : "D"),
              teamGoals: parseInt(ourClub?.goals) || 0,
              oppGoals: parseInt(opponentClub?.goals) || 0,
              opponent: opponentClub?.clubName || "Oponente",
              playerStats: match.player_data || {}
            };
          });

          // Calcular estatísticas agregadas a partir das partidas (Fallback robusto)
          const calcStats = matches.reduce((acc, m) => {
            acc.total++;
            if (m.result === "W") acc.wins++;
            else if (m.result === "L") acc.losses++;
            else acc.draws++;
            acc.gf += m.teamGoals;
            acc.ga += m.oppGoals;
            if (m.oppGoals === 0) acc.cleanSheets++;
            return acc;
          }, { total: 0, wins: 0, losses: 0, draws: 0, gf: 0, ga: 0, cleanSheets: 0 });

          overallStats.gamesPlayed = calcStats.total;
          overallStats.wins = calcStats.wins;
          overallStats.losses = calcStats.losses;
          overallStats.draws = calcStats.draws;
          overallStats.goals = calcStats.gf;
          overallStats.conceded = calcStats.ga;
          overallStats.goalDiff = calcStats.gf - calcStats.ga;
          overallStats.cleanSheets = calcStats.cleanSheets;
          overallStats.winRate = calcStats.total > 0 ? (calcStats.wins / calcStats.total) * 100 : 0;
          overallStats.goalsPerGame = calcStats.total > 0 ? calcStats.gf / calcStats.total : 0;
          
          // Calcular estatísticas de membros a partir do histórico de partidas
          const playerMap = new Map<string, any>();
          ourProMatches.forEach((m: any) => {
            if (m.player_data) {
              Object.entries(m.player_data).forEach(([name, stats]: [string, any]) => {
                if (!playerMap.has(name)) {
                  playerMap.set(name, { name, games: 0, goals: 0, assists: 0, ratingSum: 0, position: stats.pos || "N/A" });
                }
                const p = playerMap.get(name);
                p.games++;
                p.goals += parseInt(stats.goals) || 0;
                p.assists += parseInt(stats.assists) || 0;
                p.ratingSum += parseFloat(stats.rating) || 0;
              });
            }
          });
          memberStats = Array.from(playerMap.values()).map(p => ({
            ...p,
            rating: p.games > 0 ? p.ratingSum / p.games : 0
          })).sort((a, b) => b.rating - a.rating);
        }
      } catch (error) { console.error("Erro ao buscar OurProClub matches:", error); }

      // 2. Buscar dados complementares do Pro Clubs Tracker (Fonte Secundária para Skill Rating e Dados Oficiais)
      try {
        const html = await fetchData(proClubsTrackerUrl, { responseType: 'text' }, null);
        if (html) {
          const $ = cheerio.load(html);
          const nextData = $('#__NEXT_DATA__').html();
          if (nextData) {
            try {
              const parsed = JSON.parse(nextData);
              const props = parsed.props?.pageProps || {};
              const club = props.club || {};
              if (club.skillRating) clubInfo.skillRating = club.skillRating;
              // Se o Tracker tiver dados mais completos de histórico total, usamos eles
              if (club.wins > overallStats.wins) {
                overallStats.wins = club.wins;
                overallStats.draws = club.ties;
                overallStats.losses = club.losses;
                overallStats.gamesPlayed = overallStats.wins + overallStats.draws + overallStats.losses;
                overallStats.goals = club.goals || overallStats.goals;
                overallStats.conceded = club.goalsAgainst || overallStats.conceded;
                overallStats.cleanSheets = club.cleanSheets || overallStats.cleanSheets;
              }
            } catch (e) {}
          }
        }
      } catch (error) { console.error("Erro ao processar Pro Clubs Tracker:", error); }

      return { clubInfo, overallStats, memberStats, matches: matches.slice(0, 30), timestamp: Date.now() };
    }),
  }),
});

const app = express();
app.use(express.json());
app.use("/api/trpc", createExpressMiddleware({ router: appRouter }));
export default app;
