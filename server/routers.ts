import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import axios from "axios";
import * as cheerio from "cheerio";
import { scrapeProClubsPlayers } from "./scrapers/proClubsTracker";

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
      const proClubsTrackerUrl = `https://proclubstracker.com/club/${CLUB_ID}?platform=common-gen5&div=5`;
      const ourProClubMatchHistoryUrl = `https://api.ourproclub.app/api/match/history?clubId=${CLUB_ID}`;

      let clubInfo: any = { clubName: "Jovem Nuggs FC", division: "5", skillRating: 0, wins: 0, draws: 0, losses: 0 };
      let overallStats: any = { gamesPlayed: 0, wins: 0, draws: 0, losses: 0, winRate: 0, goals: 0, conceded: 0, goalDiff: 0, goalsPerGame: 0, concededPerGame: 0, cleanSheets: 0, currentStreak: "", promotions: 0, relegations: 0 };
      let memberStats: any[] = [];
      let matches: any[] = [];
      let scrapedPlayers: any[] = [];

      try {
        const ourProMatches = await fetchData(ourProClubMatchHistoryUrl, {}, []);
        if (Array.isArray(ourProMatches)) {
          matches = ourProMatches.map((match: any) => {
            const ourClub = match.match_data?.clubs?.[CLUB_ID];
            const opponentClub = Object.values(match.match_data?.clubs || {}).find((c: any) => c.clubId !== CLUB_ID) as any;
            
            const teamGoals = parseInt(ourClub?.goals) || 0;
            const oppGoals = parseInt(opponentClub?.goals) || 0;
            
            // BUG FIX #1: Calcular resultado comparando gols (não depender do campo result da API)
            let result = "D"; // Default: empate
            if (teamGoals > oppGoals) result = "W";
            else if (teamGoals < oppGoals) result = "L";
            
            // BUG FIX #4: Validar nome do adversário
            const opponentName = opponentClub?.clubName && opponentClub.clubName !== "Jovem Nuggs FC" && opponentClub.clubName?.trim() 
              ? opponentClub.clubName 
              : "Adversário não informado";
            
            return {
              matchId: match.match_data?.matchId || match.id?.toString() || Math.random().toString(36),
              timestamp: match.match_data?.timestamp || match.match_date || Date.now() / 1000,
              date: (match.match_data?.timestamp || match.match_date) ? new Date((match.match_data?.timestamp || match.match_date) * 1000).toISOString().split('T')[0] : 'Recent',
              homeClubName: ourClub?.clubName || "Jovem Nuggs FC",
              awayClubName: opponentName,
              homeGoals: teamGoals,
              awayGoals: oppGoals,
              result: result,
              teamGoals: teamGoals,
              oppGoals: oppGoals,
              opponent: opponentName,
              playerStats: match.player_data || {}
            };
          });

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

          // BUG FIX #6: Calcular sequência atual e melhor sequência
          let currentStreakObj = { type: null, count: 0 };
          let bestStreakCount = 0;
          
          if (matches.length > 0) {
            // Sequência atual (de trás para frente)
            let tempType = matches[matches.length - 1].result;
            let tempCount = 1;
            for (let i = matches.length - 2; i >= 0; i--) {
              if (matches[i].result === tempType) {
                tempCount++;
              } else {
                break;
              }
            }
            currentStreakObj = { type: tempType, count: tempCount };
            
            // Melhor sequência (iterar por todas)
            let maxCount = 0;
            let currentType = matches[0].result;
            let count = 1;
            for (let i = 1; i < matches.length; i++) {
              if (matches[i].result === currentType) {
                count++;
              } else {
                maxCount = Math.max(maxCount, count);
                currentType = matches[i].result;
                count = 1;
              }
            }
            maxCount = Math.max(maxCount, count);
            bestStreakCount = maxCount;
          }

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
          overallStats.currentStreak = currentStreakObj;
          overallStats.bestStreak = bestStreakCount;
          
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
      } catch (e) { console.error(e); }

      // Buscar dados dos jogadores via scraping do Pro Clubs Tracker
      try {
        scrapedPlayers = await scrapeProClubsPlayers(CLUB_ID);
        // Converter dados do scraper para o formato esperado
        memberStats = scrapedPlayers.map((p: any) => ({
          name: p.name,
          games: p.games || 0,
          goals: p.goals || 0,
          assists: p.assists || 0,
          ratingSum: (p.rating || 0) * (p.games || 1),
          position: p.position || "N/A",
          rating: p.rating || 0
        })).sort((a: any, b: any) => b.rating - a.rating);
      } catch (e) {
        console.error("Erro ao fazer scraping dos jogadores:", e);
      }

      // Tentar obter dados adicionais do club info via HTML do Pro Clubs Tracker
      try {
        const html = await fetchData(proClubsTrackerUrl, { responseType: 'text' }, null);
        if (html) {
          const $ = cheerio.load(html);
          // Procurar por dados do clube no HTML renderizado
          // Skill Rating
          const skillRatingText = $("p:contains('Skill Rating')").prev().text().trim();
          if (skillRatingText) {
            clubInfo.skillRating = parseInt(skillRatingText) || 0;
          }
          // Wins, Draws, Losses
          const winsText = $("p:contains('Wins')").prev().text().trim();
          const drawsText = $("p:contains('Draws')").prev().text().trim();
          const lossesText = $("p:contains('Losses')").prev().text().trim();
          if (winsText) overallStats.wins = parseInt(winsText) || overallStats.wins;
          if (drawsText) overallStats.draws = parseInt(drawsText) || overallStats.draws;
          if (lossesText) overallStats.losses = parseInt(lossesText) || overallStats.losses;
          overallStats.gamesPlayed = overallStats.wins + overallStats.draws + overallStats.losses;
        }
      } catch (e) {
        console.error("Erro ao buscar dados adicionais do Pro Clubs Tracker:", e);
      }

      return { clubInfo, overallStats, memberStats, matches: matches.slice(0, 30), timestamp: Date.now() };
    }),
  }),
});

export type AppRouter = typeof appRouter;
