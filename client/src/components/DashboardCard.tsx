import { LucideIcon } from "lucide-react";
import { Reveal } from "./Reveal";
import { motion } from "framer-motion";

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
      <motion.div 
        whileHover={{ scale: 1.02, y: -5 }}
        className="glass-dark card-hover rounded-2xl p-4 sm:p-6 flex items-center gap-4 sm:gap-6 h-full relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Icon size={80} />
        </div>
        
        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center bg-white/5 border border-white/10 shrink-0 group-hover:border-white/30 transition-colors">
          <Icon size={18} className="sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform" />
        </div>
        
        <div className="min-w-0 relative z-10">
          <div className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1 font-bold">
            {title}
          </div>
          <div className="text-lg sm:text-2xl font-bold text-white truncate leading-tight group-hover:text-gradient transition-all">
            {name}
          </div>
          <div className="text-sm text-white/50 font-medium mt-1">{sub}</div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.div>
    </Reveal>
  );
}
