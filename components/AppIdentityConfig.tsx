"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "./Input";
import { Textarea } from "./Textarea";
import { ColorPicker } from "./ColorPicker";
import { Button } from "./Button";
import { useAppIdentity } from "../hooks/useAppIdentity";

interface AppIdentityConfigProps {
  /** manifest.json ya cargado (fetch a "/manifest.json"), para no perder claves
   * que este panel no edita (shortcuts, share_target, etc.) al descargar. */
  baseManifest?: Record<string, unknown>;
  title?: string;
  className?: string;
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Panel de configuración de identidad: nombre, colores e íconos que se ven
 * al instalar la PWA (banner de Android, pantalla de inicio, splash).
 * Persiste localmente y permite descargar un manifest.json listo para
 * reemplazar el de `public/`. Para que el ícono cambie en apps YA instaladas
 * hay que resubir ese manifest + los PNG de `/icons` — el sistema operativo
 * no relee el manifest en caliente.
 */
export function AppIdentityConfig({ baseManifest, title = "Identidad de la app", className = "" }: AppIdentityConfigProps) {
  const { identity, update, reset, downloadManifest } = useAppIdentity();
  const [platform, setPlatform] = useState<"ios" | "android">("android");
  const iconInput = useRef<HTMLInputElement>(null);
  const maskableInput = useRef<HTMLInputElement>(null);

  const onPick = async (file: File | undefined, key: "icon" | "maskableIcon") => {
    if (!file) return;
    update({ [key]: await fileToDataUrl(file) });
  };

  return (
    <div className={`grid gap-6 lg:grid-cols-[1fr_320px] ${className}`}>
      <div className="rounded-2xl border border-border bg-surface p-5 space-y-5">
        <p className="text-sm font-semibold text-foreground">{title}</p>

        <Input label="Nombre completo" value={identity.name} onChange={(e) => update({ name: e.target.value })} hint="Se ve en la pantalla de instalación y el splash." />
        <Input label="Nombre corto" value={identity.shortName} onChange={(e) => update({ shortName: e.target.value })} maxLength={12} hint="Debajo del ícono en la pantalla de inicio (máx. ~12 caracteres)." />
        <Textarea label="Descripción" value={identity.description} onChange={(e) => update({ description: e.target.value })} maxLength={120} showCount />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-foreground mb-2">Color de tema</p>
            <ColorPicker value={identity.themeColor} onChange={(hex) => update({ themeColor: hex })} />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground mb-2">Color de fondo (splash)</p>
            <ColorPicker value={identity.backgroundColor} onChange={(hex) => update({ backgroundColor: hex })} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-foreground mb-2">Ícono (512×512)</p>
            <button type="button" onClick={() => iconInput.current?.click()} className="w-full h-24 rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex items-center justify-center overflow-hidden transition-colors">
              {identity.icon ? <img src={identity.icon} alt="" className="w-16 h-16 rounded-xl object-cover" /> : <span className="text-xs text-muted">Subir imagen</span>}
            </button>
            <input ref={iconInput} type="file" accept="image/*" className="hidden" onChange={(e) => onPick(e.target.files?.[0], "icon")} />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground mb-2">Ícono maskable <span className="text-muted font-normal">(opcional)</span></p>
            <button type="button" onClick={() => maskableInput.current?.click()} className="w-full h-24 rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex items-center justify-center overflow-hidden transition-colors">
              {identity.maskableIcon ? <img src={identity.maskableIcon} alt="" className="w-16 h-16 rounded-full object-cover" /> : <span className="text-xs text-muted">Subir imagen</span>}
            </button>
            <input ref={maskableInput} type="file" accept="image/*" className="hidden" onChange={(e) => onPick(e.target.files?.[0], "maskableIcon")} />
          </div>
        </div>
        <p className="text-[11px] text-muted -mt-1">El maskable necesita ~20% de margen: Android puede recortarlo en círculo, squircle o gota.</p>

        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <Button variant="primary" size="sm" onClick={() => downloadManifest(baseManifest)}>Descargar manifest.json</Button>
          <Button variant="ghost" size="sm" onClick={() => reset()}>Restablecer</Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-surface-alt p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-foreground">Vista previa</p>
            <div className="flex rounded-lg bg-surface border border-border p-0.5">
              {(["android", "ios"] as const).map((p) => (
                <button key={p} onClick={() => setPlatform(p)} className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${platform === p ? "bg-primary text-white" : "text-muted"}`}>
                  {p === "android" ? "Android" : "iOS"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-1.5 py-3">
            <div
              className="w-16 h-16 flex items-center justify-center text-white text-lg font-bold overflow-hidden shadow-sm"
              style={{ background: identity.icon ? "transparent" : identity.themeColor, borderRadius: platform === "ios" ? "22%" : "50%" }}
            >
              {identity.icon ? <img src={identity.icon} alt="" className="w-full h-full object-cover" /> : identity.shortName.slice(0, 1).toUpperCase()}
            </div>
            <p className="text-xs font-medium text-foreground max-w-[96px] truncate">{identity.shortName || "Mi App"}</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-surface p-3 flex items-center gap-3"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold overflow-hidden shrink-0"
              style={{ background: identity.icon ? "transparent" : identity.themeColor }}
            >
              {identity.icon ? <img src={identity.icon} alt="" className="w-full h-full object-cover" /> : identity.shortName.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-foreground truncate">{identity.name || "Mi App"}</p>
              <p className="text-[11px] text-muted truncate">{identity.description || "Instalar app"}</p>
            </div>
            <span className="text-[11px] font-semibold text-primary shrink-0">Instalar</span>
          </motion.div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-border">
          <div className="h-28 flex flex-col items-center justify-center gap-2" style={{ background: identity.backgroundColor }}>
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold overflow-hidden"
              style={{ background: identity.icon ? "transparent" : identity.themeColor }}
            >
              {identity.icon ? <img src={identity.icon} alt="" className="w-full h-full object-cover" /> : identity.shortName.slice(0, 1).toUpperCase()}
            </div>
            <p className="text-[11px] font-semibold" style={{ color: identity.themeColor }}>{identity.name || "Mi App"}</p>
          </div>
          <p className="text-center text-[10px] text-muted py-1.5 bg-surface-alt">Splash screen</p>
        </div>
      </div>
    </div>
  );
}
