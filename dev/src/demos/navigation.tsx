import { Navbar, type NavLink } from "../../../components/Navbar";
import { SideBar, type SidebarSection } from "../../../components/SideBar";
import { BottomNav, type BottomNavItem } from "../../../components/BottomNav";
import { Section, Card } from "../chrome/Section";
import { I } from "../chrome/Icon";

const NAV_LINKS: NavLink[] = [
  { label: "Inicio", href: "/", icon: I.zap },
  { label: "Reportes", href: "/#datatable", icon: I.layers },
  { label: "Ajustes", href: "/#themeconfigurator", icon: I.edit },
];

const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    title: "General",
    links: [
      { label: "Inicio", href: "/", icon: I.zap },
      { label: "Reportes", href: "/#datatable", icon: I.layers, badge: 3 },
      { label: "Ajustes", href: "/#themeconfigurator", icon: I.edit },
    ],
  },
];

const BOTTOMNAV_ITEMS: BottomNavItem[] = [
  { label: "Inicio", href: "/", icon: I.zap },
  { label: "Reportes", href: "/#datatable", icon: I.layers, badge: 3 },
  { label: "Ajustes", href: "/#themeconfigurator", icon: I.edit },
];

export function NavbarSection() {
  return (
    <Section
      id="navbar"
      title="Navbar"
      description="Barra superior con next/link. El link activo lo calcula usePathname(): acá la ruta es '/', por eso «Inicio» queda marcado."
    >
      <Card>
        <div className="rounded-xl border border-border overflow-hidden">
          <Navbar sticky={false} brand={<span className="font-bold text-foreground">Logo</span>} links={NAV_LINKS} />
        </div>
      </Card>
    </Section>
  );
}

export function SideBarSection() {
  return (
    <Section
      id="sidebar"
      title="SideBar"
      description="Barra lateral h-screen + sticky; acá se muestra recortada dentro de una caja para no romper el layout."
    >
      <Card>
        <div className="relative h-105 overflow-hidden rounded-xl border border-border">
          <SideBar brand={<span className="font-bold text-foreground">Logo</span>} sections={SIDEBAR_SECTIONS} />
        </div>
      </Card>
    </Section>
  );
}

export function BottomNavSection() {
  return (
    <Section
      id="bottomnav"
      title="BottomNav"
      description="fixed bottom-0: sólo se ve en anchos mobile (<768px), anclada al fondo real de la ventana."
    >
      <Card>
        <p className="text-sm text-muted leading-relaxed">
          Achicá la ventana (o usá el DevTools en modo mobile) para verla aparecer abajo de la pantalla.
        </p>
        <BottomNav items={BOTTOMNAV_ITEMS} />
      </Card>
    </Section>
  );
}
