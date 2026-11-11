"use client";

import Link from "next/link";

type HeaderAction = {
  label: string;
  href?: string;
  variant?: "primary" | "secondary";
  icon?: string;
  action?: "print";
};

type DashboardHeaderProps = {
  title: string;
  subtitle: string;
  actions?: HeaderAction[];
};

export default function DashboardHeader({
  title,
  subtitle,
  actions = [],
}: DashboardHeaderProps) {
  function handleAction(action?: string) {
    if (action === "print") {
      window.print();
    }
  }

  return (
    <header className="h-[72px] border-b border-slate-200 bg-white">
      <div className="flex h-full items-center justify-between px-8">

        {/* LEFT */}
        <div>
          <h1 className="text-[20px] font-medium leading-6 text-slate-900">
            {title}
          </h1>

          <p className="mt-0.5 text-[13px] leading-5 text-[#8b9bb5]">
            {subtitle}
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* Notifications */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50"
          >
            <span className="text-[18px]">♧</span>

            <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
              3
            </span>
          </button>

          {/* Avatar */}
          <button
            type="button"
            aria-label="Profile"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7c5cf4] text-sm font-semibold text-white shadow-sm"
          >
            HS
          </button>

          {/* Actions */}
          {actions.map((action) => {
            const buttonClass =
              action.variant === "secondary"
                ? "inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                : "inline-flex h-10 items-center gap-2 rounded-xl bg-[#5b50e8] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#4d43dc]";

            if (action.href) {
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className={buttonClass}
                >
                  {action.icon && <span>{action.icon}</span>}
                  {action.label}
                </Link>
              );
            }

            return (
              <button
                key={action.label}
                type="button"
                onClick={() => handleAction(action.action)}
                className={buttonClass}
              >
                {action.icon && <span>{action.icon}</span>}
                {action.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}