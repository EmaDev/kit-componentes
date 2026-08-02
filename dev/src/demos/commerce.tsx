import { useState } from "react";
import { CartButton, CartPanel, useCart } from "../../../components/Cart";
import { PromoPopup } from "../../../components/PromoPopup";
import { CouponCode } from "../../../components/CouponCode";
import { CountdownBanner } from "../../../components/CountdownBanner";
import { BottomSheet } from "../../../components/BottomSheet";
import { useToast } from "../../../components/Toast";
import { Section, Card } from "../chrome/Section";

export function CartSection() {
  const cart = useCart([
    { id: "p1", title: "Zapatillas Urbanas", sub: "Talle 42 · Gris", price: 45000, qty: 1, image: undefined },
    { id: "p2", title: "Medias pack x3", sub: "Negro", price: 8000, qty: 2 },
  ]);
  const [open, setOpen] = useState(false);

  return (
    <Section id="cart" title="Cart" description="CartButton con badge animado + CartPanel con líneas animadas y vaciado en cascada + useCart() para el estado.">
      <Card>
        <div className="flex items-center gap-4 flex-wrap">
          <CartButton count={cart.count} onClick={() => setOpen(true)} variant="ghost" />
          <CartButton count={cart.count} bump="count" variant="outline" />
          <button
            type="button"
            onClick={() => cart.add({ id: "p3", title: "Gorra", price: 12000 })}
            className="h-9 px-3.5 rounded-xl text-xs font-semibold bg-primary text-white shadow-sm shadow-primary/25 hover:bg-primary-hover active:scale-95 transition-all"
          >
            Agregar producto
          </button>
        </div>

        <BottomSheet open={open} onClose={() => setOpen(false)} title="Tu carrito" size="lg">
          <CartPanel
            lines={cart.lines}
            onQtyChange={cart.setQty}
            onRemove={cart.remove}
            onClear={cart.clear}
            shipping={0}
            footer={
              <button
                type="button"
                className="mt-2 h-11 w-full rounded-xl bg-primary text-white text-sm font-semibold shadow-md shadow-primary/25 hover:bg-primary-hover active:scale-95 transition-all"
              >
                Finalizar compra
              </button>
            }
          />
        </BottomSheet>
      </Card>
    </Section>
  );
}

export function PromoPopupSection() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  return (
    <Section id="promopopup" title="PromoPopup" description="Interstitial de ofertas: imagen, número grande destacado y captura de email opcional antes de revelar el cupón.">
      <Card>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="h-10 px-4 rounded-xl text-sm font-semibold bg-primary text-white shadow-md shadow-primary/25 hover:bg-primary-hover active:scale-95 transition-all"
        >
          Mostrar popup de promoción
        </button>

        <PromoPopup
          open={open}
          onClose={() => setOpen(false)}
          eyebrow="Sólo por hoy"
          highlight="30% OFF"
          title="Llevate el 30% en toda la colección"
          layout="center"
          emailCapture={{
            onSubmit: async (email) => {
              await new Promise((r) => setTimeout(r, 500));
              toast({ title: "Cupón enviado", description: email, variant: "success" });
            },
            note: "Sin spam.",
          }}
        />
      </Card>
    </Section>
  );
}

export function CouponCodeSection() {
  const { toast } = useToast();
  const inOneMinute = new Date(Date.now() + 60_000);

  return (
    <Section id="couponcode" title="CouponCode" description="Cupón copiable con timer de vencimiento y/o cupos consumidos. Pulsa en rojo en el último minuto.">
      <div className="grid sm:grid-cols-2 gap-4">
        <CouponCode
          code="HOTSALE30"
          label="30% OFF en toda la tienda"
          expiresAt={inOneMinute}
          onCopy={(code) => toast({ title: "Copiado", description: code, variant: "success" })}
        />
        <CouponCode code="ENVIOGRATIS" uses={{ used: 37, total: 50 }} tone="success" />
      </div>
    </Section>
  );
}

export function CountdownBannerSection() {
  const [variant, setVariant] = useState<"bar" | "boxes" | "flip">("boxes");
  const until = new Date(Date.now() + 2 * 3600_000);

  return (
    <Section id="countdownbanner" title="CountdownBanner" description="Cuenta regresiva de campaña, fijable arriba/abajo y descartable con snooze. Tres estilos: barra, cajas o flip.">
      <Card>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(["bar", "boxes", "flip"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVariant(v)}
              className={`h-8 px-3 rounded-lg text-xs font-semibold border transition-all active:scale-95 ${
                variant === v ? "bg-primary text-white border-primary" : "bg-surface text-foreground border-border hover:bg-surface-alt"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <CountdownBanner
          key={variant}
          until={until}
          eyebrow="Hot Sale"
          variant={variant}
          tone="danger"
          dismissible
          expiredMessage="La promoción terminó."
        />
      </Card>
    </Section>
  );
}

