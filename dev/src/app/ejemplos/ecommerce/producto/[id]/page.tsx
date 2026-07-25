"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Breadcrumbs, type Crumb } from "../../../../../../../components/Breadcrumbs";
import { Card, CardMedia } from "../../../../../../../components/Card";
import { CardGrid } from "../../../../../../../components/CardGrid";
import { Tabs, type TabItem } from "../../../../../../../components/Tabs";
import { AddButton } from "../../../../../../../components/AddButton";
import { AddToCartButton } from "../../../../../../../components/AddToCartButton";
import { ShareButton } from "../../../../../../../components/ShareButton";
import { ProgressBar } from "../../../../../../../components/Progress";
import { Button } from "../../../../../../../components/Button";
import { useToast } from "../../../../../../../components/Toast";
import { getProduct, PRODUCTS, formatPrice } from "../../_data/products";
import { useCartStore, useCartQty } from "../../_store/cart";
import { ProductCard } from "../../_components/ProductCard";
import { Stars } from "../../_components/Stars";

const TABS: TabItem[] = [
  { id: "desc", label: "Descripción" },
  { id: "specs", label: "Especificaciones" },
  { id: "envio", label: "Envío" },
];

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const product = getProduct(id);
  const [tab, setTab] = useState("desc");
  const [qty, setQty] = useState(1);
  const add = useCartStore((s) => s.add);
  const inCart = useCartQty(id);
  const { toast } = useToast();

  if (!product) {
    return (
      <Card className="py-16 text-center">
        <p className="text-sm text-muted mb-4">No encontramos ese producto.</p>
        <Link href="/ejemplos/ecommerce">
          <Button variant="secondary">Volver al catálogo</Button>
        </Link>
      </Card>
    );
  }

  const outOfStock = product.stock === 0;
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  const crumbs: Crumb[] = [
    { label: "Ejemplos", href: "/ejemplos" },
    { label: "E-commerce", href: "/ejemplos/ecommerce" },
    { label: product.category, href: "/ejemplos/ecommerce" },
    { label: product.name },
  ];

  return (
    <div>
      <Breadcrumbs
        items={crumbs}
        className="mb-6"
        onNavigate={(item) => {
          if (item.href) router.push(item.href);
        }}
      />

      <div className="grid md:grid-cols-2 gap-8">
        <Card variant="outline" padding="none">
          <CardMedia label={product.name} aspect={1} />
        </Card>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">{product.category}</p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2">
            <Stars value={product.rating} />
            <span className="text-xs text-muted">
              {product.rating.toFixed(1)} · {outOfStock ? "sin stock" : `${product.stock} disponibles`}
            </span>
          </div>

          <p className="mt-4 text-3xl font-bold text-foreground">{formatPrice(product.price)}</p>

          {!outOfStock && (
            <div className="mt-3 max-w-xs">
              <ProgressBar
                value={Math.min(100, (product.stock / 20) * 100)}
                tone={product.stock < 5 ? "danger" : "success"}
                label={product.stock < 5 ? "Queda poco stock" : "Stock disponible"}
                size="sm"
              />
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {outOfStock ? (
              <span className="text-sm font-semibold text-muted">Este producto está agotado.</span>
            ) : (
              <>
                <AddButton value={qty} onChange={setQty} min={1} max={product.stock} />
                <AddToCartButton
                  label={inCart > 0 ? `En el carrito (${inCart})` : "Agregar al carrito"}
                  onAdd={() => {
                    add(product.id, qty);
                    toast({ title: "Agregado al carrito", description: `${qty} × ${product.name}`, variant: "success" });
                  }}
                />
              </>
            )}
            <ShareButton variant="icon" title={product.name} text={`Mirá ${product.name} en la tienda demo`} />
          </div>

          <Tabs
            items={TABS}
            value={tab}
            onChange={setTab}
            variant="underline"
            className="mt-8"
            panels={{
              desc: <p className="text-sm text-muted leading-relaxed">{product.description}</p>,
              specs: (
                <ul className="text-sm text-foreground space-y-1.5">
                  {product.specs.map((s) => (
                    <li key={s.label} className="flex justify-between border-b border-border/60 pb-1.5">
                      <span className="text-muted">{s.label}</span>
                      <span className="font-medium">{s.value}</span>
                    </li>
                  ))}
                </ul>
              ),
              envio: (
                <p className="text-sm text-muted leading-relaxed">
                  Envío estimado de 3 a 5 días hábiles. Devoluciones gratuitas dentro de los 30 días.
                </p>
              ),
            }}
          />
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-foreground mb-4">También te puede interesar</h2>
          <CardGrid
            items={related}
            defaultColumns={Math.min(3, related.length)}
            controls={false}
            renderItem={(p) => <ProductCard key={p.id} product={p} />}
          />
        </div>
      )}
    </div>
  );
}
