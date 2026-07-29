# RolePermissionsTable

> Matriz de permisos por rol (filas = permisos, columnas = roles) para paneles de administración de equipo, con celdas toggleables.

**Import**
```tsx
import { RolePermissionsTable } from "lib-kit-components";
import type { Role, PermissionRow } from "lib-kit-components";
```

## Cuándo usarlo

En pantallas de configuración de equipo/organización donde un administrador define qué puede hacer cada rol (ej. "Admin", "Editor", "Lector" como columnas; "Ver reportes", "Editar facturación", "Invitar usuarios" como filas). Cada celda es un botón-checkbox que togglea el acceso de ese permiso para ese rol.

## Cuándo NO usarlo / alternativas

- **No es una tabla de datos genérica.** A diferencia de [`DataTable`](DataTable.md), es una grilla ad-hoc pensada específicamente para esta matriz de dos ejes (roles × permisos): no tiene orden, búsqueda, paginado ni selección de filas. Para listar roles o usuarios como filas explorables (buscar, ordenar, paginar), usá `DataTable`.
- Para **pedir un permiso del navegador** (cámara, ubicación, notificaciones), que es un concepto completamente distinto pese al nombre parecido, usá `PermissionGate` — `RolePermissionsTable` es sobre permisos de negocio dentro de tu app, no permisos del sistema operativo/navegador.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `roles` | `Role[]` | — (requerido) | Roles a mostrar como columnas. |
| `permissions` | `PermissionRow[]` | — (requerido) | Permisos a mostrar como filas, con el acceso actual por rol. |
| `onChange` | `(permissionId: string, roleId: string, value: boolean) => void` | `undefined` | Se dispara después de togglear una celda, con el nuevo valor. |
| `editable` | `boolean` | `true` | Si es `false`, las celdas se muestran de solo lectura (sin poder togglear). |
| `className` | `string` | `""` | Clases adicionales para el contenedor. |

## Tipos exportados

```ts
interface Role {
  id: string;
  label: string;
}

interface PermissionRow {
  id: string;
  label: string;
  access: Record<string, boolean>; // clave = Role.id
}
```

## Ejemplos

### Uso básico
```tsx
const roles: Role[] = [
  { id: "admin", label: "Admin" },
  { id: "editor", label: "Editor" },
  { id: "viewer", label: "Lector" },
];

const permissions: PermissionRow[] = [
  { id: "billing", label: "Ver facturación", access: { admin: true, editor: false, viewer: false } },
  { id: "invite", label: "Invitar usuarios", access: { admin: true, editor: true, viewer: false } },
  { id: "reports", label: "Ver reportes", access: { admin: true, editor: true, viewer: true } },
];

<RolePermissionsTable
  roles={roles}
  permissions={permissions}
  onChange={(permId, roleId, value) => api.updatePermission(permId, roleId, value)}
/>
```

### Solo lectura (ej. para un rol sin permisos de edición)
```tsx
<RolePermissionsTable roles={roles} permissions={permissions} editable={false} />
```

## Requisitos / dependencias

- Sin dependencias externas más allá de React (`useState` para la copia local editable).
- Marcado como `"use client"`. No requiere ningún Provider.

## Notas y comportamiento

- **El componente mantiene una copia local de `permissions`** en `useState(permissions)`, inicializada sólo en el primer render. Si el array `permissions` que le pasás cambia después del montaje (ej. llega una respuesta de red más actualizada, o cambia el usuario seleccionado), la tabla **no se re-sincroniza automáticamente** — sigue mostrando su copia local. Si tu flujo necesita reflejar cambios externos a `permissions` en caliente, montá el componente con una `key` distinta (ej. `key={teamId}`) para forzar que reinicialice su estado.
- El toggle es optimista: actualiza el estado local inmediatamente al hacer click, y **después** llama a `onChange` — no espera confirmación del backend ni revierte automáticamente si falla; si necesitás manejar errores, hacelo dentro de tu handler de `onChange` (por ejemplo, refetch para forzar la remontada con `key` si la escritura falla).
- Con `editable={false}`, los botones quedan con `disabled` mas siguen mostrando el estado de check/sin-check — es una vista de sólo lectura, no oculta la matriz.
