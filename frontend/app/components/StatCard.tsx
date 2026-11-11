type StatCardProps = {
  icon: string;
  value: string;
  label: string;
  detail: string;
  iconClass: string;
};

export default function StatCard({ icon, value, label, detail, iconClass }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
      <div className="flex items-center gap-4">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${iconClass}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-xl font-semibold text-slate-900">{value}</div>
          <div className="text-xs font-medium text-slate-700">{label}</div>
          <div className="mt-0.5 text-[11px] text-slate-400">{detail}</div>
        </div>
      </div>
    </div>
  );
}
