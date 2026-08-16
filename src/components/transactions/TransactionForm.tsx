"use client";

import { useActionState, useEffect, useState } from "react";
import {
  TransactionFormState,
  createTransactionAction,
  updateTransactionAction,
} from "@/actions/transactions";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/constants";
import { Input } from "@/components/ui/Input";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Button } from "@/components/ui/Button";

export type TransactionFormValues = {
  id?: number;
  date: string;
  type: "دخل" | "مصروف";
  category: string;
  description: string;
  amount: string;
};

const emptyValues: TransactionFormValues = {
  date: new Date().toISOString().slice(0, 10),
  type: "مصروف",
  category: "",
  description: "",
  amount: "",
};

const initialState: TransactionFormState = { status: "idle" };

export function TransactionForm({
  initialValues,
  onDone,
}: {
  initialValues?: TransactionFormValues;
  onDone?: () => void;
}) {
  const isEditing = Boolean(initialValues?.id);
  const values = initialValues ?? emptyValues;
  const [type, setType] = useState<"دخل" | "مصروف">(values.type);

  const action = isEditing
    ? updateTransactionAction.bind(null, initialValues!.id!)
    : createTransactionAction;

  const [state, formAction] = useActionState(action, initialState);

  useEffect(() => {
    if (state.status === "success") {
      onDone?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const categories = type === "دخل" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-xl border border-teal/10 bg-white p-5"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="التاريخ"
          type="date"
          name="date"
          defaultValue={values.date}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-teal-dark">النوع</label>
          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value as "دخل" | "مصروف")}
            className="rounded-lg border border-teal/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal focus:ring-2 focus:ring-teal/20"
          >
            <option value="مصروف">مصروف</option>
            <option value="دخل">دخل</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-teal-dark">الفئة</label>
          <select
            name="category"
            defaultValue={values.category}
            required
            className="rounded-lg border border-teal/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal focus:ring-2 focus:ring-teal/20"
          >
            <option value="" disabled>
              اختر الفئة
            </option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="المبلغ"
          type="number"
          name="amount"
          step="0.01"
          min="0.01"
          defaultValue={values.amount}
          required
        />

        <div className="sm:col-span-2">
          <Input
            label="الوصف (اختياري)"
            type="text"
            name="description"
            defaultValue={values.description}
            maxLength={255}
          />
        </div>
      </div>

      {state.status === "error" && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <div className="flex gap-3">
        <SubmitButton pendingText="جارٍ الحفظ...">
          {isEditing ? "حفظ التعديلات" : "إضافة المعاملة"}
        </SubmitButton>
        {onDone && (
          <Button type="button" variant="ghost" onClick={onDone}>
            إلغاء
          </Button>
        )}
      </div>
    </form>
  );
}
