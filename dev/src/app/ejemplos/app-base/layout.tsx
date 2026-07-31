import type { ReactNode } from "react";
import { AppBaseShell } from "./AppBaseShell";

/**
 * Server Component: no lleva "use client". Sólo delega en el shell, así las
 * pantallas de abajo (page.tsx) siguen siendo Server Components.
 */
export default function AppBaseLayout({ children }: { children: ReactNode }) {
  return <AppBaseShell>{children}</AppBaseShell>;
}
