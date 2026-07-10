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

      try {
        const html = await fetchData(proClubsTrackerUrl, { responseType: 'text' }, null);
        if (html) {
          const $ = cheerio.load(html);
          
          // Tentar extrair dados do script Next.js (mais confiável que o HTML renderizado)
          const nextData = $('#__NEXT_DATA__').html();
          if (nextData) {
            try {
              const parsed = JSON.parse(nextData);
              const props = parsed.props?.pageProps || {};
              const club = props.club || {};
              
              clubInfo.skillRating = club.skillRating || 0;
              clubInfo.wins = overallStats.wins = club.wins || 0;
              clubInfo.draws = overallStats.draws = club.ties || 0;
              clubInfo.losses = overallStats.losses = club.losses || 0;
              overallStats.gamesPlayed = overallStats.wins + overallStats.draws + overallStats.losses;
              overallStats.goals = club.goals || 0;
              overallStats.conceded = club.goalsAgainst || 0;
              overallStats.cleanSheets = club.cleanSheets || 0;
              
              if (props.memberStats?.members) {
                memberStats = props.memberStats.members.map((m: any) => ({
                  name: m.name,
                  games: parseInt(m.gamesPlayed) || 0,
                  goals: parseInt(m.goals) || 0,
                  assists: parseInt(m.assists) || 0,
                  rating: parseFloat(m.ratingAve) || 0,
                  position: m.favoritePosition || "N/A"
                }));
              }
            } catch (e) { console.error("Erro ao parsear NEXT_DATA:", e); }
          }

          // Fallback para seletores manuais se NEXT_DATA falhar
          if (overallStats.gamesPlayed === 0) {
            const srText = $("span:contains('SR:')").text().replace("SR:", "").trim();
            clubInfo.skillRating = parseInt(srText) || 0;
            
            $("div.bg-gray-800.rounded-lg.p-4").each((i, el) => {
              const label = $(el).find("div.text-gray-400").text().trim().toLowerCase();
              const value = $(el).find("div.text-2xl.font-bold").text().trim();
              if (label.includes("goals") && !label.includes("/")) overallStats.goals = parseInt(value) || 0;
              if (label.includes("conceded") && !label.includes("/")) overallStats.conceded = parseInt(value) || 0;
              if (label.includes("clean sheets")) overallStats.cleanSheets = parseInt(value) || 0;
              if (label.includes("streak")) overallStats.currentStreak = value;
            });
          }
          
          overallStats.goalDiff = overallStats.goals - overallStats.conceded;
          overallStats.winRate = overallStats.gamesPlayed > 0 ? (overallStats.wins / overallStats.gamesPlayed) * 100 : 0;
          overallStats.goalsPerGame = overallStats.gamesPlayed > 0 ? overallStats.goals / overallStats.gamesPlayed : 0;
          overallStats.concededPerGame = overallStats.gamesPlayed > 0 ? overallStats.conceded / overallStats.gamesPlayed : 0;
        }
      } catch (error) { console.error("Erro ao processar Pro Clubs Tracker:", error); }

      try {
        const ourProMatches = await fetchData(ourProClubMatchHistoryUrl, {}, []);
        if (Array.isArray(ourProMatches)) {
          matches = ourProMatches.slice(0, 30).map((match: any) => {
            const ourClub = match.match_data?.clubs?.[CLUB_ID];
            const opponentClub = Object.values(match.match_data?.clubs || {}).find((c: any) => c.clubId !== CLUB_ID) as any;
            return {
              matchId: match.match_data?.matchId || Math.random().toString(36),
              timestamp: match.match_data?.timestamp || Date.now() / 1000,
              date: match.match_data?.timestamp ? new Date(match.match_data.timestamp * 1000).toISOString().split('T')[0] : '',
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
        }
      } catch (error) { console.error("Erro ao buscar OurProClub matches:", error); }

      return { clubInfo, overallStats, memberStats, matches, timestamp: Date.now() };
    }),
  }),
});

const app = express();
app.use(express.json());
app.use("/api/trpc", createExpressMiddleware({ router: appRouter }));
export default app;
