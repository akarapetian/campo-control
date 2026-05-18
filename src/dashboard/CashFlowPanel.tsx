import { summarizeCashFlow, type CashFlowItem } from "../domain/cashFlow";

type Language = "es" | "en";

type CashFlowPanelProps = {
  items: CashFlowItem[];
  language?: Language;
  today: string;
};

const labels = {
  es: {
    ariaLabel: "Flujo de caja",
    cashCollected: "Efectivo cobrado",
    cashPaid: "Efectivo pagado",
    dueToday: "Vencen hoy",
    overdueIncoming: "Ingresos vencidos",
    overdueOutgoing: "Egresos vencidos",
    upcomingIncoming: "Ingresos proximos",
    upcomingOutgoing: "Egresos proximos"
  },
  en: {
    ariaLabel: "Cash flow",
    cashCollected: "Cash collected",
    cashPaid: "Cash paid",
    dueToday: "Due today",
    overdueIncoming: "Overdue incoming",
    overdueOutgoing: "Overdue outgoing",
    upcomingIncoming: "Upcoming incoming",
    upcomingOutgoing: "Upcoming outgoing"
  }
};

const arsFormatter = new Intl.NumberFormat("es-AR", {
  currency: "ARS",
  maximumFractionDigits: 0,
  style: "currency"
});

function formatARS(amount: number) {
  return arsFormatter.format(amount).replace("$", "ARS ");
}

function total(items: CashFlowItem[]) {
  return items.reduce((sum, item) => sum + item.amount, 0);
}

export function CashFlowPanel({ items, language = "es", today }: CashFlowPanelProps) {
  const text = labels[language];
  const summary = summarizeCashFlow(items, today);

  const groups = [
    { label: text.upcomingIncoming, value: total(summary.upcomingIncoming) },
    { label: text.upcomingOutgoing, value: total(summary.upcomingOutgoing) },
    { label: text.dueToday, value: total(summary.dueToday) },
    { label: text.overdueIncoming, value: total(summary.overdueIncoming) },
    { label: text.overdueOutgoing, value: total(summary.overdueOutgoing) }
  ];

  return (
    <section className="cash-flow-panel" aria-label={text.ariaLabel}>
      <div className="cash-flow-totals">
        <article>
          <span>{text.cashCollected}</span>
          <strong>{formatARS(summary.cashCollected)}</strong>
        </article>
        <article>
          <span>{text.cashPaid}</span>
          <strong>{formatARS(summary.cashPaid)}</strong>
        </article>
      </div>

      <div className="cash-flow-groups">
        {groups.map((group) => (
          <article key={group.label}>
            <span>{group.label}</span>
            <strong>{formatARS(group.value)}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
