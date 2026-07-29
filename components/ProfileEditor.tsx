"use client";
import { useRef, useState } from "react";

/** Foto de perfil como data URL (persistida por quien consuma `onSave`), o `null` para mostrar iniciales. */
export type AvatarValue = string | null;

export interface ProfileFields { avatar: AvatarValue; name: string; email: string; phone: string; bio: string }

interface ProfileEditorProps {
  value: ProfileFields;
  onSave?: (v: ProfileFields) => Promise<void> | void;
  bioMaxLength?: number;
  className?: string;
}

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

function AvatarPicker({ value, name, onChange }: { value: AvatarValue; name: string; onChange: (v: AvatarValue) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  const pickFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative inline-block">
      <button type="button" onClick={() => inputRef.current?.click()} aria-label="Cambiar foto de perfil"
        className="group relative w-20 h-20 rounded-full overflow-hidden ring-4 ring-surface bg-gradient-to-br from-primary to-accent inline-flex items-center justify-center text-white text-xl font-bold">
        {value ? <img src={value} alt="" className="w-full h-full object-cover"/> : initials}
        <span className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
          </svg>
        </span>
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => pickFile(e.target.files?.[0])}/>
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">{label}</span>
      {children}
    </label>
  );
}
const inputCls = "w-full h-11 rounded-xl border border-border bg-surface px-3.5 text-sm text-foreground placeholder:text-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all";

/** Formulario de perfil: avatar editable, datos básicos, bio con contador y guardar con estado de carga. */
export function ProfileEditor({ value, onSave, bioMaxLength = 160, className = "" }: ProfileEditorProps) {
  const [f, setF] = useState(value);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const dirty = JSON.stringify(f) !== JSON.stringify(value);

  const set = <K extends keyof ProfileFields>(k: K, v: ProfileFields[K]) => { setF(p => ({ ...p, [k]: v })); setSaved(false); };

  const save = async () => {
    setBusy(true);
    try { await onSave?.(f); setSaved(true); } finally { setBusy(false); }
  };

  return (
    <div className={cn("space-y-5", className)}>
      <div className="flex justify-center">
        <AvatarPicker value={f.avatar} name={f.name} onChange={v => set("avatar", v)}/>
      </div>

      <FieldRow label="Nombre"><input className={inputCls} value={f.name} onChange={e => set("name", e.target.value)}/></FieldRow>
      <FieldRow label="Correo"><input type="email" className={inputCls} value={f.email} onChange={e => set("email", e.target.value)}/></FieldRow>
      <FieldRow label="Teléfono"><input type="tel" className={inputCls} value={f.phone} onChange={e => set("phone", e.target.value)}/></FieldRow>

      <FieldRow label={`Bio · ${f.bio.length}/${bioMaxLength}`}>
        <textarea rows={3} maxLength={bioMaxLength} value={f.bio} onChange={e => set("bio", e.target.value)}
          className="w-full resize-none rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"/>
      </FieldRow>

      <div className="flex items-center gap-3">
        <button type="button" onClick={save} disabled={!dirty || busy}
          className="h-11 px-5 rounded-xl bg-primary text-white text-sm font-bold disabled:opacity-40 active:scale-[0.98] transition-all inline-flex items-center gap-2">
          {busy && <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin"/>}
          {busy ? "Guardando…" : "Guardar cambios"}
        </button>
        {saved && !dirty && <span className="text-xs font-semibold text-success">Guardado</span>}
        {dirty && !busy && <span className="text-xs text-muted">Hay cambios sin guardar</span>}
      </div>
    </div>
  );
}
