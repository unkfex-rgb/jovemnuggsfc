import { LucideIcon } from "lucide-react";
import { Reveal } from "./Reveal";

interface DashboardCardProps {
  title: string;
  name: string;
  sub: string;
  icon: LucideIcon;
  delay?: number;
}

export function DashboardCard({
  title,
  name,
  sub,
  icon: Icon,
  delay = 0,
}: DashboardCardProps) {
  return (
    <Reveal delay={delay}>
      <div className="glass card-hover rounded-2xl p-6 flex items-center gap-4 h-full">
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 shrink-0">
          <Icon size={20} className="text-white/70" />
        </div>
        <div className="min-w-0">
          <div className="text-xs tracking-widest uppercase text-white/40">
            {title}
          </div>
          <div className="text-xl font-bold text-white truncate">{name}</div>
          <div className="text-xs text-white/45">{sub}</div>
        </div>
      </div>
    </Reveal>
  );
}
