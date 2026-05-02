import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-6">Task Manager</h2>

        <nav className="space-y-2">
          <Link
            href="/dashboard"
            className="block px-3 py-2 rounded hover:bg-gray-100"
          >
            Dashboard
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}