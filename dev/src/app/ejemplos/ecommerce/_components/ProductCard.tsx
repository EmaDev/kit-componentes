"use client";

import Link from "next/link";
import { Card, CardMedia } from "../../../../../../components/Card";
import { AddToCartButton } from "../../../../../../components/AddToCartButton";
import { useToast } from "../../../../../../components/Toast";
import { formatPrice, type Product } from "../_data/products";
import { useCartStore } from "../_store/cart";
import { Stars } from "./Stars";

export function ProductCard({ product }: { product: Product }) {
  const add = useCartStore((s) => s.add);
  const { toast } = useToast();
  const href = `/ejemplos/ecommerce/producto/${product.id}`;
  const outOfStock = product.stock === 0;

  return (
    <Card variant="elevated" padding="none" className="flex flex-col h-full">
      <Link href={href} className="block">
        <CardMedia
          label={product.name}
          aspect={1}
          overlay={
            outOfStock ? (
              <span className="absolute top-3 left-3 rounded-full bg-foreground/85 text-surface px-2.5 py-1 text-[11px] font-semibold">
                Agotado
              </span>
            ) : undefined
          }
        />
      </Link>
      <div className="p-4 flex flex-col flex-1 gap-2">
        <Link href={href} className="min-w-0 block">
          <p className="text-sm font-semibold text-foreground truncate">{product.name}</p>
          <p className="text-xs text-muted mt-0.5">{product.category}</p>
        </Link>
        <Stars value={product.rating} />
        <div className="mt-auto pt-2 flex items-center justify-between gap-2">
          <span className="text-base font-bold text-foreground">{formatPrice(product.price)}</span>
          {outOfStock ? (
            <span className="text-xs font-semibold text-muted">Sin stock</span>
          ) : (
            <AddToCartButton
              size="sm"
              onAdd={() => {
                add(product.id, 1);
                toast({ title: "Agregado al carrito", description: product.name, variant: "success" });
              }}
            />
          )}
        </div>
      </div>
    </Card>
  );
}
