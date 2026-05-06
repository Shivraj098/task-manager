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
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">
          {title}
        </h2>

        <p className="text-sm leading-6 text-gray-500">
          {description}
        </p>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium transition hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          onClick={onConfirm}
          disabled={loading}
          className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Confirm"}
        </button>
      </div>
    </div>
  </div>
);;
}