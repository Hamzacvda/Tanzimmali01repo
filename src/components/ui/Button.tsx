import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
};

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-teal text-white hover:bg-teal-dark disabled:opacity-60",
  secondary: "bg-gold text-teal-dark hover:brightness-95 disabled:opacity-60",
  danger: "bg-red-600 text-white hover:bg-red-700 disabled:opacity-60",
  ghost: "bg-transparent text-teal-dark hover:bg-mint",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
    />
  );
}
