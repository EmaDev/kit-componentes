"use client";

import { motion } from "framer-motion";

export type SkeletonVariant = "text" | "circle" | "rect" | "rounded";
export type SkeletonAnimation = "pulse" | "wave" | "none";

interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number | string;
  animation?: SkeletonAnimation;
  className?: string;
}

const RADIUS: Record<SkeletonVariant, string> = {
  text: "rounded-md",
  circle: "rounded-full",
  rect: "rounded-none",
  rounded: "rounded-xl",
};

const DEFAULT_SIZE: Record<SkeletonVariant, number | string> = {
  text: 14,
  circle: 40,
  rect: 120,
  rounded: 120,
};

/** Bloque placeholder base: texto, círculo (avatar), rectángulo o redondeado. */
export function Skeleton({ variant = "text", width, height, animation = "pulse", className = "" }: SkeletonProps) {
  const w = width ?? (variant === "circle" ? DEFAULT_SIZE.circle : "100%");
  const h = height ?? DEFAULT_SIZE[variant];

  if (animation === "pulse") {
    return (
      <motion.span
        aria-hidden="true"
        className={`block bg-border ${RADIUS[variant]} ${className}`}
        style={{ width: w, height: h }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`relative block overflow-hidden bg-border ${RADIUS[variant]} ${className}`}
      style={{ width: w, height: h }}
    >
      {animation === "wave" && (
        <motion.span
          className="absolute inset-y-0 left-0 w-2/5"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)" }}
          animate={{ x: ["-100%", "250%"] }}
          transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </span>
  );
}

interface SkeletonTextProps {
  /** cantidad de líneas */
  lines?: number;
  animation?: SkeletonAnimation;
  /** ancho de la última línea, para simular el corte natural de un párrafo */
  lastLineWidth?: number | string;
  /** separación vertical entre líneas, en px */
  spacing?: number;
  className?: string;
}

/** Párrafo de N líneas, con la última más corta por default. */
export function SkeletonText({
  lines = 3,
  animation = "pulse",
  lastLineWidth = "70%",
  spacing = 8,
  className = "",
}: SkeletonTextProps) {
  return (
    <div className={`flex flex-col ${className}`} style={{ gap: spacing }}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          variant="text"
          animation={animation}
          width={i === lines - 1 && lines > 1 ? lastLineWidth : "100%"}
        />
      ))}
    </div>
  );
}

interface SkeletonAvatarProps {
  size?: number;
  animation?: SkeletonAnimation;
  className?: string;
}

/** Placeholder circular para avatares. */
export function SkeletonAvatar({ size = 40, animation = "pulse", className = "" }: SkeletonAvatarProps) {
  return <Skeleton variant="circle" width={size} height={size} animation={animation} className={`shrink-0 ${className}`} />;
}

interface SkeletonCardProps {
  animation?: SkeletonAnimation;
  /** bloque de imagen/media arriba */
  media?: boolean;
  mediaHeight?: number;
  /** avatar junto al título, ej. tarjeta de post/comentario */
  avatar?: boolean;
  lines?: number;
  className?: string;
}

/** Tarjeta compuesta: media opcional + título + párrafo (con avatar opcional). */
export function SkeletonCard({
  animation = "pulse",
  media = true,
  mediaHeight = 140,
  avatar = false,
  lines = 2,
  className = "",
}: SkeletonCardProps) {
  return (
    <div role="status" aria-label="Cargando" className={`rounded-2xl border border-border p-4 ${className}`}>
      {media && <Skeleton variant="rounded" height={mediaHeight} animation={animation} className="mb-4" />}
      <div className="flex items-start gap-3">
        {avatar && <SkeletonAvatar animation={animation} />}
        <div className="flex-1 min-w-0">
          <Skeleton variant="text" width="60%" height={16} animation={animation} className="mb-2" />
          <SkeletonText lines={lines} animation={animation} />
        </div>
      </div>
    </div>
  );
}

interface SkeletonListProps {
  rows?: number;
  avatar?: boolean;
  lines?: number;
  animation?: SkeletonAnimation;
  className?: string;
}

/** Lista/feed de N filas, cada una con avatar opcional + párrafo corto. */
export function SkeletonList({
  rows = 4,
  avatar = true,
  lines = 2,
  animation = "pulse",
  className = "",
}: SkeletonListProps) {
  return (
    <div role="status" aria-label="Cargando" className={`flex flex-col divide-y divide-border ${className}`}>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
          {avatar && <SkeletonAvatar size={36} animation={animation} />}
          <div className="flex-1 min-w-0">
            <SkeletonText lines={lines} animation={animation} lastLineWidth="40%" spacing={6} />
          </div>
        </div>
      ))}
    </div>
  );
}

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  header?: boolean;
  animation?: SkeletonAnimation;
  className?: string;
}

/** Grilla de tabla: header opcional + N filas × M columnas. */
export function SkeletonTable({
  rows = 5,
  columns = 4,
  header = true,
  animation = "pulse",
  className = "",
}: SkeletonTableProps) {
  const cols = { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` };
  return (
    <div role="status" aria-label="Cargando" className={`w-full ${className}`}>
      {header && (
        <div className="grid gap-4 pb-3 mb-3 border-b border-border" style={cols}>
          {Array.from({ length: columns }, (_, i) => (
            <Skeleton key={i} variant="text" height={12} width="50%" animation={animation} />
          ))}
        </div>
      )}
      <div className="flex flex-col gap-4">
        {Array.from({ length: rows }, (_, r) => (
          <div key={r} className="grid gap-4" style={cols}>
            {Array.from({ length: columns }, (_, c) => (
              <Skeleton key={c} variant="text" height={14} animation={animation} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
