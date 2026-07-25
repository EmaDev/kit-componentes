"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

export type CountdownVariant = "bar" | "boxes" | "flip";

interface CountdownBannerProps {
  /** fin de la promo */
  until: Date | number;
  title?: string;
  /** texto chico a la izquierda: «Hot Sale · sólo hoy» */
  eyebrow?: string;
  cta?: { label: string; onClick: () => void };
  variant?: CountdownVariant;
  tone?: "primary" | "danger" | "accent" | "dark";
  /** fija arriba o abajo de la pantalla */
  sticky?: "top" | "bottom" | false;
  /** se puede cerrar (y se recuerda por N días) */
  dismissible?: boolean;
  snoozeDays?: number;
  storageKey?: string;
  /** aviso al terminar; si no se pasa, el banner se esconde */
  expiredMessage?: ReactNode;
  onExpire?: () => void;
  className?: string;
}

const TONES = {
  primary: "bg-primary text-white",
  danger: "bg-danger text-white",
  accent: "bg-accent text-white",
  dark: "bg-foreground text-surface",
};

const two = (n: number) => String(Math.max(0, n)).padStart(2, "0");

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

/** Banner de cuenta regresiva: barra fina, cajas o flip, fijable y descartable. */
export function CountdownBanner({
  until, title = "La oferta termina en", eyebrow, cta, variant = "boxes",
  tone = "danger", sticky = false, dismissible = true, snoozeDays = 0,
  storageKey = "countdown.snooze", expiredMessage, onExpire, className = "",
}: CountdownBannerProps) {
  const deadline = typeof until === "number" ? until : until.getTime();
  const [left, setLeft] = useState(() => Math.max(0, deadline - Date.now()));
  const [closed, setClosed] = useState(false);
  const fired = useRef(false);

  useEffect(() => {
    if (snoozeDays > 0 && Number(localStorage.getItem(storageKey) ?? 0) > Date.now()) setClosed(true);
  }, [snoozeDays, storageKey]);

  useEffect(() => {
    const tick = () => {
      const ms = Math.max(0, deadline - Date.now());
      setLeft(ms);
      if (ms === 0 && !fired.current) { fired.current = true; onExpire?.(); }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline, onExpire]);

  const close = () => {
    if (snoozeDays > 0) localStorage.setItem(storageKey, String(Date.now() + snoozeDays * 864e5));
    setClosed(true);
  };

  const { d, h, m, s } = parts(left);
  const done = left === 0;
  const urgent = !done && left < 3600_000;
  const hide = closed || (done && !expiredMessage);

  const units = [
    ...(d > 0 ? [[two(d), "días"] as const] : []),
    [two(h), "hs"] as const,
    [two(m), "min"] as const,
    [two(s), "seg"] as const,
  ];

  const pos = sticky === "top" ? "fixed top-0 left-0 right-0 z-[120]"
    : sticky === "bottom" ? "fixed bottom-0 left-0 right-0 z-[120]" : "relative";

  return (
    <AnimatePresence>
      {!hide && (
        <motion.div
          initial={{ opacity: 0, y: sticky === "bottom" ? 24 : -24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: sticky === "bottom" ? 24 : -24 }}
          transition={{ type: "spring", stiffness: 360, damping: 30 }}
          className={`${pos} ${TONES[tone]} ${className}`}
          style={sticky === "bottom" ? { paddingBottom: "var(--sa-bottom, 0px)" } : sticky === "top" ? { paddingTop: "var(--sa-top, 0px)" } : undefined}>
          <div className="mx-auto max-w-7xl px-4 py-2.5 flex items-center gap-3 flex-wrap justify-center sm:justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <motion.span animate={urgent ? { scale: [1, 1.18, 1] } : {}} transition={{ duration: 1.2, repeat: urgent ? Infinity : 0 }}
                className="shrink-0 opacity-90">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              </motion.span>
              <p className="text-sm font-semibold leading-tight min-w-0">
                {eyebrow && <span className="opacity-70 font-bold uppercase tracking-wider text-[10px] block">{eyebrow}</span>}
                {done ? expiredMessage : title}
              </p>
            </div>

            {!done && (
              <div className="flex items-center gap-3">
                {variant === "bar" ? (
                  <p className="text-lg font-extrabold tabular-nums tracking-tight">
                    {d > 0 && `${two(d)}d `}{two(h)}:{two(m)}:{two(s)}
                  </p>
                ) : (
                  <div className="flex items-center gap-1.5">
                    {units.map(([v, l], i) => (
                      <span key={l} className="flex items-center gap-1.5">
                        <span className="flex flex-col items-center">
                          <span className="min-w-9 h-9 px-1.5 rounded-lg bg-black/25 grid place-items-center overflow-hidden">
                            {variant === "flip" ? (
                              <AnimatePresence mode="popLayout" initial={false}>
                                <motion.span key={v}
                                  initial={{ y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 18, opacity: 0 }}
                                  transition={{ type: "spring", stiffness: 520, damping: 34 }}
                                  className="text-sm font-extrabold tabular-nums">
                                  {v}
                                </motion.span>
                              </AnimatePresence>
                            ) : (
                              <span className="text-sm font-extrabold tabular-nums">{v}</span>
                            )}
                          </span>
                          <span className="mt-0.5 text-[9px] font-bold uppercase tracking-wider opacity-70">{l}</span>
                        </span>
                        {i < units.length - 1 && <span className="text-sm font-bold opacity-40 -mt-3">:</span>}
                      </span>
                    ))}
                  </div>
                )}

                {cta && (
                  <button type="button" onClick={cta.onClick}
                    className="h-9 px-4 rounded-xl bg-surface text-foreground text-xs font-bold shadow-md shadow-black/15 hover:-translate-y-px active:scale-95 transition-all">
                    {cta.label}
                  </button>
                )}
              </div>
            )}

            {dismissible && (
              <button type="button" onClick={close} aria-label="Cerrar aviso"
                className="w-8 h-8 rounded-lg grid place-items-center opacity-60 hover:opacity-100 hover:bg-black/15 transition-all shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>

          {/* barra de progreso del tiempo restante (variant="bar") */}
          {variant === "bar" && !done && (
            <div className="h-0.5 bg-black/20">
              <motion.div className="h-full bg-white/70"
                animate={{ width: `${Math.min(100, (left / 864e5) * 100)}%` }}
                transition={{ ease: "linear", duration: 1 }}/>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
