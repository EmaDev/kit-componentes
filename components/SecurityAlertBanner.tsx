"use client";
import { useState } from "react";

export type SecurityAlertKind = "new-device" | "password-changed" | "suspicious-login" | "email-changed";
interface SecurityAlertBannerProps {
  kind: SecurityAlertKind;
  detail?: string;
  onReview?: () => void;
  onDismiss?: () => void;
  className?: string;
}
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const COPY: Record<SecurityAlertKind, { title: string; icon: React.ReactNode }> = {
  "new-device": { title: "Iniciaste sesión desde un dispositivo nuevo", icon: <g><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></g> },
  "password-changed": { title: "Tu contraseña fue cambiada", icon: <g><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></g> },
  "suspicious-login": { title: "Detectamos un intento de acceso sospechoso", icon: <g><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></g> },
  "email-changed": { title: "El correo de tu cuenta fue actualizado", icon: <g><path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/><polyline points="21,7 12,13 3,7"/></g> },
};

/** Banner de alerta de seguridad de cuenta: nuevo dispositivo, cambio de clave, login sospechoso. */
export function SecurityAlertBanner({ kind, detail, onReview, onDismiss, className = "" }: SecurityAlertBannerProps) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  const c = COPY[kind];
  const critical = kind === "suspicious-login";

  return (
    <div className={cn("rounded-xl border px-4 py-3.5 flex items-start gap-3", critical ? "border-danger/30 bg-danger/6" : "border-primary/25 bg-primary/6", className)}>
      <span className={cn("shrink-0 w-9 h-9 rounded-full inline-flex items-center justify-center", critical ? "bg-danger/15 text-danger" : "bg-primary/15 text-primary")}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{c.icon}</svg>
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-foreground">{c.title}</p>
        {detail && <p className="mt-0.5 text-xs text-muted leading-relaxed">{detail}</p>}
        <div className="mt-2 flex items-center gap-3">
          {onReview && <button type="button" onClick={onReview} className={cn("text-xs font-bold hover:underline", critical ? "text-danger" : "text-primary")}>{critical ? "No fui yo — revisar" : "Ver detalle"}</button>}
        </div>
      </div>
      <button type="button" onClick={() => { setVisible(false); onDismiss?.(); }} aria-label="Cerrar" className="shrink-0 w-7 h-7 rounded-lg text-muted hover:bg-black/5 inline-flex items-center justify-center transition-colors">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  );
}
