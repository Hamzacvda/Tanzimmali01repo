import { z } from "zod";
import { CURRENCIES, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "./constants";

export const signupSchema = z.object({
  email: z.string().trim().toLowerCase().email("بريد إلكتروني غير صالح"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("بريد إلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

const allCategories = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES] as [
  string,
  ...string[],
];

export const transactionSchema = z
  .object({
    date: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
      message: "تاريخ غير صالح",
    }),
    type: z.enum(["دخل", "مصروف"]),
    category: z.enum(allCategories),
    description: z.string().trim().max(255).optional().or(z.literal("")),
    amount: z.coerce.number().positive("المبلغ يجب أن يكون أكبر من صفر"),
  })
  .refine(
    (data) =>
      data.type === "دخل"
        ? (INCOME_CATEGORIES as readonly string[]).includes(data.category)
        : (EXPENSE_CATEGORIES as readonly string[]).includes(data.category),
    { message: "الفئة لا تطابق نوع المعاملة", path: ["category"] },
  );

export const currencySchema = z.object({
  currency: z.enum(CURRENCIES),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "كلمة المرور الحالية مطلوبة"),
    newPassword: z.string().min(8, "كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل"),
  });
