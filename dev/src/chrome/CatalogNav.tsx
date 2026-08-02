import type { Category } from "../catalog";

/**
 * Índice lateral: todas las categorías → grupos → componentes, siempre a la
 * vista. Es la forma más rápida de encontrar un componente por nombre cuando
 * no se sabe exactamente cómo se llama.
 */
export function CatalogNav({ categories, active }: { categories: Category[]; active: string }) {
  return (
    <nav
      aria-label="Índice de componentes"
      className="hidden lg:block sticky top-16 self-start w-60 shrink-0 h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain pr-3 py-6"
    >
      {categories.length === 0 && <p className="px-2 text-sm text-muted">Sin resultados.</p>}

      {categories.map((cat) => (
        <div key={cat.id} className="mb-6">
          <a
            href={`#${cat.id}`}
            className="flex items-baseline gap-2 px-2 mb-2 text-[11px] font-bold uppercase tracking-wider text-foreground hover:text-primary transition-colors"
          >
            <span className="font-mono text-muted">{cat.num}</span>
            {cat.label}
          </a>

          {cat.groups.map((group) => (
            <div key={group.id} className="mb-3">
              <p className="px-2 mb-1 text-[11px] font-medium text-muted/80">{group.label}</p>
              <ul className="border-l border-border ml-2">
                {group.entries.map((entry) => {
                  const isActive = active === entry.id;
                  return (
                    <li key={entry.id}>
                      <a
                        href={`#${entry.id}`}
                        className={[
                          "relative block pl-3 pr-2 py-1 text-[13px] leading-snug rounded-r-md transition-colors",
                          isActive ? "text-primary font-medium" : "text-muted hover:text-foreground",
                        ].join(" ")}
                      >
                        {isActive && (
                          <span className="absolute -left-px top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-primary" />
                        )}
                        {entry.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </nav>
  );
}
