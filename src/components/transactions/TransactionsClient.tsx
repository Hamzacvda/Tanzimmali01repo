"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { DeleteTransactionButton } from "./DeleteTransactionButton";
import { TransactionForm, TransactionFormValues } from "./TransactionForm";

export type TransactionRow = {
  id: number;
  date: string;
  type: "دخل" | "مصروف";
  category: string;
  description: string | null;
  amount: string;
};

function formatAmount(amount: string, currency: string) {
  const num = Number(amount);
  return `${num.toLocaleString("ar", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
}

function formatDate(date: string) {
  const d = new Date(date);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${d.getUTCFullYear()}`;
}

export function TransactionsClient({
  transactions,
  currency,
}: {
  transactions: TransactionRow[];
  currency: string;
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-teal-dark">المعاملات</h1>
        {!showAddForm && (
          <Button onClick={() => setShowAddForm(true)}>
            + إضافة معاملة
          </Button>
        )}
      </div>

      {showAddForm && (
        <TransactionForm onDone={() => setShowAddForm(false)} />
      )}

      {transactions.length === 0 ? (
        <p className="rounded-xl border border-teal/10 bg-white p-8 text-center text-sm text-neutral-500">
          لا توجد معاملات بعد. ابدأ بإضافة أول معاملة لك.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-teal/10 bg-white">
          <table className="w-full text-right text-sm">
            <thead className="border-b border-teal/10 bg-mint/60 text-teal-dark">
              <tr>
                <th className="px-4 py-3 font-semibold">التاريخ</th>
                <th className="px-4 py-3 font-semibold">النوع</th>
                <th className="px-4 py-3 font-semibold">الفئة</th>
                <th className="px-4 py-3 font-semibold">الوصف</th>
                <th className="px-4 py-3 font-semibold">المبلغ</th>
                <th className="px-4 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) =>
                editingId === tx.id ? (
                  <tr key={tx.id}>
                    <td colSpan={6} className="p-3">
                      <TransactionForm
                        initialValues={
                          {
                            id: tx.id,
                            date: tx.date.slice(0, 10),
                            type: tx.type,
                            category: tx.category,
                            description: tx.description ?? "",
                            amount: tx.amount,
                          } satisfies TransactionFormValues
                        }
                        onDone={() => setEditingId(null)}
                      />
                    </td>
                  </tr>
                ) : (
                  <tr key={tx.id} className="border-b border-teal/5 last:border-0">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {formatDate(tx.date)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          tx.type === "دخل"
                            ? "rounded-full bg-teal/10 px-2.5 py-1 text-xs font-medium text-teal-dark"
                            : "rounded-full bg-gold/15 px-2.5 py-1 text-xs font-medium text-gold"
                        }
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">{tx.category}</td>
                    <td className="px-4 py-3 text-neutral-500">
                      {tx.description || "—"}
                    </td>
                    <td className="px-4 py-3 font-semibold whitespace-nowrap">
                      {formatAmount(tx.amount, currency)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setEditingId(tx.id)}
                          className="text-sm font-medium text-teal hover:underline"
                        >
                          تعديل
                        </button>
                        <DeleteTransactionButton id={tx.id} />
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
