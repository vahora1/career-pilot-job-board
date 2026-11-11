import Link from "next/link";

type Job = {
  initials: string;
  title: string;
  company: string;
  match: number;
  location: string;
  salary: string;
  tags: string[];
};

export default function RecommendedJobCard({ job }: { job: Job }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-semibold text-white shadow-sm">
            {job.initials}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-slate-900">{job.title}</h3>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${job.match >= 88 ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                ● {job.match}% Match
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">{job.company}</p>
            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-400">
              <span>● {job.location}</span>
              <span>💼 Full-time</span>
              <span>{job.salary}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-wrap gap-2 xl:justify-center">
          {job.tags.map((tag) => (
            <span key={tag} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] text-slate-600">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-2 xl:ml-auto">
          <Link href="/jobs" className="flex h-10 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50">
            View Job
          </Link>
          <Link href="/cv" className="flex h-10 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
            ✎ Tailor CV
          </Link>
        </div>
      </div>
    </article>
  );
}
