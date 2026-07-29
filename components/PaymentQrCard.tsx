"use client";
import { useState } from "react";

interface PaymentQrCardProps {
  name: string;
  handle?: string;
  amount?: number;
  currency?: string;
  locale?: string;
  qrValue: string;
  onAmountChange?: (n: number | null) => void;
  onShare?: () => void;
  className?: string;
}
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

// QR placeholder determinístico (no es un QR real, solo la apariencia visual)
function QrGrid({ value, size = 168 }: { value: string; size?: number }) {
  const n = 21;
  let seed = 0;
  for (let i = 0; i < value.length; i++) seed = (seed * 31 + value.charCodeAt(i)) >>> 0;
  const rnd = () => { seed = (seed * 1103515245 + 12345) >>> 0; return (seed >>> 8) / 16777216; };
  const cell = size / n;
  const cells: boolean[] = Array.from({ length: n * n }, () => rnd() > 0.55);
  const isFinder = (x: number, y: number) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-lg bg-white p-2" style={{ width: size, height: size }}>
      {cells.map((on, i) => {
        const x = i % n, y = Math.floor(i / n);
        if (isFinder(x, y)) return null;
        return on ? <rect key={i} x={x * cell} y={y * cell} width={cell} height={cell} fill="#111"/> : null;
      })}
      {[[0, 0], [n - 7, 0], [0, n - 7]].map(([fx, fy], i) => (
        <g key={i} transform={`translate(${fx * cell},${fy * cell})`}>
          <rect width={cell * 7} height={cell * 7} fill="#111"/>
          <rect x={cell} y={cell} width={cell * 5} height={cell * 5} fill="#fff"/>
          <rect x={cell * 2} y={cell * 2} width={cell * 3} height={cell * 3} fill="#111"/>
        </g>
      ))}
    </svg>
  );
}

/** Mostrar mi QR para cobrar: monto opcional, y compartir — complemento de QrScanner. */
export function PaymentQrCard({ name, handle, amount, currency = "ARS", locale = "es-AR", qrValue, onAmountChange, onShare, className = "" }: PaymentQrCardProps) {
  const [input, setInput] = useState(amount ? String(amount) : "");
  const fmt = (n: number) => new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 2 }).format(n);

  return (
    <div className={cn("rounded-2xl border border-border bg-surface p-5 text-center", className)}>
      <p className="text-sm font-bold text-foreground">{name}</p>
      {handle && <p className="text-xs text-muted">{handle}</p>}
      <div className="mt-4 flex justify-center"><QrGrid value={`${qrValue}:${input}`}/></div>
      <div className="mt-4">
        <input inputMode="decimal" value={input} onChange={e => { setInput(e.target.value); onAmountChange?.(e.target.value ? parseFloat(e.target.value) : null); }}
          placeholder="Monto (opcional)" className="w-full text-center text-2xl font-black tracking-tight bg-transparent outline-none text-foreground placeholder:text-muted/40"/>
        {input && <p className="text-xs text-muted mt-0.5">{fmt(parseFloat(input) || 0)}</p>}
      </div>
      <button type="button" onClick={onShare} className="mt-4 h-10 px-5 rounded-xl border border-border text-sm font-bold text-foreground hover:bg-surface-alt transition-colors inline-flex items-center gap-2">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/></svg>
        Compartir
      </button>
    </div>
  );
}
