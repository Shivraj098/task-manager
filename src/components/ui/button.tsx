import type { ButtonHTMLAttributes } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "success";

type Props =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    loading?: boolean;
  };

const variantStyles: Record<
  ButtonVariant,
  string
> = {
  primary:
    "bg-black text-white hover:opacity-90",

  secondary:
    "bg-gray-100 text-gray-900 hover:bg-gray-200",

  danger:
    "bg-red-600 text-white hover:bg-red-700",

  success:
    "bg-green-600 text-white hover:bg-green-700",
};

export function Button({
  variant = "primary",
  loading = false,
  className = "",
  children,
  disabled,
  ...props
}: Props) {
  return (
    <button
      className={`
        inline-flex
        items-center
        justify-center
        rounded-2xl
        px-5
        py-2.5
        text-sm
        font-medium
        transition-all
        duration-200
        active:scale-[0.98]
        disabled:cursor-not-allowed
        disabled:opacity-50
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        ${variantStyles[variant]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Processing..." : children}
    </button>
  );
}