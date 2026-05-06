"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r h-screen flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b">
        <h1 className="text-lg font-semibold">TaskFlow</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded-lg text-sm transition-all duration-200
                ${
                  active
                    ? "bg-gray-100 text-black font-medium"
                    : "text-gray-600 hover:bg-gray-100 hover:text-black"
                }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t text-xs text-gray-400">
        v1.0
      </div>
    </aside>
  );
}