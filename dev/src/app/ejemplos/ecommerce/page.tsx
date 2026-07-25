"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "../../../../../components/Card";
import { CardGrid } from "../../../../../components/CardGrid";
import { ChipCarousel, type Chip } from "../../../../../components/ChipCarousel";
import { Input } from "../../../../../components/Input";
import { CountdownBanner } from "../../../../../components/CountdownBanner";
import { PromoPopup } from "../../../../../components/PromoPopup";
import { Pagination } from "../../../../../components/Pagination";
import { useToast } from "../../../../../components/Toast";
import { CATEGORIES, PRODUCTS } from "./_data/products";
import { ProductCard } from "./_components/ProductCard";
import { SearchIcon } from "./_components/icons";

const CHIPS: Chip[] = [{ id: "all", label: "Todos" }, ...CATEGORIES.map((c) => ({ id: c, label: c }))];
const PAGE_SIZE = 6;

export default function EcommerceCatalogPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [promoOpen, setPromoOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setPromoOpen(true);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const matchesCategory = category === "all" || p.category === category;
      const matchesQuery = !q || p.name.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  useEffect(() => {
    setPage(1);
  }, [query, category]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const saleEnds = useMemo(() => new Date(Date.now() + 3 * 3600_000), []);

  return (
    <div>
      <CountdownBanner
        until={saleEnds}
        eyebrow="Hot Sale demo"
        title="La oferta termina en"
        variant="boxes"
        tone="danger"
        className="mb-6 rounded-2xl"
        dismissible
        snoozeDays={1}
        storageKey="ejemplos-ecommerce-countdown"
        expiredMessage="La promoción terminó, pero el catálogo sigue disponible."
      />

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
        <>
          <CardGrid
            items={paged}
            defaultColumns={3}
            minCardWidth={220}
            storageKey="ejemplos-ecommerce-columns"
            renderItem={(p) => <ProductCard key={p.id} product={p} />}
          />
          <Pagination
            className="mt-8"
            page={page}
            pageCount={pageCount}
            total={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </>
      )}

      <PromoPopup
        open={promoOpen}
        onClose={() => setPromoOpen(false)}
        eyebrow="Sólo para nuevos visitantes"
        highlight="15% OFF"
        title="Llevate 15% en tu primera compra"
        description="Dejá tu email y te mandamos el cupón al instante."
        delay={1500}
        snoozeDays={1}
        storageKey="ejemplos-ecommerce-promo"
        emailCapture={{
          onSubmit: async (email) => {
            await new Promise((r) => setTimeout(r, 500));
            toast({ title: "Cupón enviado", description: email, variant: "success" });
          },
          note: "Es una demo: no se envía ningún email real.",
        }}
      />
    </div>
  );
}
