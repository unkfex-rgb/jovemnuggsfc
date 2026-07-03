import { motion } from "framer-motion";

interface SectionLabelProps {
  children: React.ReactNode;
}

export function SectionLabel({ children }: SectionLabelProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="text-white/40 text-xs md:text-sm tracking-widest uppercase font-mono mb-3"
    >
      {children}
    </motion.div>
  );
}
