import { useEffect, useState } from "react";
import { proClubAPI } from "@/services/api";
import type { Match, Member, ClubInfo, OverallStats } from "@/types/api";

export function useProClub() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Member[]>([]);
  const [stats, setStats] = useState<{ clubInfo: ClubInfo; overallStats: OverallStats } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let pollInterval: NodeJS.Timeout;

    async function fetchData() {
      try {
        if (isMounted) setLoading(true);
        const data = await proClubAPI.getAllData();
        
        if (isMounted) {
          setMatches(data.matches);
          setPlayers(data.players);
          setStats(data.stats);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Erro no hook useProClub:", err);
          setError("Erro ao carregar dados do clube. Tente novamente mais tarde.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    // Polling automático a cada 5 minutos
    pollInterval = setInterval(fetchData, 5 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, []);

  return { matches, players, stats, loading, error };
}
