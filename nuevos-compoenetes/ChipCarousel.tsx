"use client";

import { useEffect, useRef, useState } from "react";

export interface Chip {
  id: string;
  label: string;
  /** icono inline (svg) */
  icon?: React.ReactNode;
  /** imagen circular / cuadrada a la izquierda o de fondo */
  image?: string;
  /** segunda línea (sólo en size lg o layout "stack") */
  sub?: string;
  count?: number;
  disabled?: boolean;
}

export type ChipVariant = "soft" | "outline" | "solid" | "cover";
export type ChipSize = "sm" | "md" | "lg";

interface ChipCarouselProps {
  chips: Chip[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  multi?: boolean;
  variant?: ChipVariant;
  size?: ChipSize;
  /** permite deseleccionar tocando el chip activo. Default true */
  clearable?: boolean;
  /** flechas en desktop. Default true */
  arrows?: boolean;
  gap?: number;
  className?: string;
}

const SIZES: Record<ChipSize, { h: number; pad: string; text: string; img: number; radius: number }> = {
  sm: { h: 34, pad: "px-3",   text: "text-xs",  img: 20, radius: 17 },
  md: { h: 42, pad: "px-3.5", text: "text-sm",  img: 26, radius: 21 },
  lg: { h: 56, pad: "px-4",   text: "text-sm",  img: 36, radius: 16 },
};

/** Carrusel horizontal de chips con iconos, imágenes y títulos. Scroll con drag, snap y flechas. */
export function ChipCarousel({
  chips, value, onChange, multi = false, variant = "soft", size = "md",
  clearable = true, arrows = true, gap = 8, className = "",
}: ChipCarouselProps) {
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });
  const drag = useRef<{ x: number; scroll: number; moved: boolean } | null>(null);
  const s = SIZES[size];
  const selected = Array.isArray(value) ? value : value != null ? [value] : [];

  const readEdges = () => {
    const el = track.current;
    if (!el) return;
    setEdges({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  };

  useEffect(() => {
    readEdges();
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(readEdges);
    ro.observe(el);
    return () => ro.disconnect();
  }, [chips.length]);

  const toggle = (chip: Chip) => {
    if (chip.disabled || drag.current?.moved) return;
    if (multi) {
      const next = selected.includes(chip.id) ? selected.filter((v) => v !== chip.id) : [...selected, chip.id];
      onChange?.(next);
    } else {
      onChange?.(selected[0] === chip.id && clearable ? "" : chip.id);
    }
  };

  const nudge = (dir: 1 | -1) => {
    track.current?.scrollBy({ left: dir * Math.max(160, (track.current.clientWidth || 0) * 0.7), behavior: "smooth" });
  };

  const chipClasses = (on: boolean) => {
    if (variant === "cover") return on ? "text-white ring-2 ring-primary" : "text-white ring-1 ring-white/15";
    if (variant === "solid") return on
      ? "bg-primary text-white border-primary shadow-sm shadow-primary/30"
      : "bg-surface-alt text-foreground border-border hover:bg-border/50";
    if (variant === "outline") return on
      ? "bg-primary/8 text-primary border-primary"
      : "bg-transparent text-foreground border-border hover:border-muted/60";
    return on
      ? "bg-primary/12 text-primary border-primary/30"
      : "bg-surface-alt/70 text-foreground border-border/70 hover:bg-surface-alt";
  };

  return (
    <div className={`relative ${className}`}>
      <div
        ref={track}
        onScroll={readEdges}
        onPointerDown={(e) => {
          const el = track.current;
          if (!el) return;
          drag.current = { x: e.clientX, scroll: el.scrollLeft, moved: false };
        }}
        onPointerMove={(e) => {
          const el = track.current;
          if (!el || !drag.current) return;
          const dx = e.clientX - drag.current.x;
          if (Math.abs(dx) > 4) drag.current.moved = true;
          el.scrollLeft = drag.current.scroll - dx;
        }}
        onPointerUp={() => { setTimeout(() => { drag.current = null; }, 0); }}
        onPointerCancel={() => { drag.current = null; }}
        className="flex overflow-x-auto scrollbar-none snap-x snap-mandatory py-0.5"
        style={{ gap, scrollbarWidth: "none", touchAction: "pan-x pan-y" }}
        role="listbox"
        aria-orientation="horizontal"
        aria-multiselectable={multi}
      >
        {chips.map((chip) => {
          const on = selected.includes(chip.id);
          if (variant === "cover") {
            return (
              <button key={chip.id} type="button" role="option" aria-selected={on} disabled={chip.disabled}
                onClick={() => toggle(chip)}
                className={`relative shrink-0 snap-start overflow-hidden rounded-2xl transition-all active:scale-[0.97] disabled:opacity-40 ${chipClasses(on)}`}
                style={{ width: size === "lg" ? 148 : 116, height: size === "lg" ? 92 : 72 }}
              >
                {chip.image && <img src={chip.image} alt="" draggable={false} className="absolute inset-0 w-full h-full object-cover" />}
                <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-2 text-left">
                  <span className="flex items-center gap-1.5">
                    {chip.icon && <span className="[&_svg]:w-3.5 [&_svg]:h-3.5 opacity-90">{chip.icon}</span>}
                    <span className="text-xs font-semibold leading-tight truncate">{chip.label}</span>
                  </span>
                  {chip.sub && <span className="block text-[10px] text-white/70 truncate">{chip.sub}</span>}
                </span>
              </button>
            );
          }
          return (
            <button key={chip.id} type="button" role="option" aria-selected={on} disabled={chip.disabled}
              onClick={() => toggle(chip)}
              className={[
                "shrink-0 snap-start inline-flex items-center border font-semibold select-none",
                "transition-all active:scale-[0.96] disabled:opacity-40 disabled:pointer-events-none",
                s.pad, s.text, chipClasses(on),
              ].join(" ")}
              style={{ height: s.h, borderRadius: s.radius, gap: size === "sm" ? 6 : 8 }}
            >
              {chip.image ? (
                <img src={chip.image} alt="" draggable={false}
                  className="rounded-full object-cover shrink-0 -ml-1"
                  style={{ width: s.img, height: s.img }} />
              ) : chip.icon ? (
                <span className="shrink-0 [&_svg]:w-[1.05em] [&_svg]:h-[1.05em] opacity-90">{chip.icon}</span>
              ) : null}
              <span className="flex flex-col items-start leading-tight min-w-0">
                <span className="truncate">{chip.label}</span>
                {chip.sub && size === "lg" && (
                  <span className={`text-[11px] font-medium ${on ? "opacity-70" : "text-muted"}`}>{chip.sub}</span>
                )}
              </span>
              {chip.count != null && (
                <span className={`rounded-full px-1.5 text-[10px] font-bold tabular-nums ${on ? "bg-current/15" : "bg-foreground/8 text-muted"}`}>
                  {chip.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* degradados de borde */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-8 transition-opacity"
        style={{ opacity: edges.left ? 1 : 0, background: "linear-gradient(90deg, var(--color-surface), transparent)" }} />
      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-8 transition-opacity"
        style={{ opacity: edges.right ? 1 : 0, background: "linear-gradient(270deg, var(--color-surface), transparent)" }} />

      {arrows && (
        <>
          {edges.left && <ChipArrow side="left" onClick={() => nudge(-1)} />}
          {edges.right && <ChipArrow side="right" onClick={() => nudge(1)} />}
        </>
      )}
    </div>
  );
}

function ChipArrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label={side === "left" ? "Anterior" : "Siguiente"}
      className={[
        "hidden sm:grid place-items-center absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full z-10",
        side === "left" ? "-left-1" : "-right-1",
        "bg-surface/90 backdrop-blur border border-border text-foreground shadow-md shadow-black/10 hover:bg-surface active:scale-90 transition-all",
      ].join(" ")}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"
        style={{ transform: side === "left" ? "rotate(180deg)" : "none" }}>
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  );
}
