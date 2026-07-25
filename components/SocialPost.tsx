"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export interface PostAuthor {
  name: string;
  handle?: string;
  avatar?: string;
  verified?: boolean;
  meta?: string;
}

export interface PostMedia {
  src: string;
  alt?: string;
}

export interface PostCounts {
  likes: number;
  comments: number;
  shares?: number;
}

interface SocialPostProps {
  author: PostAuthor;
  /** «hace 2 h», fecha ya formateada */
  time: string;
  text: string;
  media?: PostMedia[];
  counts: PostCounts;
  liked?: boolean;
  saved?: boolean;
  onLike?: (liked: boolean) => void;
  onSave?: (saved: boolean) => void;
  onComment?: () => void;
  onShare?: () => void;
  onFollow?: () => void;
  onMedia?: (index: number) => void;
  /** recorta el texto y agrega «ver más» */
  clampAt?: number;
  /** quiénes reaccionaron, para la línea social */
  likedBy?: string[];
  /** contenido extra: caja de comentarios, encuesta, link preview… */
  children?: React.ReactNode;
  variant?: "card" | "flat";
  className?: string;
}

function Initials({ name }: { name: string }) {
  return (
    <span className="w-full h-full rounded-full bg-gradient-to-br from-primary to-accent text-white inline-flex items-center justify-center text-xs font-bold">
      {name.split(" ").map(w => w[0]).slice(0, 2).join("")}
    </span>
  );
}

const nf = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(n % 1000 >= 100 ? 1 : 0)}k` : String(n);

/** Post de red social: autor, texto con «ver más», grilla de media, reacciones y contadores animados. */
export function SocialPost({
  author, time, text, media = [], counts, liked: likedProp, saved: savedProp,
  onLike, onSave, onComment, onShare, onFollow, onMedia,
  clampAt = 240, likedBy = [], children, variant = "card", className = "",
}: SocialPostProps) {
  const [likedState, setLikedState] = useState(false);
  const [savedState, setSavedState] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [burst, setBurst] = useState(0);

  const liked = likedProp ?? likedState;
  const saved = savedProp ?? savedState;
  const likes = counts.likes + (liked && likedProp === undefined ? 1 : 0);

  const toggleLike = () => {
    const next = !liked;
    setLikedState(next);
    if (next) setBurst(b => b + 1);
    onLike?.(next);
  };
  const toggleSave = () => { const next = !saved; setSavedState(next); onSave?.(next); };

  const long = text.length > clampAt;
  const shown = long && !expanded ? `${text.slice(0, clampAt).trimEnd()}…` : text;

  const gridClass = media.length === 1 ? "grid-cols-1"
    : media.length === 2 ? "grid-cols-2"
    : media.length === 3 ? "grid-cols-2" : "grid-cols-2";

  return (
    <article className={[
      variant === "card" ? "rounded-2xl border border-border bg-surface" : "border-b border-border bg-surface",
      "overflow-hidden", className,
    ].join(" ")}>
      {/* header */}
      <header className="flex items-center gap-3 px-4 pt-4">
        <span className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-surface-alt">
          {author.avatar ? <img src={author.avatar} alt="" className="w-full h-full object-cover"/> : <Initials name={author.name}/>}
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-sm font-bold text-foreground truncate">
            {author.name}
            {author.verified && (
              <svg width="14" height="14" viewBox="0 0 24 24" className="text-primary shrink-0" fill="currentColor">
                <path d="M12 2l2.4 2.1 3.1-.5 1.2 2.9 2.9 1.2-.5 3.1L23 13l-2.1 2.4.5 3.1-2.9 1.2-1.2 2.9-3.1-.5L12 24l-2.4-2.1-3.1.5-1.2-2.9-2.9-1.2.5-3.1L1 13l2.1-2.4-.5-3.1 2.9-1.2L6.7 3.4l3.1.5Z" opacity="0.18"/>
                <path d="M12 2.6 14 4.3l2.6-.4 1 2.4 2.4 1-.4 2.6 1.7 2-1.7 2 .4 2.6-2.4 1-1 2.4-2.6-.4-2 1.7-2-1.7-2.6.4-1-2.4-2.4-1 .4-2.6-1.7-2 1.7-2-.4-2.6 2.4-1 1-2.4 2.6.4Zm-1.3 12.1 5-5-1.4-1.4-3.6 3.6-1.7-1.7L7.6 12Z"/>
              </svg>
            )}
          </p>
          <p className="text-[11px] text-muted truncate">
            {author.handle && <span>{author.handle} · </span>}{time}{author.meta && <span> · {author.meta}</span>}
          </p>
        </div>
        {onFollow && (
          <button type="button" onClick={onFollow}
            className="shrink-0 h-8 px-3 rounded-full border border-primary/40 text-primary text-xs font-bold hover:bg-primary/8 active:scale-95 transition-all">
            Seguir
          </button>
        )}
        <button type="button" aria-label="Más opciones"
          className="shrink-0 w-8 h-8 rounded-lg inline-flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-alt transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>
        </button>
      </header>

      {/* texto */}
      <div className="px-4 pt-3">
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-line" style={{ textWrap: "pretty" }}>
          {shown}
          {long && (
            <button type="button" onClick={() => setExpanded(e => !e)}
              className="ml-1.5 text-xs font-bold text-primary hover:underline">
              {expanded ? "ver menos" : "ver más"}
            </button>
          )}
        </p>
      </div>

      {/* media */}
      {media.length > 0 && (
        <div className={`mt-3 grid ${gridClass} gap-0.5`}>
          {media.slice(0, 4).map((m, i) => (
            <button key={i} type="button" onClick={() => onMedia?.(i)}
              className={[
                "relative overflow-hidden bg-surface-alt group",
                media.length === 3 && i === 0 ? "row-span-2" : "",
                media.length === 1 ? "aspect-[16/10]" : "aspect-square",
              ].join(" ")}>
              <img src={m.src} alt={m.alt ?? ""} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"/>
              {i === 3 && media.length > 4 && (
                <span className="absolute inset-0 bg-black/55 text-white text-xl font-bold inline-flex items-center justify-center">
                  +{media.length - 4}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* línea social */}
      <div className="px-4 pt-3 flex items-center gap-2 text-[11px] text-muted">
        <span className="inline-flex items-center">
          <span className="w-4 h-4 rounded-full bg-primary text-white inline-flex items-center justify-center">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-8-4.6-8-10a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 5.4-8 10-8 10Z"/></svg>
          </span>
          <span className="w-4 h-4 -ml-1 rounded-full bg-danger text-white inline-flex items-center justify-center">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M4 21V10h3l4-7 1 1v6h6a2 2 0 0 1 2 2l-2 8a1 1 0 0 1-1 1Z"/></svg>
          </span>
        </span>
        <span className="tabular-nums">{nf(likes)}</span>
        {likedBy.length > 0 && <span className="truncate">· {likedBy[0]} y {nf(Math.max(0, likes - 1))} más</span>}
        <span className="ml-auto tabular-nums">{nf(counts.comments)} comentarios</span>
        {counts.shares != null && <span className="tabular-nums">· {nf(counts.shares)} compartidos</span>}
      </div>

      {/* acciones */}
      <div className="mt-2.5 mx-4 border-t border-border grid grid-cols-4">
        {[
          {
            key: "like", label: liked ? "Te gusta" : "Me gusta", active: liked, onClick: toggleLike,
            icon: <path d="M12 21s-8-4.6-8-10a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 5.4-8 10-8 10Z"/>,
          },
          {
            key: "comment", label: "Comentar", active: false, onClick: onComment,
            icon: <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5Z"/>,
          },
          {
            key: "share", label: "Compartir", active: false, onClick: onShare,
            icon: <g><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5 15.4 17M15.4 7 8.6 10.5"/></g>,
          },
          {
            key: "save", label: saved ? "Guardado" : "Guardar", active: saved, onClick: toggleSave,
            icon: <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1Z"/>,
          },
        ].map(a => (
          <button key={a.key} type="button" onClick={a.onClick}
            className={[
              "relative h-11 inline-flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors active:scale-95",
              a.active ? "text-primary" : "text-muted hover:text-foreground",
            ].join(" ")}>
            <motion.span animate={a.key === "like" && liked ? { scale: [1, 1.35, 1] } : {}} transition={{ duration: 0.32 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill={a.active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {a.icon}
              </svg>
            </motion.span>
            <span className="hidden sm:inline">{a.label}</span>
            {a.key === "like" && (
              <AnimatePresence>
                {burst > 0 && liked && (
                  <motion.span key={burst}
                    initial={{ opacity: 1, y: 0, scale: 0.6 }}
                    animate={{ opacity: 0, y: -34, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-primary">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-8-4.6-8-10a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 5.4-8 10-8 10Z"/></svg>
                  </motion.span>
                )}
              </AnimatePresence>
            )}
          </button>
        ))}
      </div>

      {children && <div className="px-4 pb-4 pt-3">{children}</div>}
      {!children && <div className="h-3"/>}
    </article>
  );
}
