export default function NavDemoHomePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Inicio</h1>
      <p className="mt-3 text-sm text-muted leading-relaxed">
        Esta mini-app existe solo para mostrar <code>Navbar</code>, <code>SideBar</code> y{" "}
        <code>BottomNav</code> con rutas reales. Navegá entre "Inicio", "Reportes" y "Ajustes" con
        el mouse o el teclado y fijate cómo el link activo cambia de verdad, calculado con{" "}
        <code>usePathname()</code> en cada componente.
      </p>
    </div>
  );
}
