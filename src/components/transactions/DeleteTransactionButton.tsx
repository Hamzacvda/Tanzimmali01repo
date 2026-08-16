"use client";

import { useTransition } from "react";
import { deleteTransactionAction } from "@/actions/transactions";

export function DeleteTransactionButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm("هل تريد حذف هذه المعاملة؟")) {
          startTransition(() => {
            deleteTransactionAction(id);
          });
        }
      }}
      className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
    >
      حذف
    </button>
  );
}
