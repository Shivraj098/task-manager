import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* TOP NAV */}
      <header
  className="
    sticky
    top-0
    z-40
    border-b
    border-gray-200/80
    bg-white/70
    backdrop-blur-xl
    supports-backdrop-filter:bg-white/60
  "
>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              TaskFlow
            </h1>
          </div>

          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/dashboard"
              className="text-gray-600 transition hover:text-black"
            >
              Dashboard
            </Link>

            <Link
              href="/my-tasks"
              className="text-gray-600 transition hover:text-black"
            >
              My Tasks
            </Link>
          </nav>
        </div>
      </header>

      {/* CONTENT */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {children}
      </main>
    </div>
  );
}