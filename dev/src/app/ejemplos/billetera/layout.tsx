"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { PinLock } from "../../../../../components/PinLock";
import { SplashScreen } from "../../../../../components/SplashScreen";
import { Navbar, type NavLink } from "../../../../../components/Navbar";
import { SideBar, type SidebarSection } from "../../../../../components/SideBar";
import { BottomNav, type BottomNavItem } from "../../../../../components/BottomNav";
import { useToast } from "../../../../../components/Toast";
import { SnackbarProvider } from "../../../../../components/Snackbar";
import { useSplash } from "../../../../../hooks/useSplash";
import { useWalletStore } from "./_store/wallet";
import { WalletHydrator } from "./_store/WalletHydrator";
import { HistoryIcon, HomeIcon, LockIcon } from "./_components/icons";

const PIN = "1234";

const NAV_LINKS: NavLink[] = [
  { label: "Inicio", href: "/ejemplos/billetera", icon: <HomeIcon /> },
  { label: "Movimientos", href: "/ejemplos/billetera/movimientos", icon: <HistoryIcon /> },
];

const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    title: "Billetera",
    links: [
      { label: "Inicio", href: "/ejemplos/billetera", icon: <HomeIcon /> },
      { label: "Movimientos", href: "/ejemplos/billetera/movimientos", icon: <HistoryIcon /> },
    ],
  },
];

const BOTTOMNAV_ITEMS: BottomNavItem[] = [
  { label: "Inicio", href: "/ejemplos/billetera", icon: <HomeIcon /> },
  { label: "Movimientos", href: "/ejemplos/billetera/movimientos", icon: <HistoryIcon /> },
];

export default function BilleteraLayout({ children }: { children: ReactNode }) {
  const { visible: splashVisible } = useSplash({ minDuration: 1200 });
  const unlocked = useWalletStore((s) => s.unlocked);
  const unlock = useWalletStore((s) => s.unlock);
  const lock = useWalletStore((s) => s.lock);
  const { toast } = useToast();

  return (
    <SnackbarProvider position="bottom-center">
    <div className="min-h-screen bg-surface text-foreground">
      <WalletHydrator />

      <SplashScreen
        visible={splashVisible}
        appName="Billetera"
        tagline="Tu plata, simple"
        variant="zoom"
        background="brand"
        version="1.0.0"
      />

      <PinLock
        open={!splashVisible && !unlocked}
        appName="Billetera"
        hint="Pista para la demo: 1234"
        onUnlock={async (code) => {
          await new Promise((r) => setTimeout(r, 500));
          return code === PIN;
        }}
        onSuccess={() => {
          unlock();
          toast({ title: "Bienvenido/a", description: "Tu billetera está lista.", variant: "success" });
        }}
        onLockout={() =>
          toast({
            title: "Demasiados intentos",
            description: "Esperá unos segundos y volvé a intentar.",
            variant: "error",
          })
        }
      />

      {!splashVisible && unlocked && (
        <>
          <Navbar
            brand={
              <Link href="/ejemplos/billetera" className="font-bold text-foreground">
                Billetera
              </Link>
            }
            links={NAV_LINKS}
            actions={
              <div className="flex items-center gap-3">
                <Link href="/ejemplos" className="text-sm text-muted hover:text-foreground transition-colors">
                  ← Ejemplos
                </Link>
                <button
                  type="button"
                  onClick={lock}
                  aria-label="Bloquear billetera"
                  className="w-10 h-10 grid place-items-center rounded-lg text-foreground hover:bg-surface-alt transition-colors"
                >
                  <LockIcon />
                </button>
              </div>
            }
          />

          <div className="flex">
            <div className="hidden md:block">
              <SideBar
                brand={<span className="font-bold text-foreground">Billetera</span>}
                sections={SIDEBAR_SECTIONS}
              />
            </div>
            <main className="flex-1 min-w-0 max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">{children}</main>
          </div>

          <BottomNav items={BOTTOMNAV_ITEMS} />
        </>
      )}
    </div>
    </SnackbarProvider>
  );
}
