import { useProClub } from "@/hooks/useProClub";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import Elenco from "@/components/Elenco";
import MatchHistory from "@/components/MatchHistory";
import CampoTatico from "@/components/CampoTatico";
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

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-white selection:text-black">
      <Navbar />
      <Hero />

      {/* Estatísticas */}
      <section id="estatisticas" className="relative py-28 px-6 max-w-7xl mx-auto">
        <Reveal>
          <SectionLabel>Números do clube</SectionLabel>
          <h2 className="text-4xl md:text-6xl font-bold mb-10 tracking-tighter">ESTATÍSTICAS</h2>
        </Reveal>

        {loading && <LoadingState />}
        {error && <ErrorState message={error} />}

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <StatCard
              icon={Activity}
              label="Jogos"
              value={stats.total}
              delay={0}
            />
            <StatCard
              icon={Trophy}
              label="Vitórias"
              value={stats.wins}
              delay={60}
            />
            <StatCard
              icon={Minus}
              label="Empates"
              value={stats.draws}
              delay={120}
            />
            <StatCard
              icon={TrendingDown}
              label="Derrotas"
              value={stats.losses}
              delay={180}
            />
            <StatCard
              icon={Gauge}
              label="Aproveitamento"
              value={`${stats.aproveitamento}%`}
              delay={240}
            />
            <StatCard
              icon={Target}
              label="Gols Pró"
              value={stats.gf}
              delay={300}
            />
            <StatCard
              icon={Crosshair}
              label="Gols Contra"
              value={stats.ga}
              delay={360}
            />
            <StatCard
              icon={TrendingUp}
              label="Saldo"
              value={stats.saldo}
              delay={420}
            />
            <StatCard
              icon={ShieldCheck}
              label="Clean Sheets"
              value={stats.cleanSheets}
              delay={480}
            />
            <StatCard
              icon={BarChart3}
              label="Média de Gols"
              value={stats.mediaGols.toFixed(2)}
              delay={540}
            />
          </div>
        )}
      </section>

      {/* Dashboard */}
      <section id="dashboard" className="relative py-28 px-6 max-w-7xl mx-auto">
        <Reveal>
          <SectionLabel>Indicadores automáticos</SectionLabel>
          <h2 className="text-4xl md:text-6xl font-bold mb-10 tracking-tighter">DASHBOARD</h2>
        </Reveal>

        {loading && <LoadingState />}
        {error && <ErrorState message={error} />}

        {stats && players.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <Elenco players={players} loading={loading} />

      {/* Formação */}
      <CampoTatico players={players} loading={loading} />

      {/* Histórico */}
      <MatchHistory matches={matches} loading={loading} />

      {/* Comunidade */}
      <CommunitySection />

      <Footer />
    </div>
  );
}
