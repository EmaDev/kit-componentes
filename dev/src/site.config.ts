/**
 * Config del playground leída de variables de entorno (ver `.env.example`).
 * Pensada para setear en Vercel al deployar la demo: URL del repo en GitHub,
 * URL pública de este mismo deploy, versión de la librería mostrada en el
 * footer, y un link de donaciones opcional.
 */
export const SITE_CONFIG = {
  repoUrl: process.env.NEXT_PUBLIC_REPO_URL ?? "https://github.com/<usuario>/lib-kit-components",
  demoUrl: process.env.NEXT_PUBLIC_DEMO_URL ?? "https://lib-kit-components.vercel.app",
  libVersion: process.env.NEXT_PUBLIC_LIB_VERSION ?? "0.1.0",
  donateUrl: process.env.NEXT_PUBLIC_DONATE_URL || undefined,
} as const;
