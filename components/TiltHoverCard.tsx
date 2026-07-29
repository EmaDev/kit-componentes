"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltHoverCardProps { children: React.ReactNode; max?: number; glare?: boolean; className?: string }
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Tarjeta que se inclina en 3D siguiendo el cursor — para destacar un producto o feature. */
export function TiltHoverCard({ children, max = 12, glare = true, className = "" }: TiltHoverCardProps) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(y, [0, 1], [max, -max]), { stiffness: 220, damping: 20 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-max, max]), { stiffness: 220, damping: 20 });
  const glareX = useTransform(x, v => `${v * 100}%`);
  const glareY = useTransform(y, v => `${v * 100}%`);

  return (
    <motion.div
      onPointerMove={e => {
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width);
        y.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => { x.set(0.5); y.set(0.5); }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={cn("relative rounded-2xl border border-border bg-surface overflow-hidden [perspective:800px]", className)}>
      {children}
      {glare && (
        <motion.div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.25), transparent 60%)` }}/>
      )}
    </motion.div>
  );
}
