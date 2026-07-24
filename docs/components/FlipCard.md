# FlipCard / CreditCard / CreditCardStack

> Contenedor 3D de dos caras que se voltea con animación (`FlipCard`), una tarjeta de crédito/débito lista para usar construida sobre él (`CreditCard`), y una pila apilable de esas tarjetas (`CreditCardStack`).

**Import**
```tsx
import { FlipCard, CreditCard, CreditCardStack, type CreditCardData } from "lib-kit-components";
```

## Cuándo usarlo

`FlipCard` es un contenedor genérico para cualquier contenido que necesite un "reveal" tipo tarjeta física volteable (fichas, tarjetas de crédito/débito, cartas de juego, tarjetas de presentación digitales). `CreditCard` es la implementación lista para pagos/billeteras: dibuja el frente (número enmascarable, titular, vencimiento, marca) y el dorso (banda magnética y CVC) de una tarjeta, y usa `FlipCard` internamente. `CreditCardStack` sirve cuando el usuario tiene varias tarjetas (ej. selector de método de pago): apila las tarjetas con offset visual, permite tocar una tarjeta de atrás para traerla al frente, y voltea sólo la que está activa.

## Cuándo NO usarlo / alternativas

- Si sólo necesitás mostrar datos de tarjeta sin la interacción de volteo (por ejemplo, un resumen de facturación de sólo lectura), puede ser más simple maquetar una tarjeta estática en vez de `CreditCard`.
- Si el reveal no necesita ser literalmente 3D (ej. mostrar/ocultar un panel con fade), usá otro patrón más liviano en vez de `FlipCard`.
- No están relacionados con `Stepper`/`FloatingButton`; no hay ambigüedad de uso con esos componentes.

## Props

### FlipCard

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `front` | `ReactNode` | — (requerido) | Contenido de la cara frontal. |
| `back` | `ReactNode` | — (requerido) | Contenido de la cara trasera. |
| `flipped` | `boolean` | `undefined` | Estado controlado desde afuera. Si se omite, el componente maneja su propio estado interno y voltea al hacer click/tap. |
| `onFlipChange` | `(flipped: boolean) => void` | `undefined` | Callback al voltear. Si se provee junto con `flipped`, el componente queda controlado (no actualiza estado interno). |
| `axis` | `"x" \| "y"` | `"y"` | Eje de rotación 3D: `"y"` rota horizontalmente (efecto libro), `"x"` rota verticalmente. |
| `aspect` | `number` | `1.586` | Relación de aspecto del contenedor (ancho/alto). El default corresponde al estándar de tarjeta ISO 7810. |
| `className` | `string` | `""` | Clases CSS adicionales para el contenedor raíz. |

### CreditCard

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `data` | `CreditCardData` | — (requerido) | Datos de la tarjeta a mostrar. |
| `theme` | `"dark" \| "brand" \| "steel" \| string` | `"dark"` | Gradiente de fondo. `"dark"`, `"brand"` (usa `--color-primary`/`--color-accent`) y `"steel"` son presets; cualquier otro string se usa tal cual como valor CSS de `background` (permite pasar un gradiente/color custom). |
| `masked` | `boolean` | `false` | Si es `true`, enmascara todos los grupos del número salvo el último (`••••` en vez de los dígitos). |
| `flipped` | `boolean` | `undefined` | Igual que en `FlipCard`: estado controlado del volteo. |
| `onFlipChange` | `(flipped: boolean) => void` | `undefined` | Igual que en `FlipCard`. |
| `className` | `string` | `""` | Clases CSS adicionales, pasadas a `FlipCard`. |

### CreditCardStack

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `cards` | `(CreditCardProps & { id: string })[]` | — (requerido) | Lista de tarjetas a apilar. Cada elemento acepta las mismas props que `CreditCard` (`data`, `theme`, `masked`, `className`) más un `id` único usado como key. **Nota:** las props `flipped`/`onFlipChange` de cada card individual son sobrescritas internamente por `CreditCardStack` (ver Notas). |
| `className` | `string` | `""` | Clases CSS adicionales para el contenedor raíz. |

## Tipos exportados

```ts
export interface CreditCardData {
  number: string;
  holder: string;
  expiry: string;
  cvc: string;
  brand?: "visa" | "mastercard" | "amex" | "generic";
  label?: string; // ej. "Débito" / "Crédito"; default mostrado: "Débito"
}
```

## Ejemplos

### FlipCard genérico (contenido arbitrario)
```tsx
<FlipCard
  className="w-72"
  front={<div className="rounded-2xl bg-primary text-white p-6">Frente</div>}
  back={<div className="rounded-2xl bg-surface-alt p-6">Dorso</div>}
/>
```

### CreditCard básica
```tsx
import { CreditCard, type CreditCardData } from "lib-kit-components";

const card: CreditCardData = {
  number: "4111 1111 1111 1234",
  holder: "Juan Pérez",
  expiry: "08/29",
  cvc: "123",
  brand: "visa",
  label: "Crédito",
};

<CreditCard data={card} theme="brand" className="w-80" />
```

### CreditCard enmascarada, controlada
```tsx
const [flipped, setFlipped] = useState(false);

<CreditCard
  data={card}
  masked
  flipped={flipped}
  onFlipChange={setFlipped}
  className="w-80"
/>
<Button onClick={() => setFlipped((v) => !v)}>Ver CVC</Button>
```

### CreditCardStack (selector de método de pago)
```tsx
import { CreditCardStack } from "lib-kit-components";

<CreditCardStack
  className="w-80 h-48"
  cards={[
    { id: "card-1", data: card1, theme: "dark" },
    { id: "card-2", data: card2, theme: "steel" },
    { id: "card-3", data: card3, theme: "brand" },
  ]}
/>
```

## Requisitos / dependencias

- No depende de `next`. Funciona en cualquier app React/Next.js.
- Usa `framer-motion` intensamente: rotación 3D con spring (`FlipCard`), y en `CreditCardStack` las animaciones de offset/escala/opacidad al reordenar la pila (`AnimatePresence` + `layout`).
- `FlipCard` es controlado u no controlado según se pase o no `flipped`/`onFlipChange` juntos (patrón estándar: `flipped ?? inner state`).

## Notas y comportamiento

- `FlipCard` es interactivo por accesibilidad: tiene `role="button"`, `tabIndex={0}`, `aria-pressed={isFlipped}` y responde a `Enter`/`Espacio` además de click.
- La cara trasera se posiciona con `backfaceVisibility: hidden` y una rotación de 180° pre-aplicada, así que nunca se ve "al revés" durante la animación.
- `CreditCard.number` se agrupa automáticamente en bloques de 4 dígitos vía regex (`.replace(/\s+/g, "").match(/.{1,4}/g)`), independientemente de cómo venga formateado el string de entrada (con o sin espacios).
- Con `masked={true}`, todos los grupos excepto el **último** se reemplazan por `"••••"` — el último grupo (últimos 4 dígitos) siempre queda visible.
- El ícono de marca (`BrandMark`) soporta `"visa"`, `"mastercard"`, `"amex"` y cualquier otro valor (incluido `undefined`) cae en un ícono genérico de dos círculos superpuestos.
- `theme` acepta cualquier string CSS válido además de los tres presets (`"dark"`, `"brand"`, `"steel"`) — por ejemplo `theme="linear-gradient(135deg,#000,#333)"` o un color plano.
- En `CreditCardStack`, sólo se renderizan las 3 tarjetas más cercanas al frente (`offset > 2` se descarta del render) por performance; las demás quedan ocultas hasta que rotan dentro de ese rango.
- En `CreditCardStack`, únicamente la tarjeta con `offset === 0` (la de adelante) recibe `flipped`/`onFlipChange` reales (manejados por el propio stack); las tarjetas de atrás siempre se renderizan con `flipped={false}` y sin `onFlipChange`, por lo que **cualquier `flipped`/`onFlipChange` que pases dentro de un elemento de `cards` es ignorado** — el volteo sólo aplica a la tarjeta activa.
- Al tocar una tarjeta de atrás (`offset !== 0`), pasa a ser la activa (`setActiveIndex`) y el estado de volteo se resetea a `false`.
