"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { transactionSchema } from "@/lib/validation";

export type TransactionFormState =
  | { status: "idle" }
  | { status: "error"; error: string }
  | { status: "success" };

async function requireUserId(): Promise<number> {
  const session = await getSession();
  if (!session) throw new Error("غير مصرح");
  return session.userId;
}

function parseTransactionForm(formData: FormData) {
  return transactionSchema.safeParse({
    date: formData.get("date"),
    type: formData.get("type"),
    category: formData.get("category"),
    description: formData.get("description"),
    amount: formData.get("amount"),
  });
}

export async function createTransactionAction(
  _prevState: TransactionFormState,
  formData: FormData,
): Promise<TransactionFormState> {
  const userId = await requireUserId();
  const parsed = parseTransactionForm(formData);
  if (!parsed.success) {
    return {
      status: "error",
      error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة",
    };
  }

  const { date, type, category, description, amount } = parsed.data;

  await prisma.transaction.create({
    data: {
      userId,
      date: new Date(date),
      type,
      category,
      description: description || null,
      amount,
    },
  });

  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  return { status: "success" };
}

export async function updateTransactionAction(
  id: number,
  _prevState: TransactionFormState,
  formData: FormData,
): Promise<TransactionFormState> {
  const userId = await requireUserId();
  const parsed = parseTransactionForm(formData);
  if (!parsed.success) {
    return {
      status: "error",
      error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة",
    };
  }

  const { date, type, category, description, amount } = parsed.data;

  const result = await prisma.transaction.updateMany({
    where: { id, userId },
    data: {
      date: new Date(date),
      type,
      category,
      description: description || null,
      amount,
    },
  });

  if (result.count === 0) {
    return { status: "error", error: "المعاملة غير موجودة" };
  }

  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  return { status: "success" };
}

export async function deleteTransactionAction(id: number) {
  const userId = await requireUserId();
  await prisma.transaction.deleteMany({ where: { id, userId } });
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
}
