type LoadingButtonProps = {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  variant?: "primary" | "danger";
  className?: string;
};

export default function LoadingButton({
  children,
  loading = false,
  disabled = false,
  onClick,
  variant = "primary",
  className = "",
}: LoadingButtonProps) {
  const variantStyles =
    variant === "primary"
      ? `
        bg-black
        text-white
        hover:opacity-90
      `
      : `
        bg-red-600
        text-white
        hover:bg-red-700
      `;

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-2xl
        px-4
        py-2.5
        text-sm
        font-semibold
        shadow-sm
        transition-all
        duration-200
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${variantStyles}
        ${className}
      `}
    >
      {loading && (
        <div
          className="
            h-4
            w-4
            animate-spin
            rounded-full
            border-2
            border-white/30
            border-t-white
          "
        />
      )}

      {children}
    </button>
  );
}