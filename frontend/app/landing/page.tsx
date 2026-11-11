
"use client";

import { useState } from "react";

const locations = ["UAE", "Dubai", "Abu Dhabi", "Saudi Arabia", "Qatar"];
const industries = ["Technology", "Data & Analytics", "Finance", "Engineering"];

const features = [
  {
    icon: "✦",
    title: "AI CV Tailoring",
    description:
      "Create job-specific CVs that highlight the right skills and experience for every opportunity.",
  },
  {
    icon: "▱",
    title: "Smart Job Matches",
    description:
      "Discover relevant opportunities based on your profile, skills and career preferences.",
  },
  {
    icon: "✓",
    title: "Application Tracking",
    description:
      "Keep track of applications, statuses and next steps in one organised place.",
  },
];

const resources = [
  {
    icon: "↗",
    title: "Salary Insights",
    description: "Explore salary trends across roles and industries.",
  },
  {
    icon: "▤",
    title: "CV Guidance",
    description: "Tips and best practices to build a standout CV.",
  },
  {
    icon: "✧",
    title: "Career Advice",
    description: "Practical insights to help you grow your career.",
  },
];

export default function HomePage() {
  const [activeLocation, setActiveLocation] = useState("UAE");
  const [activeIndustry, setActiveIndustry] = useState("Technology");

  return (
    <main className="min-h-screen overflow-hidden bg-[#fffefd] text-[#17172f]">
      {/* Navigation */}
      <header className="relative z-20 border-b border-[#eee9f5] bg-white/90">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between px-6 py-4 lg:px-10">
          <a href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#883cf5] to-[#5115b8] text-2xl text-white shadow-lg shadow-purple-200">
              ✦
            </span>
            <span className="text-[25px] font-bold tracking-tight">
              Career<span className="text-[#7028d9]">Pilot</span>
            </span>
          </a>

          <nav className="hidden items-center gap-9 text-sm font-semibold text-[#30304b] lg:flex">
            <a href="/jobs" className="transition hover:text-purple-700">Jobs</a>
            <a href="#features" className="transition hover:text-purple-700">Career Tools⌄</a>
            <a href="#resources" className="transition hover:text-purple-700">Career Insights⌄</a>
            <a href="#employers" className="transition hover:text-purple-700">For Employers</a>
          </nav>

          <div className="flex items-center gap-3">
            <a href="/login" className="hidden rounded-xl border border-[#d9c8ed] px-5 py-3 text-sm font-semibold transition hover:bg-purple-50 sm:inline-block">
              Log In
            </a>
            <a href="/signup" className="rounded-xl bg-[#6823c7] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-[#5116a9]">
              Get Started
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative isolate bg-gradient-to-br from-[#faf7ff] via-[#f8f4ff] to-[#f1e8ff]">
        <div className="pointer-events-none absolute -right-40 top-[-100px] -z-10 h-[570px] w-[570px] rounded-full bg-purple-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-[-100px] -z-10 h-[350px] w-[500px] rounded-full bg-white/80 blur-3xl" />

        <div className="mx-auto grid max-w-[1380px] items-center gap-12 px-6 py-16 lg:grid-cols-[1.12fr_0.88fr] lg:px-10 lg:py-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#6928b9]">
              <span className="text-base">✦</span>
              Your AI career companion
            </div>

            <h1 className="max-w-[700px] font-serif text-5xl font-bold leading-[1.1] tracking-tight text-[#17172f] md:text-6xl xl:text-[70px]">
              Find the right opportunity.
              <span className="mt-1 block text-[#762ccf]">
                Make your next move.
              </span>
            </h1>

            <p className="mt-6 max-w-[590px] text-lg leading-8 text-[#55536f]">
              Discover relevant jobs, tailor your CV with AI, and track your
              applications — all in one place.
            </p>

            {/* Job Search */}
            <form
              action="/jobs"
              method="GET"
              className="mt-9 flex flex-col gap-2 rounded-2xl border border-purple-100 bg-white p-3 shadow-[0_15px_45px_rgba(74,36,120,0.12)] sm:flex-row"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                <span className="text-2xl text-[#7950a7]">⌕</span>
                <input
                  name="search"
                  placeholder="Job title or keyword"
                  className="h-12 w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-[#9290a6]"
                />
              </div>

              <div className="hidden w-px bg-[#eee8f5] sm:block" />

              <div className="flex items-center gap-3 px-3 sm:w-[190px]">
                <span className="text-xl text-[#7950a7]">⌖</span>
                <select
                  name="location"
                  className="h-12 w-full bg-transparent text-sm text-[#55536f] outline-none"
                  defaultValue=""
                >
                  <option value="" disabled>Location</option>
                  <option>UAE</option>
                  <option>Dubai</option>
                  <option>Abu Dhabi</option>
                  <option>Saudi Arabia</option>
                  <option>Qatar</option>
                </select>
              </div>

              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-[#762bd1] to-[#5315ad] px-8 py-4 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Search Jobs →
              </button>
            </form>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-[#68647e]">
              <span className="mr-1 font-semibold">Popular searches:</span>
              {["Data Scientist", "ML Engineer", "Business Analyst", "Project Manager"].map((job) => (
                <a
                  key={job}
                  href={`/jobs?search=${encodeURIComponent(job)}`}
                  className="rounded-full border border-[#ded0ed] bg-white/70 px-3 py-2 transition hover:border-purple-400 hover:bg-white hover:text-purple-700"
                >
                  {job}
                </a>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium text-[#45415f]">
              <span>✓ AI-powered CVs</span>
              <span>✓ Relevant job matches</span>
              <span>✓ Application tracking</span>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative mx-auto w-full max-w-[590px]">
            <div className="absolute inset-8 rounded-full bg-[#d9c2ff]/60 blur-3xl" />

            <div className="relative rotate-[0.5deg] rounded-[22px] border-[7px] border-[#25243b] bg-[#25243b] p-1 shadow-[0_30px_65px_rgba(49,24,83,0.24)]">
              <div className="grid min-h-[345px] overflow-hidden rounded-xl bg-white sm:grid-cols-[135px_1fr]">
                <aside className="hidden bg-[#191a35] p-4 text-white sm:block">
                  <div className="mb-8 flex items-center gap-2 text-xs font-bold">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600">✦</span>
                    CareerPilot
                  </div>
                  <p className="mb-3 text-[9px] uppercase tracking-widest text-slate-400">Workspace</p>
                  {["Dashboard", "Jobs", "My CVs", "Applications", "Saved Jobs", "Settings"].map((item, i) => (
                    <div key={item} className={`mb-2 rounded-lg px-2 py-2 text-[10px] ${i === 0 ? "bg-purple-700 text-white" : "text-slate-300"}`}>
                      {["▦", "⌕", "▤", "✓", "☆", "⚙"][i]}　{item}
                    </div>
                  ))}
                </aside>

                <div className="bg-[#faf9fd] p-4 sm:p-5">
                  <div className="mb-5">
                    <p className="text-lg font-bold">Welcome back!</p>
                    <p className="text-xs text-[#77748d]">Here's your career overview.</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      ["12", "Matching Jobs", "▣"],
                      ["4", "Applications", "▤"],
                      ["3", "Tailored CVs", "♙"],
                    ].map(([number, title, icon]) => (
                      <div key={title} className="rounded-xl border border-[#eee9f6] bg-white p-3 shadow-sm">
                        <span className="text-lg text-purple-600">{icon}</span>
                        <p className="mt-1 text-2xl font-bold">{number}</p>
                        <p className="mt-1 text-[9px] text-[#77748d]">{title}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-xl border border-[#eee9f6] bg-white p-4 shadow-sm">
                    <p className="mb-4 text-sm font-bold">Recent Activity</p>
                    {[
                      ["✓", "CV tailored for Data Scientist", "2 hours ago"],
                      ["➤", "Applied to ML Engineer at TechCorp", "5 hours ago"],
                      ["▣", "New job match: Data Analyst", "Yesterday"],
                    ].map(([icon, title, time], i) => (
                      <div key={title} className={`flex items-center gap-3 py-3 ${i !== 2 ? "border-b border-[#f0edf5]" : ""}`}>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-purple-700">{icon}</span>
                        <div className="min-w-0">
                          <p className="truncate text-[10px] font-semibold">{title}</p>
                          <p className="mt-1 text-[9px] text-[#88859a]">{time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-auto -mt-1 h-3 w-[108%] -translate-x-[4%] rounded-b-[50%] bg-gradient-to-b from-[#aaa5b9] to-[#eeeaf3] shadow-lg" />
            <div className="mx-auto h-2 w-[35%] rounded-b-xl bg-[#d4cedf]" />
          </div>
        </div>
      </section>

      {/* Employer Strip */}
      <section id="employers" className="border-y border-[#eeeaf3] bg-white">
        <div className="mx-auto flex max-w-[1380px] flex-col items-center justify-between gap-6 px-6 py-7 md:flex-row lg:px-10">
          <p className="max-w-[190px] text-sm font-bold leading-5 text-[#55516d]">
            Connecting talent with opportunities across the region
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-lg font-bold tracking-tight text-[#9892a7]">
            <span>◈ Emiratech</span>
            <span>⌁ NovaBank</span>
            <span>◉ GulfEnergy</span>
            <span>▥ Maktoum Group</span>
            <span>◉ SkyWorks</span>
          </div>
        </div>
      </section>

      {/* Explore */}
      <section className="mx-auto max-w-[1380px] px-6 py-16 lg:px-10 lg:py-20">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#782dce]">Explore opportunities</p>
          <h2 className="mt-3 font-serif text-4xl font-bold tracking-tight md:text-5xl">
            Find work that moves you forward.
          </h2>
          <p className="mt-4 text-[#747087]">
            Browse opportunities by location and industry.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-5 rounded-2xl border border-[#eee8f5] bg-[#fcfaff] p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 text-sm font-bold">Browse by Location</span>
            {locations.map((location) => (
              <button
                key={location}
                onClick={() => setActiveLocation(location)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                  activeLocation === location
                    ? "border-purple-300 bg-[#f0e5ff] text-purple-800"
                    : "border-[#e5ddeb] bg-white text-[#55516d] hover:border-purple-300"
                }`}
              >
                {location}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 text-sm font-bold">Industry</span>
            {industries.map((industry) => (
              <button
                key={industry}
                onClick={() => setActiveIndustry(industry)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                  activeIndustry === industry
                    ? "border-purple-300 bg-[#f0e5ff] text-purple-800"
                    : "border-[#e5ddeb] bg-white text-[#55516d] hover:border-purple-300"
                }`}
              >
                {industry}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 text-right text-xs text-[#8a849b]">
          Selected: {activeIndustry} · {activeLocation}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-[#faf8fd] py-16 lg:py-20">
        <div className="mx-auto max-w-[1380px] px-6 lg:px-10">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#782dce]">The CareerPilot advantage</p>
            <h2 className="mt-3 font-serif text-4xl font-bold md:text-5xl">
              More than a job search.
            </h2>
            <p className="mt-4 text-[#747087]">
              Everything you need to stand out, get matched and stay organised.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="group rounded-2xl border border-[#eae2f2] bg-white p-7 shadow-[0_5px_20px_rgba(60,35,90,0.035)] transition hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f1e7ff] text-3xl text-[#742acb] transition group-hover:bg-[#742acb] group-hover:text-white">
                  {feature.icon}
                </div>
                <h3 className="mt-6 font-serif text-2xl font-bold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#747087]">{feature.description}</p>
                <a href="/register" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#7028c6]">
                  Explore feature <span>→</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section id="resources" className="mx-auto max-w-[1380px] px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_2fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#782dce]">Learn and grow</p>
            <h2 className="mt-3 font-serif text-4xl font-bold">Career Resources</h2>
            <p className="mt-4 max-w-sm leading-7 text-[#747087]">
              Useful insights and tools to help you make your next career move with confidence.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {resources.map((resource) => (
              <a key={resource.title} href="/register" className="flex items-start gap-4 rounded-2xl border border-[#eee8f5] bg-white p-5 transition hover:border-purple-300 hover:shadow-lg">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f2eaff] text-2xl text-purple-700">
                  {resource.icon}
                </span>
                <span>
                  <span className="block font-bold">{resource.title}</span>
                  <span className="mt-2 block text-xs leading-5 text-[#77738a]">{resource.description}</span>
                  <span className="mt-3 block text-sm font-bold text-purple-700">Explore →</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-12 lg:px-10">
        <div className="relative mx-auto flex max-w-[1300px] flex-col items-center justify-between gap-7 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#5b1bb0] via-[#7124c9] to-[#4b178f] px-8 py-12 text-white shadow-xl shadow-purple-200 md:flex-row md:px-14">
          <div className="absolute -right-16 -top-32 h-80 w-80 rounded-full border-[45px] border-white/5" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-200">Your next chapter starts here</p>
            <h2 className="mt-3 font-serif text-3xl font-bold md:text-4xl">
              Ready to take control of your career?
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-purple-100">
              Make your job search smarter with AI-powered CVs, relevant opportunities and one organised workspace.
            </p>
          </div>
          <a href="/register" className="relative shrink-0 rounded-xl bg-white px-7 py-4 text-sm font-bold text-[#5b1bb0] shadow-lg transition hover:-translate-y-1">
            Get Started Free →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#eee9f3] bg-white">
        <div className="mx-auto flex max-w-[1380px] flex-col items-center justify-between gap-5 px-6 py-8 text-sm text-[#77738a] md:flex-row lg:px-10">
          <a href="/" className="text-lg font-bold text-[#17172f]">
            ✦ Career<span className="text-purple-700">Pilot</span>
          </a>
          <p>© {new Date().getFullYear()} CareerPilot. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-purple-700">Privacy</a>
            <a href="/terms" className="hover:text-purple-700">Terms</a>
            <a href="/contact" className="hover:text-purple-700">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
