"use client";

import { useState, useCallback } from "react";

type Toast = {
  id: string;
  message: string;
  type: "success" | "error";
};

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: "success" | "error") => {
    const id = crypto.randomUUID();

    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return { toasts, showToast };
}

export function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed top-5 right-5 z-50 space-y-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            min-w-[280px]
            rounded-2xl
            border
            px-4
            py-3
            shadow-xl
            backdrop-blur
            transition-all
            animate-in
            slide-in-from-right
            duration-300
            ${
              toast.type === "success"
                ? "border-green-200 bg-white text-green-700"
                : "border-red-200 bg-white text-red-700"
            }
          `}
        >
          <p className="text-sm font-medium">
            {toast.message}
          </p>
        </div>
      ))}
    </div>
  );
}