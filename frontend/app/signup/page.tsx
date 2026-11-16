
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function SignupPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!accepted) {
      setError("Please accept the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Registration failed. Please try again."
        );
      }

      // Store non-sensitive profile details for the next setup step.
      localStorage.setItem(
        "careerpilot_profile",
        JSON.stringify({
          fullName: data.user.full_name,
          email: data.user.email,
          userId: data.user.id,
        })
      );

      router.push("/profile-setup");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen bg-[#F7F5FF]">
      {/* Left panel */}
      <section className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#EEE8FF] via-[#DCCEFF] to-[#B99AEF] p-12 text-[#39265F] lg:flex">
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full border-[55px] border-white/30" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-white/30 blur-3xl" />

        <Link
          href="/landing"
          className="relative flex items-center gap-3 text-2xl font-bold"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/50 text-2xl">
            ✦
          </span>
          CareerPilot
        </Link>

        <div className="relative max-w-lg">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#7450B5]">
            Your next chapter starts here
          </p>

          <h1 className="font-serif text-5xl font-bold leading-tight">
            Your career deserves a smarter direction.
          </h1>

          <p className="mt-6 text-lg leading-8 text-[#51436E]">
            Find opportunities, create tailored CVs with AI, and manage your
            career journey — all in one place.
          </p>

          <div className="mt-10 space-y-5">
            {[
              "Discover opportunities that match your skills",
              "Create tailored CVs with AI assistance",
              "Keep your applications organised",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/60">
                  ✓
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-[#51436E]">
          © {new Date().getFullYear()} CareerPilot. All rights reserved.
        </p>
      </section>

      {/* Signup form */}
      <section className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-[440px]">

          <Link
            href="/landing"
            className="mb-10 flex items-center gap-2 text-xl font-bold text-[#39265F] lg:hidden"
          >
            <span className="text-[#8964CC]">✦</span> CareerPilot
          </Link>

          <div className="mb-8">
            <p className="text-sm font-semibold text-[#8964CC]">
              GET STARTED FOR FREE
            </p>

            <h2 className="mt-3 font-serif text-4xl font-bold tracking-tight text-[#39265F]">
              Create your account
            </h2>

            <p className="mt-3 text-sm text-[#77738A]">
              Start building your next career opportunity today.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#302B48]">
                Full name
              </label>

              <input
                required
                minLength={2}
                maxLength={150}
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="h-12 w-full rounded-xl border border-[#E5DDF5] bg-white px-4 text-sm outline-none transition focus:border-[#8964CC] focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#302B48]">
                Email address
              </label>

              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-12 w-full rounded-xl border border-[#E5DDF5] bg-white px-4 text-sm outline-none transition focus:border-[#8964CC] focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#302B48]">
                Password
              </label>

              <div className="relative">
                <input
                  required
                  minLength={8}
                  maxLength={128}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password (min. 8 characters)"
                  className="h-12 w-full rounded-xl border border-[#E5DDF5] bg-white px-4 pr-16 text-sm outline-none transition focus:border-[#8964CC] focus:ring-2 focus:ring-purple-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#8964CC]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#77738A]">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[#8964CC]"
              />

              <span>
                I agree to the{" "}
                <Link href="/terms" className="font-semibold text-[#8964CC]">
                  Terms of Service
                </Link>
                {" "}and{" "}
                <Link href="/privacy" className="font-semibold text-[#8964CC]">
                  Privacy Policy
                </Link>.
              </span>
            </label>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!accepted || loading}
              className="w-full rounded-xl bg-[#8964CC] py-4 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:bg-[#7450B5] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating your account..." : "Create Account →"}
            </button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#E5DDF5]" />
            <span className="text-xs text-[#9993A8]">
              ALREADY HAVE AN ACCOUNT?
            </span>
            <div className="h-px flex-1 bg-[#E5DDF5]" />
          </div>

          <p className="text-center text-sm text-[#77738A]">
            Already registered?{" "}
            <Link
              href="/login"
              className="font-bold text-[#8964CC] hover:text-[#7450B5]"
            >
              Log in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
