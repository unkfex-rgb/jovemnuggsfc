import { useEffect, useState } from "react";
import { proClubAPI } from "@/services/api";
import type { Match, Player, ClubStats } from "@/types/api";
import { detectPositionByAttributes } from "@/lib/playerUtils";

interface UseProClubReturn {
  matches: Match[];
  players: Player[];
  stats: ClubStats | null;
  loading: boolean;
  error: string | null;
}

export function useProClub(): UseProClubReturn {
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [stats, setStats] = useState<ClubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await proClubAPI.getMatchHistory();

        if (data.matches) {
          setMatches(data.matches);
          const calculatedStats = await proClubAPI.getClubStats(data.matches);
          setStats(calculatedStats);
        }

        if (data.players) {
          const playersWithDetectedPositions = data.players.map(player => ({
            ...player,
            position: detectPositionByAttributes(player) // Atualiza a posição com base nos atributos
          }));
          setPlayers(playersWithDetectedPositions);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar dados"
        );
        console.error("Erro ao carregar dados do Pro Club:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { matches, players, stats, loading, error };
}
