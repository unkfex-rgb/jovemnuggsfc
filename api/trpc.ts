import { initTRPC } from "@trpc/server";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import superjson from "superjson";

const CLUB_ID = "8044401";
const PLATFORM = "common-gen5"; // EA Platform
const OURPRO_PLATFORM = "ps5"; // OurProClub Platform
const CACHE_TTL = 5 * 60 * 1000;
const cache = new Map<string, { data: any; timestamp: number }>();

async function fetchWithRetry(url: string, options: any = {}, fallback: any = null) {
  const cacheKey = url + JSON.stringify(options);
  const cached = cache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    return cached.data;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        ...(options.headers || {})
      }
    });
    if (!response.ok) throw new Error(`Status: ${response.status}`);
    const data = await response.json();
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error(`Erro em ${url}:`, error);
    return fallback;
  }
}

const t = initTRPC.create({ transformer: superjson });
const router = t.router;
const publicProcedure = t.procedure;

const appRouter = router({
  club: router({
    getData: publicProcedure.query(async () => {
      const ourProBase = `https://api.ourproclub.app/api/v1`;
      const eaBase = `https://proclubs.ea.com/api/fc`;

      let clubInfo = null;
      let overallStats = null;
      let memberStats = null;
      let matches = [];

      // Tenta buscar dados do OurProClub primeiro
      try {
        const [ourProClubInfo, ourProOverallStats, ourProMemberStats, ourProLeagueMatches, ourProPlayoffMatches] = await Promise.all([
          fetchWithRetry(`${ourProBase}/clubs/info?platform=${OURPRO_PLATFORM}&clubIds=${CLUB_ID}`),
          fetchWithRetry(`${ourProBase}/clubs/overallStats?platform=${OURPRO_PLATFORM}&clubIds=${CLUB_ID}`),
          fetchWithRetry(`${ourProBase}/members/stats?platform=${OURPRO_PLATFORM}&clubId=${CLUB_ID}`),
          fetchWithRetry(`${ourProBase}/clubs/matches?platform=${OURPRO_PLATFORM}&clubIds=${CLUB_ID}&matchType=leagueMatch`),
          fetchWithRetry(`${ourProBase}/clubs/matches?platform=${OURPRO_PLATFORM}&clubIds=${CLUB_ID}&matchType=playoffMatch`),
        ]);

        if (ourProClubInfo && ourProClubInfo.length > 0) {
          clubInfo = ourProClubInfo[0];
        }
        if (ourProOverallStats && ourProOverallStats.length > 0) {
          overallStats = ourProOverallStats[0];
        }
        memberStats = ourProMemberStats;
        matches = [...(ourProLeagueMatches || []), ...(ourProPlayoffMatches || [])];

      } catch (error) {
        console.warn("Erro ao buscar dados do OurProClub, tentando EA API:", error);
      }

      // Se OurProClub não retornar dados essenciais, tenta a EA API
      if (!clubInfo || !overallStats) {
        try {
          const [eaClubInfo, eaOverallStats, eaMemberStats, eaLeagueMatches, eaPlayoffMatches] = await Promise.all([
            fetchWithRetry(`${eaBase}/clubs/info?platform=${PLATFORM}&clubIds=${CLUB_ID}`),
            fetchWithRetry(`${eaBase}/clubs/overallStats?platform=${PLATFORM}&clubIds=${CLUB_ID}`),
            fetchWithRetry(`${eaBase}/members/stats?platform=${PLATFORM}&clubId=${CLUB_ID}`),
            fetchWithRetry(`${eaBase}/clubs/matches?platform=${PLATFORM}&clubIds=${CLUB_ID}&matchType=leagueMatch&maxResultCount=20`),
            fetchWithRetry(`${eaBase}/clubs/matches?platform=${PLATFORM}&clubIds=${CLUB_ID}&matchType=playoffMatch&maxResultCount=20`),
          ]);

          if (eaClubInfo && eaClubInfo.length > 0) {
            clubInfo = eaClubInfo[0];
          }
          if (eaOverallStats && eaOverallStats.length > 0) {
            overallStats = eaOverallStats[0];
          }
          memberStats = memberStats || eaMemberStats; // Prioriza OurProClub se tiver dados
          matches = matches.length > 0 ? matches : [...(eaLeagueMatches || []), ...(eaPlayoffMatches || [])];

        } catch (error) {
          console.error("Erro ao buscar dados da EA API:", error);
        }
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
