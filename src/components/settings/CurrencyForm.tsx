"use client";

import { useActionState } from "react";
import { updateCurrencyAction, SettingsFormState } from "@/actions/settings";
import { CURRENCIES, CURRENCY_LABELS } from "@/lib/constants";
import { SubmitButton } from "@/components/ui/SubmitButton";

const initialState: SettingsFormState = { status: "idle" };

export function CurrencyForm({ currentCurrency }: { currentCurrency: string }) {
  const [state, formAction] = useActionState(updateCurrencyAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-xl border border-teal/10 bg-white p-5">
      <h2 className="text-lg font-bold text-teal-dark">العملة</h2>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="currency" className="text-sm font-medium text-teal-dark">
          اختر عملتك
        </label>
        <select
          id="currency"
          name="currency"
          defaultValue={currentCurrency}
          className="max-w-xs rounded-lg border border-teal/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal focus:ring-2 focus:ring-teal/20"
        >
          {CURRENCIES.map((currency) => (
            <option key={currency} value={currency}>
              {CURRENCY_LABELS[currency]}
            </option>
          ))}
        </select>
      </div>

      {state.status === "error" && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}
      {state.status === "success" && (
        <p className="text-sm text-teal-dark" role="status">
          تم حفظ العملة بنجاح
        </p>
      )}

      <div>
        <SubmitButton pendingText="جارٍ الحفظ...">حفظ العملة</SubmitButton>
      </div>
    </form>
  );
}
