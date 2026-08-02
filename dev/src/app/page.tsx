"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "../chrome/Header";
import { Footer } from "../chrome/Footer";
import { CatalogNav } from "../chrome/CatalogNav";
import { CATALOG, TOTAL_ENTRIES, matchesEntry, type Category } from "../catalog";

/** Aplica el buscador y descarta grupos/categorías que quedaron vacíos. */
function filterCatalog(query: string): Category[] {
  if (!query.trim()) return CATALOG;
  return CATALOG.map((cat) => ({
    ...cat,
    groups: cat.groups
      .map((g) => ({ ...g, entries: g.entries.filter((e) => matchesEntry(e, query)) }))
      .filter((g) => g.entries.length > 0),
  })).filter((cat) => cat.groups.length > 0);
}

/** Marca en el índice lateral el componente que se está viendo. */
function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.5, 1] }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids]);

  return active;
}

export default function PlaygroundPage() {
  const [query, setQuery] = useState("");
  const categories = useMemo(() => filterCatalog(query), [query]);

  const ids = useMemo(
    () => categories.flatMap((c) => c.groups.flatMap((g) => g.entries.map((e) => e.id))),
    [categories]
  );
  const active = useScrollSpy(ids);

  return (
    <div id="top" className="min-h-screen bg-surface text-foreground">
      <Header query={query} onQueryChange={setQuery} shown={ids.length} total={TOTAL_ENTRIES} />

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 flex gap-8">
        <CatalogNav categories={categories} active={active} />

        <main className="flex-1 min-w-0 py-8 pb-24">
          {categories.length === 0 && (
            <p className="py-24 text-center text-muted">
              Ningún componente coincide con <span className="font-mono text-foreground">{query}</span>.
            </p>
          )}

          {categories.map((cat) => (
            <section key={cat.id} id={cat.id} className="scroll-mt-20 mb-16">
              <div className="border-b-2 border-foreground pb-3 mb-2">
                <h2 className="flex items-baseline gap-3 text-2xl font-bold tracking-tight">
                  <span className="font-mono text-base text-muted">{cat.num}</span>
                  {cat.label}
                  <span className="ml-auto font-mono text-xs font-normal text-muted">
                    {cat.groups.reduce((n, g) => n + g.entries.length, 0)}
                  </span>
                </h2>
              </div>
              <p className="text-sm text-muted max-w-3xl mb-8">{cat.blurb}</p>

              {cat.groups.map((group) => (
                <div key={group.id} className="mb-10">
                  <h3
                    id={group.id}
                    className="scroll-mt-20 mb-4 text-[11px] font-bold uppercase tracking-[0.09em] text-primary"
                  >
                    {group.label}
                    <span className="ml-2 font-mono text-muted/70">{group.entries.length}</span>
                  </h3>

                  <div className="space-y-5">
                    {group.entries.map(({ id, Demo }) => (
                      <Demo key={id} />
                    ))}
                  </div>
                </div>
              ))}
            </section>
          ))}
        </main>
      </div>

      <Footer />
    </div>
  );
}
