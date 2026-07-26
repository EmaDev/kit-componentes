"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useGeolocation, type Coords } from "../hooks/useGeolocation";

interface LocationPickerProps {
  /** dirección elegida / escrita a mano */
  value?: { address?: string; coords?: Coords | null };
  onChange?: (value: { address?: string; coords?: Coords | null }) => void;
  label?: string;
  placeholder?: string;
  /** traducir coordenadas a dirección (tu backend o un servicio de geocoding) */
  reverseGeocode?: (coords: Coords) => Promise<string>;
  /** sugerencias mientras escribe */
  onSearch?: (q: string) => Promise<{ id: string; label: string; coords?: Coords }[]>;
  className?: string;
}

/**
 * Elegir una ubicación: botón "usar mi ubicación actual" (con precisión y
 * estado del permiso) + campo de dirección con sugerencias.
 * No dibuja mapa: enchufale el tuyo donde va el slot de preview.
 */
export function LocationPicker({
  value,
  onChange,
  label = "Ubicación",
  placeholder = "Calle y número, barrio…",
  reverseGeocode,
  onSearch,
  className = "",
}: LocationPickerProps) {
  const { coords, error, loading, request } = useGeolocation();
  const [address, setAddress] = useState(value?.address ?? "");
  const [suggestions, setSuggestions] = useState<{ id: string; label: string; coords?: Coords }[]>([]);
  const [resolving, setResolving] = useState(false);

  const current = value?.coords ?? coords;

  const useCurrent = async () => {
    request();
    if (!coords) return;
    setResolving(true);
    const text = reverseGeocode ? await reverseGeocode(coords) : `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`;
    setResolving(false);
    setAddress(text);
    onChange?.({ address: text, coords });
  };

  const search = async (q: string) => {
    setAddress(q);
    onChange?.({ address: q, coords: current });
    if (!onSearch || q.length < 3) return setSuggestions([]);
    setSuggestions(await onSearch(q));
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {label && <p className="text-xs font-semibold text-foreground">{label}</p>}

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
          <PinIcon />
        </span>
        <input
          value={address}
          onChange={(e) => search(e.target.value)}
          placeholder={placeholder}
          className="w-full h-11 pl-9 pr-3 rounded-xl border border-border bg-surface text-sm text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors"
        />
        {suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute z-20 inset-x-0 top-full mt-1.5 rounded-xl border border-border bg-surface shadow-xl shadow-black/10 overflow-hidden"
          >
            {suggestions.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => {
                    setAddress(s.label);
                    setSuggestions([]);
                    onChange?.({ address: s.label, coords: s.coords ?? current });
                  }}
                  className="w-full text-left px-3.5 py-2.5 text-sm text-foreground hover:bg-surface-alt transition-colors"
                >
                  {s.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </div>

      <button
        onClick={useCurrent}
        disabled={loading || resolving}
        className="inline-flex items-center gap-2 h-9 px-3 rounded-xl border border-border bg-surface text-xs font-semibold text-foreground hover:bg-surface-alt active:scale-95 transition-all disabled:opacity-60"
      >
        <span className={loading ? "animate-pulse text-primary" : "text-primary"}>
          <CrosshairIcon />
        </span>
        {loading ? "Buscando tu ubicación…" : resolving ? "Resolviendo dirección…" : "Usar mi ubicación actual"}
      </button>

      {error && <p className="text-[11px] text-danger">{error}</p>}

      {current && (
        <div className="rounded-xl border border-border bg-surface-alt/50 px-3 py-2.5 flex items-center justify-between gap-3">
          <p className="text-[11px] text-muted font-mono">
            {current.lat.toFixed(5)}, {current.lng.toFixed(5)}
          </p>
          <span className="text-[11px] text-muted">±{Math.round(current.accuracy)} m</span>
        </div>
      )}
    </div>
  );
}

const svg = {
  width: 15,
  height: 15,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function PinIcon() {
  return <svg {...svg} width="16" height="16"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}
function CrosshairIcon() {
  return (
    <svg {...svg}>
      <circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <line x1="12" y1="1.5" x2="12" y2="4" /><line x1="12" y1="20" x2="12" y2="22.5" />
      <line x1="1.5" y1="12" x2="4" y2="12" /><line x1="20" y1="12" x2="22.5" y2="12" />
    </svg>
  );
}
