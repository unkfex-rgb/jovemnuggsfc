import { initTRPC } from "@trpc/server";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import superjson from "superjson";
import axios from "axios";
import * as cheerio from "cheerio";

const CLUB_ID = "8044401";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos de cache
const cache = new Map<string, { data: any; timestamp: number }>();

/**
 * Função utilitária para buscar dados com cache e fallback
 */
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
      },
      timeout: 10000 // 10s timeout
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
    /**
     * Endpoint unificado que agrega dados do Pro Clubs Tracker e OurProClub API
     */
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

      // 1. Scraping de dados do Pro Clubs Tracker (ESTATÍSTICAS DO CLUBE E JOGADORES)
      try {
        const html = await fetchData(proClubsTrackerUrl, { responseType: 'text' }, null);
        if (html) {
          const $ = cheerio.load(html);

          // Extrair Skill Rating
          const srText = $("span:contains('SR:')").text().replace("SR:", "").trim();
          clubInfo.skillRating = parseInt(srText) || 0;
          
          // Extrair Record (W-D-L)
          // Tentar encontrar o recorde na estrutura do site
          const recordText = $("div.flex.flex-wrap.items-center.gap-2.text-xs.md\\:text-sm")
            .next("div")
            .find("span.font-bold")
            .map((i, el) => $(el).text().trim())
            .get()
            .join("-");
          
          if (recordText) {
            const recordParts = recordText.split("-").map(s => parseInt(s.trim().replace(/[^\d]/g, "")));
            clubInfo.wins = recordParts[0] || 0;
            clubInfo.draws = recordParts[1] || 0;
            clubInfo.losses = recordParts[2] || 0;
            
            overallStats.wins = clubInfo.wins;
            overallStats.draws = clubInfo.draws;
            overallStats.losses = clubInfo.losses;
            overallStats.gamesPlayed = overallStats.wins + overallStats.draws + overallStats.losses;
          }
          
          // Extrair estatísticas gerais dos cards
          $("div.grid.grid-cols-2.md\\:grid-cols-4.gap-4.mb-8 div.bg-gray-800.rounded-lg.p-4").each((i, el) => {
            const label = $(el).find("div.text-gray-400").text().trim().toLowerCase();
            const value = $(el).find("div.text-2xl.font-bold").text().trim();
            
            if (label.includes("goals") && !label.includes("/")) overallStats.goals = parseInt(value) || 0;
            if (label.includes("conceded") && !label.includes("/")) overallStats.conceded = parseInt(value) || 0;
            if (label.includes("clean sheets")) overallStats.cleanSheets = parseInt(value) || 0;
            if (label.includes("streak")) overallStats.currentStreak = value;
          });
          
          overallStats.goalDiff = overallStats.goals - overallStats.conceded;
          overallStats.winRate = overallStats.gamesPlayed > 0 ? (overallStats.wins / overallStats.gamesPlayed) * 100 : 0;
          overallStats.goalsPerGame = overallStats.gamesPlayed > 0 ? overallStats.goals / overallStats.gamesPlayed : 0;
          overallStats.concededPerGame = overallStats.gamesPlayed > 0 ? overallStats.conceded / overallStats.gamesPlayed : 0;

          // Extrair Jogadores da Tabela
          $("div.overflow-x-auto table tbody tr").each((i, element) => {
            const cols = $(element).find("td");
            if (cols.length >= 5) {
              const player: any = {
                name: $(cols[0]).text().trim(),
                games: parseInt($(cols[1]).text()) || 0,
                goals: parseInt($(cols[2]).text()) || 0,
                assists: parseInt($(cols[3]).text()) || 0,
                rating: parseFloat($(cols[4]).text()) || 0,
                position: $(cols[5]).text().trim() || "N/A"
              };
              if (player.name) memberStats.push(player);
            }
          });
        }
      } catch (error) {
        console.error("Erro ao processar Pro Clubs Tracker:", error);
      }

      // 2. Buscar histórico de partidas da OurProClub API
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
