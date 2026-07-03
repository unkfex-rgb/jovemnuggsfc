import axios from "axios";
import type { Match, Player, ClubStats, ProClubResponse } from "@/types/api";

const API_BASE_URL = "https://api.ourproclub.app/api";
const CLUB_ID = "8044401";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const proClubAPI = {
  async getMatchHistory() {
    try {
      const response = await apiClient.get(`/match/history?clubId=${CLUB_ID}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar histórico de partidas:", error);
      throw error;
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

    const points = matches.reduce(
      (sum, m) => sum + (m.result === "W" ? 3 : m.result === "D" ? 1 : 0),
      0
    );
    const aproveitamento = total > 0 ? (points / (total * 3)) * 100 : 0;

    const cleanSheets = matches.filter((m) => m.oppGoals === 0).length;
    const mediaGols = total > 0 ? gf / total : 0;

    let currentStreak = { type: null as "W" | "L" | "D" | null, count: 0 };
    if (matches.length > 0) {
      const lastResult = matches[matches.length - 1].result;
      let count = 0;
      for (let i = matches.length - 1; i >= 0; i--) {
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
    for (const match of matches) {
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
