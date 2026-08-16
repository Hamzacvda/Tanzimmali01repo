"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

const CATEGORICAL = [
  "#2a78d6", // blue
  "#eb6834", // orange
  "#1baf7a", // aqua
  "#eda100", // yellow
  "#e87ba4", // magenta
  "#008300", // green
  "#4a3aa7", // violet
];
const OTHER_COLOR = "#898781"; // muted, reserved for "أخرى"

export type CategoryTotal = { category: string; amount: number };

const MAX_SLICES = 7;

function buildChartData(totals: CategoryTotal[]) {
  const sorted = [...totals].sort((a, b) => b.amount - a.amount);
  const top = sorted.slice(0, MAX_SLICES);
  const rest = sorted.slice(MAX_SLICES);
  const restTotal = rest.reduce((sum, c) => sum + c.amount, 0);

  const data = top.map((c, i) => ({
    category: c.category,
    amount: c.amount,
    color: CATEGORICAL[i],
  }));

  if (restTotal > 0) {
    data.push({ category: "أخرى", amount: restTotal, color: OTHER_COLOR });
  }

  return data;
}

function formatAmount(amount: number, currency: string) {
  return `${amount.toLocaleString("ar", { maximumFractionDigits: 0 })} ${currency}`;
}

export function ExpenseChart({
  totals,
  currency,
}: {
  totals: CategoryTotal[];
  currency: string;
}) {
  const data = buildChartData(totals);

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-teal/10 bg-white text-sm text-neutral-500">
        لا توجد مصروفات هذا الشهر بعد
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-teal/10 bg-white p-5">
      <h2 className="mb-4 text-lg font-bold text-teal-dark">
        توزيع المصروفات حسب الفئة
      </h2>
      <ResponsiveContainer width="100%" height={Math.max(220, data.length * 42)}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 48, bottom: 4, left: 4 }}
          barCategoryGap={10}
        >
          <CartesianGrid horizontal={false} stroke="#e1e0d9" />
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="category"
            width={120}
            tick={{ fill: "#52514e", fontSize: 12 }}
            axisLine={{ stroke: "#c3c2b7" }}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => formatAmount(Number(value), currency)}
            contentStyle={{
              direction: "rtl",
              borderRadius: 8,
              border: "1px solid #e1e0d9",
              fontSize: 13,
            }}
          />
          <Bar dataKey="amount" radius={[4, 4, 4, 4]} maxBarSize={24}>
            {data.map((entry) => (
              <Cell key={entry.category} fill={entry.color} />
            ))}
            <LabelList
              dataKey="amount"
              position="right"
              formatter={(value) => formatAmount(Number(value), currency)}
              style={{ fill: "#0b0b0b", fontSize: 12, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
