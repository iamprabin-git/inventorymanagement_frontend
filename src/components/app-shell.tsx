"use client";

import { COMPANY_NAME } from "@/lib/company";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/sales", label: "Sales" },
  { href: "/purchases", label: "Purchases" },
  { href: "/reports", label: "Reports" },
  { href: "/users", label: "Users", adminOnly: true },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className="flex w-52 shrink-0 flex-col border-r border-slate-800 bg-slate-900/80 print:hidden sm:w-56">
          <div className="border-b border-slate-800 px-4 py-4">
            <p className="text-base font-semibold leading-snug text-white">
              {COMPANY_NAME}
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
              Inventory
            </p>
            <p className="mt-2 truncate text-sm font-medium text-slate-300">
              {user?.name}
            </p>
            <p className="truncate text-xs text-slate-500">{user?.username}</p>
          </div>
          <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
            {nav
              .filter((item) => !item.adminOnly || user?.role === "admin")
              .map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-md px-3 py-2 text-sm transition ${
                      active
                        ? "bg-emerald-600/20 text-emerald-300"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
          </nav>
          <div className="mt-auto border-t border-slate-800 p-3 print:hidden">
            <button
              type="button"
              onClick={() => logout()}
              className="w-full rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
            >
              Sign out
            </button>
          </div>
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="border-b border-slate-800 bg-slate-900/90 px-6 py-3 print:hidden">
            <h1 className="text-lg font-semibold tracking-tight text-white">
              {COMPANY_NAME}
            </h1>
            <p className="text-xs text-slate-500">Stock & billing</p>
          </header>
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 print:max-w-none print:px-0 print:py-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
