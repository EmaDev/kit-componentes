"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

export type PromoLayout = "center" | "side-image" | "bottom-sheet";

interface PromoPopupProps {
  open: boolean;
  onClose: () => void;
  eyebrow?: string;
  title: string;
  description?: string;
  /** el número grande: «30% OFF», «2x1»… */
  highlight?: string;
  image?: string;
  cta?: { label: string; onClick: () => void };
  secondary?: { label: string; onClick: () => void };
  /** captura de email antes del cupón */
  emailCapture?: { placeholder?: string; onSubmit: (email: string) => void | Promise<void>; note?: string };
  layout?: PromoLayout;
  /** ms antes de aparecer (para no interrumpir el primer scroll). Default 0 */
  delay?: number;
  /** no volver a mostrar por N días (localStorage). 0 = siempre */
  snoozeDays?: number;
  storageKey?: string;
  legal?: ReactNode;
  className?: string;
}

const KEY = "promo.snooze";

/** Popup de promociones: overlay, imagen, número grande y captura de email opcional. */
export function PromoPopup({
  open, onClose, eyebrow, title, description, highlight, image, cta, secondary,
  emailCapture, layout = "center", delay = 0, snoozeDays = 0, storageKey = KEY,
  legal, className = "",
}: PromoPopupProps) {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) { setVisible(false); return; }
    if (snoozeDays > 0) {
      const until = Number(localStorage.getItem(storageKey) ?? 0);
      if (until > Date.now()) return;
    }
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [open, delay, snoozeDays, storageKey]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") dismiss(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [visible]);

  const dismiss = () => {
    if (snoozeDays > 0) localStorage.setItem(storageKey, String(Date.now() + snoozeDays * 864e5));
    setVisible(false);
    onClose();
  };

  const submit = async () => {
    if (!email.includes("@")) return;
    setSending(true);
    try { await emailCapture?.onSubmit(email); setDone(true); }
    finally { setSending(false); }
  };

  const sheet = layout === "bottom-sheet";
  const side = layout === "side-image";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div className="fixed inset-0 z-[130] flex p-4"
          style={{ alignItems: sheet ? "flex-end" : "center", justifyContent: "center" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={dismiss}/>

          <motion.div role="dialog" aria-modal="true" aria-label={title}
            initial={sheet ? { y: "100%" } : { opacity: 0, scale: 0.94, y: 12 }}
            animate={sheet ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }}
            exit={sheet ? { y: "100%" } : { opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className={[
              "relative w-full bg-surface border border-border shadow-2xl shadow-black/30 overflow-hidden",
              sheet ? "rounded-t-3xl max-w-lg" : "rounded-3xl",
              side ? "max-w-2xl" : "max-w-md",
              className,
            ].join(" ")}>
            <button type="button" onClick={dismiss} aria-label="Cerrar"
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-lg grid place-items-center bg-surface/80 backdrop-blur border border-border text-muted hover:text-foreground active:scale-90 transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <div className={side ? "grid sm:grid-cols-2" : ""}>
              {image && (
                <div className={side ? "relative min-h-[220px]" : "relative h-40"}>
                  <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover"/>
                  {highlight && !side && (
                    <motion.span initial={{ scale: 0.6, rotate: -8, opacity: 0 }} animate={{ scale: 1, rotate: -6, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 380, damping: 16, delay: 0.12 }}
                      className="absolute -bottom-5 left-6 px-3 py-1.5 rounded-xl bg-danger text-white text-lg font-extrabold shadow-lg shadow-danger/35">
                      {highlight}
                    </motion.span>
                  )}
                </div>
              )}

              <div className={`p-6 ${image && !side ? "pt-8" : ""}`}>
                {eyebrow && (
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>
                )}
                {highlight && (side || !image) && (
                  <motion.p initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.08 }}
                    className="mt-1 text-4xl font-extrabold tracking-tight text-foreground">
                    {highlight}
                  </motion.p>
                )}
                <h2 className="mt-2 text-xl font-bold text-foreground tracking-tight text-pretty">{title}</h2>
                {description && <p className="mt-2 text-sm text-muted leading-relaxed text-pretty">{description}</p>}

                {emailCapture && !done ? (
                  <div className="mt-5 flex flex-col gap-2">
                    <div className="flex gap-2">
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
                        placeholder={emailCapture.placeholder ?? "tu@email.com"}
                        className="flex-1 h-11 px-3.5 rounded-xl border border-border bg-surface text-sm text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors"/>
                      <button type="button" onClick={submit} disabled={sending || !email.includes("@")}
                        className="h-11 px-4 rounded-xl bg-primary text-white text-sm font-semibold shadow-md shadow-primary/25 hover:bg-primary-hover disabled:opacity-40 active:scale-95 transition-all">
                        {sending ? "Enviando…" : (cta?.label ?? "Quiero el cupón")}
                      </button>
                    </div>
                    {emailCapture.note && <p className="text-[11px] text-muted">{emailCapture.note}</p>}
                  </div>
                ) : emailCapture && done ? (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-5 rounded-xl border border-success/30 bg-success/8 p-4 flex items-center gap-3">
                    <span className="text-success shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                    <p className="text-xs text-foreground font-medium">Listo, te mandamos el cupón por mail.</p>
                  </motion.div>
                ) : (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {cta && (
                      <button type="button" onClick={cta.onClick}
                        className="h-11 px-5 rounded-xl bg-primary text-white text-sm font-semibold shadow-md shadow-primary/25 hover:bg-primary-hover active:scale-95 transition-all">
                        {cta.label}
                      </button>
                    )}
                    {secondary && (
                      <button type="button" onClick={secondary.onClick}
                        className="h-11 px-4 rounded-xl text-sm font-semibold text-muted hover:text-foreground hover:bg-surface-alt transition-colors">
                        {secondary.label}
                      </button>
                    )}
                  </div>
                )}

                {legal && <p className="mt-4 text-[10px] text-muted leading-relaxed">{legal}</p>}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
