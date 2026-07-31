"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type NotificationTone = "info" | "success" | "warning" | "danger" | "neutral";

export interface AppNotification {
  id: string;
  title: string;
  description?: string;
  /** Fecha del evento — Date, timestamp o ISO string */
  date: Date | string | number;
  read?: boolean;
  tone?: NotificationTone;
  /** Icono propio; si no, se usa el del tone */
  icon?: ReactNode;
  /** Avatar (url) — reemplaza al icono cuando existe */
  avatar?: string;
  href?: string;
  action?: { label: string; onClick: (n: AppNotification) => void };
}

export interface NotificationPanelProps {
  items: AppNotification[];
  /** Filtro activo controlado (opcional) */
  filter?: "all" | "unread";
  onFilterChange?: (f: "all" | "unread") => void;
  onRead?: (id: string) => void;
  onReadAll?: () => void;
  onDismiss?: (id: string) => void;
  onClear?: () => void;
  onItemClick?: (n: AppNotification) => void;
  title?: string;
  emptyTitle?: string;
  emptyHint?: string;
  footer?: ReactNode;
  /** Alto máximo del área scrolleable */
  maxHeight?: number | string;
  className?: string;
}

const TONES: Record<NotificationTone, { chip: string; dot: string }> = {
  info:    { chip: "bg-primary/12 text-primary", dot: "bg-primary" },
  success: { chip: "bg-success/12 text-success", dot: "bg-success" },
  warning: { chip: "bg-accent/12 text-accent",   dot: "bg-accent" },
  danger:  { chip: "bg-danger/12 text-danger",   dot: "bg-danger" },
  neutral: { chip: "bg-foreground/8 text-muted", dot: "bg-muted" },
};

const TONE_ICONS: Record<NotificationTone, ReactNode> = {
  info: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="9"/><line x1="12" y1="16" x2="12" y2="11"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
  ),
  success: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
  ),
  danger: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="9"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
  ),
  neutral: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
  ),
};

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

const toDate = (d: AppNotification["date"]) => (d instanceof Date ? d : new Date(d));

export function relativeTime(date: Date | string | number, now = new Date()): string {
  const d = toDate(date);
  const diff = Math.round((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return "ahora";
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
  if (diff < 604800) return `hace ${Math.floor(diff / 86400)} d`;
  return new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "short" }).format(d);
}

export function groupLabel(date: Date | string | number, now = new Date()): string {
  const d = toDate(date);
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const days = Math.round((startOf(now) - startOf(d)) / 86400000);
  if (days <= 0) return "Hoy";
  if (days === 1) return "Ayer";
  if (days < 7) return "Esta semana";
  return "Anteriores";
}

/** Filtro + agrupado por fecha, compartido por el panel y el sidebar. */
function useGroupedNotifications(items: AppNotification[], filter: "all" | "unread") {
  return useMemo(() => {
    const now = new Date();
    const visible = [...items]
      .filter((n) => (filter === "unread" ? !n.read : true))
      .sort((a, b) => toDate(b.date).getTime() - toDate(a.date).getTime());
    const map = new Map<string, AppNotification[]>();
    for (const n of visible) {
      const k = groupLabel(n.date, now);
      const arr = map.get(k);
      if (arr) arr.push(n);
      else map.set(k, [n]);
    }
    return [...map.entries()];
  }, [items, filter]);
}

/** Estado del filtro: controlado por `filter`/`onFilterChange`, o interno si no vienen. */
function useNotificationFilter(
  filterProp: "all" | "unread" | undefined,
  onFilterChange: ((f: "all" | "unread") => void) | undefined,
) {
  const [inner, setInner] = useState<"all" | "unread">("all");
  const filter = filterProp ?? inner;
  const setFilter = (f: "all" | "unread") => {
    setInner(f);
    onFilterChange?.(f);
  };
  return [filter, setFilter] as const;
}

function NotificationHeader({
  title, unread, filter, setFilter, onReadAll, onClear, showClear,
}: {
  title: string;
  unread: number;
  filter: "all" | "unread";
  setFilter: (f: "all" | "unread") => void;
  onReadAll?: () => void;
  onClear?: () => void;
  showClear: boolean;
}) {
  // Scopeado por instancia: si hay un panel y un sidebar montados a la vez,
  // un layoutId global haría volar la pastilla de uno al otro.
  const tabLayoutId = useId();

  return (
    <div className="px-4 pt-3.5 pb-3 border-b border-border">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-foreground flex items-center gap-2">
          {title}
          <AnimatePresence>
            {unread > 0 && (
              <motion.span
                key="count"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-white text-[11px] font-bold tabular-nums"
              >
                {unread}
              </motion.span>
            )}
          </AnimatePresence>
        </p>
        <div className="flex items-center gap-1">
          {unread > 0 && (
            <button type="button" onClick={onReadAll}
              className="h-7 px-2 rounded-lg text-[11px] font-semibold text-primary hover:bg-primary/10 transition-colors">
              Marcar todas
            </button>
          )}
          {showClear && (
            <button type="button" onClick={onClear} aria-label="Vaciar"
              className="w-7 h-7 rounded-lg inline-flex items-center justify-center text-muted hover:text-danger hover:bg-danger/10 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 inline-flex p-0.5 rounded-lg bg-surface-alt border border-border">
        {([["all", "Todas"], ["unread", `No leídas${unread ? ` (${unread})` : ""}`]] as const).map(([k, l]) => (
          <button key={k} type="button" onClick={() => setFilter(k)}
            className={cx(
              "relative h-7 px-3 rounded-[7px] text-[11px] font-semibold transition-colors",
              filter === k ? "text-foreground" : "text-muted hover:text-foreground"
            )}>
            {filter === k && (
              <motion.span layoutId={tabLayoutId} transition={{ type: "spring", stiffness: 420, damping: 34 }}
                className="absolute inset-0 rounded-[7px] bg-surface shadow-sm"/>
            )}
            <span className="relative">{l}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function NotificationList({
  groups, emptyTitle, emptyHint, onRead, onDismiss, onItemClick, grow, maxHeight,
}: {
  groups: [string, AppNotification[]][];
  emptyTitle: string;
  emptyHint: string;
  onRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onItemClick?: (n: AppNotification) => void;
  /** Ocupa el alto restante del contenedor flex (sidebar) en vez de limitarse con maxHeight. */
  grow?: boolean;
  maxHeight?: number | string;
}) {
  return (
    <div
      className={cx("overflow-y-auto overscroll-contain", grow && "flex-1 min-h-0")}
      style={grow ? undefined : { maxHeight }}
    >
      {groups.length === 0 ? (
        <EmptyState title={emptyTitle} hint={emptyHint}/>
      ) : (
        groups.map(([label, rows]) => (
          <div key={label}>
            <p className="sticky top-0 z-10 px-4 py-1.5 bg-surface/90 backdrop-blur text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
              {label}
            </p>
            <ul className="px-2 pb-1">
              <AnimatePresence initial={false}>
                {rows.map((n) => (
                  <NotificationRow
                    key={n.id} n={n}
                    onRead={onRead} onDismiss={onDismiss} onItemClick={onItemClick}
                  />
                ))}
              </AnimatePresence>
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export function NotificationPanel({
  items,
  filter: filterProp,
  onFilterChange,
  onRead,
  onReadAll,
  onDismiss,
  onClear,
  onItemClick,
  title = "Notificaciones",
  emptyTitle = "Estás al día",
  emptyHint = "No tenés notificaciones nuevas.",
  footer,
  maxHeight = 380,
  className = "",
}: NotificationPanelProps) {
  const [filter, setFilter] = useNotificationFilter(filterProp, onFilterChange);
  const unread = items.filter((n) => !n.read).length;
  const groups = useGroupedNotifications(items, filter);

  return (
    <div className={cx("flex flex-col rounded-2xl border border-border bg-surface shadow-xl shadow-black/10 overflow-hidden", className)}>
      <NotificationHeader
        title={title} unread={unread} filter={filter} setFilter={setFilter}
        onReadAll={onReadAll} onClear={onClear} showClear={!!onClear && items.length > 0}
      />
      <NotificationList
        groups={groups} emptyTitle={emptyTitle} emptyHint={emptyHint} maxHeight={maxHeight}
        onRead={onRead} onDismiss={onDismiss} onItemClick={onItemClick}
      />
      {footer && <div className="border-t border-border p-2">{footer}</div>}
    </div>
  );
}

export interface NotificationSidebarProps extends Omit<NotificationPanelProps, "maxHeight"> {
  open: boolean;
  onClose: () => void;
  /** Lado desde el que se despliega */
  side?: "left" | "right";
  width?: number;
}

export function NotificationSidebar({
  open,
  onClose,
  side = "right",
  width = 400,
  items,
  filter: filterProp,
  onFilterChange,
  onRead,
  onReadAll,
  onDismiss,
  onClear,
  onItemClick,
  title = "Notificaciones",
  emptyTitle = "Estás al día",
  emptyHint = "No tenés notificaciones nuevas.",
  footer,
  className = "",
}: NotificationSidebarProps) {
  const [filter, setFilter] = useNotificationFilter(filterProp, onFilterChange);
  const unread = items.filter((n) => !n.read).length;
  const groups = useGroupedNotifications(items, filter);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[1px]"
          />
          <motion.div
            key="sidebar"
            role="dialog" aria-modal="true" aria-label={title}
            initial={{ x: side === "right" ? width : -width }}
            animate={{ x: 0 }}
            exit={{ x: side === "right" ? width : -width }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
            style={{ width, maxWidth: "calc(100vw - 2.5rem)" }}
            className={cx(
              "fixed inset-y-0 z-50 flex flex-col bg-surface shadow-2xl shadow-black/20",
              side === "right" ? "right-0 border-l border-border" : "left-0 border-r border-border",
              className
            )}
          >
            <div
              className="flex items-center justify-end px-4"
              style={{ paddingTop: "calc(1rem + var(--sa-top, env(safe-area-inset-top, 0px)))" }}
            >
              <button type="button" onClick={onClose} aria-label="Cerrar"
                className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-alt transition-colors">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="-mt-1">
              <NotificationHeader
                title={title} unread={unread} filter={filter} setFilter={setFilter}
                onReadAll={onReadAll} onClear={onClear} showClear={!!onClear && items.length > 0}
              />
            </div>
            <NotificationList
              grow groups={groups} emptyTitle={emptyTitle} emptyHint={emptyHint}
              onRead={onRead} onDismiss={onDismiss} onItemClick={onItemClick}
            />
            {footer && (
              <div className="border-t border-border p-3 pb-[calc(0.75rem+var(--sa-bottom,env(safe-area-inset-bottom,0px)))]">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function NotificationRow({
  n, onRead, onDismiss, onItemClick,
}: {
  n: AppNotification;
  onRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onItemClick?: (n: AppNotification) => void;
}) {
  const tone = n.tone ?? "neutral";
  const t = TONES[tone];

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40, height: 0, marginTop: 0, transition: { duration: 0.18 } }}
      transition={{ type: "spring", stiffness: 340, damping: 30 }}
      className="relative group"
    >
      <button
        type="button"
        onClick={() => { if (!n.read) onRead?.(n.id); onItemClick?.(n); }}
        className={cx(
          "w-full text-left flex gap-3 p-2.5 pr-9 rounded-xl transition-colors",
          n.read ? "hover:bg-surface-alt" : "bg-primary/[0.05] hover:bg-primary/[0.09]"
        )}
      >
        <span className={cx("shrink-0 w-9 h-9 rounded-xl inline-flex items-center justify-center overflow-hidden", !n.avatar && t.chip)}>
          {n.avatar
            ? <img src={n.avatar} alt="" className="w-full h-full object-cover"/>
            : (n.icon ?? TONE_ICONS[tone])}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-baseline gap-2">
            <span className={cx("text-[13px] leading-snug truncate", n.read ? "font-medium text-foreground/80" : "font-semibold text-foreground")}>
              {n.title}
            </span>
            <span className="ml-auto shrink-0 text-[10px] text-muted tabular-nums">{relativeTime(n.date)}</span>
          </span>
          {n.description && (
            <span className="mt-0.5 block text-[11px] text-muted leading-relaxed line-clamp-2">{n.description}</span>
          )}
          {n.action && (
            <span
              role="button" tabIndex={0}
              onClick={(e) => { e.stopPropagation(); n.action!.onClick(n); }}
              className="mt-1.5 inline-block text-[11px] font-semibold text-primary hover:underline"
            >
              {n.action.label}
            </span>
          )}
        </span>

        {!n.read && <span className={cx("absolute right-3 top-4 w-2 h-2 rounded-full", t.dot)}/>}
      </button>

      {onDismiss && (
        <button
          type="button" aria-label="Descartar"
          onClick={() => onDismiss(n.id)}
          className="absolute right-2 bottom-2 w-6 h-6 rounded-md inline-flex items-center justify-center text-muted opacity-0 group-hover:opacity-100 hover:text-foreground hover:bg-surface-alt transition-all"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      )}
    </motion.li>
  );
}

function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="px-6 py-12 text-center">
      <span className="mx-auto w-12 h-12 rounded-2xl bg-surface-alt border border-border inline-flex items-center justify-center text-muted">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      </span>
      <p className="mt-3 text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </div>
  );
}

export interface NotificationBellProps extends Omit<NotificationPanelProps, "className"> {
  /** Alineación del popover respecto del botón */
  align?: "start" | "end";
  panelWidth?: number;
  className?: string;
}

export function NotificationBell({ align = "end", panelWidth = 380, className = "", ...panel }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unread = panel.items.filter((n) => !n.read).length;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cx("relative", className)}>
      <button
        type="button" onClick={() => setOpen((o) => !o)}
        aria-label={`Notificaciones${unread ? ` (${unread} sin leer)` : ""}`} aria-expanded={open}
        className={cx(
          "relative w-10 h-10 rounded-xl inline-flex items-center justify-center border transition-all active:scale-95",
          open ? "bg-surface-alt border-primary/40 text-foreground" : "bg-surface border-border text-muted hover:text-foreground hover:bg-surface-alt"
        )}
      >
        <motion.span animate={unread > 0 ? { rotate: [0, -12, 10, -6, 0] } : { rotate: 0 }} transition={{ duration: 0.7 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        </motion.span>
        <AnimatePresence>
          {unread > 0 && (
            <motion.span
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-danger text-white text-[10px] font-bold inline-flex items-center justify-center tabular-nums border-2 border-surface"
            >
              {unread > 99 ? "99+" : unread}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97, transition: { duration: 0.14 } }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            style={{ width: panelWidth, transformOrigin: align === "end" ? "top right" : "top left" }}
            className={cx("absolute z-50 mt-2 max-w-[calc(100vw-2rem)]", align === "end" ? "right-0" : "left-0")}
          >
            <NotificationPanel {...panel}/>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
