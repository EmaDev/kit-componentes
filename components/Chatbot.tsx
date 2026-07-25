"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
  /** ISO o Date; se muestra como hora local */
  at?: Date | number;
  /** chips de respuesta rápida que acompañan al mensaje del bot */
  quickReplies?: string[];
  /** estado de envío del usuario */
  status?: "sending" | "sent" | "error";
}

interface ChatbotProps {
  messages: ChatMessage[];
  /** devolvé una promesa: el input queda bloqueado y aparece el "escribiendo…" */
  onSend: (text: string) => void | Promise<void>;
  botName?: string;
  botStatus?: string;
  avatar?: React.ReactNode;
  /** true fuerza el indicador de escritura */
  typing?: boolean;
  placeholder?: string;
  /** sugerencias iniciales cuando no hay conversación */
  starters?: string[];
  /** floating = burbuja lanzadora; inline = embebido en tu layout */
  variant?: "floating" | "inline";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** badge en la burbuja cerrada */
  unread?: number;
  header?: React.ReactNode;
  footnote?: string;
  className?: string;
}

const timeOf = (at?: Date | number) => {
  if (!at) return "";
  const d = typeof at === "number" ? new Date(at) : at;
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

function Dots() {
  return (
    <span className="inline-flex items-center gap-1">
      {[0, 1, 2].map(i => (
        <motion.span key={i}
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          className="w-1.5 h-1.5 rounded-full bg-muted"/>
      ))}
    </span>
  );
}

/** Chatbot conversacional: burbujas, escribiendo…, respuestas rápidas y lanzador flotante. */
export function Chatbot({
  messages, onSend, botName = "Asistente", botStatus = "En línea", avatar,
  typing = false, placeholder = "Escribí tu mensaje…", starters = [],
  variant = "floating", open: openProp, onOpenChange, unread = 0,
  header, footnote, className = "",
}: ChatbotProps) {
  const [openState, setOpenState] = useState(variant === "inline");
  const open = openProp ?? openState;
  const setOpen = (v: boolean) => { setOpenState(v); onOpenChange?.(v); };

  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const thinking = typing || busy;

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, thinking, open]);

  const send = useCallback(async (text: string) => {
    const value = text.trim();
    if (!value || busy) return;
    setDraft("");
    setBusy(true);
    try { await onSend(value); } finally { setBusy(false); inputRef.current?.focus(); }
  }, [busy, onSend]);

  const panel = (
    <div className={`flex flex-col min-h-0 bg-surface ${variant === "inline" ? `rounded-2xl border border-border overflow-hidden ${className}` : "h-full"}`}>
      {/* header */}
      {header ?? (
        <div className="shrink-0 flex items-center gap-3 px-4 h-16 border-b border-border bg-surface-alt/60">
          <span className="relative w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent text-white inline-flex items-center justify-center shrink-0">
            {avatar ?? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 14h.01M15 14h.01"/>
              </svg>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success border-2 border-surface"/>
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-bold text-foreground truncate">{botName}</span>
            <span className="block text-[11px] text-muted truncate">{thinking ? "Escribiendo…" : botStatus}</span>
          </span>
          {variant === "floating" && (
            <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar chat"
              className="ml-auto w-8 h-8 rounded-lg inline-flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-alt transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          )}
        </div>
      )}

      {/* mensajes */}
      <div ref={scroller} className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && starters.length > 0 && (
          <div className="rounded-2xl border border-dashed border-border p-4">
            <p className="text-xs text-muted leading-relaxed">Podés empezar por acá:</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {starters.map(s => (
                <button key={s} type="button" onClick={() => send(s)}
                  className="h-8 px-3 rounded-full border border-border bg-surface text-xs font-semibold text-foreground hover:border-primary/40 hover:text-primary active:scale-95 transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map(m => (
            <motion.div key={m.id}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
              <div className={[
                "max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line",
                m.role === "user"
                  ? "bg-primary text-white rounded-2xl rounded-br-md"
                  : "bg-surface-alt border border-border text-foreground rounded-2xl rounded-bl-md",
                m.status === "error" ? "opacity-70" : "",
              ].join(" ")}>
                {m.text}
              </div>
              <span className="mt-1 px-1 text-[10px] text-muted tabular-nums">
                {m.status === "sending" ? "Enviando…" : m.status === "error" ? "No se pudo enviar" : timeOf(m.at)}
              </span>
              {m.role === "bot" && m.quickReplies && m.quickReplies.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-2">
                  {m.quickReplies.map(q => (
                    <button key={q} type="button" onClick={() => send(q)}
                      className="h-8 px-3 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/16 active:scale-95 transition-all">
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {thinking && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-2xl rounded-bl-md border border-border bg-surface-alt px-3.5 py-3">
            <Dots/>
          </motion.div>
        )}
      </div>

      {/* composer */}
      <div className="shrink-0 border-t border-border p-3"
        style={{ paddingBottom: "calc(0.75rem + var(--kb-inset, 0px))" }}>
        <div className="flex items-end gap-2">
          <textarea ref={inputRef} rows={1} value={draft} placeholder={placeholder}
            onChange={e => {
              setDraft(e.target.value);
              const el = e.target as HTMLTextAreaElement;
              el.style.height = "auto";
              el.style.height = `${Math.min(120, el.scrollHeight)}px`;
            }}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(draft); }
            }}
            className="flex-1 resize-none max-h-[120px] min-h-[42px] px-3.5 py-2.5 rounded-2xl border border-border bg-surface-alt text-sm text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors"/>
          <button type="button" onClick={() => send(draft)} disabled={!draft.trim() || busy} aria-label="Enviar"
            className="shrink-0 w-11 h-11 rounded-2xl bg-primary text-white inline-flex items-center justify-center shadow-md shadow-primary/25 disabled:opacity-35 disabled:shadow-none hover:bg-primary-hover active:scale-95 transition-all">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </div>
        {footnote && <p className="mt-2 text-[10px] text-muted text-center">{footnote}</p>}
      </div>
    </div>
  );

  if (variant === "inline") return panel;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className={`fixed z-50 right-4 bottom-4 sm:right-6 sm:bottom-6 w-[min(380px,calc(100vw-2rem))] h-[min(560px,calc(100vh-6rem))] rounded-3xl border border-border bg-surface shadow-2xl shadow-black/25 overflow-hidden ${className}`}
            style={{ marginBottom: "var(--sa-bottom, 0px)" }}>
            {panel}
          </motion.div>
        )}
      </AnimatePresence>

      {!open && (
        <motion.button type="button" onClick={() => setOpen(true)} aria-label="Abrir chat"
          initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          whileTap={{ scale: 0.92 }}
          className="fixed z-50 right-4 bottom-4 sm:right-6 sm:bottom-6 w-14 h-14 rounded-full bg-primary text-white inline-flex items-center justify-center shadow-xl shadow-primary/30"
          style={{ marginBottom: "var(--sa-bottom, 0px)" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8Z"/>
          </svg>
          {unread > 0 && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1 rounded-full bg-danger text-white text-[11px] font-bold inline-flex items-center justify-center border-2 border-surface tabular-nums">
              {unread}
            </motion.span>
          )}
        </motion.button>
      )}
    </>
  );
}
