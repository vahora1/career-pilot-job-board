"use client";

import Link from "next/link";
import DashboardHeader from "./components/DashboardHeader";
import DashboardSidebar from "./components/DashboardSidebar";
import MasterCVCard from "./components/MasterCVCard";
import ProfileCard from "./components/ProfileCard";
import RecommendedJobCard from "./components/RecommendedJobCard";
import StatCard from "./components/StatCard";
const jobs = [
  {
    initials: "AT",
    title: "Data Scientist",
    company: "ABC Technologies",
    match: 89,
    location: "Dubai, UAE",
    salary: "AED 18,000 – 22,000",
    tags: ["Python", "SQL", "Machine Learning", "AWS"],
  },
  {
    initials: "XT",
    title: "ML Engineer",
    company: "XYZ Technologies",
    match: 84,
    location: "Dubai, UAE",
    salary: "AED 20,000 – 28,000",
    tags: ["Python", "TensorFlow", "AWS"],
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900">
      <DashboardSidebar />

      <div className="lg:pl-64">
        <DashboardHeader />

        <main className="mx-auto max-w-[1440px] px-5 py-6 sm:px-8">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon="💼" value="47" label="Jobs Matched" detail="+12 this week" iconClass="bg-indigo-50" />
            <StatCard icon="📋" value="4" label="Applications" detail="3 in progress" iconClass="bg-emerald-50" />
            <StatCard icon="◉" value="18" label="Profile Views" detail="+5 today" iconClass="bg-amber-50" />
            <StatCard icon="🎯" value="83%" label="Avg Match" detail="Above average" iconClass="bg-violet-50" />
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-2">
            <ProfileCard />
            <MasterCVCard />
          </section>

          <section className="mt-7">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-slate-900">Recommended Jobs</h2>
                <p className="mt-0.5 text-xs text-slate-400">Based on your profile and preferences</p>
              </div>
              <Link href="/jobs" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                View all jobs →
              </Link>
            </div>

            <div className="space-y-3">
              {jobs.map((job) => (
                <RecommendedJobCard key={`${job.company}-${job.title}`} job={job} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
