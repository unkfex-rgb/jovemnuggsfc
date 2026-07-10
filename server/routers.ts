import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

const CLUB_ID = "8044401";
const PLATFORM = "common-gen5";
const EA_API_BASE = "https://proclubs.ea.com/api/fc";

// Cache simples em memória
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

async function fetchWithCache(url: string, cacheKey: string) {
  const cached = cache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    return cached.data;
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json"
      }
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error(`Erro ao buscar ${url}:`, error);
    // Em caso de erro, tentar retornar o último dado em cache se existir
    if (cached) {
      console.warn(`Retornando dados em cache para ${cacheKey} devido a erro na API externa.`);
      return cached.data;
    }
    throw error; // Se não houver cache, propaga o erro
  }
}

async function fetchClubInfo() {
  return fetchWithCache(`${EA_API_BASE}/clubs/info?platform=${PLATFORM}&clubIds=${CLUB_ID}`, `club_info_${CLUB_ID}`);
}

async function fetchOverallStats() {
  return fetchWithCache(`${EA_API_BASE}/clubs/overallStats?platform=${PLATFORM}&clubIds=${CLUB_ID}`, `overall_stats_${CLUB_ID}`);
}

async function fetchMemberStats() {
  return fetchWithCache(`${EA_API_BASE}/members/stats?platform=${PLATFORM}&clubId=${CLUB_ID}`, `member_stats_${CLUB_ID}`);
}

async function fetchMemberCareerStats() {
  return fetchWithCache(`${EA_API_BASE}/members/career/stats?platform=${PLATFORM}&clubId=${CLUB_ID}`, `member_career_stats_${CLUB_ID}`);
}

async function fetchLeagueMatches() {
  return fetchWithCache(`${EA_API_BASE}/clubs/matches?platform=${PLATFORM}&clubIds=${CLUB_ID}&matchType=leagueMatch&maxResultCount=20`, `league_matches_${CLUB_ID}`);
}

async function fetchPlayoffMatches() {
  return fetchWithCache(`${EA_API_BASE}/clubs/matches?platform=${PLATFORM}&clubIds=${CLUB_ID}&matchType=playoffMatch&maxResultCount=20`, `playoff_matches_${CLUB_ID}`);
}

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
    clubInfo: publicProcedure.query(async () => {
      return await fetchClubInfo();
    }),
    overallStats: publicProcedure.query(async () => {
      return await fetchOverallStats();
    }),
    memberStats: publicProcedure.query(async () => {
      return await fetchMemberStats();
    }),
    memberCareerStats: publicProcedure.query(async () => {
      return await fetchMemberCareerStats();
    }),
    leagueMatches: publicProcedure.query(async () => {
      return await fetchLeagueMatches();
    }),
    playoffMatches: publicProcedure.query(async () => {
      return await fetchPlayoffMatches();
    }),
  }),
});

export type AppRouter = typeof appRouter;
