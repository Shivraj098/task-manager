import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">
        404
      </h1>

      <p className="text-gray-500">
        Page not found
      </p>

      <Link
        href="/dashboard"
        className="rounded-xl bg-black px-4 py-2 text-white"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}