import { initTRPC } from "@trpc/server";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import superjson from "superjson";
import axios from "axios";
import * as cheerio from "cheerio";

const CLUB_ID = "8044401";
const OURPRO_PLATFORM = "ps5"; // OurProClub Platform
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos de cache
const cache = new Map<string, { data: any; timestamp: number }>();

async function fetchData(url: string, options: any = {}, fallback: any = null) {
  const cacheKey = url + JSON.stringify(options);
  const cached = cache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    console.log(`Cache hit for ${url}`);
    return cached.data;
  }

  try {
    const response = await axios.get(url, {
      ...options,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        ...(options.headers || {})
      }
    });
    const data = response.data;
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error(`Erro ao buscar ${url}:`, error);
    return fallback;
  }
}

const t = initTRPC.create({ transformer: superjson });
const router = t.router;
const publicProcedure = t.procedure;

const appRouter = router({
  club: router({
    getData: publicProcedure.query(async () => {
      const proClubsTrackerUrl = `https://proclubstracker.com/club/${CLUB_ID}?platform=common-gen5&div=5`;
      const ourProClubMatchHistoryUrl = `https://api.ourproclub.app/api/match/history?clubId=${CLUB_ID}`;

      let clubInfo: any = {};
      let overallStats: any = {};
      let memberStats: any[] = [];
      let matches: any[] = [];

      // 1. Scrapear dados do Pro Clubs Tracker
      try {
        const html = await fetchData(proClubsTrackerUrl, {}, null);
        if (html) {
          const $ = cheerio.load(html);

          // Extrair Club Info
          clubInfo.clubName = $("h1").text().trim();
          clubInfo.division = $(".club-stats-header .division-badge").text().trim();
          clubInfo.skillRating = parseInt($(".club-stats-header .sr-badge").text().replace("SR:", "").trim()) || 0;
          const recordText = $(".club-stats-header .record").text().trim();
          const recordParts = recordText.split("W").map(s => s.trim().replace("D", "").replace("L", "")).filter(Boolean).map(Number);
          clubInfo.wins = recordParts[0] || 0;
          clubInfo.draws = recordParts[1] || 0;
          clubInfo.losses = recordParts[2] || 0;

          // Extrair Overall Stats
          overallStats.gamesPlayed = clubInfo.wins + clubInfo.draws + clubInfo.losses;
          overallStats.wins = clubInfo.wins;
          overallStats.draws = clubInfo.draws;
          overallStats.losses = clubInfo.losses;
          overallStats.winRate = parseFloat($("div:contains(\"Win Rate\")").next().text().replace("%", "")) || 0;
          overallStats.goals = parseInt($("div:contains(\"Goals\")").next().text()) || 0;
          overallStats.conceded = parseInt($("div:contains(\"Conceded\")").next().text()) || 0;
          overallStats.goalDiff = parseInt($("div:contains(\"Goal Diff\")").next().text()) || 0;
          overallStats.goalsPerGame = parseFloat($("div:contains(\"Goals/Game\")").next().text()) || 0;
          overallStats.concededPerGame = parseFloat($("div:contains(\"Conceded/Game\")").next().text()) || 0;
          overallStats.cleanSheets = parseInt($("div:contains(\"Clean Sheets\")").next().text()) || 0;
          overallStats.currentStreak = $("div:contains(\"Current Streak\")").next().text().trim() || "";
          overallStats.promotions = parseInt($("div:contains(\"Promotions\")").next().text()) || 0;
          overallStats.relegations = parseInt($("div:contains(\"Relegations\")").next().text()) || 0;

          // Extrair Member Stats (exemplo, pode precisar de mais refinamento)
          // Iterar sobre a tabela de jogadores
          $("table.player-stats-table tbody tr").each((i, element) => {
            const player: any = {};
            player.name = $(element).find("td:nth-child(1)").text().trim();
            player.games = parseInt($(element).find("td:nth-child(2)").text()) || 0;
            player.goals = parseInt($(element).find("td:nth-child(3)").text()) || 0;
            player.assists = parseInt($(element).find("td:nth-child(4)").text()) || 0;
            player.rating = parseFloat($(element).find("td:nth-child(5)").text()) || 0;
            memberStats.push(player);
          });
        }
      } catch (error) {
        console.error("Erro ao scrapear Pro Clubs Tracker:", error);
      }

      // 2. Buscar histórico de partidas do OurProClub API
      try {
        const ourProMatches = await fetchData(ourProClubMatchHistoryUrl, {}, []);
        matches = ourProMatches.map((match: any) => ({
          matchId: match.matchId,
          timestamp: match.timestamp,
          homeClubName: match.homeClubName,
          awayClubName: match.awayClubName,
          homeGoals: match.homeGoals,
          awayGoals: match.awayGoals,
          result: match.result, // "win", "loss", "draw"
          // Adicione outros campos relevantes do OurProClub se necessário
        }));
      } catch (error) {
        console.error("Erro ao buscar histórico de partidas do OurProClub:", error);
      }

      return {
        clubInfo,
        overallStats,
        memberStats,
        matches,
        timestamp: Date.now()
      };
    }),
  }),
});

const app = express();
app.use(express.json());
app.use("/api/trpc", createExpressMiddleware({ router: appRouter }));

export default app;
