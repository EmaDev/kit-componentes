"use client";
import { useState } from "react";

export interface SavedCard { id: string; brand: "visa" | "mastercard" | "amex" | "other"; last4: string; expiry: string }
export interface NewCardInput { number: string; name: string; expiry: string; cvc: string }

interface PaymentMethodPickerProps {
  cards: SavedCard[];
  value?: string | null;
  onChange?: (id: string) => void;
  onAddCard?: (c: NewCardInput) => Promise<void> | void;
  extra?: { id: string; label: string; icon?: React.ReactNode }[];
  className?: string;
}

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const BRAND: Record<SavedCard["brand"], string> = { visa: "VISA", mastercard: "MC", amex: "AMEX", other: "CARD" };

function Radio({ on }: { on: boolean }) {
  return <span className={cn("w-5 h-5 rounded-full border-2 shrink-0 inline-flex items-center justify-center", on ? "border-primary" : "border-border")}>{on && <span className="w-2.5 h-2.5 rounded-full bg-primary"/>}</span>;
}

/** Elegir con qué tarjeta pagar: guardadas + agregar una nueva con formulario inline. */
export function PaymentMethodPicker({ cards, value, onChange, onAddCard, extra = [], className = "" }: PaymentMethodPickerProps) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<NewCardInput>({ number: "", name: "", expiry: "", cvc: "" });
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    try { await onAddCard?.(form); setForm({ number: "", name: "", expiry: "", cvc: "" }); setAdding(false); } finally { setBusy(false); }
  };
  const validForm = form.number.replace(/\s/g, "").length >= 12 && form.name.trim().length > 1 && form.expiry.length === 5 && form.cvc.length >= 3;

  return (
    <div className={cn("space-y-2", className)}>
      {cards.map(c => (
        <button key={c.id} type="button" onClick={() => onChange?.(c.id)}
          className={cn("w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors", value === c.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30")}>
          <Radio on={value === c.id}/>
          <span className="w-10 h-7 rounded-md bg-surface-alt border border-border inline-flex items-center justify-center text-[9px] font-black text-muted">{BRAND[c.brand]}</span>
          <span className="flex-1 min-w-0">
            <span className="block text-sm font-semibold text-foreground">···· {c.last4}</span>
            <span className="block text-[11px] text-muted">Vence {c.expiry}</span>
          </span>
        </button>
      ))}

      {extra.map(e => (
        <button key={e.id} type="button" onClick={() => onChange?.(e.id)}
          className={cn("w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors", value === e.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30")}>
          <Radio on={value === e.id}/>
          {e.icon && <span className="w-10 h-7 rounded-md bg-surface-alt border border-border inline-flex items-center justify-center text-primary">{e.icon}</span>}
          <span className="text-sm font-semibold text-foreground">{e.label}</span>
        </button>
      ))}

      {adding ? (
        <div className="rounded-xl border border-border p-4 space-y-3">
          <input placeholder="Número de tarjeta" value={form.number} onChange={e => setForm(f => ({ ...f, number: e.target.value }))}
            className="w-full h-11 rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"/>
          <input placeholder="Nombre en la tarjeta" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full h-11 rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"/>
          <div className="flex gap-2">
            <input placeholder="MM/AA" value={form.expiry} onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))}
              className="flex-1 h-11 rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"/>
            <input placeholder="CVC" value={form.cvc} onChange={e => setForm(f => ({ ...f, cvc: e.target.value }))}
              className="w-24 h-11 rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"/>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setAdding(false)} className="flex-1 h-10 rounded-lg text-xs font-bold text-muted hover:bg-surface-alt transition-colors">Cancelar</button>
            <button type="button" onClick={submit} disabled={!validForm || busy} className="flex-1 h-10 rounded-lg bg-primary text-white text-xs font-bold disabled:opacity-40 transition-all">{busy ? "Guardando…" : "Guardar tarjeta"}</button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setAdding(true)}
          className="w-full flex items-center gap-3 rounded-xl border border-dashed border-border px-4 py-3 text-left text-sm font-semibold text-primary hover:bg-primary/5 transition-colors">
          <span className="w-5 h-5 rounded-full border-2 border-dashed border-primary/50 inline-flex items-center justify-center shrink-0">+</span>
          Agregar una tarjeta
        </button>
      )}
    </div>
  );
}
