// =============================================================
//  Navbar / SideBar / BottomNav — versión preview
// =============================================================

// useState/useEffect are already destructured in atoms.jsx (shared babel scope)

// ---- Navbar -----------------------------------------------------
function Navbar({ brand, links = [], activeHref, onNavigate, actions, sticky = true }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={cx(
      sticky && "sticky top-0 z-40",
      "w-full transition-all duration-300",
      scrolled ? "bg-surface/80 backdrop-blur-xl border-b border-border shadow-sm shadow-black/5"
               : "bg-surface/0 border-b border-transparent",
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">{brand}</div>

        <ul className="hidden md:flex items-center gap-1 relative">
          {links.map(l => {
            const active = activeHref === l.href;
            return (
              <li key={l.href} className="relative">
                <button onClick={()=>onNavigate?.(l.href)}
                  className={cx(
                    "relative inline-flex items-center gap-2 px-3.5 py-2 text-sm rounded-lg transition-colors duration-200",
                    active ? "text-foreground" : "text-muted hover:text-foreground",
                  )}>
                  {l.icon}{l.label}
                  {active && <span className="absolute inset-0 -z-10 rounded-lg bg-surface-alt"/>}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">{actions}</div>
          <button onClick={()=>setMobileOpen(v=>!v)}
            className="md:hidden w-10 h-10 inline-flex items-center justify-center rounded-lg text-foreground hover:bg-surface-alt active:scale-90 transition-transform">
            <div className="relative w-5 h-5">
              <span className="absolute left-0 right-0 top-1/2 h-[2px] bg-current rounded-full transition-all duration-300"
                style={{ transform: mobileOpen ? "rotate(45deg) translateY(0)" : "translateY(-5px)" }}/>
              <span className="absolute left-0 right-0 top-1/2 h-[2px] bg-current rounded-full transition-opacity duration-200"
                style={{ opacity: mobileOpen ? 0 : 1 }}/>
              <span className="absolute left-0 right-0 top-1/2 h-[2px] bg-current rounded-full transition-all duration-300"
                style={{ transform: mobileOpen ? "rotate(-45deg) translateY(0)" : "translateY(5px)" }}/>
            </div>
          </button>
        </div>
      </div>

      <div className={cx(
        "md:hidden overflow-hidden border-t border-border bg-surface transition-all duration-300 ease-in-out",
        mobileOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0",
      )}>
        <ul className="px-4 py-3 flex flex-col gap-0.5">
          {links.map(l => {
            const active = activeHref === l.href;
            return (
              <li key={l.href}>
                <button onClick={()=>{onNavigate?.(l.href); setMobileOpen(false);}}
                  className={cx(
                    "w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm",
                    active ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-surface-alt",
                  )}>{l.icon}{l.label}</button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

// ---- SideBar ----------------------------------------------------
function SideBar({ brand, sections, footer, defaultCollapsed=false, activeHref, onNavigate }) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  return (
    <aside className="h-full shrink-0 bg-surface border-r border-border flex flex-col overflow-hidden transition-[width] duration-300"
      style={{ width: collapsed ? 76 : 256 }}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-border shrink-0">
        <div className={cx("overflow-hidden whitespace-nowrap transition-all duration-200", collapsed && "opacity-0 -translate-x-2 w-0")}>{brand}</div>
        <button onClick={()=>setCollapsed(v=>!v)}
          className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-surface-alt active:scale-90 transition-all shrink-0">
          <span className="transition-transform duration-300" style={{ transform: collapsed ? "rotate(180deg)":"rotate(0)" }}>{I.chevLeft}</span>
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-3 px-2.5">
        {sections.map((section, si) => (
          <div key={si} className={si > 0 ? "mt-5" : ""}>
            {!collapsed && section.title && (
              <div className="px-2 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted whitespace-nowrap">
                {section.title}
              </div>
            )}
            <ul className="flex flex-col gap-0.5">
              {section.links.map(link => {
                const active = activeHref === link.href;
                return (
                  <li key={link.href} className="relative">
                    <button onClick={()=>onNavigate?.(link.href)} title={collapsed ? link.label : undefined}
                      className={cx(
                        "group relative flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm w-full text-left",
                        "transition-colors duration-150",
                        active ? "text-primary bg-primary/10" : "text-foreground hover:bg-surface-alt",
                      )}>
                      <span className="w-5 h-5 shrink-0 inline-flex items-center justify-center">{link.icon}</span>
                      <span className={cx("flex-1 whitespace-nowrap overflow-hidden font-medium transition-all", collapsed && "opacity-0 -translate-x-2 w-0")}>{link.label}</span>
                      {link.badge != null && (
                        <span className={cx(
                          "inline-flex items-center justify-center text-[10px] font-bold rounded-full",
                          collapsed ? "absolute -top-1 -right-1 w-4 h-4" : "min-w-[20px] h-5 px-1.5",
                          active ? "bg-primary text-white" : "bg-surface-alt text-foreground",
                        )}>{link.badge}</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      {footer && <div className="border-t border-border p-3 shrink-0">{footer}</div>}
    </aside>
  );
}

// ---- BottomNav --------------------------------------------------
function BottomNav({ items, activeHref, onNavigate }) {
  return (
    <nav className="bg-surface/85 backdrop-blur-xl border-t border-border w-full">
      <ul className="grid h-16 px-2" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
        {items.map(item => {
          const active = activeHref === item.href;
          return (
            <li key={item.href} className="relative">
              <button onClick={()=>onNavigate?.(item.href)}
                className="relative h-full w-full flex flex-col items-center justify-center gap-1 px-1">
                <span className={cx(
                  "absolute top-0 left-1/2 -translate-x-1/2 w-10 h-[3px] rounded-full bg-primary transition-all duration-300",
                  active ? "opacity-100 scale-100" : "opacity-0 scale-50",
                )}/>
                <span className="relative w-6 h-6 inline-flex items-center justify-center transition-all duration-300"
                  style={{
                    color: active ? "var(--color-primary)" : "var(--color-muted)",
                    transform: active ? "translateY(-2px) scale(1.1)" : "translateY(0) scale(1)",
                  }}>
                  {item.icon}
                  {item.badge > 0 && (
                    <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-danger text-white text-[9px] font-bold inline-flex items-center justify-center">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </span>
                <span className="text-[10px] leading-none transition-colors"
                  style={{ color: active ? "var(--color-primary)" : "var(--color-muted)", fontWeight: active ? 600 : 500 }}>
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

Object.assign(window, { Navbar, SideBar, BottomNav });
