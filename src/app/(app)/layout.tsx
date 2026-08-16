import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/Button";

const NAV_LINKS = [
  { href: "/dashboard", label: "لوحة التحكم" },
  { href: "/transactions", label: "المعاملات" },
  { href: "/settings", label: "الإعدادات" },
];

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { email: true },
  });
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-mint">
      <header className="border-b border-teal/10 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-8">
            <span className="text-lg font-bold text-teal-dark">تنظيم مالي</span>
            <nav className="flex gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-teal-dark transition hover:bg-mint"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-neutral-500 sm:inline">
              {user.email}
            </span>
            <form action={logoutAction}>
              <Button type="submit" variant="ghost">
                تسجيل الخروج
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
