"use client";

import { Button } from "@/components/ui/button";

type Props = {
  error: Error;
  reset: () => void;
};

export default function ErrorPage({
  error,
  reset,
}: Props) {
  return (
    <div
      className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-gray-50
        px-4
      "
    >
      <div
        className="
          w-full
          max-w-md
          rounded-3xl
          border
          border-gray-200
          bg-white
          p-8
          shadow-sm
        "
      >
        <div className="space-y-3 text-center">
          <h1
            className="
              text-2xl
              font-bold
              tracking-tight
              text-gray-900
            "
          >
            Something went wrong
          </h1>

          <p
            className="
              wrap-break-words
              text-sm
              leading-6
              text-gray-500
            "
          >
            {error.message ||
              "An unexpected error occurred."}
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            onClick={reset}
            variant="primary"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}