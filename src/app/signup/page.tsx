"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signupAction } from "@/actions/auth";
import { Input } from "@/components/ui/Input";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default function SignupPage() {
  const [state, formAction] = useActionState(signupAction, null);

  return (
    <main className="flex min-h-screen items-center justify-center bg-mint px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold text-teal-dark">إنشاء حساب</h1>
        <p className="mb-6 text-sm text-neutral-500">
          ابدأ بتنظيم ميزانيتك الشخصية في دقائق
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
            autoComplete="new-password"
            minLength={8}
            required
          />
          <p className="-mt-2 text-xs text-neutral-400">8 أحرف على الأقل</p>

          {state?.error && (
            <p className="text-sm text-red-600" role="alert">
              {state.error}
            </p>
          )}

          <SubmitButton pendingText="جارٍ الإنشاء...">إنشاء الحساب</SubmitButton>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          لديك حساب بالفعل؟{" "}
          <Link href="/login" className="font-semibold text-teal">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </main>
  );
}
