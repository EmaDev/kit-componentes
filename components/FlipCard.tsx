"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, type ReactNode } from "react";

interface FlipCardProps {
  front: ReactNode;
  back: ReactNode;
  /** controlado desde afuera; si se omite, voltea al tocarla */
  flipped?: boolean;
  onFlipChange?: (flipped: boolean) => void;
  /** eje de rotación. Default: "y" */
  axis?: "x" | "y";
  /** relación de aspecto. Default: 1.586 (tarjeta ISO 7810) */
  aspect?: number;
  className?: string;
}

/**
 * Contenedor 3D de dos caras. Preserva la perspectiva y oculta la cara trasera,
 * así que sirve para tarjetas de crédito, fichas o reveals.
 */
export function FlipCard({
  front, back, flipped, onFlipChange, axis = "y", aspect = 1.586, className = "",
}: FlipCardProps) {
  const [inner, setInner] = useState(false);
  const isFlipped = flipped ?? inner;
  const toggle = () => {
    if (onFlipChange) onFlipChange(!isFlipped);
    else setInner((v) => !v);
  };

  const rotate = axis === "y"
    ? { rotateY: isFlipped ? 180 : 0 }
    : { rotateX: isFlipped ? 180 : 0 };
  const backRotate = axis === "y" ? "rotateY(180deg)" : "rotateX(180deg)";

  return (
    <div
      className={`relative select-none ${className}`}
      style={{ perspective: 1400, aspectRatio: String(aspect) }}
      onClick={toggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } }}
      aria-pressed={isFlipped}
    >
      <motion.div
        className="relative w-full h-full cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
        animate={rotate}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
      >
        <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>{front}</div>
        <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", transform: backRotate }}>{back}</div>
      </motion.div>
    </div>
  );
}

export interface CreditCardData {
  number: string;
  holder: string;
  expiry: string;
  cvc: string;
  brand?: "visa" | "mastercard" | "amex" | "generic";
  label?: string;
}

interface CreditCardProps {
  data: CreditCardData;
  /** gradiente o color de fondo */
  theme?: "dark" | "brand" | "steel" | string;
  /** enmascarar el número salvo los últimos 4. Default: false */
  masked?: boolean;
  flipped?: boolean;
  onFlipChange?: (flipped: boolean) => void;
  className?: string;
}

const THEMES: Record<string, string> = {
  dark: "linear-gradient(135deg,#1f2937 0%,#0b1220 100%)",
  brand: "linear-gradient(135deg,var(--color-primary) 0%,var(--color-accent) 100%)",
  steel: "linear-gradient(135deg,#64748b 0%,#334155 100%)",
};

/** Tarjeta de crédito volteable: frente con número, dorso con banda y CVC. */
export function CreditCard({
  data, theme = "dark", masked = false, flipped, onFlipChange, className = "",
}: CreditCardProps) {
  const bg = THEMES[theme] ?? theme;
  const groups = data.number.replace(/\s+/g, "").match(/.{1,4}/g) ?? [];
  const shown = masked
    ? groups.map((g, i) => (i < groups.length - 1 ? "••••" : g))
    : groups;

  const face = "absolute inset-0 rounded-2xl overflow-hidden text-white shadow-xl shadow-black/25";

  return (
    <FlipCard
      className={className}
      flipped={flipped}
      onFlipChange={onFlipChange}
      front={
        <div className={face} style={{ background: bg }}>
          <span className="absolute -right-10 -top-16 w-52 h-52 rounded-full bg-white/10" />
          <span className="absolute -right-24 -top-4 w-52 h-52 rounded-full bg-white/[0.06]" />
          <div className="relative h-full p-5 flex flex-col">
            <div className="flex items-start justify-between">
              <span className="w-11 h-8 rounded-[5px] bg-gradient-to-br from-[#f7e7a1] to-[#c9a94a] shadow-inner" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                {data.label ?? "Débito"}
              </span>
            </div>
            <div className="mt-auto">
              <div className="flex items-center gap-3 font-mono text-[clamp(15px,4.4cqw,21px)] tracking-[0.12em] tabular-nums">
                {shown.map((g, i) => <span key={i}>{g}</span>)}
              </div>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-white/50">Titular</p>
                  <p className="text-[13px] font-semibold uppercase tracking-wide truncate">{data.holder}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-white/50">Vence</p>
                  <p className="text-[13px] font-semibold tabular-nums">{data.expiry}</p>
                </div>
                <BrandMark brand={data.brand ?? "generic"} />
              </div>
            </div>
          </div>
        </div>
      }
      back={
        <div className={face} style={{ background: bg }}>
          <div className="relative h-full flex flex-col">
            <div className="h-11 mt-5 bg-black/70" />
            <div className="px-5 mt-4">
              <div className="rounded-md bg-white h-9 flex items-center justify-end px-3 gap-3">
                <span className="flex-1 h-4 rounded-sm bg-[repeating-linear-gradient(45deg,#e2e8f0_0_6px,#f8fafc_6px_12px)]" />
                <span className="font-mono text-[13px] font-bold text-[#0f172a] tabular-nums">{data.cvc}</span>
              </div>
              <p className="text-[9px] text-white/50 mt-2 uppercase tracking-[0.14em]">Código de seguridad</p>
            </div>
            <p className="mt-auto p-5 text-[9px] leading-relaxed text-white/40">
              Esta tarjeta es propiedad del emisor. El uso implica la aceptación de los términos vigentes.
            </p>
          </div>
        </div>
      }
    />
  );
}

function BrandMark({ brand }: { brand: NonNullable<CreditCardData["brand"]> }) {
  if (brand === "mastercard") {
    return (
      <span className="shrink-0 flex items-center">
        <span className="w-6 h-6 rounded-full bg-[#eb001b]" />
        <span className="w-6 h-6 rounded-full bg-[#f79e1b] -ml-3 mix-blend-hard-light" />
      </span>
    );
  }
  if (brand === "visa") {
    return <span className="shrink-0 text-[17px] font-black italic tracking-tight">VISA</span>;
  }
  if (brand === "amex") {
    return <span className="shrink-0 text-[11px] font-black tracking-tight leading-none text-right">AMERICAN<br />EXPRESS</span>;
  }
  return (
    <span className="shrink-0 flex gap-1">
      <span className="w-5 h-5 rounded-full bg-white/25" />
      <span className="w-5 h-5 rounded-full bg-white/40 -ml-2.5" />
    </span>
  );
}

/** Pila de tarjetas: la de arriba se puede voltear, las de atrás asoman. */
export function CreditCardStack({
  cards, className = "",
}: { cards: (CreditCardProps & { id: string })[]; className?: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence initial={false}>
        {cards.map((c, i) => {
          const offset = (i - activeIndex + cards.length) % cards.length;
          if (offset > 2) return null;
          return (
            <motion.div
              key={c.id}
              animate={{ y: offset * 14, scale: 1 - offset * 0.05, opacity: 1 - offset * 0.25, zIndex: cards.length - offset }}
              transition={{ type: "spring", stiffness: 240, damping: 26 }}
              className={offset === 0 ? "relative" : "absolute inset-x-0 top-0"}
              onClick={() => { if (offset !== 0) { setActiveIndex(i); setFlipped(false); } }}
            >
              <CreditCard
                {...c}
                flipped={offset === 0 ? flipped : false}
                onFlipChange={offset === 0 ? setFlipped : undefined}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
