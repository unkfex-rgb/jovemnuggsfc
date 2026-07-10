import { initTRPC } from "@trpc/server";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import superjson from "superjson";

// Configurações Oficiais EA
const CLUB_ID = "8044401";
const PLATFORM = "common-gen5";
const EA_API_BASE = "https://proclubs.ea.com/api/fc";
const CACHE_TTL = 5 * 60 * 1000;
const cache = new Map<string, { data: any; timestamp: number }>();

async function fetchWithCache(url: string, cacheKey: string, fallback: any = []) {
  const cached = cache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    return cached.data;
  }

  try {
    const response = await fetch(url);
    if (response.status === 403 && url.includes("proclubs.ea.com")) {
      // Fallback para OurProClub se a EA bloquear o Vercel
      const ourProUrl = url.replace("https://proclubs.ea.com/api/fc", "https://api.ourproclub.app/api")
                           .replace("common-gen5", "ps5"); // Ajuste de plataforma se necessário
      const fallbackRes = await fetch(ourProUrl);
      if (fallbackRes.ok) return await fallbackRes.json();
    }
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error(`Erro ao buscar ${url}:`, error);
    if (cached) return cached.data;
    return fallback;
  }
}

// 100% Self-contained API to avoid Vercel ESM resolution issues
const t = initTRPC.create({
  transformer: superjson,
});

const router = t.router;
const publicProcedure = t.procedure;

const appRouter = router({
  system: router({
    health: publicProcedure.query(() => ({ status: "ok" })),
  }),
  club: router({
    getData: publicProcedure.query(async () => {
      try {
        const [clubInfo, overallStats, memberStats, leagueMatches, playoffMatches] = await Promise.all([
          fetchWithCache(`${EA_API_BASE}/clubs/info?platform=${PLATFORM}&clubIds=${CLUB_ID}`, `club_info_${CLUB_ID}`),
          fetchWithCache(`${EA_API_BASE}/clubs/overallStats?platform=${PLATFORM}&clubIds=${CLUB_ID}`, `overall_stats_${CLUB_ID}`),
          fetchWithCache(`${EA_API_BASE}/members/stats?platform=${PLATFORM}&clubId=${CLUB_ID}`, `member_stats_${CLUB_ID}`),
          fetchWithCache(`${EA_API_BASE}/clubs/matches?platform=${PLATFORM}&clubIds=${CLUB_ID}&matchType=leagueMatch&maxResultCount=20`, `league_matches_${CLUB_ID}`),
          fetchWithCache(`${EA_API_BASE}/clubs/matches?platform=${PLATFORM}&clubIds=${CLUB_ID}&matchType=playoffMatch&maxResultCount=20`, `playoff_matches_${CLUB_ID}`),
        ]);

        let trackerData = null;
        try {
          const trackerResponse = await fetch(`https://proclubstracker.com/api/clubs/${CLUB_ID}?platform=${PLATFORM}`, {
            headers: { "User-Agent": "Mozilla/5.0" }
          });
          if (trackerResponse.ok) {
            trackerData = await trackerResponse.json();
          }
        } catch (e) {
          console.warn("Tracker API indisponível.");
        }

        return {
          clubInfo,
          overallStats,
          memberStats,
          matches: [...(leagueMatches || []), ...(playoffMatches || [])],
          trackerData,
          timestamp: Date.now()
        };
      } catch (error) {
        console.error("Erro fatal no agregador:", error);
        throw error;
      }
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
