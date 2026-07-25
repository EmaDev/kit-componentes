"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Navbar, type NavLink } from "../../../../components/Navbar";
import { SideBar, type SidebarSection } from "../../../../components/SideBar";
import { BottomNav, type BottomNavItem } from "../../../../components/BottomNav";
import { I } from "../../chrome/Icon";

const NAV_LINKS: NavLink[] = [
  { label: "Inicio", href: "/nav-demo", icon: I.zap },
  { label: "Reportes", href: "/nav-demo/reportes", icon: I.layers },
  { label: "Ajustes", href: "/nav-demo/ajustes", icon: I.edit },
];

const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    title: "General",
    links: [
      { label: "Inicio", href: "/nav-demo", icon: I.zap },
      { label: "Reportes", href: "/nav-demo/reportes", icon: I.layers, badge: 3 },
      { label: "Ajustes", href: "/nav-demo/ajustes", icon: I.edit },
    ],
  },
];

const BOTTOMNAV_ITEMS: BottomNavItem[] = [
  { label: "Inicio", href: "/nav-demo", icon: I.zap },
  { label: "Reportes", href: "/nav-demo/reportes", icon: I.layers, badge: 3 },
  { label: "Ajustes", href: "/nav-demo/ajustes", icon: I.edit },
];

export default function NavDemoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface text-foreground">
      <Navbar
        brand={<span className="font-bold text-foreground">Logo</span>}
        links={NAV_LINKS}
        actions={
          <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors">
            ← Volver al playground
          </Link>
        }
      />
      <div className="flex">
        <div className="hidden md:block">
          <SideBar brand={<span className="font-bold text-foreground">Logo</span>} sections={SIDEBAR_SECTIONS} />
        </div>
        <main className="flex-1 min-w-0 max-w-3xl mx-auto px-6 py-10 pb-24">{children}</main>
      </div>
      <BottomNav items={BOTTOMNAV_ITEMS} />
    </div>
  );
}
