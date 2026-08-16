"use client";

import { useActionState, useEffect, useRef } from "react";
import { changePasswordAction, SettingsFormState } from "@/actions/settings";
import { Input } from "@/components/ui/Input";
import { SubmitButton } from "@/components/ui/SubmitButton";

const initialState: SettingsFormState = { status: "idle" };

export function PasswordForm() {
  const [state, formAction] = useActionState(changePasswordAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-4 rounded-xl border border-teal/10 bg-white p-5"
    >
      <h2 className="text-lg font-bold text-teal-dark">تغيير كلمة المرور</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:max-w-md">
        <Input
          label="كلمة المرور الحالية"
          type="password"
          name="currentPassword"
          autoComplete="current-password"
          required
        />
        <Input
          label="كلمة المرور الجديدة"
          type="password"
          name="newPassword"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>

      {state.status === "error" && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}
      {state.status === "success" && (
        <p className="text-sm text-teal-dark" role="status">
          تم تغيير كلمة المرور بنجاح
        </p>
      )}

      <div>
        <SubmitButton pendingText="جارٍ التغيير...">تغيير كلمة المرور</SubmitButton>
      </div>
    </form>
  );
}
