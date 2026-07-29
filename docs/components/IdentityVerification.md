# IdentityVerification

> Flujo paso a paso de verificación de identidad (KYC): foto del frente y dorso del documento, más una selfie, con barra de progreso y pantalla de confirmación final.

**Import**
```tsx
import { IdentityVerification } from "lib-kit-components";
import type { IdVerificationStep } from "lib-kit-components";
```

## Cuándo usarlo

Cuando necesitás validar la identidad de un usuario antes de habilitarle una operación sensible (abrir cuenta, retirar fondos, verificar edad, etc.): pedirle foto del frente del documento, del dorso, y una selfie, en tres pasos secuenciales con barra de progreso, para luego enviarlos a revisión (`onSubmit`). Al terminar, muestra automáticamente una pantalla de confirmación ("Documentos enviados... te avisamos por correo").

## Cuándo NO usarlo / alternativas

- Si sólo necesitás un código de un solo uso (OTP) para confirmar un número de teléfono o correo —sin subir documentos—, usá [CodeOTP](CodeOTP.md), no `IdentityVerification`. De hecho `IdentityVerification` está pensado como el paso previo a un OTP, no como reemplazo.
- Si sólo necesitás capturar una foto genérica con la cámara del dispositivo (no un flujo de KYC de 3 pasos), usá [CameraCapture](CameraCapture.md) directamente.
- Para pedir un permiso del navegador (cámara, ubicación, notificaciones) sin que haya un flujo de documentos de por medio, usá [PermissionGate](PermissionGate.md).
- Si el checklist es de aprobación interna de un tercero (no de identidad del propio usuario final), usá `ApprovalChecklist`.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `onSubmit` | `(files: { idFront: File; idBack: File; selfie: File }) => Promise<void> \| void` | `undefined` | Se llama al confirmar el último paso, con los tres archivos capturados. Mientras la promesa está pendiente, el botón muestra spinner y queda deshabilitado. |
| `className` | `string` | `""` | Clases adicionales para el contenedor. |

## Tipos exportados

```ts
type IdVerificationStep = "id-front" | "id-back" | "selfie" | "review" | "done";
```

> Nota: el componente sólo recorre internamente los pasos `"id-front"`, `"id-back"` y `"selfie"`; `"review"` y `"done"` forman parte del tipo pero no tienen una pantalla propia en la implementación actual (el estado final "documentos enviados" se resuelve con un flag interno, no como un paso más del stepper).

## Ejemplos

### Uso básico con envío a un endpoint
```tsx
<IdentityVerification
  onSubmit={async ({ idFront, idBack, selfie }) => {
    const form = new FormData();
    form.append("idFront", idFront);
    form.append("idBack", idBack);
    form.append("selfie", selfie);
    await fetch("/api/kyc", { method: "POST", body: form });
  }}
/>
```

### Dentro de un Modal de onboarding
```tsx
<Modal open={showKyc} onClose={() => setShowKyc(false)} title="Verificá tu identidad">
  <IdentityVerification onSubmit={handleKycSubmit} />
</Modal>
```

## Requisitos / dependencias

- Marcado como `"use client"`. No requiere ningún Provider.
- Usa `<input type="file" accept="image/*" capture="environment">`, por lo que en mobile abre la cámara trasera directamente; en desktop cae al selector de archivos del sistema.
- No depende de Next.js ni de `framer-motion`.

## Notas y comportamiento

- Es un flujo **no controlado**: todo el estado (paso actual, archivos, loading, si terminó) vive internamente; no hay props para leer o forzar el paso actual desde afuera.
- El botón "Siguiente"/"Enviar para revisión" está deshabilitado hasta que el paso actual tenga un archivo cargado (`!current`).
- Genera un `URL.createObjectURL` por cada archivo para la vista previa — como no se libera con `URL.revokeObjectURL`, si el flujo se monta/desmonta muchas veces en una sesión muy larga puede acumular memoria; no relevante para un uso normal de una vez por sesión.
- No hay validación de tipo/tamaño de archivo más allá de `accept="image/*"` del input: si necesitás límites de peso o formato, validalos en tu `onSubmit` antes de enviarlos.
- Si `onSubmit` rechaza (throw), el componente igual sale del estado `busy` (por el `finally`) pero **no** vuelve a mostrar un error visible ni retrocede de paso — manejar el error (ej. con un `Toast`) es responsabilidad del consumidor dentro de su propio `onSubmit`.
