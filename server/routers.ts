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
 * Mapeamento de Gamertags do Pro Clubs Tracker para nomes conhecidos da API OurProClub.
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
    const gamertagParts = normalized.split(/[\s_\-]+/);
    const nameParts = normalizeString(name).split(/[\s_\-]+/);
    for (const part of gamertagParts) {
      if (part.length > 2 && nameParts.some(p => p.includes(part) || p.startsWith(part))) {
        return name;
      }
    }
  }
  return gamertag;
}

/**
 * Dados embutidos dos jogadores do Pro Clubs Tracker (fallback).
 * Capturados manualmente da aba Players: https://proclubstracker.com/club/8044401
 */
const PROCLUB_PLAYERS_FALLBACK = [
  { gamertag: "Neymar JR", playerName: "Vinim71655", position: "midfielder", overallRating: 88, avgRating: 7.7, games: 75, goals: 10, assists: 26, motm: 14, winRate: 50, passPercentage: 82, shotPercentage: 34 },
  { gamertag: "M. Motta", playerName: "pedrofeRLK", position: "defender", overallRating: 76, avgRating: 7.1, games: 72, goals: 12, assists: 20, motm: 13, winRate: 50, passPercentage: 75, shotPercentage: 15, cleanSheets: 15 },
  { gamertag: "S. Covs", playerName: "Jessysz0", position: "midfielder", overallRating: 85, avgRating: 7.6, games: 30, goals: 29, assists: 25, motm: 11, winRate: 60, passPercentage: 79, shotPercentage: 45 },
  { gamertag: "k. KEVIN BV", playerName: "Dghs100", position: "defender", overallRating: 84, avgRating: 6.2, games: 12, goals: 2, assists: 0, motm: 0, winRate: 75, passPercentage: 63, shotPercentage: 40, cleanSheets: 4 },
  { gamertag: "C. Xavier", playerName: "tavin__07", position: "goalkeeper", overallRating: 88, avgRating: 7.3, games: 31, goals: 16, assists: 8, motm: 5, winRate: 61, passPercentage: 81, shotPercentage: 53, cleanSheets: 7 },
  { gamertag: "SCOBY NUGGET", playerName: "scobyzinn", position: "defender", overallRating: 76, avgRating: 5.7, games: 45, goals: 5, assists: 2, motm: 3, winRate: 55, passPercentage: 75, shotPercentage: 15, cleanSheets: 11 },
  { gamertag: "biel", playerName: "kevenmimdimdsimi", position: "defender", overallRating: 78, avgRating: 6.5, games: 56, goals: 14, assists: 13, motm: 2, winRate: 30, passPercentage: 75, shotPercentage: 18, cleanSheets: 1 },
  { gamertag: "Kaka", playerName: "perfume67", position: "defender", overallRating: 80, avgRating: 6.9, games: 22, goals: 8, assists: 2, motm: 2, winRate: 36, passPercentage: 79, shotPercentage: 25, cleanSheets: 1 },
  { gamertag: "corintia", playerName: "corintia4i20", position: "midfielder", overallRating: 86, avgRating: 6.7, games: 92, goals: 11, assists: 24, motm: 0, winRate: 44, passPercentage: 77, shotPercentage: 18 },
  { gamertag: "a", playerName: "LLxTatsuo", position: "defender", overallRating: 87, avgRating: 6.8, games: 33, goals: 18, assists: 18, motm: 4, winRate: 33, passPercentage: 76, shotPercentage: 32, cleanSheets: 1 },
  { gamertag: "crioulo", playerName: "eozafe", position: "forward", overallRating: 81, avgRating: 7.3, games: 4, goals: 2, assists: 1, motm: 0, winRate: 75, passPercentage: 71, shotPercentage: 22 },
  { gamertag: "mSq", playerName: "mesquita_B12", position: "defender", overallRating: 79, avgRating: 7.1, games: 10, goals: 6, assists: 4, motm: 1, winRate: 40, passPercentage: 68, shotPercentage: 31, cleanSheets: 1 },
  { gamertag: "P. PECINHA", playerName: "PECINHAA22", position: "forward", overallRating: 85, avgRating: 6.9, games: 50, goals: 49, assists: 10, motm: 5, winRate: 48, passPercentage: 83, shotPercentage: 46 },
  { gamertag: "valdirene", playerName: "Dghs100", position: "goalkeeper", overallRating: 95, avgRating: 5.7, games: 45, goals: 0, assists: 0, motm: 0, winRate: 37, passPercentage: 86, shotPercentage: 0, cleanSheets: 6 },
  { gamertag: "KauÃ£", playerName: "Kauanpecinha", position: "midfielder", overallRating: 80, avgRating: 6.3, games: 57, goals: 14, assists: 10, motm: 1, winRate: 31, passPercentage: 70, shotPercentage: 21 },
  { gamertag: "Lucas", playerName: "KZNNXZ", position: "defender", overallRating: 88, avgRating: 7.7, games: 16, goals: 11, assists: 11, motm: 4, winRate: 68, passPercentage: 82, shotPercentage: 44, cleanSheets: 3 },
  { gamertag: "zk", playerName: "matzindela", position: "defender", overallRating: 75, avgRating: 6.8, games: 11, goals: 0, assists: 0, motm: 1, winRate: 18, passPercentage: 77, shotPercentage: 0, cleanSheets: 1 },
  { gamertag: "p. higher", playerName: "CELTA4656", position: "defender", overallRating: 80, avgRating: 5.9, games: 56, goals: 13, assists: 11, motm: 3, winRate: 35, passPercentage: 79, shotPercentage: 25, cleanSheets: 1 },
  { gamertag: "A. 77", playerName: "araujozx77_", position: "defender", overallRating: 85, avgRating: 6.3, games: 113, goals: 33, assists: 27, motm: 1, winRate: 42, passPercentage: 74, shotPercentage: 17, cleanSheets: 2 },
  { gamertag: "Matheus", playerName: "rochax07", position: "defender", overallRating: 87, avgRating: 6.8, games: 43, goals: 9, assists: 11, motm: 1, winRate: 37, passPercentage: 76, shotPercentage: 32, cleanSheets: 2 },
];

/**
 * Combina dados de membros da API OurProClub com dados do Pro Clubs Tracker.
 * Usa os nomes da API (Nome do Jogador) e enriquece com dados do Tracker.
 */
function combinePlayerData(apiMemberStats: any[], trackerPlayers: any[]): any[] {
  if (trackerPlayers.length === 0) {
    return apiMemberStats;
  }

  const knownNames = apiMemberStats.map((p: any) => p.name);
  const resolvedTrackerMap = new Map<string, any>();
  trackerPlayers.forEach((tp) => {
    const resolvedName = resolvePlayerName(tp.gamertag, knownNames);
    if (!resolvedTrackerMap.has(resolvedName)) {
      resolvedTrackerMap.set(resolvedName, tp);
    }
  });

  const enriched = apiMemberStats.map((apiPlayer: any) => {
    const trackerPlayer = resolvedTrackerMap.get(apiPlayer.name);
    if (trackerPlayer) {
      return {
        name: apiPlayer.name,
        games: trackerPlayer.games || apiPlayer.games || 0,
        goals: trackerPlayer.goals || apiPlayer.goals || 0,
        assists: trackerPlayer.assists || apiPlayer.assists || 0,
        position: trackerPlayer.position || apiPlayer.position || "N/A",
        rating: trackerPlayer.avgRating || apiPlayer.rating || 0,
        motm: trackerPlayer.motm || 0,
        winRate: trackerPlayer.winRate || 0,
        passPercentage: trackerPlayer.passPercentage || 0,
        shotPercentage: trackerPlayer.shotPercentage || 0,
        overallRating: trackerPlayer.overallRating,
        cleanSheets: trackerPlayer.cleanSheets || 0,
      };
    }
    return apiPlayer;
  });

  const apiNames = new Set(apiMemberStats.map((p: any) => p.name));
  trackerPlayers.forEach((tp) => {
    const resolvedName = resolvePlayerName(tp.gamertag, knownNames);
    if (!apiNames.has(resolvedName)) {
      enriched.push({
        name: resolvedName,
        games: tp.games || 0,
        goals: tp.goals || 0,
        assists: tp.assists || 0,
        position: tp.position || "N/A",
        rating: tp.avgRating || 0,
        motm: tp.motm || 0,
        winRate: tp.winRate || 0,
        passPercentage: tp.passPercentage || 0,
        shotPercentage: tp.shotPercentage || 0,
        overallRating: tp.overallRating,
        cleanSheets: tp.cleanSheets || 0,
      });
    }
  });

  return enriched.sort((a: any, b: any) => b.rating - a.rating);
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
      const proClubsTrackerUrl = `https://proclubstracker.com/club/${CLUB_ID}?platform=common-gen5&div=3`;
      const ourProClubMatchHistoryUrl = `https://api.ourproclub.app/api/match/history?clubId=${CLUB_ID}`;

      let clubInfo: any = { clubName: "Jovem Nuggs FC", division: "3", skillRating: 0, wins: 0, draws: 0, losses: 0 };
      let overallStats: any = { gamesPlayed: 0, wins: 0, draws: 0, losses: 0, winRate: 0, goals: 0, conceded: 0, goalDiff: 0, goalsPerGame: 0, concededPerGame: 0, cleanSheets: 0, currentStreak: "", promotions: 0, relegations: 0 };
      let memberStats: any[] = [];
      let matches: any[] = [];

      // 1. Buscar histórico de partidas da OurProClub API (Fonte Primária para Partidas e Nomes)
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

          // Calcular estatísticas de membros a partir do histórico de partidas
          // Estes nomes são os "Nome do Jogador" (ex: scobyzinn) - os CORRETOS para exibição
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

      // 2. Buscar dados complementares do Pro Clubs Tracker
      // Tenta o scraper primeiro, se falhar usa dados embutidos (fallback)
      let trackerPlayers: any[] = [];
      try {
        const html = await fetchData(proClubsTrackerUrl, { responseType: 'text' }, null);
        if (html) {
          const $ = cheerio.load(html);
          // Procurar por dados do clube no HTML renderizado
          const skillRatingText = $("p:contains('Skill Rating')").prev().text().trim();
          if (skillRatingText) {
            clubInfo.skillRating = parseInt(skillRatingText) || 0;
          }
          const winsText = $("p:contains('Wins')").prev().text().trim();
          const drawsText = $("p:contains('Draws')").prev().text().trim();
          const lossesText = $("p:contains('Losses')").prev().text().trim();
          if (winsText) overallStats.wins = parseInt(winsText) || overallStats.wins;
          if (drawsText) overallStats.draws = parseInt(drawsText) || overallStats.draws;
          if (lossesText) overallStats.losses = parseInt(lossesText) || overallStats.losses;
          overallStats.gamesPlayed = overallStats.wins + overallStats.draws + overallStats.losses;

          // Tentar extrair dados dos cards de jogadores do HTML renderizado pelo servidor
          const scrapedPlayers: any[] = [];
          let currentPos: string = "forward";
          const positionMap: Record<string, string> = {
            "🧤Goalkeepers": "goalkeeper",
            "🛡️Defenders": "defender",
            "🎯Midfielders": "midfielder",
            "⚡Forwards": "forward",
          };

          $("*").each((_, element) => {
            const text = $(element).text().trim();
            for (const [label, pos] of Object.entries(positionMap)) {
              if (text.includes(label)) {
                currentPos = pos;
                return;
              }
            }

            if ((element as any).name === "h4") {
              const playerName = $(element).text().trim();
              if (!playerName || playerName === "Jovem Nuggs FC" || playerName.length > 50) return;

              const card = $(element).closest("div.bg-gray-800");
              if (card.length === 0) return;

              const ratingText = card.find("p.text-3xl").text().trim();
              const rating = parseFloat(ratingText.replace(",", ".")) || 0;

              const ovrText = card.find("p.text-gray-400.text-sm").text().trim();
              const ovrMatch = ovrText.match(/OVR\s*(\d+)/);
              const overallRating = ovrMatch ? parseInt(ovrMatch[1]) : undefined;

              const gridItems = card.find("div.text-center");
              const statLabels = ["games", "goals", "assists", "motm"];
              const stats: any = { gamertag: playerName, position: currentPos, avgRating: rating, overallRating, games: 0, goals: 0, assists: 0, motm: 0, winRate: 0, passPercentage: 0, shotPercentage: 0 };

              gridItems.each((index, item) => {
                if (index < statLabels.length) {
                  const value = $(item).find("p.text-xl, p.text-lg").text().trim();
                  const numValue = parseInt(value.replace("%", "")) || 0;
                  stats[statLabels[index]] = numValue;
                }
              });

              const percentItems = card.find("div.border-t.border-gray-700 div.text-center");
              const percentLabels = ["winRate", "passPercentage", "shotPercentage"];
              percentItems.each((index, item) => {
                if (index < percentLabels.length) {
                  const value = $(item).find("p.text-lg").text().trim();
                  const numValue = parseInt(value.replace("%", "")) || 0;
                  stats[percentLabels[index]] = numValue;
                }
              });

              const cleanSheetsText = card.text();
              const cleanSheetsMatch = cleanSheetsText.match(/Clean Sheets\s*\([^)]+\)\s*(\d+)/);
              if (cleanSheetsMatch) {
                stats.cleanSheets = parseInt(cleanSheetsMatch[1]);
              }

              if (stats.games > 0 || overallRating !== undefined) {
                scrapedPlayers.push(stats);
              }
            }
          });

          if (scrapedPlayers.length > 0) {
            trackerPlayers = scrapedPlayers;
            console.log(`Pro Clubs Tracker: ${scrapedPlayers.length} jogadores extraídos do HTML`);
          }
        }
      } catch (e) {
        console.error("Erro ao processar Pro Clubs Tracker:", e);
      }

      // Fallback: usar dados embutidos se o scraper não retornou dados
      if (trackerPlayers.length === 0 && memberStats.length > 0) {
        console.log("Pro Clubs Tracker: usando dados embutidos (fallback)");
        trackerPlayers = PROCLUB_PLAYERS_FALLBACK;
      }

      // COMBINAR dados: usar nomes da API + enriquecer com dados do Tracker
      if (trackerPlayers.length > 0 && memberStats.length > 0) {
        memberStats = combinePlayerData(memberStats, trackerPlayers);
      }

      return { clubInfo, overallStats, memberStats, matches: matches.slice(0, 30), timestamp: Date.now() };
    }),
  }),
});

export type AppRouter = typeof appRouter;
