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
