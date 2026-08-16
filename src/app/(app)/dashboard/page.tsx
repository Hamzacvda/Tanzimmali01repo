import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { ExpenseChart } from "@/components/dashboard/ExpenseChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";

export default async function DashboardPage() {
  const session = await getSession();
  const userId = session!.userId;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [user, monthTransactions, recentTransactions] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { currency: true } }),
    prisma.transaction.findMany({
      where: { userId, date: { gte: monthStart, lt: monthEnd } },
    }),
    prisma.transaction.findMany({
      where: { userId },
      orderBy: [{ date: "desc" }, { id: "desc" }],
      take: 5,
    }),
  ]);

  const currency = user?.currency ?? "ر.س";

  let income = 0;
  let expense = 0;
  const expenseByCategory = new Map<string, number>();

  for (const tx of monthTransactions) {
    const amount = Number(tx.amount);
    if (tx.type === "دخل") {
      income += amount;
    } else {
      expense += amount;
      expenseByCategory.set(
        tx.category,
        (expenseByCategory.get(tx.category) ?? 0) + amount,
      );
    }
  }

  const categoryTotals = Array.from(expenseByCategory, ([category, amount]) => ({
    category,
    amount,
  }));

  const recentRows = recentTransactions.map((tx) => ({
    id: tx.id,
    date: tx.date.toISOString(),
    type: tx.type,
    category: tx.category,
    amount: tx.amount.toString(),
  }));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-teal-dark">لوحة التحكم</h1>

      <SummaryCards income={income} expense={expense} currency={currency} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ExpenseChart totals={categoryTotals} currency={currency} />
        <RecentTransactions transactions={recentRows} currency={currency} />
      </div>
    </div>
  );
}
