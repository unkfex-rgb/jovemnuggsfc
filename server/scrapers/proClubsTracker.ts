import axios from "axios";
import * as cheerio from "cheerio";

export interface PlayerStats {
  name: string;
  gamertag: string;
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
  cleanSheets?: number;
}

export interface RawTrackerPlayer {
  gamertag: string;
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
  cleanSheets?: number;
}

const CACHE_TTL = 5 * 60 * 1000;
const cache = new Map<string, { data: RawTrackerPlayer[]; timestamp: number }>();

/**
 * Mapeamento de Gamertags do Pro Clubs Tracker para nomes conhecidos da API OurProClub.
 * Isso permite combinar dados das duas fontes mantendo os nomes corretos.
 * 
 * A API OurProClub retorna o "Nome do Jogador" (ex: scobyzinn).
 * O Pro Clubs Tracker retorna o "Gamertag" (ex: SCOBY NUGGET).
 */
export const GAMERTAG_TO_PLAYER_NAME: Record<string, string> = {
  // Jogadores confirmados pelo site (nome exibido no frontend)
  "SCOBY NUGGET": "scobyzinn",
  // Mapeamentos comuns (Gamertag → Nome do Jogador)
  "Neymar JR": "Vinim71655",
  "M. Motta": "pedrofeRLK",
  "S. Covs": "Jessysz0",
  "araujozx77_": "araujozx77_", // mesmo nas duas fontes
  "PECINHAA22": "PECINHAA22",   // mesmo nas duas fontes
  "Jessysz0": "Jessysz0",       // mesmo nas duas fontes
  "CELTA4656": "CELTA4656",     // mesmo nas duas fontes
  "rochax07": "rochax07",       // mesmo nas duas fontes
  "tavin__07": "tavin__07",     // mesmo nas duas fontes
  "corintia": "corintia4i20",
  "KauÃ£": "Kauanpecinha",
  "A. 77": "araujozx77_",
  "mesquita_B12": "mesquita_B12",
  "Vinim71655": "Vinim71655",
  "pedrofeRLK": "pedrofeRLK",
};

/**
 * Tenta resolver o nome correto do jogador usando o mapeamento Gamertag → Nome.
 * Se não encontrar mapeamento, usa o gamertag como fallback.
 */
export function resolvePlayerName(gamertag: string, knownNames: string[] = []): string {
  // Primeiro, tentar mapeamento direto
  const mapped = GAMERTAG_TO_PLAYER_NAME[gamertag];
  if (mapped) return mapped;

  // Tentar correspondência parcial (case-insensitive, sem acentos)
  const normalized = normalizeString(gamertag);
  for (const name of knownNames) {
    if (normalized === normalizeString(name)) {
      return name;
    }
    // Verificar se partes do nome coincidem
    const gamertagParts = normalized.split(/[\s_\-]+/);
    const nameParts = normalizeString(name).split(/[\s_\-]+/);
    for (const part of gamertagParts) {
      if (part.length > 2 && nameParts.some(p => p.includes(part) || p.startsWith(part))) {
        return name;
      }
    }
  }

  // Fallback: usar o gamertag
  return gamertag;
}

function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

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

/**
 * Scrapeia os jogadores do Pro Clubs Tracker e retorna os dados RAW (com gamertag).
 * O nome do jogador deve ser resolvido separadamente usando resolvePlayerName().
 */
export async function scrapeProClubsPlayers(clubId: string): Promise<RawTrackerPlayer[]> {
  // Verificar cache
  const cacheKey = `proclubs_players_${clubId}`;
  const cached = cache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    return cached.data;
  }

  try {
    const html = await fetchProClubsTrackerHTML(clubId);
    const $ = cheerio.load(html);

    const players: RawTrackerPlayer[] = [];
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
      if ((element as any).name === "h4") {
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
        const rawPlayer: RawTrackerPlayer = {
          gamertag: playerName,
          position: currentPosition,
          rating,
          games: 0,
          goals: 0,
          assists: 0,
          motm: 0,
          winRate: 0,
          passPercentage: 0,
          shotPercentage: 0,
          overallRating,
        };

        // Grid stats
        const gridItems = card.find("div.text-center");
        const statLabels = ["games", "goals", "assists", "motm"] as const;

        gridItems.each((index, item) => {
          if (index < statLabels.length) {
            const value = $(item).find("p.text-xl, p.text-lg").text().trim();
            const numValue = parseInt(value.replace("%", "")) || 0;
            (rawPlayer as any)[statLabels[index]] = numValue;
          }
        });

        // Extrair percentuais (Win Rate, Pass %, Shot %)
        const percentItems = card.find("div.border-t.border-gray-700 div.text-center");
        const percentLabels = ["winRate", "passPercentage", "shotPercentage"] as const;

        percentItems.each((index, item) => {
          if (index < percentLabels.length) {
            const value = $(item).find("p.text-lg").text().trim();
            const numValue = parseInt(value.replace("%", "")) || 0;
            (rawPlayer as any)[percentLabels[index]] = numValue;
          }
        });

        // Extrair Clean Sheets
        const cleanSheetsText = card.text();
        const cleanSheetsMatch = cleanSheetsText.match(/Clean Sheets\s*\([^)]+\)\s*(\d+)/);
        if (cleanSheetsMatch) {
          rawPlayer.cleanSheets = parseInt(cleanSheetsMatch[1]);
        }

        players.push(rawPlayer);
      }
    });

    // Deduplicar por gamertag
    const uniquePlayers = Array.from(
      new Map(players.map((p) => [p.gamertag, p])).values()
    );

    // Filtrar jogadores com 0 jogos e sem OVR (inativos)
    const activePlayers = uniquePlayers.filter((p) => p.games > 0 || p.overallRating !== undefined);

    // Armazenar em cache
    cache.set(cacheKey, { data: activePlayers, timestamp: Date.now() });

    return activePlayers;
  } catch (error) {
    console.error("Erro ao fazer scraping dos jogadores do Pro Clubs Tracker:", error);
    throw error;
  }
}

/**
 * Combina dados de membros da API OurProClub com dados do Pro Clubs Tracker.
 * Usa os nomes da API (Nome do Jogador) e enriquece com dados do Tracker.
 * 
 * @param apiMemberStats - Dados dos jogadores da API OurProClub (com nomes corretos)
 * @param trackerPlayers - Dados dos jogadores do Pro Clubs Tracker (com gamertags)
 * @returns Lista combinada com nomes corretos e dados enriquecidos
 */
export function combinePlayerData(apiMemberStats: any[], trackerPlayers: RawTrackerPlayer[]): any[] {
  if (trackerPlayers.length === 0) {
    // Sem dados do Tracker, retornar dados da API como estão
    return apiMemberStats.map((p: any) => ({
      ...p,
      name: p.name,
      games: p.games || 0,
      goals: p.goals || 0,
      assists: p.assists || 0,
      position: p.position || "N/A",
      rating: p.rating || 0,
    }));
  }

  // Extrair nomes conhecidos da API para ajudar no mapeamento
  const knownNames = apiMemberStats.map((p: any) => p.name);

  // Criar mapa do Tracker por gamertag
  const trackerMap = new Map<string, RawTrackerPlayer>();
  trackerPlayers.forEach((tp) => trackerMap.set(tp.gamertag, tp));

  // Criar mapa do Tracker por nome resolvido
  const resolvedTrackerMap = new Map<string, RawTrackerPlayer>();
  trackerPlayers.forEach((tp) => {
    const resolvedName = resolvePlayerName(tp.gamertag, knownNames);
    if (!resolvedTrackerMap.has(resolvedName)) {
      resolvedTrackerMap.set(resolvedName, tp);
    }
  });

  // Combinar: para cada jogador da API, enriquecer com dados do Tracker
  const combined = apiMemberStats.map((apiPlayer: any) => {
    const trackerPlayer = resolvedTrackerMap.get(apiPlayer.name);

    if (trackerPlayer) {
      // Enriquecer com dados do Tracker (mais completos)
      return {
        name: apiPlayer.name, // Manter nome da API (Nome do Jogador)
        games: trackerPlayer.games || apiPlayer.games || 0,
        goals: trackerPlayer.goals || apiPlayer.goals || 0,
        assists: trackerPlayer.assists || apiPlayer.assists || 0,
        position: trackerPlayer.position || apiPlayer.position || "N/A",
        rating: trackerPlayer.rating || apiPlayer.rating || 0,
        motm: trackerPlayer.motm || 0,
        winRate: trackerPlayer.winRate || 0,
        passPercentage: trackerPlayer.passPercentage || 0,
        shotPercentage: trackerPlayer.shotPercentage || 0,
        overallRating: trackerPlayer.overallRating,
        cleanSheets: trackerPlayer.cleanSheets || 0,
      };
    }

    // Jogador sem correspondência no Tracker, usar dados da API
    return {
      name: apiPlayer.name,
      games: apiPlayer.games || 0,
      goals: apiPlayer.goals || 0,
      assists: apiPlayer.assists || 0,
      position: apiPlayer.position || "N/A",
      rating: apiPlayer.rating || 0,
    };
  });

  // Adicionar jogadores do Tracker que não existem na API (novos jogadores)
  const apiNames = new Set(apiMemberStats.map((p: any) => p.name));
  trackerPlayers.forEach((tp) => {
    const resolvedName = resolvePlayerName(tp.gamertag, knownNames);
    if (!apiNames.has(resolvedName)) {
      combined.push({
        name: resolvedName,
        games: tp.games || 0,
        goals: tp.goals || 0,
        assists: tp.assists || 0,
        position: tp.position || "N/A",
        rating: tp.rating || 0,
        motm: tp.motm || 0,
        winRate: tp.winRate || 0,
        passPercentage: tp.passPercentage || 0,
        shotPercentage: tp.shotPercentage || 0,
        overallRating: tp.overallRating,
        cleanSheets: tp.cleanSheets || 0,
      });
    }
  });

  // Ordenar por rating
  return combined.sort((a: any, b: any) => b.rating - a.rating);
}
