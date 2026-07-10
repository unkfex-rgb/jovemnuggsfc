import { trpc } from "@/utils/trpc";
import { proClubService } from "@/services/api";
import type { Match, Player, ClubStats } from "@/types/api";
import { useMemo } from "react";

interface UseProClubReturn {
  matches: Match[];
  players: Player[];
  stats: ClubStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProClub(): UseProClubReturn {
  // Usar tRPC query com polling de 2 minutos e staleTime de 1 minuto
  const { data, isLoading, error, refetch } = trpc.club.getData.useQuery(undefined, {
    refetchInterval: 120000,
    staleTime: 60000,
    retry: 2
  });

  // Memorizar o processamento dos dados para evitar re-renders desnecessários
  const processedData = useMemo(() => {
    return proClubService.processData(data);
  }, [data]);

  return {
    matches: processedData.matches,
    players: processedData.players,
    stats: processedData.stats,
    loading: isLoading,
    error: error ? (error.message || "Erro ao carregar dados") : null,
    refetch
  };
}
