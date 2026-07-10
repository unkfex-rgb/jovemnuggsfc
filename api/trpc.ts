import { initTRPC } from "@trpc/server";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import superjson from "superjson";
import axios from "axios";
import * as cheerio from "cheerio";

const CLUB_ID = "8044401";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos de cache
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

      let clubInfo: any = {
        clubName: "Jovem Nuggs FC",
        division: "5",
        skillRating: 0,
        wins: 0,
        draws: 0,
        losses: 0
      };
      
      let overallStats: any = {
        gamesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        winRate: 0,
        goals: 0,
        conceded: 0,
        goalDiff: 0,
        goalsPerGame: 0,
        concededPerGame: 0,
        cleanSheets: 0,
        currentStreak: "",
        promotions: 0,
        relegations: 0
      };
      
      let memberStats: any[] = [];
      let matches: any[] = [];

      // 1. Scrapear dados do Pro Clubs Tracker (ESTATÍSTICAS DO CLUBE E JOGADORES)
      try {
        const html = await fetchData(proClubsTrackerUrl, {}, null);
        if (html) {
          const $ = cheerio.load(html);

          // Extrair Club Info e Stats das badges e record
          const srText = $(".club-stats-header .sr-badge").text().replace("SR:", "").trim();
          clubInfo.skillRating = parseInt(srText) || 0;
          
          const recordText = $(".club-stats-header .record").text().trim(); // Ex: "53W - 12D - 25L"
          const recordParts = recordText.split("-").map(s => parseInt(s.trim().replace(/[^\d]/g, "")));
          
          clubInfo.wins = recordParts[0] || 0;
          clubInfo.draws = recordParts[1] || 0;
          clubInfo.losses = recordParts[2] || 0;
          
          overallStats.wins = clubInfo.wins;
          overallStats.draws = clubInfo.draws;
          overallStats.losses = clubInfo.losses;
          overallStats.gamesPlayed = overallStats.wins + overallStats.draws + overallStats.losses;
          
          // Extrair dados das tabelas de estatísticas
          $(".stats-grid .stat-item").each((i, el) => {
            const label = $(el).find(".label").text().trim().toLowerCase();
            const value = $(el).find(".value").text().trim();
            
            if (label.includes("goals") && !label.includes("/")) overallStats.goals = parseInt(value) || 0;
            if (label.includes("conceded") && !label.includes("/")) overallStats.conceded = parseInt(value) || 0;
            if (label.includes("clean sheets")) overallStats.cleanSheets = parseInt(value) || 0;
            if (label.includes("streak")) overallStats.currentStreak = value;
          });
          
          overallStats.goalDiff = overallStats.goals - overallStats.conceded;
          overallStats.winRate = overallStats.gamesPlayed > 0 ? (overallStats.wins / overallStats.gamesPlayed) * 100 : 0;
          overallStats.goalsPerGame = overallStats.gamesPlayed > 0 ? overallStats.goals / overallStats.gamesPlayed : 0;
          overallStats.concededPerGame = overallStats.gamesPlayed > 0 ? overallStats.conceded / overallStats.gamesPlayed : 0;

          // Extrair Jogadores
          $("table.player-stats-table tbody tr").each((i, element) => {
            const player: any = {};
            player.name = $(element).find("td").eq(0).text().trim();
            player.games = parseInt($(element).find("td").eq(1).text()) || 0;
            player.goals = parseInt($(element).find("td").eq(2).text()) || 0;
            player.assists = parseInt($(element).find("td").eq(3).text()) || 0;
            player.rating = parseFloat($(element).find("td").eq(4).text()) || 0;
            player.position = $(element).find("td").eq(5).text().trim(); // Assumindo que a posição está na 6ª coluna (índice 5)
            if (player.name) memberStats.push(player);
          });
        }
      } catch (error) {
        console.error("Erro ao processar Pro Clubs Tracker:", error);
      }

      // 2. Buscar histórico de partidas do OurProClub API (HISTÓRICO)
      try {
        const ourProMatches = await fetchData(ourProClubMatchHistoryUrl, {}, []);
        if (Array.isArray(ourProMatches)) {
          matches = ourProMatches.slice(0, 20).map((match: any) => ({
            matchId: match.matchId || Math.random().toString(36),
            timestamp: match.timestamp || Date.now() / 1000,
            homeClubName: match.homeClubName || "Jovem Nuggs FC",
            awayClubName: match.awayClubName || "Oponente",
            homeGoals: parseInt(match.homeGoals) || 0,
            awayGoals: parseInt(match.awayGoals) || 0,
            result: match.result === "win" ? "W" : (match.result === "loss" ? "L" : "D"),
            teamGoals: match.homeGoals,
            oppGoals: match.awayGoals,
            date: new Date(match.timestamp * 1000).toISOString().split('T')[0],
            opponent: match.awayClubName,
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar OurProClub matches:", error);
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
