"use client";

import { useEffect, useState } from "react";
import { AmountPad } from "../../../../../components/AmountPad";
import { BottomSheet } from "../../../../../components/BottomSheet";
import { Modal } from "../../../../../components/Modal";
import { Card } from "../../../../../components/Card";
import { Button } from "../../../../../components/Button";
import { ShareButton } from "../../../../../components/ShareButton";
import { SkeletonList, SkeletonText } from "../../../../../components/Skeleton";
import { PullToRefresh } from "../../../../../components/PullToRefresh";
import { SuccessPage } from "../../../../../components/SuccessPage";
import { useSnackbar } from "../../../../../components/Snackbar";
import { CONTACTS } from "./_data/contacts";
import { formatMoney } from "./_data/format";
import { useWalletStore } from "./_store/wallet";
import { EyeIcon, EyeOffIcon, SendIcon, TopUpIcon } from "./_components/icons";
import { TransactionRow } from "./_components/TransactionRow";

type AmountMode = "send" | "topup" | null;

export default function BilleteraHomePage() {
  const balance = useWalletStore((s) => s.balance);
  const transactions = useWalletStore((s) => s.transactions);
  const send = useWalletStore((s) => s.send);
  const topUp = useWalletStore((s) => s.topUp);
  const { snack, undo } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);
  const [amountMode, setAmountMode] = useState<AmountMode>(null);
  const [recipient, setRecipient] = useState<{ id: string; name: string } | null>(null);
  const [pendingSend, setPendingSend] = useState<{ name: string; amount: number } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [sentResult, setSentResult] = useState<{ name: string; amount: number } | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const pickContact = (id: string) => {
    const contact = CONTACTS.find((c) => c.id === id);
    if (!contact) return;
    setRecipient(contact);
    setContactsOpen(false);
    setAmountMode("send");
  };

  const confirmAmount = async (amount: number) => {
    if (amountMode === "send" && recipient) {
      setPendingSend({ name: recipient.name, amount });
      setAmountMode(null);
      return;
    }
    if (amountMode === "topup") {
      topUp(amount);
      setAmountMode(null);
      undo(`Cargaste ${formatMoney(amount)}`, () => {
        topUp(-amount);
        snack({ message: "Carga revertida", variant: "info" });
      });
    }
  };

  const confirmSend = async () => {
    if (!pendingSend) return;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 700));
    send(pendingSend.name, pendingSend.amount);
    setProcessing(false);
    setSentResult(pendingSend);
    setPendingSend(null);
    setRecipient(null);
  };

  const recent = transactions.slice(0, 5);

  if (sentResult) {
    return (
      <SuccessPage
        variant="card"
        title="¡Envío realizado!"
        headline={formatMoney(sentResult.amount)}
        description={`Le enviaste el dinero a ${sentResult.name}.`}
        primary={{ label: "Volver a mi billetera", onClick: () => setSentResult(null) }}
        confetti="center"
        tone="success"
        redirectIn={4}
        onRedirect={() => setSentResult(null)}
      />
    );
  }

  return (
    <PullToRefresh
      onRefresh={async () => {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 900));
        setLoading(false);
        snack({ message: "Billetera actualizada", variant: "success" });
      }}
    >
    <div className="flex flex-col gap-6">
      <Card variant="gradient" padding="lg">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Saldo disponible</p>
          <button
            type="button"
            onClick={() => setHidden((v) => !v)}
            aria-label={hidden ? "Mostrar saldo" : "Ocultar saldo"}
            className="text-muted hover:text-foreground transition-colors"
          >
            {hidden ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>

        {loading ? (
          <div className="mt-3 max-w-[180px]">
            <SkeletonText lines={1} />
          </div>
        ) : (
          <p className="mt-2 text-4xl font-bold tracking-tight text-foreground tabular-nums">
            {hidden ? "• • • • • •" : formatMoney(balance)}
          </p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button leftIcon={<SendIcon />} onClick={() => setContactsOpen(true)}>
            Enviar
          </Button>
          <Button variant="secondary" leftIcon={<TopUpIcon />} onClick={() => setAmountMode("topup")}>
            Cargar saldo
          </Button>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 pt-4 border-t border-border/60">
          <p className="text-xs text-muted">
            Tu alias: <span className="font-semibold text-foreground">billetera.demo</span>
          </p>
          <ShareButton
            variant="ghost"
            size="sm"
            label="Compartir alias"
            title="Mi alias de billetera"
            text="Mandame dinero a mi alias: billetera.demo"
          />
        </div>
      </Card>

      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Últimos movimientos</h2>
        <Card padding="md">
          {loading ? (
            <SkeletonList rows={5} avatar lines={2} />
          ) : recent.length === 0 ? (
            <p className="text-sm text-muted py-6 text-center">Todavía no tenés movimientos.</p>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {recent.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} />
              ))}
            </div>
          )}
        </Card>
      </div>

      <BottomSheet open={contactsOpen} onClose={() => setContactsOpen(false)} title="¿A quién le enviás?" size="md">
        <div className="flex flex-col divide-y divide-border">
          {CONTACTS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => pickContact(c.id)}
              className="flex items-center gap-3 py-3 text-left hover:bg-surface-alt/60 rounded-lg px-2 -mx-2 transition-colors"
            >
              <span className="w-10 h-10 rounded-full grid place-items-center bg-primary/10 text-primary font-semibold shrink-0">
                {c.name
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-foreground truncate">{c.name}</span>
                <span className="block text-xs text-muted truncate">@{c.alias}</span>
              </span>
            </button>
          ))}
        </div>
      </BottomSheet>

      <AmountPad
        open={amountMode !== null}
        onClose={() => setAmountMode(null)}
        onConfirm={confirmAmount}
        title={amountMode === "send" ? `¿Cuánto le enviás a ${recipient?.name ?? ""}?` : "¿Cuánto querés cargar?"}
        balance={amountMode === "send" ? balance : undefined}
        max={amountMode === "topup" ? 500000 : undefined}
        quickAmounts={amountMode === "send" ? [1000, 5000, 10000] : [5000, 10000, 20000]}
        cta={amountMode === "send" ? "Enviar" : "Cargar"}
      />

      <Modal
        open={!!pendingSend}
        onClose={() => !processing && setPendingSend(null)}
        title="Confirmar envío"
        description={
          pendingSend ? `Vas a enviar ${formatMoney(pendingSend.amount)} a ${pendingSend.name}.` : undefined
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setPendingSend(null)} disabled={processing}>
              Cancelar
            </Button>
            <Button onClick={confirmSend} loading={processing}>
              Confirmar
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted">Esto es una demo: no se transfiere dinero real.</p>
      </Modal>
    </div>
    </PullToRefresh>
  );
}
