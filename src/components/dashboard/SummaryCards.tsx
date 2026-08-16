function formatMoney(amount: number, currency: string) {
  return `${amount.toLocaleString("ar", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
}

export function SummaryCards({
  income,
  expense,
  currency,
}: {
  income: number;
  expense: number;
  currency: string;
}) {
  const net = income - expense;
  const savingsRate = income > 0 ? (net / income) * 100 : 0;

  const cards = [
    { label: "دخل الشهر", value: formatMoney(income, currency), accent: "text-teal-dark" },
    { label: "مصروفات الشهر", value: formatMoney(expense, currency), accent: "text-red-600" },
    {
      label: "صافي الادخار",
      value: formatMoney(net, currency),
      accent: net >= 0 ? "text-teal-dark" : "text-red-600",
    },
    {
      label: "نسبة الادخار",
      value: `${savingsRate.toLocaleString("ar", { maximumFractionDigits: 1 })}%`,
      accent: savingsRate >= 0 ? "text-gold" : "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-teal/10 bg-white p-5"
        >
          <p className="text-sm text-neutral-500">{card.label}</p>
          <p className={`mt-2 text-xl font-bold ${card.accent}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}
