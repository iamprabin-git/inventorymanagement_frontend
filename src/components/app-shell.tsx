"use client";

import { COMPANY_NAME } from "@/lib/company";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from "../../public/images/bless_logo.png";
import {
  LayoutDashboard,
  Package,
  Wrench,
  ShoppingCart,
  BadgeIndianRupee,
  BarChart3,
  Users,
  LogOut,
  Search,
  Bell,
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: Package },
  { href: "/services", label: "Services", icon: Wrench },
  { href: "/sales", label: "Sales", icon: ShoppingCart },
  { href: "/purchases", label: "Purchases", icon: BadgeIndianRupee },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/users", label: "Users", adminOnly: true, icon: Users },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a0f18] text-slate-100 selection:bg-emerald-500/30">
      <div className="flex min-h-screen">
        {/* --- SIDEBAR --- */}
        <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800/60 bg-[#0f172a] transition-transform print:hidden lg:static lg:translate-x-0">
          {/* Brand Identity */}
          <div className="items-center px-6 py-4">
            <Image
              src={logo}
              alt="Logo"
              width={90}
              height={90}
              className="object-cover rounded-full"
            />
          </div>

          {/* Nav Section */}
          <nav className="flex-1 space-y-1.5 px-4">
            <p className="mb-4 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Main Menu
            </p>
            {nav
              .filter((item) => !item.adminOnly || user?.role === "admin")
              .map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center gap-3.5 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-300 ${
                      active
                        ? "bg-emerald-500/10 text-emerald-400 shadow-inner shadow-emerald-500/5"
                        : "text-slate-400 hover:bg-slate-800/40 hover:text-white"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${active ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"}`}
                    />
                    {item.label}
                    {active && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                    )}
                  </Link>
                );
              })}
          </nav>

          {/* User & Logout Footnote */}
          <div className="mt-auto border-t border-slate-800/60 bg-slate-900/30 p-4">
            <div className="mb-4 flex items-center gap-3 rounded-xl bg-slate-800/30 p-3 ring-1 ring-slate-700/50">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 font-bold text-emerald-400 border border-emerald-500/30">
                {user?.name?.charAt(0)}
              </div>
              <div className="flex flex-col min-w-0">
                <p className="truncate text-xs font-bold text-slate-100">
                  {user?.name}
                </p>
                <p className="truncate text-[10px] font-medium text-slate-500 uppercase">
                  {user?.role || "Staff"}
                </p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="group flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 py-2.5 text-xs font-bold text-slate-400 transition-all hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
            >
              <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Terminate Session
            </button>
          </div>
        </aside>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* --- Enhanced Header --- */}
          <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-800/60 bg-[#0a0f18]/90 px-10 backdrop-blur-xl print:hidden">
            {/* 1. Left Section: Brand & Location */}
            <div className="flex min-w-[240px] items-center gap-4">
              <div className="flex flex-col">
                <h1 className="text-xl font-black uppercase italic tracking-wider text-white">
                  {COMPANY_NAME}
                </h1>
                <div className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-emerald-500" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                    Satdobato, Lalitpur
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Middle Section: Dynamic Breadcrumbs (Centered) */}
            <div className="hidden flex-1 items-center justify-center px-4 md:flex">
              <nav className="flex items-center gap-2 rounded-full border border-slate-800/50 bg-slate-900/30 px-4 py-1.5 shadow-inner">
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  Terminal
                </span>
                <span className="text-slate-700">/</span>
                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
                  {pathname.split("/")[1] || "Overview"}
                </span>
              </nav>
            </div>

            {/* 3. Right Section: Global Actions */}
            <div className="flex min-w-[300px] items-center justify-end gap-6">
              {/* Search Bar - Aesthetic & Functional */}
              <div className="hidden h-9 w-48 items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 px-3 text-slate-500 transition-all focus-within:w-64 focus-within:ring-1 focus-within:ring-emerald-500/50 xl:flex">
                <Search className="h-3.5 w-3.5" />
                <input
                  className="bg-transparent text-[11px] font-medium outline-none placeholder:text-slate-600"
                  placeholder="Search Records..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 border-l border-slate-800 pl-6">
                <button
                  type="button"
                  title="View Notifications"
                  aria-label="View Notifications"
                  className="group relative text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  <Bell className="h-5 w-5 transition-transform group-hover:rotate-12" />
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500 border-2 border-[#0a0f18] shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                </button>

                {/* Server Status Indicator */}
                <div className="flex items-center gap-3 rounded-md bg-slate-900/50 px-2 py-1 ring-1 ring-slate-800">
                  <div className="flex flex-col text-right">
                    <span className="text-[9px] font-black uppercase leading-tight text-emerald-500">
                      Live
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-tighter text-slate-500">
                      Srv-01
                    </span>
                  </div>
                  <div className="relative flex h-2 w-2">
                    <div className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></div>
                    <div className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* --- Main Content Area --- */}
          <main className="relative flex-1 overflow-y-auto bg-[#0a0f18]">
            {/* Subtle Grid Pattern Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03]" />

            <div className="relative mx-auto max-w-[1400px] px-10 py-10 print:max-w-none print:px-0">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
