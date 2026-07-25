"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "../../../../../../components/Card";
import { Tabs, type TabItem } from "../../../../../../components/Tabs";
import { SkeletonList } from "../../../../../../components/Skeleton";
import { DatePicker, type DateRange } from "../../../../../../components/DatePicker";
import { Pagination } from "../../../../../../components/Pagination";
import { useWalletStore } from "../_store/wallet";
import { TransactionRow } from "../_components/TransactionRow";

const TABS: TabItem[] = [
  { id: "all", label: "Todos" },
  { id: "send", label: "Enviados" },
  { id: "receive", label: "Recibidos" },
  { id: "topup", label: "Cargas" },
];

const PAGE_SIZE = 3;

export default function MovimientosPage() {
  const transactions = useWalletStore((s) => s.transactions);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [range, setRange] = useState<DateRange>({ from: null, to: null });
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    let list = tab === "all" ? transactions : transactions.filter((tx) => tx.type === tab);
    if (range.from) list = list.filter((tx) => new Date(tx.date) >= range.from!);
    if (range.to) {
      const end = new Date(range.to);
      end.setHours(23, 59, 59, 999);
      list = list.filter((tx) => new Date(tx.date) <= end);
    }
    return list;
  }, [transactions, tab, range]);

  useEffect(() => {
    setPage(1);
  }, [tab, range]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Movimientos</h1>

      <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-6">
        <Tabs items={TABS} value={tab} onChange={setTab} variant="segmented" />
        <DatePicker
          mode="range"
          value={range}
          onChange={(v) => setRange(v as DateRange)}
          placeholder="Filtrar por fecha"
          className="max-w-xs"
        />
      </div>

      <Card padding="md">
        {loading ? (
          <SkeletonList rows={6} avatar lines={2} />
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted py-8 text-center">No hay movimientos en esta categoría.</p>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {paged.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} />
            ))}
          </div>
        )}
      </Card>

      {!loading && filtered.length > 0 && (
        <Pagination
          className="mt-6"
          page={page}
          pageCount={pageCount}
          total={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          edges={false}
        />
      )}
    </div>
  );
}
