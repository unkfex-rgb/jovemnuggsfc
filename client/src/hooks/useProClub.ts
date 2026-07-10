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

        // Buscar dados da API principal e do Tracker em paralelo
        const [data, trackerMatches] = await Promise.all([
          proClubAPI.getMatchHistory(),
          proClubAPI.getTrackerMatches()
        ]);

        // Priorizar partidas do Tracker se disponíveis, senão usar API principal
        const finalMatches = trackerMatches.length > 0 ? trackerMatches : data.matches;

        if (finalMatches) {
          setMatches(finalMatches);
          const calculatedStats = await proClubAPI.getClubStats(finalMatches);
          setStats(calculatedStats);
        }

        if (data.players) {
          // Buscar dados de performance do Tracker para atualizar em tempo real
          const trackerPerformance = await proClubAPI.getTrackerPerformance();
          
          // Mesclar dados: usar Tracker para notas e stats, manter resto da API
          const enhancedPlayers = data.players.map(player => {
            const trackerData = trackerPerformance.get(player.name);
            
            if (trackerData) {
              return {
                ...player,
                avgRating: trackerData.rating,
                goals: trackerData.goals,
                assists: trackerData.assists
              };
            }
            
            return player;
          });

          setPlayers(enhancedPlayers.sort((a, b) => b.avgRating - a.avgRating));
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
