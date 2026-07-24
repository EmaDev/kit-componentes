"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { type ReactNode } from "react";

/** Estilos de animación disponibles. */
export type SplashVariant =
  | "fade"    // sobrio: fade + leve subida, salida por opacidad
  | "pulse"   // anillos concéntricos que laten alrededor del icono
  | "orbit"   // punto orbitando el icono
  | "bars"    // barra de progreso bajo el logo
  | "zoom"    // el icono entra con spring y la pantalla escala al salir (estilo iOS)
  | "wipe";   // dos paneles que se abren revelando la app

interface SplashScreenProps {
  /** controla la visibilidad (usá useSplash() para el ciclo de vida) */
  visible: boolean;
  appName: string;
  /** texto corto bajo el nombre */
  tagline?: string;
  /** versión mostrada al pie, ej. "1.4.0" */
  version?: string;
  /** texto extra al pie (build, entorno, copyright) */
  footnote?: string;
  /** icono/logo. Un <img>, un svg o cualquier ReactNode */
  icon?: ReactNode;
  /** estilo de animación. Default: "fade" */
  variant?: SplashVariant;
  /** 0 → 1. Requerido por variant="bars" para la barra real */
  progress?: number;
  /** fondo: "surface" (tema), "brand" (gradiente primary→accent) o CSS custom */
  background?: "surface" | "brand" | "dark" | string;
  /** ocultar el nombre (logo-only) */
  hideName?: boolean;
  /** callback cuando la animación de salida terminó */
  onExited?: () => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export function SplashScreen({
  visible,
  appName,
  tagline,
  version,
  footnote,
  icon,
  variant = "fade",
  progress = 0,
  background = "surface",
  hideName = false,
  onExited,
}: SplashScreenProps) {
  const bg =
    background === "surface"
      ? "bg-surface"
      : background === "dark"
        ? "bg-foreground"
        : background === "brand"
          ? "bg-gradient-to-br from-primary to-accent"
          : "";
  const customBg = !["surface", "brand", "dark"].includes(background) ? background : undefined;
  const onBrand = background === "brand" || background === "dark";

  // salida propia de cada variante
  const shell: Variants = {
    initial: { opacity: variant === "zoom" ? 1 : 0 },
    animate: { opacity: 1 },
    exit:
      variant === "zoom"
        ? { opacity: 0, scale: 1.12, transition: { duration: 0.5, ease: EASE } }
        : variant === "wipe"
          ? { opacity: 1, transition: { duration: 0.6 } }
          : { opacity: 0, transition: { duration: 0.42, ease: "easeInOut" } },
  };

  return (
    <AnimatePresence onExitComplete={onExited}>
      {visible && (
        <motion.div
          role="status"
          aria-label={`Cargando ${appName}`}
          variants={shell}
          initial="initial"
          animate="animate"
          exit="exit"
          style={customBg ? { background: customBg } : undefined}
          className={`fixed inset-0 z-[200] overflow-hidden flex flex-col items-center justify-center ${bg}`}
        >
          {/* wipe: paneles que se separan al salir */}
          {variant === "wipe" && (
            <>
              <motion.div
                initial={{ y: 0 }} exit={{ y: "-100%" }}
                transition={{ duration: 0.6, ease: EASE }}
                className={`absolute inset-x-0 top-0 h-1/2 ${bg || ""}`}
                style={customBg ? { background: customBg } : undefined}
              />
              <motion.div
                initial={{ y: 0 }} exit={{ y: "100%" }}
                transition={{ duration: 0.6, ease: EASE }}
                className={`absolute inset-x-0 bottom-0 h-1/2 ${bg || ""}`}
                style={customBg ? { background: customBg } : undefined}
              />
            </>
          )}

          <motion.div
            className="relative z-10 flex flex-col items-center px-10"
            exit={variant === "wipe" ? { opacity: 0, scale: 0.94, transition: { duration: 0.26 } } : undefined}
          >
            <SplashMark variant={variant} icon={icon} onBrand={onBrand} />

            {!hideName && (
              <motion.div
                className="mt-7 text-center"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: variant === "fade" ? 0.18 : 0.3, duration: 0.5, ease: EASE }}
              >
                <h1 className={`text-2xl font-bold tracking-tight ${onBrand ? "text-white" : "text-foreground"}`}>
                  {appName}
                </h1>
                {tagline && (
                  <p className={`mt-1.5 text-sm ${onBrand ? "text-white/70" : "text-muted"}`}>{tagline}</p>
                )}
              </motion.div>
            )}

            {variant === "bars" && (
              <div className={`mt-8 h-1 w-40 rounded-full overflow-hidden ${onBrand ? "bg-white/20" : "bg-border"}`}>
                <motion.div
                  className={`h-full rounded-full ${onBrand ? "bg-white" : "bg-primary"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.round(progress * 100)}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
            )}
          </motion.div>

          {(version || footnote) && (
            <motion.div
              className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-1 pb-[max(2rem,calc(env(safe-area-inset-bottom)+1.5rem))]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              exit={variant === "wipe" ? { opacity: 0, transition: { duration: 0.2 } } : undefined}
            >
              {version && (
                <span className={`text-[11px] font-mono ${onBrand ? "text-white/60" : "text-muted"}`}>
                  v{version}
                </span>
              )}
              {footnote && (
                <span className={`text-[10px] ${onBrand ? "text-white/40" : "text-muted/70"}`}>{footnote}</span>
              )}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* =============================================================
   Marca / icono — cada variante tiene su propia animación
   ============================================================= */
function SplashMark({
  variant, icon, onBrand,
}: { variant: SplashVariant; icon?: ReactNode; onBrand: boolean }) {
  const plate = onBrand
    ? "bg-white/15 text-white backdrop-blur-sm"
    : "bg-gradient-to-br from-primary to-accent text-white shadow-xl shadow-primary/25";

  const box = (
    <div className={`w-20 h-20 rounded-[26px] flex items-center justify-center overflow-hidden ${plate}`}>
      {icon ?? <DefaultMark />}
    </div>
  );

  if (variant === "pulse") {
    return (
      <div className="relative grid place-items-center">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className={`absolute rounded-[34px] ${onBrand ? "bg-white/20" : "bg-primary/15"}`}
            style={{ width: 80, height: 80 }}
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: [1, 1.9], opacity: [0.55, 0] }}
            transition={{ duration: 2.1, repeat: Infinity, delay: i * 0.7, ease: "easeOut" }}
          />
        ))}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="relative"
        >
          {box}
        </motion.div>
      </div>
    );
  }

  if (variant === "orbit") {
    return (
      <div className="relative grid place-items-center w-[124px] h-[124px]">
        <motion.span
          className={`absolute inset-0 rounded-full border ${onBrand ? "border-white/20" : "border-border"}`}
        />
        <motion.span
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
        >
          <span
            className={`absolute left-1/2 -translate-x-1/2 -top-1 w-2.5 h-2.5 rounded-full ${onBrand ? "bg-white" : "bg-primary"}`}
          />
        </motion.span>
        <motion.div
          initial={{ opacity: 0, rotate: -8, scale: 0.9 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {box}
        </motion.div>
      </div>
    );
  }

  if (variant === "zoom") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 16 }}
      >
        {box}
      </motion.div>
    );
  }

  if (variant === "wipe") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 18, rotate: -6 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        {box}
      </motion.div>
    );
  }

  if (variant === "bars") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        {box}
      </motion.div>
    );
  }

  // fade
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      {box}
    </motion.div>
  );
}

function DefaultMark() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" />
    </svg>
  );
}
