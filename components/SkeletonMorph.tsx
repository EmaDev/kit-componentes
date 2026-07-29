"use client";
import { AnimatePresence, motion } from "framer-motion";

interface SkeletonMorphProps { loading: boolean; skeleton: React.ReactNode; children: React.ReactNode; className?: string }
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Transición cross-fade + escala suave entre el skeleton y el contenido real, en vez de un corte seco. */
export function SkeletonMorph({ loading, skeleton, children, className = "" }: SkeletonMorphProps) {
  return (
    <div className={cn("relative", className)}>
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.985 }} transition={{ duration: 0.25 }}>
            {skeleton}
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
