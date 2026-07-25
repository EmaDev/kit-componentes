"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type RedirectTarget = "whatsapp" | "telegram" | "sms" | "mail" | "url";

interface RedirectTimerProps {
  /** plataforma de destino */
  target?: RedirectTarget;
  /** teléfono en formato internacional sin +, ej "5491122334455" */
  phone?: string;
  /** email cuando target="mail" */
  email?: string;
  /** URL directa cuando target="url" */
  url?: string;
  /** mensaje prellenado — el usuario puede editarlo si editable */
  message?: string;
  onMessageChange?: (message: string) => void;
  /** deja editar el mensaje antes de salir. Default true */
  editable?: boolean;
  /** segundos de cuenta atrás */
  seconds?: number;
  /** arranca solo. Default true */
  autoStart?: boolean;
  /** abre en pestaña nueva. Default true */
  newTab?: boolean;
  title?: string;
  description?: string;
  onRedirect?: (href: string) => void;
  onCancel?: () => void;
  className?: string;
}

const TARGETS: Record<RedirectTarget, { label: string; tone: string; icon: React.ReactNode }> = {
  whatsapp: {
    label: "WhatsApp", tone: "#25D366",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.97L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 14.13c-.24.68-1.42 1.3-1.96 1.35-.54.05-1.04.24-3.5-.72-2.96-1.17-4.8-4.25-4.95-4.45-.14-.2-1.15-1.54-1.15-2.94 0-1.4.73-2.09 1-2.38.26-.29.57-.36.76-.36l.55.01c.17 0 .41-.07.63.48.24.58.79 1.98.86 2.12.07.15.12.32.02.51-.1.2-.36.5-.53.72-.17.2-.28.32-.12.6.17.29.75 1.24 1.6 2 1.1.98 1.87 1.25 2.14 1.39.26.15.42.12.58-.07.17-.2.68-.79.86-1.06.19-.29.38-.24.63-.15.24.1 1.55.73 1.82.87.26.14.44.2.5.32.07.12.07.68-.17 1.35z" /></svg>,
  },
  telegram: {
    label: "Telegram", tone: "#229ED9",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M21.9 4.3 18.7 19.5c-.24 1.06-.87 1.32-1.76.82l-4.86-3.58-2.34 2.26c-.26.26-.48.48-.98.48l.35-4.95 9.02-8.15c.39-.35-.09-.54-.6-.2L6.38 13.2l-4.78-1.5c-1.04-.32-1.06-1.04.22-1.54l18.66-7.2c.86-.32 1.62.2 1.42 1.34z" /></svg>,
  },
  sms: {
    label: "SMS", tone: "var(--color-primary)",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
  },
  mail: {
    label: "Email", tone: "var(--color-accent)",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="22,6 12,13 2,6" /></svg>,
  },
  url: {
    label: "Sitio", tone: "var(--color-foreground)",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5" /><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7L12 19" /></svg>,
  },
};

export function buildRedirectHref(t: RedirectTarget, opts: { phone?: string; email?: string; url?: string; message?: string }) {
  const msg = encodeURIComponent(opts.message ?? "");
  const phone = (opts.phone ?? "").replace(/[^\d]/g, "");
  switch (t) {
    case "whatsapp": return `https://wa.me/${phone}${msg ? `?text=${msg}` : ""}`;
    case "telegram": return `https://t.me/${(opts.phone ?? "").replace(/^@/, "")}${msg ? `?text=${msg}` : ""}`;
    case "sms":      return `sms:${phone}${msg ? `?&body=${msg}` : ""}`;
    case "mail":     return `mailto:${opts.email ?? ""}${msg ? `?body=${msg}` : ""}`;
    default:         return opts.url ?? "#";
  }
}

/** Cuenta atrás con redirección a otra plataforma y mensaje ajustable. */
export function RedirectTimer({
  target = "whatsapp", phone, email, url, message = "", onMessageChange,
  editable = true, seconds = 8, autoStart = true, newTab = true,
  title, description, onRedirect, onCancel, className = "",
}: RedirectTimerProps) {
  const t = TARGETS[target];
  const [left, setLeft] = useState(seconds);
  const [running, setRunning] = useState(autoStart);
  const [text, setText] = useState(message);
  const fired = useRef(false);

  const href = useMemo(() => buildRedirectHref(target, { phone, email, url, message: text }), [target, phone, email, url, text]);

  const go = useCallback(() => {
    if (fired.current) return;
    fired.current = true;
    setRunning(false);
    onRedirect?.(href);
    if (newTab) window.open(href, "_blank", "noopener,noreferrer");
    else window.location.href = href;
  }, [href, newTab, onRedirect]);

  useEffect(() => { setText(message); }, [message]);

  useEffect(() => {
    if (!running) return;
    if (left <= 0) { go(); return; }
    const id = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(id);
  }, [running, left, go]);

  const pct = 1 - left / seconds;
  const R = 26, C = 2 * Math.PI * R;

  return (
    <div className={`rounded-2xl border border-border bg-surface p-5 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="relative w-16 h-16 shrink-0 grid place-items-center">
          <svg width="64" height="64" viewBox="0 0 64 64" className="absolute inset-0 -rotate-90">
            <circle cx="32" cy="32" r={R} fill="none" stroke="var(--color-border)" strokeWidth="4" />
            <circle cx="32" cy="32" r={R} fill="none" stroke={t.tone} strokeWidth="4" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C * (1 - pct)}
              style={{ transition: "stroke-dashoffset 1s linear" }} />
          </svg>
          <span className="text-lg font-bold tabular-nums text-foreground">{Math.max(0, left)}</span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: t.tone }}>{t.label}</p>
          <p className="mt-0.5 text-base font-bold text-foreground tracking-tight">
            {title ?? (running ? `Te llevamos a ${t.label}…` : fired.current ? `Abriendo ${t.label}` : "Redirección en pausa")}
          </p>
          <p className="mt-1 text-xs text-muted leading-relaxed">
            {description ?? (running
              ? `En ${left} segundo${left === 1 ? "" : "s"} se abre la conversación con el mensaje listo para enviar.`
              : "Revisá el mensaje y salí cuando quieras.")}
          </p>
        </div>
      </div>

      {editable && target !== "url" && (
        <label className="block mt-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">Mensaje</span>
          <textarea
            value={text} rows={3}
            onChange={(e) => { setText(e.target.value); onMessageChange?.(e.target.value); }}
            onFocus={() => setRunning(false)}
            className="mt-1.5 w-full rounded-xl border border-border bg-surface-alt/50 px-3 py-2.5 text-sm text-foreground leading-relaxed outline-none focus:border-primary transition-colors resize-none"
            placeholder="Hola, quiero consultar por…" />
          <span className="mt-1 block text-[11px] text-muted">{text.length} caracteres · se pre-carga en el chat</span>
        </label>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" onClick={go}
          className="h-11 px-4 rounded-xl text-sm font-bold text-white inline-flex items-center gap-2 active:scale-[0.97] transition-transform"
          style={{ background: t.tone, boxShadow: `0 8px 22px -12px ${t.tone}` }}>
          {t.icon} Ir ahora
        </button>
        <button type="button" onClick={() => setRunning((r) => !r)}
          className="h-11 px-4 rounded-xl text-sm font-semibold border border-border bg-surface text-foreground hover:bg-surface-alt active:scale-[0.97] transition-all">
          {running ? "Pausar" : "Reanudar"}
        </button>
        {onCancel && (
          <button type="button" onClick={() => { setRunning(false); onCancel(); }}
            className="h-11 px-3 rounded-xl text-sm font-medium text-muted hover:text-foreground transition-colors">
            Cancelar
          </button>
        )}
      </div>

      <p className="mt-3 text-[11px] font-mono text-muted break-all">{href}</p>
    </div>
  );
}
