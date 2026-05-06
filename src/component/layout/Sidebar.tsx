"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "My Tasks",
    href: "/my-tasks",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="
        fixed left-0 top-0 z-40 hidden lg:flex
        h-screen
        w-67.5 shrink-0
        flex-col
        border-r
        border-white/40
        bg-white/70
        backdrop-blur-2xl
      "
    >
      {/* Logo */}
      <div className="border-b border-gray-100 px-7 py-7">
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-2xl
              bg-black
              text-sm
              font-bold
              text-white
              shadow-lg
            "
          >
            TF
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight">
              TaskFlow
            </h1>

            <p className="text-xs font-medium text-gray-500">
              Team Workspace
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4 py-6">
        {navItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group
                flex
                items-center
                rounded-2xl
                px-4
                py-3
                text-sm
                font-medium
                transition-all
                duration-200
                ${
                  active
                    ? "bg-black text-white shadow-lg"
                    : `
                      text-gray-600
                      hover:bg-white
                      hover:text-black
                      hover:shadow-md
                    `
                }
              `}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-100 p-5">
        <div
          className="
            rounded-2xl
            border
            border-gray-100
            bg-white/80
            p-4
            shadow-sm
          "
        >
          <p className="text-xs font-semibold text-gray-900">
            TaskFlow Pro
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Realtime collaborative workspace.
          </p>
        </div>
      </div>
    </aside>
  );
}