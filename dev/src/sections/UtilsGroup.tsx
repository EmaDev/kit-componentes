import { useMemo, useState } from "react";
import { Button } from "../../../components/Button";
import { useDebounce, useDebouncedCallback } from "../../../hooks/useDebounce";
import { useIdle } from "../../../hooks/useIdle";
import { useIsMobile, useIsTablet, useIsDesktop, usePrefersDark, usePrefersReducedMotion, useIsLandscape } from "../../../hooks/useMediaQuery";
import { useNetworkQuality } from "../../../hooks/useNetworkQuality";
import { useViewTransition, useScreenStack } from "../../../hooks/useViewTransition";
import { useVirtualList } from "../../../hooks/useVirtualList";
import { Section, Card, Row } from "../chrome/Section";

function DebounceSection() {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 500);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const save = useDebouncedCallback(() => setSavedAt(Date.now()), 500);

  return (
    <Section
      id="usedebounce"
      title="useDebounce · useDebouncedCallback · useThrottledCallback"
      description="useDebounce retrasa un valor; useDebouncedCallback retrasa la ejecución de una función; useThrottledCallback limita cuántas veces por segundo puede ejecutarse (no demostrado acá — ver el doc)."
    >
      <Card>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            save();
          }}
          placeholder="Escribí algo…"
          className="w-full h-10 rounded-lg border border-border bg-surface px-3 text-sm"
        />
        <p className="mt-2 text-xs text-muted">Valor debounced (500ms): <span className="font-mono text-foreground">{debounced || "—"}</span></p>
        <p className="text-xs text-muted">Último "autoguardado": {savedAt ? new Date(savedAt).toLocaleTimeString() : "—"}</p>
      </Card>
    </Section>
  );
}

function IdleSection() {
  const { idle, warning, secondsLeft, reset } = useIdle({ timeout: 15_000, warnBefore: 8_000 });
  return (
    <Section id="useidle" title="useIdle" description="Inactividad del usuario con aviso previo. Acá el timeout está bajado a 15s para poder verlo en acción — dejá de tocar la página.">
      <Card>
        <p className="text-sm text-foreground">
          Estado: <strong>{idle ? "inactivo" : warning ? `aviso — ${secondsLeft}s` : "activo"}</strong>
        </p>
        <Row className="mt-3">
          <Button size="sm" variant="secondary" onClick={reset}>Reiniciar contador</Button>
        </Row>
      </Card>
    </Section>
  );
}

function MediaQuerySection() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  const prefersDark = usePrefersDark();
  const reduceMotion = usePrefersReducedMotion();
  const landscape = useIsLandscape();

  const rows: [string, boolean][] = [
    ["useIsMobile", isMobile],
    ["useIsTablet", isTablet],
    ["useIsDesktop", isDesktop],
    ["usePrefersDark", prefersDark],
    ["usePrefersReducedMotion", reduceMotion],
    ["useIsLandscape", landscape],
  ];

  return (
    <Section id="usemediaquery" title="useMediaQuery" description="Media query reactiva y SSR-safe, más los helpers de breakpoint/preferencias más comunes. Redimensioná la ventana para verlos cambiar.">
      <Card>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-muted font-mono text-xs">{label}</dt>
              <dd className={value ? "text-success font-semibold" : "text-muted"}>{String(value)}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </Section>
  );
}

function NetworkQualitySection() {
  const { quality, effectiveType, downlink, rtt, saveData, allowHeavy, imageWidth } = useNetworkQuality();
  return (
    <Section id="usenetworkquality" title="useNetworkQuality" description="Calidad de conexión estimada para carga adaptativa: bajá resolución de imágenes, evitá autoplay y prefetch en redes malas.">
      <Card>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
          <dt className="text-muted">quality</dt><dd className="font-semibold text-foreground">{quality}</dd>
          <dt className="text-muted">effectiveType</dt><dd className="text-foreground">{effectiveType ?? "—"}</dd>
          <dt className="text-muted">downlink</dt><dd className="text-foreground">{downlink ?? "—"}</dd>
          <dt className="text-muted">rtt</dt><dd className="text-foreground">{rtt ?? "—"}</dd>
          <dt className="text-muted">saveData</dt><dd className="text-foreground">{String(saveData)}</dd>
          <dt className="text-muted">allowHeavy</dt><dd className="text-foreground">{String(allowHeavy)}</dd>
          <dt className="text-muted">imageWidth</dt><dd className="text-foreground">{imageWidth}px</dd>
        </dl>
        <p className="mt-3 text-[11px] text-muted">Sin `navigator.connection` (Safari/Firefox) casi siempre da "fast" salvo estar offline.</p>
      </Card>
    </Section>
  );
}

type Screen = "inicio" | "datos" | "listo";

function ViewTransitionSection() {
  const { supported } = useViewTransition();
  const { current, push, pop, depth } = useScreenStack<Screen>("inicio");

  const labels: Record<Screen, string> = { inicio: "Inicio", datos: "Completá tus datos", listo: "¡Listo!" };

  return (
    <Section
      id="useviewtransition"
      title="useViewTransition · useScreenStack"
      description="Transición nativa entre estados (con degradación limpia sin soporte) + una pila de pantallas en memoria con soporte del botón atrás."
    >
      <Card>
        <p className="text-xs text-muted mb-3">Soporte de View Transitions API en este navegador: <strong>{supported ? "sí" : "no"}</strong></p>
        <div className="rounded-xl border border-border p-6 text-center">
          <p className="text-sm font-semibold text-foreground">{labels[current]}</p>
          <Row className="mt-4 justify-center">
            {depth > 1 && <Button size="sm" variant="ghost" onClick={pop}>Atrás</Button>}
            {current === "inicio" && <Button size="sm" onClick={() => push("datos")}>Siguiente</Button>}
            {current === "datos" && <Button size="sm" onClick={() => push("listo")}>Confirmar</Button>}
          </Row>
        </div>
      </Card>
    </Section>
  );
}

function VirtualListSection() {
  const rows = useMemo(() => Array.from({ length: 5000 }, (_, i) => `Fila ${i + 1}`), []);
  const { scrollRef, virtualItems, totalHeight, scrollToIndex } = useVirtualList({ count: rows.length, itemHeight: 40 });

  return (
    <Section id="usevirtuallist" title="useVirtualList" description="5.000 filas montadas sin virtualizar trabarían el scroll — acá sólo se renderizan las visibles (+ overscan).">
      <Card>
        <Row className="mb-3">
          <Button size="sm" variant="secondary" onClick={() => scrollToIndex(0)}>Ir al inicio</Button>
          <Button size="sm" variant="secondary" onClick={() => scrollToIndex(rows.length - 1)}>Ir al final</Button>
        </Row>
        <div ref={scrollRef} className="h-64 overflow-y-auto rounded-xl border border-border">
          <div style={{ height: totalHeight, position: "relative" }}>
            {virtualItems.map((v) => (
              <div
                key={v.index}
                style={{ position: "absolute", top: v.start, height: v.size, left: 0, right: 0 }}
                className="flex items-center px-3 text-sm border-b border-border/60"
              >
                {rows[v.index]}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </Section>
  );
}

export function UtilsGroup() {
  return (
    <>
      <DebounceSection />
      <IdleSection />
      <MediaQuerySection />
      <NetworkQualitySection />
      <ViewTransitionSection />
      <VirtualListSection />
    </>
  );
}
