export default function ProfileCard() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">Career profile</span>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-600 ring-1 ring-emerald-100">Active</span>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500 text-base font-semibold text-white">
          HS
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-emerald-400 text-[8px] text-white">✓</span>
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-900">Heena Vahora</h2>
          <p className="text-sm font-medium text-indigo-600">Data Scientist</p>
          <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-400">
            <span>● Dubai, UAE</span>
            <span>💼 3+ years</span>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-500">Profile completeness</span>
          <span className="font-semibold text-slate-700">92%</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-slate-200">
          <div className="h-2 w-[92%] rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600" />
        </div>
        <p className="mt-2 text-[11px] text-slate-400">Add 2 more items to reach 100%</p>
      </div>

      <button className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">
        ✎ Edit Profile
      </button>
    </section>
  );
}
