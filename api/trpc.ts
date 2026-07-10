import { initTRPC } from "@trpc/server";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import superjson from "superjson";
import axios from "axios";
import * as cheerio from "cheerio";

const CLUB_ID = "8044401";
const OURPRO_PLATFORM = "ps5"; // OurProClub Platform
const CACHE_TTL = 5 * 60 * 1000;
const cache = new Map<string, { data: any; timestamp: number }>();

async function fetchData(url: string, options: any = {}, fallback: any = null) {
  const cacheKey = url + JSON.stringify(options);
  const cached = cache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
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

      let clubInfo = {};
      let overallStats = {};
      let memberStats = [];
      let matches = [];

      // 1. Scrapear dados do Pro Clubs Tracker
      try {
        const html = await fetchData(proClubsTrackerUrl, {}, null);
        if (html) {
          const $ = cheerio.load(html);

          // Extrair Club Info
          const clubName = $('h1').text().trim();
          const division = $('.club-stats-header .division-badge').text().trim();
          const skillRating = $('.club-stats-header .sr-badge').text().replace('SR:', '').trim();
          const recordText = $('.club-stats-header .record').text().trim();
          const [wins, draws, losses] = recordText.split('W').map(s => s.trim().replace('D', '').replace('L', '')).filter(Boolean).map(Number);

          clubInfo = {
            clubName,
            division,
            skillRating: parseInt(skillRating),
            wins,
            draws,
            losses,
          };

          // Extrair Overall Stats (exemplo, pode precisar de mais refinamento)
          overallStats = {
            gamesPlayed: wins + draws + losses,
            wins,
            draws,
            losses,
            winRate: parseFloat($('div:contains("Win Rate")').next().text().replace('%', '')),
            goals: parseInt($('div:contains("Goals")').next().text()),
            conceded: parseInt($('div:contains("Conceded")').next().text()),
            goalDiff: parseInt($('div:contains("Goal Diff")').next().text()),
            goalsPerGame: parseFloat($('div:contains("Goals/Game")').next().text()),
            concededPerGame: parseFloat($('div:contains("Conceded/Game")').next().text()),
            cleanSheets: 0, // Não disponível diretamente no scraping, manter 0 ou buscar de outra forma
            currentStreak: $('div:contains("Current Streak")').next().text().trim(),
            promotions: parseInt($('div:contains("Promotions")').next().text()),
            relegations: parseInt($('div:contains("Relegations")').next().text()),
          };

          // Extrair Member Stats (exemplo, pode precisar de mais refinamento)
          // Esta parte é mais complexa e pode exigir iteração sobre tabelas ou listas de jogadores
          // Por enquanto, deixaremos como um array vazio ou com dados mockados se necessário
          memberStats = []; // Implementar scraping de jogadores se necessário
        }
      } catch (error) {
        console.error("Erro ao scrapear Pro Clubs Tracker:", error);
      }

      // 2. Buscar histórico de partidas do OurProClub API
      try {
        const ourProMatches = await fetchData(ourProClubMatchHistoryUrl, {}, []);
        matches = ourProMatches;
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
