"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";

export interface Comment {
  id: string;
  author: string;
  avatar?: string;
  text: string;
  /** timestamp para ordenar; se muestra relativo */
  at: number;
  likes?: number;
  liked?: boolean;
  /** id del comentario padre */
  parentId?: string | null;
  pinned?: boolean;
  authorBadge?: string;
}

export type CommentSort = "recent" | "top" | "old";

interface CommentBoxProps {
  comments: Comment[];
  /** devolvé una promesa para mostrar el estado de envío */
  onSubmit: (text: string, parentId?: string | null) => void | Promise<void>;
  onLike?: (id: string, liked: boolean) => void;
  onDelete?: (id: string) => void;
  currentUser?: { name: string; avatar?: string };
  maxLength?: number;
  placeholder?: string;
  sort?: CommentSort;
  onSortChange?: (s: CommentSort) => void;
  /** cuántos se muestran antes de «ver más» */
  pageSize?: number;
  allowReplies?: boolean;
  title?: string;
  className?: string;
}

const rel = (at: number) => {
  const s = Math.max(1, Math.round((Date.now() - at) / 1000));
  if (s < 60) return `hace ${s} s`;
  const m = Math.round(s / 60);
  if (m < 60) return `hace ${m} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24);
  return d < 7 ? `hace ${d} d` : new Date(at).toLocaleDateString();
};

function Avatar({ name, src, size = 36 }: { name: string; src?: string; size?: number }) {
  return (
    <span className="rounded-full overflow-hidden shrink-0 inline-flex" style={{ width: size, height: size }}>
      {src
        ? <img src={src} alt="" className="w-full h-full object-cover"/>
        : <span className="w-full h-full bg-gradient-to-br from-accent to-primary text-white inline-flex items-center justify-center font-bold"
            style={{ fontSize: size * 0.34 }}>
            {name.split(" ").map(w => w[0]).slice(0, 2).join("")}
          </span>}
    </span>
  );
}

function Composer({
  user, placeholder, maxLength, onSubmit, onCancel, autoFocus, compact,
}: {
  user?: { name: string; avatar?: string };
  placeholder: string;
  maxLength: number;
  onSubmit: (text: string) => void | Promise<void>;
  onCancel?: () => void;
  autoFocus?: boolean;
  compact?: boolean;
}) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [focus, setFocus] = useState(!!autoFocus);
  const ref = useRef<HTMLTextAreaElement>(null);
  const left = maxLength - text.length;
  const near = left <= maxLength * 0.15;

  const send = async () => {
    const value = text.trim();
    if (!value || busy) return;
    setBusy(true);
    try { await onSubmit(value); setText(""); } finally { setBusy(false); }
  };

  return (
    <div className="flex gap-3">
      {user && <Avatar name={user.name} src={user.avatar} size={compact ? 30 : 36}/>}
      <div className="flex-1 min-w-0">
        <div className={`rounded-2xl border bg-surface-alt/60 transition-colors ${focus ? "border-primary" : "border-border"}`}>
          <textarea ref={ref} value={text} placeholder={placeholder} rows={compact ? 1 : 2}
            autoFocus={autoFocus} maxLength={maxLength}
            onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
            onChange={e => {
              setText(e.target.value);
              const el = e.target as HTMLTextAreaElement;
              el.style.height = "auto";
              el.style.height = `${Math.min(160, el.scrollHeight)}px`;
            }}
            onKeyDown={e => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); send(); } }}
            className="w-full resize-none bg-transparent px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted outline-none leading-relaxed"/>
          <AnimatePresence initial={false}>
            {(focus || text) && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden">
                <div className="flex items-center gap-2 px-3 pb-2.5 pt-0.5">
                  <span className={`text-[11px] tabular-nums ${near ? "text-danger font-semibold" : "text-muted"}`}>{left}</span>
                  <span className="text-[11px] text-muted hidden sm:inline">⌘/Ctrl + Enter para publicar</span>
                  {onCancel && (
                    <button type="button" onClick={onCancel}
                      className="ml-auto h-8 px-3 rounded-lg text-xs font-semibold text-muted hover:text-foreground hover:bg-surface transition-colors">
                      Cancelar
                    </button>
                  )}
                  <button type="button" onClick={send} disabled={!text.trim() || busy}
                    className={`${onCancel ? "" : "ml-auto"} h-8 px-3.5 rounded-lg bg-primary text-white text-xs font-bold shadow-sm shadow-primary/25 disabled:opacity-35 disabled:shadow-none hover:bg-primary-hover active:scale-95 transition-all`}>
                    {busy ? "Publicando…" : "Publicar"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/** Caja de comentarios con hilos de una respuesta, orden, likes y contador de caracteres. */
export function CommentBox({
  comments, onSubmit, onLike, onDelete, currentUser,
  maxLength = 500, placeholder = "Escribí un comentario…",
  sort: sortProp, onSortChange, pageSize = 4, allowReplies = true,
  title = "Comentarios", className = "",
}: CommentBoxProps) {
  const [sortState, setSortState] = useState<CommentSort>("recent");
  const sort = sortProp ?? sortState;
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [shown, setShown] = useState(pageSize);

  const setSort = (s: CommentSort) => { setSortState(s); onSortChange?.(s); };

  const roots = useMemo(() => {
    const top = comments.filter(c => !c.parentId);
    const by = [...top].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      if (sort === "top") return (b.likes ?? 0) - (a.likes ?? 0);
      return sort === "old" ? a.at - b.at : b.at - a.at;
    });
    return by;
  }, [comments, sort]);

  const repliesOf = (id: string) => comments.filter(c => c.parentId === id).sort((a, b) => a.at - b.at);

  const Row = ({ c, depth = 0 }: { c: Comment; depth?: number }) => (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className={`flex gap-3 ${depth ? "ml-11" : ""}`}>
      <Avatar name={c.author} src={c.avatar} size={depth ? 30 : 36}/>
      <div className="min-w-0 flex-1">
        <div className="rounded-2xl bg-surface-alt border border-border px-3.5 py-2.5">
          <p className="flex items-center gap-2 flex-wrap">
            <span className="text-[13px] font-bold text-foreground">{c.author}</span>
            {c.authorBadge && (
              <span className="rounded-full bg-primary/12 text-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">{c.authorBadge}</span>
            )}
            {c.pinned && (
              <span className="rounded-full bg-accent/12 text-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">Fijado</span>
            )}
          </p>
          <p className="mt-1 text-sm text-foreground leading-relaxed whitespace-pre-line" style={{ textWrap: "pretty" }}>{c.text}</p>
        </div>
        <div className="mt-1.5 flex items-center gap-3 px-1">
          <span className="text-[11px] text-muted">{rel(c.at)}</span>
          <button type="button" onClick={() => onLike?.(c.id, !c.liked)}
            className={`inline-flex items-center gap-1 text-[11px] font-bold transition-colors ${c.liked ? "text-primary" : "text-muted hover:text-foreground"}`}>
            <motion.svg animate={c.liked ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}
              width="13" height="13" viewBox="0 0 24 24" fill={c.liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 22V11l4-7 1 1v5h5a2 2 0 0 1 2 2.3l-1.4 8A2 2 0 0 1 15.6 22Z"/><path d="M7 11H4v11h3"/>
            </motion.svg>
            {c.likes ? <span className="tabular-nums">{c.likes}</span> : "Me gusta"}
          </button>
          {allowReplies && depth === 0 && (
            <button type="button" onClick={() => setReplyTo(r => r === c.id ? null : c.id)}
              className="text-[11px] font-bold text-muted hover:text-foreground transition-colors">
              Responder
            </button>
          )}
          {onDelete && (
            <button type="button" onClick={() => onDelete(c.id)}
              className="text-[11px] font-bold text-muted hover:text-danger transition-colors ml-auto">
              Eliminar
            </button>
          )}
        </div>

        {allowReplies && depth === 0 && (
          <>
            <div className="mt-3 space-y-3">
              <AnimatePresence initial={false}>
                {repliesOf(c.id).map(r => <Row key={r.id} c={r} depth={1}/>)}
              </AnimatePresence>
            </div>
            <AnimatePresence>
              {replyTo === c.id && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  className="mt-3 ml-11">
                  <Composer compact autoFocus user={currentUser} maxLength={maxLength}
                    placeholder={`Respondiendo a ${c.author}…`}
                    onCancel={() => setReplyTo(null)}
                    onSubmit={async text => { await onSubmit(text, c.id); setReplyTo(null); }}/>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </motion.div>
  );

  return (
    <section className={`rounded-2xl border border-border bg-surface p-5 ${className}`}>
      <header className="flex items-center gap-3 flex-wrap mb-4">
        <h3 className="text-sm font-bold text-foreground">
          {title} <span className="text-muted font-semibold tabular-nums">({comments.length})</span>
        </h3>
        <div className="ml-auto flex items-center gap-1 rounded-xl border border-border bg-surface-alt p-0.5">
          {([["recent", "Recientes"], ["top", "Más gustados"], ["old", "Antiguos"]] as [CommentSort, string][]).map(([k, l]) => (
            <button key={k} type="button" onClick={() => setSort(k)}
              className={`h-7 px-2.5 rounded-lg text-[11px] font-bold transition-all ${sort === k ? "bg-surface text-foreground shadow-sm" : "text-muted hover:text-foreground"}`}>
              {l}
            </button>
          ))}
        </div>
      </header>

      <Composer user={currentUser} maxLength={maxLength} placeholder={placeholder}
        onSubmit={text => onSubmit(text, null)}/>

      <div className="mt-5 space-y-4">
        <AnimatePresence initial={false}>
          {roots.slice(0, shown).map(c => <Row key={c.id} c={c}/>)}
        </AnimatePresence>
      </div>

      {roots.length === 0 && (
        <p className="mt-6 text-center text-sm text-muted">Todavía no hay comentarios. Sé el primero.</p>
      )}

      {roots.length > shown && (
        <button type="button" onClick={() => setShown(s => s + pageSize)}
          className="mt-4 w-full h-10 rounded-xl border border-border bg-surface-alt/60 text-xs font-bold text-foreground hover:bg-surface-alt active:scale-[0.99] transition-all">
          Ver {Math.min(pageSize, roots.length - shown)} comentarios más
        </button>
      )}
    </section>
  );
}
