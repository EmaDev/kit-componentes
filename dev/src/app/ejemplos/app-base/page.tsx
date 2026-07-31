import Link from "next/link";
import { HeroTabs, type HeroTab } from "../../../../../components/Hero";
import { InstallButton } from "../../../../../components/InstallButton";
import { ProgressBar } from "../../../../../components/Progress";
import { BoltIcon, ListIcon, TargetIcon } from "./_components/icons";

/* HeroTabs variant="underline" — navegación *dentro* de la pantalla (estado, no rutas). */
const TABS: HeroTab[] = [
  { id: "resumen", label: "Resumen", icon: <BoltIcon /> },
  { id: "movimientos", label: "Movimientos", icon: <ListIcon />, count: 12 },
  { id: "metas", label: "Metas", icon: <TargetIcon />, count: 3 },
];

const MOVIMIENTOS = [
  { id: "1", label: "Sueldo", detail: "Hoy · 09:12", amount: "+ $ 480.000", tone: "text-success" },
  { id: "2", label: "Supermercado", detail: "Ayer · 20:41", amount: "− $ 38.400", tone: "text-foreground" },
  { id: "3", label: "Transferencia a Ana", detail: "Ayer · 12:05", amount: "− $ 15.000", tone: "text-foreground" },
  { id: "4", label: "Recarga de celular", detail: "Lun · 18:30", amount: "− $ 6.200", tone: "text-foreground" },
];

const METAS = [
  { id: "1", label: "Fondo de emergencia", value: 72 },
  { id: "2", label: "Vacaciones", value: 41 },
  { id: "3", label: "Notebook nueva", value: 18 },
];

function Tile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-alt/50 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-1 text-xl font-bold tabular-nums text-foreground">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export default function AppBaseHome() {
  return (
    <HeroTabs
      sticky
      variant="underline"
      left={
        <div className="mb-1 flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-white">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </span>
          <Link href="/ejemplos" className="text-xs font-semibold text-muted transition-colors hover:text-foreground">
            Base App
          </Link>
        </div>
      }
      title="Hola, Emanuel"
      description="Todo lo que se ve acá está montado por el shell: splash al entrar, safe areas, nav inferior y el FAB con tres acciones."
      actions={<InstallButton size="sm" variant="outline" />}
      tabs={TABS}
      panels={{
        resumen: (
          <div className="grid gap-3 sm:grid-cols-2">
            <Tile label="Saldo" value="$ 812.430" hint="+ 4,2% vs. mes anterior" />
            <Tile label="Gastos del mes" value="$ 214.900" hint="Presupuesto: $ 260.000" />
            <Tile label="Próximo vencimiento" value="12/08" hint="Tarjeta · $ 96.100" />
            <Tile label="Movimientos" value="12" hint="En los últimos 7 días" />
          </div>
        ),
        movimientos: (
          <ul className="flex flex-col gap-2">
            {MOVIMIENTOS.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-3.5 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{m.label}</p>
                  <p className="text-xs text-muted">{m.detail}</p>
                </div>
                <span className={`shrink-0 text-sm font-bold tabular-nums ${m.tone}`}>{m.amount}</span>
              </li>
            ))}
          </ul>
        ),
        metas: (
          <div className="flex flex-col gap-4">
            {METAS.map((m) => (
              <div key={m.id}>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <p className="text-sm font-semibold text-foreground">{m.label}</p>
                  <span className="text-xs font-bold tabular-nums text-muted">{m.value}%</span>
                </div>
                <ProgressBar value={m.value} />
              </div>
            ))}
          </div>
        ),
      }}
    />
  );
}
