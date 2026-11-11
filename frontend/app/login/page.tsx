
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter your email address and password.");
      return;
    }

    // Demo only. Connect this form to the backend login API.
    setError("Login is not connected yet. Backend authentication is required.");
  }

  return (
    <main className="min-h-screen bg-[#f7f6fc] flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-6xl grid md:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">

        {/* Left branding panel */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-[#281747] via-[#493078] to-[#7651b8] p-12 text-white">
          <a href="/landing" className="text-3xl font-bold">
            CareerPilot<span className="text-[#c9b5ff]">.</span>
          </a>

          <div>
            <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center text-3xl mb-8">
              ✦
            </div>

            <h1 className="text-4xl font-bold leading-tight mb-5">
              Your next career move starts here.
            </h1>

            <p className="text-purple-100 text-lg leading-relaxed">
              Discover opportunities, tailor your CV with AI and manage your
              job applications in one place.
            </p>

            <div className="mt-10 space-y-4 text-sm text-purple-100">
              <p>✓ AI-powered CV tailoring</p>
              <p>✓ Smarter job recommendations</p>
              <p>✓ Organised application tracking</p>
            </div>
          </div>

          <p className="text-sm text-purple-200">
            Take control of your career journey.
          </p>
        </div>

        {/* Login form */}
        <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-16">

          <a href="/landing" className="md:hidden text-2xl font-bold text-[#39216c] mb-12">
            CareerPilot<span className="text-[#9470e8]">.</span>
          </a>

          <div className="mb-9">
            <p className="text-sm font-semibold text-[#7953c6] mb-3">
              WELCOME BACK
            </p>

            <h2 className="text-3xl font-bold text-[#21183c] mb-3">
              Sign in to your account
            </h2>

            <p className="text-gray-500">
              Enter your details to continue your career journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="text-sm font-medium text-[#7953c6] hover:text-[#5632a9]"
                >
                  Forgot password?
                </a>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3.5 pr-20 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#7953c6]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-[#6941c6]"
              />
              Remember me
            </label>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-[#6941c6] hover:bg-[#5632a9] text-white font-semibold py-4 transition shadow-md shadow-purple-200"
            >
              Sign In →
            </button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">NEW TO CAREERPILOT?</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <a
            href="/signup"
            className="w-full text-center rounded-xl border border-[#6941c6] text-[#6941c6] font-semibold py-4 hover:bg-purple-50 transition"
          >
            Create an Account
          </a>

          <p className="text-center text-xs text-gray-400 mt-9">
            By continuing, you agree to our{" "}
            <a href="/terms" className="underline">Terms</a>
            {" "}and{" "}
            <a href="/privacy" className="underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
