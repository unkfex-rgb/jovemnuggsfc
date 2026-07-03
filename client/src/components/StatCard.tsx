import { LucideIcon } from "lucide-react";
import { Reveal } from "./Reveal";
import { motion, useSpring, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  delay?: number;
}

export function StatCard({ icon: Icon, label, value, delay = 0 }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const isNumber = typeof value === 'number';
  const numericValue = isNumber ? value : parseFloat(value.toString().replace(/[^0-9.]/g, '')) || 0;
  const suffix = isNumber ? '' : value.toString().replace(/[0-9.]/g, '');

  useEffect(() => {
    const controls = animate(0, numericValue, {
      duration: 2,
      delay: delay / 1000 + 0.5,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(latest)
    });
    return () => controls.stop();
  }, [numericValue, delay]);

  return (
    <Reveal delay={delay}>
      <motion.div 
        whileHover={{ y: -8 }}
        className="glass-dark card-hover rounded-2xl p-4 sm:p-6 h-full flex flex-col justify-between relative overflow-hidden group"
      >
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 blur-3xl rounded-full group-hover:bg-white/10 transition-colors" />
        
        <div className="flex items-center justify-between mb-4 sm:mb-8 relative z-10">
          <div className="p-1.5 sm:p-2 rounded-lg bg-white/5 border border-white/10">
            <Icon size={16} className="sm:w-[18px] sm:h-[18px] text-white/70 group-hover:text-white transition-colors" />
          </div>
          <div className="flex gap-1">
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span className="w-1 h-1 rounded-full bg-white/20" />
          </div>
        </div>
        
        <div className="relative z-10">
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
          <div className="text-[10px] tracking-[0.3em] uppercase text-white/40 font-bold">
            {label}
          </div>
        </div>
        
        <div className="absolute top-0 left-0 w-1 h-0 bg-white group-hover:h-full transition-all duration-500" />
      </motion.div>
    </Reveal>
  );
}
