"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const API = "http://localhost:8000";

type Job = {
  id: number; initials: string; title: string; company: string; match: number;
  location: string; salary: string; type: string; posted: string; applicants: number;
  skills: string[]; description: string; responsibilities: string[]; color: string; applyUrl: string;
};

type SavedCV = {
  id: number; job_id: number | null; job_title: string; company: string;
  job_description: string; tailored_content: any; created_at: string | null;
};

type MasterCV = { filename: string; text: string; master_cv: Record<string, unknown>; updated_at: string | null };

const jobs: Job[] = [
  {
    id: 1,
    initials: "AT",
    title: "Data Scientist",
    company: "ABC Technologies",
    match: 89,
    location: "Dubai, UAE",
    salary: "AED 18,000–22,000",
    type: "Full-time",
    posted: "2 days ago",
    applicants: 32,
    skills: ["Python", "SQL", "Machine Learning", "AWS"],
    description:
      "Help teams make data-driven decisions using predictive analytics, statistical modelling, and machine learning.",
    responsibilities: [
      "Build predictive models and analytical solutions.",
      "Analyze large datasets to identify business trends.",
      "Collaborate with product and engineering teams.",
      "Communicate insights to business stakeholders.",
    ],
    color: "bg-indigo-600",
    applyUrl:
      "https://www.google.com/search?q=ABC+Technologies+Data+Scientist+jobs",
  },
  {
    id: 2,
    initials: "XT",
    title: "ML Engineer",
    company: "XYZ Technologies",
    match: 84,
    location: "Dubai, UAE",
    salary: "AED 20,000–28,000",
    type: "Full-time",
    posted: "3 days ago",
    applicants: 28,
    skills: ["Python", "TensorFlow", "AWS", "MLOps"],
    description:
      "Develop, deploy, and maintain machine learning models that power production applications.",
    responsibilities: [
      "Build and deploy machine learning pipelines.",
      "Optimize models for production workloads.",
      "Monitor model performance and data quality.",
      "Work with software and data engineering teams.",
    ],
    color: "bg-purple-600",
    applyUrl:
      "https://www.google.com/search?q=XYZ+Technologies+ML+Engineer+jobs",
  },
  {
    id: 3,
    initials: "DC",
    title: "Data Analyst",
    company: "DFE Consulting",
    match: 81,
    location: "Dubai, UAE",
    salary: "AED 12,000–17,000",
    type: "Full-time",
    posted: "5 days ago",
    applicants: 21,
    skills: ["SQL", "Excel", "Power BI", "Python"],
    description:
      "Transform business data into useful reports, dashboards, and actionable insights.",
    responsibilities: [
      "Create reports and interactive dashboards.",
      "Write SQL queries to analyze business data.",
      "Identify trends and performance indicators.",
      "Present findings to business stakeholders.",
    ],
    color: "bg-cyan-600",
    applyUrl:
      "https://www.google.com/search?q=DFE+Consulting+Data+Analyst+jobs",
  },
  {
    id: 4,
    initials: "N",
    title: "Senior Data Scientist",
    company: "Noon",
    match: 78,
    location: "Dubai, UAE",
    salary: "AED 22,000–30,000",
    type: "Full-time",
    posted: "1 week ago",
    applicants: 46,
    skills: ["Python", "SQL", "Experimentation", "Analytics"],
    description:
      "Use experimentation and advanced analytics to improve customer experience and business performance.",
    responsibilities: [
      "Design and evaluate controlled experiments.",
      "Develop analytical models and forecasts.",
      "Measure product and customer outcomes.",
      "Partner with product and marketing teams.",
    ],
    color: "bg-orange-600",
    applyUrl: "https://www.google.com/search?q=Noon+Senior+Data+Scientist+jobs",
  },
  {
    id: 5,
    initials: "EN",
    title: "Data Science Lead",
    company: "Emirates NBD",
    match: 75,
    location: "Dubai, UAE",
    salary: "AED 25,000–35,000",
    type: "Full-time",
    posted: "1 week ago",
    applicants: 38,
    skills: ["Python", "Machine Learning", "SQL", "Leadership"],
    description:
      "Lead data science initiatives and deliver analytical solutions for business and financial services.",
    responsibilities: [
      "Lead data science projects from discovery to delivery.",
      "Review analytical models and technical approaches.",
      "Mentor data scientists and analysts.",
      "Align analytics initiatives with business priorities.",
    ],
    color: "bg-emerald-600",
    applyUrl:
      "https://www.google.com/search?q=Emirates+NBD+Data+Science+Lead+jobs",
  },
  {
    id: 6,
    initials: "T",
    title: "Data Scientist – Growth",
    company: "Talabat",
    match: 72,
    location: "Dubai, UAE",
    salary: "AED 17,000–23,000",
    type: "Full-time",
    posted: "2 weeks ago",
    applicants: 46,
    skills: ["Python", "SQL", "Experimentation", "Analytics"],
    description:
      "Talabat is looking for a Data Scientist focused on growth analytics, experimentation, and customer insights.",
    responsibilities: [
      "Analyze growth opportunities.",
      "Design experiments.",
      "Build analytical models.",
      "Partner with marketing and product teams.",
    ],
    color: "bg-red-600",
    applyUrl:
      "https://www.google.com/search?q=Talabat+Data+Scientist+Growth+jobs",
  },
];

function asList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export default function JobsPage() {
  const [cv, setCv] = useState<MasterCV | null>(null);
  const [cvLoading, setCvLoading] = useState(true);
  const [cvError, setCvError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(2);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [tailoredCVs, setTailoredCVs] = useState<SavedCV[]>([]);
  const [loadingTailored, setLoadingTailored] = useState(true);
  const [busy, setBusy] = useState<"tailor" | "analyze" | null>(null);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"details" | "tailored" | "analysis">("details");
  const [sortBy, setSortBy] = useState("match");

  async function loadTailoredCVs() {
    setLoadingTailored(true);
    try {
      const response = await fetch(`${API}/api/cv/tailored`, { cache: "no-store" });
      if (!response.ok) throw new Error("Could not load saved tailored CVs.");
      const data = await response.json();
      setTailoredCVs(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load saved CVs.");
    } finally {
      setLoadingTailored(false);
    }
  }

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const response = await fetch(`${API}/api/cv/current`, { cache: "no-store" });
        if (response.status === 404) return;
        if (!response.ok) throw new Error("Unable to load the saved Master CV.");
        const data = await response.json();
        if (active) setCv(data);
      } catch (e) {
        if (active) setCvError(e instanceof Error ? e.message : "Could not connect to the backend.");
      } finally {
        if (active) setCvLoading(false);
      }
    })();
    loadTailoredCVs();
    return () => { active = false; };
  }, []);

  const filteredJobs = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = jobs.filter(job => [job.title, job.company, job.location, ...job.skills].join(" ").toLowerCase().includes(q));
    if (sortBy === "match") list.sort((a, b) => b.match - a.match);
    if (sortBy === "recent") list.sort((a, b) => a.id - b.id);
    return list;
  }, [search, sortBy]);
  const selectedJob = jobs.find(job => job.id === selectedId) ?? filteredJobs[0] ?? jobs[0];

  // Use the job ID as the primary relationship. Title/company fallback only supports older saved rows.
  const jobCVs = tailoredCVs.filter(item =>
    item.job_id === selectedJob.id ||
    (item.job_id == null && item.job_title?.toLowerCase() === selectedJob.title.toLowerCase() && item.company?.toLowerCase() === selectedJob.company.toLowerCase())
  ).sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
  const latestCV = jobCVs[0];

  function toggleSaved(id: number) {
    setSavedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  async function runJobAction(action: "tailor" | "analyze") {
    if (!selectedJob) return;
    setError(""); setAnalysis(null); setBusy(action);
    if (!cv?.text || cv.text.trim().length < 50) {
      setError("Upload a readable Master CV containing at least 50 characters first."); setBusy(null); return;
    }
    try {
      const endpoint = action === "tailor" ? `${API}/api/cv/tailor` : `${API}/api/jobs/analyze`;
      const response = await fetch(endpoint, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          master_cv: cv.text,
          structured_cv: cv.master_cv,
          job_id: selectedJob.id,
          job_title: selectedJob.title,
          company: selectedJob.company,
          job_description: [
            `${selectedJob.title} at ${selectedJob.company}`,
            `Location: ${selectedJob.location}`,
            `Required skills: ${selectedJob.skills.join(", ")}`,
            selectedJob.description,
            ...selectedJob.responsibilities,
          ].join("\n"),
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(typeof data?.detail === "string" ? data.detail : `Request failed (${response.status}).`);
      if (action === "tailor") {
        await loadTailoredCVs();
        setActiveTab("tailored");
      } else {
        setAnalysis(data);
        setActiveTab("analysis");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "The request failed. Check that your backend is running.");
    } finally { setBusy(null); }
  }

  const tailored = latestCV?.tailored_content;

  return (
    <div className="min-h-screen bg-[#f4f6fb] text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[240px] flex-col bg-[#0d172d] text-white lg:flex">
        <Link href="/dashboard" className="flex items-center gap-3 px-7 py-7">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-xl">◆</span>
          <span><span className="block text-lg font-bold">CareerPilot</span><span className="text-xs text-slate-400">● AI-powered</span></span>
        </Link>
        <p className="px-6 pb-3 text-[10px] font-semibold tracking-[0.2em] text-slate-500">NAVIGATION</p>
        <nav className="space-y-1 px-3 text-sm">
          {[{label:"Dashboard",href:"/dashboard",icon:"▦"},{label:"My Profile",href:"/profile",icon:"♙"},{label:"Master CV",href:"/master-cv",icon:"▤"},{label:"Jobs",href:"/jobs",icon:"▱"},{label:"Applications",href:"/applications",icon:"☑"}].map(item =>
            <Link key={item.label} href={item.href} className={`flex items-center gap-3 rounded-xl px-4 py-3 ${item.label === "Jobs" ? "bg-indigo-500/30 text-white" : "text-slate-300 hover:bg-white/5"}`}><span className="w-5">{item.icon}</span>{item.label}</Link>
          )}
        </nav>
        <div className="mx-4 mt-8 border-t border-white/10 pt-5"><Link href="/settings" className="block rounded-xl px-4 py-3 text-sm text-slate-300">⚙ Settings</Link></div>
        <div className="mt-auto p-3"><div className="rounded-xl border border-indigo-400/20 bg-indigo-500/10 p-4"><p className="text-sm font-semibold">Master CV connection</p><p className="mt-2 break-words text-xs text-slate-400">{cvLoading ? "Checking saved CV..." : cv ? `✓ Connected · ${cv.filename}` : "Upload a CV to enable AI tools."}</p></div></div>
      </aside>

      <div className="lg:pl-[240px]">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white px-6 sm:px-8">
          <div><h1 className="text-xl font-bold">Jobs</h1><p className="mt-0.5 text-xs text-slate-500">{jobs.length} sample roles · AI tools use your saved CV</p></div>
          <div className="flex items-center gap-3"><span className={`rounded-full px-3 py-2 text-xs ${cv ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{cv ? "✓ Master CV connected" : "Master CV not uploaded"}</span><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 font-semibold text-white">CP</span></div>
        </header>

        <main className="grid min-h-[calc(100vh-76px)] gap-5 p-4 sm:p-6 xl:grid-cols-[minmax(290px,370px)_minmax(0,1fr)]">
          <section className="min-w-0">
            <div className="mb-4 flex gap-2"><input value={search} onChange={e => setSearch(e.target.value)} placeholder="⌕  Search jobs..." className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"/><select value={sortBy} onChange={e => setSortBy(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-2 text-xs"><option value="match">Best match</option><option value="recent">Recent</option></select></div>
            <div className="space-y-3">
              {filteredJobs.map(job => {
                const hasCV = tailoredCVs.some(item => item.job_id === job.id || (item.job_id == null && item.job_title?.toLowerCase() === job.title.toLowerCase() && item.company?.toLowerCase() === job.company.toLowerCase()));
                return <button key={job.id} onClick={() => {setSelectedId(job.id);setAnalysis(null);setError("");setActiveTab(hasCV ? "tailored" : "details");}} className={`w-full rounded-2xl border p-4 text-left shadow-sm transition ${selectedJob.id === job.id ? "border-violet-500 bg-violet-50/70 ring-1 ring-violet-400" : "border-slate-200 bg-white hover:border-violet-200"}`}>
                  <div className="flex items-start gap-3"><span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white ${job.color}`}>{job.initials}</span><span className="min-w-0 flex-1"><span className="block font-semibold">{job.title}</span><span className="mt-1 block text-sm text-slate-500">{job.company}</span></span>{hasCV && <span className="whitespace-nowrap rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">✓ Tailored CV</span>}</div>
                  <div className="mt-4 flex items-center justify-between"><span className="text-xs text-slate-400">{job.posted}</span><span className={`rounded-full px-3 py-1 text-xs font-semibold ${job.match >= 80 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>● {job.match}% Match*</span></div>
                </button>;
              })}
            </div>
            <p className="mt-3 text-[11px] text-slate-400">*Displayed scores are sample values.</p>
          </section>

          <section className="min-w-0">
            <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
                <div className="flex items-center gap-4"><span className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold text-white ${selectedJob.color}`}>{selectedJob.initials}</span><div><h2 className="text-2xl font-bold">{selectedJob.title}</h2><p className="mt-1 text-sm text-slate-500">{selectedJob.company} · Posted {selectedJob.posted}</p><p className="mt-2 text-xs text-slate-500">{selectedJob.location} · {selectedJob.type} · {selectedJob.salary}</p></div></div>
                <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">● {selectedJob.match}% Match*</span>
              </div>
              <div className="flex gap-7 border-b border-slate-200 px-5 sm:px-7">
                {([ ["details","Job Details"],["tailored","Tailored CV"],["analysis","Analysis"] ] as const).map(([id,label]) => <button key={id} onClick={() => setActiveTab(id)} className={`border-b-2 px-1 py-3 text-sm font-semibold ${activeTab === id ? "border-violet-600 text-violet-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}>{label}{id === "tailored" && latestCV ? " ✓" : ""}</button>)}
              </div>

              <div className="p-5 sm:p-6">
                {error && <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
                {cvError && <div className="mb-4 text-sm text-red-600">{cvError}</div>}
                {activeTab === "details" && <div className="space-y-6">
                  <div><h3 className="font-bold">About the role</h3><p className="mt-2 text-sm leading-7 text-slate-600">{selectedJob.description}</p></div>
                  <div><h3 className="font-bold">Key responsibilities</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">{selectedJob.responsibilities.map((item,i)=><li key={i}>{item}</li>)}</ul></div>
                  <div><h3 className="font-bold">Required skills</h3><div className="mt-3 flex flex-wrap gap-2">{selectedJob.skills.map(skill=><span key={skill} className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-800">{skill}</span>)}</div></div>
                  <div className="flex flex-wrap gap-3"><button onClick={()=>runJobAction("tailor")} disabled={busy!==null||cvLoading||!cv} className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50">{busy==="tailor"?"Tailoring CV...":latestCV?"Regenerate Tailored CV":"Tailor CV for this Role"}</button><button onClick={()=>runJobAction("analyze")} disabled={busy!==null||cvLoading||!cv} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50">Analyze Match</button><a href={selectedJob.applyUrl} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-50">Find Application Page ↗</a></div>
                  {!cv && !cvLoading && <p className="text-sm text-amber-700">Upload your Master CV first. <Link className="underline" href="/master-cv">Open Master CV</Link></p>}
                </div>}

                {activeTab === "tailored" && <div>
                  {loadingTailored ? <p className="text-sm text-slate-500">Loading this job's tailored CV...</p> : !latestCV ? <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center"><p className="font-semibold">No tailored CV for this job yet</p><p className="mt-2 text-sm text-slate-500">Generate a CV tailored to {selectedJob.title} at {selectedJob.company}.</p><button onClick={()=>runJobAction("tailor")} disabled={busy!==null||!cv} className="mt-4 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{busy==="tailor"?"Tailoring CV...":"Tailor CV for this Role"}</button></div> : <>
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-emerald-50 p-4"><div><p className="font-semibold text-emerald-800">✓ Tailored CV saved for this job.</p><p className="mt-1 text-sm text-emerald-900">This CV is linked to {selectedJob.title} at {selectedJob.company}.</p></div><button onClick={()=>runJobAction("tailor")} disabled={busy!==null||!cv} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50">{busy==="tailor"?"Regenerating...":"↻ Regenerate CV"}</button></div>
                    <div className="rounded-xl border border-slate-200"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5"><div><h3 className="text-xl font-bold">Tailored CV – {selectedJob.title}</h3><p className="mt-1 text-xs text-slate-500">Created {latestCV.created_at ? new Date(latestCV.created_at).toLocaleString() : "Saved"}</p></div><button onClick={()=>navigator.clipboard.writeText(JSON.stringify(tailored,null,2))} className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">Copy CV data</button></div>
                      <div className="space-y-6 p-5">
                        {tailored?.professional_summary && <section><h4 className="font-bold">Professional Summary</h4><p className="mt-2 text-sm leading-7 text-slate-700">{tailored.professional_summary}</p></section>}
                        {!!asList(tailored?.core_skills).length && <section><h4 className="font-bold">Core Skills</h4><div className="mt-3 flex flex-wrap gap-2">{asList(tailored.core_skills).map((skill,i)=><span key={`${skill}-${i}`} className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-800">{skill}</span>)}</div></section>}
                        {!!tailored?.experience?.length && <section><h4 className="font-bold">Professional Experience</h4><div className="mt-3 space-y-5">{tailored.experience.map((item:any,i:number)=><div key={i} className="border-b border-slate-100 pb-4 last:border-0"><div className="flex flex-wrap justify-between gap-2"><p className="font-semibold">{item.employer} — {item.title}</p><span className="text-xs text-slate-500">{item.dates}</span></div>{item.location&&<p className="mt-1 text-xs text-slate-500">{item.location}</p>}<ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">{asList(item.bullets).map((bullet,j)=><li key={j}>{bullet}</li>)}</ul></div>)}</div></section>}
                        <div className="grid gap-5 sm:grid-cols-2">{[ ["Education",asList(tailored?.education)],["Certifications",asList(tailored?.certifications)] ].map(([heading,items]:any)=><section key={heading}><h4 className="font-bold">{heading}</h4><ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">{items.map((item:string,i:number)=><li key={i}>{item}</li>)}</ul></section>)}</div>
                        {!!asList(tailored?.additional_information).length && <section><h4 className="font-bold">Additional Information</h4><ul className="mt-2 list-disc pl-5 text-sm">{asList(tailored.additional_information).map((item,i)=><li key={i}>{item}</li>)}</ul></section>}
                      </div>
                    </div>
                  </>}
                </div>}

                {activeTab === "analysis" && <div>{analysis ? <pre className="whitespace-pre-wrap break-words rounded-xl bg-slate-50 p-4 text-sm leading-6">{JSON.stringify(analysis,null,2)}</pre> : <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center"><p className="font-semibold">Job match analysis</p><p className="mt-2 text-sm text-slate-500">Compare this role with your Master CV.</p><button onClick={()=>runJobAction("analyze")} disabled={busy!==null||!cv} className="mt-4 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold disabled:opacity-50">{busy==="analyze"?"Analyzing...":"Analyze Match"}</button></div>}</div>}
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}
