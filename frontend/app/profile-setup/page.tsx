
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileSetupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    targetRole: "",
    location: "Dubai, UAE",
    experience: "",
    workPreference: "Any",
    industry: "",
  });

  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.targetRole || !form.location || !form.experience) {
      setError("Please complete all required fields.");
      return;
    }

    // Demo only: stores profile details in this browser.
    // Connect this to your backend when registration is implemented.
    localStorage.setItem("careerpilot_profile", JSON.stringify(form));

    router.push("/");
  }

  return (
    <main className="min-h-screen bg-[#f7f6fc] flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-3xl">

        <header className="flex justify-between items-center mb-10">
          <a href="/landing" className="text-2xl font-bold text-[#39216c]">
            CareerPilot<span className="text-[#9470e8]">.</span>
          </a>
          <span className="text-sm text-gray-500">Step 1 of 1</span>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7 md:p-12">

          <div className="mb-8">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-2xl mb-5">
              ✨
            </div>

            <p className="text-sm font-semibold text-[#7953c6] mb-2">
              LET'S PERSONALISE YOUR EXPERIENCE
            </p>

            <h1 className="text-3xl md:text-4xl font-bold text-[#21183c] mb-3">
              Welcome to CareerPilot
            </h1>

            <p className="text-gray-500 leading-relaxed">
              Tell us a little about your career goals. We'll use this
              information to help you discover relevant opportunities
              and make your job search more focused.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                What job are you looking for? *
              </label>
              <input
                name="targetRole"
                value={form.targetRole}
                onChange={handleChange}
                placeholder="e.g. Data Analyst, Software Engineer"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Preferred job location *
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Dubai, UAE"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                How much experience do you have? *
              </label>
              <select
                name="experience"
                value={form.experience}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-white outline-none focus:border-purple-500"
              >
                <option value="">Select experience level</option>
                <option value="Entry level">Entry level (0–1 years)</option>
                <option value="Junior">Junior (1–3 years)</option>
                <option value="Mid level">Mid level (3–5 years)</option>
                <option value="Senior">Senior (5–8 years)</option>
                <option value="Expert">Expert (8+ years)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Preferred work arrangement
              </label>
              <select
                name="workPreference"
                value={form.workPreference}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-white outline-none focus:border-purple-500"
              >
                <option value="Any">Any arrangement</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Preferred industry
              </label>
              <select
                name="industry"
                value={form.industry}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-white outline-none focus:border-purple-500"
              >
                <option value="">Choose an industry (optional)</option>
                <option value="Technology">Technology</option>
                <option value="Banking and Finance">Banking & Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Consulting">Consulting</option>
                <option value="Retail and E-commerce">Retail & E-commerce</option>
                <option value="Energy">Energy</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-[#6941c6] hover:bg-[#5632a9] text-white font-semibold py-4 transition"
            >
              Complete Setup & Continue →
            </button>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full text-sm text-gray-500 hover:text-purple-700 py-2"
            >
              Skip for now
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Your career information helps CareerPilot personalise your job search.
        </p>
      </div>
    </main>
  );
}
