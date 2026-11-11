
"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);

  return (
    <main className="flex min-h-screen bg-[#faf8fd]">
      {/* Left panel */}
      <section className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#21153f] via-[#402078] to-[#702bc4] p-12 text-white lg:flex">
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full border-[55px] border-white/5" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-purple-400/20 blur-3xl" />

        <Link href="/landing" className="relative flex items-center gap-3 text-2xl font-bold">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-2xl">✦</span>
          CareerPilot
        </Link>

        <div className="relative max-w-lg">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-purple-200">
            Your next chapter starts here
          </p>
          <h1 className="font-serif text-5xl font-bold leading-tight">
            Your career deserves a smarter direction.
          </h1>
          <p className="mt-6 text-lg leading-8 text-purple-100">
            Find opportunities, create tailored CVs with AI, and manage your
            career journey — all in one place.
          </p>

          <div className="mt-10 space-y-5">
            {[
              "Discover opportunities that match your skills",
              "Create tailored CVs with AI assistance",
              "Keep your applications organised",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-purple-50">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-purple-200">
          © {new Date().getFullYear()} CareerPilot. All rights reserved.
        </p>
      </section>

      {/* Signup form */}
      <section className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-[440px]">
          <Link href="/landing" className="mb-10 flex items-center gap-2 text-xl font-bold text-[#21153f] lg:hidden">
            <span className="text-purple-700">✦</span> CareerPilot
          </Link>

          <div className="mb-8">
            <p className="text-sm font-semibold text-[#762ccf]">GET STARTED FOR FREE</p>
            <h2 className="mt-3 font-serif text-4xl font-bold tracking-tight text-[#21153f]">
              Create your account
            </h2>
            <p className="mt-3 text-sm text-[#77738a]">
              Start building your next career opportunity today.
            </p>
          </div>

          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (!accepted) return;
              alert("Signup form UI is ready. Connect your registration API to create accounts.");
            }}
          >
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#302b48]">
                Full name
              </label>
              <input
                required
                type="text"
                placeholder="Enter your full name"
                className="h-12 w-full rounded-xl border border-[#e3ddec] bg-white px-4 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#302b48]">
                Email address
              </label>
              <input
                required
                type="email"
                placeholder="you@example.com"
                className="h-12 w-full rounded-xl border border-[#e3ddec] bg-white px-4 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#302b48]">
                Password
              </label>
              <div className="relative">
                <input
                  required
                  minLength={8}
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password (min. 8 characters)"
                  className="h-12 w-full rounded-xl border border-[#e3ddec] bg-white px-4 pr-16 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-purple-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#77738a]">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 accent-purple-700"
              />
              <span>
                I agree to the{" "}
                <Link href="/terms" className="font-semibold text-purple-700">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="font-semibold text-purple-700">Privacy Policy</Link>.
              </span>
            </label>

            <button
              type="submit"
              disabled={!accepted}
              className="h-13 w-full rounded-xl bg-gradient-to-r from-[#762bd1] to-[#5315ad] py-4 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              Create Account →
            </button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#e8e2ef]" />
            <span className="text-xs text-[#9993a8]">ALREADY HAVE AN ACCOUNT?</span>
            <div className="h-px flex-1 bg-[#e8e2ef]" />
          </div>

          <p className="text-center text-sm text-[#77738a]">
            Already registered?{" "}
            <Link href="/login" className="font-bold text-purple-700 hover:text-purple-900">
              Log in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
