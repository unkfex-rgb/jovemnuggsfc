import axios from "axios";
import type { Match, Player, ClubStats, RawMatchData } from "@/types/api";

const API_BASE_URL = "https://api.ourproclub.app/api";
const CLUB_ID = "8044401";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

export const proClubAPI = {
  async getMatchHistory(): Promise<{ matches: Match[]; players: Player[] }> {
    try {
      const response = await apiClient.get<ArrayBuffer>(`/match/history?clubId=${CLUB_ID}`, { responseType: 'arraybuffer' });
      const decodedData = new TextDecoder('utf-8').decode(response.data);
      const rawData: RawMatchData[] = JSON.parse(decodedData);


      if (!Array.isArray(rawData)) {
        console.error("API response is not an array:", rawData);
        return { matches: [], players: [] };
      }

      const matches: Match[] = rawData.map((m) => {
        const ourClub = m.match_data.clubs[CLUB_ID];
        const opponentClub = Object.values(m.match_data.clubs).find(c => c.clubId !== CLUB_ID);
        
        const ourGoals = parseInt(ourClub?.goals || "0");
        const oppGoals = parseInt(opponentClub?.goals || "0");
        
        let result: "W" | "L" | "D" = "D";
        if (ourGoals > oppGoals) result = "W";
        else if (ourGoals < oppGoals) result = "L";

        return {
          id: m.match_data.matchId,
          timestamp: m.match_data.timestamp,
          date: m.match_data.timeAgo,
          opponent: opponentClub?.clubName || "Desconhecido",
          teamGoals: ourGoals,
          oppGoals: oppGoals,
          result,
          playerStats: m.player_data
        };
      });

      // Process Players
      const playerMap = new Map<string, Player>();

      rawData.forEach((m) => {
        if (m.player_data) {
          Object.entries(m.player_data).forEach(([name, stats]) => {
            const existing = playerMap.get(name);
            const goals = parseInt(stats.goals || "0");
            const assists = parseInt(stats.assists || "0");
            const rating = parseFloat(stats.rating || "0");
            const saves = parseInt(stats.saves || "0");
            const interceptions = parseInt(stats.interceptions?.toString() || "0");
            const cleanSheets = parseInt(stats.cleansheetsdef || "0") + parseInt(stats.cleansheetsgk || "0");

            if (existing) {
              existing.goals += goals;
              existing.assists += assists;
              existing.matches += 1;
              existing.avgRating = (existing.avgRating * (existing.matches - 1) + rating) / existing.matches;
              existing.cleanSheets += cleanSheets;
              existing.shots += parseInt(stats.shots || "0");
              existing.passes += parseInt(stats.passesmade || "0");
              existing.tackles += parseInt(stats.tacklesmade || "0");
              existing.interceptions += interceptions;
              existing.saves += saves;
            } else {
              playerMap.set(name, {
                name,
                position: stats.pos,
                goals,
                assists,
                matches: 1,
                avgRating: rating,
                cleanSheets,
                shots: parseInt(stats.shots || "0"),
                passes: parseInt(stats.passesmade || "0"),
                tackles: parseInt(stats.tacklesmade || "0"),
                interceptions,
                saves
              });
            }
          });
        }
      });

      return { 
        matches, 
        players: Array.from(playerMap.values()).sort((a, b) => b.avgRating - a.avgRating) 
      };
    } catch (error) {
      console.error("Erro ao buscar histórico de partidas:", error);
      return { matches: [], players: [] };
    }
  },

  async getClubStats(matches: Match[]): Promise<ClubStats> {
    const total = matches.length;
    const wins = matches.filter((m) => m.result === "W").length;
    const losses = matches.filter((m) => m.result === "L").length;
    const draws = matches.filter((m) => m.result === "D").length;

    const gf = matches.reduce((sum, m) => sum + m.teamGoals, 0);
    const ga = matches.reduce((sum, m) => sum + m.oppGoals, 0);
    const saldo = gf - ga;

    const points = wins * 3 + draws * 1;
    const aproveitamento = total > 0 ? (points / (total * 3)) * 100 : 0;

    const cleanSheets = matches.filter((m) => m.oppGoals === 0).length;
    const mediaGols = total > 0 ? gf / total : 0;

    let currentStreak = { type: null as "W" | "L" | "D" | null, count: 0 };
    if (matches.length > 0) {
      const lastResult = matches[0].result;
      let count = 0;
      for (let i = 0; i < matches.length; i++) {
        if (matches[i].result === lastResult) {
          count++;
        } else {
          break;
        }
      }
      currentStreak = { type: lastResult, count };
    }

    let bestStreak = 0;
    let currentWinStreak = 0;
    const chronologicalMatches = [...matches].reverse();
    for (const match of chronologicalMatches) {
      if (match.result === "W") {
        currentWinStreak++;
        bestStreak = Math.max(bestStreak, currentWinStreak);
      } else {
        currentWinStreak = 0;
      }
    }

    return {
      total,
      wins,
      losses,
      draws,
      gf,
      ga,
      saldo,
      aproveitamento: Math.round(aproveitamento * 10) / 10,
      cleanSheets,
      mediaGols: Math.round(mediaGols * 100) / 100,
      currentStreak,
      bestStreak,
    };
  },
};
