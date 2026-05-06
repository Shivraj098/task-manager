"use client";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
};

export function ConfirmModal({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  loading,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/40
        px-4
        backdrop-blur-sm
      "
    >
      <div
        className="
          w-full
          max-w-md
          rounded-3xl
          border
          border-white/20
          bg-white/95
          p-7
          shadow-2xl
          animate-in
          zoom-in-95
          duration-200
        "
      >
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight">
            {title}
          </h2>

          <p className="text-sm leading-relaxed text-gray-500">
            {description}
          </p>
        </div>

        <div className="mt-7 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="
              rounded-2xl
              border
              border-gray-200
              px-4
              py-2
              text-sm
              font-medium
              text-gray-700
              hover:bg-gray-50
            "
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="
              rounded-2xl
              bg-red-600
              px-4
              py-2
              text-sm
              font-semibold
              text-white
              hover:bg-red-700
              disabled:opacity-60
            "
          >
            {loading
              ? "Processing..."
              : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}