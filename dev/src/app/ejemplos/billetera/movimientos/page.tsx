"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "../../../../../../components/Card";
import { Tabs, type TabItem } from "../../../../../../components/Tabs";
import { SkeletonList } from "../../../../../../components/Skeleton";
import { useWalletStore } from "../_store/wallet";
import { TransactionRow } from "../_components/TransactionRow";

const TABS: TabItem[] = [
  { id: "all", label: "Todos" },
  { id: "send", label: "Enviados" },
  { id: "receive", label: "Recibidos" },
  { id: "topup", label: "Cargas" },
];

export default function MovimientosPage() {
  const transactions = useWalletStore((s) => s.transactions);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(
    () => (tab === "all" ? transactions : transactions.filter((tx) => tx.type === tab)),
    [transactions, tab]
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Movimientos</h1>

      <Tabs items={TABS} value={tab} onChange={setTab} variant="segmented" className="mb-6" />

      <Card padding="md">
        {loading ? (
          <SkeletonList rows={6} avatar lines={2} />
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted py-8 text-center">No hay movimientos en esta categoría.</p>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {filtered.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
