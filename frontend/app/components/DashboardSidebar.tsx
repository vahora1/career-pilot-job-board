"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "Dashboard", href: "/dashboard", icon: "▦" },
  { label: "My Profile", href: "/profile", icon: "♙" },
  { label: "Master CV", href: "/master-cv", icon: "▤" },
  { label: "Jobs", href: "/jobs", icon: "▱", badge: 12 },
  { label: "Applications", href: "/applications", icon: "☑", badge: 4 },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-[#0d162b] text-white lg:flex">
      <div className="px-7 pb-7 pt-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg shadow-lg shadow-indigo-900/30">
            ◆
          </div>
          <div>
            <div className="text-[16px] font-semibold tracking-tight">CareerPilot</div>
            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              AI-powered
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">
        Navigation
      </div>

      <nav className="mt-3 space-y-1 px-3">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group relative flex h-11 items-center gap-3 rounded-xl px-3 text-sm transition ${
                active
                  ? "bg-indigo-500/20 text-indigo-200"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {active && <span className="absolute left-0 h-6 w-0.5 rounded-r bg-indigo-400" />}
              <span className="w-5 text-center text-base opacity-90">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-slate-300">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mx-4 my-5 border-t border-white/10" />

      <Link
        href="/settings"
        className="mx-3 flex h-11 items-center gap-3 rounded-xl px-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
      >
        <span className="w-5 text-center">⚙</span>
        Settings
      </Link>

      <div className="mt-auto p-3">
        <div className="rounded-xl border border-indigo-400/20 bg-indigo-500/10 p-4">
          <div className="text-xs font-semibold text-indigo-200">3 new matches today</div>
          <div className="mt-1 text-[11px] leading-4 text-slate-400">
            Your profile attracted new roles
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 border-t border-white/10 px-2 pt-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500 text-xs font-semibold">
            HS
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">Heena Vahora</div>
            <div className="text-[11px] text-slate-400">Data Scientist</div>
          </div>
          <span className="text-slate-500">⌄</span>
        </div>
      </div>
    </aside>
  );
}
