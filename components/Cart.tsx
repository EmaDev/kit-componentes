"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

export interface CartLine {
  id: string;
  title: string;
  /** subtítulo: talle, color, variante… */
  sub?: string;
  price: number;
  qty: number;
  image?: string;
}

const money = (n: number, currency = "ARS", locale = "es-AR") =>
  new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(n);

/* ============================================================
   CartButton — icono + badge que salta en cada incremento
   ============================================================ */
interface CartButtonProps {
  count: number;
  onClick?: () => void;
  /** también anima cuando baja. Default false (sólo al sumar) */
  animateDecrease?: boolean;
  /** qué se anima al cambiar: el icono entero o sólo el número. Default "icon" */
  bump?: "icon" | "count" | "none";
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "ghost" | "outline";
  label?: string;
  className?: string;
}

/** Botón de carrito: el badge entra con spring, salta al sumar y se va al vaciarse. */
export function CartButton({
  count, onClick, animateDecrease = false, bump = "icon", size = "md",
  variant = "ghost", label, className = "",
}: CartButtonProps) {
  const prev = useRef(count);
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (count > prev.current || (animateDecrease && count !== prev.current)) setBeat((b) => b + 1);
    prev.current = count;
  }, [count, animateDecrease]);

  const box = { sm: "w-9 h-9 rounded-lg", md: "w-11 h-11 rounded-xl", lg: "w-13 h-13 rounded-xl" }[size];
  const skin = {
    solid: "bg-primary text-white shadow-md shadow-primary/25 hover:bg-primary-hover",
    ghost: "text-foreground hover:bg-surface-alt",
    outline: "border border-border text-foreground hover:bg-surface-alt",
  }[variant];

  return (
    <button type="button" onClick={onClick} aria-label={label ?? `Carrito, ${count} artículos`}
      className={`relative inline-flex items-center justify-center transition-all active:scale-95 ${box} ${skin} ${className}`}>
      <motion.span key={bump === "icon" ? beat : "static"}
        animate={bump === "icon" ? { scale: [1, 0.86, 1.08, 1], rotate: [0, -6, 4, 0] } : {}}
        transition={{ duration: 0.42, ease: "easeOut" }} className="inline-flex">
        <svg width={size === "sm" ? 17 : 19} height={size === "sm" ? 17 : 19} viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="20" r="1.6"/><circle cx="18" cy="20" r="1.6"/>
          <path d="M2.5 3h2.2l2.4 11.2a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.55L21 8H6"/>
        </svg>
      </motion.span>

      <AnimatePresence>
        {count > 0 && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0, transition: { duration: 0.16 } }}
            transition={{ type: "spring", stiffness: 620, damping: 18 }}
            className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-danger text-white text-[10px] font-bold grid place-items-center tabular-nums shadow-sm shadow-danger/40">
            <motion.span key={count}
              initial={bump === "count" ? { scale: 0.6, opacity: 0.4 } : { y: -9, opacity: 0 }}
              animate={bump === "count" ? { scale: [0.6, 1.55, 1], opacity: 1 } : { y: 0, opacity: 1 }}
              transition={bump === "count"
                ? { duration: 0.42, times: [0, 0.45, 1], ease: "easeOut" }
                : { type: "spring", stiffness: 520, damping: 26 }}>
              {count > 99 ? "99+" : count}
            </motion.span>
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

/* ============================================================
   CartPanel — líneas con entrada/salida y vaciado en cascada
   ============================================================ */
interface CartPanelProps {
  lines: CartLine[];
  onQtyChange?: (id: string, qty: number) => void;
  onRemove?: (id: string) => void;
  /** vacía todo; el componente hace la cascada y después llama */
  onClear?: () => void;
  currency?: string;
  locale?: string;
  /** costo de envío ya calculado; 0 = gratis */
  shipping?: number;
  discount?: number;
  footer?: ReactNode;
  emptyState?: ReactNode;
  className?: string;
}

/** Lista del carrito: alta y baja animadas por línea y vaciado en cascada. */
export function CartPanel({
  lines, onQtyChange, onRemove, onClear, currency = "ARS", locale = "es-AR",
  shipping = 0, discount = 0, footer, emptyState, className = "",
}: CartPanelProps) {
  const [clearing, setClearing] = useState(false);

  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const total = Math.max(0, subtotal - discount + shipping);
  const items = lines.reduce((s, l) => s + l.qty, 0);

  const clear = () => {
    setClearing(true);
    setTimeout(() => { onClear?.(); setClearing(false); }, 120 * Math.min(lines.length, 6) + 240);
  };

  return (
    <div className={`flex flex-col min-h-0 ${className}`}>
      <div className="flex items-center justify-between gap-3 pb-3">
        <p className="text-sm font-bold text-foreground">
          Tu carrito <span className="text-muted font-medium tabular-nums">· {items}</span>
        </p>
        {lines.length > 0 && (
          <button type="button" onClick={clear} disabled={clearing}
            className="h-8 px-2.5 rounded-lg text-[11px] font-semibold text-muted hover:text-danger hover:bg-danger/8 disabled:opacity-40 transition-colors">
            Vaciar
          </button>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto -mx-1 px-1">
        <AnimatePresence initial={false} mode="popLayout">
          {lines.map((l, i) => (
            <motion.div key={l.id} layout
              initial={{ opacity: 0, y: 14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0, x: 40, scale: 0.94,
                transition: { duration: 0.22, delay: clearing ? Math.min(i, 6) * 0.06 : 0 },
              }}
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
              className="mb-2 flex items-center gap-3 rounded-xl border border-border bg-surface p-2.5">
              {l.image ? (
                <img src={l.image} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0"/>
              ) : (
                <span className="w-12 h-12 rounded-lg bg-surface-alt border border-border shrink-0"/>
              )}
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold text-foreground truncate">{l.title}</span>
                {l.sub && <span className="block text-[11px] text-muted truncate">{l.sub}</span>}
                <span className="block text-xs font-bold text-foreground mt-0.5 tabular-nums">{money(l.price * l.qty, currency, locale)}</span>
              </span>
              <span className="flex items-center gap-1 shrink-0">
                <QtyBtn label="Restar" onClick={() => (l.qty > 1 ? onQtyChange?.(l.id, l.qty - 1) : onRemove?.(l.id))}>−</QtyBtn>
                <span className="w-6 text-center text-sm font-bold text-foreground tabular-nums overflow-hidden">
                  <motion.span key={l.qty} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 520, damping: 28 }} className="block">
                    {l.qty}
                  </motion.span>
                </span>
                <QtyBtn label="Sumar" onClick={() => onQtyChange?.(l.id, l.qty + 1)}>+</QtyBtn>
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {lines.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="py-10 text-center">
            {emptyState ?? (
              <>
                <span className="mx-auto w-12 h-12 rounded-2xl bg-surface-alt border border-border grid place-items-center text-muted">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="20" r="1.6"/><circle cx="18" cy="20" r="1.6"/><path d="M2.5 3h2.2l2.4 11.2a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.55L21 8H6"/>
                  </svg>
                </span>
                <p className="mt-3 text-sm font-semibold text-foreground">Tu carrito está vacío</p>
                <p className="mt-1 text-xs text-muted">Sumá productos y aparecen acá.</p>
              </>
            )}
          </motion.div>
        )}
      </div>

      {lines.length > 0 && (
        <div className="pt-3 mt-1 border-t border-border space-y-1.5">
          <Row label="Subtotal" value={money(subtotal, currency, locale)}/>
          {discount > 0 && <Row label="Descuento" value={`− ${money(discount, currency, locale)}`} tone="success"/>}
          <Row label="Envío" value={shipping === 0 ? "Gratis" : money(shipping, currency, locale)} tone={shipping === 0 ? "success" : undefined}/>
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-bold text-foreground">Total</span>
            <motion.span key={total} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="text-lg font-bold text-foreground tabular-nums">
              {money(total, currency, locale)}
            </motion.span>
          </div>
          {footer}
        </div>
      )}
    </div>
  );
}

function QtyBtn({ children, onClick, label }: { children: ReactNode; onClick?: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={label}
      className="w-7 h-7 rounded-lg border border-border bg-surface text-foreground text-sm font-bold grid place-items-center hover:bg-surface-alt active:scale-90 transition-all">
      {children}
    </button>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "success" }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted">{label}</span>
      <span className={`font-semibold tabular-nums ${tone === "success" ? "text-success" : "text-foreground"}`}>{value}</span>
    </div>
  );
}

/* ============================================================
   useCart — estado mínimo con las acciones que animan
   ============================================================ */
export function useCart(initial: CartLine[] = []) {
  const [lines, setLines] = useState<CartLine[]>(initial);

  const add = (line: Omit<CartLine, "qty"> & { qty?: number }) =>
    setLines((prev) => {
      const found = prev.find((l) => l.id === line.id);
      if (found) return prev.map((l) => (l.id === line.id ? { ...l, qty: l.qty + (line.qty ?? 1) } : l));
      return [...prev, { ...line, qty: line.qty ?? 1 }];
    });

  const setQty = (id: string, qty: number) =>
    setLines((prev) => (qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty } : l))));

  const remove = (id: string) => setLines((prev) => prev.filter((l) => l.id !== id));
  const clear = () => setLines([]);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);

  return { lines, add, setQty, remove, clear, count, subtotal };
}
