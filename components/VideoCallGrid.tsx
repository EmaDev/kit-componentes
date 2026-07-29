"use client";

export interface CallParticipant { id: string; name: string; avatar?: string; speaking?: boolean; muted?: boolean; videoOn?: boolean; you?: boolean }
interface VideoCallGridProps {
  participants: CallParticipant[];
  onToggleMute?: () => void;
  onToggleVideo?: () => void;
  onLeave?: () => void;
  muted?: boolean;
  videoOn?: boolean;
  className?: string;
}
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const initials = (n: string) => n.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();
const COLS: Record<number, string> = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-2", 4: "grid-cols-2" };

/** Grid de participantes de videollamada con controles de mic/cámara/salir. */
export function VideoCallGrid({ participants, onToggleMute, onToggleVideo, onLeave, muted, videoOn, className = "" }: VideoCallGridProps) {
  const cols = COLS[Math.min(participants.length, 4)] ?? "grid-cols-3";
  return (
    <div className={cn("flex flex-col h-full bg-[#111318] rounded-2xl overflow-hidden", className)}>
      <div className={cn("flex-1 grid gap-1.5 p-1.5", cols)}>
        {participants.map(p => (
          <div key={p.id} className={cn("relative rounded-xl bg-[#1c1f26] flex items-center justify-center overflow-hidden", p.speaking && "ring-2 ring-primary")}>
            {p.videoOn ? (
              <div className="absolute inset-0 bg-gradient-to-br from-[#2a2e38] to-[#14161b]"/>
            ) : (
              <span className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary text-white text-lg font-bold inline-flex items-center justify-center">{initials(p.name)}</span>
            )}
            <span className="absolute bottom-2 left-2 h-6 px-2 rounded-md bg-black/50 text-white text-[11px] font-semibold inline-flex items-center gap-1">
              {p.muted && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V5a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-1M12 19v3"/><line x1="2" y1="2" x2="22" y2="22"/></svg>}
              {p.name}{p.you && " (vos)"}
            </span>
          </div>
        ))}
      </div>
      <div className="shrink-0 flex items-center justify-center gap-3 py-4">
        <button type="button" onClick={onToggleMute} aria-label={muted ? "Activar micrófono" : "Silenciar"}
          className={cn("w-12 h-12 rounded-full inline-flex items-center justify-center transition-colors", muted ? "bg-white text-black" : "bg-white/15 text-white hover:bg-white/25")}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><line x1="12" y1="18" x2="12" y2="22"/>{muted && <line x1="2" y1="2" x2="22" y2="22"/>}
          </svg>
        </button>
        <button type="button" onClick={onToggleVideo} aria-label={videoOn ? "Apagar cámara" : "Encender cámara"}
          className={cn("w-12 h-12 rounded-full inline-flex items-center justify-center transition-colors", !videoOn ? "bg-white text-black" : "bg-white/15 text-white hover:bg-white/25")}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/>{!videoOn && <line x1="1" y1="1" x2="23" y2="23"/>}
          </svg>
        </button>
        <button type="button" onClick={onLeave} aria-label="Salir de la llamada" className="w-14 h-12 rounded-full bg-danger text-white inline-flex items-center justify-center hover:brightness-110 transition-all">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" style={{ transform: "rotate(135deg)" }}><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg>
        </button>
      </div>
    </div>
  );
}
