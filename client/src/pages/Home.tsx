import { useProClub } from "@/hooks/useProClub";
import { MatchContextProvider } from "@/contexts/MatchContext";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import Elenco from "@/components/Elenco";
import MatchHistory from "@/components/MatchHistory";
import CampoTatico from "@/components/CampoTatico";
import { DivisionProgressBar } from "@/components/DivisionProgressBar";
import { MatchDayBanner } from "@/components/MatchDayBanner";

import { HallOfFame } from "@/components/HallOfFame";
import { SectionLabel } from "@/components/SectionLabel";
import { Reveal } from "@/components/Reveal";
import { StatCard } from "@/components/StatCard";
import { DashboardCard } from "@/components/DashboardCard";
import { CommunitySection } from "@/components/CommunitySection";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import {
  Activity,
  Trophy,
  Minus,
  TrendingUp,
  TrendingDown,
  Gauge,
  Target,
  Crosshair,
  ShieldCheck,
  BarChart3,
  Flame,
  Star,
  Zap,
} from "lucide-react";

export default function Home() {
  const { matches, players, stats, loading, error } = useProClub();

  const topScorer = players.length
    ? [...players].sort((a, b) => b.goals - a.goals)[0]
    : null;
  const topAssist = players.length
    ? [...players].sort((a, b) => b.assists - a.assists)[0]
    : null;
  const mostParticipative = players.length
    ? [...players].sort((a, b) => b.goals + b.assists - (a.goals + a.assists))[0]
    : null;
  const bestAvg = players.length
    ? [...players].sort((a, b) => b.avgRating - a.avgRating)[0]
    : null;

  // Calcular tendências baseado nas últimas partidas
  const getRecentTrend = (getValue: (m: any) => number) => {
    if (matches.length < 2) return "stable";
    const recent = matches.slice(-5);
    const older = matches.slice(-10, -5);
    const recentAvg = recent.reduce((sum, m) => sum + getValue(m), 0) / Math.max(recent.length, 1);
    const olderAvg = older.reduce((sum, m) => sum + getValue(m), 0) / Math.max(older.length, 1);
    if (recentAvg > olderAvg) return "up";
    if (recentAvg < olderAvg) return "down";
    return "stable";
  };

  const getSparkData = (getValue: (m: any) => number) => {
    return matches.slice(-10).map(m => getValue(m));
  };

  const winTrend = getRecentTrend((m) => m.result === "W" ? 1 : 0);
  const goalsTrend = getRecentTrend((m) => m.teamGoals);
  const concededTrend = getRecentTrend((m) => m.oppGoals);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-white selection:text-black">
      <header><Navbar /></header>
      <main>
      <Hero />

      {/* Match Day Banner */}
      {!loading && stats && (
        <div className="relative py-8 px-4 sm:px-6 max-w-7xl mx-auto">
          <MatchDayBanner stats={stats} />
        </div>
      )}

      {/* Estatísticas */}
      <section id="estatisticas" className="relative py-12 sm:py-20 md:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
        <Reveal>
          <SectionLabel>Números do clube</SectionLabel>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 sm:mb-10 tracking-tighter">ESTATÍSTICAS</h2>
        </Reveal>

        {loading && <LoadingState />}
        {error && <ErrorState message={error} />}

        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
            <StatCard
              icon={Activity}
              label="Jogos"
              value={stats.total}
              delay={0}
              trend="stable"
            />
            <StatCard
              icon={Trophy}
              label="Vitórias"
              value={stats.wins}
              delay={60}
              trend={winTrend}
              sparkData={getSparkData((m) => m.result === "W" ? 1 : 0)}
            />
            <StatCard
              icon={Minus}
              label="Empates"
              value={stats.draws}
              delay={120}
              trend="stable"
            />
            <StatCard
              icon={TrendingDown}
              label="Derrotas"
              value={stats.losses}
              delay={180}
              trend={winTrend === "up" ? "down" : winTrend === "down" ? "up" : "stable"}
            />
            <StatCard
              icon={Gauge}
              label="Aproveitamento"
              value={`${stats.aproveitamento}%`}
              delay={240}
              trend={winTrend}
            />
            <StatCard
              icon={Target}
              label="Gols Pró"
              value={stats.gf}
              delay={300}
              trend={goalsTrend}
              sparkData={getSparkData((m) => m.teamGoals)}
            />
            <StatCard
              icon={Crosshair}
              label="Gols Contra"
              value={stats.ga}
              delay={360}
              trend={concededTrend === "up" ? "down" : concededTrend === "down" ? "up" : "stable"}
              sparkData={getSparkData((m) => m.oppGoals)}
            />
            <StatCard
              icon={TrendingUp}
              label="Saldo"
              value={stats.saldo}
              delay={420}
              trend={goalsTrend}
            />
            <StatCard
              icon={ShieldCheck}
              label="Clean Sheets"
              value={stats.cleanSheets}
              delay={480}
              trend="stable"
            />
            <StatCard
              icon={BarChart3}
              label="Média de Gols"
              value={stats.mediaGols.toFixed(2)}
              delay={540}
              trend={goalsTrend}
            />
          </div>
        )}
      </section>

      {/* Divisão e Reputação */}
      <section className="relative py-12 sm:py-20 md:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
        {!loading && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Reveal delay={0}>
              <div className="glass-dark card-hover rounded-2xl p-8 border border-white/10 h-full">
                <DivisionProgressBar stats={stats} />
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="glass-dark card-hover rounded-2xl p-8 border border-white/10 h-full flex flex-col justify-center">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Próximo Objetivo</div>
                    <div className="text-3xl font-black text-white mb-4">Divisão {Math.floor((stats.wins * 3 + stats.draws) / 45) + 2}</div>
                    <p className="text-white/40 text-sm">Continue vencendo para subir de divisão!</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                    <div className="text-center">
                      <div className="text-xs text-white/40 font-bold uppercase tracking-widest mb-2">Vitórias</div>
                      <div className="text-2xl font-black text-green-400">{stats.wins}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-white/40 font-bold uppercase tracking-widest mb-2">Derrotas</div>
                      <div className="text-2xl font-black text-red-400">{stats.losses}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        )}
      </section>

      {/* Dashboard */}
      <section id="dashboard" className="relative py-12 sm:py-20 md:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
        <Reveal>
          <SectionLabel>Indicadores automáticos</SectionLabel>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 sm:mb-10 tracking-tighter">DASHBOARD</h2>
        </Reveal>

        {loading && <LoadingState />}
        {error && <ErrorState message={error} />}

        {stats && players.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            <DashboardCard
              title="Maior Goleador"
              name={topScorer?.name || "-"}
              sub={topScorer ? `${topScorer.goals} gols` : "-"}
              icon={Target}
              delay={0}
            />
            <DashboardCard
              title="Maior Assistente"
              name={topAssist?.name || "-"}
              sub={topAssist ? `${topAssist.assists} assistências` : "-"}
              icon={Zap}
              delay={50}
            />
            <DashboardCard
              title="Mais Participativo"
              name={mostParticipative?.name || "-"}
              sub={
                mostParticipative
                  ? `${mostParticipative.goals + mostParticipative.assists} contribuições`
                  : "-"
              }
              icon={Flame}
              delay={100}
            />
            <DashboardCard
              title="Melhor Média"
              name={bestAvg?.name || "-"}
              sub={bestAvg ? bestAvg.avgRating.toFixed(2) : "-"}
              icon={Star}
              delay={150}
            />
            <DashboardCard
              title="Forma Atual"
              name={
                stats.currentStreak.type
                  ? `${stats.currentStreak.count}x ${
                      stats.currentStreak.type === "W"
                        ? "Vitória"
                        : stats.currentStreak.type === "L"
                          ? "Derrota"
                          : "Empate"
                    }`
                  : "-"
              }
              sub="Sequência recente"
              icon={TrendingUp}
              delay={200}
            />
            <DashboardCard
              title="Melhor Sequência"
              name={`${stats.bestStreak}x`}
              sub="vitórias seguidas"
              icon={Trophy}
              delay={250}
            />
          </div>
        )}
      </section>

      {/* Elenco */}
      <MatchContextProvider matches={matches}>
        <Elenco players={players} loading={loading} />
      </MatchContextProvider>

      {/* Formação */}
      <CampoTatico players={players} loading={loading} />

      {/* Histórico */}
      <MatchHistory matches={matches} loading={loading} />

      {/* Hall da Fama */}
      {!loading && stats && (
        <HallOfFame players={players} stats={stats} matches={matches} />
      )}

      {/* Comunidade */}
      <CommunitySection />

      </main>
      <Footer />
    </div>
  );
}
