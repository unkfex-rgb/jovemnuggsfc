import { LucideIcon } from "lucide-react";
import { Reveal } from "./Reveal";
import { motion } from "framer-motion";
import { useState } from "react";

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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Reveal delay={delay}>
      <motion.div 
        whileHover={{ scale: 1.05, y: -8 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="glass-dark card-hover rounded-2xl p-4 sm:p-6 flex items-center gap-4 sm:gap-6 h-full relative overflow-hidden group border border-white/10 hover:border-white/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.2)]"
      >
        {/* Glow Background */}
        <motion.div 
          animate={isHovered ? { opacity: 1, scale: 1.2 } : { opacity: 0.5, scale: 1 }}
          className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-15 transition-opacity"
        >
          <Icon size={80} />
        </motion.div>

        {/* Gradient Glow */}
        <motion.div 
          animate={isHovered ? { opacity: 0.3 } : { opacity: 0 }}
          className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-cyan-500/30 to-blue-500/20 blur-2xl rounded-full"
        />
        
        {/* Icon Container */}
        <motion.div 
          animate={isHovered ? { scale: 1.15, rotate: 5 } : { scale: 1, rotate: 0 }}
          className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center bg-white/5 border border-white/10 shrink-0 group-hover:border-white/40 group-hover:bg-white/10 transition-all duration-300 relative"
        >
          <Icon size={18} className="sm:w-6 sm:h-6 text-white group-hover:text-cyan-400 transition-colors" />
          
          {/* Pulse effect */}
          <motion.div 
            animate={isHovered ? { scale: 1.5, opacity: 0 } : { scale: 1, opacity: 0.3 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 rounded-lg border border-white/20"
          />
        </motion.div>
        
        <div className="min-w-0 relative z-10">
          <motion.div 
            animate={isHovered ? { letterSpacing: "0.15em", color: "rgba(6, 182, 212, 0.8)" } : { letterSpacing: "0.2em", color: "rgba(255, 255, 255, 0.4)" }}
            className="text-[10px] uppercase text-white/40 mb-1 font-bold transition-all"
          >
            {title}
          </motion.div>
          <motion.div 
            animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
            className="text-lg sm:text-2xl font-bold text-white truncate leading-tight origin-left"
          >
            {name}
          </motion.div>
          <motion.div 
            animate={isHovered ? { color: "rgba(255, 255, 255, 0.7)" } : { color: "rgba(255, 255, 255, 0.5)" }}
            className="text-sm text-white/50 font-medium mt-1 transition-colors"
          >
            {sub}
          </motion.div>
        </div>
        
        {/* Bottom Gradient Line */}
        <motion.div 
          animate={isHovered ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
          className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent origin-left"
        />

        {/* Top Highlight */}
        <motion.div 
          animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />
      </motion.div>
    </Reveal>
  );
}
