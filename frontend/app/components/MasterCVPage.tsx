"use client";

import { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";

type Experience = {
  title: string;
  company: string;
  location: string;
  dates: string;
  bullets: string[];
};

const experience: Experience[] = [
  { title: "Senior Data Scientist", company: "Careem", location: "Dubai, UAE", dates: "Jan 2024 – Present", bullets: ["Built ML models for demand forecasting, improving accuracy by 18%.", "Designed and deployed a real-time recommendation engine using AWS SageMaker.", "Led a cross-functional team of 4 to ship an A/B testing framework."] },
  { title: "Data Scientist", company: "Majid Al Futtaim", location: "Dubai, UAE", dates: "Jun 2022 – Dec 2023", bullets: ["Developed customer segmentation models using K-means and DBSCAN.", "Automated reporting pipeline, saving 12 hours/week of manual work.", "Collaborated with product teams to define KPIs and Power BI dashboards."] },
];

export default function MasterCVPage() {
  const [mode, setMode] = useState<"preview" | "edit">("preview");
  

  return (
    <div className="min-h-screen bg-[#f1f5fb] text-slate-900">
      <DashboardSidebar />
      <main className="ml-64 min-h-screen">
        <DashboardHeader title="Master CV" subtitle="Your source of truth — CareerPilot tailors it for each role" />
        <div className="px-7 py-5">
          <div className="mb-4 flex justify-end gap-3">
            <button className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm text-slate-600 shadow-sm">↓&nbsp; Download PDF</button>
            <button onClick={() => setMode("edit")} className="rounded-xl bg-[#5b50e8] px-5 py-2.5 text-sm font-semibold text-white shadow-sm">↻&nbsp; Update CV</button>
          </div>
          <div className="grid grid-cols-[260px_minmax(0,1fr)] gap-5">
            <aside className="space-y-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-2xl text-indigo-600">▱</div><div className="min-w-0"><p className="truncate text-sm font-semibold">Heena_Sharma_Master_CV.pdf</p><p className="mt-1 text-xs text-slate-400">Sept 12, 2026</p></div></div>
                <div className="mt-5 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">✓ Profile synced</div>
                <div className="mt-5"><div className="flex justify-between text-xs text-slate-500"><span>Completeness</span><span className="font-medium text-indigo-600">71%</span></div><div className="mt-2 h-2 rounded-full bg-slate-200"><div className="h-2 w-[71%] rounded-full bg-indigo-500" /></div></div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-slate-400">CV Sections</p>
                <div className="space-y-4 text-sm">{["Professional Summary","Work Experience","Education","Skills","Certifications"].map(s => <div key={s} className="flex items-center gap-2"><span className="text-emerald-500">●</span>{s}</div>)}<div className="flex justify-between text-slate-400"><span>○&nbsp; Languages</span><button className="text-xs text-indigo-500">Add</button></div><div className="flex justify-between text-slate-400"><span>○&nbsp; Projects</span><button className="text-xs text-indigo-500">Add</button></div></div>
                <button className="mt-5 text-sm font-medium text-indigo-500">＋ Add new section</button>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-400">Tailored CVs</p><div className="mt-4 space-y-4">{[["Data Scientist","ABC Technologies","89%"],["ML Engineer","XYZ Technologies","84%"],["Data Analyst","DEF Consulting","81%"]].map(([t,c,s],i)=><div key={t} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0"><div><p className="text-sm font-medium">{t}</p><p className="text-xs text-slate-400">{c} · Sept {14-i*2}</p></div><span className={i===0?"rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600":"rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600"}>● {s}<br/>Match</span></div>)}</div></div>
            </aside>
            <section className="min-w-0">
              <div className="mb-4 flex items-center justify-between"><div className="inline-flex rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200"><button onClick={()=>setMode("preview")} className={mode==="preview"?"rounded-lg bg-[#5b50e8] px-5 py-2 text-sm font-semibold text-white":"rounded-lg px-5 py-2 text-sm text-slate-600"}>◉ Preview</button><button onClick={()=>setMode("edit")} className={mode==="edit"?"rounded-lg bg-[#5b50e8] px-5 py-2 text-sm font-semibold text-white":"rounded-lg px-5 py-2 text-sm text-slate-600"}>✎ Edit</button></div><button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">↗ Share link</button></div>
              <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
                <div className="flex items-start justify-between border-b border-slate-200 pb-7"><div>{mode==="edit"?<><input defaultValue="Heena Sharma" className="block w-full max-w-xl border-b border-indigo-300 bg-transparent text-4xl font-medium outline-none"/><input defaultValue="Senior Data Scientist" className="mt-2 block w-full max-w-xl border-b border-indigo-200 bg-transparent text-xl text-indigo-600 outline-none"/></>:<><h1 className="text-4xl font-medium tracking-tight">Heena Sharma</h1><p className="mt-1 text-xl text-indigo-600">Senior Data Scientist</p></>}<div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500"><span>📍 Dubai, UAE</span><span>✉ heena@email.com</span><span>☎ +971 XX XXX XXXX</span><span>🔗 linkedin.com/in/heena-sharma</span></div></div><div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-violet-500 text-xl font-semibold text-white">HS</div></div>
                <CVSection title="Professional Summary">{mode==="edit"?<textarea defaultValue="Senior Data Scientist with 3+ years of experience building ML-powered products in high-growth environments. Proven track record in designing production-grade recommendation systems, demand forecasting models, and data pipelines. Adept at translating business problems into data solutions and leading cross-functional teams toward measurable impact." className="min-h-28 w-full rounded-xl border border-slate-200 p-3 text-sm leading-6 outline-none"/>:<p className="text-[15px] leading-7 text-slate-700">Senior Data Scientist with 3+ years of experience building ML-powered products in high-growth environments. Proven track record in designing production-grade recommendation systems, demand forecasting models, and data pipelines. Adept at translating business problems into data solutions and leading cross-functional teams toward measurable impact.</p>}</CVSection>
                <CVSection title="Work Experience"><div className="space-y-8">{experience.map(job=><div key={job.company} className="border-l-2 border-slate-200 pl-4"><div className="flex flex-col justify-between gap-2 md:flex-row"><div><h3 className="font-semibold">{job.title}</h3><p className="text-sm text-indigo-600">{job.company}</p><p className="text-sm text-slate-400">{job.location}</p></div><span className="h-fit rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500">{job.dates}</span></div><ul className="mt-4 space-y-2 text-[15px] leading-6 text-slate-700">{job.bullets.map(b=><li key={b}>• {b}</li>)}</ul></div>)}</div></CVSection>
                <CVSection title="Education"><p className="text-sm text-slate-700">MSc Cloud Computing — University of East London · May 2022 – May 2023</p><p className="mt-2 text-sm text-slate-700">Bachelor of Computer Engineering — Gujarat Technological University · May 2012 – Jun 2016</p></CVSection>
                <CVSection title="Skills"><div className="flex flex-wrap gap-2">{["Power BI","DAX","SQL","Python","Machine Learning","AWS","Pandas","PySpark"].map(s=><span key={s} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">{s}</span>)}</div></CVSection>
                <CVSection title="Certifications"><ul className="space-y-2 text-sm text-slate-700"><li>Microsoft Certified: Power BI Data Analyst Associate — September 2023</li><li>AWS Cloud Practitioner — Foundational</li></ul></CVSection>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function CVSection({title,children}:{title:string;children:React.ReactNode}){return <section className="mt-7"><div className="mb-4 flex items-center gap-3"><div className="h-px flex-1 bg-slate-200"/><h2 className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">{title}</h2><div className="h-px flex-1 bg-slate-200"/></div>{children}</section>}
