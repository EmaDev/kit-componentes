import type { Transaction } from "../_store/wallet";
import { formatDate, formatMoney } from "../_data/format";
import { ReceiveIcon, SendIcon, TopUpIcon } from "./icons";

export function TransactionRow({ tx }: { tx: Transaction }) {
  const outgoing = tx.type === "send";
  const icon = tx.type === "send" ? <SendIcon /> : tx.type === "topup" ? <TopUpIcon /> : <ReceiveIcon />;
  const label =
    tx.type === "send" ? `Enviado a ${tx.name}` : tx.type === "topup" ? tx.name : `Recibido de ${tx.name}`;

  return (
    <div className="flex items-center gap-3 py-3">
      <span className="w-10 h-10 rounded-full grid place-items-center bg-surface-alt text-foreground shrink-0">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{label}</p>
        <p className="text-xs text-muted">{formatDate(tx.date)}</p>
      </div>
      <span className={`text-sm font-bold tabular-nums ${outgoing ? "text-danger" : "text-success"}`}>
        {outgoing ? "-" : "+"}
        {formatMoney(Math.abs(tx.amount))}
      </span>
    </div>
  );
}
