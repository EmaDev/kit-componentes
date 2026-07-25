"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardMedia } from "../../../../../../components/Card";
import { AddButton } from "../../../../../../components/AddButton";
import { Button } from "../../../../../../components/Button";
import { Modal } from "../../../../../../components/Modal";
import { useToast } from "../../../../../../components/Toast";
import { formatPrice, getProduct } from "../_data/products";
import { useCartStore } from "../_store/cart";

export default function CartPage() {
  const lines = useCartStore((s) => s.lines);
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);
  const { toast } = useToast();
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [placing, setPlacing] = useState(false);

  const items = useMemo(
    () =>
      lines
        .map((line) => ({ line, product: getProduct(line.productId) }))
        .filter((entry): entry is { line: typeof lines[number]; product: NonNullable<ReturnType<typeof getProduct>> } => Boolean(entry.product)),
    [lines]
  );

  const subtotal = items.reduce((acc, { line, product }) => acc + line.qty * product.price, 0);
  const shipping = subtotal > 0 && subtotal < 100 ? 12 : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <Card className="py-16 text-center">
        <p className="text-sm text-muted mb-4">Tu carrito está vacío.</p>
        <Link href="/ejemplos/ecommerce">
          <Button variant="secondary">Ver catálogo</Button>
        </Link>
      </Card>
    );
  }

  const confirm = async () => {
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 900));
    clear();
    setPlacing(false);
    setConfirmOpen(false);
    toast({ title: "Pedido confirmado", description: "Te enviamos un email con los detalles.", variant: "success" });
    router.push("/ejemplos/ecommerce");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Tu carrito</h1>

      <div className="grid md:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="flex flex-col gap-3">
          {items.map(({ line, product }) => (
            <Card key={line.productId} variant="outline" padding="none" className="flex">
              <div className="w-24 shrink-0">
                <CardMedia label={product.name} aspect={1} className="h-full" />
              </div>
              <div className="p-4 flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground truncate">{product.name}</p>
                  <p className="text-xs text-muted mt-0.5">{formatPrice(product.price)} c/u</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <AddButton value={line.qty} onChange={(v) => setQty(line.productId, v)} min={1} max={product.stock} size="sm" />
                  <button
                    type="button"
                    onClick={() => remove(line.productId)}
                    className="text-xs font-semibold text-muted hover:text-danger transition-colors"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card variant="elevated" className="md:sticky md:top-20">
          <p className="text-sm font-semibold text-foreground mb-4">Resumen</p>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Envío</span>
              <span>{shipping ? formatPrice(shipping) : "Gratis"}</span>
            </div>
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t border-border text-base font-bold text-foreground">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Button className="mt-5" fullWidth onClick={() => setConfirmOpen(true)}>
            Confirmar pedido
          </Button>
        </Card>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => !placing && setConfirmOpen(false)}
        title="Confirmar pedido"
        description={`Vas a pagar ${formatPrice(total)} por ${items.length} producto(s).`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)} disabled={placing}>
              Cancelar
            </Button>
            <Button onClick={confirm} loading={placing}>
              Confirmar
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted">Esto es una demo: no se procesa ningún pago real.</p>
      </Modal>
    </div>
  );
}
