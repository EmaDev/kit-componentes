import { useRouter } from "next/navigation";
import { Button } from "../../../components/Button";
import { Navbar, type NavLink } from "../../../components/Navbar";
import { SideBar, type SidebarSection } from "../../../components/SideBar";
import { BottomNav, type BottomNavItem } from "../../../components/BottomNav";
import { Section, Card } from "../chrome/Section";
import { I } from "../chrome/Icon";

const NAV_LINKS: NavLink[] = [
  { label: "Playground", href: "/", icon: I.zap },
  { label: "Reportes", href: "/nav-demo/reportes", icon: I.layers },
  { label: "Ajustes", href: "/nav-demo/ajustes", icon: I.edit },
];

const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    title: "General",
    links: [
      { label: "Playground", href: "/", icon: I.zap },
      { label: "Reportes", href: "/nav-demo/reportes", icon: I.layers, badge: 3 },
      { label: "Ajustes", href: "/nav-demo/ajustes", icon: I.edit },
    ],
  },
];

const BOTTOMNAV_ITEMS: BottomNavItem[] = [
  { label: "Playground", href: "/", icon: I.zap },
  { label: "Reportes", href: "/nav-demo/reportes", icon: I.layers, badge: 3 },
  { label: "Ajustes", href: "/nav-demo/ajustes", icon: I.edit },
];

function NavGoLive() {
  const router = useRouter();
  return (
    <Button variant="secondary" size="sm" onClick={() => router.push("/nav-demo")}>
      Ver demo con navegación real →
    </Button>
  );
}

function NavbarSection() {
  return (
    <Section
      id="navbar"
      title="Navbar"
      description="Usa next/link + next/navigation — corre de verdad porque el playground es una app Next.js. El link activo se calcula con usePathname(), acá la ruta actual es '/'."
    >
      <Card>
        <div className="rounded-xl border border-border overflow-hidden">
          <Navbar sticky={false} brand={<span className="font-bold text-foreground">Logo</span>} links={NAV_LINKS} />
        </div>
        <div className="mt-4">
          <NavGoLive />
        </div>
      </Card>
    </Section>
  );
}

function SideBarSection() {
  return (
    <Section
      id="sidebar"
      title="SideBar"
      description="h-screen + sticky de verdad; acá se muestra recortada dentro de una caja para no romper el layout del playground."
    >
      <Card>
        <div className="relative h-105 overflow-hidden rounded-xl border border-border">
          <SideBar
            brand={<span className="font-bold text-foreground">Logo</span>}
            sections={SIDEBAR_SECTIONS}
          />
        </div>
        <div className="mt-4">
          <NavGoLive />
        </div>
      </Card>
    </Section>
  );
}

function BottomNavSection() {
  return (
    <Section
      id="bottomnav"
      title="BottomNav"
      description="fixed bottom-0: solo se ve en anchos mobile (<768px). En este preview queda anclada al fondo real de la ventana, no de la Card."
    >
      <Card>
        <p className="text-sm text-muted leading-relaxed">
          Achicá la ventana (o el DevTools en modo mobile) para verla aparecer anclada abajo de la pantalla.
        </p>
        <BottomNav items={BOTTOMNAV_ITEMS} />
        <div className="mt-4">
          <NavGoLive />
        </div>
      </Card>
    </Section>
  );
}

export function NavigationGroup() {
  return (
    <>
      <NavbarSection />
      <SideBarSection />
      <BottomNavSection />
    </>
  );
}
