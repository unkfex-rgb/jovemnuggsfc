import { useEffect, useState } from "react";
import { proClubAPI } from "@/services/api";
import type { Match, Player, ClubStats } from "@/types/api";


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
        setError(null);

        const data = await proClubAPI.getMatchHistory();

        if (data.matches) {
          setMatches(data.matches);
          const calculatedStats = await proClubAPI.getClubStats(data.matches);
          setStats(calculatedStats);
        }

        if (data.players) {
          setPlayers(data.players);
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

    // Carregar dados na primeira vez
    setLoading(true);
    fetchData();

    // Configurar polling automático a cada 2 minutos (120000ms)
    const pollInterval = setInterval(() => {
      fetchData();
    }, 120000);

    // Limpar o intervalo quando o componente desmontar
    return () => clearInterval(pollInterval);
  }, []);

  return { matches, players, stats, loading, error };
}
