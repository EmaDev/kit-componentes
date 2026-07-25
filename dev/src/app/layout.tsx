import type { Metadata } from "next";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import { ToastProvider } from "../../../components/Toast";
import { TenantThemeProvider } from "../../../components/TenantTheme";
import { TENANTS } from "../tenants";
import "./globals.css";

export const metadata: Metadata = {
  title: "lib-kit-components · Playground",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Resolver el tenant en el servidor es lo que evita el flash de marca:
  // el <style> con las CSS vars ya viene en el HTML del primer render.
  const host = (await headers()).get("host") ?? undefined;

  return (
    <html lang="es">
      <body>
        <TenantThemeProvider themes={TENANTS} host={host} defaultTenantId="lib-kit">
          <ToastProvider>{children}</ToastProvider>
        </TenantThemeProvider>
      </body>
    </html>
  );
}
