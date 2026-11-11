"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import { uploadCV } from "../../lib/api";


type Experience = {
  title: string;
  company: string;
  location: string;
  dates: string;
  bullets: string[];
};

type MasterCV = {
  name: string;
  email: string;
  phone: string;
  location: string;
  professional_summary: string;
  skills: string[];
  experience: {
    employer: string;
    title: string;
    dates: string;
    location: string;
    bullets: string[];
  }[];
  education: string[];
  certifications: string[];
  additional_information: string[];
};

type CVUploadResponse = {filename: string; text: string; character_count: number; master_cv: MasterCV; };

const experience: Experience[] = [
  { title: "Senior Data Scientist", company: "Careem", location: "Dubai, UAE", dates: "Jan 2024 – Present", bullets: ["Built ML models for demand forecasting, improving accuracy by 18%.", "Designed and deployed a real-time recommendation engine using AWS SageMaker.", "Led a cross-functional team of 4 to ship an A/B testing framework."] },
  { title: "Data Scientist", company: "Majid Al Futtaim", location: "Dubai, UAE", dates: "Jun 2022 – Dec 2023", bullets: ["Developed customer segmentation models using K-means and DBSCAN.", "Automated reporting pipeline, saving 12 hours/week of manual work.", "Collaborated with product teams to define KPIs and Power BI dashboards."] },
];

export default function MasterCVPage() {
  const [mode, setMode] = useState<"preview" | "edit">("preview");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [masterCV, setMasterCV] = useState<MasterCV | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [uploadedFilename, setUploadedFilename] = useState("");
  const [characterCount, setCharacterCount] = useState(0);
  const [rawText, setRawText] = useState("");

  
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    let cancelled = false;

    async function loadSavedMasterCV() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/cv/current`,
          { cache: "no-store" }
        );

        if (response.status === 404) {
          // No CV has been saved yet.
          return;
        }

        if (!response.ok) {
          throw new Error(
            `Could not load saved Master CV (${response.status})`
          );
        }

        const data = await response.json();

        if (cancelled) return;

        if (data.master_cv) {
          setMasterCV(data.master_cv);
          setUploadedFilename(data.filename || "");
          setRawText(data.text || "");
          setCharacterCount(
            data.character_count ||
              (data.text ? data.text.length : 0)
          );
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load saved Master CV:", error);
          setUploadError(
            "Could not load your saved Master CV. Please refresh to retry."
          );
        }
      }
    }

    loadSavedMasterCV();

    return () => {
      cancelled = true;
    };
  }, [API_BASE_URL]);

  
  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");
    setUploadSuccess("");

    try {
      const result = (await uploadCV(file)) as CVUploadResponse;

      if (!result.master_cv) {
        throw new Error("The backend returned the extracted text but no structured Master CV.");
      }

      setMasterCV(result.master_cv);
      setUploadedFilename(result.filename || file.name);
      setCharacterCount(result.character_count || 0);
      setRawText(result.text || "");
      setUploadSuccess("CV uploaded and Master CV updated successfully.");
      setMode("preview");
    } catch (error) {
      console.error("CV upload failed:", error);
      setUploadError(error instanceof Error ? error.message : "CV upload failed.");
    } finally {
      setUploading(false);
      // Allows the same file to be selected again if needed.
      event.target.value = "";
    }
  }

  const cv = masterCV;
  const sectionsPresent = cv
    ? [cv.professional_summary, cv.experience.length, cv.education.length, cv.skills.length, cv.certifications.length]
        .filter((value) => (typeof value === "string" ? value.trim().length > 0 : value > 0)).length
    : 0;
  const completeness = cv ? Math.round((sectionsPresent / 5) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#f1f5fb] text-slate-900">
      <DashboardSidebar />
      <main className="ml-64 min-h-screen">
        <DashboardHeader
          title="Master CV"
          subtitle="Your source of truth — CareerPilot tailors it for each role"
        />

        <div className="px-7 py-5">
          <div className="mb-4 flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm text-slate-600 shadow-sm hover:bg-slate-50"
            >
              ↓&nbsp; Download / Print PDF
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl bg-[#5b50e8] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#4d43dc] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? "Uploading and processing…" : "↑ Upload New CV"}
            </button>
          </div>

 {uploadSuccess && (
            <div role="status" className="mb-4 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <span>✓ {uploadSuccess}</span>
              <button type="button" onClick={() => setUploadSuccess("")} aria-label="Dismiss success message" className="ml-4 text-lg">×</button>
            </div>
          )}
          {uploadError && (
            <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {uploadError}
            </div>
          )}

          <div className="grid grid-cols-[260px_minmax(0,1fr)] gap-5">
            <aside className="space-y-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-2xl text-indigo-600">▱</div>
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold">{uploadedFilename || "No CV uploaded yet"}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {cv ? `${characterCount.toLocaleString()} characters extracted` : "Upload a PDF, DOCX, or TXT file"}
                    </p>
                  </div>
                </div>
                <div className={`mt-5 inline-flex rounded-full px-3 py-1 text-xs font-medium ${cv ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                  {cv ? "✓ CV processed" : "Waiting for upload"}
                </div>
                <div className="mt-5">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Completeness</span><span className="font-medium text-indigo-600">{completeness}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-200">
                    <div className="h-2 rounded-full bg-indigo-500 transition-all" style={{ width: `${completeness}%` }} />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-slate-400">CV Sections</p>
                <div className="space-y-4 text-sm">
                    {[
                    ["Professional Summary", Boolean(cv?.professional_summary.trim())],
                    ["Work Experience", Boolean(cv?.experience.length)],
                    ["Education", Boolean(cv?.education.length)],
                    ["Skills", Boolean(cv?.skills.length)],
                    ["Certifications", Boolean(cv?.certifications.length)],
                  ].map(([label, present]) => (
                    <div key={String(label)} className="flex items-center gap-2">
                      <span className={present ? "text-emerald-500" : "text-slate-300"}>{present ? "●" : "○"}</span>
                      <span className={present ? "text-slate-700" : "text-slate-400"}>{String(label)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-400">Source CV Text</p>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  The original extracted text is retained in this page session for checking the structured details.
                </p>
                {rawText && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm font-medium text-indigo-600">View extracted text</summary>
                    <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600">{rawText}</pre>
                  </details>
                )}
              </div>
            </aside>

            <section className="min-w-0">
              <div className="mb-4 flex items-center justify-between">
                <div className="inline-flex rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200">
                  <button type="button" onClick={() => setMode("preview")} className={mode === "preview" ? "rounded-lg bg-[#5b50e8] px-5 py-2 text-sm font-semibold text-white" : "rounded-lg px-5 py-2 text-sm text-slate-600"}>◉ Preview</button>
                  <button type="button" onClick={() => setMode("edit")} className={mode === "edit" ? "rounded-lg bg-[#5b50e8] px-5 py-2 text-sm font-semibold text-white" : "rounded-lg px-5 py-2 text-sm text-slate-600"}>✎ Edit</button>
                </div>
                <span className="text-xs text-slate-400">{cv ? "Showing uploaded CV data" : "Preview will update after upload"}</span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
                {!cv ? (
                  <div className="py-20 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl text-indigo-500">▤</div>
                    <h2 className="mt-5 text-xl font-semibold">Your Master CV will appear here</h2>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Upload your CV to populate the preview with the extracted name, contact details, summary, experience, education, skills, and certifications.</p>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-6 rounded-xl bg-[#5b50e8] px-5 py-2.5 text-sm font-semibold text-white">Upload CV</button>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col justify-between gap-5 border-b border-slate-200 pb-7 sm:flex-row">
                      <div className="min-w-0 flex-1">
                        {mode === "edit" ? (
                          <>
                            <input aria-label="Candidate name" value={cv.name} onChange={(e) => setMasterCV({ ...cv, name: e.target.value })} placeholder="Full name" className="block w-full border-b border-indigo-300 bg-transparent text-3xl font-medium outline-none md:text-4xl" />
                            <p className="mt-2 text-xs text-slate-400">Edits currently apply to this page session only.</p>
                          </>
                        ) : (
                          <h1 className="break-words text-3xl font-medium tracking-tight md:text-4xl">{cv.name || "Name not found in CV"}</h1>
                        )}
                        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                          {cv.location && <span>📍 {cv.location}</span>}
                          {cv.email && <span>✉ {cv.email}</span>}
                          {cv.phone && <span>☎ {cv.phone}</span>}
                        </div>
                      </div>
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-violet-500 text-xl font-semibold text-white">
                        {(cv.name || "CV").split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "CV"}
                      </div>
                    </div>

                    <CVSection title="Professional Summary">
                      {mode === "edit" ? (
                        <textarea aria-label="Professional summary" value={cv.professional_summary} onChange={(e) => setMasterCV({ ...cv, professional_summary: e.target.value })} className="min-h-32 w-full rounded-xl border border-slate-200 p-3 text-sm leading-6 outline-none focus:border-indigo-400" placeholder="No summary extracted" />
                      ) : (
                        <p className="whitespace-pre-wrap text-[15px] leading-7 text-slate-700">{cv.professional_summary || "No professional summary was extracted from this CV."}</p>
                      )}
                    </CVSection>

                    <CVSection title="Work Experience">
                      {cv.experience.length ? <div className="space-y-8">{cv.experience.map((job, index) => (
                        <div key={`${job.employer}-${job.title}-${index}`} className="border-l-2 border-slate-200 pl-4">
                          <div className="flex flex-col justify-between gap-2 md:flex-row">
                            <div>
                              <h3 className="font-semibold">{job.title || "Role not specified"}</h3>
                              <p className="text-sm text-indigo-600">{job.employer}</p>
                              {job.location && <p className="text-sm text-slate-400">{job.location}</p>}
                            </div>
                            {job.dates && <span className="h-fit rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500">{job.dates}</span>}
                          </div>
                          {job.bullets.length > 0 && <ul className="mt-4 space-y-2 text-[15px] leading-6 text-slate-700">{job.bullets.map((bullet, bulletIndex) => <li key={`${bullet}-${bulletIndex}`}>• {bullet}</li>)}</ul>}
                        </div>
                      ))}</div> : <EmptySection text="No work experience was extracted." />}
                    </CVSection>

                    <CVSection title="Education">
                      {cv.education.length ? <ul className="space-y-2 text-sm leading-6 text-slate-700">{cv.education.map((item, index) => <li key={`${item}-${index}`}>• {item}</li>)}</ul> : <EmptySection text="No education details were extracted." />}
                    </CVSection>

                    <CVSection title="Skills">
                      {cv.skills.length ? <div className="flex flex-wrap gap-2">{cv.skills.map((skill, index) => <span key={`${skill}-${index}`} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">{skill}</span>)}</div> : <EmptySection text="No skills were extracted." />}
                    </CVSection>

                    <CVSection title="Certifications">
                      {cv.certifications.length ? <ul className="space-y-2 text-sm text-slate-700">{cv.certifications.map((item, index) => <li key={`${item}-${index}`}>• {item}</li>)}</ul> : <EmptySection text="No certifications were extracted." />}
                    </CVSection>

                    {cv.additional_information.length > 0 && <CVSection title="Additional Information"><ul className="space-y-2 text-sm text-slate-700">{cv.additional_information.map((item, index) => <li key={`${item}-${index}`}>• {item}</li>)}</ul></CVSection>}
                  </>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function CVSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-7">
      <div className="mb-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">{title}</h2>
        <div className="h-px flex-1 bg-slate-200" />
      </div>
      {children}
    </section>
  );}


function EmptySection({ text }: { text: string }) {
  return <p className="text-sm italic text-slate-400">{text}</p>;
}