import { LucideIcon } from "lucide-react";
import { Reveal } from "./Reveal";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  delay?: number;
}

export function StatCard({ icon: Icon, label, value, delay = 0 }: StatCardProps) {
  return (
    <Reveal delay={delay}>
      <div className="glass card-hover rounded-2xl p-6 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between mb-6">
          <Icon size={20} className="text-white/50" />
          <span className="w-2 h-2 rounded-full bg-white/20" />
        </div>
        <div>
          <div className="text-4xl md:text-5xl font-bold text-white mb-2">
            {value}
          </div>
          <div className="text-xs tracking-widest uppercase text-white/45">
            {label}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
