"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export interface ParallaxCardItem { id: string; title: string; description?: string; image?: string; depth?: number }
interface ParallaxScrollCardsProps { items: ParallaxCardItem[]; className?: string }
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

function ParallaxCard({ item, scrollYProgress, index }: { item: ParallaxCardItem; scrollYProgress: any; index: number }) {
  const depth = item.depth ?? (index % 3 === 0 ? 60 : index % 3 === 1 ? 30 : 90);
  const y = useTransform(scrollYProgress, [0, 1], [depth, -depth]);
  return (
    <motion.div style={{ y }} className="rounded-2xl border border-border bg-surface overflow-hidden shadow-sm">
      <div className="h-40" style={{ background: item.image ? `url(${item.image}) center/cover` : "linear-gradient(135deg,#2563eb,#7c3aed)" }}/>
      <div className="p-4">
        <p className="text-sm font-bold text-foreground">{item.title}</p>
        {item.description && <p className="mt-1 text-xs text-muted leading-relaxed">{item.description}</p>}
      </div>
    </motion.div>
  );
}

/** Tarjetas con profundidad de scroll: cada columna se mueve a distinta velocidad para dar sensación 3D. */
export function ParallaxScrollCards({ items, className = "" }: ParallaxScrollCardsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  return (
    <div ref={ref} className={cn("grid sm:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {items.map((item, i) => <ParallaxCard key={item.id} item={item} scrollYProgress={scrollYProgress} index={i}/>)}
    </div>
  );
}
