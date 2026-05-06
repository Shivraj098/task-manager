"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type ToastType = "success" | "error";

type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastContextType = {
  showToast: (
    message: string,
    type?: ToastType,
  ) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (
      message: string,
      type: ToastType = "success",
    ) => {
      const id = crypto.randomUUID();

      setToasts((prev) => [
        ...prev,
        {
          id,
          message,
          type,
        },
      ]);

      setTimeout(() => {
        setToasts((prev) =>
          prev.filter((toast) => toast.id !== id),
        );
      }, 3500);
    },
    [],
  );

  const value = useMemo(
    () => ({
      showToast,
    }),
    [showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="fixed right-5 top-5 z-100 space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              min-w-[320px]
              rounded-2xl
              border
              bg-white/90
              px-5
              py-4
              shadow-2xl
              backdrop-blur-xl
              animate-in
              slide-in-from-right
              duration-300
              ${
                toast.type === "success"
                  ? "border-green-200 text-green-700"
                  : "border-red-200 text-red-700"
              }
            `}
          >
            <p className="text-sm font-semibold">
              {toast.message}
            </p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToastContext must be used within ToastProvider",
    );
  }

  return context;
}