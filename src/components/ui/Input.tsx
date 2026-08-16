import { InputHTMLAttributes, forwardRef } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-medium text-teal-dark">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          {...props}
          className="rounded-lg border border-teal/20 bg-white px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20"
        />
      </div>
    );
  },
);

Input.displayName = "Input";
