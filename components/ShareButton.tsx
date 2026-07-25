"use client";

import { useEffect, useState } from "react";
import { useHaptics } from "../hooks/useHaptics";

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}

interface ShareButtonProps extends ShareData {
  /** apariencia: botón con texto, sólo icono, o FAB */
  variant?: "button" | "icon" | "ghost" | "fab";
  size?: "sm" | "md" | "lg";
  label?: string;
  /** fuerza el fallback aunque exista navigator.share (útil en desktop) */
  forceFallback?: boolean;
  onShared?: (method: string) => void;
  className?: string;
}

const SIZES = { sm: { h: 34, text: "text-xs", pad: "px-3", ic: 15 }, md: { h: 42, text: "text-sm", pad: "px-4", ic: 17 }, lg: { h: 50, text: "text-[15px]", pad: "px-5", ic: 19 } };

const ShareIcon = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v12" /><polyline points="8 7 12 3 16 7" /><path d="M20 14v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5" />
  </svg>
);

/** Botón de compartir: usa la hoja nativa del sistema y cae a un sheet propio cuando no existe. */
export function ShareButton({
  title, text, url, variant = "button", size = "md",
  label = "Compartir", forceFallback = false, onShared, className = "",
}: ShareButtonProps) {
  const { haptic } = useHaptics();
  const [sheet, setSheet] = useState(false);
  const [copied, setCopied] = useState(false);
  const [native, setNative] = useState(false);
  const s = SIZES[size];

  useEffect(() => { setNative(typeof navigator !== "undefined" && !!navigator.share && !forceFallback); }, [forceFallback]);

  const link = url ?? (typeof window !== "undefined" ? window.location.href : "");
  const payload = { title, text, url: link };

  const share = async () => {
    haptic("tap");
    if (native) {
      try {
        await navigator.share(payload);
        onShared?.("native");
        return;
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return;
      }
    }
    setSheet(true);
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(link); } catch { /* noop */ }
    haptic("success");
    setCopied(true);
    onShared?.("copy");
    setTimeout(() => { setCopied(false); setSheet(false); }, 1100);
  };

  const targets = [
    { id: "whatsapp", label: "WhatsApp", tone: "#25D366", href: `https://wa.me/?text=${encodeURIComponent(`${text ?? title ?? ""} ${link}`.trim())}` },
    { id: "telegram", label: "Telegram", tone: "#229ED9", href: `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text ?? title ?? "")}` },
    { id: "mail", label: "Email", tone: "var(--color-accent)", href: `mailto:?subject=${encodeURIComponent(title ?? "")}&body=${encodeURIComponent(`${text ?? ""} ${link}`.trim())}` },
    { id: "sms", label: "Mensaje", tone: "var(--color-primary)", href: `sms:?&body=${encodeURIComponent(`${text ?? ""} ${link}`.trim())}` },
  ];

  const trigger =
    variant === "fab" ? (
      <button type="button" onClick={share} aria-label={label}
        className={`w-14 h-14 rounded-full grid place-items-center bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-hover active:scale-90 transition-all ${className}`}>
        <ShareIcon size={22} />
      </button>
    ) : variant === "icon" || variant === "ghost" ? (
      <button type="button" onClick={share} aria-label={label}
        className={`grid place-items-center rounded-xl text-foreground transition-all active:scale-90 ${variant === "icon" ? "bg-surface-alt border border-border hover:bg-border/50" : "hover:bg-surface-alt"} ${className}`}
        style={{ width: s.h, height: s.h }}>
        <ShareIcon size={s.ic} />
      </button>
    ) : (
      <button type="button" onClick={share}
        className={`inline-flex items-center gap-2 rounded-xl font-semibold bg-surface-alt border border-border text-foreground hover:bg-border/50 hover:-translate-y-px active:scale-[0.97] active:translate-y-0 transition-all ${s.pad} ${s.text} ${className}`}
        style={{ height: s.h }}>
        <ShareIcon size={s.ic} /> {label}
      </button>
    );

  return (
    <>
      {trigger}

      {sheet && (
        <div className="fixed inset-0 z-[190] flex items-end sm:items-center sm:justify-center" role="dialog" aria-modal="true" aria-label="Compartir">
          <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" style={{ animation: "fadeIn 0.2s both" }} onClick={() => setSheet(false)} />
          <div className="relative w-full sm:max-w-sm bg-surface border-t sm:border border-border sm:rounded-3xl rounded-t-3xl p-5"
            style={{
              paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)",
              animation: "pwaSlideUp 0.32s cubic-bezier(0.16,1,0.3,1) both",
            }}>
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border sm:hidden" />
            <p className="text-base font-bold text-foreground tracking-tight">{label}</p>
            <p className="mt-0.5 text-xs text-muted truncate">{title ?? link}</p>

            <div className="mt-4 grid grid-cols-4 gap-2">
              {targets.map((t) => (
                <a key={t.id} href={t.href} target="_blank" rel="noopener noreferrer"
                  onClick={() => { onShared?.(t.id); setSheet(false); }}
                  className="flex flex-col items-center gap-1.5 py-2 rounded-xl hover:bg-surface-alt active:scale-95 transition-all">
                  <span className="w-11 h-11 rounded-full grid place-items-center text-white" style={{ background: t.tone }}>
                    <ShareIcon size={18} />
                  </span>
                  <span className="text-[10px] font-semibold text-muted">{t.label}</span>
                </a>
              ))}
            </div>

            <button type="button" onClick={copy}
              className="mt-4 w-full h-12 rounded-xl border border-border bg-surface-alt/60 px-3 flex items-center gap-3 text-left hover:bg-surface-alt active:scale-[0.99] transition-all">
              <span className={`w-8 h-8 rounded-lg grid place-items-center shrink-0 ${copied ? "bg-success/15 text-success" : "bg-foreground/8 text-foreground"}`}>
                {copied ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                )}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-foreground">{copied ? "¡Enlace copiado!" : "Copiar enlace"}</span>
                <span className="block text-[11px] text-muted truncate">{link}</span>
              </span>
            </button>

            <button type="button" onClick={() => setSheet(false)}
              className="mt-2 w-full h-11 rounded-xl text-sm font-semibold text-muted hover:bg-surface-alt transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
