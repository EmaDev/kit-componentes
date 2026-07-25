import Link from "next/link";
import { MediaCard } from "../../../../components/Card";
import { Button } from "../../../../components/Button";

interface Example {
  id: string;
  title: string;
  description: string;
  href: string;
  tags: string[];
  available: boolean;
}

const EXAMPLES: Example[] = [
  {
    id: "ecommerce",
    title: "E-commerce",
    description:
      "Catálogo con búsqueda y filtro por categoría, ficha de producto y carrito persistente con Zustand.",
    href: "/ejemplos/ecommerce",
    tags: ["CardGrid", "ChipCarousel", "AddButton", "Tabs", "Zustand"],
    available: true,
  },
  {
    id: "billetera",
    title: "Billetera virtual",
    description:
      "Splash screen, bloqueo por PIN, envío y carga de saldo con AmountPad, e historial de movimientos con skeletons.",
    href: "/ejemplos/billetera",
    tags: ["SplashScreen", "PinLock", "AmountPad", "Skeleton", "Zustand"],
    available: true,
  },
];

export default function EjemplosPage() {
  return (
    <div className="min-h-screen bg-surface text-foreground">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors">
          ← Volver al playground
        </Link>

        <h1 className="mt-4 text-3xl font-bold tracking-tight">Ejemplos</h1>
        <p className="mt-2 text-muted max-w-2xl">
          Mini apps reales construidas con los componentes de la librería. Elegí un ejemplo para abrirlo en su
          propia ruta, con navegación y estado de verdad.
        </p>

        <div className="mt-8 grid sm:grid-cols-2 gap-5">
          {EXAMPLES.map((ex) => (
            <MediaCard
              key={ex.id}
              label={ex.title}
              badge={ex.available ? "Disponible" : "Próximamente"}
              title={ex.title}
              description={ex.description}
              meta={
                <div className="flex flex-wrap gap-1.5">
                  {ex.tags.map((t) => (
                    <span key={t} className="rounded-full bg-surface-alt border border-border px-2 py-0.5 text-[10px] font-semibold text-muted">
                      {t}
                    </span>
                  ))}
                </div>
              }
              actions={
                ex.available ? (
                  <Link href={ex.href}>
                    <Button size="sm">Ver ejemplo</Button>
                  </Link>
                ) : (
                  <Button size="sm" variant="secondary" disabled>
                    Próximamente
                  </Button>
                )
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
