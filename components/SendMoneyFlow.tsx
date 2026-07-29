"use client";
import { useState } from "react";

export interface Contact { id: string; name: string; handle?: string; avatar?: string }
interface SendMoneyFlowProps {
  contacts: Contact[];
  balance: number;
  currency?: string;
  locale?: string;
  onSend?: (v: { contact: Contact; amount: number; note: string }) => Promise<void> | void;
  className?: string;
}
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const initials = (n: string) => n.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();

/** Flujo de enviar dinero a un contacto: elegir destinatario, monto, nota y confirmar. */
export function SendMoneyFlow({ contacts, balance, currency = "ARS", locale = "es-AR", onSend, className = "" }: SendMoneyFlowProps) {
  const [step, setStep] = useState<"contact" | "amount" | "confirm" | "done">("contact");
  const [contact, setContact] = useState<Contact | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const fmt = (n: number) => new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 2 }).format(n);
  const num = parseFloat(amount) || 0;
  const valid = num > 0 && num <= balance;

  const confirm = async () => {
    if (!contact) return;
    setBusy(true);
    try { await onSend?.({ contact, amount: num, note }); setStep("done"); } finally { setBusy(false); }
  };
  const reset = () => { setStep("contact"); setContact(null); setAmount(""); setNote(""); };

  return (
    <div className={cn("space-y-4", className)}>
      {step === "contact" && (
        <div className="space-y-1.5">
          <p className="text-xs font-bold uppercase tracking-wide text-muted mb-2">¿A quién le enviás?</p>
          {contacts.map(c => (
            <button key={c.id} type="button" onClick={() => { setContact(c); setStep("amount"); }}
              className="w-full flex items-center gap-3 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-left hover:border-primary/30 transition-colors">
              <span className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-primary text-white text-xs font-bold inline-flex items-center justify-center shrink-0">{initials(c.name)}</span>
              <span><span className="block text-sm font-semibold text-foreground">{c.name}</span>{c.handle && <span className="block text-[11px] text-muted">{c.handle}</span>}</span>
            </button>
          ))}
        </div>
      )}

      {step === "amount" && contact && (
        <div className="space-y-4">
          <button type="button" onClick={() => setStep("contact")} className="text-xs font-bold text-primary hover:underline">← Cambiar destinatario</button>
          <p className="text-sm text-muted">Enviando a <b className="text-foreground">{contact.name}</b></p>
          <input autoFocus type="number" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0"
            className="w-full text-center text-4xl font-black tracking-tight bg-transparent outline-none text-foreground placeholder:text-muted/40"/>
          <p className="text-center text-xs text-muted">Disponible: {fmt(balance)}</p>
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="Agregar una nota (opcional)"
            className="w-full h-11 rounded-xl border border-border bg-surface px-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"/>
          <button type="button" onClick={() => setStep("confirm")} disabled={!valid}
            className="w-full h-12 rounded-xl bg-primary text-white text-sm font-bold disabled:opacity-40 active:scale-[0.98] transition-all">Continuar</button>
          {num > balance && <p className="text-center text-xs font-semibold text-danger">No tenés saldo suficiente.</p>}
        </div>
      )}

      {step === "confirm" && contact && (
        <div className="space-y-4">
          <button type="button" onClick={() => setStep("amount")} className="text-xs font-bold text-primary hover:underline">← Editar monto</button>
          <div className="rounded-2xl border border-border bg-surface-alt/50 p-5 text-center space-y-1">
            <p className="text-3xl font-black text-foreground tracking-tight">{fmt(num)}</p>
            <p className="text-sm text-muted">para {contact.name}</p>
            {note && <p className="text-xs text-muted italic">"{note}"</p>}
          </div>
          <button type="button" onClick={confirm} disabled={busy}
            className="w-full h-12 rounded-xl bg-primary text-white text-sm font-bold disabled:opacity-60 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2">
            {busy && <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin"/>}{busy ? "Enviando…" : "Confirmar envío"}
          </button>
        </div>
      )}

      {step === "done" && contact && (
        <div className="text-center space-y-4 py-4">
          <span className="inline-flex w-14 h-14 rounded-full bg-success/10 text-success items-center justify-center">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </span>
          <p className="text-lg font-bold text-foreground">Enviaste {fmt(num)}</p>
          <p className="text-sm text-muted">a {contact.name}</p>
          <button type="button" onClick={reset} className="h-10 px-5 rounded-xl border border-border text-sm font-bold text-foreground hover:bg-surface-alt transition-colors">Hacer otro envío</button>
        </div>
      )}
    </div>
  );
}
