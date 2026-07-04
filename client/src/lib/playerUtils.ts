export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getPositionColor(position: string): string {
  const pos = position?.toLowerCase() || '';
  if (pos.includes('goalkeeper') || pos === 'gk' || pos === 'goleiro') return 'from-yellow-400 to-yellow-500';
  if (pos.includes('defender') || pos === 'def' || pos === 'defesa' || pos.includes('back')) return 'from-blue-400 to-blue-500';
  if (pos.includes('midfielder') || pos === 'mid' || pos === 'meio') return 'from-green-400 to-green-500';
  if (pos.includes('forward') || pos === 'att' || pos === 'atacante' || pos.includes('striker')) return 'from-red-400 to-red-500';
  return 'from-purple-400 to-purple-500';
}

export function getPositionLabel(position: string): string {
  const pos = position?.toLowerCase() || '';
  if (pos.includes('goalkeeper') || pos === 'gk' || pos === 'goleiro') return 'Goleiro';
  if (pos.includes('defender') || pos === 'def' || pos === 'defesa' || pos.includes('back')) return 'Defesa';
  if (pos.includes('midfielder') || pos === 'mid' || pos === 'meio') return 'Meio';
  if (pos.includes('forward') || pos === 'att' || pos === 'atacante' || pos.includes('striker')) return 'Atacante';
  return position;
}

export function getPositionCategory(position: string): 'goalkeeper' | 'defender' | 'midfielder' | 'forward' {
  const pos = position?.toLowerCase() || '';
  if (pos.includes('goalkeeper') || pos === 'gk' || pos === 'goleiro') return 'goalkeeper';
  if (pos.includes('defender') || pos === 'def' || pos === 'defesa' || pos.includes('back')) return 'defender';
  if (pos.includes('midfielder') || pos === 'mid' || pos === 'meio') return 'midfielder';
  if (pos.includes('forward') || pos === 'att' || pos === 'atacante' || pos.includes('striker')) return 'forward';
  return 'midfielder';
}

export function calculatePlayerScore(player: any): number {
  const pos = getPositionCategory(player.position);
  
  // Base weights
  let goalsWeight = 10;
  let assistsWeight = 8;
  let ratingWeight = 5;
  let matchesWeight = 1;
  let cleanSheetWeight = 0;
  let savesWeight = 0;

  // Adjust weights based on position to balance the score
  if (pos === 'goalkeeper') {
    goalsWeight = 20; // Rare, but highly valued
    assistsWeight = 15;
    ratingWeight = 8; // GKs usually have lower ratings in EA API, so we boost the weight
    cleanSheetWeight = 25; // Critical for GK
    savesWeight = 2; // Every save counts
  } else if (pos === 'defender') {
    goalsWeight = 15;
    assistsWeight = 12;
    cleanSheetWeight = 15;
    ratingWeight = 6;
  }

  const score = 
    (player.goals || 0) * goalsWeight +
    (player.assists || 0) * assistsWeight +
    (parseFloat(player.avgRating) || 0) * ratingWeight +
    (player.matches || 0) * matchesWeight +
    (player.cleanSheets || 0) * cleanSheetWeight +
    (player.saves || 0) * savesWeight;

  return Math.round(score);
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function getResultColor(ourGoals: number, opponentGoals: number): string {
  if (ourGoals > opponentGoals) return 'text-green-400';
  if (ourGoals < opponentGoals) return 'text-red-400';
  return 'text-yellow-400';
}
