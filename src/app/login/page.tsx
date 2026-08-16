"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/actions/auth";
import { Input } from "@/components/ui/Input";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, null);

  return (
    <main className="flex min-h-screen items-center justify-center bg-mint px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold text-teal-dark">تسجيل الدخول</h1>
        <p className="mb-6 text-sm text-neutral-500">
          أدخل بياناتك للوصول إلى حسابك
        </p>

        <form action={formAction} className="flex flex-col gap-4">
          <Input
            label="البريد الإلكتروني"
            type="email"
            name="email"
            autoComplete="email"
            required
          />
          <Input
            label="كلمة المرور"
            type="password"
            name="password"
            autoComplete="current-password"
            required
          />

          {state?.error && (
            <p className="text-sm text-red-600" role="alert">
              {state.error}
            </p>
          )}

          <SubmitButton pendingText="جارٍ الدخول...">دخول</SubmitButton>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          ليس لديك حساب؟{" "}
          <Link href="/signup" className="font-semibold text-teal">
            إنشاء حساب جديد
          </Link>
        </p>
      </div>
    </main>
  );
}
