import Link from "next/link";
import { InstallButton } from "../../../../../../components/InstallButton";
import { PwaStatus } from "../../../../../../components/PwaStatus";
import { SafeAreaSpacer } from "../../../../../../components/SafeArea";
import { InstallDemo } from "../_components/InstallDemo";

function Block({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-surface-alt/40 p-4">
      <h2 className="text-sm font-bold text-foreground">{title}</h2>
      {hint && <p className="mt-1 text-xs leading-relaxed text-muted">{hint}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default function PerfilPage() {
  return (
    <div className="flex flex-col gap-4 px-5 pb-6 pt-8 sm:px-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Perfil</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          La capa PWA de la app base, desde adentro. En producción estos controles no existen: el instalador
          aparece solo cuando el navegador es elegible.
        </p>
      </div>

      <Block
        title="Instalación"
        hint="InstallButton es el camino no intrusivo (ajustes, header); PwaInstallPrompt es el banner/sheet que interrumpe."
      >
        <div className="flex flex-col gap-3">
          <InstallButton size="sm" hideWhenUnavailable={false} />
          <InstallDemo />
        </div>
      </Block>

      <Block title="Diagnóstico" hint="PwaStatus lee service worker, conexión, permisos y modo de display reales.">
        <PwaStatus observeOnly />
      </Block>

      <Block
        title="Safe area"
        hint="SafeAreaSpacer mide exactamente la inset inferior (el home indicator). En desktop es 0px; en un iPhone instalado son ~34px."
      >
        <div className="rounded-xl border border-dashed border-border bg-surface">
          <p className="px-3 py-2 text-xs text-muted">Último ítem de la lista</p>
          <SafeAreaSpacer edge="bottom" min={8} className="bg-primary/10" />
        </div>
      </Block>

      <Link href="/ejemplos" className="mt-2 text-sm text-muted transition-colors hover:text-foreground">
        ← Volver a Ejemplos
      </Link>
    </div>
  );
}
