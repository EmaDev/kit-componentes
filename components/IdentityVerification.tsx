"use client";
import { useState } from "react";

export type IdVerificationStep = "id-front" | "id-back" | "selfie" | "review" | "done";
interface IdentityVerificationProps {
  onSubmit?: (files: { idFront: File; idBack: File; selfie: File }) => Promise<void> | void;
  className?: string;
}
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const STEPS: { id: IdVerificationStep; title: string; hint: string }[] = [
  { id: "id-front", title: "Frente del documento", hint: "Que se lean bien todos los datos, sin brillos." },
  { id: "id-back", title: "Dorso del documento", hint: "El mismo documento, del otro lado." },
  { id: "selfie", title: "Una selfie tuya", hint: "Con buena luz, mirando a la cámara." },
];

/** Verificación de identidad: subir DNI (frente/dorso) + selfie, paso a paso, antes de un OTP. */
export function IdentityVerification({ onSubmit, className = "" }: IdentityVerificationProps) {
  const [idx, setIdx] = useState(0);
  const [files, setFiles] = useState<Partial<Record<IdVerificationStep, { file: File; url: string }>>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const step = STEPS[idx];
  const current = step && files[step.id];

  const pick = (f: File) => setFiles(prev => ({ ...prev, [step.id]: { file: f, url: URL.createObjectURL(f) } }));

  const next = async () => {
    if (idx < STEPS.length - 1) { setIdx(idx + 1); return; }
    setBusy(true);
    try {
      await onSubmit?.({ idFront: files["id-front"]!.file, idBack: files["id-back"]!.file, selfie: files["selfie"]!.file });
      setDone(true);
    } finally { setBusy(false); }
  };

  if (done) return (
    <div className={cn("text-center space-y-3 py-6", className)}>
      <span className="inline-flex w-14 h-14 rounded-full bg-success/10 text-success items-center justify-center">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </span>
      <p className="text-lg font-bold text-foreground">Documentos enviados</p>
      <p className="text-sm text-muted max-w-xs mx-auto">Vamos a revisarlos y te avisamos por correo, normalmente en menos de 24 horas.</p>
    </div>
  );

  return (
    <div className={cn("space-y-5", className)}>
      <div className="flex items-center gap-2">{STEPS.map((s, i) => <span key={s.id} className={cn("h-1.5 flex-1 rounded-full transition-colors", i <= idx ? "bg-primary" : "bg-border")}/>)}</div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-primary">Paso {idx + 1} de {STEPS.length}</p>
        <h3 className="mt-1 text-lg font-bold text-foreground">{step.title}</h3>
        <p className="mt-1 text-sm text-muted">{step.hint}</p>
      </div>
      <label className={cn("block rounded-2xl border-2 border-dashed cursor-pointer overflow-hidden", current ? "border-primary/40" : "border-border hover:border-primary/40")}>
        <input type="file" accept="image/*" capture="environment" className="hidden" onChange={e => e.target.files?.[0] && pick(e.target.files[0])}/>
        {current ? (
          <img src={current.url} alt="" className="w-full h-44 object-cover"/>
        ) : (
          <div className="h-44 flex flex-col items-center justify-center gap-2 text-muted">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            <span className="text-xs font-semibold">Tocá para tomar la foto</span>
          </div>
        )}
      </label>
      <div className="flex items-center gap-3">
        {idx > 0 && <button type="button" onClick={() => setIdx(idx - 1)} className="h-11 px-4 rounded-xl text-sm font-bold text-muted hover:bg-surface-alt transition-colors">Atrás</button>}
        <button type="button" onClick={next} disabled={!current || busy} className="ml-auto h-11 px-5 rounded-xl bg-primary text-white text-sm font-bold disabled:opacity-40 active:scale-[0.98] transition-all inline-flex items-center gap-2">
          {busy && <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin"/>}{idx === STEPS.length - 1 ? (busy ? "Enviando…" : "Enviar para revisión") : "Siguiente"}
        </button>
      </div>
    </div>
  );
}
