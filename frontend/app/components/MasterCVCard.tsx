import Link from "next/link";

export default function MasterCVCard() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">Master CV</span>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-600 ring-1 ring-emerald-100">✓ Synced</span>
      </div>

      <div className="mt-5 flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-xl text-indigo-600">
          ▧
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-slate-900">Heena_Vahora_Master_CV.pdf</h2>
          <p className="mt-1 text-[11px] text-slate-400">Last updated September 12, 2026</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] text-slate-500">7 sections</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] text-slate-500">3 tailored CVs</span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <Link href="/master-cv" className="flex h-10 items-center justify-center rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50">
          ◉ View CV
        </Link>
        <Link href="/master-cv" className="flex h-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
          ↥ Update CV
        </Link>
      </div>
    </section>
  );
}
