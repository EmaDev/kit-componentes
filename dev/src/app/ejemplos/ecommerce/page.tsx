"use client";

import { useMemo, useState } from "react";
import { Card } from "../../../../../components/Card";
import { CardGrid } from "../../../../../components/CardGrid";
import { ChipCarousel, type Chip } from "../../../../../components/ChipCarousel";
import { Input } from "../../../../../components/Input";
import { CATEGORIES, PRODUCTS } from "./_data/products";
import { ProductCard } from "./_components/ProductCard";
import { SearchIcon } from "./_components/icons";

const CHIPS: Chip[] = [{ id: "all", label: "Todos" }, ...CATEGORIES.map((c) => ({ id: c, label: c }))];

export default function EcommerceCatalogPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const matchesCategory = category === "all" || p.category === category;
      const matchesQuery = !q || p.name.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Catálogo</h1>
        <p className="mt-1 text-sm text-muted">
          {PRODUCTS.length} productos · carrito compartido entre catálogo, ficha y checkout con Zustand.
        </p>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <Input
          placeholder="Buscar productos…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leftIcon={<SearchIcon />}
          className="max-w-sm"
        />
        <ChipCarousel chips={CHIPS} value={category} onChange={(v) => setCategory(v as string)} clearable={false} />
      </div>

      {filtered.length === 0 ? (
        <Card className="py-16 text-center">
          <p className="text-sm text-muted">No encontramos productos con esos filtros.</p>
        </Card>
      ) : (
        <CardGrid
          items={filtered}
          defaultColumns={3}
          minCardWidth={220}
          storageKey="ejemplos-ecommerce-columns"
          renderItem={(p) => <ProductCard key={p.id} product={p} />}
        />
      )}
    </div>
  );
}
