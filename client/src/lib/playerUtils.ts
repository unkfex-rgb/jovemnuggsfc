export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getPositionColor(position: string): string {
  const colors: Record<string, string> = {
    goalkeeper: 'from-yellow-400 to-yellow-500',
    gk: 'from-yellow-400 to-yellow-500',
    defender: 'from-blue-400 to-blue-500',
    def: 'from-blue-400 to-blue-500',
    midfielder: 'from-green-400 to-green-500',
    mid: 'from-green-400 to-green-500',
    forward: 'from-red-400 to-red-500',
    att: 'from-red-400 to-red-500',
  };
  return colors[position?.toLowerCase()] || 'from-purple-400 to-purple-500';
}

export function getPositionLabel(position: string): string {
  const labels: Record<string, string> = {
    goalkeeper: 'Goleiro',
    gk: 'Goleiro',
    defender: 'Defesa',
    def: 'Defesa',
    midfielder: 'Meio',
    mid: 'Meio',
    forward: 'Atacante',
    att: 'Atacante',
  };
  return labels[position?.toLowerCase()] || position;
}

export function getPositionCategory(position: string): 'goalkeeper' | 'defender' | 'midfielder' | 'forward' {
  const pos = position?.toLowerCase() || '';
  if (pos === 'goalkeeper' || pos === 'gk') return 'goalkeeper';
  if (pos === 'defender' || pos === 'def') return 'defender';
  if (pos === 'midfielder' || pos === 'mid') return 'midfielder';
  if (pos === 'forward' || pos === 'att') return 'forward';
  return 'midfielder';
}

export function calculatePlayerScore(player: any): number {
  // Calcula um score baseado em múltiplos atributos
  const goalsWeight = 10;
  const assistsWeight = 8;
  const ratingWeight = 5;
  const matchesWeight = 1;

  const score = 
    (player.goals || 0) * goalsWeight +
    (player.assists || 0) * assistsWeight +
    (parseFloat(player.averageRating) || 0) * ratingWeight +
    (player.matches || 0) * matchesWeight;

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
