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
  const isNumber = typeof value === 'number';
  const numericValue = isNumber ? value : parseFloat(value.toString().replace(/[^0-9.]/g, '')) || 0;
  const suffix = isNumber ? '' : value.toString().replace(/[0-9.]/g, '');

  // Determinar cor do glow baseado na tendência
  const glowColor = {
    up: "from-green-500/30 to-emerald-500/30",
    down: "from-red-500/30 to-orange-500/30",
    stable: "from-blue-500/30 to-cyan-500/30",
  }[trend];

  const glowBorder = {
    up: "group-hover:border-green-500/50",
    down: "group-hover:border-red-500/50",
    stable: "group-hover:border-blue-500/50",
  }[trend];

  const glowText = {
    up: "text-green-400",
    down: "text-red-400",
    stable: "text-cyan-400",
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
        whileHover={{ y: -8 }}
        className={`glass-dark card-hover rounded-2xl p-4 sm:p-6 h-full flex flex-col justify-between relative overflow-hidden group border border-white/10 transition-all duration-300 ${glowBorder}`}
      >
        {/* Glow Background Dinâmico */}
        <div className={`absolute -right-4 -top-4 w-32 h-32 bg-gradient-to-br ${glowColor} blur-3xl rounded-full group-hover:blur-2xl transition-all duration-300`} />
        
        {/* Borda de Destaque */}
        <div className="absolute top-0 left-0 w-1 h-0 bg-gradient-to-b from-white to-transparent group-hover:h-full transition-all duration-500" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="p-1.5 sm:p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-white/30 transition-colors">
              <Icon size={16} className="sm:w-[18px] sm:h-[18px] text-white/70 group-hover:text-white transition-colors" />
            </div>
            <div className="flex gap-1">
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="w-1 h-1 rounded-full bg-white/20" />
            </div>
          </div>
          
          <div>
            <div className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-1 sm:mb-2 tracking-tighter flex items-baseline">
              {isNumber || !isNaN(numericValue) ? (
                <>
                  {displayValue.toFixed(numericValue % 1 === 0 ? 0 : 1)}
                  <span className="text-sm sm:text-2xl ml-1 opacity-50">{suffix}</span>
                </>
              ) : (
                value
              )}
            </div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-white/40 font-bold mb-3">
              {label}
            </div>

            {/* Sparkline Chart */}
            {chartData.length > 0 && (
              <div className="h-8 w-full opacity-60 group-hover:opacity-100 transition-opacity">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 2, right: 2, left: -20, bottom: 2 }}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={trend === "up" ? "#10b981" : trend === "down" ? "#ef4444" : "#06b6d4"}
                      strokeWidth={1.5}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Trend Indicator */}
            {trend !== "stable" && (
              <div className={`text-xs font-bold mt-2 flex items-center gap-1 ${glowText}`}>
                {trend === "up" ? "↑ Crescendo" : "↓ Decrescendo"}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Reveal>
  );
}
