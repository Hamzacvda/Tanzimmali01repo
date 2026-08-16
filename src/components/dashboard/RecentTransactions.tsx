import Link from "next/link";

export type RecentTx = {
  id: number;
  date: string;
  type: "دخل" | "مصروف";
  category: string;
  amount: string;
};

function formatAmount(amount: string, currency: string) {
  return `${Number(amount).toLocaleString("ar", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
}

function formatDate(date: string) {
  const d = new Date(date);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${d.getUTCFullYear()}`;
}

export function RecentTransactions({
  transactions,
  currency,
}: {
  transactions: RecentTx[];
  currency: string;
}) {
  return (
    <div className="rounded-xl border border-teal/10 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-teal-dark">آخر المعاملات</h2>
        <Link href="/transactions" className="text-sm font-medium text-teal hover:underline">
          عرض الكل
        </Link>
      </div>

      {transactions.length === 0 ? (
        <p className="text-sm text-neutral-500">لا توجد معاملات بعد</p>
      ) : (
        <ul className="flex flex-col divide-y divide-teal/5">
          {transactions.map((tx) => (
            <li key={tx.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">{tx.category}</p>
                <p className="text-xs text-neutral-500">{formatDate(tx.date)}</p>
              </div>
              <span
                className={
                  tx.type === "دخل"
                    ? "font-semibold text-teal-dark"
                    : "font-semibold text-red-600"
                }
              >
                {tx.type === "دخل" ? "+" : "-"}
                {formatAmount(tx.amount, currency)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
