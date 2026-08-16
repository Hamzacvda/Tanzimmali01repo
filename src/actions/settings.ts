"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { changePasswordSchema, currencySchema } from "@/lib/validation";

export type SettingsFormState =
  | { status: "idle" }
  | { status: "error"; error: string }
  | { status: "success" };

const BCRYPT_ROUNDS = 12;

export async function updateCurrencyAction(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const session = await getSession();
  if (!session) return { status: "error", error: "غير مصرح" };

  const parsed = currencySchema.safeParse({ currency: formData.get("currency") });
  if (!parsed.success) {
    return { status: "error", error: "عملة غير صالحة" };
  }

  await prisma.user.update({
    where: { id: session.userId },
    data: { currency: parsed.data.currency },
  });

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  return { status: "success" };
}

export async function changePasswordAction(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const session = await getSession();
  if (!session) return { status: "error", error: "غير مصرح" };

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
  });
  if (!parsed.success) {
    return {
      status: "error",
      error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة",
    };
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) return { status: "error", error: "المستخدم غير موجود" };

  const matches = await bcrypt.compare(
    parsed.data.currentPassword,
    user.passwordHash,
  );
  if (!matches) {
    return { status: "error", error: "كلمة المرور الحالية غير صحيحة" };
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, BCRYPT_ROUNDS);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  return { status: "success" };
}
