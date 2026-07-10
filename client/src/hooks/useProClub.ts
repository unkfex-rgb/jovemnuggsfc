import { useEffect, useState } from "react";
import { proClubAPI } from "@/services/api";
import type { Match, Player, ClubStats } from "@/types/api";
import { trpc } from "@/lib/trpc";


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
        setLoading(true);

        const { matches, players } = await proClubAPI.getMatchHistory();
        const clubStats = await proClubAPI.getClubStats();

        setMatches(matches);
        setPlayers(players);
        setStats(clubStats);

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

    const pollInterval = setInterval(() => {
      fetchData();
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(pollInterval);
  }, []);

  return { matches, players, stats, loading, error };
}
