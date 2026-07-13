import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
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
        "Accept": "application/json",
        "Referer": "https://www.ea.com/",
        "Origin": "https://www.ea.com",
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

/**
 * Mapeamento de Gamertags para nomes conhecidos.
 */
const GAMERTAG_TO_PLAYER_NAME: Record<string, string> = {
  "SCOBY NUGGET": "scobyzinn",
  "Neymar JR": "Vinim71655",
  "M. Motta": "pedrofeRLK",
  "S. Covs": "Jessysz0",
  "araujozx77_": "araujozx77_",
  "PECINHAA22": "PECINHAA22",
  "Jessysz0": "Jessysz0",
  "CELTA4656": "CELTA4656",
  "rochax07": "rochax07",
  "tavin__07": "tavin__07",
  "corintia": "corintia4i20",
  "KauÃ£": "Kauanpecinha",
  "A. 77": "araujozx77_",
  "mesquita_B12": "mesquita_B12",
  "Vinim71655": "Vinim71655",
  "pedrofeRLK": "pedrofeRLK",
};

function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function resolvePlayerName(gamertag: string, knownNames: string[] = []): string {
  const mapped = GAMERTAG_TO_PLAYER_NAME[gamertag];
  if (mapped) return mapped;

  const normalized = normalizeString(gamertag);
  for (const name of knownNames) {
    if (normalized === normalizeString(name)) return name;
  }
  return gamertag;
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  club: router({
    getData: publicProcedure.query(async () => {
      const platform = "common-gen5";
      const eaClubInfoUrl = `https://proclubs.ea.com/api/fc/clubs/info?platform=${platform}&clubIds=${CLUB_ID}`;
      const eaMemberStatsUrl = `https://proclubs.ea.com/api/fc/members/stats?platform=${platform}&clubId=${CLUB_ID}`;
      const eaSeasonalStatsUrl = `https://proclubs.ea.com/api/fc/clubs/seasonalStats?platform=${platform}&clubIds=${CLUB_ID}`;
      const ourProClubMatchHistoryUrl = `https://api.ourproclub.app/api/match/history?clubId=${CLUB_ID}`;

      let clubInfo: any = { clubName: "Jovem Nuggs FC", division: "3", skillRating: 0, wins: 0, draws: 0, losses: 0 };
      let overallStats: any = { gamesPlayed: 0, wins: 0, draws: 0, losses: 0, winRate: 0, goals: 0, conceded: 0, goalDiff: 0, goalsPerGame: 0, concededPerGame: 0, cleanSheets: 0, currentStreak: "", promotions: 0, relegations: 0 };
      let memberStats: any[] = [];
      let matches: any[] = [];

      // 1. Buscar dados oficiais da EA API (Espelhamento Direto)
      try {
        const eaInfo = await fetchData(eaClubInfoUrl);
        if (eaInfo && eaInfo[CLUB_ID]) {
          clubInfo.clubName = eaInfo[CLUB_ID].name;
        }

        const eaSeasonal = await fetchData(eaSeasonalStatsUrl);
        if (eaSeasonal && Array.isArray(eaSeasonal) && eaSeasonal.length > 0) {
          const stats = eaSeasonal[0];
          overallStats.wins = parseInt(stats.wins) || 0;
          overallStats.losses = parseInt(stats.losses) || 0;
          overallStats.draws = parseInt(stats.ties) || 0;
          overallStats.gamesPlayed = overallStats.wins + overallStats.losses + overallStats.draws;
          overallStats.goals = parseInt(stats.goals) || 0;
          overallStats.conceded = parseInt(stats.goalsAgainst) || 0;
          overallStats.goalDiff = overallStats.goals - overallStats.conceded;
          overallStats.cleanSheets = parseInt(stats.cleanSheets) || 0;
          overallStats.winRate = overallStats.gamesPlayed > 0 ? (overallStats.wins / overallStats.gamesPlayed) * 100 : 0;
          clubInfo.skillRating = parseInt(stats.skillRating) || 0;
        }

        const eaMembers = await fetchData(eaMemberStatsUrl);
        if (eaMembers && Array.isArray(eaMembers.members)) {
          memberStats = eaMembers.members.map((m: any) => ({
            name: m.name,
            proName: m.proName,
            games: parseInt(m.gamesPlayed) || 0,
            goals: parseInt(m.goals) || 0,
            assists: parseInt(m.assists) || 0,
            rating: parseFloat(m.ratingAve) || 0,
            position: m.favoritePosition || "N/A",
            winRate: parseInt(m.winRate) || 0,
            passPercentage: parseInt(m.passSuccessRate) || 0,
            shotPercentage: parseInt(m.shotSuccessRate) || 0,
            overallRating: parseInt(m.proOverall) || 0,
            motm: parseInt(m.manOfTheMatch) || 0,
            cleanSheets: (parseInt(m.cleanSheetsDef) || 0) + (parseInt(m.cleanSheetsGK) || 0)
          })).sort((a: any, b: any) => b.rating - a.rating);
        }
      } catch (e) {
        console.error("Erro ao buscar dados da EA API:", e);
      }

      // 2. Buscar histórico de partidas da OurProClub API (Para detalhes de partidas recentes)
      try {
        const ourProMatches = await fetchData(ourProClubMatchHistoryUrl, {}, []);
        if (Array.isArray(ourProMatches)) {
          matches = ourProMatches.map((match: any) => {
            const ourClub = match.match_data?.clubs?.[CLUB_ID];
            const opponentClub = Object.values(match.match_data?.clubs || {}).find((c: any) => c.clubId !== CLUB_ID) as any;
            const teamGoals = parseInt(ourClub?.goals) || 0;
            const oppGoals = parseInt(opponentClub?.goals) || 0;
            let result = teamGoals > oppGoals ? "W" : (teamGoals < oppGoals ? "L" : "D");
            const opponentName = opponentClub?.clubName || "Adversário";

            return {
              matchId: match.match_data?.matchId || match.id?.toString(),
              timestamp: match.match_data?.timestamp || match.match_date,
              date: new Date((match.match_data?.timestamp || match.match_date) * 1000).toISOString().split('T')[0],
              homeClubName: ourClub?.clubName || "Jovem Nuggs FC",
              awayClubName: opponentName,
              homeGoals: teamGoals,
              awayGoals: oppGoals,
              result: result,
              opponent: opponentName
            };
          });
        }
      } catch (e) { console.error(e); }

      return { clubInfo, overallStats, memberStats, matches: matches.slice(0, 30), timestamp: Date.now() };
    }),
  }),
});

export type AppRouter = typeof appRouter;
