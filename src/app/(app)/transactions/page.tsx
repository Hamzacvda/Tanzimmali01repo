import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { TransactionsClient } from "@/components/transactions/TransactionsClient";

export default async function TransactionsPage() {
  const session = await getSession();
  const userId = session!.userId;

  const [user, transactions] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { currency: true } }),
    prisma.transaction.findMany({
      where: { userId },
      orderBy: [{ date: "desc" }, { id: "desc" }],
    }),
  ]);

  const rows = transactions.map((tx) => ({
    id: tx.id,
    date: tx.date.toISOString(),
    type: tx.type,
    category: tx.category,
    description: tx.description,
    amount: tx.amount.toString(),
  }));

  return (
    <TransactionsClient transactions={rows} currency={user?.currency ?? "ر.س"} />
  );
}
