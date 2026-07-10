import { LucideIcon } from "lucide-react";
import { Reveal } from "./Reveal";
import { motion, useSpring, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  delay?: number;
  trend?: "up" | "down" | "stable";
  sparkData?: number[];
}

export function StatCard({ icon: Icon, label, value, delay = 0, trend = "stable", sparkData }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const isNumber = typeof value === 'number';
  const numericValue = isNumber ? value : parseFloat(value.toString().replace(/[^0-9.]/g, '')) || 0;
  const suffix = isNumber ? '' : value.toString().replace(/[0-9.]/g, '');

  // Determinar cor do glow baseado na tendência
  const glowColor = {
    up: "from-green-500/40 to-emerald-500/30",
    down: "from-red-500/40 to-orange-500/30",
    stable: "from-cyan-500/40 to-blue-500/30",
  }[trend];

  const glowBorder = {
    up: "group-hover:border-green-500/60",
    down: "group-hover:border-red-500/60",
    stable: "group-hover:border-cyan-500/60",
  }[trend];

  const glowText = {
    up: "text-green-400",
    down: "text-red-400",
    stable: "text-cyan-400",
  }[trend];

  const glowShadow = {
    up: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]",
    down: "group-hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]",
    stable: "group-hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]",
  }[trend];

  useEffect(() => {
    const controls = animate(0, numericValue, {
      duration: 2,
      delay: delay / 1000 + 0.5,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(latest)
    });
    return () => controls.stop();
  }, [numericValue, delay]);

  // Preparar dados do sparkline
  const chartData = sparkData?.map((val, idx) => ({ value: val })) || [];

  return (
    <Reveal delay={delay}>
      <motion.div 
        whileHover={{ y: -12, scale: 1.02 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={`glass-dark card-hover rounded-2xl p-4 sm:p-6 h-full flex flex-col justify-between relative overflow-hidden group border border-white/10 transition-all duration-300 ${glowBorder} ${glowShadow}`}
      >
        {/* Glow Background Dinâmico - Aprimorado */}
        <motion.div 
          animate={isHovered ? { scale: 1.2, opacity: 1 } : { scale: 1, opacity: 0.8 }}
          className={`absolute -right-4 -top-4 w-40 h-40 bg-gradient-to-br ${glowColor} blur-3xl rounded-full transition-all duration-300`} 
        />
        
        {/* Borda de Destaque Animada */}
        <motion.div 
          animate={isHovered ? { height: "100%" } : { height: 0 }}
          className="absolute top-0 left-0 w-1 bg-gradient-to-b from-white to-transparent transition-all duration-500" 
        />

        {/* Efeito de brilho superior */}
        <motion.div 
          animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <motion.div 
              animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
              className="p-1.5 sm:p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-white/30 group-hover:bg-white/10 transition-all duration-300"
            >
              <Icon size={16} className="sm:w-[18px] sm:h-[18px] text-white/70 group-hover:text-white transition-colors" />
            </motion.div>
            <motion.div 
              animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
              className="flex gap-1"
            >
              <motion.span 
                animate={isHovered ? { opacity: 1, y: -2 } : { opacity: 0.3, y: 0 }}
                className="w-1 h-1 rounded-full bg-white/40" 
              />
              <motion.span 
                animate={isHovered ? { opacity: 1, y: -4 } : { opacity: 0.6, y: 0 }}
                className="w-1 h-1 rounded-full bg-white/60" 
              />
              <motion.span 
                animate={isHovered ? { opacity: 1, y: -2 } : { opacity: 0.3, y: 0 }}
                className="w-1 h-1 rounded-full bg-white/40" 
              />
            </motion.div>
          </div>
          
          <div>
            <motion.div 
              animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
              className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-1 sm:mb-2 tracking-tighter flex items-baseline origin-left"
            >
              {isNumber || !isNaN(numericValue) ? (
                <>
                  {displayValue.toFixed(numericValue % 1 === 0 ? 0 : 1)}
                  <span className="text-sm sm:text-2xl ml-1 opacity-50">{suffix}</span>
                </>
              ) : (
                value
              )}
            </motion.div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-white/40 font-bold mb-3 group-hover:text-white/60 transition-colors">
              {label}
            </div>

            {/* Sparkline Chart */}
            {chartData.length > 0 && (
              <motion.div 
                animate={isHovered ? { opacity: 1, scale: 1.02 } : { opacity: 0.6, scale: 1 }}
                className="h-8 w-full transition-all duration-300"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 2, right: 2, left: -20, bottom: 2 }}>
                    <Line
                      type="linear"
                      dataKey="value"
                      stroke={trend === "up" ? "#10b981" : trend === "down" ? "#ef4444" : "#06b6d4"}
                      strokeWidth={isHovered ? 2.5 : 1.5}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {/* Trend Indicator */}
            {trend !== "stable" && (
              <motion.div 
                animate={isHovered ? { x: 4 } : { x: 0 }}
                className={`text-xs font-bold mt-2 flex items-center gap-1 ${glowText} transition-colors`}
              >
                {trend === "up" ? "↑ Crescendo" : "↓ Decrescendo"}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </Reveal>
  );
}
