"use client";
import { useState } from "react";

export interface Role { id: string; label: string }
export interface PermissionRow { id: string; label: string; access: Record<string, boolean> }
interface RolePermissionsTableProps {
  roles: Role[];
  permissions: PermissionRow[];
  onChange?: (permissionId: string, roleId: string, value: boolean) => void;
  editable?: boolean;
  className?: string;
}
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Tabla de permisos por rol para paneles de administración de equipo. */
export function RolePermissionsTable({ roles, permissions, onChange, editable = true, className = "" }: RolePermissionsTableProps) {
  const [local, setLocal] = useState(permissions);
  const toggle = (permId: string, roleId: string) => {
    if (!editable) return;
    setLocal(rows => rows.map(r => r.id === permId ? { ...r, access: { ...r.access, [roleId]: !r.access[roleId] } } : r));
    onChange?.(permId, roleId, !local.find(r => r.id === permId)?.access[roleId]);
  };

  return (
    <div className={cn("overflow-x-auto rounded-2xl border border-border", className)}>
      <table className="w-full text-sm border-collapse min-w-[480px]">
        <thead>
          <tr className="bg-surface-alt/60">
            <th className="text-left font-bold text-foreground px-4 py-3">Permiso</th>
            {roles.map(r => <th key={r.id} className="text-center font-bold text-foreground px-3 py-3">{r.label}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {local.map(row => (
            <tr key={row.id} className="bg-surface">
              <td className="px-4 py-3 text-foreground font-medium">{row.label}</td>
              {roles.map(r => (
                <td key={r.id} className="text-center px-3 py-3">
                  <button type="button" disabled={!editable} onClick={() => toggle(row.id, r.id)}
                    className={cn("w-6 h-6 rounded-md border-2 inline-flex items-center justify-center transition-all mx-auto", row.access[r.id] ? "bg-primary border-primary text-white" : "border-border", editable && "hover:border-primary/50")}>
                    {row.access[r.id] && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
