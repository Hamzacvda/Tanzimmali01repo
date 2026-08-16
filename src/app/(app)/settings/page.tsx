import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CurrencyForm } from "@/components/settings/CurrencyForm";
import { PasswordForm } from "@/components/settings/PasswordForm";

export default async function SettingsPage() {
  const session = await getSession();
  const user = await prisma.user.findUnique({
    where: { id: session!.userId },
    select: { currency: true },
  });

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h1 className="text-2xl font-bold text-teal-dark">الإعدادات</h1>
      <CurrencyForm currentCurrency={user?.currency ?? "ر.س"} />
      <PasswordForm />
    </div>
  );
}
