import { motion } from "framer-motion";

export function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full"
      />
    </div>
  );
}
