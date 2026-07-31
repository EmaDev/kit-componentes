"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { BottomSheet } from "./BottomSheet";

interface QuickNotePadProps {
  position?: "bottom-right" | "bottom-left" | "bottom-center";
  tone?: "primary" | "accent" | "success" | "danger";
  title?: string;
  placeholder?: string;
  /** si se pasa, el borrador se persiste en localStorage con esta key */
  storageKey?: string;
  onSave?: (text: string) => void;
  /** absolute en vez de fixed (para mocks dentro de un contenedor). Default: false */
  absolute?: boolean;
  className?: string;
}

const TONE_BG: Record<string, string> = {
  primary: "bg-primary text-white shadow-primary/30",
  accent: "bg-accent text-white shadow-accent/30",
  success: "bg-success text-white shadow-success/30",
  danger: "bg-danger text-white shadow-danger/30",
};

const POS: Record<string, string> = {
  "bottom-right": "right-4",
  "bottom-left": "left-4",
  "bottom-center": "left-1/2 -translate-x-1/2",
};

const EMOJI_QUICK = "😀 😂 🙂 😉 😍 🥳 🤔 😢 😮 😡 👍 👏 🙏 💪 🔥 ✨ 🎉 ✅ ❌ ❤️ ⭐ 💡 📌 📝".split(" ");
const BULLET_RE = /^(\s*)([•\-]|\d+\.)\s/;

/** Toma el texto y una función de línea, aplica/quita el prefijo sobre las líneas seleccionadas del textarea. */
function toggleLines(
  el: HTMLTextAreaElement,
  text: string,
  prefixFor: (line: string, i: number) => string,
  setText: (v: string) => void
) {
  const { selectionStart, selectionEnd } = el;
  const start = text.lastIndexOf("\n", selectionStart - 1) + 1;
  let end = text.indexOf("\n", selectionEnd);
  if (end === -1) end = text.length;
  const before = text.slice(0, start);
  const after = text.slice(end);
  const lines = text.slice(start, end).split("\n");
  const allPrefixed = lines.every((l) => BULLET_RE.test(l) || !l.trim());
  const next = lines
    .map((l, i) => {
      if (!l.trim()) return l;
      const stripped = l.replace(BULLET_RE, "$1");
      return allPrefixed ? stripped : prefixFor(stripped, i);
    })
    .join("\n");
  const newVal = before + next + after;
  setText(newVal);
  requestAnimationFrame(() => {
    el.focus();
    el.setSelectionRange(before.length, before.length + next.length);
  });
}

/**
 * Botón flotante que despliega un bloc de notas rápido dentro de un BottomSheet:
 * renglones con viñetas o numeración (toggle + continuación automática al
 * presionar Enter) y un selector de emojis. Pensado para capturar ideas al
 * vuelo sin salir de la pantalla actual.
 */
export function QuickNotePad({
  position = "bottom-right",
  tone = "primary",
  title = "Nota rápida",
  placeholder = "Escribí algo…",
  storageKey,
  onSave,
  absolute = false,
  className = "",
}: QuickNotePadProps) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!storageKey) return;
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) setText(saved);
    } catch {}
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey) return;
    try {
      if (text) window.localStorage.setItem(storageKey, text);
      else window.localStorage.removeItem(storageKey);
    } catch {}
  }, [text, storageKey]);

  useEffect(() => {
    if (open) requestAnimationFrame(() => taRef.current?.focus());
    else setEmojiOpen(false);
  }, [open]);

  const wrapSelection = (before: string, after = before) => {
    const el = taRef.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e, value } = el;
    const next = value.slice(0, s) + before + value.slice(s, e) + after + value.slice(e);
    setText(next);
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(s + before.length, e + before.length); });
  };

  const insertEmoji = (e: string) => {
    const el = taRef.current;
    const pos = el?.selectionStart ?? text.length;
    const next = text.slice(0, pos) + e + text.slice(pos);
    setText(next);
    requestAnimationFrame(() => {
      el?.focus();
      const p = pos + e.length;
      el?.setSelectionRange(p, p);
    });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter") return;
    const el = e.currentTarget;
    const pos = el.selectionStart;
    const lineStart = text.lastIndexOf("\n", pos - 1) + 1;
    const line = text.slice(lineStart, pos);
    const m = line.match(BULLET_RE);
    if (!m) return;
    e.preventDefault();
    if (line.trim() === m[0].trim()) {
      // renglón vacío con sólo la viñeta: sale de la lista
      const newVal = text.slice(0, lineStart) + text.slice(pos);
      setText(newVal);
      requestAnimationFrame(() => el.setSelectionRange(lineStart, lineStart));
      return;
    }
    let prefix = m[0];
    if (/^\d+\./.test(m[2])) prefix = `${m[1]}${parseInt(m[2], 10) + 1}. `;
    const newVal = text.slice(0, pos) + "\n" + prefix + text.slice(pos);
    setText(newVal);
    requestAnimationFrame(() => {
      const p = pos + 1 + prefix.length;
      el.setSelectionRange(p, p);
    });
  };

  const handleSave = () => {
    onSave?.(text.trim());
    setText("");
    setOpen(false);
  };

  const canAct = text.trim().length > 0;

  return (
    <>
      <div
        className={[
          absolute ? "absolute" : "fixed",
          "z-[90] pointer-events-none",
          POS[position],
          absolute ? "bottom-4" : "bottom-[max(1rem,calc(env(safe-area-inset-bottom)+1rem))]",
          className,
        ].join(" ")}
      >
        <motion.button
          onClick={() => setOpen((v) => !v)}
          aria-label="Nota rápida"
          aria-expanded={open}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className={["pointer-events-auto rounded-full grid place-items-center shadow-xl", TONE_BG[tone]].join(" ")}
          style={{ height: 56, width: 56 }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </motion.button>
      </div>

      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        size="md"
        footer={
          <div className="flex items-center gap-1">
            <button onClick={() => wrapSelection("**")} title="Negrita" className="w-8 h-8 rounded-lg text-muted hover:text-foreground hover:bg-surface-alt inline-flex items-center justify-center transition-colors text-[13px] font-bold">
              B
            </button>
            <button onClick={() => wrapSelection("__")} title="Subrayado" className="w-8 h-8 rounded-lg text-muted hover:text-foreground hover:bg-surface-alt inline-flex items-center justify-center transition-colors text-[13px] font-bold underline">
              U
            </button>
            <span className="w-px h-5 bg-border mx-0.5" />
            <button
              onClick={() => taRef.current && toggleLines(taRef.current, text, (l) => `• ${l}`, setText)}
              title="Viñetas"
              className="w-8 h-8 rounded-lg text-muted hover:text-foreground hover:bg-surface-alt inline-flex items-center justify-center transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" />
                <circle cx="4" cy="6" r="1.3" fill="currentColor" stroke="none" /><circle cx="4" cy="12" r="1.3" fill="currentColor" stroke="none" /><circle cx="4" cy="18" r="1.3" fill="currentColor" stroke="none" />
              </svg>
            </button>
            <button
              onClick={() => taRef.current && toggleLines(taRef.current, text, (l, i) => `${i + 1}. ${l}`, setText)}
              title="Lista numerada"
              className="w-8 h-8 rounded-lg text-muted hover:text-foreground hover:bg-surface-alt inline-flex items-center justify-center transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="10" y1="6" x2="20" y2="6" /><line x1="10" y1="12" x2="20" y2="12" /><line x1="10" y1="18" x2="20" y2="18" />
                <text x="2" y="8.5" fontSize="6.5" fontWeight="700" fill="currentColor" stroke="none">1</text>
                <text x="2" y="14.5" fontSize="6.5" fontWeight="700" fill="currentColor" stroke="none">2</text>
                <text x="2" y="20.5" fontSize="6.5" fontWeight="700" fill="currentColor" stroke="none">3</text>
              </svg>
            </button>
            <button
              onClick={() => setEmojiOpen((v) => !v)}
              title="Emojis"
              className={[
                "w-8 h-8 rounded-lg inline-flex items-center justify-center transition-colors",
                emojiOpen ? "bg-primary/12 text-primary" : "text-muted hover:text-foreground hover:bg-surface-alt",
              ].join(" ")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="9" /><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0" />
                <line x1="9" y1="9.5" x2="9.01" y2="9.5" /><line x1="15" y1="9.5" x2="15.01" y2="9.5" />
              </svg>
            </button>

            <span className="ml-auto flex items-center gap-1.5">
              <button
                onClick={() => setText("")}
                disabled={!canAct}
                className="h-8 px-2.5 rounded-lg text-xs font-semibold text-muted hover:text-danger hover:bg-danger/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                Borrar
              </button>
              <button
                onClick={handleSave}
                disabled={!canAct}
                className="h-8 px-3 rounded-lg bg-primary text-white text-xs font-bold shadow-sm shadow-primary/25 disabled:opacity-35 disabled:shadow-none hover:bg-primary-hover active:scale-95 transition-all"
              >
                Guardar
              </button>
            </span>
          </div>
        }
      >
        <div className="relative">
          <textarea
            ref={taRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            rows={7}
            className="w-full resize-none bg-transparent py-1 text-sm text-foreground placeholder:text-muted outline-none leading-relaxed"
          />
          <AnimatePresence>
            {emojiOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                className="absolute bottom-1 left-0 right-0 rounded-xl border border-border bg-surface shadow-xl shadow-black/20 p-2 grid grid-cols-8 gap-0.5 z-10"
              >
                {EMOJI_QUICK.map((e, i) => (
                  <button
                    key={`${e}${i}`}
                    onClick={() => insertEmoji(e)}
                    className="w-7 h-7 rounded-lg text-base leading-none hover:bg-surface-alt active:scale-90 transition-all"
                  >
                    {e}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </BottomSheet>
    </>
  );
}
