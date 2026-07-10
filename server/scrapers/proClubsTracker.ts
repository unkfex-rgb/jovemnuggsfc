import axios from "axios";
import * as cheerio from "cheerio";

export interface PlayerStats {
  name: string;
  position: "goalkeeper" | "defender" | "midfielder" | "forward";
  rating: number;
  games: number;
  goals: number;
  assists: number;
  motm: number;
  winRate: number;
  passPercentage: number;
  shotPercentage: number;
  overallRating?: number;
}

const CACHE_TTL = 5 * 60 * 1000;
const cache = new Map<string, { data: PlayerStats[]; timestamp: number }>();

async function fetchProClubsTrackerHTML(clubId: string): Promise<string> {
  const url = `https://proclubstracker.com/club/${clubId}?platform=common-gen5&div=5`;
  
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      timeout: 15000,
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar HTML do Pro Clubs Tracker para clube ${clubId}:`, error instanceof Error ? error.message : error);
    throw error;
  }
}

export async function scrapeProClubsPlayers(clubId: string): Promise<PlayerStats[]> {
  // Verificar cache
  const cacheKey = `proclubs_players_${clubId}`;
  const cached = cache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    return cached.data;
  }

  try {
    const html = await fetchProClubsTrackerHTML(clubId);
    const $ = cheerio.load(html);

    const players: PlayerStats[] = [];
    let currentPosition: "goalkeeper" | "defender" | "midfielder" | "forward" = "forward";

    // Mapeamento de rótulos para categorias de posição
    const positionMap: Record<string, "goalkeeper" | "defender" | "midfielder" | "forward"> = {
      "🧤Goalkeepers": "goalkeeper",
      "🛡️Defenders": "defender",
      "🎯Midfielders": "midfielder",
      "⚡Forwards": "forward",
    };

    // Iterar por todos os elementos para manter contexto de posição
    $("*").each((_, element) => {
      const text = $(element).text().trim();
      
      // Verificar se é um cabeçalho de posição
      for (const [label, position] of Object.entries(positionMap)) {
        if (text.includes(label)) {
          currentPosition = position;
          return; // continue
        }
      }

      // Procurar por cards de jogadores
      if (element.name === "h4") {
        const playerName = $(element).text().trim();
        
        // Pular nomes inválidos
        if (!playerName || playerName === "Jovem Nuggs FC" || playerName.length > 50) {
          return; // continue
        }

        // Encontrar o card pai (div com classe bg-gray-800)
        const card = $(element).closest("div.bg-gray-800");
        if (card.length === 0) {
          return; // continue
        }

        // Extrair rating (texto grande em verde/amarelo)
        const ratingText = card.find("p.text-3xl").text().trim();
        const rating = parseFloat(ratingText.replace(",", ".")) || 0;

        // Extrair OVR (Overall Rating)
        const ovrText = card.find("p.text-gray-400.text-sm").text().trim();
        const ovrMatch = ovrText.match(/OVR\s*(\d+)/);
        const overallRating = ovrMatch ? parseInt(ovrMatch[1]) : undefined;

        // Extrair estatísticas do grid (Games, Goals, Assists, MOTM)
        const stats: Partial<PlayerStats> = {
          name: playerName,
          position: currentPosition,
          rating,
          overallRating,
        };

        // Grid stats
        const gridItems = card.find("div.text-center");
        const statLabels = ["games", "goals", "assists", "motm"];
        
        gridItems.each((index, item) => {
          if (index < statLabels.length) {
            const value = $(item).find("p.text-xl, p.text-lg").text().trim();
            const numValue = parseInt(value.replace("%", "")) || 0;
            stats[statLabels[index] as keyof PlayerStats] = numValue;
          }
        });

        // Extrair percentuais (Win Rate, Pass %, Shot %)
        const percentItems = card.find("div.border-t.border-gray-700 div.text-center");
        const percentLabels = ["winRate", "passPercentage", "shotPercentage"];
        
        percentItems.each((index, item) => {
          if (index < percentLabels.length) {
            const value = $(item).find("p.text-lg").text().trim();
            const numValue = parseInt(value.replace("%", "")) || 0;
            stats[percentLabels[index] as keyof PlayerStats] = numValue;
          }
        });

        // Garantir que todos os campos obrigatórios estão preenchidos
        const playerStats: PlayerStats = {
          name: stats.name || playerName,
          position: stats.position || currentPosition,
          rating: stats.rating || 0,
          games: stats.games || 0,
          goals: stats.goals || 0,
          assists: stats.assists || 0,
          motm: stats.motm || 0,
          winRate: stats.winRate || 0,
          passPercentage: stats.passPercentage || 0,
          shotPercentage: stats.shotPercentage || 0,
          overallRating: stats.overallRating,
        };

        players.push(playerStats);
      }
    });

    // Deduplicar por nome
    const uniquePlayers = Array.from(
      new Map(players.map((p) => [p.name, p])).values()
    );

    // Filtrar jogadores com 0 jogos (inativos)
    const activePlayers = uniquePlayers.filter((p) => p.games > 0 || p.overallRating !== undefined);

    // Armazenar em cache
    cache.set(cacheKey, { data: activePlayers, timestamp: Date.now() });

    return activePlayers;
  } catch (error) {
    console.error("Erro ao fazer scraping dos jogadores do Pro Clubs Tracker:", error);
    throw error;
  }
}
